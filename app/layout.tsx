import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope, Space_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import CustomCursor from "./components/CustomCursor";
import { LanguageProvider } from "./i18n/lang";

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

export const metadata: Metadata = {
  title: "Alfa Z — Школа программирования для подростков",
  description:
    "Онлайн-школа Alfa Z учит подростков IT-профессиям: мобильная разработка, геймдев, фронтенд, бэкенд. Живые уроки с практикующими преподавателями. Казахстан и СНГ.",
  keywords: [
    "школа программирования",
    "программирование для подростков",
    "IT-курсы Казахстан",
    "Alfa Z",
    "онлайн-обучение",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kk">
      <body className={`${bricolage.variable} ${manrope.variable} ${spaceMono.variable} antialiased`}>
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