"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon, { type IconName } from "./Icon";
import { useDeviceCapabilities } from "./useDeviceCapabilities";

const PRINCIPLES: {
  number: string;
  icon: IconName;
  short: string;
  title: string;
  lead: string;
  points: { label: string; text: string }[];
}[] = [
  {
    number: "01",
    icon: "sparkle",
    short: "AI как инструмент",
    title: "AI как инструмент. Не как замена",
    lead: "Мы не делаем вид, что ChatGPT не существует. Учим работать с ним правильно.",
    points: [
      { label: "Этап 1 — vibe-coding", text: "Ученик за 3 недели получает рабочий результат с помощью AI. Видит вау-эффект, влюбляется в IT." },
      { label: "Этап 2 — отбираем AI", text: "Учим читать чужой код, объяснять ошибки, рефакторить. AI помогает понять, а не пишет за ученика." },
      { label: "Защита — без AI", text: "На итоговой защите ученик работает один. Всё, что показывает — его. Так же на реальных собеседованиях." },
    ],
  },
  {
    number: "02",
    icon: "trending",
    short: "Никто не застревает",
    title: "Никто не застревает на уроке",
    lead: "У каждого домашнего задания — два уровня. Если основной не получается, открывается облегчённый.",
    points: [
      { label: "Уровень 1 — основной", text: "Полноценное задание без подсказок. Если ученик справился — двигаемся дальше." },
      { label: "Уровень 2 — облегчённый", text: "Открывается через 48 часов или по запросу. Готовый шаблон кода (60-70%), подсказки с таймкодами видео." },
      { label: "Главное — движение", text: "Ученик не сидит неделю на одной задаче. Освоил облегчённый — идёт дальше. Уровень 2 — не стыдно." },
    ],
  },
  {
    number: "03",
    icon: "award",
    short: "Результат каждый урок",
    title: "Результат для родителей — после каждого урока",
    lead: "Не «через полгода покажем сертификат». А уже сегодня — конкретный артефакт со ссылкой.",
    points: [
      { label: "После урока про Telegram-бота", text: "Родитель пишет /start своему боту в Telegram и получает ответ. Бот реально работает 24/7." },
      { label: "После урока про мобильное", text: "Родитель устанавливает APK на свой телефон и пользуется приложением, которое сделал ребёнок." },
      { label: "Сертификат — каждые 3 недели", text: "За весь курс ученик получает 6–14 сертификатов (по одному за каждый блок). Виден прогресс, а не «всё в конце»." },
    ],
  },
];

/* Панель одного принципа — используется и в pin-режиме, и статично. */
function PrinciplePanel({ p, animatePoints }: { p: (typeof PRINCIPLES)[number]; animatePoints: boolean }) {
  return (
    <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-14 items-center">
      {/* Крупный визуал принципа */}
      <div className="relative aspect-[4/3] sm:aspect-square max-w-md mx-auto w-full">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/40 via-accent-soft/25 to-transparent shadow-xl shadow-accent/20 rotate-3" />
        <div className="absolute inset-0 rounded-3xl bg-white/[0.05] border border-white/10 shadow-lg flex items-center justify-center -rotate-3">
          <div className="text-center p-8">
            <div className="mx-auto mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <Icon name={p.icon} className="h-10 w-10" />
            </div>
            <p className="font-display text-7xl font-bold text-accent/20">{p.number}</p>
          </div>
        </div>
      </div>
      {/* Текст */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="font-display text-4xl font-bold text-accent/30">{p.number}</span>
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Icon name={p.icon} className="h-5 w-5" />
          </span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4">{p.title}</h3>
        <p className="text-lg text-[#F5E6D3]/70 leading-relaxed mb-7">{p.lead}</p>
        <div className="space-y-5">
          {p.points.map((pt, idx) => (
            <motion.div
              key={pt.label}
              className="flex gap-4"
              initial={animatePoints ? { opacity: 0, x: 24 } : false}
              animate={animatePoints ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.5, delay: 0.15 + idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent mt-2.5" />
              <div>
                <p className="font-semibold text-[#F5E6D3] mb-1">{pt.label}</p>
                <p className="text-sm text-[#F5E6D3]/65 leading-relaxed">{pt.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HowWeTeach() {
  const { canRender3D, mounted } = useDeviceCapabilities();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Pin-режим только на десктопе без reduced-motion (canRender3D = mounted && !reduced && !mobile).
  const pin = canRender3D;

  useEffect(() => {
    if (!pin || !wrapperRef.current || !stageRef.current) return;
    let st: { kill: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const n = PRINCIPLES.length;
      // ВАЖНО: без pin — GSAP не трогает DOM (иначе конфликт с React: removeChild).
      // Закрепление делает CSS `sticky`, ScrollTrigger лишь отдаёт прогресс.
      const trigger = ScrollTrigger.create({
        trigger: wrapperRef.current!,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const idx = Math.min(n - 1, Math.floor(self.progress * n));
          setActive((prev) => (prev === idx ? prev : idx));
        },
      });
      st = trigger;
      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      st?.kill();
    };
  }, [pin]);

  // Статичный режим (мобильный / reduced-motion / до гидрации).
  if (!pin) {
    return (
      <div className="space-y-20 sm:space-y-28">
        {PRINCIPLES.map((p, i) => (
          <motion.div
            key={i}
            initial={mounted ? { opacity: 0, y: 40 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <PrinciplePanel p={p} animatePoints={false} />
          </motion.div>
        ))}
      </div>
    );
  }

  // Pin-режим: высокий wrapper даёт дистанцию скролла, stage закрепляется.
  return (
    <div ref={wrapperRef} style={{ height: `${PRINCIPLES.length * 100}vh` }}>
      <div ref={stageRef} className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* Прогресс-степпер */}
        <div className="flex items-center gap-3 sm:gap-4 mb-8 lg:mb-10">
          {PRINCIPLES.map((p, i) => (
            <button
              key={p.number}
              onClick={() => {
                // Клик по шагу — доскроллить к нужному сегменту.
                const wrap = wrapperRef.current;
                if (!wrap) return;
                const seg = wrap.offsetHeight - window.innerHeight;
                const y = wrap.offsetTop + (seg * (i + 0.5)) / PRINCIPLES.length;
                window.scrollTo({ top: y, behavior: "smooth" });
              }}
              className="cursor-target group flex items-center gap-2.5"
            >
              <span
                className={`font-display text-sm font-bold transition-colors ${i === active ? "text-accent" : "text-[#F5E6D3]/40"}`}
              >
                {p.number}
              </span>
              <span className="relative h-1 w-10 sm:w-16 rounded-full bg-white/10 overflow-hidden">
                <span
                  className={`absolute inset-y-0 left-0 rounded-full bg-accent transition-all duration-500 ${i < active ? "w-full" : i === active ? "w-full" : "w-0"}`}
                />
              </span>
              <span className={`hidden sm:inline text-xs font-medium transition-colors ${i === active ? "text-[#F5E6D3]" : "text-[#F5E6D3]/40"}`}>
                {p.short}
              </span>
            </button>
          ))}
        </div>

        {/* Активный принцип с кросс-фейдом */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <PrinciplePanel p={PRINCIPLES[active]} animatePoints />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
