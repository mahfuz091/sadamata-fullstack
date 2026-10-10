/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**", // or "/uploads/**" if you want to restrict
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**", // or "/uploads/**" if you want to restrict
      },
      {
        protocol: "https",
        hostname: "sadamata.com",
        pathname: "/**", // or "/uploads/**" if you want to restrict
      },
      {
        protocol: "https",
        hostname: "merch.sadamata.com",
        pathname: "/**", // or "/uploads/**" if you want to restrict
      },
      {
        protocol: "https",
        hostname: "sadamata-images.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // "*" turned off Next's Server Action origin check, which is what stops
      // another site from invoking an action with a visitor's session cookie.
      // Listed hosts only; APP_BASE_URL covers non-standard deployments.
      allowedOrigins: [
        "sadamata.com",
        "www.sadamata.com",
        "localhost:3000",
        ...(process.env.APP_BASE_URL
          ? [process.env.APP_BASE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "")]
          : []),
      ],
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
