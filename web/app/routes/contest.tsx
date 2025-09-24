import type { Route } from './+types/contest'
import { useNavigation, useOutletContext } from 'react-router'
import type { DiscordServer, loader } from './contests'

type ContextData = {
  server: DiscordServer
  contest: Awaited<
    ReturnType<typeof loader>
  >['servers'][number]['contests'][number]
}

const Contest = ({ params }: Route.ComponentProps) => {
  const navigation = useNavigation()
  const loading = !!navigation.location

  const context = useOutletContext<ContextData>()

  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="flex items-center justify-between gap-4 text-xl">
        <div className="flex items-center gap-2">
          {context.server.icon && (
            <img
              src={`https://cdn.discordapp.com/icons/${context.server.id}/${context.server.icon}.webp`}
              alt=""
              className="h-10 w-10 rounded-full"
            />
          )}
          {context.server.name}
        </div>
        <div>
          {context.contest.start.toLocaleDateString()}
          {' - '}
          {context.contest.end?.toLocaleDateString()}
        </div>
      </div>
      {loading ? (
        <div className="flex w-52 flex-col gap-4">
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Contest
