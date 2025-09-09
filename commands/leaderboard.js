import {
  bold,
  EmbedBuilder,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
  userMention,
  time,
  subtext
} from 'discord.js'
import { prisma } from '../db.js'

/** @import { ChatInputCommandInteraction } from 'discord.js' */

const MEDALS = ['🥇', '🥈', '🥉']

export const data = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('View the leaderboard for the current contest')
  .setContexts(InteractionContextType.Guild)

/**
 * @param {ChatInputCommandInteraction} interaction
 */
export const execute = async interaction => {
  await interaction.deferReply({
    flags: MessageFlags.Ephemeral
  })

  const contest = await prisma.contest.findFirst({
    where: {
      serverId: interaction.guildId,
      start: {
        lte: new Date()
      },
      end: null
    },
    select: {
      id: true,
      start: true
    }
  })
  if (!contest) {
    await interaction.editReply({
      content: 'There is no active hot dog eating contest in this server.',
      flags: MessageFlags.Ephemeral
    })
    return
  }
  const leaderboardEntries = await prisma.entry.groupBy({
    by: ['userId'],
    _sum: {
      count: true
    },
    where: {
      contestId: contest.id
    },
    orderBy: {
      _sum: {
        count: 'desc'
      }
    },
    take: 10,
    having: {
      count: {
        _sum: {
          gt: 0
        }
      }
    }
  })
  const embed = new EmbedBuilder().setTitle('🌭 Contest Leaderboard 🌭')

  let description = ''
  if (!leaderboardEntries.length) {
    description = 'No hot dogs have been eaten in this contest yet'
  } else {
    description =
      'Here are the top contestants in the current hot dog eating contest:\n'

    for (let i = 0; i < leaderboardEntries.length; ++i) {
      const entry = leaderboardEntries[i]
      const medal = MEDALS[i] ?? `${i + 1}.`
      description += `\n${medal} ${userMention(entry.userId)} - ${bold(entry._sum.count)} hot dogs eaten`
    }
  }
  description += `\n\nView the full leaderboard [here](https://dawg.schim.dev/${contest.id})`
  description += `\n\n${subtext(`Contest start: ${time(contest.start, 'd')}`)}`
  embed.setDescription(description)

  await interaction.editReply({
    embeds: [embed],
    flags: MessageFlags.Ephemeral
  })
}
