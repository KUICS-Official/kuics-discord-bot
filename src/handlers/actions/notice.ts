import { ButtonInteraction, CacheType } from "discord.js";
import noticeHandler from "../common/noticeHandler";
import ctfDetail from "../../api/ctfDetail";

export default async (interaction: ButtonInteraction<CacheType>) => {
  await interaction.deferReply();

  const urlSplited = interaction.message.embeds[0].url.split("/")
  const ctfId = urlSplited[urlSplited.length - 1];
  const detail = await ctfDetail(ctfId);
  
  await noticeHandler(interaction, detail);
}
