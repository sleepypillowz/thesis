// next.config.js
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      '127.0.0.1',
      'localhost',
      'thesis-sg26.onrender.com'
    ],
    
    remotePatterns: [
      // DEV: both localhost and 127.0.0.1 on port 8000
      { protocol: 'http',  hostname: '127.0.0.1', port: '8000', pathname: '/media/**' },
      { protocol: 'http',  hostname: 'localhost',    port: '8000', pathname: '/media/**' },
      // PROD: your Render backend
      { protocol: 'https', hostname: 'thesis-sg26.onrender.com', pathname: '/media/**' },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    NEXT_PUBLIC_API_BASE:
      process.env.NODE_ENV === 'production'
        ? 'https://thesis-sg26.onrender.com'
        : 'http://localhost:8000',
    NEXT_PUBLIC_USE_HTTPS:
      process.env.NODE_ENV === 'production' ? 'true' : 'false'
  }
};

export default nextConfig;
