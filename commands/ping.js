import { MessageFlags, SlashCommandBuilder } from 'discord.js'

/** @import { ChatInputCommandInteraction } from 'discord.js' */

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!')

/**
 * @param {ChatInputCommandInteraction} interaction
 */
export const execute = async interaction => {
  await interaction.reply({ content: 'Pong!', flags: MessageFlags.Ephemeral })
}
