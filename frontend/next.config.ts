// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  eslint: {
    // 🚫 Prevent build from failing due to ESLint errors
    ignoreDuringBuilds: true,
  },

  images: {
    domains: [
      'localhost',
      '127.0.0.1',
      'thesis-backend.up.railway.app',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thesis-backend.up.railway.app',
        pathname: '/media/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  env: {
    NEXT_PUBLIC_API_BASE:
      process.env.NODE_ENV === 'production'
        ? 'https://thesis-backend.up.railway.app'
        : 'http://localhost:8000',
    NEXT_PUBLIC_USE_HTTPS:
      process.env.NODE_ENV === 'production' ? 'true' : 'false',
  },
};

export default nextConfig;
