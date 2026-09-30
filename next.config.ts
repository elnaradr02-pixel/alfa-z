import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Игнорируем TypeScript ошибки при сборке (временно — пока MVP)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Фото (хакатоны): AVIF + WebP, одно разрешённое качество (в Next 16 поле обязательно)
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
  // Чистые URL для статических юр-документов из public/.
  async rewrites() {
    return [
      { source: "/oferta", destination: "/oferta.html" },
      { source: "/policy", destination: "/policy.html" },
    ];
  },
};

export default nextConfig;