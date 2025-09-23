import { type RouteConfig, route, layout } from '@react-router/dev/routes'

export default [
  layout('routes/layout.tsx', [
    route('', 'routes/contests.tsx', [
      route(':contestId', 'routes/contest.tsx')
    ])
  ]),
  route('sign-in/*', 'routes/sign-in.tsx')
] satisfies RouteConfig
