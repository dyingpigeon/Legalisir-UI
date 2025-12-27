import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "local-origin.dev",
    "*.local-origin.dev",
    "172.16.249.136",
    "172.16.249.136:3000",
    // "127.0.0.1:8000",
    // "172.16.*:3000",
    // "192.168.*:3000",
  ],
};

export default nextConfig;
