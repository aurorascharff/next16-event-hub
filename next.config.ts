import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  // // Simulate serverless environment like Vercel
  // cacheMaxMemorySize: 0,
  experimental: {
    cachedNavigations: true,
    staleTimes: {
      dynamic: 30,
    },
    useOffline: true,
    viewTransition: true,
  },
  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;
