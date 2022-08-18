import { Client, InteractionType } from "discord.js";
import upcomingCommand from "./handlers/commands/upcoming";
import noticeCommand from "./handlers/commands/notice";
import noticeAction from "./handlers/actions/notice";
import applyAction from "./handlers/actions/apply";
import console from "console";
import { ulid } from "ulid";
import { LoggingMeta } from "./log/loggingMeta";

export default (client: Client<boolean>) => {
  client.on("ready", () => {
    (new LoggingMeta(
      undefined,
      "startup",
      `Logged in as ${client.user.tag}`,
    )).log("info");
  });

  client.on("interactionCreate", async (interaction) => {
    const requestId = ulid();
      
    try {
      (new LoggingMeta(
        requestId,
        "start",
        InteractionType[interaction.type],
      )).log("debug");

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
      (new LoggingMeta(
        requestId,
        "end",
        InteractionType[interaction.type],
      )).log("debug");
    } catch (error) {
      (new LoggingMeta(
        requestId,
        "error",
        error.message,
      )).log("error");
    }
  })
}
