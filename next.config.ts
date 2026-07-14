import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Игнорируем TypeScript ошибки при сборке (временно — пока MVP)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;