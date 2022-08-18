import { CacheType, ChatInputCommandInteraction } from "discord.js";
import ctfDetail from "../../api/ctfDetail";
import { LoggingMeta } from "../../log/loggingMeta";
import noticeHandler from "../common/noticeHandler";

export default async (requestId: string, interaction: ChatInputCommandInteraction<CacheType>) => {
  await interaction.deferReply();

  try {
    const ctfId = interaction.options.getInteger("ctfid")!;
    const detail = await ctfDetail(requestId, ctfId.toString());

    await noticeHandler(interaction, detail);
  } catch (error) {
    await interaction.editReply({
      content: (new LoggingMeta(
        requestId,
        "error",
        error.message,
      )).toString(),
    });
  }
}
