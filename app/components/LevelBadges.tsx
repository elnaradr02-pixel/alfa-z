"use client";

import { motion } from "framer-motion";

/**
 * Бейджи уровней 1–5 в terminal/achievement-стиле: шестиугольник (hex) с
 * номером в моноширинном шрифте. Уровни 1–3 «открыты» (коралловый контур +
 * glow), 4–5 — «закрыты» (пунктир, приглушённые). Единая SVG-серия — крипко,
 * легко, консистентно. Цвета захардкожены hex: CSS-переменные не работают
 * в presentation-атрибуте fill/stroke у inline-SVG.
 */

const LEVELS = [1, 2, 3, 4, 5];
const HEX_OUTER = "M50 4 L92 28 L92 84 L50 108 L8 84 L8 28 Z";
const HEX_INNER = "M50 14 L83 33 L83 79 L50 98 L17 79 L17 33 Z";

function HexBadge({ level, active }: { level: number; active: boolean }) {
  return (
    <svg
      viewBox="0 0 100 112"
      className="h-full w-full"
      role="img"
      aria-label={`Уровень ${level}${active ? "" : " — ещё закрыт"}`}
    >
      <path
        d={HEX_OUTER}
        fill={active ? "#0F0F1A" : "#0F0F1A"}
        stroke={active ? "#FF6B47" : "#FFB088"}
        strokeOpacity={active ? 1 : 0.3}
        strokeWidth={active ? 2.5 : 1.5}
        strokeDasharray={active ? undefined : "4 4"}
      />
      <path
        d={HEX_INNER}
        fill="none"
        stroke="#FFB088"
        strokeWidth="1"
        opacity={active ? 0.5 : 0.25}
      />
      <text
        x="50"
        y="59"
        textAnchor="middle"
        fontFamily="var(--font-space-mono), monospace"
        fontWeight="700"
        fontSize="34"
        fill="#FFB088"
        opacity={active ? 1 : 0.4}
      >
        {level}
      </text>
      <text
        x="50"
        y="82"
        textAnchor="middle"
        fontFamily="var(--font-space-mono), monospace"
        fontSize="10"
        letterSpacing="1.5"
        fill={active ? "#FF6B47" : "#FFB088"}
        opacity={active ? 0.9 : 0.4}
      >
        {active ? "LVL" : "LOCK"}
      </text>
    </svg>
  );
}

export default function LevelBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {LEVELS.map((lvl) => (
        <motion.div
          key={lvl}
          whileHover={{ y: -5, scale: 1.06 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`w-12 sm:w-14 lg:w-16 cursor-target ${lvl <= 3 ? "drop-shadow-[0_0_14px_rgba(255,107,71,0.35)]" : ""}`}
          title={`Уровень ${lvl}`}
        >
          <HexBadge level={lvl} active={lvl <= 3} />
        </motion.div>
      ))}
    </div>
  );
}
