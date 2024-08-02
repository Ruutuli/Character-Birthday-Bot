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
  console.log(`Getting month name for month number: ${monthNumber}`); // Debugging line
  const date = new Date();
  date.setMonth(monthNumber - 1); // Correctly adjust for zero-based index
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

// Function to validate the birthday format
function isValidDate(bday) {
  const regex = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/; // MM-DD format
  return regex.test(bday);
}

// Execute the add birthday command
export async function executeAddBirthday(interaction) {
  try {
    const name = interaction.options.getString('name');
    const bday = interaction.options.getString('bday');
    const image = interaction.options.getString('image');
    const creator = interaction.user.tag;

    // Validate the birthday format
    if (!isValidDate(bday)) {
      await interaction.reply({
        content: "Invalid date format. Please enter the date in MM-DD format (e.g., 01-01).",
        ephemeral: true
      });
      return; // Exit if the format is incorrect
    }

    // Trim any extra spaces and split the bday input
    const [month, day] = bday.trim().split('-');

    // Convert the month and day to integers and log for debugging
    const monthNumber = parseInt(month, 10);
    const dayNumber = parseInt(day, 10);
    console.log(`Parsed month: ${monthNumber}, Parsed day: ${dayNumber}`); // Debugging line

    // Get the month name
    const monthName = getMonthName(monthNumber);

    // Fetch existing birthdays
    const birthdays = getBirthdays();

    // Ensure the month array exists
    if (!birthdays[monthName]) {
      birthdays[monthName] = [];
    }

    // Adding the new birthday to the array
    birthdays[monthName].push({
      date: dayNumber.toString(),
      name,
      image,
      creator
    });

    // Save the updated birthdays
    saveBirthdays(birthdays);

    // Format the day with its ordinal suffix
    const dayWithSuffix = dayNumber + getOrdinalSuffix(dayNumber);

    // Send confirmation reply
    await interaction.reply({
      content: `Added birthday for ${name} on ${monthName} ${dayWithSuffix}, created by ${creator}.`,
      ephemeral: true
    });
  } catch (error) {
    console.error('Error executing addBirthday command:', error);
    if (!interaction.replied) {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      });
    }
  }
}
