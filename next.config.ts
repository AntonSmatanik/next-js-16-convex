import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "brainy-octopus-805.eu-west-1.convex.cloud",
        port: "",
      },
    ],
  },
};

export default nextConfig;
