import {
  MessageFlags,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  userMention,
  bold,
  subtext,
  time
} from 'discord.js'
import { prisma } from '@dawg/common'

/** @import { ChatInputCommandInteraction } from 'discord.js' */

const MEDALS = ['🥇', '🥈', '🥉']

export const data = new SlashCommandBuilder()
  .setName('contest')
  .setDescription('Manage hot dog eating contests')
  .addSubcommand(subcommand =>
    subcommand
      .setName('start')
      .setDescription('Start a new hot dog eating contest')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('end')
      .setDescription('End the current hot dog eating contest')
  )
  .setDefaultMemberPermissions(
    PermissionFlagsBits.CreateEvents | PermissionFlagsBits.ManageEvents
  )
  .setContexts(InteractionContextType.Guild)

/**
 * @param {ChatInputCommandInteraction} interaction
 */
export const execute = async interaction => {
  const subcommand = interaction.options.getSubcommand()

  await interaction.deferReply({
    flags: MessageFlags.Ephemeral
  })

  switch (subcommand) {
    case 'start': {
      const existing = await prisma.contest.findFirst({
        where: {
          serverId: interaction.guildId,
          start: {
            lte: new Date()
          },
          end: null
        },
        select: {
          id: true
        }
      })
      if (existing) {
        await interaction.editReply({
          content:
            'There is already an active hot dog eating contest in this server.',
          flags: MessageFlags.Ephemeral
        })
        return
      }
      const contest = await prisma.contest.create({
        data: {
          serverId: interaction.guildId
        },
        select: {
          id: true,
          start: true
        }
      })
      const embed = new EmbedBuilder().setTitle('🌭 Contest Started 🌭')
      let description = 'A new hot dog eating contest has started!'
      description += `\n\nView the full leaderboard [here](https://dawg.schim.dev/${contest.id})`
      description += `\n\n${subtext(`Contest start: ${time(contest.start, 'd')}`)}`
      embed.setDescription(description)
      await interaction.deleteReply()
      await interaction.channel.send({ embeds: [embed] })
      break
    }
    case 'end': {
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
        }
      })
      const end = new Date()
      await prisma.contest.update({
        where: {
          id: contest.id
        },
        data: {
          end
        }
      })
      const embed = new EmbedBuilder().setTitle('🌭 Contest Ended 🌭')

      let description =
        'The contest has ended! Here are the final results of the hot dog eating contest:\n'
      if (!leaderboardEntries.length) {
        description += '\nNo hot dogs were eaten in this contest'
      } else {
        for (let i = 0; i < leaderboardEntries.length; ++i) {
          const entry = leaderboardEntries[i]
          const medal = MEDALS[i] ?? `${i + 1}.`
          description += `\n${medal} ${userMention(entry.userId)} - ${bold(entry._sum.count)} hot dogs eaten`
        }
      }
      description += `\n\nView the full leaderboard [here](https://dawg.schim.dev/${contest.id})`
      description += `\n\n${subtext(`Contest start: ${time(contest.start, 'd')}`)}`
      description += `\n${subtext(`Contest end: ${time(end, 'd')}`)}`
      embed.setDescription(description)

      await interaction.deleteReply()
      await interaction.channel.send({
        embeds: [embed],
        content: leaderboardEntries[0]
          ? `Congratulations ${userMention(leaderboardEntries[0].userId)}! You are the winner!`
          : undefined
      })
    }
  }
}
