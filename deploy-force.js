import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { addBirthdayData } from './commands/addBirthdayCommand.mjs';
import { deleteBirthdayData } from './deleteBirthdayCommand.mjs';
import { editBirthdayData } from './commands/editBirthdayCommand.mjs';
import { viewBirthdayListData } from './commands/viewBirthdayListCommand.mjs';

dotenv.config();

const commands = [
  addBirthdayData.toJSON(),
  deleteBirthdayData.toJSON(),
  editBirthdayData.toJSON(),
  viewBirthdayListData.toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function deployCommands() {
  try {
    console.log('🔄 Force deploying commands...');
    
    // Deploy to guild (immediate)
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    
    console.log('✅ Guild commands deployed successfully!');
    console.log('🎯 Commands should appear immediately in your server.');
    console.log('💡 Try typing "/" in any channel to see the commands.');
    
  } catch (error) {
    console.error('❌ Error deploying commands:', error);
  }
}

// Deploy immediately
deployCommands(); 