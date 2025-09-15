import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shielded.co.nz",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
