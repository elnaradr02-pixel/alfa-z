import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";

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
    <html lang="ru">
      <body className={`${bricolage.variable} ${manrope.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}