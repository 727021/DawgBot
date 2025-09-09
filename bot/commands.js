import { REST, Routes } from 'discord.js'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { readdir } from 'node:fs/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @import { Collection, SlashCommandBuilder, Interaction } from 'discord.js' */

const { DISCORD_CLIENT_ID, DISCORD_BOT_TOKEN } = process.env

const rest = new REST().setToken(DISCORD_BOT_TOKEN)

/**
 * @typedef {{ data: SlashCommandBuilder, execute: (interaction: Interaction) => Promise<void>}} Command
 * @typedef {Collection<string, Command>} CommandCollection
 */

/**
 * @param {CommandCollection} commands
 */
export const registerCommands = async commands => {
  console.info(`Reloading ${commands.size} application (/) commands.`)
  const data = await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), {
    body: commands.map(command => command.data.toJSON())
  })
  console.info(`Successfully reloaded ${data.length} application (/) commands.`)
}

/**
 * @param {CommandCollection} commands
 */
export const loadCommands = async commands => {
  const commandsPath = join(__dirname, 'commands')
  const commandFiles = (await readdir(commandsPath)).filter(file =>
    file.endsWith('.js')
  )

  for (const file of commandFiles) {
    /** @type {Command} */
    const command = await import(pathToFileURL(join(commandsPath, file)).href)
    commands.set(command.data.name, command)
  }
}
