import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.resolve(),
  experimental: {
    serverActions: {
      // raise the Server Actions request body limit
      bodySizeLimit: "100mb",
      // optional:
      // allowedOrigins: ['http://localhost:3000', ],
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
};

export default nextConfig;
