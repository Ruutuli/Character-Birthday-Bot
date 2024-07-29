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

// Function to get ordinal suffix for a day
function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

// Define the add birthday command
export const addBirthdayData = new SlashCommandBuilder()
  .setName('addbirthday')
  .setDescription('Add a new character birthday')
  .addStringOption(option =>
    option.setName('name')
      .setDescription('Name of the character')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('bday')
      .setDescription('Birthday date (MM-DD)')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('image')
      .setDescription('Image URL of the character. This cannot be a discord link.')
      .setRequired(true));

// Execute the add birthday command
export async function executeAddBirthday(interaction) {
  const name = interaction.options.getString('name');
  const bday = interaction.options.getString('bday');
  const image = interaction.options.getString('image');
  const creator = interaction.user.tag;

  const [month, day] = bday.split('-');
  const monthName = getMonthName(parseInt(month));
  const birthdays = getBirthdays();

  // Ensure the month array exists
  if (!birthdays[monthName]) {
    birthdays[monthName] = [];
  }

  // Adding the new birthday to the array
  birthdays[monthName].push({
    date: parseInt(day).toString(),
    name,
    image,
    creator
  });

  saveBirthdays(birthdays);

  const dayWithSuffix = parseInt(day) + getOrdinalSuffix(parseInt(day));

  await interaction.reply({
    content: `Added birthday for ${name} on ${monthName} ${dayWithSuffix} created by ${creator}.`,
    ephemeral: true
  });
}
