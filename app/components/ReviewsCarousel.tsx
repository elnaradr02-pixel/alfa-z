"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useDeviceCapabilities } from "./useDeviceCapabilities";

export type Review = {
  quote: string;
  author: string;
  role: string;
  course: string;
  rating: number;
  initials: string;
};

/**
 * 3D-coverflow карусель отзывов: карточки выгнуты по дуге, соседние повёрнуты
 * и уменьшены. Драг мышью или свайп на телефоне «вращает барабан». Стрелки и
 * точки — для доступности. Контент отзывов НЕ меняется (приходит пропсом).
 * При prefers-reduced-motion повороты выключаются — остаётся плоская лента.
 */
export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const { reducedMotion, isCoarsePointer } = useDeviceCapabilities();
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState(1024);

  const dragX = useMotionValue(0);
  const dragXSpring = useSpring(dragX, { stiffness: 260, damping: 30 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const unit = Math.min(360, width * 0.82);
  const cardW = Math.min(340, width * 0.86);

  const clamp = (i: number) => Math.max(0, Math.min(reviews.length - 1, i));
  const go = (dir: number) => setIndex((i) => clamp(i + dir));

  // Ручной драг — тактильный сдвиг ленты + смена индекса при отпускании.
  const dragging = useRef(false);
  const startX = useRef(0);
  const onDown = (e: React.PointerEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragX.set((e.clientX - startX.current) * 0.6);
  };
  const onUp = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    const dx = e.clientX - startX.current;
    dragX.set(0);
    if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
  };

  // Управление стрелками клавиатуры.
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };

  return (
    <div>
      <div
        ref={containerRef}
        className="relative h-[430px] sm:h-[400px] select-none touch-pan-y"
        style={{ perspective: 1400 }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        role="group"
        aria-label="Отзывы"
        tabIndex={0}
        onKeyDown={onKey}
      >
        <motion.div className="absolute inset-0" style={{ x: dragXSpring }}>
          {reviews.map((review, i) => {
            const offset = i - index;
            const abs = Math.abs(offset);
            // Далёкие карточки не рендерим ради лёгкости.
            if (abs > 2) return null;
            const rotateY = reducedMotion ? 0 : offset * -22;
            const scale = 1 - abs * 0.12;
            const opacity = abs > 1 ? 0.25 : 1 - abs * 0.15;
            return (
              <motion.article
                key={i}
                className="absolute top-1/2 left-1/2 rounded-2xl bg-surface border border-border shadow-xl p-6 lg:p-7 flex flex-col cursor-target"
                style={{ width: cardW, marginLeft: -cardW / 2, transformStyle: "preserve-3d" }}
                initial={false}
                animate={{
                  x: offset * unit,
                  y: "-50%",
                  rotateY,
                  scale,
                  opacity,
                  zIndex: 10 - abs,
                  filter: abs === 0 ? "none" : "saturate(0.9)",
                }}
                transition={{ type: "spring", stiffness: 220, damping: 30 }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: review.rating }).map((_, idx) => (
                    <span key={idx} className="text-accent text-lg">★</span>
                  ))}
                </div>
                <p className="text-foreground/80 leading-relaxed mb-6 flex-grow text-[15px]">«{review.quote}»</p>
                <div className="flex items-center gap-3 pt-5 border-t border-border">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-accent-soft flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {review.initials}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{review.author}</p>
                    <p className="text-xs text-foreground/55 truncate">{review.role}</p>
                  </div>
                  <span className="text-xs font-semibold text-accent px-2.5 py-1 rounded-full bg-accent/10 whitespace-nowrap">
                    {review.course}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>

      {/* Управление: стрелки + точки */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="Предыдущий отзыв"
          className="cursor-target w-11 h-11 rounded-full border border-border bg-surface flex items-center justify-center text-foreground hover:border-accent/50 hover:text-accent disabled:opacity-30 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18 9 12l6-6" /></svg>
        </button>
        <div className="flex items-center gap-2">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Отзыв ${i + 1}`}
              className={`cursor-target h-2 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-accent" : "w-2 bg-foreground/20 hover:bg-foreground/40"}`}
            />
          ))}
        </div>
        <button
          onClick={() => go(1)}
          disabled={index === reviews.length - 1}
          aria-label="Следующий отзыв"
          className="cursor-target w-11 h-11 rounded-full border border-border bg-surface flex items-center justify-center text-foreground hover:border-accent/50 hover:text-accent disabled:opacity-30 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>
      {!isCoarsePointer && (
        <p className="text-center text-xs text-foreground/40 mt-3">Перетащите карточки или используйте стрелки</p>
      )}
    </div>
  );
}
