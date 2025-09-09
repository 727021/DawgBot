import {
  bold,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder
} from 'discord.js'
import { prisma } from '@dawg/common'

/** @import { ChatInputCommandInteraction } from 'discord.js' */

export const data = new SlashCommandBuilder()
  .setName('dawg')
  .setDescription('Add hot dogs to your count for the current contest')
  .addIntegerOption(option =>
    option
      .setName('count')
      .setDescription('Number of hot dogs consumed')
      .setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('notes')
      .setDescription('Additional notes about your hot dog consumption')
      .setRequired(false)
  )
  .setContexts(InteractionContextType.Guild)

/**
 * @param {ChatInputCommandInteraction} interaction
 */
export const execute = async interaction => {
  await interaction.deferReply({
    flags: MessageFlags.Ephemeral
  })

  const count = interaction.options.getInteger('count') ?? 1
  const notes = interaction.options.getString('notes') ?? null

  try {
    const contest = await prisma.contest.findFirst({
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

    if (!contest) {
      await interaction.editReply({
        content: 'There is no active hot dog eating contest in this server.',
        flags: MessageFlags.Ephemeral
      })
      return
    }

    await prisma.entry.create({
      data: {
        count,
        notes,
        contestId: contest.id,
        userId: interaction.user.id
      }
    })

    const entriesResult = await prisma.entry.aggregate({
      where: {
        contestId: contest.id,
        userId: interaction.user.id
      },
      _sum: {
        count: true
      }
    })

    await interaction.editReply({
      content: `You have consumed a total of ${bold(entriesResult._sum.count)} hot dogs in this contest!`,
      flags: MessageFlags.Ephemeral
    })
  } catch (error) {
    console.error(
      `Failed to record hot dog consumption for user ${interaction.user.tag} (id: ${interaction.user.id}) in guild ${interaction.guildId}`,
      error
    )
    await interaction.editReply({
      content:
        'There was a problem recording your hot dog consumption. Please try again later.',
      flags: MessageFlags.Ephemeral
    })
  }
}
