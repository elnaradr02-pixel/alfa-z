"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useDeviceCapabilities } from "./useDeviceCapabilities";

/**
 * Нишевый кастомный курсор: коралловое кольцо с пружинной инерцией + точка-ядро.
 * Над интерактивными элементами кольцо «прилипает» и увеличивается, точка гаснет.
 * Только для мыши (pointer:fine); на тач и при prefers-reduced-motion — ничего,
 * работает системный курсор.
 */
export default function CustomCursor() {
  const { mounted, reducedMotion, isCoarsePointer } = useDeviceCapabilities();
  const enabled = mounted && !reducedMotion && !isCoarsePointer;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 26, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 320, damping: 26, mass: 0.4 });

  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const INTERACTIVE = "a,button,[role='button'],summary,input,select,textarea,label,.cursor-target";
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
      const t = e.target as Element | null;
      setHovering(!!(t && t.closest && t.closest(INTERACTIVE)));
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
    };
  }, [enabled, x, y, visible]);

  if (!enabled) return null;

  const ringScale = (hovering ? 1.6 : 1) * (pressed ? 0.82 : 1);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
      {/* Кольцо с инерцией — деликатное, не перетягивает внимание */}
      <motion.div
        className="absolute top-0 left-0 rounded-full border border-accent/70"
        style={{
          x: ringX,
          y: ringY,
          width: 28,
          height: 28,
          marginLeft: -14,
          marginTop: -14,
        }}
        animate={{
          scale: ringScale,
          opacity: visible ? (hovering ? 1 : 0.7) : 0,
          backgroundColor: hovering ? "rgba(255,107,71,0.08)" : "rgba(255,107,71,0)",
        }}
        transition={{ scale: { type: "spring", stiffness: 260, damping: 20 }, opacity: { duration: 0.2 } }}
      />
      {/* Точка-ядро — движется без задержки */}
      <motion.div
        className="absolute top-0 left-0 rounded-full bg-accent"
        style={{ x, y, width: 5, height: 5, marginLeft: -2.5, marginTop: -2.5 }}
        animate={{ scale: hovering ? 0 : 1, opacity: visible ? 0.85 : 0 }}
        transition={{ duration: 0.18 }}
      />
    </div>
  );
}
