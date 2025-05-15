import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: [
      '127.0.0.1',    // Django backend IP
      'localhost',     // Django localhost
      'thesis-sg26.onrender.com'  // Production backend
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',  // Explicit port for development
        pathname: '/media/**',  // Django media files path
      },
      {
        protocol: 'https',
        hostname: 'thesis-sg26.onrender.com',
        pathname: '/media/**',
      }
    ],
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: true,
  // Optional: Add environment variables
    env: {
      NEXT_PUBLIC_API_BASE_URL: process.env.NODE_ENV === 'development' 
        ? 'http://localhost:8000'
        : 'https://thesis-sg26.onrender.com'
    }
    }

export default nextConfig