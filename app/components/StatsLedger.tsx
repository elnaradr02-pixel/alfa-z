"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";
import SectionHead from "./SectionHead";
import { spot } from "./spotlight";
import { staggerContainer, staggerItem, scrollViewport } from "./motion";
import { useLang } from "../i18n/lang";

/** «Цифры» без карточек-с-иконками: крупные числа в сетке с тонкими разделителями. */
export default function StatsLedger() {
  const { tr } = useLang();

  const stats = [
    { value: 5, suffix: "", label: tr("направлений — от Гарвардского CS50 до геймдева", "бағыт — Гарвард CS50-ден геймдевке дейін", "tracks — from Harvard CS50 to game dev") },
    { value: 49, suffix: "", label: tr("занятий в курсе CS50: C, Python, SQL, веб", "CS50 курсындағы сабақ: C, Python, SQL, веб", "lessons in CS50: C, Python, SQL, web") },
    { value: 8, suffix: "", label: tr("человек максимум в группе, не поток из 100", "топтағы оқушылар саны, 100 адамдық ағын емес", "students max per group, not a class of 100") },
    { value: 24, suffix: "/7", label: tr("ментор на связи с каждым учеником", "ментор әр оқушымен байланыста", "a mentor in touch with every student") },
  ];

  return (
    <motion.section
      className="sheet dot-grid relative bg-background pb-20 pt-24 shadow-[0_-24px_60px_-30px_rgba(15,15,26,0.25)] sm:pb-28 sm:pt-32"
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      variants={staggerContainer}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHead
          index="01"
          eyebrow={tr("Почему это серьёзно", "Неге бұл маңызды", "Why it's serious")}
          title={
            <>
              {tr("Не хобби-кружок, а ", "Үйірме емес, ", "Not a hobby club, but ")}
              <span className="text-accent">{tr("настоящая IT-программа", "нағыз IT-бағдарлама", "a real IT program")}</span>
            </>
          }
        />

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-foreground/15 bg-foreground/15 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div key={i} variants={staggerItem} onPointerMove={spot} className="spotlight bg-background p-6 sm:p-8 lg:p-10">
              <dt className="mb-6 font-mono text-xs tracking-[0.18em] text-foreground/45">0{i + 1}</dt>
              <dd>
                <p className="font-display text-6xl font-bold leading-none tracking-[-0.04em] tabular-nums sm:text-7xl lg:text-8xl">
                  <AnimatedCounter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-5 max-w-[16rem] text-sm leading-snug text-foreground/65">{s.label}</p>
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </motion.section>
  );
}
