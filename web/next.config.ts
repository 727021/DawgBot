import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typedRoutes: true,
  experimental: {
    typedEnv: true
  }
}

export default nextConfig
