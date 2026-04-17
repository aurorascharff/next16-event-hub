import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  // // Simulate serverless environment like Vercel
  // cacheMaxMemorySize: 0,
  experimental: {
    cachedNavigations: true,
    instantNavigationDevToolsToggle: true,
    optimisticRouting: true,
    prefetchInlining: true,
    useOffline: true,
    varyParams: true,
    viewTransition: true,
  },
  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;
