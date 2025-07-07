import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only custom webpack config remains
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Suppress WebSocket connection errors in development
      config.infrastructureLogging = {
        level: "error",
      };
    }
    // Handle Prisma client in webpack
    if (isServer) {
      config.externals = [...(config.externals || []), "@prisma/client"];
    }
    return config;
  },
};

export default nextConfig;
