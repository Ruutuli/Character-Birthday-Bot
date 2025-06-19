import { SlashCommandBuilder } from 'discord.js';
import { birthdayService } from '../services/birthdayService.js';
import { validateName, validateDate, validateImageUrl, getMonthName, getOrdinalSuffix, ValidationError } from '../utils/validation.js';
import { logger } from '../utils/logger.js';
import { config } from '../config.js';

export const addBirthdayData = new SlashCommandBuilder()
  .setName('addbirthday')
  .setDescription('Add a new character birthday')
  .addStringOption(option =>
    option.setName('name')
      .setDescription('Name of the character')
      .setRequired(true)
      .setMaxLength(config.maxNameLength))
  .addStringOption(option =>
    option.setName('bday')
      .setDescription('Birthday date (MM-DD format, e.g., 01-15)')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('image')
      .setDescription('Image URL of the character (must be a direct image link)')
      .setRequired(true)
      .setMaxLength(config.maxImageUrlLength));

export async function executeAddBirthday(interaction) {
  try {
    // Defer reply for better UX
    await interaction.deferReply({ ephemeral: true });

    const name = interaction.options.getString('name');
    const bday = interaction.options.getString('bday');
    const image = interaction.options.getString('image');
    const creator = interaction.user.tag;

    logger.info('Add birthday command executed', { 
      user: creator, 
      characterName: name, 
      birthday: bday 
    });

    // Validate inputs
    const validatedName = validateName(name);
    const { month, day } = validateDate(bday);
    validateImageUrl(image);

    // Get month name
    const monthName = getMonthName(month);

    // Add birthday using service
    await birthdayService.addBirthday(validatedName, monthName, day, image, creator);

    // Format response
    const dayWithSuffix = day + getOrdinalSuffix(day);
    const response = `✅ **Birthday Added Successfully!**\n\n` +
      `**Character:** ${validatedName}\n` +
      `**Birthday:** ${monthName} ${dayWithSuffix}\n` +
      `**Added by:** ${creator}\n\n` +
      `The birthday will be automatically posted on ${monthName} ${dayWithSuffix} each year! 🎉`;

    await interaction.editReply({ content: response });

    logger.info('Birthday added successfully', { 
      characterName: validatedName, 
      birthday: `${monthName} ${day}` 
    });

  } catch (error) {
    logger.error('Error in add birthday command', error, {
      user: interaction.user.tag,
      command: 'addbirthday'
    });

    let errorMessage = config.errors.genericError;

    if (error instanceof ValidationError) {
      errorMessage = error.message;
    } else if (error.message === config.errors.duplicateCharacter) {
      errorMessage = `❌ **Character Already Exists!**\n\nA character named "${name}" already exists in your birthday list. Please use a different name or edit the existing entry.`;
    }

    await interaction.editReply({ 
      content: errorMessage,
      ephemeral: true 
    });
  }
} 