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
    ],
  },
    experimental: {
    serverActions: {
      allowedOrigins: ['*'], // or narrow to your domains
    },
  },
};

export default nextConfig;
