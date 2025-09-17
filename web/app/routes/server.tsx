import { Outlet } from 'react-router'
import type { Route } from './+types/server'

const Server = ({ params }: Route.ComponentProps) => {
  return (
    <>
      <div>Server: {params.serverId}</div>
      <Outlet />
    </>
  )
}

export default Server