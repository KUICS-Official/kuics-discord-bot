import { APIActionRowComponent, APIButtonComponentWithCustomId, ButtonInteraction, ButtonStyle, CacheType, ChannelType, ChatInputCommandInteraction, ComponentType, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, OverwriteType, PermissionFlagsBits } from "discord.js";
import { CtfInfoDetail } from "../../dto/ctfInfoDetail";
import fetch from "node-fetch";

export default async (interaction: ChatInputCommandInteraction<CacheType> | ButtonInteraction<CacheType>, detail: CtfInfoDetail) => {
  const role = await interaction.guild.roles.create({
    name: detail.summary.name,
  });
  await interaction.guild.channels.create({
    name: detail.summary.name,
    type: ChannelType.GuildText,
    topic: detail.url,
    permissionOverwrites: [
      {
        id: role.id,
        type: OverwriteType.Role,
        allow: 
          PermissionFlagsBits.AddReactions |
          PermissionFlagsBits.ViewChannel |
          PermissionFlagsBits.SendMessages |
          PermissionFlagsBits.EmbedLinks |
          PermissionFlagsBits.AttachFiles |
          PermissionFlagsBits.ReadMessageHistory |
          PermissionFlagsBits.CreatePublicThreads |
          PermissionFlagsBits.UseExternalStickers |
          PermissionFlagsBits.SendMessagesInThreads |
          PermissionFlagsBits.UseEmbeddedActivities
      },
    ],
  });
  const voiceChannel = await interaction.guild.channels.create({
    name: detail.summary.name,
    type: ChannelType.GuildVoice,
    permissionOverwrites: [
      {
        id: role.id,
        type: OverwriteType.Role,
        allow: 
          PermissionFlagsBits.ViewChannel |
          PermissionFlagsBits.ReadMessageHistory |
          PermissionFlagsBits.Connect |
          PermissionFlagsBits.Speak |
          PermissionFlagsBits.RequestToSpeak
      },
    ],
  });
  let logoImage: Buffer;
  try {
    logoImage = await (await fetch(detail.logo)).buffer();
  } catch (error) {}

  await interaction.guild.scheduledEvents.create({
    name: detail.summary.name,
    scheduledStartTime: detail.startRaw,
    scheduledEndTime: detail.finishRaw,
    privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
    entityType: GuildScheduledEventEntityType.Voice,
    description: detail.description,
    channel: voiceChannel,
    image: logoImage,
  })
  
  const button: APIActionRowComponent<APIButtonComponentWithCustomId> = {
    components: [
      {
        label: "참가신청",
        style: ButtonStyle.Primary,
        custom_id: "apply",
        type: ComponentType.Button,
      },
    ],
    type: ComponentType.ActionRow,
  };
  await interaction.editReply({
    components: [button],
    embeds: [
      {
        title: detail.summary.name,
        description: detail.description,
        url: detail.url,
        thumbnail: {
          url: detail.logo,
        },
        fields: [
          {
            name: "Format",
            value: detail.summary.format,
          },
          {
            name: "Weight",
            value: detail.summary.weight.toString(),
          },
          {
            name: "Duration",
            value: `${detail.summary.start} ~ ${detail.summary.finish}\n${detail.duration.days}일 ${detail.duration.hours}시간`,
          },
        ],
        footer: {
          text: role.id,
        },
      },
    ],
  });
}
