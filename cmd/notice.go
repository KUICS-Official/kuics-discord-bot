package cmd

import (
	"fmt"
	"time"

	"github.com/bwmarrin/discordgo"
	"kuics.ac.kr/discordbot/internal/ctfapi"
)

func Notice(s *discordgo.Session, i *discordgo.InteractionCreate, id string) {
	ctfInfo := ctfapi.GetDetailById(id)

	role, _ := s.GuildRoleCreate(i.GuildID)
	s.GuildRoleEdit(i.GuildID, role.ID, ctfInfo.Summary.Name, 0, false, 0, true)
	s.GuildChannelCreateComplex(i.GuildID, discordgo.GuildChannelCreateData{
		Name:  ctfInfo.Summary.Name,
		Type:  discordgo.ChannelTypeGuildText,
		Topic: fmt.Sprintf("%s ~ %s", ctfInfo.Summary.Start, ctfInfo.Summary.Finish),
		PermissionOverwrites: []*discordgo.PermissionOverwrite{
			{
				ID:    role.ID,
				Type:  discordgo.PermissionOverwriteTypeRole,
				Allow: discordgo.PermissionAll,
			},
		},
	})
	channel_voice, _ := s.GuildChannelCreateComplex(i.GuildID, discordgo.GuildChannelCreateData{
		Name:  ctfInfo.Summary.Name,
		Type:  discordgo.ChannelTypeGuildVoice,
		Topic: fmt.Sprintf("%s ~ %s", ctfInfo.Summary.Start, ctfInfo.Summary.Finish),
		PermissionOverwrites: []*discordgo.PermissionOverwrite{
			{
				ID:    role.ID,
				Type:  discordgo.PermissionOverwriteTypeRole,
				Allow: discordgo.PermissionAll,
			},
		},
	})

	start, _ := time.Parse(time.RFC3339, ctfInfo.Summary.Start)
	finish, _ := time.Parse(time.RFC3339, ctfInfo.Summary.Finish)
	s.GuildScheduledEventCreate(i.GuildID, &discordgo.GuildScheduledEventParams{
		ChannelID:          channel_voice.ID,
		Name:               ctfInfo.Summary.Name,
		Description:        ctfInfo.Description,
		ScheduledStartTime: &start,
		ScheduledEndTime:   &finish,
		PrivacyLevel:       discordgo.GuildScheduledEventPrivacyLevelGuildOnly,
		Status:             discordgo.GuildScheduledEventStatusActive,
		EntityType:         discordgo.GuildScheduledEventEntityTypeVoice,
	})

	s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Components: []discordgo.MessageComponent{
				discordgo.ActionsRow{
					Components: []discordgo.MessageComponent{
						discordgo.Button{
							Label:    "참가신청",
							Style:    discordgo.PrimaryButton,
							CustomID: "apply",
						},
					},
				},
			},
			Embeds: []*discordgo.MessageEmbed{
				{
					Title:       ctfInfo.Summary.Name,
					Description: ctfInfo.Description,
					URL:         ctfInfo.Url,
					Thumbnail: &discordgo.MessageEmbedThumbnail{
						URL: ctfInfo.Logo,
					},
					Fields: []*discordgo.MessageEmbedField{
						{
							Name:  "Format",
							Value: ctfInfo.Format,
						},
						{
							Name:  "Weight",
							Value: fmt.Sprintf("%.2f", ctfInfo.Summary.Weight),
						},
						{
							Name:  "Duration",
							Value: fmt.Sprintf("%s ~ %s\n%d days %d hours", ctfInfo.Summary.Start, ctfInfo.Summary.Finish, ctfInfo.Duration.Days, ctfInfo.Duration.Hours),
						},
					},
					Footer: &discordgo.MessageEmbedFooter{
						Text: role.ID,
					},
				},
			},
		},
	})
}
