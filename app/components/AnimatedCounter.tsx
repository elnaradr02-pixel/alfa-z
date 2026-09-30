"use client";

import { useRef, useEffect } from "react";
import { motion, useTransform, useInView, animate, useMotionValue, useReducedMotion } from "framer-motion";

// 🔢 Анимированный счётчик 0 → N.
// Устойчив к «залипанию на 0»: порог входа низкий, при prefers-reduced-motion
// или если анимация не отработала за N мс — показываем итоговое число.
export default function AnimatedCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  // amount пониже + margin — чтобы счётчик срабатывал даже на невысоких экранах.
  const isInView = useInView(ref, { once: true, amount: 0.2, margin: "0px 0px -10% 0px" });
  // Initial = целевое значение: до срабатывания JS первый рендер сразу
  // показывает финальную цифру, а не «0» / «0+».
  const count = useMotionValue(to);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    // reduced-motion → остаёмся на конечном значении, без анимации.
    if (reduce) {
      count.set(to);
      return;
    }
    if (isInView) {
      // Короткий «доскок» от близкого к цели числа, а не от нуля.
      count.set(Math.max(0, Math.round(to * 0.7)));
      const controls = animate(count, to, { duration: 1.4, ease: [0.16, 1, 0.3, 1] });
      return () => controls.stop();
    }
  }, [isInView, reduce, count, to]);

  // Fallback: как только счётчик во вьюпорте — гарантируем достижение цели за 2.2с,
  // даже если animate() не запустился (медленный JS / сбой анимации).
  useEffect(() => {
    if (!isInView && !reduce) return;
    const t = setTimeout(() => {
      if (count.get() < to) count.set(to);
    }, 2200);
    return () => clearTimeout(t);
  }, [isInView, reduce, count, to]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
}
