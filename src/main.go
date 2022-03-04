package main

import (
	"flag"
	"log"
	"os"
	"os/signal"

	"github.com/bwmarrin/discordgo"
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
	s, err = discordgo.New("Bot " + *BotToken)
	if err != nil {
		panic(err)
	}
}

var (
	commands = []*discordgo.ApplicationCommand{
		{
			Name:        "ping",
			Description: "A simple ping command.",
			Options: []*discordgo.ApplicationCommandOption{
				{
					Type:        discordgo.ApplicationCommandOptionString,
					Name:        "foo",
					Description: "A string option.",
					Required:    true,
				},
			},
		},
	}
	commandHandlers = map[string]func(s *discordgo.Session, i *discordgo.InteractionCreate){
		"ping": func(s *discordgo.Session, i *discordgo.InteractionCreate) {
			s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Content: "Pong!",
				},
			})
		},
	}
)

func init() {
	s.AddHandler(func(s *discordgo.Session, i *discordgo.InteractionCreate) {
		if h, ok := commandHandlers[i.ApplicationCommandData().Name]; ok {
			h(s, i)
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
		}
		registeredCommand[i] = cmd
	}

	defer s.Close()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)
	log.Println("Bot is running. Press CTRL-C to exit.")
	<-stop

	if *RemoveCommand {
		log.Println("Removing commands...")
		for _, c := range registeredCommand {
			err := s.ApplicationCommandDelete(s.State.User.ID, *GuildId, c.ID)
			if err != nil {
				log.Fatalf("Cannot delete command: %v", err)
			}
		}
	}

	log.Println("Bot is shutting down...")
}
