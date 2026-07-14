"use client";

import { motion } from "framer-motion";
import { useDeviceCapabilities } from "./useDeviceCapabilities";

/**
 * Заголовок hero, который раскрывается построчно: каждая строка «выезжает»
 * из-под маски. При prefers-reduced-motion показываем сразу, без движения.
 *
 * Контент строк не меняем — только оборачиваем в анимационную оболочку.
 */
export default function HeroHeadline() {
  const { reducedMotion, mounted } = useDeviceCapabilities();

  const lines: { text: string; accent?: boolean }[] = [
    { text: "Школа программирования" },
    { text: "для подростков 12 – 17 лет", accent: true },
  ];

  // До гидрации и при reduced-motion — статичный заголовок (без прыжка контента).
  const animate = mounted && !reducedMotion;

  return (
    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-1">
          <motion.span
            className={`block ${line.accent ? "text-accent" : ""}`}
            initial={animate ? { y: "110%" } : false}
            animate={animate ? { y: 0 } : undefined}
            transition={{
              duration: 0.85,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.15 + i * 0.18,
            }}
          >
            {line.text}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
