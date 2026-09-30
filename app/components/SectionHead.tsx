"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { EASE } from "./motion";

// Заголовок «проявляется из размытия» — один раз при входе в экран.
const blurReveal: Variants = {
  hidden: { opacity: 0, y: 36, filter: "blur(14px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transitionEnd: { filter: "none" },
    transition: { duration: 0.9, ease: EASE, delay: 0.08 },
  },
};

// Обёртка только проявляется (движение — у заголовка)
const wrap: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } };

// Линия рядом с индексом «выезжает» слева
const growLine: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.8, ease: EASE, delay: 0.1 } },
};

/**
 * Единый заголовок секции в «редакционном» стиле:
 * индекс `01` + линия + моно-подпись, крупный заголовок слева, лид справа.
 * Цвет наследуется от секции (currentColor), поэтому работает и на светлом, и на тёмном фоне.
 */
export default function SectionHead({
  index,
  eyebrow,
  title,
  lead,
  className = "",
}: {
  index: string;
  eyebrow: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={wrap} className={`mb-12 sm:mb-16 grid gap-6 lg:grid-cols-12 lg:items-end ${className}`}>
      <div className="min-w-0 lg:col-span-7">
        <div className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em]">
          <span className="font-bold text-accent">{index}</span>
          <motion.span variants={growLine} aria-hidden className="h-px w-10 origin-left bg-current opacity-30" />
          <span className="min-w-0 opacity-60 [overflow-wrap:anywhere]">{eyebrow}</span>
        </div>
        <motion.h2
          variants={blurReveal}
          className="font-display text-[length:clamp(2rem,4.6vw,3.6rem)] font-bold leading-[1.05] tracking-[-0.03em]"
        >
          {title}
        </motion.h2>
      </div>
      {lead && <p className="text-lg leading-relaxed opacity-70 lg:col-span-5 lg:pb-1.5">{lead}</p>}
    </motion.div>
  );
}
