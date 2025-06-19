import { Client, GatewayIntentBits, EmbedBuilder, Collection } from 'discord.js';
import schedule from 'node-schedule';
import { config } from './config.js';
import { birthdayService } from './services/birthdayService.js';
import { logger } from './utils/logger.js';
import { addBirthdayData, executeAddBirthday } from './commands/addBirthdayCommand.mjs';
import { deleteBirthdayData, executeDeleteBirthday, handleAutocomplete as handleDeleteAutocomplete } from './commands/deleteBirthdayCommand.mjs';
import { editBirthdayData, executeEditBirthday, handleAutocomplete as handleEditAutocomplete } from './commands/editBirthdayCommand.mjs';
import { viewBirthdayListData, executeViewBirthdayList } from './commands/viewBirthdayListCommand.mjs';

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Command collection
client.commands = new Collection();
client.commands.set(addBirthdayData.name, { data: addBirthdayData, execute: executeAddBirthday });
client.commands.set(deleteBirthdayData.name, { data: deleteBirthdayData, execute: executeDeleteBirthday });
client.commands.set(editBirthdayData.name, { data: editBirthdayData, execute: executeEditBirthday });
client.commands.set(viewBirthdayListData.name, { data: viewBirthdayListData, execute: executeViewBirthdayList });

// Birthday messages for variety
const birthdayMessages = [
  `🎉 Happy Birthday, **{name}**! The village is celebrating your special day! 🎂🍥`,
  `🎈 It's **{name}'s** birthday! Let's make it a day to remember! 🎁🥳`,
  `🍜 Ramen time! Wishing **{name}** a fantastic birthday filled with joy and celebration! 🎉🎊`,
  `🎂 Another year stronger! Happy Birthday to our beloved **{name}**! 🎈🍥`,
  `🎉 Cheers to **{name}**! May your ninja way lead you to happiness on your special day! 🍜🎂`,
  `🎁 It's a ninja celebration! Happy Birthday, **{name}**! May your day be filled with surprises! 🍥🎈`,
  `🍥 The village is alive with excitement for **{name}'s** birthday! Have an amazing day! 🎉🥳`,
  `🎂 Time for a birthday mission! Wishing **{name}** a day full of joy and adventure! 🎈🍜`,
  `🎉 Happy Birthday, **{name}**! May your ninja skills continue to grow with each passing year! 🎁🍥`,
  `🎁 Celebrating **{name}** today! May your path be filled with success and happiness! 🎂🎈`,
  `🍜 On your special day, **{name}**, may you be surrounded by friends and delicious ramen! 🎉🎊`,
  `🎂 Another year of greatness! Happy Birthday to the incredible **{name}**! 🎁🍥`,
  `🎉 A toast to **{name}**! May your birthday be as legendary as your ninja adventures! 🍜🎂`,
  `🎁 Happy Birthday, **{name}**! Let the spirit of the ninja guide you to an unforgettable day! 🎉🥳`,
  `🍥 Wishing **{name}** a birthday filled with laughter, joy, and plenty of ramen! 🎂🎈`,
  `🎉 It's time to celebrate **{name}**! May your special day be as epic as your battles! 🎁🍜`,
  `🎂 Happy Birthday, **{name}**! May your ninja way always lead you to happiness and success! 🎉🎊`,
  `🎁 Today we honor **{name}**! May your birthday be filled with cherished memories! 🎂🍥`,
  `🍜 Ramen and friends – the perfect birthday combo! Wishing **{name}** a fantastic day! 🎉🎈`,
  `🎉 Cheers to another year of awesomeness, **{name}**! Have a legendary birthday! 🎁🍥`
];

function getRandomBirthdayMessage(characterName) {
  const message = birthdayMessages[Math.floor(Math.random() * birthdayMessages.length)];
  return message.replace(/{name}/g, characterName);
}

function createBirthdayEmbed(character) {
  const message = getRandomBirthdayMessage(character.name);
  const embed = new EmbedBuilder()
    .setTitle(`🎉 Happy Birthday, **${character.name}**! 🎉`)
    .setDescription(message)
    .setColor(config.embed.color)
    .setImage(character.image)
    .addFields(
      { name: '🎂 Birthday', value: `${character.month} ${character.date}`, inline: true }
    )
    .setTimestamp()
    .setFooter({ text: config.embed.footer });

  if (character.creator) {
    embed.addFields({ name: '👤 Creator', value: character.creator, inline: true });
  }

  return embed;
}

// Bot ready event
client.once('ready', async () => {
  logger.info(`Bot logged in successfully as ${client.user.tag}`);
  logger.info(`Bot is in ${client.guilds.cache.size} guild(s)`);
  
  // Schedule birthday posts
  scheduleBirthdayPosts();
});

// Command interaction handler
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    logger.warn(`Unknown command: ${interaction.commandName}`, {
      user: interaction.user.tag,
      guild: interaction.guild?.name
    });
    return;
  }

  try {
    logger.info(`Command executed: ${interaction.commandName}`, {
      user: interaction.user.tag,
      guild: interaction.guild?.name
    });

    await command.execute(interaction);
  } catch (error) {
    logger.error(`Error executing command: ${interaction.commandName}`, error, {
      user: interaction.user.tag,
      guild: interaction.guild?.name
    });

    const errorMessage = 'There was an error while executing this command!';
    
    if (interaction.deferred) {
      await interaction.editReply({ content: errorMessage, ephemeral: true });
    } else if (!interaction.replied) {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
});

// Autocomplete interaction handler
client.on('interactionCreate', async interaction => {
  if (!interaction.isAutocomplete()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    if (command.data.name === 'deletebirthday') {
      await handleDeleteAutocomplete(interaction);
    } else if (command.data.name === 'editbirthday') {
      await handleEditAutocomplete(interaction);
    }
  } catch (error) {
    logger.error(`Error in autocomplete for command: ${interaction.commandName}`, error, {
      user: interaction.user.tag
    });
  }
});

// Schedule birthday posts
function scheduleBirthdayPosts() {
  const rule = new schedule.RecurrenceRule();
  rule.hour = config.schedule.hour;
  rule.minute = config.schedule.minute;
  rule.tz = config.schedule.timezone;

  schedule.scheduleJob(rule, async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const dateParts = today.split('-');
      const month = new Date(today).toLocaleString('default', { month: 'long' });
      const day = parseInt(dateParts[2]);

      logger.info(`Checking birthdays for ${month} ${day}`);

      const characters = birthdayService.getBirthdaysForDate(month, day);
      
      if (characters.length === 0) {
        logger.info(`No birthdays found for ${month} ${day}`);
        return;
      }

      const birthdayChannel = client.channels.cache.get(config.birthdayChannelId);
      
      if (!birthdayChannel) {
        logger.error(`Birthday channel not found: ${config.birthdayChannelId}`);
        return;
      }

      logger.info(`Posting ${characters.length} birthday(s) for ${month} ${day}`);

      // Post each birthday with a small delay to avoid rate limiting
      for (const character of characters) {
        try {
          character.month = month;
          character.date = day;
          const embed = createBirthdayEmbed(character);
          await birthdayChannel.send({ embeds: [embed] });
          
          logger.info(`Posted birthday for ${character.name}`);
          
          // Small delay between posts
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          logger.error(`Failed to post birthday for ${character.name}`, error);
        }
      }

    } catch (error) {
      logger.error('Error in scheduled birthday post', error);
    }
  });

  logger.info('Birthday scheduling initialized', {
    timezone: config.schedule.timezone,
    time: `${config.schedule.hour}:${config.schedule.minute}`
  });
}

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', reason, { promise });
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Bot shutting down...');
  client.destroy();
  process.exit(0);
});

// Login to Discord
client.login(config.token).catch(error => {
  logger.error('Failed to login to Discord', error);
  process.exit(1);
});
