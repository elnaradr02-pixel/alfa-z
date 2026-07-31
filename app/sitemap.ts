import type { MetadataRoute } from "next";

const SITE_URL = "https://alfa-z.kz";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1, freq: "weekly" },
    { path: "/courses/web", priority: 0.9, freq: "weekly" },
    { path: "/courses/mobdev", priority: 0.9, freq: "weekly" },
    { path: "/courses/gamedev", priority: 0.9, freq: "weekly" },
    { path: "/courses/backend", priority: 0.9, freq: "weekly" },
    { path: "/oferta", priority: 0.3, freq: "yearly" },
    { path: "/policy", priority: 0.3, freq: "yearly" },
  ];
  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
