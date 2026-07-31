import type { Metadata } from "next";
import JsonLd from "@/app/components/JsonLd";
import { courseLd, breadcrumbLd } from "@/app/lib/structured-data";

export const metadata: Metadata = {
  title: "Веб-разработка для подростков: HTML, CSS, JavaScript, React",
  description:
    "Курс веб-разработки Alfa Z для подростков 12–17 лет: от первого Hello, World до React-приложения в интернете и портфолио на GitHub. Живые занятия с ментором, 48 уроков.",
  alternates: { canonical: "/courses/web" },
  openGraph: {
    title: "Веб-разработка для подростков — Alfa Z",
    description:
      "От первого Hello, World до React-приложения и портфолио на GitHub. Живые занятия с ментором.",
    url: "/courses/web",
    type: "website",
  },
};

export default function WebCourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <JsonLd
        data={[
          courseLd({
            name: "Веб-разработка для подростков",
            description:
              "От первого Hello, World до React-приложения в интернете и портфолио на GitHub. HTML, CSS, JavaScript, React. 48 уроков с ментором.",
            path: "/courses/web",
          }),
          breadcrumbLd("Веб-разработка", "/courses/web"),
        ]}
      />
    </>
  );
}
