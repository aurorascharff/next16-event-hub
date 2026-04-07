import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    partialFallbacks: true,
    authInterrupts: true,
    partialFallbacks: true,
    staleTimes: {
      dynamic: 30,
    },
    viewTransition: true,
  },
  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;
