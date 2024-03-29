import { ButtonInteraction, CacheType, GuildMemberRoleManager, MessageFlags } from "discord.js";
import { LoggingMeta } from "../../log/loggingMeta";

export default async (requestId: string, interaction: ButtonInteraction<CacheType>) => {
  try {
    const roleId = interaction.message.embeds[0].footer.text;
    const ctfTitle = interaction.message.embeds[0].title;

    await (interaction.member.roles as GuildMemberRoleManager).add(roleId);
    await interaction.reply({
      content: `${ctfTitle} 참여 신청이 완료되었어요`,
      flags: MessageFlags.Ephemeral,
    });
  } catch (error) {
    await interaction.reply({
      content: (new LoggingMeta(
        requestId,
        "error",
        error.message,
      )).toString(),
    });
  }
}
