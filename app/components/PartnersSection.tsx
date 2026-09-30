"use client";

import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import Icon from "./Icon";
import SectionHead from "./SectionHead";
import Aurora from "./Aurora";
import { spot } from "./spotlight";
import { staggerContainer, staggerItem, scrollViewport } from "./motion";
import { useLang } from "../i18n/lang";

/**
 * Лента, реагирующая на прокрутку: едет сама, а от скорости скролла разгоняется
 * (и разворачивается при скролле вверх). Двигается один элемент через transform.
 * При prefers-reduced-motion — статичный ряд (см. CSS `.marquee-track`).
 */
function VelocityMarquee({ items }: { items: string[] }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [-1500, 0, 1500], [-4, 0, 4], { clamp: false });
  const dir = useRef(1);
  const x = useTransform(baseX, (v) => `${v}%`);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const b = boost.get();
    if (b < -0.05) dir.current = -1;
    else if (b > 0.05) dir.current = 1;
    let move = dir.current * -1.4 * (delta / 1000) * (1 + Math.abs(b));
    let next = baseX.get() + move;
    // бесшовная петля: сдвиг на ровно одну копию списка (0 … -50%)
    if (next <= -50) next += 50;
    if (next > 0) next -= 50;
    baseX.set(next);
  });

  return (
    <div className="marquee overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <motion.div style={{ x }} className="marquee-track" >
        {[0, 1].map((dup) => (
          <ul key={dup} aria-hidden={dup === 1 ? true : undefined} className="flex flex-none items-center gap-10 pr-10 sm:gap-14 sm:pr-14">
            {items.map((p) => (
              <li key={p} className="flex items-center gap-10 whitespace-nowrap font-display text-2xl font-bold tracking-tight text-foreground/70 sm:gap-14 sm:text-4xl">
                {p}
                <span aria-hidden className="h-2 w-2 rotate-45 bg-accent" />
              </li>
            ))}
          </ul>
        ))}
      </motion.div>
    </div>
  );
}

export default function PartnersSection() {
  const { tr } = useLang();

  const binom = tr("BINOM им. Абиша Кекильбаева", "Әбіш Кекілбаев атындағы BINOM", "BINOM named after Abish Kekilbayev");
  const partners = ["Astana Hub", "Astana IT University", "Astana Daryny", "TrustExam", "JUZ40", "CAP Education", binom];

  const hackathons = [
    {
      year: "2024",
      badge: tr("Республиканский хакатон · 2024", "Республикалық хакатон · 2024", "National hackathon · 2024"),
      title: "BICAP 2024",
      desc: tr("Организовали республиканский хакатон для школьников вместе с Astana Daryny и BINOM им. Абиша Кекильбаева.", "Astana Daryny және Әбіш Кекілбаев атындағы BINOM-мен бірге оқушыларға арналған республикалық хакатон өткіздік.", "We ran a national school hackathon together with Astana Daryny and BINOM named after Abish Kekilbayev."),
      partnersLabel: tr("Партнёры", "Серіктестер", "Partners"),
      partners: ["Astana Daryny", binom],
    },
    {
      year: "2025",
      badge: tr("Республиканский хакатон · 2025", "Республикалық хакатон · 2025", "National hackathon · 2025"),
      title: "Astana IT University",
      desc: tr("Провели республиканский хакатон на базе Astana IT University при поддержке сильных партнёров и спонсоров.", "Astana IT University базасында күшті серіктестер мен демеушілердің қолдауымен республикалық хакатон өткіздік.", "We held a national hackathon at Astana IT University, backed by strong partners and sponsors."),
      partnersLabel: tr("Партнёры и спонсоры", "Серіктестер мен демеушілер", "Partners & sponsors"),
      partners: ["Astana IT University", "Astana Hub", "Astana Daryny", "TrustExam", "JUZ40", "CAP Education"],
    },
  ];

  return (
    <motion.section
      id="partners"
      className="sheet relative overflow-hidden bg-muted pb-20 pt-24 sm:pb-28 sm:pt-32"
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      variants={staggerContainer}
    >
      <Aurora soft />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHead
          index="03"
          eyebrow={tr("Нам доверяют", "Бізге сенеді", "Trusted by")}
          title={
            <>
              {tr("Мы не просто учим — ", "Біз жай үйретпейміз — ", "We don't just teach — ")}
              <span className="text-accent">{tr("проводим республиканские хакатоны", "республикалық хакатондар өткіземіз", "we run national hackathons")}</span>
            </>
          }
          lead={tr("Команда Alfa Z уже дважды организовала республиканские хакатоны вместе с ведущими вузами, школами и IT-компаниями Казахстана.", "Alfa Z командасы Қазақстанның жетекші жоғары оқу орындары, мектептері мен IT-компанияларымен бірге республикалық хакатондарды екі рет өткізді.", "The Alfa Z team has already organized two national hackathons together with leading universities, schools, and IT companies of Kazakhstan.")}
        />
      </div>

      {/* Лента партнёров на всю ширину — ускоряется от скролла */}
      <motion.div variants={staggerItem} className="mb-14 sm:mb-20">
        <VelocityMarquee items={partners} />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
          {hackathons.map((h) => (
            <motion.article key={h.year} variants={staggerItem} onPointerMove={spot} className="spotlight relative overflow-hidden rounded-3xl border border-foreground/10 bg-surface/80 p-7 sm:p-9 md:backdrop-blur-xl">
              <span aria-hidden className="outline-num pointer-events-none absolute -right-3 -top-6 select-none font-display text-[7.5rem] font-bold leading-none tracking-[-0.06em] text-accent/30 sm:text-[9rem]">{h.year}</span>
              <span className="relative inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                <Icon name="award" className="h-3.5 w-3.5" /> {h.badge}
              </span>
              <h3 className="relative mb-3 mt-16 font-display text-2xl font-bold tracking-tight sm:mt-20 sm:text-3xl">{h.title}</h3>
              <p className="relative mb-6 text-sm leading-relaxed text-foreground/70 sm:text-base">{h.desc}</p>
              <p className="relative mb-2 font-mono text-[11px] uppercase tracking-widest text-foreground/45">{h.partnersLabel}</p>
              <div className="relative flex flex-wrap gap-2">
                {h.partners.map((p) => (
                  <span key={p} className="rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-foreground/70">{p}</span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
