package cmd

import (
	"fmt"
	"log"
	"time"

	"github.com/bwmarrin/discordgo"
	"kuics.ac.kr/discordbot/internal/ctfapi"
)

func Notice(s *discordgo.Session, i *discordgo.InteractionCreate, id string) {
	perm, _ := s.UserChannelPermissions(i.Member.User.ID, i.ChannelID)

	if perm&discordgo.PermissionAdministrator == discordgo.PermissionAdministrator {
		ctfInfo := ctfapi.GetDetailById(id)

		err := s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseDeferredChannelMessageWithSource,
		})
		if err != nil {
			log.Fatalf("Failed to ACK: %v", err)
		}

		role, err := s.GuildRoleCreate(i.GuildID)
		if err != nil {
			log.Fatalf("Failed to create role: %v", err)
		}

		_, err = s.GuildRoleEdit(i.GuildID, role.ID, ctfInfo.Summary.Name, 0, false, 0, true)
		if err != nil {
			log.Fatalf("Failed to edit role: %v", err)
		}

		_, err = s.GuildChannelCreateComplex(i.GuildID, discordgo.GuildChannelCreateData{
			Name:  ctfInfo.Summary.Name,
			Type:  discordgo.ChannelTypeGuildText,
			Topic: ctfInfo.Url,
			PermissionOverwrites: []*discordgo.PermissionOverwrite{
				{
					ID:    role.ID,
					Type:  discordgo.PermissionOverwriteTypeRole,
					Allow: discordgo.PermissionAll,
				},
			},
		})
		if err != nil {
			log.Fatalf("Failed to create text channel: %v", err)
		}

		channel_voice, err := s.GuildChannelCreateComplex(i.GuildID, discordgo.GuildChannelCreateData{
			Name: ctfInfo.Summary.Name,
			Type: discordgo.ChannelTypeGuildVoice,
			PermissionOverwrites: []*discordgo.PermissionOverwrite{
				{
					ID:    role.ID,
					Type:  discordgo.PermissionOverwriteTypeRole,
					Allow: discordgo.PermissionAll,
				},
			},
		})
		if err != nil {
			log.Fatalf("Failed to create voice channel: %v", err)
		}

		start, _ := time.Parse(time.RFC3339, ctfInfo.Summary.Start)
		finish, _ := time.Parse(time.RFC3339, ctfInfo.Summary.Finish)
		_, err = s.GuildScheduledEventCreate(i.GuildID, &discordgo.GuildScheduledEventParams{
			ChannelID:          channel_voice.ID,
			Name:               ctfInfo.Summary.Name,
			Description:        ctfInfo.Description,
			ScheduledStartTime: &start,
			ScheduledEndTime:   &finish,
			PrivacyLevel:       discordgo.GuildScheduledEventPrivacyLevelGuildOnly,
			Status:             discordgo.GuildScheduledEventStatusActive,
			EntityType:         discordgo.GuildScheduledEventEntityTypeVoice,
		})
		if err != nil {
			log.Fatalf("Failed to create event: %v", err)
		}

		_, err = s.InteractionResponseEdit(s.State.User.ID, i.Interaction, &discordgo.WebhookEdit{
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
		})
		if err != nil {
			log.Fatalf("Failed to send message: %v", err)
		}
	} else {
		log.Println("Permission denied: " + i.Member.User.Username)
	}
}
