import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';
import startup from './startup';

if (process.env.NODE_ENV === 'dev') {
  dotenv.config({
    path: path.resolve(process.cwd(), '.env.dev'),
  });
}

const { TOKEN, CLIENT_ID } = process.env;

const commands = [
  {
    name: 'upcoming',
    description: '다가오는 CTF 정보를 출력합니다.',
  },
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('reloading applicaton commands');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('reloaded application commands');
  } catch (error) {
    console.error(error);
  }
})();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

startup(client);
client.login(TOKEN);
