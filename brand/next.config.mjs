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
        hostname: "merchant-chi.vercel.app",
        pathname: "/**", // or "/uploads/**" if you want to restrict
      },
    ],
  },
};

export default nextConfig;
