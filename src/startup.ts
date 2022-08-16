import { Client } from "discord.js";
import upcoming from "./handlers/upcoming";

export default (client: Client<boolean>) => {
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    switch (interaction.commandName) {
      case 'upcoming': await upcoming(interaction);
    }
  })
}
