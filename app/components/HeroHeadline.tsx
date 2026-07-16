"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDeviceCapabilities } from "./useDeviceCapabilities";
import { useLang } from "../i18n/lang";

/**
 * Hero-заголовок: сверху — моноширинный «терминальный prompt», который
 * печатается посимвольно (typewriter) при загрузке, снизу — сам заголовок,
 * раскрывающийся построчно из-под маски.
 *
 * Prompt декоративный (aria-hidden). При prefers-reduced-motion — и prompt, и
 * заголовок показываются сразу, без движения. Контент строк не меняем.
 */

const PROMPT = "alfa-z:~$ ./start-coding";

export default function HeroHeadline() {
  const { reducedMotion, mounted } = useDeviceCapabilities();
  const { tr } = useLang();
  const animate = mounted && !reducedMotion;

  const lines: { text: string; accent?: boolean }[] = [
    { text: tr("Школа программирования", "Бағдарламалау мектебі", "Coding school") },
    { text: tr("для подростков 12 – 17 лет", "12–17 жастағы жасөспірімдерге", "for teens aged 12–17"), accent: true },
  ];

  // Печатающийся prompt. До монтирования — пусто (без вспышки/сдвига),
  // при reduced-motion — сразу целиком.
  const [typed, setTyped] = useState(0);
  useEffect(() => {
    if (!animate) return;
    setTyped(0);
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      setTyped(n);
      if (n >= PROMPT.length) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, [animate]);

  const promptText = !mounted ? "" : reducedMotion ? PROMPT : PROMPT.slice(0, typed);

  return (
    <div>
      {/* Терминальный prompt (декоративный) */}
      <div aria-hidden className="mb-3 flex h-5 items-center font-mono text-xs sm:text-sm text-accent-soft">
        <span className="whitespace-pre">{promptText}</span>
        {mounted && (
          <span className="ml-0.5 inline-block h-[1.05em] w-[2px] bg-accent-soft animate-blink" />
        )}
      </div>

      <h1
        className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6"
        aria-label={lines.map((l) => l.text).join(" ")}
      >
        {lines.map((line, i) => (
          <span key={i} aria-hidden className="block overflow-hidden pb-1">
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
    </div>
  );
}
