import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Discord Configuration
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  
  // Channel Configuration
  birthdayChannelId: process.env.BIRTHDAY_CHANNEL_ID || '1210405664740868156',
  
  // Scheduling Configuration
  schedule: {
    timezone: 'America/New_York',
    hour: 0,
    minute: 0
  },
  
  // Embed Configuration
  embed: {
    color: 0xFF69B4,
    footer: 'Character Birthday Bot'
  },
  
  // File Paths
  dataFile: './birthdays.json',
  
  // Validation
  maxNameLength: 100,
  maxImageUrlLength: 2000,
  
  // Error Messages
  errors: {
    invalidDate: 'Invalid date format. Please use MM-DD format (e.g., 01-01).',
    invalidImageUrl: 'Invalid image URL. Please provide a valid image link.',
    nameTooLong: 'Character name is too long. Maximum 100 characters.',
    imageUrlTooLong: 'Image URL is too long. Maximum 2000 characters.',
    duplicateCharacter: 'A character with this name already exists.',
    characterNotFound: 'Character not found.',
    permissionDenied: 'You do not have permission to perform this action.',
    genericError: 'An error occurred while processing your request.'
  }
}; 