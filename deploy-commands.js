import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { addBirthdayData } from './addBirthdayCommand.mjs';
import { deleteBirthdayData } from './deleteBirthdayCommand.mjs';
import { editBirthdayData } from './editBirthdayCommand.mjs';

dotenv.config();

console.log(`DISCORD_TOKEN: ${process.env.DISCORD_TOKEN}`);
console.log(`CLIENT_ID: ${process.env.CLIENT_ID}`);
console.log(`GUILD_ID: ${process.env.GUILD_ID}`);

const commands = [
  addBirthdayData.toJSON(),
  deleteBirthdayData.toJSON(),
  editBirthdayData.toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
