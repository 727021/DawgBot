import { requireAuth } from '~/util/require-auth.server'
import type { Route } from './+types/layout'
import { Outlet } from 'react-router'

export const loader = async (args: Route.LoaderArgs) => {
  await requireAuth(args)
  return {}
}

const Layout = () => {
  return (
    <div>
      <header>Header</header>
      <main>
        <Outlet />
      </main>
      <footer>Footer</footer>
    </div>
  )
}

export default Layout
