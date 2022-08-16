import { CacheType, ChatInputCommandInteraction } from "discord.js";
import upcoming from "../api/upcoming";

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {
  await interaction.deferReply();

  const result = await upcoming();
  await interaction.editReply({
    content: result,
  });
}
