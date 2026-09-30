"use client";

import { motion } from "framer-motion";
import Icon, { type IconName } from "./Icon";
import SectionHead from "./SectionHead";
import { staggerContainer, staggerItem, fadeInUp, scrollViewport } from "./motion";
import { useLang } from "../i18n/lang";

export default function ScheduleSection({ openApply }: { openApply: (course?: string) => void }) {
  const { tr } = useLang();

  const facts = [
    { icon: "calendar" as IconName, big: tr("Старт сразу", "Бірден старт", "Start now"), small: tr("сразу после оплаты", "төлемнен кейін бірден", "right after payment") },
    { icon: "clock" as IconName, big: tr("2 раза", "2 рет", "2×"), small: tr("в неделю, по 1 часу", "аптасына, 1 сағаттан", "a week, 1 hour each") },
    { icon: "calendar" as IconName, big: tr("Гибкий график", "Икемді кесте", "Flexible schedule"), small: tr("подберём удобные дни и время", "ыңғайлы күн мен уақыт таңдаймыз", "we'll pick convenient days and times") },
  ];

  // key — русское название = value в <select> формы записи (чтобы курс подставлялся на любом языке)
  const groups = [
    { key: "Гарвардский курс CS50", course: tr("Гарвардский курс CS50", "Гарвардтың CS50 курсы", "Harvard CS50"), icon: "graduation" as IconName, age: tr("14–18 лет", "14–18 жас", "ages 14–18") },
    { key: "Веб-разработка", course: tr("Веб-разработка", "Веб-әзірлеу", "Web development"), icon: "globe" as IconName, age: tr("12–17 лет", "12–17 жас", "ages 12–17") },
    { key: "Мобильная разработка", course: tr("Мобильная разработка", "Мобильді әзірлеу", "Mobile development"), icon: "smartphone" as IconName, age: tr("14–17 лет", "14–17 жас", "ages 14–17") },
    { key: "Геймдев на Unity", course: tr("Геймдев на Unity", "Unity-де геймдев", "Game dev on Unity"), icon: "gamepad" as IconName, age: tr("13–18 лет", "13–18 жас", "ages 13–18") },
    { key: "Бэкенд на Python", course: tr("Бэкенд на Python", "Python-дағы бэкенд", "Backend on Python"), icon: "settings" as IconName, age: tr("13–18 лет", "13–18 жас", "ages 13–18") },
  ];

  return (
    <motion.section
      id="schedule"
      className="sheet dot-grid relative bg-muted pb-20 pt-24 shadow-[0_-24px_60px_-30px_rgba(15,15,26,0.25)] sm:pb-28 sm:pt-32"
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      variants={staggerContainer}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHead
          index="07"
          eyebrow={tr("Расписание", "Кесте", "Schedule")}
          title={
            <>
              {tr("Подберём ", "", "We'll find ")}
              <span className="text-accent">{tr("удобное расписание", "Ыңғайлы кесте таңдаймыз", "a schedule that suits you")}</span>
            </>
          }
          lead={tr("Никакого потока и ожидания: занятия начинаются сразу после оплаты абонемента. Живые занятия с ментором 2 раза в неделю по 1 часу — а дни и время подберём под вашего ребёнка: утром, днём или вечером, чтобы не мешало школе и секциям.", "Ешқандай ағын мен күту жоқ: сабақтар абонемент төленгеннен кейін бірден басталады. Ментормен тірі сабақтар аптасына 2 рет, 1 сағаттан — ал күндер мен уақытты балаңызға қарай таңдаймыз: таңертең, күндіз не кешке, мектеп пен үйірмелерге кедергі болмас үшін.", "No cohorts, no waiting: lessons start right after you pay for the subscription. Live lessons with a mentor twice a week for 1 hour — and we'll pick days and times to fit your child: morning, afternoon, or evening, so it doesn't clash with school and activities.")}
        />

        {/* Три факта одной полосой */}
        <motion.dl variants={fadeInUp} className="mb-10 grid gap-px overflow-hidden rounded-3xl border border-foreground/15 bg-foreground/15 sm:mb-14 sm:grid-cols-3">
          {facts.map((f, i) => (
            <div key={i} className="flex items-center gap-4 bg-background p-6 sm:p-7">
              <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-accent/10 text-accent"><Icon name={f.icon} className="h-6 w-6" /></span>
              <div>
                <dt className="font-display text-xl font-bold leading-tight tracking-tight sm:text-2xl">{f.big}</dt>
                <dd className="mt-0.5 text-sm text-foreground/60">{f.small}</dd>
              </div>
            </div>
          ))}
        </motion.dl>

        {/* Группы — строки-«таблица», а не пять одинаковых карточек */}
        <ul className="border-b border-foreground/15">
          {groups.map((g, i) => {
            return (
              <motion.li
                key={i}
                variants={staggerItem}
                className="grid items-center gap-x-8 gap-y-4 border-t border-foreground/15 px-2 py-6 transition-colors duration-300 hover:bg-accent/[0.05] md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] md:px-4"
              >
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name={g.icon} className="h-5 w-5" /></span>
                  <div className="min-w-0">
                    <h3 className="font-display text-xl font-bold leading-tight tracking-tight">{g.course}</h3>
                    <p className="mt-0.5 text-sm text-foreground/55">{g.age}</p>
                  </div>
                </div>

                {/* Честный формат вместо «осталось мест»: малая группа, 2 раза в неделю, старт сразу */}
                <div>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
                    <span className="font-semibold uppercase tracking-widest text-foreground/50">{tr("Малая группа", "Шағын топ", "Small group")}</span>
                    <span className="font-bold text-accent">{tr("до 8 учеников", "8 оқушыға дейін", "up to 8 students")}</span>
                  </div>
                  <div className="flex gap-1.5" aria-hidden>
                    {Array.from({ length: 8 }, (_, s) => (
                      <motion.span
                        key={s}
                        initial={{ scaleY: 0.3, opacity: 0 }}
                        whileInView={{ scaleY: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.15 + s * 0.05 }}
                        className="h-2.5 flex-1 origin-bottom rounded-full bg-accent/70"
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-foreground/55">{tr("2 раза в неделю по 1 часу · старт сразу после оплаты", "аптасына 2 рет, 1 сағаттан · төлемнен кейін бірден старт", "2× a week, 1 hour · start right after payment")}</p>
                </div>

                <button
                  onClick={() => openApply(g.key)}
                  className="btn-arrow inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 px-6 py-3 text-sm font-semibold transition-colors hover:border-accent hover:bg-accent hover:text-white md:justify-self-end"
                >
                  {tr("Записаться", "Жазылу", "Enroll")} <span className="arrow" aria-hidden>→</span>
                </button>
              </motion.li>
            );
          })}
        </ul>

        <motion.div variants={fadeInUp} className="mt-12 text-center">
          <p className="mb-3 text-sm text-foreground/60">{tr("Расскажите про учёбу и секции ребёнка — встроим занятия в удобное окно, на любой график.", "Балаңыздың оқуы мен үйірмелері туралы айтыңыз — сабақтарды кез келген графикке, ыңғайлы уақытқа енгіземіз.", "Tell us about your child's school and activities — we'll fit the lessons into a convenient window, any schedule.")}</p>
          <button onClick={() => openApply()} className="btn-arrow inline-flex min-h-11 items-center gap-2 px-2 font-semibold text-accent transition-colors hover:text-accent-hover">
            {tr("Подобрать удобное время", "Ыңғайлы уақыт таңдау", "Find a convenient time")} <span className="arrow" aria-hidden>→</span>
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}
