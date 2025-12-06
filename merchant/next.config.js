/** @type {import('next').NextConfig} */

const MOCKUP_ORIGIN = process.env.MOCKUP_ORIGIN || "http://localhost:3003";
// In production set e.g. MOCKUP_ORIGIN="https://admin.sadamata.com"

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3003",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "merchant-chi.vercel.app",
        pathname: "/**",
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "200mb",
      llowedOrigins: ["*"], // (you probably meant allowedOrigins, but irrelevant for canvas)
    },
  },

  async rewrites() {
    return [
      {
        // Browser requests /mockup/...  -> Next proxies to your mockup server
        source: "/mockup/:file*",
        destination: `${MOCKUP_ORIGIN}/mockups/:file*`,
      },
    ];
  },
};

export default nextConfig;
