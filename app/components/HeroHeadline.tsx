"use client";

import { useState, useEffect } from "react";
import { useDeviceCapabilities } from "./useDeviceCapabilities";
import { useLang } from "../i18n/lang";

/**
 * Hero-заголовок: сверху — моноширинный «терминальный prompt», который
 * печатается посимвольно (typewriter) после заставки, снизу — сам заголовок:
 * строки выезжают из-под маски с проявлением из размытия (CSS `.hero-line`).
 *
 * Строки анимирует CSS, а не framer-motion: так заголовок играет с первого кадра,
 * не ждёт гидрации и не ломается SSR. Задержка = --intro-delay (пока идёт заставка).
 * Prompt декоративный (aria-hidden). При prefers-reduced-motion всё показывается сразу.
 */

const PROMPT = "alfa-z:~$ ./start-coding";

export default function HeroHeadline() {
  const { reducedMotion, mounted } = useDeviceCapabilities();
  const { tr } = useLang();
  const animate = mounted && !reducedMotion;

  const lines: { text: string; accent?: boolean }[] = [
    { text: tr("Школа программирования", "Бағдарламалау мектебі", "Coding school") },
    { text: tr("для подростков 12 – 17 лет", "12–17 жастағы жасөспірімдерге", "for teens aged 12–17"), accent: true },
  ];

  // Печатающийся prompt: стартует после заставки. До монтирования — пусто,
  // при reduced-motion — сразу целиком.
  const [typed, setTyped] = useState(0);
  useEffect(() => {
    if (!animate) return;
    setTyped(0);
    const delay = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--intro-delay")) || 0) * 1000;
    let id: ReturnType<typeof setInterval> | undefined;
    const t = setTimeout(() => {
      let n = 0;
      id = setInterval(() => {
        n += 1;
        setTyped(n);
        if (n >= PROMPT.length && id) clearInterval(id);
      }, 60);
    }, delay);
    return () => {
      clearTimeout(t);
      if (id) clearInterval(id);
    };
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
        className="font-display text-[length:clamp(2rem,7.2vw,3.6rem)] font-bold text-white leading-[1.02] tracking-[-0.035em] mb-6 lg:text-[length:clamp(2.6rem,4.5vw,4.25rem)]"
        aria-label={lines.map((l) => l.text).join(" ")}
      >
        {lines.map((line, i) => (
          <span key={i} aria-hidden className="block overflow-hidden pb-1">
            <span
              className={`hero-line block ${line.accent ? "accent-shimmer" : ""}`}
              style={{ animationDelay: `calc(var(--intro-delay, 0s) + ${0.15 + i * 0.18}s)` }}
            >
              {line.text}
            </span>
          </span>
        ))}
      </h1>
    </div>
  );
}
