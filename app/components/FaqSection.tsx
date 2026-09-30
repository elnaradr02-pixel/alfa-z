"use client";

import { motion } from "framer-motion";
import Icon from "./Icon";
import { staggerContainer, staggerItem, fadeInUp, scrollViewport } from "./motion";
import { useLang } from "../i18n/lang";

/** FAQ: слева — закреплённый заголовок и WhatsApp, справа — аккордеон без «коробок». */
export default function FaqSection() {
  const { tr } = useLang();

  const faq = [
              { q: tr("Когда стартует обучение и какое расписание?", "Оқу қашан басталады және кесте қандай?", "When does training start and what's the schedule?"), a: tr("Никакого потока — занятия начинаются сразу после оплаты абонемента, ребёнок идёт в удобном темпе. Живые занятия с ментором 2 раза в неделю по 1 часу — а дни и время подберём под вашего ребёнка (утро, день или вечер), чтобы не мешало школе и секциям. Все 5 направлений доступны. Удобное время подберём в WhatsApp.", "Ешқандай ағын жоқ — сабақтар абонемент төленгеннен кейін бірден басталады, бала ыңғайлы қарқынмен жүреді. Ментормен тірі сабақтар аптасына 2 рет, 1 сағаттан — ал күндер мен уақытты балаңызға қарай таңдаймыз (таңертең, күндіз не кешке), мектеп пен үйірмелерге кедергі болмас үшін. 5 бағыттың бәрі қолжетімді. Ыңғайлы уақытты WhatsApp-та таңдаймыз.", "No cohorts — lessons start right after you pay for the subscription, and your child goes at a comfortable pace. Live lessons with a mentor twice a week for 1 hour — and we'll pick days and times to fit your child (morning, afternoon, or evening) so it doesn't clash with school and activities. All 5 tracks are available. We'll arrange a convenient time on WhatsApp.") },
              { q: tr("Сколько стоит обучение?", "Оқу қанша тұрады?", "How much does it cost?"), a: tr("Единая цена — 47 500 ₸ в месяц, оплата помесячно, без скрытых доплат. В цену входит всё: 2 живых занятия в неделю по 1 часу с ментором, записанные материалы, обратная связь после каждого урока, отчёты о прогрессе каждые 3 недели и ментор на связи 24/7.", "Бірыңғай баға — айына 47 500 ₸, ай сайын төлеу, жасырын қосымша төлемсіз. Бағаға бәрі кіреді: ментормен аптасына 2 тірі сабақ, 1 сағаттан, жазба материалдар, әр сабақтан кейін кері байланыс, әр 3 апта сайын прогресс есептері және ментор 24/7 байланыста.", "One price — 47,500 ₸ per month, billed monthly, with no hidden fees. Everything is included: 2 live 1-hour lessons a week with a mentor, recorded materials, feedback after every lesson, progress reports every 3 weeks, and a mentor in touch 24/7.") },
              { q: tr("Что за Гарвардский курс CS50?", "Гарвардтың CS50 курсы деген не?", "What is Harvard's CS50 course?"), a: tr("Это легендарный вводный курс информатики Гарвардского университета (CS50), адаптированный на русский язык: 49 занятий, 11 модулей, 7 Problem Sets. Программа ведёт от Scratch и языка C через алгоритмы, структуры данных и работу с памятью к Python, SQL и полноценному веб-приложению на Flask. Даёт настоящий фундамент Computer Science, с которым потом легко даётся любой язык и направление.", "Бұл — Гарвард университетінің информатика бойынша аңызға айналған кіріспе курсы (CS50): 49 сабақ, 11 модуль, 7 Problem Sets. Бағдарлама Scratch пен C тілінен алгоритмдер, деректер құрылымы және жадпен жұмыс арқылы Python, SQL және Flask-тегі толыққанды веб-қосымшаға жетелейді. Computer Science-тің нағыз іргетасын береді, онымен кейін кез келген тіл мен бағыт оңай меңгеріледі.", "It's the University's legendary intro to computer science (CS50): 49 lessons, 11 modules, 7 Problem Sets. The program goes from Scratch and the C language through algorithms, data structures, and memory to Python, SQL, and a full web app on Flask. It builds a real Computer Science foundation that makes any language or track easy afterward.") },
              { q: tr("Что если ребёнок заболел или пропустил урок?", "Бала ауырса не сабақты жіберіп алса ше?", "What if my child gets sick or misses a lesson?"), a: tr("Все занятия проходят вживую в маленьких группах, но каждый урок доступен в записи — ребёнок сможет наверстать пропущенное. Куратор поможет догнать материал в чате, а домашнее задание можно сдать позже. Болезнь со справкой мы всегда идём навстречу.", "Барлық сабақтар шағын топтарда тікелей өтеді, бірақ әр сабақтың жазбасы болады — бала жіберіп алғанын толықтыра алады. Куратор чатта материалды қууға көмектеседі, үй тапсырмасын кейінірек тапсыруға болады. Анықтамамен ауырғанда әрқашан жағдай жасаймыз.", "All classes are live in small groups, but every lesson is recorded — your child can catch up. The mentor helps recover the material in chat, and homework can be submitted later. With a doctor's note for illness, we always accommodate.") },
              { q: tr("С какого возраста можно учиться?", "Қай жастан бастап оқуға болады?", "From what age can kids start?"), a: tr("Веб-разработка — с 12 лет, остальные курсы — с 13. Верхняя граница — 17–18 лет.", "Веб-әзірлеу — 12 жастан, қалған курстар — 13 жастан. Жоғарғы шек — 17–18 жас.", "Web development from age 12, the other courses from 13. The upper limit is 17–18.") },
              { q: tr("Что нужно для старта? Какой нужен компьютер?", "Бастау үшін не керек? Қандай компьютер қажет?", "What do you need to start? What computer is required?"), a: tr("Любой компьютер не старше 5–7 лет — Windows, Mac или мощный Chromebook. Для геймдева на Unity нужно 8 ГБ RAM минимум.", "5–7 жастан аспаған кез келген компьютер — Windows, Mac не қуатты Chromebook. Unity-дегі геймдев үшін кемінде 8 ГБ RAM қажет.", "Any computer no older than 5–7 years — Windows, Mac, or a powerful Chromebook. For game dev on Unity you need at least 8 GB of RAM.") },
              { q: tr("Как проходят занятия? Это записи или живые?", "Сабақтар қалай өтеді? Жазба ма, тірі ме?", "How are classes run? Recorded or live?"), a: tr("И то, и другое: записанные материалы для самостоятельного прохождения + 2 живых занятия в неделю по 1 часу с ментором в Discord. Ментор доводит каждого ученика до результата, на связи 24/7 и даёт обратную связь после каждого урока. Группы малые. Уроки, домашние задания и баллы — на собственной платформе Alfa Z.", "Екеуі де: өз бетінше өту үшін жазба материалдар + Discord-та ментормен аптасына 2 тірі сабақ, 1 сағаттан. Ментор әр оқушыны нәтижеге жеткізеді, 24/7 байланыста және әр сабақтан кейін кері байланыс береді. Топтар шағын. Сабақтар, үй тапсырмалары мен ұпайлар — Alfa Z-тің өз платформасында.", "Both: recorded materials for self-study + 2 live 1-hour lessons a week with a mentor on Discord. The mentor brings each student to the result, is in touch 24/7, and gives feedback after every lesson. Groups are small. Lessons, homework, and points live on Alfa Z's own learning platform.") },
              { q: tr("Безопасно ли это для ребёнка?", "Бұл бала үшін қауіпсіз бе?", "Is it safe for my child?"), a: tr("Все преподаватели проходят отбор и подписывают договор о работе с детьми. На уроках всегда включена камера у всех.", "Барлық ұстаздар іріктеуден өтеді және балалармен жұмыс туралы келісімге қол қояды. Сабақтарда әрқашан бәрінің камерасы қосулы.", "All teachers are vetted and sign an agreement about working with children. Cameras are always on for everyone during lessons.") },
              { q: tr("А если ребёнок передумает?", "Ал бала ойын өзгертсе ше?", "What if my child changes their mind?"), a: tr("Начните с пробного урока — ребёнок попробует до оплаты. Дальше оплата помесячно, без обязательств на год: если интерес пропал, можно остановиться в любой момент.", "Сынақ сабақтан бастаңыз — бала төлемге дейін байқап көреді. Әрі қарай төлем ай сайын, жылдық міндеттемесіз: қызығушылық жоғалса, кез келген уақытта тоқтауға болады.", "Start with a trial lesson — your child tries it before paying. After that, billing is monthly with no year-long commitment: if the interest fades, you can stop at any time.") },
              { q: tr("Чем вы отличаетесь от Kodland и других школ?", "Kodland пен басқа мектептерден несімен ерекшеленесіздер?", "How are you different from Kodland and other schools?"), a: tr("Главное: мы открыто учим работать с AI, а не делаем вид, что его нет. Второе: облегчённые задания через 48 часов. Третье: конкретный результат после каждого урока.", "Ең бастысы: біз AI-мен жұмыс істеуді ашық үйретеміз, оны жоқтай сыңай танытпаймыз. Екіншіден: 48 сағаттан кейін жеңілдетілген тапсырмалар. Үшіншіден: әр сабақтан кейін нақты нәтиже.", "Most importantly: we openly teach working with AI instead of pretending it doesn't exist. Second: easier assignments unlock after 48 hours. Third: a concrete result after every lesson.") },
              { q: tr("Получит ли ребёнок сертификат?", "Бала сертификат ала ма?", "Will my child get a certificate?"), a: tr("Да, сертификаты выдаём каждые 3 недели — 6 за веб-курс, 5–6 за остальные. Главное — рабочие проекты на GitHub.", "Иә, сертификаттарды әр 3 апта сайын береміз — веб-курсқа 6, қалғандарына 5–6. Ең бастысы — GitHub-тағы жұмыс істейтін жобалар.", "Yes, we issue certificates every 3 weeks — 6 for the web course, 5–6 for the others. Most important: working projects on GitHub.") },
              { q: tr("Как записаться на пробный урок?", "Сынақ сабаққа қалай жазылуға болады?", "How do I sign up for a trial lesson?"), a: tr("Нажмите кнопку «Пробный урок» вверху — откроется короткая форма. После заполнения мы свяжемся с вами в WhatsApp в течение часа. Пробный урок длится 60 минут, без обязательств.", "Жоғарыдағы «Сынақ сабақ» батырмасын басыңыз — қысқа форма ашылады. Толтырғаннан кейін бір сағат ішінде WhatsApp арқылы хабарласамыз. Сынақ сабақ 60 минутқа созылады, міндеттемесіз.", "Click the 'Trial lesson' button at the top — a short form opens. After you fill it in, we'll contact you on WhatsApp within an hour. The trial lesson lasts 60 minutes, no obligations.") },
  ];

  return (
    <motion.section
      id="faq"
      className="sheet relative bg-muted pb-20 pt-24 shadow-[0_-24px_60px_-30px_rgba(15,15,26,0.25)] sm:pb-28 sm:pt-32"
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      variants={staggerContainer}
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-8 lg:grid-cols-12 lg:gap-16">
        <motion.div variants={fadeInUp} className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <div className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em]">
              <span className="font-bold text-accent">12</span>
              <span aria-hidden className="h-px w-10 bg-current opacity-30" />
              <span className="opacity-60">{tr("Частые вопросы", "Жиі қойылатын сұрақтар", "FAQ")}</span>
            </div>
            <h2 className="font-display text-[length:clamp(2rem,4vw,3.2rem)] font-bold leading-[1.05] tracking-[-0.03em]">
              {tr("Если что-то ещё ", "Егер әлі де бірдеңе ", "If something's still ")}<span className="text-accent">{tr("не понятно", "түсініксіз болса", "unclear")}</span>
            </h2>
            <p className="mt-4 text-foreground/70">{tr("Самые частые вопросы родителей. Если не нашли ответ — напишите в WhatsApp.", "Ата-аналардың жиі қоятын сұрақтары. Жауабын таппасаңыз — WhatsApp-қа жазыңыз.", "The questions parents ask most. Didn't find an answer? Message us on WhatsApp.")}</p>

            <div className="mt-8 rounded-3xl bg-midnight p-6 text-ink-fg">
              <h3 className="font-display text-xl font-bold">{tr("Не нашли ответ?", "Жауабын таппадыңыз ба?", "Didn't find your answer?")}</h3>
              <p className="mb-5 mt-2 text-sm leading-relaxed text-ink-fg/65">{tr("Напишите нам в WhatsApp — отвечаем в течение 30 минут в рабочее время. Без обязательств.", "WhatsApp-қа жазыңыз — жұмыс уақытында 30 минут ішінде жауап береміз. Міндеттемесіз.", "Message us on WhatsApp — we reply within 30 minutes during business hours. No obligations.")}</p>
              <a href="https://wa.me/77007240353" target="_blank" rel="noopener noreferrer" className="btn-arrow inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover">
                <Icon name="message" className="h-4 w-4" /> {tr("Написать в WhatsApp", "WhatsApp-қа жазу", "Message on WhatsApp")} <span className="arrow" aria-hidden>→</span>
              </a>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-8">
          <ul className="border-b border-foreground/15">
            {faq.map((item, i) => (
              <motion.li key={i} variants={staggerItem} className="border-t border-foreground/15">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-start gap-4 py-6 sm:gap-6 [&::-webkit-details-marker]:hidden">
                    <span className="pt-1.5 font-mono text-xs text-foreground/35">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 font-display text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-accent sm:text-xl">{item.q}</span>
                    <span aria-hidden className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full border border-foreground/20 text-foreground/60 transition-all duration-300 group-open:rotate-45 group-open:border-accent group-open:bg-accent group-open:text-white">
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    </span>
                  </summary>
                  <div className="pb-6 pl-[calc(1rem+1.5rem)] pr-4 leading-relaxed text-foreground/70 sm:pl-[calc(1.5rem+1.5rem+0.5rem)] sm:pr-14">{item.a}</div>
                </details>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.section>
  );
}
