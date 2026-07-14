"use client";

import { useEffect, useState } from "react";

/**
 * Единая точка решения «показывать ли тяжёлое 3D».
 *
 * Возвращает флаги, по которым каждая секция сама решает: рендерить WebGL-сцену
 * или лёгкий статичный фолбэк. Так мы уважаем prefers-reduced-motion и не грузим
 * three.js на телефоны родителей — Lighthouse на мобильном не проседает.
 *
 * `canRender3D` становится true только на клиенте, на не-мобильном экране и
 * когда пользователь не просил уменьшить анимации.
 */
export function useDeviceCapabilities() {
  // mounted нужен, чтобы SSR и первый клиентский рендер совпадали (никакого 3D
  // до гидрации — иначе гидрационная рассинхронизация).
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    setMounted(true);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const pointerQuery = window.matchMedia("(pointer: coarse)");

    const sync = () => {
      setReducedMotion(motionQuery.matches);
      setIsMobile(mobileQuery.matches);
      setIsCoarsePointer(pointerQuery.matches);
    };
    sync();

    motionQuery.addEventListener("change", sync);
    mobileQuery.addEventListener("change", sync);
    pointerQuery.addEventListener("change", sync);
    return () => {
      motionQuery.removeEventListener("change", sync);
      mobileQuery.removeEventListener("change", sync);
      pointerQuery.removeEventListener("change", sync);
    };
  }, []);

  const canRender3D = mounted && !reducedMotion && !isMobile;

  return { mounted, reducedMotion, isMobile, isCoarsePointer, canRender3D };
}
