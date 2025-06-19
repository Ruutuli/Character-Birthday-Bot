import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { addBirthdayData } from './commands/addBirthdayCommand.mjs';
import { deleteBirthdayData } from './commands/deleteBirthdayCommand.mjs';
import { editBirthdayData } from './commands/editBirthdayCommand.mjs';
import { viewBirthdayListData } from './commands/viewBirthdayListCommand.mjs';

dotenv.config();

const commands = [
  addBirthdayData.toJSON(),
  deleteBirthdayData.toJSON(),
  editBirthdayData.toJSON(),
  viewBirthdayListData.toJSON()
];

// Log the commands being loaded
console.log('📋 Commands being loaded:');
commands.forEach((cmd, index) => {
  console.log(`  ${index + 1}. /${cmd.name} - ${cmd.description}`);
});

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

const mode = process.argv[2] || 'guild';

async function clearCommands(route) {
  console.log('🗑️  Clearing existing commands...');
  await rest.put(route, { body: [] });
  console.log('✅ Existing commands cleared!');
}

async function deployGuild() {
  console.log('Deploying GUILD commands...');
  const route = Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID);
  
  // Clear existing guild commands first
  await clearCommands(route);
  
  // Deploy new commands
  console.log(`🚀 Deploying ${commands.length} commands to guild...`);
  await rest.put(route, { body: commands });
  console.log('✅ Guild commands deployed!');
}

async function deployGlobal() {
  console.log('Deploying GLOBAL commands...');
  const route = Routes.applicationCommands(process.env.CLIENT_ID);
  
  // Clear existing global commands first
  await clearCommands(route);
  
  // Deploy new commands
  console.log(`🚀 Deploying ${commands.length} commands globally...`);
  await rest.put(route, { body: commands });
  console.log('✅ Global commands deployed! (May take up to 1 hour to appear)');
}

async function main() {
  try {
    if (mode === 'guild') {
      await deployGuild();
    } else if (mode === 'global') {
      await deployGlobal();
    } else if (mode === 'force') {
      await deployGuild();
      await deployGlobal();
    } else {
      console.error('Unknown mode. Use: guild | global | force');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error deploying commands:', error);
    process.exit(1);
  }
}

main(); 