import { type RouteConfig, index, route, layout } from '@react-router/dev/routes'

export default [
  layout('routes/layout.tsx', [
    index('routes/servers.tsx'),
    route(':serverId', 'routes/server.tsx', [
      index('routes/contests.tsx'),
      route(':contestId', 'routes/contest.tsx')
    ])
  ]),
  route('sign-in/*', 'routes/sign-in.tsx')
] satisfies RouteConfig
