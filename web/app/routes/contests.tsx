import { requireAuth } from '~/util/require-auth.server'
import type { Route } from './+types/contests'
import { prisma } from '@dawg/common'
import { Outlet, useLoaderData, NavLink, useParams } from 'react-router'
import { useCallback, useRef } from 'react'
import { clsx } from 'clsx'
import { createClerkClient } from '@clerk/react-router/api.server'

type DiscordServer = {
  id: string
  name: string
  icon: string | null
}

export const loader = async (args: Route.LoaderArgs) => {
  const user = await requireAuth(args)

  const discordAccessToken = (
    await createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY!
    }).users.getUserOauthAccessToken(user.id, 'discord')
  ).data[0].token

  const userSnowflake = user.externalAccounts.find(
    acc => acc.provider === 'oauth_discord'
  )?.externalId

  const discordServers = (await (
    await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${discordAccessToken}`
      }
    })
  ).json()) as DiscordServer[]

  if (!userSnowflake) {
    throw new Error('No Discord account linked')
  }

  const contests = await prisma.contest.findMany({
    where: {
      serverId: {
        in: discordServers.map(s => BigInt(s.id))
      }
    }
  })

  return {
    servers: discordServers
      .map(server => ({
        ...server,
        contests: contests
          .filter(c => c.serverId.toString() === server.id)
          .sort((a, b) => b.start.getTime() - a.start.getTime())
          .map(contest => ({
            ...contest,
            active: !contest.end || contest.end > new Date()
          }))
      }))
      .filter(server => server.contests.length > 0)
  }
}

const Contests = () => {
  const data = useLoaderData<typeof loader>()

  const drawerRef = useRef<HTMLInputElement>(null)

  const closeDrawer = useCallback(() => {
    if (drawerRef.current) {
      drawerRef.current.checked = false
    }
  }, [])

  const { contestId } = useParams()

  return (
    <div className="drawer md:drawer-open">
      <input
        id="servers-drawer"
        type="checkbox"
        className="drawer-toggle"
        ref={drawerRef}
      />
      <div className="drawer-content">
        <Outlet />
      </div>
      <div className="drawer-side h-full">
        <label
          htmlFor="servers-drawer"
          aria-label="Close Drawer"
          className="drawer-overlay"
        ></label>
        <div className="menu bg-base-200 text-base-content min-h-full w-80 p-0">
          {data.servers.map(server => (
            <li key={server.id} className="mx-4 mt-4 last-of-type:mb-4">
              <details
                open={server.contests.some(c => c.id.toString() === contestId)}
              >
                <summary>
                  {server.icon && (
                    <img
                      src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.webp`}
                      alt=""
                      className="h-6 w-6 rounded-full"
                    />
                  )}
                  {server.name}
                </summary>
                <ul>
                  {server.contests.map(contest => (
                    <li key={contest.id}>
                      <NavLink
                        to={`/${contest.id}`}
                        onClick={closeDrawer}
                        className={({ isActive }) =>
                          clsx(
                            isActive && 'menu-active',
                            contest.active
                              ? 'font-bold'
                              : 'text-base-content/50'
                          )
                        }
                      >
                        {contest.start.toLocaleDateString()}
                        {' - '}
                        {contest.end?.toLocaleDateString()}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
          <footer className="footer bg-base-300 text-base-content/20 py-5 px-4 footer-horizontal justify-between mt-auto">
            <span>DawgBot</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default Contests
