import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: [
      '127.0.0.1',  // Add both localhost variants
      'localhost',
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Add other config options as needed
  reactStrictMode: true,
  swcMinify: true,
}

export default nextConfig