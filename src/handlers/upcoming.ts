import { CacheType, ChatInputCommandInteraction } from "discord.js";

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {
  await interaction.reply("upcoming...");
}
