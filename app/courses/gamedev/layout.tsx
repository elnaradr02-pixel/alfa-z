import type { Metadata } from "next";
import JsonLd from "@/app/components/JsonLd";
import { courseLd, breadcrumbLd } from "@/app/lib/structured-data";

export const metadata: Metadata = {
  title: "Геймдев на Unity для подростков: C#, 2D-игры",
  description:
    "Курс геймдева Alfa Z для подростков: создаём 2D-игры на Unity 6 и C#. Финальная игра на itch.io, Google Play и App Store. 50 уроков с ментором, 5–8 игр в портфолио.",
  alternates: { canonical: "/courses/gamedev" },
  openGraph: {
    title: "Геймдев на Unity для подростков — Alfa Z",
    description:
      "Создаём 2D-игры на Unity и C#. Финальная игра на itch.io, Google Play и App Store.",
    url: "/courses/gamedev",
    type: "website",
  },
};

export default function GamedevCourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd
        data={[
          courseLd({
            name: "Геймдев на Unity для подростков",
            description:
              "Создаём 2D-игры на Unity 6 и C#. Финальная игра на itch.io, Google Play и App Store. 50 уроков с ментором, 5–8 игр в портфолио.",
            path: "/courses/gamedev",
          }),
          breadcrumbLd("Геймдев на Unity", "/courses/gamedev"),
        ]}
      />
    </>
  );
}
