import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function clearGlobalCommands() {
  try {
    console.log('🗑️  Clearing GLOBAL commands only...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: [] }
    );
    console.log('✅ Global commands cleared!');
    console.log('💡 Guild commands remain for fast testing.');
  } catch (error) {
    console.error('❌ Error clearing global commands:', error);
  }
}

clearGlobalCommands(); 