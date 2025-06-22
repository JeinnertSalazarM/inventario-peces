import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   eslint: {
    // Ignorar errores ESLint al hacer build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
