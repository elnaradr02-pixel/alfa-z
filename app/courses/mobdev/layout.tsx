import type { Metadata } from "next";
import JsonLd from "@/app/components/JsonLd";
import { courseLd, breadcrumbLd } from "@/app/lib/structured-data";

export const metadata: Metadata = {
  title: "Мобильная разработка для подростков: Flutter, Dart, Firebase",
  description:
    "Курс мобильной разработки Alfa Z для подростков: от FlutterFlow до публикации приложения в Google Play. AdMob, Firebase, портфолио из 5 приложений. 48 уроков с ментором.",
  alternates: { canonical: "/courses/mobdev" },
  openGraph: {
    title: "Мобильная разработка для подростков — Alfa Z",
    description:
      "От FlutterFlow до публикации приложения в Google Play. 5 приложений в портфолио.",
    url: "/courses/mobdev",
    type: "website",
  },
};

export default function MobdevCourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd
        data={[
          courseLd({
            name: "Мобильная разработка для подростков",
            description:
              "От FlutterFlow до публикации приложения в Google Play. Flutter, Dart, Firebase, AdMob. 5 приложений в портфолио, 48 уроков с ментором.",
            path: "/courses/mobdev",
          }),
          breadcrumbLd("Мобильная разработка", "/courses/mobdev"),
        ]}
      />
    </>
  );
}
