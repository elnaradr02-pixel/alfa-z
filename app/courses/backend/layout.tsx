import type { Metadata } from "next";
import JsonLd from "@/app/components/JsonLd";
import { courseLd, breadcrumbLd } from "@/app/lib/structured-data";

export const metadata: Metadata = {
  title: "Бэкенд на Python для подростков: Flask, SQL, Docker",
  description:
    "Курс бэкенда Alfa Z для подростков: Python, Flask, SQL, Docker. Собираем Telegram-бота 24/7 и REST API в интернете. 52 урока с ментором, 5–7 проектов в портфолио.",
  alternates: { canonical: "/courses/backend" },
  openGraph: {
    title: "Бэкенд на Python для подростков — Alfa Z",
    description:
      "Python, Flask, SQL, Docker. Telegram-бот 24/7 и REST API в интернете.",
    url: "/courses/backend",
    type: "website",
  },
};

export default function BackendCourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd
        data={[
          courseLd({
            name: "Бэкенд на Python для подростков",
            description:
              "Python, Flask, SQL, Docker. Собираем Telegram-бота 24/7 и REST API в интернете. 52 урока с ментором, 5–7 проектов в портфолио.",
            path: "/courses/backend",
          }),
          breadcrumbLd("Бэкенд на Python", "/courses/backend"),
        ]}
      />
    </>
  );
}
