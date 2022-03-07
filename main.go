package main

import (
	"flag"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"

	"github.com/bwmarrin/discordgo"
	"kuics.ac.kr/discordbot/cmd"
)

var (
	GuildId       = flag.String("guild", "", "Guild ID")
	BotToken      = flag.String("token", "", "Bot Token")
	RemoveCommand = flag.Bool("rmcmd", true, "Remove command after shutting down")
)

var s *discordgo.Session

func init() {
	flag.Parse()
}

func init() {
	var err error
	if *BotToken == "" {
		*BotToken = os.Getenv("DISCORD_BOT_TOKEN")
	}
	s, err = discordgo.New("Bot " + *BotToken)
	if err != nil {
		panic(err)
	}
}

var (
	integerOptionMinValue = 1.0

	commands = []*discordgo.ApplicationCommand{
		{
			Name:        "upcoming",
			Description: "다가오는 CTF 목록을 출력합니다.",
			Options: []*discordgo.ApplicationCommandOption{
				{
					Type:        discordgo.ApplicationCommandOptionInteger,
					Name:        "limit",
					Description: "출력할 최대 개수를 지정합니다.",
					MinValue:    &integerOptionMinValue,
					MaxValue:    100,
					Required:    true,
				},
			},
		},
		{
			Name:        "notice",
			Description: "CTF 참여 공지",
			Options: []*discordgo.ApplicationCommandOption{
				{
					Type:        discordgo.ApplicationCommandOptionString,
					Name:        "ctf_id",
					Description: "CTF ID (from ctftime.org)",
					Required:    true,
				},
			},
		},
	}
	commandHandlers = map[string]func(s *discordgo.Session, i *discordgo.InteractionCreate){
		"upcoming": cmd.Upcoming,
		"notice": func(s *discordgo.Session, i *discordgo.InteractionCreate) {
			id := i.ApplicationCommandData().Options[0].StringValue()
			cmd.Notice(s, i, id)
		},
	}
	componentHandlers = map[string]func(s *discordgo.Session, i *discordgo.InteractionCreate){
		"notice": func(s *discordgo.Session, i *discordgo.InteractionCreate) {
			url_slice := strings.Split(i.Message.Embeds[0].URL, "/")
			id_string := url_slice[len(url_slice)-1]
			cmd.Notice(s, i, id_string)
		},
		"apply": func(s *discordgo.Session, i *discordgo.InteractionCreate) {
			s.GuildMemberRoleAdd(i.GuildID, i.Member.User.ID, i.Message.Embeds[0].Footer.Text)
			s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Content: "`" + i.Message.Embeds[0].Title + "` 참여 신청이 완료되었습니다.",
					Flags:   1 << 6,
				},
			})
		},
	}
)

func init() {
	s.AddHandler(func(s *discordgo.Session, i *discordgo.InteractionCreate) {
		switch i.Type {
		case discordgo.InteractionApplicationCommand:
			if h, ok := commandHandlers[i.ApplicationCommandData().Name]; ok {
				h(s, i)
			}
		case discordgo.InteractionMessageComponent:
			if h, ok := componentHandlers[i.MessageComponentData().CustomID]; ok {
				h(s, i)
			}
		}
	})
}

func main() {
	s.AddHandler(func(s *discordgo.Session, r *discordgo.Ready) {
		log.Printf("Logged in as %v#%v", s.State.User.Username, s.State.User.Discriminator)
	})
	err := s.Open()
	if err != nil {
		log.Fatalf("Cannot open the session: %v", err)
	}

	log.Println("Adding commands...")
	registeredCommand := make([]*discordgo.ApplicationCommand, len(commands))
	for i, c := range commands {
		cmd, err := s.ApplicationCommandCreate(s.State.User.ID, *GuildId, c)
		if err != nil {
			log.Fatalf("Cannot create command: %v", err)
		} else {
			log.Printf("Registered command: %v", cmd.Name)
		}
		registeredCommand[i] = cmd
	}

	defer s.Close()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)
	log.Println("Bot is running. Press CTRL-C to exit.")
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})
	http.ListenAndServe(":"+os.Getenv("POST"), nil)
	<-stop

	if *RemoveCommand {
		log.Println("Removing commands...")
		for _, c := range registeredCommand {
			err := s.ApplicationCommandDelete(s.State.User.ID, *GuildId, c.ID)
			if err != nil {
				log.Fatalf("Cannot delete command: %v", err)
			} else {
				log.Printf("Removed command: %v", c.Name)
			}
		}
	}

	log.Println("Bot is shutting down...")
}
