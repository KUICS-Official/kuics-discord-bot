import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import dotenv from "dotenv";
import path from "path";
import startup from "./startup";
import { LoggingMeta } from "./log/loggingMeta";
import { exec } from "child_process";

exec("yarn playwright install");

if (process.env.NODE_ENV === "dev") {
  dotenv.config({
    path: path.resolve(process.cwd(), ".env.dev"),
  });
}

const { TOKEN = "", CLIENT_ID = "" } = process.env;

const commands = [
  {
    name: "upcoming",
    description: "다가오는 CTF 정보를 출력합니다.",
    type: 1,
    options: [
      {
        type: 4,
        name: "limit",
        description: "가져올 CTF의 최대 개수",
        min_value: 1,
        required: false,
      },
    ],
  },
  {
    name: "notice",
    description: "CTFID로 CTF를 공지합니다.",
    options: [
      {
        type: 4,
        name: "ctfid",
        description: "CTFID",
        min_value: 1,
        required: true,
      }
    ]
  },
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    (new LoggingMeta(
      undefined,
      "startup",
      "reloading application commands",

    )).log("debug");
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    (new LoggingMeta(
      undefined,
      "startup",
      "realoded application commands",
    )).log("debug");
  } catch (error) {
    (new LoggingMeta(
      undefined,
      "error",
      error.message,
    )).log("error");
  }
})();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

startup(client);
client.login(TOKEN);
