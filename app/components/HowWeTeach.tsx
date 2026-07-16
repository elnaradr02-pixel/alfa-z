"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon, { type IconName } from "./Icon";
import { useDeviceCapabilities } from "./useDeviceCapabilities";
import { useLang } from "../i18n/lang";

type Tr = (ru: string, kz: string, en: string) => string;

type Principle = {
  number: string;
  icon: IconName;
  short: string;
  title: string;
  lead: string;
  points: { label: string; text: string }[];
};

function makePrinciples(tr: Tr): Principle[] {
  return [
    {
      number: "01",
      icon: "sparkle",
      short: tr("AI как инструмент", "AI — құрал", "AI as a tool"),
      title: tr("AI как инструмент. Не как замена", "AI — құрал. Алмастырушы емес", "AI as a tool. Not a replacement"),
      lead: tr("Мы не делаем вид, что ChatGPT не существует. Учим работать с ним правильно.", "Біз ChatGPT жоқтай сыңай танытпаймыз. Онымен дұрыс жұмыс істеуді үйретеміз.", "We don't pretend ChatGPT doesn't exist. We teach working with it properly."),
      points: [
        { label: tr("Этап 1 — vibe-coding", "1-кезең — vibe-coding", "Stage 1 — vibe-coding"), text: tr("Ученик за 3 недели получает рабочий результат с помощью AI. Видит вау-эффект, влюбляется в IT.", "Оқушы 3 аптада AI көмегімен жұмыс істейтін нәтиже алады. Вау-әсерді көреді, IT-ге ғашық болады.", "In 3 weeks the student gets a working result with AI. They see the wow-effect and fall in love with IT.") },
        { label: tr("Этап 2 — отбираем AI", "2-кезең — AI-ды алып қоямыз", "Stage 2 — taking AI away"), text: tr("Учим читать чужой код, объяснять ошибки, рефакторить. AI помогает понять, а не пишет за ученика.", "Бөгде кодты оқуды, қателерді түсіндіруді, рефакторингті үйретеміз. AI түсінуге көмектеседі, оқушының орнына жазбайды.", "We teach reading others' code, explaining errors, refactoring. AI helps you understand, not write for you.") },
        { label: tr("Защита — без AI", "Қорғау — AI-сыз", "Defense — without AI"), text: tr("На итоговой защите ученик работает один. Всё, что показывает — его. Так же на реальных собеседованиях.", "Қорытынды қорғауда оқушы жалғыз жұмыс істейді. Көрсеткенінің бәрі — өзінікі. Нақты сұхбаттарда да солай.", "At the final defense the student works alone. Everything they show is their own. Just like in real interviews.") },
      ],
    },
    {
      number: "02",
      icon: "trending",
      short: tr("Никто не застревает", "Ешкім тұрып қалмайды", "No one gets stuck"),
      title: tr("Никто не застревает на уроке", "Ешкім сабақта тұрып қалмайды", "No one gets stuck on a lesson"),
      lead: tr("У каждого домашнего задания — два уровня. Если основной не получается, открывается облегчённый.", "Әр үй тапсырмасының екі деңгейі бар. Негізгісі шықпаса, жеңілдетілгені ашылады.", "Every homework has two levels. If the main one doesn't work out, an easier one unlocks."),
      points: [
        { label: tr("Уровень 1 — основной", "1-деңгей — негізгі", "Level 1 — main"), text: tr("Полноценное задание без подсказок. Если ученик справился — двигаемся дальше.", "Нұсқаусыз толыққанды тапсырма. Оқушы орындаса — әрі қарай жүреміз.", "A full task with no hints. If the student manages — we move on.") },
        { label: tr("Уровень 2 — облегчённый", "2-деңгей — жеңілдетілген", "Level 2 — easier"), text: tr("Открывается через 48 часов или по запросу. Готовый шаблон кода (60-70%), подсказки с таймкодами видео.", "48 сағаттан кейін не сұраныс бойынша ашылады. Дайын код шаблоны (60-70%), видео таймкодтарымен кеңестер.", "Unlocks after 48 hours or on request. A ready code template (60–70%), hints with video timecodes.") },
        { label: tr("Главное — движение", "Ең бастысы — қозғалыс", "The point — momentum"), text: tr("Ученик не сидит неделю на одной задаче. Освоил облегчённый — идёт дальше. Уровень 2 — не стыдно.", "Оқушы бір тапсырмада апта бойы отырмайды. Жеңілдетілгенін меңгерді — әрі қарай кетеді. 2-деңгей — ұят емес.", "The student doesn't sit on one task for a week. Master the easier one — move on. Level 2 is nothing to be ashamed of.") },
      ],
    },
    {
      number: "03",
      icon: "award",
      short: tr("Результат каждый урок", "Әр сабақта нәтиже", "A result every lesson"),
      title: tr("Результат для родителей — после каждого урока", "Ата-аналар үшін нәтиже — әр сабақтан кейін", "A result for parents — after every lesson"),
      lead: tr("Не «через полгода покажем сертификат». А уже сегодня — конкретный артефакт со ссылкой.", "«Жарты жылдан кейін сертификат көрсетеміз» емес. Бүгін-ақ — сілтемесі бар нақты нәтиже.", "Not 'we'll show a certificate in six months'. Today already — a concrete artifact with a link."),
      points: [
        { label: tr("После урока про Telegram-бота", "Telegram-бот сабағынан кейін", "After the Telegram bot lesson"), text: tr("Родитель пишет /start своему боту в Telegram и получает ответ. Бот реально работает 24/7.", "Ата-ана Telegram-да өз ботына /start жазып, жауап алады. Бот шынымен 24/7 жұмыс істейді.", "The parent texts /start to their bot on Telegram and gets a reply. The bot really runs 24/7.") },
        { label: tr("После урока про мобильное", "Мобильді сабақтан кейін", "After the mobile lesson"), text: tr("Родитель устанавливает APK на свой телефон и пользуется приложением, которое сделал ребёнок.", "Ата-ана APK-ны өз телефонына орнатып, баласы жасаған қосымшаны пайдаланады.", "The parent installs the APK on their phone and uses the app their child built.") },
        { label: tr("Сертификат — каждые 3 недели", "Сертификат — әр 3 апта сайын", "A certificate — every 3 weeks"), text: tr("За весь курс ученик получает 6–14 сертификатов (по одному за каждый блок). Виден прогресс, а не «всё в конце».", "Бүкіл курста оқушы 6–14 сертификат алады (әр блокқа біреуден). Прогресс көрінеді, «бәрі соңында» емес.", "Over the whole course the student earns 6–14 certificates (one per block). Progress is visible, not 'everything at the end'.") },
      ],
    },
  ];
}

/* Панель одного принципа — используется и в pin-режиме, и статично. */
function PrinciplePanel({ p, animatePoints }: { p: Principle; animatePoints: boolean }) {
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
        <p className="text-lg text-[#FFFBF5]/70 leading-relaxed mb-7">{p.lead}</p>
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
                <p className="font-semibold text-[#FFFBF5] mb-1">{pt.label}</p>
                <p className="text-sm text-[#FFFBF5]/65 leading-relaxed">{pt.text}</p>
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
  const { tr } = useLang();
  const PRINCIPLES = makePrinciples(tr);
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
                className={`font-display text-sm font-bold transition-colors ${i === active ? "text-accent" : "text-[#FFFBF5]/40"}`}
              >
                {p.number}
              </span>
              <span className="relative h-1 w-10 sm:w-16 rounded-full bg-white/10 overflow-hidden">
                <span
                  className={`absolute inset-y-0 left-0 rounded-full bg-accent transition-all duration-500 ${i < active ? "w-full" : i === active ? "w-full" : "w-0"}`}
                />
              </span>
              <span className={`hidden sm:inline text-xs font-medium transition-colors ${i === active ? "text-[#FFFBF5]" : "text-[#FFFBF5]/40"}`}>
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
