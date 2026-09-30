"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useDeviceCapabilities } from "./useDeviceCapabilities";

/**
 * 3D-«подъём» блока при скролле: он лежит под углом (rotateX) и уменьшен, а по мере
 * прокрутки встаёт вертикально и вырастает до 100% — как экран MacBook в презентации Apple.
 * Только десктоп без reduced-motion; на телефонах — обычный блок.
 */
export default function ScrollTilt({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { canRender3D } = useDeviceCapabilities();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.35"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.35, 1]);

  // ref привязан всегда (иначе useScroll ругается на «не гидрированный» target);
  // анимационные стили включаем только когда 3D разрешён.
  return (
    <div ref={ref} className={className} style={canRender3D ? { perspective: 1400 } : undefined}>
      <motion.div style={canRender3D ? { rotateX, scale, opacity, transformOrigin: "50% 100%" } : undefined}>{children}</motion.div>
    </div>
  );
}
