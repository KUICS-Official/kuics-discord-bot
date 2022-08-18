import { ButtonInteraction, CacheType } from "discord.js";
import noticeHandler from "../common/noticeHandler";
import ctfDetail from "../../api/ctfDetail";
import { LoggingMeta } from "../../log/loggingMeta";

export default async (requestId: string, interaction: ButtonInteraction<CacheType>) => {
  await interaction.deferReply();

  try {
    const urlSplited = interaction.message.embeds[0].url.split("/")
    const ctfId = urlSplited[urlSplited.length - 1];
    const detail = await ctfDetail(requestId, ctfId);
    
    await noticeHandler(interaction, detail);
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
