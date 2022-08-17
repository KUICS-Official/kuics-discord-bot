import { Client } from "discord.js";
import upcoming from "./handlers/upcoming";
import notice from "./handlers/notice";
import apply from "./handlers/apply";

export default (client: Client<boolean>) => {
  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
  });

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
      switch (interaction.commandName) {
        case "upcoming":
          await upcoming(interaction);
          break;
      }
    }

    if (interaction.isButton()) {
      switch (interaction.customId) {
        case "notice":
          await notice(interaction);
          break;
        case "apply":
          await apply(interaction);
          break;
      }
    }
  })
}
