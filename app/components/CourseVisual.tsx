"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";
import { useDeviceCapabilities } from "./useDeviceCapabilities";
import type { CourseKind } from "./CourseCanvas";

// three.js уезжает в отдельный чанк и грузится только когда реально нужен.
const CourseCanvas = dynamic(() => import("./CourseCanvas"), { ssr: false });

// Позиции бейджей вокруг сцены (в % от контейнера). По часовой от верх-лево.
const BADGE_SLOTS = [
  { top: "8%", left: "6%" },
  { top: "4%", right: "10%" },
  { top: "42%", right: "2%" },
  { bottom: "10%", right: "12%" },
  { bottom: "6%", left: "8%" },
  { top: "38%", left: "1%" },
] as const;

type Props = {
  kind: CourseKind;
  emoji: string;
  stack: string[];
  /** Мягкое свечение сцены — обычно акцентный цвет курса. */
  glow?: string;
};

/**
 * Визуальная «сцена» карточки направления:
 *  • на десктопе (и когда включены анимации) — WebGL-сцена, что монтируется
 *    только при попадании во вьюпорт;
 *  • на мобильном / при prefers-reduced-motion — статичная iso-иллюстрация
 *    (крупная иконка на градиентном свечении), three.js не грузится;
 *  • поверх — всплывающие бейджи технологий курса (работают в обоих режимах).
 */
export default function CourseVisual({ kind, emoji, stack, glow = "#FF6B47" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // once:true — сцена монтируется при первом входе во вьюпорт и остаётся.
  // Иначе toggfrom скролла плодит create/destroy WebGL-контекстов (thrash).
  const inView = useInView(ref, { amount: 0.35, once: true });
  const { canRender3D, reducedMotion } = useDeviceCapabilities();

  const show3D = canRender3D && inView;
  const badges = stack.slice(0, BADGE_SLOTS.length);

  return (
    <div
      ref={ref}
      className="relative h-60 sm:h-64 lg:h-72 w-full overflow-hidden rounded-2xl"
      style={{
        background: `radial-gradient(120% 90% at 50% 35%, ${glow}22, transparent 70%)`,
      }}
    >
      {/* Сцена / фолбэк */}
      <div className="absolute inset-0 flex items-center justify-center">
        {show3D ? (
          <CourseCanvas kind={kind} />
        ) : (
          <motion.div
            initial={reducedMotion ? false : { scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center"
          >
            <span
              className="absolute h-32 w-32 rounded-full blur-2xl"
              style={{ background: `${glow}55` }}
            />
            <span className="relative text-7xl sm:text-8xl drop-shadow-xl">{emoji}</span>
          </motion.div>
        )}
      </div>

      {/* Всплывающие бейджи технологий */}
      {badges.map((tech, i) => {
        const slot = BADGE_SLOTS[i];
        return (
          <motion.span
            key={tech}
            className="absolute z-10 rounded-lg border border-white/20 bg-foreground/85 px-2.5 py-1 text-[11px] font-semibold text-surface shadow-lg backdrop-blur-sm"
            style={slot as React.CSSProperties}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.5, y: 8 }}
            animate={
              inView
                ? {
                    opacity: 1,
                    scale: 1,
                    y: reducedMotion ? 0 : [0, -5, 0],
                  }
                : { opacity: 0, scale: 0.5 }
            }
            transition={{
              opacity: { duration: 0.4, delay: 0.15 + i * 0.08 },
              scale: { duration: 0.4, delay: 0.15 + i * 0.08 },
              y: reducedMotion
                ? undefined
                : { duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 },
            }}
          >
            {tech}
          </motion.span>
        );
      })}
    </div>
  );
}
