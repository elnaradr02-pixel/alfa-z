import type { PointerEvent } from "react";

/**
 * onPointerMove-хендлер для карточек с классом `.spotlight`:
 * пишет позицию мыши в CSS-переменные --mx/--my (подсветку рисует CSS).
 * Только мышь — на тач-экранах ничего не делает и ничего не перерисовывает.
 */
export function spot(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}
