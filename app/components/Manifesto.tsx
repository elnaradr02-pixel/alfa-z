"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Aurora from "./Aurora";
import { useLang } from "../i18n/lang";

/** Одно слово: «загорается» от 14% до 100% непрозрачности по мере прокрутки. */
function Word({ word, i, n, progress }: { word: string; i: number; n: number; progress: MotionValue<number> }) {
  const start = i / n;
  const end = Math.min(1, start + 2.2 / n);
  const opacity = useTransform(progress, [start, end], [0.14, 1]);
  const key = /AI|junior|IT/i.test(word);
  return (
    <motion.span style={{ opacity }} className={key ? "text-accent" : undefined}>
      {word}{" "}
    </motion.span>
  );
}

/**
 * Манифест: секция закрепляется, а слова главной фразы зажигаются по мере скролла
 * (Apple/Linear-приём). Текст — из существующего ответа FAQ про отличие школы.
 * На мобильном — та же механика, но короче по высоте.
 */
export default function Manifesto() {
  const { tr } = useLang();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useTransform(scrollYProgress, [0.08, 0.82], [0, 1]);

  const text = tr(
    "Мы открыто учим работать с AI, а не делаем вид, что его нет.",
    "Біз AI-мен жұмыс істеуді ашық үйретеміз, оны жоқтай сыңай танытпаймыз.",
    "We openly teach working with AI instead of pretending it doesn't exist.",
  );
  const words = text.split(" ");

  return (
    <section ref={ref} className="sheet relative h-[190vh] bg-[#0F0F1A] text-[#FFFBF5] md:h-[230vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <Aurora />
        <div className="dot-grid-dark pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto w-full max-w-6xl px-6 sm:px-8">
          <p className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-white/50">
            <span aria-hidden className="h-px w-10 bg-accent" /> alfa-z / manifesto
          </p>
          <p className="font-display text-[length:clamp(2rem,5.4vw,4.6rem)] font-bold leading-[1.08] tracking-[-0.03em]">
            {words.map((w, i) => (
              <Word key={i} word={w} i={i} n={words.length} progress={progress} />
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
