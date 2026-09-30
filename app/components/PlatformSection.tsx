"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Icon, { type IconName } from "./Icon";
import SectionHead from "./SectionHead";
import ScrollTilt from "./ScrollTilt";
import Aurora from "./Aurora";
import { spot } from "./spotlight";
import { useDeviceCapabilities } from "./useDeviceCapabilities";
import { staggerContainer, staggerItem, scrollViewport } from "./motion";
import { useLang } from "../i18n/lang";

/**
 * «Своя авторская платформа». Все утверждения — только о функциях, которые реально
 * работают в платформе (проверено по коду alfa-z platform, 2026-09-30): личный график без
 * потоков, «Продолжить», мини-игра в уроке (9 видов), разбор ДЗ ментором (вернуть без
 * объяснения нельзя), баллы / рейтинг группы за месяц / серия недель, отставание от графика
 * видно куратору, отчёт родителю с комментарием куратора (школа отправляет каждые 3 недели —
 * подтвердила владелец), сертификат с проверкой по номеру.
 *
 * Скриншотов без личных данных детей нет — поэтому экран ученика нарисован как макет
 * с вымышленными данными. Интерфейс платформы на RU/KZ (английского нет) — в EN-версии
 * сайта подписи макета остаются русскими.
 */
export default function PlatformSection() {
  const { tr } = useLang();
  // Подписи внутри «скриншота» платформы: RU / KZ, для EN — RU (у платформы нет английского)
  const ui = (ru: string, kz: string) => tr(ru, kz, ru);

  const { canRender3D } = useDeviceCapabilities();
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { once: true, amount: 0.35 });
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start end", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const yB = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const yC = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const tiles: { icon: IconName; title: string; text: string }[] = [
    { icon: "calendar", title: tr("Свой график с первого дня", "Алғашқы күннен жеке кесте", "Their own schedule from day one"), text: tr("Потоков нет: уроки открываются по личному календарю ребёнка, а если он заболел или уехал, график ставят на паузу и сроки не сгорают.", "Ағын жоқ: сабақтар баланың жеке күнтізбесі бойынша ашылады, ал ауырып қалса не жолға шықса, кесте кідіртіліп, мерзімдер жоғалмайды.", "No cohorts: lessons open on your child's personal calendar, and if they get sick or travel, the schedule is paused and no deadlines are lost.") },
    { icon: "gamepad", title: tr("Мини-игра после каждого урока", "Әр сабақтан кейін шағын ойын", "A mini-game after every lesson"), text: tr("«Найди баг», лабиринт, кроссворд и ещё 6 видов закрепляют тему урока. Баллы начисляются за первое прохождение.", "«Қатені тап», лабиринт, кроссворд және тағы 6 түрі сабақ тақырыбын бекітеді. Алғаш өткені үшін ұпай беріледі.", "Find the Bug, a maze, a crossword and 6 more game types lock in the topic, with points for the first completion.") },
    { icon: "message", title: tr("Разбор каждой домашки", "Әр үй жұмысына талдау", "A real review for every homework"), text: tr("Ментор ставит балл и пишет рецензию. Вернуть работу на доработку без подробного объяснения платформа не даст.", "Ментор балл қойып, пікір жазады. Толық түсіндірмесіз жұмысты қайта пысықтауға қайтаруға платформа жол бермейді.", "The mentor gives a score and writes a review. The platform won't let work be sent back without a detailed explanation.") },
    { icon: "award", title: tr("Баллы, рейтинг и серии", "Ұпай, рейтинг және серия", "Points, rankings and streaks"), text: tr("Баллы за домашки, встречи и игры, рейтинг группы, который каждый месяц начинается с нуля, и серия недель без пропусков.", "Үй жұмысы, кездесу мен ойын үшін ұпай, әр ай басынан қайта басталатын топ рейтингі және сабақ босатпаған апталар сериясы.", "Points for homework, live sessions and games, a group ranking that starts fresh every month, and a streak of weeks with no missed classes.") },
    { icon: "target", title: tr("Куратор заметит отставание", "Куратор артта қалғанын байқайды", "The curator spots when they fall behind"), text: tr("Платформа сверяет прогресс ребёнка с его личным графиком, и куратор увидит, если ребёнок отстал на неделю.", "Платформа баланың ілгерілеуін оның жеке кестесімен салыстырады. Бала бір аптаға артта қалса, куратор оны көреді.", "The platform checks your child's progress against their personal schedule, so the curator sees if they fall a week behind.") },
    { icon: "file", title: tr("Отчёт родителю каждые 3 недели", "Ата-анаға әр 3 апта сайын есеп", "A report for parents every 3 weeks"), text: tr("Цифры по урокам, домашкам, посещаемости и баллам, а к ним личный комментарий куратора.", "Сабақ, үй жұмысы, қатысу мен ұпай бойынша нақты көрсеткіштер және куратордың жеке пікірі.", "Figures on lessons, homework, attendance and points, along with the curator's personal comment.") },
  ];

  const nav: { icon: IconName; label: string; active?: boolean }[] = [
    { icon: "rocket", label: ui("Главная", "Басты бет"), active: true },
    { icon: "book", label: ui("Мои курсы", "Курстарым") },
    { icon: "clipboard", label: ui("Домашки", "Үй жұмыстары") },
    { icon: "award", label: ui("Баллы", "Ұпайлар") },
    { icon: "graduation", label: ui("Сертификаты", "Сертификаттар") },
  ];

  const ranking = [
    { n: "Аружан", p: 1240 },
    { n: "Данияр", p: 1185 },
    { n: ui("Ты", "Сен"), p: 1150, me: true },
    { n: "Алихан", p: 980 },
  ];

  return (
    <motion.section
      id="platform"
      className="sheet relative overflow-clip bg-background pb-20 pt-24 shadow-[0_-24px_60px_-30px_rgba(15,15,26,0.25)] sm:pb-28 sm:pt-32"
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      variants={staggerContainer}
    >
      <Aurora soft />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHead
          index="09"
          eyebrow={tr("Своя платформа", "Өз платформамыз", "Our own platform")}
          title={
            <>
              {tr("Учим на своей ", "Өзіміздің ", "We teach on our own ")}
              <span className="text-accent">{tr("авторской платформе", "авторлық платформамызда оқытамыз", "in-house platform")}</span>
            </>
          }
          lead={tr(
            "Уроки, домашние задания, баллы и отчёты для родителей собраны на платформе, которую Alfa Z разработала сама. У каждого ребёнка свой график от дня старта, а ментор и куратор видят его прогресс по каждому уроку.",
            "Сабақтар, үй тапсырмалары, ұпайлар және ата-анаға арналған есептер Alfa Z өзі әзірлеген платформада жиналған. Әр баланың оқу кестесі өзі бастаған күннен есептеледі, ал ментор мен куратор оның әр сабақтағы ілгерілеуін көріп отырады.",
            "Lessons, homework, points and parent reports all live on a platform Alfa Z built in-house. Every child follows their own schedule from the day they start, and the mentor and curator can see their progress lesson by lesson.",
          )}
        />

        {/* 🖥 Макет экрана ученика + всплывающие события платформы */}
        <motion.div variants={staggerItem} ref={stageRef} className="relative mx-auto mb-14 max-w-5xl sm:mb-20">
          <div aria-hidden className="pointer-events-none absolute -inset-x-8 -inset-y-6 hidden rounded-[3rem] bg-accent/20 blur-[90px] md:block" />
          <ScrollTilt>
            <figure
              aria-label={tr("Так выглядит личный кабинет ученика на платформе Alfa Z (пример с вымышленными данными)", "Alfa Z платформасындағы оқушының жеке кабинеті осындай (ойдан алынған деректермен мысал)", "What a student's dashboard looks like on the Alfa Z platform (example with made-up data)")}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0F0F1A] text-[#FFFBF5] shadow-2xl shadow-[#0F0F1A]/40"
            >
              {/* Плашка окна */}
              <div aria-hidden className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#FF6B47]" />
                <span className="h-3 w-3 rounded-full bg-[#FFB088]" />
                <span className="h-3 w-3 rounded-full bg-white/25" />
                <span className="mx-auto hidden rounded-md bg-white/[0.06] px-3 py-1 font-mono text-[11px] text-white/45 sm:block">alfa-z · {ui("личный кабинет", "жеке кабинет")}</span>
              </div>

              <div aria-hidden className="grid md:grid-cols-[180px_minmax(0,1fr)] lg:grid-cols-[200px_minmax(0,1fr)_260px]">
                {/* Меню */}
                <nav className="hidden border-r border-white/10 p-4 md:block">
                  <div className="mb-5 flex items-center gap-2 font-display text-base font-bold">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-xs text-white">αZ</span>
                    Alfa Z
                  </div>
                  <ul className="space-y-1 text-sm">
                    {nav.map((n) => (
                      <li key={n.label} className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 ${n.active ? "bg-accent/15 text-accent" : "text-white/55"}`}>
                        <Icon name={n.icon} className="h-4 w-4" /> {n.label}
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Главное */}
                <div className="min-w-0 p-4 sm:p-6">
                  <p className="mb-3 text-sm text-white/55">{ui("Привет, Айдар! Следующий урок:", "Сәлем, Айдар! Келесі сабақ:")}</p>
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-accent/20 via-white/[0.04] to-transparent p-4 sm:p-5">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-accent-soft">{ui("Бэкенд на Python · урок 12", "Python-дағы бэкенд · 12-сабақ")}</p>
                    <p className="mt-1 font-display text-xl font-bold sm:text-2xl">{ui("Словари и JSON", "Сөздіктер және JSON")}</p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-soft"
                          initial={{ width: "8%" }}
                          animate={{ width: inView ? "34%" : "8%" }}
                          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                        />
                      </div>
                      <span className="font-mono text-xs text-white/60">34%</span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/30">
                        {ui("Продолжить", "Жалғастыру")} <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z" /></svg>
                      </span>
                      <span className="text-xs text-white/50">{ui("срок ДЗ: пятница", "ҮЖ мерзімі: жұма")}</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                    {[
                      { v: "2", l: ui("курса", "курс") },
                      { v: "1", l: ui("ДЗ на неделе", "аптадағы ҮЖ") },
                      { v: "+340", l: ui("баллов за месяц", "айлық ұпай") },
                    ].map((c) => (
                      <div key={c.l} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                        <p className="font-display text-xl font-bold sm:text-2xl">{c.v}</p>
                        <p className="mt-0.5 text-[11px] leading-tight text-white/50 sm:text-xs">{c.l}</p>
                      </div>
                    ))}
                  </div>

                  {/* Мини-игра урока */}
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="inline-flex items-center gap-2 text-sm font-semibold"><Icon name="gamepad" className="h-4 w-4 text-accent" />{ui("Мини-игра: «Найди баг»", "Шағын ойын: «Қатені тап»")}</p>
                      <span className="rounded-full bg-accent/20 px-2 py-0.5 font-mono text-[10px] text-accent-soft">+20</span>
                    </div>
                    <pre className="overflow-hidden font-mono text-[12px] leading-6 text-white/80">
{`user = {"name": "Айдар"}
print(user["nmae"])`}<span className="rounded bg-accent/30 px-0.5 text-white">{"  ← ?"}</span>
                    </pre>
                  </div>
                </div>

                {/* Правая колонка: серия и рейтинг */}
                <div className="hidden border-l border-white/10 p-5 lg:block">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-widest text-white/45">{ui("Серия", "Серия")}</p>
                    <p className="mt-2 flex items-center gap-2 font-display text-3xl font-bold">
                      <Icon name="flame" className="h-7 w-7 animate-soft-pulse text-accent" /> 6
                    </p>
                    <p className="mt-1 text-xs text-white/50">{ui("недель без пропусков", "сабақ босатпаған апта")}</p>
                  </div>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="mb-3 text-xs uppercase tracking-widest text-white/45">{ui("Рейтинг группы · месяц", "Топ рейтингі · ай")}</p>
                    <ol className="space-y-2 text-sm">
                      {ranking.map((r, i) => (
                        <li key={r.n} className={`flex items-center justify-between rounded-lg px-2 py-1.5 ${r.me ? "bg-accent/15 text-accent" : "text-white/70"}`}>
                          <span><span className="mr-2 font-mono text-xs text-white/35">{i + 1}</span>{r.n}</span>
                          <span className="font-mono text-xs">{r.p}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
              <figcaption className="sr-only">{tr("Пример интерфейса с вымышленными данными", "Ойдан алынған деректермен интерфейс мысалы", "Interface example with made-up data")}</figcaption>
            </figure>
          </ScrollTilt>

          {/* Всплывающие события — десктоп: парят с параллаксом; телефон: скрыты (всё главное уже в макете) */}
          <motion.div
            aria-hidden
            style={canRender3D ? { y: yA } : undefined}
            className="absolute -left-10 top-24 z-10 hidden w-64 rounded-2xl border border-foreground/10 bg-surface p-4 text-foreground shadow-2xl shadow-[#0F0F1A]/20 xl:block"
          >
            <p className="mb-1 inline-flex items-center gap-2 text-xs font-semibold text-accent"><Icon name="check" className="h-4 w-4" />{ui("ДЗ принято · оценка 5 из 5", "ҮЖ қабылданды · баға 5/5")}</p>
            <p className="text-sm leading-snug text-foreground/75">{ui("«Словари разобрал отлично. Добавь проверку, есть ли ключ, — и будет идеально».", "«Сөздіктерді жақсы талдадың. Кілттің бар-жоғын тексеруді қос — сонда мінсіз болады».")}</p>
            <p className="mt-2 font-mono text-[10px] text-foreground/45">{ui("рецензия ментора", "ментор пікірі")}</p>
          </motion.div>
          <motion.div
            aria-hidden
            style={canRender3D ? { y: yB } : undefined}
            className="absolute -left-8 bottom-6 z-10 hidden w-52 rounded-2xl border border-foreground/10 bg-surface p-4 text-foreground shadow-2xl shadow-[#0F0F1A]/20 xl:block"
          >
            <p className="text-xs uppercase tracking-widest text-foreground/45">{ui("Баллы", "Ұпайлар")}</p>
            <p className="mt-1 font-display text-3xl font-bold text-accent">+20</p>
            <p className="text-sm text-foreground/70">{ui("мини-игра пройдена", "шағын ойын өтілді")}</p>
          </motion.div>
          <motion.div
            aria-hidden
            style={canRender3D ? { y: yC } : undefined}
            className="absolute -bottom-8 right-16 z-10 hidden items-center gap-3 rounded-2xl border border-foreground/10 bg-surface px-4 py-3 text-foreground shadow-2xl shadow-[#0F0F1A]/20 xl:flex"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent"><Icon name="graduation" className="h-5 w-5" /></span>
            <div>
              <p className="text-sm font-semibold">{ui("Именной сертификат", "Атаулы сертификат")}</p>
              <p className="font-mono text-[11px] text-foreground/50">{ui("проверка по номеру — без входа", "нөмірі бойынша тексеру — кірусіз")}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Функции платформы */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t) => (
            <motion.div
              key={t.title}
              variants={staggerItem}
              onPointerMove={spot}
              className="spotlight group relative overflow-hidden rounded-3xl border border-foreground/10 bg-surface/80 p-6 transition-colors duration-300 hover:border-accent/40 md:backdrop-blur-xl"
            >
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110"><Icon name={t.icon} className="h-5 w-5" /></span>
              <h3 className="mb-2 font-display text-lg font-bold tracking-tight">{t.title}</h3>
              <p className="text-sm leading-relaxed text-foreground/65">{t.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
