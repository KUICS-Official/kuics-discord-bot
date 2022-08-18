import { Client, InteractionType } from "discord.js";
import upcomingCommand from "./handlers/commands/upcoming";
import noticeCommand from "./handlers/commands/notice";
import noticeAction from "./handlers/actions/notice";
import applyAction from "./handlers/actions/apply";
import console from "console";
import { ulid } from "ulid";

export default (client: Client<boolean>) => {
  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
  });

  client.on("interactionCreate", async (interaction) => {
    const requestId = ulid();
    
    console.debug(`${requestId}:interaction-type:${InteractionType[interaction.type]}`);

    if (interaction.isChatInputCommand()) {
      switch (interaction.commandName) {
        case "upcoming":
          await upcomingCommand(requestId, interaction);
          break;
        case "notice":
          await noticeCommand(requestId, interaction);
          break;
      }
    }

    if (interaction.isButton()) {
      switch (interaction.customId) {
        case "notice":
          await noticeAction(requestId, interaction);
          break;
        case "apply":
          await applyAction(requestId, interaction);
          break;
      }
    }
    console.debug(`${requestId}:interaction-end`);
  })
}
