"use client";

import { motion } from "framer-motion";
import Icon from "./Icon";
import SectionHead from "./SectionHead";
import Aurora from "./Aurora";
import { spot } from "./spotlight";
import { staggerContainer, staggerItem, scrollViewport } from "./motion";
import { useLang } from "../i18n/lang";

// ── Мини-иллюстрации (чистый CSS/JSX, декоративные) ──

/** Окно видеозвонка: ментор + ученики. Подписи латиницей — как UI-макет, без перевода. */
function CallVisual() {
  const tiles = [
    { label: "mentor", cls: "bg-gradient-to-br from-accent to-accent-soft text-white ring-2 ring-accent ring-offset-2 ring-offset-[#0F0F1A]", letter: "M" },
    { label: "student", cls: "bg-white/10 text-white/70", letter: "A" },
    { label: "student", cls: "bg-white/10 text-white/70", letter: "D" },
    { label: "student", cls: "bg-white/10 text-white/70", letter: "N" },
  ];
  return (
    <div aria-hidden className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-3">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/45">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-accent" /> live
        </span>
        <span>discord · 60:00</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {tiles.map((t, i) => (
          <div key={i} className={`relative flex aspect-[4/3] items-center justify-center rounded-xl font-display text-2xl font-bold ${t.cls}`}>
            {t.letter}
            <span className="absolute bottom-1.5 left-2 font-mono text-[9px] font-normal opacity-70">{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Мини-терминал с коммитом. */
function CommitVisual() {
  return (
    <div aria-hidden className="rounded-2xl border border-white/10 bg-black/30 p-4 font-mono text-[11px] leading-6 sm:text-xs">
      <p><span className="text-accent-soft">$</span> <span className="text-white/85">git commit</span> <span className="text-white/45">-m</span> <span className="text-accent">&quot;ship it&quot;</span></p>
      <p className="text-white/45">[main 3f9a1c2] ship it</p>
      <p><span className="text-accent-soft">$</span> <span className="text-white/85">npm test</span></p>
      <p className="text-accent-soft">✓ 12 passed</p>
      <p><span className="text-accent-soft">$</span> <span className="inline-block h-3.5 w-1.5 translate-y-0.5 animate-blink bg-accent-soft" /></p>
    </div>
  );
}

/** «График коммитов» в стиле GitHub — детерминированный узор (без Math.random → без hydration-ошибок). */
function ContributionVisual() {
  const cells = Array.from({ length: 7 * 14 }, (_, i) => {
    const col = Math.floor(i / 7);
    const level = ((i * 7 + col * 3 + (i % 5) * 2) % 6) - 1; // -1…4
    const boosted = col > 6 ? Math.min(4, level + 1) : level; // «растёт» к концу
    return boosted;
  });
  const tone = ["bg-white/[0.06]", "bg-accent/25", "bg-accent/45", "bg-accent/70", "bg-accent"];
  return (
    <div aria-hidden className="mt-5 grid grid-flow-col grid-rows-7 gap-[3px]">
      {cells.map((lvl, i) => (
        <span key={i} className={`aspect-square rounded-[2px] ${tone[Math.max(0, lvl)]}`} />
      ))}
    </div>
  );
}

/** Миниатюра сертификата. */
function CertVisual() {
  return (
    <div aria-hidden className="relative mt-5 rounded-xl border border-white/15 bg-gradient-to-br from-white/[0.08] to-transparent p-4">
      <div className="mb-3 flex items-center gap-2 text-accent">
        <Icon name="award" className="h-5 w-5" />
        <span className="font-mono text-[10px] uppercase tracking-widest">certificate</span>
      </div>
      <div className="space-y-2">
        <span className="block h-1.5 w-4/5 rounded-full bg-white/25" />
        <span className="block h-1.5 w-3/5 rounded-full bg-white/15" />
        <span className="block h-1.5 w-2/3 rounded-full bg-white/15" />
      </div>
      <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/40">
        <Icon name="check" className="h-4 w-4" />
      </span>
    </div>
  );
}

export default function WhyBento() {
  const { tr } = useLang();

  const card = "spotlight group relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.05] p-6 sm:p-8 transition-colors duration-300 hover:border-accent/50 hover:bg-white/[0.08] md:backdrop-blur-xl";

  return (
    <motion.section
      id="about"
      className="sheet dot-grid-dark relative overflow-hidden bg-[#0F0F1A] pb-20 pt-24 text-[#FFFBF5] sm:pb-28 sm:pt-32"
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      variants={staggerContainer}
    >
      <Aurora />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHead
          index="02"
          eyebrow={tr("Почему Alfa Z", "Неге Alfa Z", "Why Alfa Z")}
          title={
            <>
              {tr("Не курсы по видео, ", "Видеокурс емес, ", "Not video courses, ")}
              {tr("а ", "", "but ")}<span className="text-accent">{tr("настоящая школа", "нағыз мектеп", "a real school")}</span>
            </>
          }
        />

        <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
          {/* A — высокая карточка */}
          <motion.div variants={staggerItem} onPointerMove={spot} className={`${card} lg:row-span-2`}>
            <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent"><Icon name="video" className="h-5 w-5" /></span>
            <h3 className="mb-2 font-display text-2xl font-bold tracking-tight">{tr("Живые уроки", "Тікелей сабақтар", "Live lessons")}</h3>
            <p className="text-sm leading-relaxed text-[#FFFBF5]/65">{tr("Никаких бесконечных записей. Преподаватель видит каждого, отвечает на вопросы прямо на занятии.", "Шексіз жазбалар жоқ. Ұстаз әр оқушыны көреді, сұрақтарға сабақ үстінде жауап береді.", "No endless recordings. The teacher sees everyone and answers questions right in class.")}</p>
            <CallVisual />
          </motion.div>

          {/* B — широкая */}
          <motion.div variants={staggerItem} onPointerMove={spot} className={`${card} lg:col-span-2`}>
            <div className="grid items-center gap-6 sm:grid-cols-2">
              <div>
                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent"><Icon name="code" className="h-5 w-5" /></span>
                <h3 className="mb-2 font-display text-2xl font-bold tracking-tight">{tr("Преподаватели-практики", "Тәжірибелі ұстаздар", "Practicing instructors")}</h3>
                <p className="text-sm leading-relaxed text-[#FFFBF5]/65">{tr("Не теоретики из университета — все работают в IT-компаниях прямо сейчас.", "Университет теоретиктері емес — бәрі қазір IT-компанияларда жұмыс істейді.", "Not university theorists — they all work at IT companies right now.")}</p>
              </div>
              <CommitVisual />
            </div>
          </motion.div>

          {/* C */}
          <motion.div variants={staggerItem} onPointerMove={spot} className={card}>
            <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent"><Icon name="rocket" className="h-5 w-5" /></span>
            <h3 className="mb-2 font-display text-xl font-bold tracking-tight">{tr("Реальные проекты", "Нақты жобалар", "Real projects")}</h3>
            <p className="text-sm leading-relaxed text-[#FFFBF5]/65">{tr("К концу обучения у ученика портфолио на GitHub, которое можно показать работодателю.", "Оқу соңында оқушыда GitHub-та портфолио болады, оны жұмыс берушіге көрсетуге болады.", "By the end, the student has a GitHub portfolio to show an employer.")}</p>
            <ContributionVisual />
          </motion.div>

          {/* D */}
          <motion.div variants={staggerItem} onPointerMove={spot} className={card}>
            <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent"><Icon name="graduation" className="h-5 w-5" /></span>
            <h3 className="mb-2 font-display text-xl font-bold tracking-tight">{tr("Помощь после", "Оқудан кейінгі қолдау", "Support afterwards")}</h3>
            <p className="text-sm leading-relaxed text-[#FFFBF5]/65">{tr("Сертификат, помощь с резюме и подготовка к первым стажировкам в IT.", "Сертификат, резюме дайындауға көмек және алғашқы IT-тәжірибеге дайындық.", "A certificate, resume help, and prep for your first IT internships.")}</p>
            <CertVisual />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
