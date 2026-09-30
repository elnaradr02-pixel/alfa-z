"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

/** Если в системе включено «Уменьшить движение» — framer-motion убирает сдвиги/размытия, оставляя смену прозрачности. */
export default function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
