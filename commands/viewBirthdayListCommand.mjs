import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { birthdayService } from '../services/birthdayService.js';
import { config } from '../config.js';

export const viewBirthdayListData = new SlashCommandBuilder()
  .setName('viewbdaylist')
  .setDescription('View your character birthday list');

export async function executeViewBirthdayList(interaction) {
  await interaction.deferReply({ ephemeral: true });
  const creator = interaction.user.tag;
  const characters = birthdayService.getCharactersByCreator(creator);

  if (!characters.length) {
    await interaction.editReply({
      content: 'You have no birthdays saved yet. Use `/addbirthday` to add one!',
      ephemeral: true
    });
    return;
  }

  // Sort by month and day
  characters.sort((a, b) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthA = months.indexOf(a.month);
    const monthB = months.indexOf(b.month);
    if (monthA !== monthB) return monthA - monthB;
    return parseInt(a.date) - parseInt(b.date);
  });

  // Paginate if more than 10
  const pageSize = 10;
  const pages = [];
  for (let i = 0; i < characters.length; i += pageSize) {
    pages.push(characters.slice(i, i + pageSize));
  }

  // Only show the first page for now (pagination can be added later)
  const page = pages[0];
  const embed = new EmbedBuilder()
    .setTitle(`${interaction.user.username}'s Birthday List`)
    .setColor(config.embed.color)
    .setFooter({ text: `Total: ${characters.length} | Only first 10 shown` })
    .setTimestamp();

  for (const char of page) {
    embed.addFields({
      name: `${char.name} (${char.month} ${char.date})`,
      value: char.image ? `[Image Link](${char.image})` : 'No image',
      inline: false
    });
  }

  await interaction.editReply({ embeds: [embed] });
} 