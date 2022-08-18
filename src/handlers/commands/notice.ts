import { CacheType, ChatInputCommandInteraction } from "discord.js";
import ctfDetail from "../../api/ctfDetail";
import noticeHandler from "../common/noticeHandler";

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {
  await interaction.deferReply();

  const ctfId = interaction.options.getInteger("ctfid")!;
  const detail = await ctfDetail(ctfId.toString());

  await noticeHandler(interaction, detail);
}
