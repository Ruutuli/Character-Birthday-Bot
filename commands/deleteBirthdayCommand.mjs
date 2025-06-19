import { SlashCommandBuilder } from 'discord.js';
import { birthdayService } from '../services/birthdayService.js';

export const deleteBirthdayData = new SlashCommandBuilder()
  .setName('deletebirthday')
  .setDescription('Delete a character\'s birthday by name')
  .addStringOption(option =>
    option.setName('name')
      .setDescription('The name of the character to delete')
      .setAutocomplete(true)
      .setRequired(true)
  );

export async function executeDeleteBirthday(interaction) {
  const name = interaction.options.getString('name');
  const creator = interaction.user.tag;

  try {
    birthdayService.deleteBirthday(name, creator);
    await interaction.reply({
      content: `✅ Birthday for **${name}** has been deleted.`,
      ephemeral: false
    });
  } catch (error) {
    await interaction.reply({
      content: `❌ ${error.message}`,
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