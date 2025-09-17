import { createClerkClient } from '@clerk/react-router/api.server'
import { getAuth } from '@clerk/react-router/ssr.server'
import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs
} from 'react-router'

export const requireAuth = async (
  args: LoaderFunctionArgs | ActionFunctionArgs
) => {
  const { isAuthenticated, userId } = await getAuth(args)

  if (!isAuthenticated) {
    return redirect(
      `/sign-in?redirect_url=${encodeURIComponent(args.request.url)}`
    )
  }

  const user = await createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY
  }).users.getUser(userId)

  return user
}
