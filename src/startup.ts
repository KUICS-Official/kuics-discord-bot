import { Client } from "discord.js";
import upcomingCommand from "./handlers/commands/upcoming";
import noticeCommand from "./handlers/actions/notice";
import noticeAction from "./handlers/actions/notice";
import applyAction from "./handlers/actions/apply";

export default (client: Client<boolean>) => {
  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
  });

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
      switch (interaction.commandName) {
        case "upcoming":
          await upcomingCommand(interaction);
          break;
        case "notice":
          await noticeCommand(interaction);
          break;
      }
    }

    if (interaction.isButton()) {
      switch (interaction.customId) {
        case "notice":
          await noticeAction(interaction);
          break;
        case "apply":
          await applyAction(interaction);
          break;
      }
    }
  })
}
