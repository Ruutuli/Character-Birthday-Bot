import { SlashCommandBuilder } from 'discord.js';
import { readFileSync, writeFileSync } from 'fs';

// Function to get birthdays from the JSON file
function getBirthdays() {
  const data = readFileSync('./birthdays.json', 'utf8');
  return JSON.parse(data);
}

// Function to save birthdays to the JSON file
function saveBirthdays(birthdays) {
  writeFileSync('./birthdays.json', JSON.stringify(birthdays, null, 2));
}

// Function to get month name from month number
function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString('default', { month: 'long' });
}

// Define the delete birthday command
export const deleteBirthdayData = new SlashCommandBuilder()
  .setName('deletebirthday')
  .setDescription('Delete a character birthday')
  .addStringOption(option =>
    option.setName('name')
      .setDescription('Name of the character')
      .setAutocomplete(true)
      .setRequired(true));

// Execute the delete birthday command
export async function executeDeleteBirthday(interaction) {
  const name = interaction.options.getString('name');
  const creator = interaction.user.tag;

  const birthdays = getBirthdays();
  let characterFound = false;

  for (const month in birthdays) {
    const index = birthdays[month].findIndex(b => b.name === name && b.creator === creator);
    if (index !== -1) {
      birthdays[month].splice(index, 1);
      characterFound = true;
      break;
    }
  }

  if (!characterFound) {
    await interaction.reply({
      content: `No birthday found for ${name} created by you.`,
      ephemeral: true
    });
    return;
  }

  saveBirthdays(birthdays);

  await interaction.reply({
    content: `Deleted birthday for ${name}.`,
    ephemeral: true
  });
}

// Handle autocomplete
export async function handleAutocomplete(interaction) {
  const focusedValue = interaction.options.getFocused();
  const creator = interaction.user.tag;
  const birthdays = getBirthdays();
  const characterNames = [];

  for (const month in birthdays) {
    birthdays[month].forEach(b => {
      if (b.creator === creator && b.name.toLowerCase().startsWith(focusedValue.toLowerCase())) {
        characterNames.push(b.name);
      }
    });
  }

  const filtered = characterNames.slice(0, 25);
  await interaction.respond(filtered.map(name => ({ name, value: name })));
}
