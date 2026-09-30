"use client";

import { Children, useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useDeviceCapabilities } from "./useDeviceCapabilities";

/**
 * «Стопка карточек»: на десктопе каждая карточка закрепляется у верхнего края и
 * следующая наезжает на неё сверху, а нижние слегка уменьшаются — глубина как у
 * колоды. На мобильном — обычная колонка без sticky (ничего не ломает скролл).
 */
function Item({ i, n, progress, enabled, children }: { i: number; n: number; progress: MotionValue<number>; enabled: boolean; children: ReactNode }) {
  const target = 1 - (n - 1 - i) * 0.035; // последняя = 1, предыдущие чуть меньше
  const scale = useTransform(progress, [i / n, 1], [1, target]);
  return (
    <div className="mb-5 md:sticky md:mb-[12vh] md:last:mb-0" style={{ top: `calc(5.5rem + ${i * 1.1}rem)` }}>
      <motion.div style={enabled ? { scale, transformOrigin: "50% 0%" } : undefined}>{children}</motion.div>
    </div>
  );
}

export default function StackedCards({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { canRender3D } = useDeviceCapabilities();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const items = Children.toArray(children);

  return (
    <div ref={ref} className="relative">
      {items.map((c, i) => (
        <Item key={i} i={i} n={items.length} progress={scrollYProgress} enabled={canRender3D}>
          {c}
        </Item>
      ))}
    </div>
  );
}
