import { CacheType, ChatInputCommandInteraction } from "discord.js";
import upcoming from "../api/upcoming";

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {
  await interaction.deferReply();

  try {
    const result = await upcoming(interaction.options.getInteger('limit'));
    await interaction.editReply({
      content: result,
    });
  } catch (error) {
    await interaction.editReply({
      content: error.message,
    });
  }
}
