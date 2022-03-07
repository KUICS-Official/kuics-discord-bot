package cmd

import (
	"fmt"

	"github.com/bwmarrin/discordgo"
	"kuics.ac.kr/discordbot/internal/ctfapi"
)

func Upcoming(s *discordgo.Session, i *discordgo.InteractionCreate) {
	limit := i.ApplicationCommandData().Options[0].IntValue()
	ctfSummaries := ctfapi.GetUpcomingByCount(int(limit))

	s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseDeferredChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Content: "CTF 정보를 가져오는 중 입니다.",
		},
	})
	for _, ctfSummary := range ctfSummaries {
		s.ChannelMessageSendComplex(i.ChannelID, &discordgo.MessageSend{
			Components: []discordgo.MessageComponent{
				discordgo.ActionsRow{
					Components: []discordgo.MessageComponent{
						discordgo.Button{
							Label:    "참가공지",
							Style:    discordgo.PrimaryButton,
							CustomID: "notice",
						},
					},
				},
			},
			Embeds: []*discordgo.MessageEmbed{
				{
					Title:       ctfSummary.Name,
					Description: ctfSummary.Start + " ~ " + ctfSummary.Finish,
					URL:         ctfSummary.CtfTimeUrl,
					Fields: []*discordgo.MessageEmbedField{
						{
							Name:  "Weight",
							Value: fmt.Sprintf("%.2f", ctfSummary.Weight),
						},
					},
				},
			},
		})
	}
	s.InteractionResponseEdit(s.State.User.ID, i.Interaction, &discordgo.WebhookEdit{
		Content: "CTF 정보를 가져왔습니다.",
	})
}
