import type { Variants } from "framer-motion";

// Единые токены движения для всего сайта: один ease, одна «ритмика».
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// Контейнер секции сам НЕ прозрачный (иначе высокая тёмная секция «вспыхивает» целиком
// и до этого на её месте пусто) — анимируются только дети.
export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const scrollViewport = { once: true, amount: 0.08 } as const;
