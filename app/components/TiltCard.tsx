"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionStyle,
} from "framer-motion";
import { useDeviceCapabilities } from "./useDeviceCapabilities";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Максимальный угол наклона в градусах. */
  max?: number;
  /** Приподнимать ли карточку по Z при наведении. */
  lift?: number;
  /** Показывать ли мягкий glare-блик, следующий за курсором. */
  glare?: boolean;
  style?: MotionStyle;
};

/**
 * Лёгкий 3D-tilt: карточка поворачивается в сторону курсора на perspective.
 * На тач-устройствах и при prefers-reduced-motion наклон полностью отключается —
 * остаётся обычный статичный блок (детям и родителям на телефоне ничего не мешает).
 */
export default function TiltCard({
  children,
  className = "",
  max = 9,
  lift = 6,
  glare = true,
  style,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reducedMotion, isCoarsePointer, mounted } = useDeviceCapabilities();
  const enabled = mounted && !reducedMotion && !isCoarsePointer;

  // -0.5..0.5 нормализованная позиция курсора внутри карточки.
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const springCfg = { stiffness: 220, damping: 18, mass: 0.4 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), springCfg);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), springCfg);
  const translateZ = useSpring(0, springCfg);

  // Блик: светлое пятно едет за курсором, гаснет при уходе.
  const glareOpacity = useSpring(0, { stiffness: 180, damping: 22 });
  const glareBg = useTransform([px, py], ([x, y]: number[]) => {
    const gx = (x + 0.5) * 100;
    const gy = (y + 0.5) * 100;
    return `radial-gradient(240px circle at ${gx}% ${gy}%, rgba(255,255,255,0.18), transparent 60%)`;
  });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleEnter = () => {
    if (!enabled) return;
    translateZ.set(lift);
    glareOpacity.set(1);
  };
  const handleLeave = () => {
    px.set(0);
    py.set(0);
    translateZ.set(0);
    glareOpacity.set(0);
  };

  if (!enabled) {
    // Статичный путь — никакого transform, никаких слушателей.
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        translateZ,
        transformStyle: "preserve-3d",
        transformPerspective: 900,
        ...style,
      }}
      className={`relative ${className}`}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: glareBg, opacity: glareOpacity }}
        />
      )}
    </motion.div>
  );
}
