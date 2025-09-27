// next.config.js
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      '127.0.0.1',
      'thesis-production-5658.up.railway.app',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-backend.railway.app',
        pathname: '/media/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    NEXT_PUBLIC_API_BASE:
      process.env.NODE_ENV === 'production'
        ? 'https://thesis-production-5658.up.railway.app'
        : 'http://localhost:8000',
    NEXT_PUBLIC_USE_HTTPS:
      process.env.NODE_ENV === 'production' ? 'true' : 'false',
  },
};

export default nextConfig;
