import { currentUser, clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@dawg/common'

export default async function Home() {
  const user = await currentUser()

  const discordAccessToken = (await (await clerkClient()).users.getUserOauthAccessToken(user.id, 'discord')).data[0].token

  const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: {
      Authorization: `Bearer ${discordAccessToken}`
    }
  })
  const guilds = await guildsResponse.json()

  return (
    <div>
      DawgBot dashboard
    </div>
  )
}
