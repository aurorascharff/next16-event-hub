import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    cachedNavigations: true,
    prefetchInlining: true,
    varyParams: true,
    viewTransition: true,
  },
  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;
