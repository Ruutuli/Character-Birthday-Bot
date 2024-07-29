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

// Define the edit birthday command
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
      .setRequired(true));

// Execute the edit birthday command
export async function executeEditBirthday(interaction) {
  const name = interaction.options.getString('name');
  const newBday = interaction.options.getString('newbday');
  const creator = interaction.user.tag;

  const [newMonth, newDay] = newBday.split('-');
  const newMonthName = getMonthName(parseInt(newMonth));
  const birthdays = getBirthdays();
  let characterFound = false;

  for (const month in birthdays) {
    const index = birthdays[month].findIndex(b => b.name === name && b.creator === creator);
    if (index !== -1) {
      const character = birthdays[month][index];
      character.date = parseInt(newDay).toString();
      if (newMonthName !== month) {
        birthdays[month].splice(index, 1);
        if (!birthdays[newMonthName]) {
          birthdays[newMonthName] = [];
        }
        birthdays[newMonthName].push(character);
      }
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
    content: `Edited birthday for ${name} to ${newMonthName} ${parseInt(newDay)}.`,
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
