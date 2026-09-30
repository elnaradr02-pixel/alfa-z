"use client";

import { useRef, type CSSProperties } from "react";
import Image, { getImageProps } from "next/image";
import { motion, useAnimationFrame, useInView, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import Icon from "./Icon";
import SectionHead from "./SectionHead";
import Aurora from "./Aurora";
import Magnetic from "./Magnetic";
import { spot } from "./spotlight";
import { useDeviceCapabilities } from "./useDeviceCapabilities";
import aituWide from "@/public/assets/hackathons/aitu-2025-wide.jpg";
import aituMobile from "@/public/assets/hackathons/aitu-2025-mobile.jpg";
import bicapCard from "@/public/assets/hackathons/bicap-2024-card.jpg";
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

// Размеры кадра AITU: на десктопе — ширина контейнера, на телефоне — экран минус поля
const AITU_SIZES_DESK = "(min-width: 1280px) 1216px, calc(100vw - 64px)";
const AITU_SIZES_MOB = "calc(100vw - 48px)";

export default function PartnersSection({ openApply }: { openApply: () => void }) {
  const { tr } = useLang();
  const { canRender3D } = useDeviceCapabilities();

  // Кадр AITU: «раскрытие» (clip-path, CSS .photo-reveal, только десктоп) + лёгкий параллакс-зум
  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(frameRef, { once: true, amount: 0.3 });
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

  const altAitu = tr(
    "Республиканский хакатон для школьников в Astana IT University, 2025: участники и организаторы с сертификатами на сцене, на экране — название хакатона",
    "Astana IT University, 2025 жыл: мектеп оқушыларына арналған республикалық хакатонның қатысушылары мен ұйымдастырушылары сахнада сертификаттарымен тұр, экранда — хакатон атауы",
    "National hackathon for school students at Astana IT University, 2025: participants and organizers on stage with certificates, the hackathon title on the screen",
  );
  const altBicap = tr(
    "Участники и организаторы хакатона BICAP 2024 с сертификатами, позади — баннер хакатона",
    "BICAP 2024 хакатонының қатысушылары мен ұйымдастырушылары сертификаттарын ұстап тұр, артта — хакатон баннері",
    "BICAP 2024 hackathon participants and organizers holding certificates, with the hackathon banner behind them",
  );

  // Арт-дирекшн: на телефоне — вертикальный кадр 4:5, на десктопе — широкий 2:1; скачивается только один
  const { props: { srcSet: aituDesk } } = getImageProps({ alt: altAitu, src: aituWide, sizes: AITU_SIZES_DESK });
  const { props: { srcSet: aituMob, ...aituRest } } = getImageProps({ alt: altAitu, src: aituMobile, sizes: AITU_SIZES_MOB });

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

  const [bicap, aitu] = hackathons;

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

        {/* 📸 AITU 2025 — главный кадр: реальное событие вместо слов */}
        <motion.figure variants={staggerItem} className="relative mb-14 sm:mb-20">
          <div
            ref={frameRef}
            data-in={inView}
            className="photo-reveal relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[#0F0F1A] bg-cover bg-center bg-[image:var(--blur-m)] shadow-[0_40px_120px_-50px_rgba(15,15,26,0.55)] ring-1 ring-foreground/10 md:aspect-[2/1] md:rounded-[2.25rem] md:bg-[image:var(--blur-d)]"
            style={{ "--blur-m": `url(${aituMobile.blurDataURL})`, "--blur-d": `url(${aituWide.blurDataURL})` } as CSSProperties}
          >
            <motion.div style={canRender3D ? { scale } : undefined} className="absolute inset-0">
              <picture>
                <source media="(min-width: 768px)" srcSet={aituDesk} sizes={AITU_SIZES_DESK} />
                {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
                <img
                  {...aituRest}
                  srcSet={aituMob}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-[50%_30%] md:object-[50%_62%]"
                />
              </picture>
            </motion.div>

            <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-[#0F0F1A]/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-[#FFFBF5] md:left-6 md:top-6 md:backdrop-blur-md">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
              {tr("Фото с хакатона · 2025", "Хакатоннан фото · 2025", "Photo from the hackathon · 2025")}
            </span>

            {/* Телефон: в вертикальном кадре нет надписи с экрана — дублируем её плашкой на пустой сцене */}
            <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#0F0F1A]/90 via-[#0F0F1A]/55 to-transparent px-5 pb-5 pt-14 text-[#FFFBF5] md:hidden">
              <p className="font-mono text-[11px] uppercase tracking-widest text-accent-soft">Astana IT University · 2025</p>
              <p className="mt-1 font-display text-xl font-bold leading-tight text-balance">
                {tr("Республиканский хакатон для школьников", "Мектеп оқушыларына арналған республикалық хакатон", "National hackathon for school students")}
              </p>
            </div>
          </div>

          <span aria-hidden className="outline-num pointer-events-none absolute -bottom-12 right-6 z-20 hidden select-none font-display text-[10rem] font-bold leading-none tracking-[-0.06em] md:block">2025</span>

          <figcaption className="mt-5 grid gap-5 md:mt-8 md:grid-cols-12 md:gap-10">
            <div className="hidden md:col-span-5 md:block">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                <Icon name="award" className="h-3.5 w-3.5" /> {aitu.badge}
              </span>
              <h3 className="mt-3 font-display text-3xl font-bold tracking-tight">{aitu.title}</h3>
            </div>
            <div className="md:col-span-7">
              <p className="mb-5 text-sm leading-relaxed text-foreground/70 sm:text-base">{aitu.desc}</p>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-foreground/45">{aitu.partnersLabel}</p>
              <div className="flex flex-wrap gap-2">
                {aitu.partners.map((p) => (
                  <span key={p} className="rounded-lg bg-surface px-2.5 py-1 text-xs font-semibold text-foreground/70">{p}</span>
                ))}
              </div>
            </div>
          </figcaption>
        </motion.figure>
      </div>

      {/* Лента партнёров на всю ширину — ускоряется от скролла */}
      <motion.div variants={staggerItem} className="mb-14 sm:mb-20">
        <VelocityMarquee items={partners} />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        {/* 📸 BICAP 2024 — фото в окне «редактора» + карточка с текстом */}
        <motion.div variants={staggerItem} className="grid items-center gap-6 md:grid-cols-12 md:gap-10">
          <figure className="group md:col-span-5">
            <div className="relative w-full max-w-[460px] overflow-hidden rounded-2xl border border-foreground/10 bg-[#0F0F1A] shadow-2xl shadow-[#0F0F1A]/25">
              <div aria-hidden className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B47]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFB088]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFFBF5]/40" />
                <span className="ml-1 truncate font-mono text-[11px] text-white/45">~/hackathons/bicap-2024.jpg</span>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={bicapCard}
                  alt={altBicap}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 768px) 460px, calc(100vw - 48px)"
                  className="object-cover object-[50%_50%] transition-transform duration-700 motion-reduce:transform-none md:group-hover:scale-[1.03]"
                />
                <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-2 rounded-full bg-[#0F0F1A]/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-[#FFFBF5]">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {tr("Фото с хакатона · 2024", "Хакатоннан фото · 2024", "Photo from the hackathon · 2024")}
                </span>
              </div>
            </div>
          </figure>

          <article onPointerMove={spot} className="spotlight relative overflow-hidden rounded-3xl border border-foreground/10 bg-surface/80 p-7 sm:p-9 md:col-span-7 md:backdrop-blur-xl">
            <span aria-hidden className="outline-num pointer-events-none absolute -right-3 -top-6 select-none font-display text-[7.5rem] font-bold leading-none tracking-[-0.06em] sm:text-[9rem]">{bicap.year}</span>
            <span className="relative inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
              <Icon name="award" className="h-3.5 w-3.5" /> {bicap.badge}
            </span>
            <h3 className="relative mb-3 mt-5 font-display text-2xl font-bold tracking-tight sm:text-3xl">{bicap.title}</h3>
            <p className="relative mb-6 text-sm leading-relaxed text-foreground/70 sm:text-base">{bicap.desc}</p>
            <p className="relative mb-2 font-mono text-[11px] uppercase tracking-widest text-foreground/45">{bicap.partnersLabel}</p>
            <div className="relative flex flex-wrap gap-2">
              {bicap.partners.map((p) => (
                <span key={p} className="rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-foreground/70">{p}</span>
              ))}
            </div>
          </article>
        </motion.div>

        {/* Призыв: после доказательства — первый шаг */}
        <motion.div variants={staggerItem} className="mt-10 flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-surface/70 p-5 sm:mt-14 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="font-display text-lg font-semibold leading-snug sm:text-xl">
            {tr("Всё начинается с первой строчки кода.", "Бәрі алғашқы код жолынан басталады.", "It all starts with the first line of code.")}
          </p>
          <Magnetic strength={0.2} className="w-full sm:w-auto">
            <button onClick={openApply} className="btn-arrow shine glow-hover inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-accent px-5 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-accent/30 transition-colors hover:bg-accent-hover sm:w-auto sm:px-7 sm:text-base">
              {tr("Записаться на пробный урок", "Сынақ сабаққа жазылу", "Book a trial lesson")} <span className="arrow" aria-hidden>→</span>
            </button>
          </Magnetic>
        </motion.div>
      </div>
    </motion.section>
  );
}
