import { requireAuth } from '~/util/require-auth.server'
import type { Route } from './+types/layout'
import { Outlet } from 'react-router'
import { UserButton } from '@clerk/react-router'

export const loader = async (args: Route.LoaderArgs) => {
  await requireAuth(args)
  return {}
}

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <nav className="navbar bg-base-100 shadow-sm md:px-8">
          <div className="flex-none">
            <label
              htmlFor="servers-drawer"
              className="btn btn-square btn-ghost md:hidden"
              aria-label="Toggle Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="flex-1">
            <span className="flex text-2xl gap-2 font-semibold items-center">
              <img src="/dawg.png" alt="" className="h-8" />
              DawgBot
            </span>
          </div>
          <div className="flex-none">
            <UserButton />
          </div>
        </nav>
      </header>
      <main className="flex flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
