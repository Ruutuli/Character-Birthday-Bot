import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { addBirthdayData } from './commands/addBirthdayCommand.mjs';
import { deleteBirthdayData } from './deleteBirthdayCommand.mjs';
import { editBirthdayData } from './commands/editBirthdayCommand.mjs';
import { viewBirthdayListData } from './commands/viewBirthdayListCommand.mjs';

dotenv.config();

console.log(`DISCORD_TOKEN: ${process.env.DISCORD_TOKEN}`);
console.log(`CLIENT_ID: ${process.env.CLIENT_ID}`);

const commands = [
  addBirthdayData.toJSON(),
  deleteBirthdayData.toJSON(),
  editBirthdayData.toJSON(),
  viewBirthdayListData.toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing GLOBAL application (/) commands.');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('Successfully reloaded GLOBAL application (/) commands.');
    console.log('⚠️  Note: Global commands can take up to 1 hour to appear in all servers.');
  } catch (error) {
    console.error(error);
  }
})(); 