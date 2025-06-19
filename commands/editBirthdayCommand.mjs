import { SlashCommandBuilder } from 'discord.js';
import { birthdayService } from '../services/birthdayService.js';
import { validateName, validateDate, validateImageUrl, getMonthName, ValidationError } from '../utils/validation.js';
import { logger } from '../utils/logger.js';
import { config } from '../config.js';

export const editBirthdayData = new SlashCommandBuilder()
  .setName('editbirthday')
  .setDescription('Edit a character birthday')
  .addStringOption(option =>
    option.setName('name')
      .setDescription('Name of the character')
      .setAutocomplete(true)
      .setRequired(true))
  .addStringOption(option =>
    option.setName('newbday')
      .setDescription('New birthday date (MM-DD)')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('image')
      .setDescription('New image URL of the character (optional, must be a direct image link)')
      .setRequired(false)
      .setMaxLength(config.maxImageUrlLength));

export async function executeEditBirthday(interaction) {
  try {
    await interaction.deferReply({ ephemeral: true });
    const name = interaction.options.getString('name');
    const newBday = interaction.options.getString('newbday');
    const newImage = interaction.options.getString('image');
    const creator = interaction.user.tag;

    logger.info('Edit birthday command executed', {
      user: creator,
      characterName: name,
      newBday,
      newImage
    });

    // Validate inputs
    const validatedName = validateName(name);
    const { month, day } = validateDate(newBday);
    let validatedImage = undefined;
    if (newImage) {
      validateImageUrl(newImage);
      validatedImage = newImage;
    }
    const monthName = getMonthName(month);

    // Edit birthday using service
    await birthdayService.editBirthday(validatedName, monthName, day, creator, validatedImage);

    const response = `✏️ **Birthday Updated!**\n\n` +
      `**Character:** ${validatedName}\n` +
      `**New Birthday:** ${monthName} ${day}\n` +
      (validatedImage ? `**New Image:** ${validatedImage}\n` : '') +
      `**Edited by:** ${creator}`;

    await interaction.editReply({ content: response });
    logger.info('Birthday edited successfully', {
      characterName: validatedName,
      newBirthday: `${monthName} ${day}`,
      newImage: validatedImage
    });
  } catch (error) {
    logger.error('Error in edit birthday command', error, {
      user: interaction.user.tag,
      command: 'editbirthday'
    });
    let errorMessage = config.errors.genericError;
    if (error instanceof ValidationError) {
      errorMessage = error.message;
    }
    await interaction.editReply({
      content: errorMessage,
      ephemeral: true
    });
  }
}

// Handle autocomplete
export async function handleAutocomplete(interaction) {
  const focusedValue = interaction.options.getFocused();
  const creator = interaction.user.tag;
  const characters = birthdayService.getCharactersByCreator(creator);
  const characterNames = characters
    .filter(b => b.name.toLowerCase().startsWith(focusedValue.toLowerCase()))
    .map(b => b.name);
  const filtered = characterNames.slice(0, 25);
  await interaction.respond(filtered.map(name => ({ name, value: name })));
} 