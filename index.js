import 'dotenv/config'
import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  MessageFlags
} from 'discord.js'
import { prisma } from './db.js'
import { loadCommands, registerCommands } from './commands.js'

/** @import { Guild, Interaction } from 'discord.js' */
/** @import { CommandCollection } from './commands.js' */

const { DISCORD_BOT_TOKEN: token } = process.env

if (!token) {
  throw new Error('DISCORD_BOT_TOKEN is not defined in environment variables')
}

const client = new (class extends Client {
  constructor() {
    super({ intents: [GatewayIntentBits.Guilds] })
    /** @type {CommandCollection} */
    this.commands = new Collection()
  }

  async loadCommands() {
    await loadCommands(this.commands)

    try {
      await registerCommands(this.commands)
    } catch (error) {
      console.error('Error registering commands:', error)
    }
  }
})()
await client.loadCommands()

client.on(
  Events.GuildCreate,
  /**
   * @param {Guild} guild
   */
  async guild => {
    console.info(`Joined new guild: ${guild.name} (id: ${guild.id})`)
    try {
      await prisma.server.create({
        data: {
          id: guild.id
        }
      })
    } catch (error) {
      console.error(
        `Failed to create server entry for guild ${guild.name} (id: ${guild.id}). Leaving the guild.`,
        error
      )
      await guild.leave()
    }
  }
)

client.on(
  Events.InteractionCreate,
  /**
   * @param {Interaction} interaction
   */
  async interaction => {
    if (!interaction.isChatInputCommand()) return

    const command = client.commands.get(interaction.commandName)

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`)
      return
    }

    try {
      await command.execute(interaction)
    } catch (error) {
      console.error(error)
      const replyMethod =
        interaction.replied || interaction.deferred ? 'followUp' : 'reply'
      await interaction[replyMethod]({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral
      })
    }
  }
)

client.once(Events.ClientReady, readyClient => {
  console.info(`Logged in as ${readyClient.user.tag}`)
})

await client.login(token)
