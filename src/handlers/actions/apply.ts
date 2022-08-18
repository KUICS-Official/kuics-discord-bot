import { ButtonInteraction, CacheType, GuildMemberRoleManager, MessageFlags } from "discord.js";

export default async (interaction: ButtonInteraction<CacheType>) => {
  const roleId = interaction.message.embeds[0].footer.text;
  const ctfTitle = interaction.message.embeds[0].title;

  await (interaction.member.roles as GuildMemberRoleManager).add(roleId);
  await interaction.reply({
    content: `${ctfTitle} 참여 신청이 완료되었습니다.`,
    flags: MessageFlags.Ephemeral,
  });
}
