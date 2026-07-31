import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope, Space_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import CustomCursor from "./components/CustomCursor";
import { LanguageProvider } from "./i18n/lang";
import JsonLd from "./components/JsonLd";
import { organizationLd, websiteLd } from "./lib/structured-data";

// Шрифт для крупных заголовков
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// Шрифт для основного текста
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Моноширинный акцент — код-токены, теги, terminal-окна (латиница)
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

const SITE_URL = "https://alfa-z.kz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Alfa Z — Школа программирования для подростков 12–17 лет",
    template: "%s — Alfa Z",
  },
  description:
    "Онлайн-школа Alfa Z: подростки 12–17 лет учатся IT с нуля до junior. Живые занятия с ментором, программа на базе Гарвардского CS50, мобильная разработка, геймдев, фронтенд, бэкенд. Единая цена 47 500 ₸/мес.",
  applicationName: "Alfa Z",
  category: "education",
  keywords: [
    "школа программирования",
    "программирование для подростков",
    "IT-курсы для детей",
    "курсы программирования Астана",
    "курсы программирования Казахстан",
    "обучение программированию онлайн",
    "CS50 на русском",
    "Python для подростков",
    "мобильная разработка Flutter",
    "геймдев Unity для детей",
    "веб-разработка React",
    "Alfa Z",
    "бағдарламалау мектебі",
    "балаларға арналған IT курстары",
  ],
  authors: [{ name: "Alfa Z" }],
  creator: "Alfa Z",
  publisher: "ТОО «Alfa Z»",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    alternateLocale: ["kk_KZ", "en_US"],
    url: SITE_URL,
    siteName: "Alfa Z",
    title: "Alfa Z — Школа программирования для подростков 12–17 лет",
    description:
      "IT с нуля до junior для подростков 12–17 лет. Живые занятия с ментором, программа на базе Гарвардского CS50, реальные проекты в портфолио.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alfa Z — Школа программирования для подростков",
    description:
      "IT с нуля до junior для подростков 12–17 лет. Живые занятия с ментором, программа на базе CS50, реальные проекты.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kk">
      <body className={`${bricolage.variable} ${manrope.variable} ${spaceMono.variable} antialiased`}>
        <JsonLd data={[organizationLd, websiteLd]} />
        <LanguageProvider>
          <CustomCursor />
          {children}

          {/* 💬 Jivo онлайн-консультант */}
          <Script
            src="//code.jivo.ru/widget/tYX0zpB552"
            strategy="afterInteractive"
          />
        </LanguageProvider>
      </body>
    </html>
  );
}