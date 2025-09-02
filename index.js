import 'dotenv/config'
import { Client, Events, GatewayIntentBits } from 'discord.js'

const { BOT_TOKEN: token } = process.env

if (!token) {
  throw new Error('BOT_TOKEN is not defined in environment variables')
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}`)
})

client.login(token)
