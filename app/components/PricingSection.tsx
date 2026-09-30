"use client";

import { motion } from "framer-motion";
import Icon, { type IconName } from "./Icon";
import SectionHead from "./SectionHead";
import Aurora from "./Aurora";
import Magnetic from "./Magnetic";
import { staggerContainer, staggerItem, fadeInUp, scrollViewport } from "./motion";
import { useLang } from "../i18n/lang";

export default function PricingSection({ openApply }: { openApply: () => void }) {
  const { tr } = useLang();

  const included: { icon: IconName; title: string; desc: string }[] = [
    { icon: "users", title: tr("Живые занятия с ментором", "Ментормен тікелей сабақтар", "Live lessons with a mentor"), desc: tr("2 живых занятия в неделю по 1 часу в Discord + записанные материалы. Ментор доводит каждого ученика до результата и на связи 24/7.", "Discord-та аптасына 2 тірі сабақ, 1 сағаттан + жазба материалдар. Ментор әр оқушыны нәтижеге жеткізеді және 24/7 байланыста.", "2 live 1-hour lessons a week on Discord + recorded materials. The mentor brings each student to the result and is in touch 24/7.") },
    { icon: "clipboard", title: tr("Домашние задания", "Үй тапсырмалары", "Homework"), desc: tr("С проверкой от преподавателя. Облегчённый уровень — если основной не получается.", "Ұстаз тексеруімен. Жеңілдетілген деңгей — негізгісі шықпаса.", "Reviewed by the instructor. An easier level if the main one doesn't work out.") },
    { icon: "message", title: tr("Куратор между уроками", "Сабақ аралығында куратор", "A mentor between lessons"), desc: tr("Личный куратор отвечает в чате 24/7 на вопросы по ДЗ и проектам.", "Жеке куратор чатта 24/7 ҮЖ мен жобалар бойынша сұрақтарға жауап береді.", "A personal mentor answers homework and project questions in chat 24/7.") },
    { icon: "award", title: tr("Сертификаты каждые 3 недели", "Әр 3 апта сайын сертификат", "Certificates every 3 weeks"), desc: tr("За каждый пройденный блок. 6–14 сертификатов за весь курс.", "Әр өткен блокқа. Бүкіл курсқа 6–14 сертификат.", "For every block completed. 6–14 certificates over the whole course.") },
    { icon: "presentation", title: tr("Защита проекта", "Жоба қорғау", "Project defense"), desc: tr("В конце курса — реальный проект (приложение/игра/сайт/бот) в портфолио.", "Курс соңында — портфолиода нақты жоба (қосымша/ойын/сайт/бот).", "At the end of the course — a real project (app/game/site/bot) in a portfolio.") },
    { icon: "file", title: tr("Помощь с резюме", "Резюмеге көмек", "Resume help"), desc: tr("Помогаем составить первое CV, GitHub-профиль и подготовиться к стажировкам.", "Алғашқы CV, GitHub-профиль құрастыруға және тәжірибеге дайындалуға көмектесеміз.", "We help build a first CV, a GitHub profile, and prepare for internships.") },
  ];

  const guarantees = [
    tr("2 живых занятия в неделю по 1 часу с ментором", "аптасына 2 тірі сабақ, ментормен 1 сағаттан", "2 live 1-hour lessons a week with a mentor"),
    tr("Без скрытых платежей — цена фиксирована на весь курс", "Жасырын төлемсіз — баға бүкіл курсқа бекітілген", "No hidden fees — the price is fixed for the whole course"),
    tr("Можно прекратить в любой момент, без штрафов", "Кез келген уақытта тоқтатуға болады, айыппұлсыз", "Cancel anytime, no penalties"),
  ];

  return (
    <motion.section
      id="pricing"
      className="sheet relative overflow-clip bg-background pb-20 pt-24 shadow-[0_-24px_60px_-30px_rgba(15,15,26,0.25)] sm:pb-28 sm:pt-32"
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      variants={staggerContainer}
    >
      <Aurora soft />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHead
          index="06"
          eyebrow={tr("Цены и оплата", "Бағалар мен төлем", "Pricing & payment")}
          title={
            <>
              {tr("Доступно. ", "Қолжетімді. ", "Affordable. ")}
              <span className="text-accent">{tr("Прозрачно. Честно.", "Ашық. Адал.", "Transparent. Honest.")}</span>
            </>
          }
          lead={
            <>
              {tr("Единая понятная цена — ", "Бірыңғай түсінікті баға — ", "One clear price — ")}
              <span className="font-bold text-foreground">47 500 ₸ {tr("в месяц", "айына", "per month")}</span>
              {tr(" за всё: живые занятия с ментором, обратная связь после каждого урока и отчёты о прогрессе.", ": ментормен тікелей сабақтар, әр сабақтан кейін кері байланыс және прогресс есептері.", " for everything: live lessons with a mentor, feedback after every lesson, and progress reports.")}
            </>
          }
        />

        <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-10">
          {/* 🎟 Билет с ценой */}
          <motion.div variants={fadeInUp} className="lg:sticky lg:top-28 lg:col-span-5">
            <div className="ring-spin rounded-[2rem]">
            <div className="bg-midnight relative overflow-hidden rounded-[2rem] p-8 text-ink-fg shadow-2xl shadow-accent/20 sm:p-10">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-soft">// {tr("единая цена", "бірыңғай баға", "one price")}</p>
              <p className="mt-6 flex items-baseline gap-2 font-display font-bold leading-none tracking-[-0.05em] tabular-nums">
                <span className="text-[length:clamp(4rem,9vw,6.5rem)]">47 500</span>
                <span className="text-4xl text-accent">₸</span>
              </p>
              <p className="mt-3 text-sm text-ink-fg/60">{tr("в месяц", "айына", "per month")}</p>

              {/* Перфорация билета */}
              <div className="relative my-8">
                <div aria-hidden className="border-t border-dashed border-white/20" />
                <span aria-hidden className="absolute -left-[2.75rem] top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background sm:-left-[3.25rem]" />
                <span aria-hidden className="absolute -right-[2.75rem] top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background sm:-right-[3.25rem]" />
              </div>

              <ul className="space-y-3.5">
                {guarantees.map((g) => (
                  <li key={g} className="flex items-start gap-3 text-sm leading-snug text-ink-fg/85">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent text-white"><Icon name="check" className="h-3 w-3" /></span>
                    {g}
                  </li>
                ))}
              </ul>

              <Magnetic className="mt-9 flex w-full" strength={0.12}>
                <button onClick={openApply} className="btn-arrow shine glow-hover flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 font-semibold text-white transition-colors hover:bg-accent-hover">
                  {tr("Записаться на пробный урок", "Сынақ сабаққа жазылу", "Book a trial lesson")} <span className="arrow" aria-hidden>→</span>
                </button>
              </Magnetic>
              <p className="mt-4 text-center text-xs leading-relaxed text-ink-fg/55">{tr("Ребёнок попробует, познакомится с преподавателем. Если не понравится — никаких обязательств.", "Бала байқап көреді, ұстазбен танысады. Ұнамаса — ешқандай міндеттеме жоқ.", "Your child will try it and meet the instructor. If they don't like it — no obligations.")}</p>
            </div>
            </div>
          </motion.div>

          {/* Что входит */}
          <motion.div variants={fadeInUp} className="lg:col-span-7">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-foreground/50">{tr("Что входит в стоимость", "Бағаға не кіреді", "What's included")}</p>
            <h3 className="mb-8 mt-2 font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
              {tr("Никаких ", "Ешқандай ", "No ")}<span className="text-accent">{tr("скрытых платежей", "жасырын төлемдер жоқ", "hidden fees")}</span>
            </h3>
            <ul className="border-b border-foreground/10">
              {included.map((item, i) => (
                <motion.li key={i} variants={staggerItem} className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-foreground/10 py-6 sm:grid-cols-[auto_auto_1fr]">
                  <span className="hidden pt-1 font-mono text-xs text-foreground/35 sm:block">0{i + 1}</span>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name={item.icon} className="h-5 w-5" /></span>
                  <div>
                    <h4 className="mb-1 font-display text-lg font-bold tracking-tight">{item.title}</h4>
                    <p className="text-sm leading-relaxed text-foreground/65">{item.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
