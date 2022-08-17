import { CacheType, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import upcoming from "../api/upcoming";

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {
  await interaction.deferReply();

  try {
    const result = await upcoming(interaction.options.getInteger('limit'));
    await interaction.editReply({
      embeds: result.map((it) => ({
        title: it.name,
        description: `${it.start} ~ ${it.end}`,
        url: it.url,
        fields: [
          {
            name: "Weight",
            value: it.weight.toString(),
          }
        ],
      }))
    });
  } catch (error) {
    await interaction.editReply({
      content: error.message,
    });
  }
}
