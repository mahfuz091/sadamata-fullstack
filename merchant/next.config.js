/** @type {import('next').NextConfig} */

const MOCKUP_ORIGIN =
  process.env.NEXT_PUBLIC_MOCKUP_ORIGIN || "http://localhost:3003";
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
        hostname: "merch.sadamata.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "admin.sadamata.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "800mb",
      allowedOrigins: ["*"], // (you probably meant allowedOrigins, but irrelevant for canvas)
    },
  },

  async rewrites() {
    return [
      {
        // Browser requests /mockup/...  -> Next proxies to your mockup server
        source: "/mockup/uploads/mockups/:file*",
        destination: `${MOCKUP_ORIGIN}/uploads/mockups/:file*`,
      },
    ];
  },
};

export default nextConfig;
