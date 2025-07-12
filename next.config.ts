import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { dev, isServer }) => {
    // Suppress warnings for pino-pretty in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }

    // Ignore specific warnings
    config.ignoreWarnings = [
      /Module not found: Can't resolve 'pino-pretty'/,
      /Critical dependency: the request of a dependency is an expression/,
    ]

    return config
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@rainbow-me/rainbowkit', 'wagmi', 'viem'],
  },
  
  // Images configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
