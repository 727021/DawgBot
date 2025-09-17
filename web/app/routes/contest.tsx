import type { Route } from "./+types/contest"

const Contest = ({ params }: Route.ComponentProps) => {
  return (
    <div>Contest: {params.contestId}</div>
  )
}

export default Contest