import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { birthdayService } from '../services/birthdayService.js';
import { config } from '../config.js';

export const viewBirthdayListData = new SlashCommandBuilder()
  .setName('viewbdaylist')
  .setDescription('View upcoming birthdays for the next month');

export async function executeViewBirthdayList(interaction) {
  // Get all characters instead of just the user's characters
  const characters = birthdayService.getAllCharacters();

  if (!characters.length) {
    await interaction.reply({
      content: 'No birthdays found in the database.',
      ephemeral: true
    });
    return;
  }

  // Get upcoming birthdays for the next month
  const upcomingBirthdays = getUpcomingBirthdays(characters, 30); // 30 days ahead

  if (!upcomingBirthdays.length) {
    await interaction.reply({
      content: 'No upcoming birthdays in the next 30 days.',
      ephemeral: true
    });
    return;
  }

  // Limit to first 15 birthdays to prevent embed size issues
  const limitedBirthdays = upcomingBirthdays.slice(0, 15);
  const hasMore = upcomingBirthdays.length > 15;

  const embed = new EmbedBuilder()
    .setTitle(`🎂 Upcoming Character Birthdays`)
    .setDescription(`Here are the upcoming birthdays in the next **30 days**!`)
    .setColor('#FF6B9D') // Pink color for birthdays
    .setThumbnail('https://cdn.discordapp.com/emojis/1234567890123456789.png') // You can add a birthday cake emoji URL here
    .setFooter({ 
      text: `📅 ${limitedBirthdays.length} of ${upcomingBirthdays.length} upcoming birthdays${hasMore ? ' • More available' : ''}`,
      iconURL: interaction.guild?.iconURL()
    })
    .setTimestamp();

  // Group birthdays by time period for better organization
  const today = [];
  const tomorrow = [];
  const thisWeek = [];
  const thisMonth = [];
  const nextMonth = [];

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  for (const char of limitedBirthdays) {
    const birthdayDate = getBirthdayDate(char.month, char.date);
    const birthdayMonth = birthdayDate.getMonth();
    const isCurrentMonth = birthdayMonth === currentMonth && birthdayDate.getFullYear() === currentYear;
    
    if (char.daysUntil === 0) {
      today.push(char);
    } else if (char.daysUntil === 1) {
      tomorrow.push(char);
    } else if (char.daysUntil <= 7) {
      thisWeek.push(char);
    } else if (isCurrentMonth) {
      thisMonth.push(char);
    } else {
      nextMonth.push(char);
    }
  }

  // Add sections based on what's available
  if (today.length > 0) {
    embed.addFields({
      name: '🎉 **TODAY!**',
      value: today.map(char => `• **${char.name}** (${char.month} ${char.date})`).join('\n'),
      inline: false
    });
  }

  if (tomorrow.length > 0) {
    embed.addFields({
      name: '🌟 **TOMORROW!**',
      value: tomorrow.map(char => `• **${char.name}** (${char.month} ${char.date})`).join('\n'),
      inline: false
    });
  }

  if (thisWeek.length > 0) {
    embed.addFields({
      name: '📅 **This Week**',
      value: thisWeek.map(char => `• **${char.name}** (${char.month} ${char.date}) - in ${char.daysUntil} days`).join('\n'),
      inline: false
    });
  }

  if (thisMonth.length > 0) {
    embed.addFields({
      name: '🗓️ **This Month**',
      value: thisMonth.map(char => `• **${char.name}** (${char.month} ${char.date}) - in ${char.daysUntil} days`).join('\n'),
      inline: false
    });
  }

  if (nextMonth.length > 0) {
    embed.addFields({
      name: '📆 **Next Month**',
      value: nextMonth.map(char => `• **${char.name}** (${char.month} ${char.date}) - in ${char.daysUntil} days`).join('\n'),
      inline: false
    });
  }

  if (hasMore) {
    embed.addFields({
      name: '📄 **More Birthdays Available**',
      value: `There are **${upcomingBirthdays.length - 15}** more upcoming birthdays in the next 30 days!`,
      inline: false
    });
  }

  await interaction.reply({ embeds: [embed] });
}

function getUpcomingBirthdays(characters, daysAhead = 30) {
  const today = new Date();
  const upcoming = [];

  for (const char of characters) {
    const birthdayDate = getBirthdayDate(char.month, char.date);
    const daysUntil = getDaysUntil(today, birthdayDate);
    
    if (daysUntil >= 0 && daysUntil <= daysAhead) {
      upcoming.push({
        ...char,
        daysUntil
      });
    }
  }

  // Sort by days until birthday
  upcoming.sort((a, b) => a.daysUntil - b.daysUntil);
  
  return upcoming;
}

function getBirthdayDate(month, day) {
  const currentYear = new Date().getFullYear();
  const monthIndex = getMonthIndex(month);
  
  // Create date for this year
  let birthdayDate = new Date(currentYear, monthIndex, parseInt(day));
  
  // If birthday has passed this year, use next year
  const today = new Date();
  if (birthdayDate < today) {
    birthdayDate = new Date(currentYear + 1, monthIndex, parseInt(day));
  }
  
  return birthdayDate;
}

function getDaysUntil(fromDate, toDate) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffTime = toDate.getTime() - fromDate.getTime();
  return Math.ceil(diffTime / oneDay);
}

function getMonthIndex(monthName) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months.indexOf(monthName);
} 