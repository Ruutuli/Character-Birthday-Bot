import { Client, GatewayIntentBits, EmbedBuilder, Collection } from 'discord.js';
import schedule from 'node-schedule';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { addBirthdayData, executeAddBirthday } from './addBirthdayCommand.mjs';
import { deleteBirthdayData, executeDeleteBirthday, handleAutocomplete as handleDeleteAutocomplete } from './deleteBirthdayCommand.mjs';
import { editBirthdayData, executeEditBirthday, handleAutocomplete as handleEditAutocomplete } from './editBirthdayCommand.mjs';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent // Ensure this is correct and enabled in the Developer Portal
  ]
});

client.commands = new Collection();
client.commands.set(addBirthdayData.name, { data: addBirthdayData, execute: executeAddBirthday });
client.commands.set(deleteBirthdayData.name, { data: deleteBirthdayData, execute: executeDeleteBirthday });
client.commands.set(editBirthdayData.name, { data: editBirthdayData, execute: executeEditBirthday });

const token = process.env.DISCORD_TOKEN;
const birthdayChannelId = '1028982619116937217'; // Channel ID for birthday posts

function getBirthdays() {
  const data = readFileSync('./birthdays.json', 'utf8');
  return JSON.parse(data);
}

function getRandomBirthdayMessage(character) {
  const messages = [
    `🎉 Happy Birthday, **${character.name}**! The village is celebrating your special day! 🎂🍥`,
    `🎈 It's **${character.name}'s** birthday! Let's make it a day to remember! 🎁🥳`,
    `🍜 Ramen time! Wishing **${character.name}** a fantastic birthday filled with joy and celebration! 🎉🎊`,
    `🎂 Another year stronger! Happy Birthday to our beloved **${character.name}**! 🎈🍥`,
    `🎉 Cheers to **${character.name}**! May your ninja way lead you to happiness on your special day! 🍜🎂`,
    `🎁 It's a ninja celebration! Happy Birthday, **${character.name}**! May your day be filled with surprises! 🍥🎈`,
    `🍥 The village is alive with excitement for **${character.name}'s** birthday! Have an amazing day! 🎉🥳`,
    `🎂 Time for a birthday mission! Wishing **${character.name}** a day full of joy and adventure! 🎈🍜`,
    `🎉 Happy Birthday, **${character.name}**! May your ninja skills continue to grow with each passing year! 🎁🍥`,
    `🎁 Celebrating **${character.name}** today! May your path be filled with success and happiness! 🎂🎈`,
    `🍜 On your special day, **${character.name}**, may you be surrounded by friends and delicious ramen! 🎉🎊`,
    `🎂 Another year of greatness! Happy Birthday to the incredible **${character.name}**! 🎁🍥`,
    `🎉 A toast to **${character.name}**! May your birthday be as legendary as your ninja adventures! 🍜🎂`,
    `🎁 Happy Birthday, **${character.name}**! Let the spirit of the ninja guide you to an unforgettable day! 🎉🥳`,
    `🍥 Wishing **${character.name}** a birthday filled with laughter, joy, and plenty of ramen! 🎂🎈`,
    `🎉 It's time to celebrate **${character.name}**! May your special day be as epic as your battles! 🎁🍜`,
    `🎂 Happy Birthday, **${character.name}**! May your ninja way always lead you to happiness and success! 🎉🎊`,
    `🎁 Today we honor **${character.name}**! May your birthday be filled with cherished memories! 🎂🍥`,
    `🍜 Ramen and friends – the perfect birthday combo! Wishing **${character.name}** a fantastic day! 🎉🎈`,
    `🎉 Cheers to another year of awesomeness, **${character.name}**! Have a legendary birthday! 🎁🍥`
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

function createBirthdayEmbed(character) {
  const message = getRandomBirthdayMessage(character);
  const embed = new EmbedBuilder()
    .setTitle(`🎉 Happy Birthday, **${character.name}**! 🎉`)
    .setDescription(message)
    .setColor(0xFF69B4) // Slightly darker pink color
    .setImage(character.image)
    .addFields(
      { name: 'Birthday', value: `${character.month} ${character.date}`, inline: true }
    )
    .setTimestamp();

  if (character.creator) {
    embed.addFields({ name: 'Creator', value: `Created by: ${character.creator}`, inline: true });
  }

  return embed;
}

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  scheduleBirthdayPosts();
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.on('interactionCreate', async interaction => {
  if (interaction.isAutocomplete()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      if (command.data.name === 'deletebirthday') {
        await handleDeleteAutocomplete(interaction);
      } else if (command.data.name === 'editbirthday') {
        await handleEditAutocomplete(interaction);
      }
    } catch (error) {
      console.error(error);
    }
  }
});

function scheduleBirthdayPosts() {
  const rule = new schedule.RecurrenceRule();
  rule.hour = 0; // Midnight EST
  rule.minute = 0;
  rule.tz = 'America/New_York'; // Ensure it posts at midnight EST

  schedule.scheduleJob(rule, async () => {
    const today = new Date().toISOString().split('T')[0];
    const dateParts = today.split('-');
    const month = new Date(today).toLocaleString('default', { month: 'long' });
    const day = parseInt(dateParts[2]);

    const birthdays = getBirthdays();
    const characters = birthdays[month]?.filter(b => parseInt(b.date) === day) || [];
    console.log(`Today's date: ${month} ${day}, Characters:`, characters);

    const birthdayChannel = client.channels.cache.get(birthdayChannelId);
    if (birthdayChannel) {
      if (characters.length > 0) {
        characters.forEach(character => {
          character.month = month;
          character.date = day;
          const embed = createBirthdayEmbed(character);
          birthdayChannel.send({ embeds: [embed] });
        });
      } else {
        birthdayChannel.send('No character birthdays today.');
      }
    }
  });
}

client.login(token);
