"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import CodeWindow from "@/app/components/CodeWindow";
import Icon from "@/app/components/Icon";
import LangSwitcher from "@/app/components/LangSwitcher";
import { useLang } from "@/app/i18n/lang";

// 🔢 Анимированный счётчик
function AnimatedCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, { duration: 2, ease: [0.16, 1, 0.3, 1] });
      return () => controls.stop();
    }
  }, [isInView, count, to]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
}

// ✉️ Модалка записи (та же что на главной)
function ApplyModal({ open, onClose, defaultCourse = "" }: { open: boolean; onClose: () => void; defaultCourse?: string }) {
  const { tr } = useLang();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { if (open && defaultCourse) setCourse(defaultCourse); }, [open, defaultCourse]);
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    const lines = ["Здравствуйте! Хочу записать ребёнка на пробный урок.", "", `Имя ребёнка: ${name}`];
    if (age) lines.push(`Возраст: ${age}`);
    lines.push(`Телефон: ${phone}`);
    if (course) lines.push(`Курс: ${course}`);
    const message = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/77001234567?text=${message}`, "_blank");
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setName(""); setAge(""); setPhone(""); setCourse("");
    }, 3500);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 30, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="relative bg-surface rounded-3xl p-7 sm:p-9 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={onClose} aria-label={tr("Закрыть", "Жабу", "Close")} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors z-10">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" /></svg>
            </button>
            {submitted ? (
              <div className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="text-7xl mb-5">✅</motion.div>
                <h3 className="font-display text-2xl font-bold mb-2">{tr("Заявка отправлена!", "Өтінім жіберілді!", "Request sent!")}</h3>
                <p className="text-foreground/65 text-sm">{tr("Сейчас откроется WhatsApp. Менеджер ответит в течение часа.", "Қазір WhatsApp ашылады. Менеджер бір сағат ішінде жауап береді.", "WhatsApp will open now. A manager will reply within an hour.")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-soft-pulse" />
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">{tr("Бесплатно", "Тегін", "Free")}</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold mb-2 leading-tight">
                    {tr("Запись на ", "", "Sign up for a ")}<span className="text-accent">{tr("пробный урок", "Сынақ сабаққа жазылу", "free trial")}</span>
                  </h3>
                  <p className="text-foreground/65 text-sm">{tr("60 минут, без обязательств.", "60 минут, міндеттемесіз.", "60 minutes, no obligations.")}</p>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">{tr("Имя ребёнка", "Баланың аты", "Child's name")} <span className="text-accent">*</span></label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder={tr("Айдар", "Айдар", "Aidar")} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">{tr("Возраст", "Жасы", "Age")}</label>
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="14" min="12" max="18" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">{tr("Телефон родителя", "Ата-ана телефоны", "Parent's phone")} <span className="text-accent">*</span></label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+7 (___) ___-__-__" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">{tr("Курс", "Курс", "Course")}</label>
                    <select value={course} onChange={(e) => setCourse(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all">
                      <option value="Веб-разработка">🌐 {tr("Веб-разработка", "Веб-әзірлеу", "Web development")}</option>
                      <option value="Мобильная разработка">📱 {tr("Мобильная разработка", "Мобильді әзірлеу", "Mobile development")}</option>
                      <option value="Геймдев на Unity">🎮 {tr("Геймдев на Unity", "Unity-де геймдев", "Game dev on Unity")}</option>
                      <option value="Бэкенд на Python">⚙️ {tr("Бэкенд на Python", "Python-дағы бэкенд", "Backend on Python")}</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full px-6 py-4 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold transition-all shadow-lg shadow-accent/30 hover:scale-[1.01] flex items-center justify-center gap-2">
                  <span>💬</span> {tr("Отправить заявку в WhatsApp", "WhatsApp арқылы өтінім жіберу", "Send request via WhatsApp")}
                </button>
                <p className="text-xs text-foreground/45 text-center mt-4 leading-relaxed">{tr("Нажимая на кнопку, вы соглашаетесь с обработкой персональных данных", "Батырманы басу арқылы дербес деректерді өңдеуге келісесіз", "By clicking, you consent to the processing of personal data")}</p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as any } } };
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } } };
const staggerItem = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any } } };
const scrollViewport = { once: true, amount: 0.15 };

// 📚 ПРОГРАММА КУРСА (из реального КТП)
type Tr = (ru: string, kz: string, en: string) => string;
function makeStages(tr: Tr) {
  return [
  {
    badge: tr("Этап 1", "1-кезең", "Stage 1"),
    duration: tr("3 недели · 6 уроков", "3 апта · 6 сабақ", "3 weeks · 6 lessons"),
    title: tr("Vibe-coding: первый сайт через AI", "Vibe-coding: AI арқылы алғашқы сайт", "Vibe-coding: your first site with AI"),
    emoji: "🚀",
    color: "from-accent/15 via-accent-soft/10",
    description: tr("Ученик за 3 недели получает рабочий сайт с помощью ChatGPT. Видит вау-эффект, влюбляется в IT, понимает зачем нужен код.", "Оқушы 3 аптада ChatGPT көмегімен жұмыс істейтін сайт алады. Вау-әсерді көреді, IT-ге ғашық болады, кодтың не үшін керегін түсінеді.", "In 3 weeks the student gets a working site with ChatGPT. They see the wow-effect, fall in love with IT, and understand why code matters."),
    outcome: tr("✓ Первый сайт в интернете (Netlify) ✓ GitHub-профиль ✓ Demo-day презентация", "✓ Интернеттегі алғашқы сайт (Netlify) ✓ GitHub-профиль ✓ Demo-day презентация", "✓ First site online (Netlify) ✓ GitHub profile ✓ Demo-day presentation"),
    certificate: "Web Starter",
    lessons: [
      { num: 1, title: tr("Добро пожаловать в веб-разработку", "Веб-әзірлеуге қош келдіңіз", "Welcome to web development"), desc: tr("Из чего состоит сайт: HTML, CSS, JS. StackBlitz — IDE в браузере.", "Сайт неден тұрады: HTML, CSS, JS. StackBlitz — браузердегі IDE.", "What a site is made of: HTML, CSS, JS. StackBlitz — an in-browser IDE.") },
      { num: 2, title: tr("Vibe-coding: первый сайт через ИИ", "Vibe-coding: AI арқылы алғашқы сайт", "Vibe-coding: first site with AI"), desc: tr("Что такое prompt. Генерируем сайт-портфолио через ChatGPT.", "Prompt дегеніміз не. ChatGPT арқылы портфолио-сайт жасаймыз.", "What a prompt is. We generate a portfolio site with ChatGPT.") },
      { num: 3, title: tr("Кастомизация: делаем сайт «своим»", "Кастомизация: сайтты «өзіндік» етеміз", "Customization: make the site 'yours'"), desc: tr("Unsplash, Google Fonts, палитра. Правило: «ИИ не пишет за тебя».", "Unsplash, Google Fonts, палитра. Ереже: «AI сенің орныңа жазбайды».", "Unsplash, Google Fonts, palette. The rule: 'AI doesn't write for you'.") },
      { num: 4, title: tr("Интерактив через ИИ", "AI арқылы интерактив", "Interactivity with AI"), desc: tr("Кнопки, анимации, слайдеры через ChatGPT. Как читать чужой код.", "ChatGPT арқылы батырмалар, анимациялар, слайдерлер. Бөгде кодты қалай оқу керек.", "Buttons, animations, sliders via ChatGPT. How to read others' code.") },
      { num: 5, title: tr("Git и деплой на Netlify", "Git және Netlify-ге деплой", "Git and deploy to Netlify"), desc: tr("git init/add/commit/push. GitHub. Деплой сайта в интернет.", "git init/add/commit/push. GitHub. Сайтты интернетке деплой.", "git init/add/commit/push. GitHub. Deploy the site to the internet.") },
      { num: 6, title: tr("Demo-day #1: «Что сделал я, а что ИИ»", "Demo-day #1: «Нені мен, нені AI жасады»", "Demo-day #1: 'What I did vs the AI'"), desc: tr("Видеопрезентация: показать сайт, рассказать что свой код.", "Видеопрезентация: сайтты көрсету, қай код өзіндік екенін айту.", "A video presentation: show the site, explain which code is yours.") },
    ],
  },
  {
    badge: tr("Этап 2", "2-кезең", "Stage 2"),
    duration: tr("12 недель · 24 урока", "12 апта · 24 сабақ", "12 weeks · 24 lessons"),
    title: tr("Фундамент: HTML, CSS, JavaScript, React", "Іргетас: HTML, CSS, JavaScript, React", "Foundation: HTML, CSS, JavaScript, React"),
    emoji: "🛠",
    color: "from-foreground/[0.04] via-muted/40",
    description: tr("Учимся писать код руками. На каждом уроке — разбор: «вот что сгенерил AI, вот что не так, вот как правильно». Tailwind, Flexbox, React Hooks, fetch API.", "Кодты қолмен жазуды үйренеміз. Әр сабақта талдау: «AI осыны жасады, мынасы дұрыс емес, дұрысы былай». Tailwind, Flexbox, React Hooks, fetch API.", "We learn to write code by hand. Every lesson has a breakdown: 'here's what AI made, here's what's wrong, here's the right way'. Tailwind, Flexbox, React Hooks, fetch API."),
    outcome: tr("✓ Лендинг по AI-макету ✓ Портфолио с интерактивом ✓ Todo-list ✓ Dashboard с API ✓ React SPA-портфолио", "✓ AI-макет бойынша лендинг ✓ Интерактивті портфолио ✓ Todo-list ✓ API-мен Dashboard ✓ React SPA-портфолио", "✓ A landing from an AI mockup ✓ An interactive portfolio ✓ A to-do list ✓ A dashboard with an API ✓ A React SPA portfolio"),
    certificate: tr("HTML Master · CSS Master · JS Developer (3 сертификата)", "HTML Master · CSS Master · JS Developer (3 сертификат)", "HTML Master · CSS Master · JS Developer (3 certificates)"),
    lessons: [
      { num: 7, title: tr("HTML: структура и семантика", "HTML: құрылым және семантика", "HTML: structure and semantics"), desc: tr("header/main/section/footer. Валидатор W3C. Почему AI пишет div везде.", "header/main/section/footer. W3C валидаторы. AI неге бәрін div-пен жазады.", "header/main/section/footer. The W3C validator. Why AI puts div everywhere.") },
      { num: 8, title: tr("Формы, которые ИИ делает неправильно", "AI дұрыс жасамайтын формалар", "Forms AI gets wrong"), desc: tr("input, validation. Провокация: показываем ошибки AI.", "input, валидация. Провокация: AI қателерін көрсетеміз.", "input, validation. A provocation: we show AI's mistakes.") },
      { num: 9, title: tr("Медиа и скорость: почему сайт тормозит", "Медиа және жылдамдық: сайт неге баяулайды", "Media and speed: why a site lags"), desc: tr("Картинки, WebP, lazy-loading. Lighthouse.", "Суреттер, WebP, lazy-loading. Lighthouse.", "Images, WebP, lazy-loading. Lighthouse.") },
      { num: 10, title: tr("AI-макет за 5 минут (v0.dev)", "5 минутта AI-макет (v0.dev)", "An AI mockup in 5 minutes (v0.dev)"), desc: tr("Vercel v0. Figma как читалка макета.", "Vercel v0. Figma макетті оқу құралы ретінде.", "Vercel v0. Figma as a mockup reader.") },
      { num: 11, title: tr("Адаптивный дизайн: mobile-first", "Бейімді дизайн: mobile-first", "Responsive design: mobile-first"), desc: tr("Media queries, DevTools, breakpoints.", "Media queries, DevTools, breakpoints.", "Media queries, DevTools, breakpoints.") },
      { num: 12, title: tr("Лендинг по AI-макету", "AI-макет бойынша лендинг", "A landing from an AI mockup"), desc: tr("Верстаем v0-макет руками. Можно вопросы AI — нельзя код.", "v0-макетті қолмен верстаймыз. AI-ға сұрақ болады — код болмайды.", "We build the v0 mockup by hand. AI questions allowed — code not.") },
      { num: 13, title: tr("CSS-детектив: каскад и специфичность", "CSS-детектив: каскад пен ерекшелік", "CSS detective: cascade and specificity"), desc: tr("Селекторы, !important. CSS Diner — 32 уровня.", "Селекторлар, !important. CSS Diner — 32 деңгей.", "Selectors, !important. CSS Diner — 32 levels.") },
      { num: 14, title: tr("Flexbox + промежуточный результат", "Flexbox + аралық нәтиже", "Flexbox + a milestone result"), desc: tr("Flexbox Froggy — 24 уровня. Сертификат HTML Master.", "Flexbox Froggy — 24 деңгей. HTML Master сертификаты.", "Flexbox Froggy — 24 levels. HTML Master certificate.") },
      { num: 15, title: tr("CSS Grid: двумерные лэйауты", "CSS Grid: екі өлшемді лэйаут", "CSS Grid: two-dimensional layouts"), desc: tr("Grid Garden — 28 уровней. Галерея на Grid.", "Grid Garden — 28 деңгей. Grid-тегі галерея.", "Grid Garden — 28 levels. A gallery on Grid.") },
      { num: 16, title: tr("Анимации + первый JS", "Анимациялар + алғашқы JS", "Animations + your first JS"), desc: tr("CSS transitions, keyframes. addEventListener.", "CSS transitions, keyframes. addEventListener.", "CSS transitions, keyframes. addEventListener.") },
      { num: 17, title: tr("v0 + Tailwind: компоненты за секунды", "v0 + Tailwind: секундта компоненттер", "v0 + Tailwind: components in seconds"), desc: tr("Utility-first CSS. Стандарт React-разработки 2026.", "Utility-first CSS. 2026 жылғы React-әзірлеу стандарты.", "Utility-first CSS. The 2026 React development standard.") },
      { num: 18, title: tr("Портфолио-сайт на Tailwind", "Tailwind-тегі портфолио-сайт", "A portfolio site on Tailwind"), desc: tr("Сборка портфолио с нуля. Можно вопросы AI.", "Портфолионы нөлден жинау. AI-ға сұрақ болады.", "Building a portfolio from scratch. AI questions allowed.") },
      { num: 19, title: tr("JavaScript: переменные и типы", "JavaScript: айнымалылар мен типтер", "JavaScript: variables and types"), desc: tr("VS Code. var/let/const, операторы. JSchallenger.", "VS Code. var/let/const, операторлар. JSchallenger.", "VS Code. var/let/const, operators. JSchallenger.") },
      { num: 20, title: tr("Условия и циклы", "Шарттар мен циклдар", "Conditions and loops"), desc: tr("if/else, for, while. CodeCombat — JS через игру.", "if/else, for, while. CodeCombat — ойын арқылы JS.", "if/else, for, while. CodeCombat — JS through a game.") },
      { num: 21, title: tr("Функции и события", "Функциялар мен оқиғалар", "Functions and events"), desc: tr("Arrow functions, scope. localStorage. AI как рефакторщик.", "Arrow functions, scope. localStorage. AI рефакторшы ретінде.", "Arrow functions, scope. localStorage. AI as a refactorer.") },
      { num: 22, title: tr("DOM + сертификат CSS Master", "DOM + CSS Master сертификаты", "DOM + CSS Master certificate"), desc: tr("querySelector, classList. Переключатель темы + модалка.", "querySelector, classList. Тема ауыстырғышы + модалка.", "querySelector, classList. A theme toggle + a modal.") },
      { num: 23, title: tr("API и fetch: внешние данные", "API және fetch: сыртқы деректер", "API and fetch: external data"), desc: tr("HTTP, JSON, async/await. Виджет погоды/шуток.", "HTTP, JSON, async/await. Ауа райы/әзіл виджеті.", "HTTP, JSON, async/await. A weather/jokes widget.") },
      { num: 24, title: tr("Dashboard на 2–3 виджетах", "2–3 виджеттен Dashboard", "A dashboard with 2–3 widgets"), desc: tr("Все состояния: loading/error/success. Точка выхода.", "Барлық күйлер: loading/error/success. Шығу нүктесі.", "All states: loading/error/success. A safe exit point.") },
      { num: 25, title: tr("Введение в React: следующий уровень", "React-қа кіріспе: келесі деңгей", "Intro to React: the next level"), desc: tr("Компонент = функция. JSX. Vite + Tailwind.", "Компонент = функция. JSX. Vite + Tailwind.", "A component = a function. JSX. Vite + Tailwind.") },
      { num: 26, title: tr("Props и композиция", "Props және композиция", "Props and composition"), desc: tr("Props, children, .map() + key. Card-компонент.", "Props, children, .map() + key. Card-компонент.", "Props, children, .map() + key. A Card component.") },
      { num: 27, title: tr("useState и события", "useState және оқиғалар", "useState and events"), desc: tr("Иммутабельность. Табы, форма-фильтр.", "Иммутабельділік. Табтар, форма-фильтр.", "Immutability. Tabs, a filter form.") },
      { num: 28, title: tr("useEffect: «почему зациклился»", "useEffect: «неге циклге түсті»", "useEffect: 'why it loops'"), desc: tr("Начинаем с бага: dependency array. Виджет погоды.", "Бэгтен бастаймыз: dependency array. Ауа райы виджеті.", "We start with a bug: the dependency array. A weather widget.") },
      { num: 29, title: tr("React Router: многостраничность", "React Router: көпбеттілік", "React Router: multi-page apps"), desc: tr("BrowserRouter, Routes, Link. Портфолио → SPA с 4 маршрутами.", "BrowserRouter, Routes, Link. Портфолио → 4 маршрутты SPA.", "BrowserRouter, Routes, Link. Portfolio → an SPA with 4 routes.") },
      { num: 30, title: tr("Lovable: приложение за 10 мин + сертификат JS Developer", "Lovable: 10 минутта қосымша + JS Developer сертификаты", "Lovable: an app in 10 min + JS Developer certificate"), desc: tr("Кульминация: Lovable + ручная починка строк. «Ты сильнее AI».", "Шарықтау шегі: Lovable + жолдарды қолмен түзету. «Сен AI-дан күштісің».", "The climax: Lovable + fixing lines by hand. 'You're stronger than the AI'.") },
    ],
  },
  {
    badge: tr("Этап 3", "3-кезең", "Stage 3"),
    duration: tr("9 недель · 18 уроков", "9 апта · 18 сабақ", "9 weeks · 18 lessons"),
    title: tr("Реальный проект: от ТЗ до защиты", "Нақты жоба: ТТ-дан қорғауға дейін", "A real project: from spec to defense"),
    emoji: "🎯",
    color: "from-accent-soft/20 via-muted/30",
    description: tr("Спикер ведёт демо-проект «КиноГид» (React SPA), ученик параллельно делает свой. Спринты, PR, code review, защита. AI — помощник, но защита БЕЗ AI.", "Спикер «КиноГид» демо-жобасын жүргізеді (React SPA), оқушы қатар өзінікін жасайды. Спринттер, PR, code review, қорғау. AI — көмекші, бірақ қорғау AI-СЫЗ.", "The speaker runs a demo project 'KinoGid' (React SPA) while the student builds their own. Sprints, PRs, code review, defense. AI helps, but the defense is WITHOUT AI."),
    outcome: tr("✓ Готовый проект в интернете ✓ GitHub с README и CI/CD ✓ Lighthouse ≥85 ✓ Видео защиты", "✓ Интернеттегі дайын жоба ✓ README және CI/CD-мен GitHub ✓ Lighthouse ≥85 ✓ Қорғау видеосы", "✓ A finished project online ✓ GitHub with README and CI/CD ✓ Lighthouse ≥85 ✓ A defense video"),
    certificate: tr("React Developer + ДИПЛОМ Web Developer", "React Developer + Web Developer ДИПЛОМЫ", "React Developer + a Web Developer DIPLOMA"),
    lessons: [
      { num: 31, title: tr("Выбор проекта + повторение HTML-семантики", "Жоба таңдау + HTML-семантиканы қайталау", "Choosing a project + revising HTML semantics"), desc: tr("Темы проектов. ТЗ в 5 предложений. HTML-скелет.", "Жоба тақырыптары. 5 сөйлемдік ТТ. HTML-қаңқа.", "Project topics. A 5-sentence spec. An HTML skeleton.") },
      { num: 32, title: tr("ТЗ + AI-макет + Tailwind", "ТТ + AI-макет + Tailwind", "Spec + AI mockup + Tailwind"), desc: tr("v0 для финального проекта. Установка Tailwind.", "Финалдық жоба үшін v0. Tailwind орнату.", "v0 for the final project. Installing Tailwind.") },
      { num: 33, title: tr("Git-workflow: ветки и PR", "Git-workflow: тармақтар мен PR", "Git workflow: branches and PRs"), desc: tr("develop, feature-branch, merge-конфликты. Oh My Git!", "develop, feature-branch, merge-конфликтілер. Oh My Git!", "develop, feature-branch, merge conflicts. Oh My Git!") },
      { num: 34, title: tr("Спринт 1: скелет (Flex/Grid)", "Спринт 1: қаңқа (Flex/Grid)", "Sprint 1: skeleton (Flex/Grid)"), desc: tr("Bolt.new для scaffolding. Лэйаут на Tailwind.", "Scaffolding үшін Bolt.new. Tailwind-тегі лэйаут.", "Bolt.new for scaffolding. Layout on Tailwind.") },
      { num: 35, title: tr("Спринт 2: стилизация + dark mode", "Спринт 2: стильдеу + dark mode", "Sprint 2: styling + dark mode"), desc: tr("Адаптив через sm:/md:/lg:. dark: классы.", "sm:/md:/lg: арқылы бейімделу. dark: кластары.", "Responsiveness via sm:/md:/lg:. dark: classes.") },
      { num: 36, title: tr("Спринт 3: JS-функционал", "Спринт 3: JS-функционал", "Sprint 3: JS features"), desc: tr("Поиск, фильтрация, иммутабельность. AI как debug-помощник.", "Іздеу, сүзгілеу, иммутабельділік. AI debug-көмекші ретінде.", "Search, filtering, immutability. AI as a debug helper.") },
      { num: 37, title: tr("Спринт 4: API + 4 состояния", "Спринт 4: API + 4 күй", "Sprint 4: API + 4 states"), desc: tr("TMDB API. Loading/error/empty/success — Tailwind для каждого.", "TMDB API. Loading/error/empty/success — әрқайсысына Tailwind.", "TMDB API. Loading/error/empty/success — Tailwind for each.") },
      { num: 38, title: tr("Mid-demo #5: проект на 70%", "Mid-demo #5: жоба 70%-да", "Mid-demo #5: project at 70%"), desc: tr("Видео-презентация. Self-feedback start/stop/continue.", "Видео-презентация. Self-feedback start/stop/continue.", "A video presentation. Self-feedback: start/stop/continue.") },
      { num: 39, title: tr("Firebase: БД без бэкенда (опц.)", "Firebase: бэкендсіз ДБ (опц.)", "Firebase: a DB without a backend (opt.)"), desc: tr("Firestore + auth. Или Supabase как альтернатива.", "Firestore + auth. Немесе балама ретінде Supabase.", "Firestore + auth. Or Supabase as an alternative.") },
      { num: 40, title: tr("Формы с доставкой", "Жеткізілетін формалар", "Forms that actually deliver"), desc: tr("Formspree. Почему mailto: плохо.", "Formspree. mailto: неге нашар.", "Formspree. Why mailto: is bad.") },
      { num: 41, title: tr("Безопасность: история счёта на $400", "Қауіпсіздік: $400 шот тарихы", "Security: the story of a $400 bill"), desc: tr("Реальная история. .env, GitGuardian, XSS.", "Нақты оқиға. .env, GitGuardian, XSS.", "A real story. .env, GitGuardian, XSS.") },
      { num: 42, title: tr("Оптимизация: −1 сек = +7% конверсии", "Оптимизация: −1 сек = +7% конверсия", "Optimization: −1 sec = +7% conversion"), desc: tr("Lighthouse, WebP, lazy-loading, Core Web Vitals.", "Lighthouse, WebP, lazy-loading, Core Web Vitals.", "Lighthouse, WebP, lazy-loading, Core Web Vitals.") },
      { num: 43, title: tr("Доступность + SEO", "Қолжетімділік + SEO", "Accessibility + SEO"), desc: tr("WAVE, ARIA. Open Graph, sitemap.", "WAVE, ARIA. Open Graph, sitemap.", "WAVE, ARIA. Open Graph, sitemap.") },
      { num: 44, title: tr("Тестирование и баг-фикс", "Тестілеу және баг-фикс", "Testing and bug-fixing"), desc: tr("Чек-лист. GitHub Issues. Bug Hunt Challenge.", "Чек-лист. GitHub Issues. Bug Hunt Challenge.", "A checklist. GitHub Issues. A Bug Hunt Challenge.") },
      { num: 45, title: tr("CI/CD + README", "CI/CD + README", "CI/CD + README"), desc: tr("Автодеплой. GitHub Action. Readme.so.", "Автодеплой. GitHub Action. Readme.so.", "Auto-deploy. GitHub Actions. Readme.so.") },
      { num: 46, title: tr("Mock-интервью + сертификат React Developer", "Mock-сұхбат + React Developer сертификаты", "Mock interview + React Developer certificate"), desc: tr("5-мин питч. «Не знаю» — нормально.", "5 минуттық питч. «Білмеймін» — қалыпты жағдай.", "A 5-min pitch. 'I don't know' is fine.") },
      { num: 47, title: tr("Полировка и backup", "Жылтырату және backup", "Polish and backup"), desc: tr("Финальный чек-лист 15 пунктов. Backup-видео.", "15 тармақтан финалдық чек-лист. Backup-видео.", "A final 15-point checklist. A backup video.") },
      { num: 48, title: tr("ФИНАЛЬНЫЙ DEMO-DAY → ДИПЛОМ", "ФИНАЛДЫҚ DEMO-DAY → ДИПЛОМ", "FINAL DEMO-DAY → DIPLOMA"), desc: tr("Защита БЕЗ AI. 7 мин демо + 5 мин QA. Диплом Web Developer.", "AI-СЫЗ қорғау. 7 мин демо + 5 мин QA. Web Developer дипломы.", "Defense WITHOUT AI. 7-min demo + 5-min QA. A Web Developer diploma.") },
    ],
  },
  ];
}

export default function WebCoursePage() {
  const { tr } = useLang();
  const stages = makeStages(tr);
  const [applyOpen, setApplyOpen] = useState(false);
  const openApply = () => setApplyOpen(true);

  return (
    <div className="min-h-screen bg-background">
      <ApplyModal open={applyOpen} onClose={() => setApplyOpen(false)} defaultCourse="Веб-разработка" />

      {/* ШАПКА */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <nav className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white font-display font-bold text-lg shadow-lg shadow-accent/30">Az</div>
            <span className="font-display font-bold text-xl tracking-tight">Alfa Z</span>
          </a>
          <ul className="hidden lg:flex items-center gap-8 text-sm font-medium text-foreground/70">
            <li><a href="/#courses" className="hover:text-foreground transition-colors">{tr("Все курсы", "Барлық курстар", "All courses")}</a></li>
            <li><a href="/#pricing" className="hover:text-foreground transition-colors">{tr("Цены", "Бағалар", "Pricing")}</a></li>
            <li><a href="/#schedule" className="hover:text-foreground transition-colors">{tr("Расписание", "Кесте", "Schedule")}</a></li>
            <li><a href="/#reviews" className="hover:text-foreground transition-colors">{tr("Отзывы", "Пікірлер", "Reviews")}</a></li>
          </ul>
          <div className="flex items-center gap-3">
            <LangSwitcher className="hidden sm:inline-flex" />
            <button onClick={openApply} className="px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-all hover:scale-[1.03] shadow-md shadow-accent/20 whitespace-nowrap">
              {tr("Пробный урок", "Сынақ сабақ", "Free trial")}
            </button>
          </div>
        </nav>
      </header>

      {/* ХЛЕБНЫЕ КРОШКИ */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-6">
        <a href="/#courses" className="inline-flex items-center gap-2 text-sm text-foreground/55 hover:text-accent transition-colors">
          <span>←</span> {tr("Все курсы", "Барлық курстар", "All courses")}
        </a>
      </div>

      {/* 🌐 HERO КУРСА */}
      <motion.section initial="hidden" animate="visible" variants={staggerContainer} className="relative py-12 sm:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16 items-center">
            <div>
              <motion.p variants={staggerItem} className="font-mono text-xs sm:text-sm text-accent tracking-wider mb-3">~/courses/web $ npm run dev</motion.p>
              <motion.div variants={staggerItem} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <Icon name="globe" className="h-5 w-5 text-accent" />
                <span className="text-xs font-bold text-accent uppercase tracking-wider">{tr("Курс веб-разработки", "Веб-әзірлеу курсы", "Web development course")}</span>
              </motion.div>

              <motion.h1 variants={staggerItem} className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] mb-5">
                {tr("От первого ", "Алғашқы ", "From your first ")}<span className="text-accent">«Hello, World!»</span>{tr(" до React-приложения", "-тан React-қосымшаға дейін", " to a React app")}
              </motion.h1>

              <motion.p variants={staggerItem} className="text-lg lg:text-xl text-foreground/70 leading-relaxed mb-6 max-w-2xl">
                {tr("Учимся делать современные сайты как профессионалы. HTML → CSS → Tailwind → JavaScript → React. За 6 месяцев ребёнок пройдёт путь от vibe-coding с AI до настоящего React-разработчика.", "Заманауи сайттарды кәсіби деңгейде жасауды үйренеміз. HTML → CSS → Tailwind → JavaScript → React. 6 айда бала AI-мен vibe-coding-тан нағыз React-әзірлеушіге дейінгі жолды өтеді.", "We learn to build modern sites like pros. HTML → CSS → Tailwind → JavaScript → React. In 6 months your child goes from vibe-coding with AI to a real React developer.")}
              </motion.p>

              <motion.div variants={staggerItem} className="flex flex-wrap gap-3 sm:gap-4 mb-10">
                <button onClick={openApply} className="glow-hover inline-flex items-center gap-2 px-7 py-4 bg-accent hover:bg-accent-hover text-white rounded-full font-semibold hover:scale-[1.02] transition-all duration-300 shadow-2xl shadow-accent/40">
                  {tr("Записаться на курс", "Курсқа жазылу", "Enroll in the course")} <span aria-hidden>→</span>
                </button>
                <a href="#program" className="inline-flex items-center gap-2 px-7 py-4 bg-foreground/5 hover:bg-foreground/10 border border-border text-foreground rounded-full font-semibold transition-all duration-300">
                  {tr("Смотреть программу", "Бағдарламаны қарау", "See the program")}
                </a>
              </motion.div>

              {/* СТАТЫ */}
              <motion.div variants={staggerItem} className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { value: 48, suffix: "", label: tr("уроков", "сабақ", "lessons") },
                  { value: 24, suffix: "", label: tr("недели", "апта", "weeks") },
                  { value: 6, suffix: "", label: tr("сертификатов", "сертификат", "certificates") },
                  { value: 12, suffix: "–17", label: tr("лет", "жас", "years") },
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-surface border border-border">
                    <p className="font-display text-3xl sm:text-4xl font-bold text-accent leading-none mb-1 tabular-nums">
                      <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs text-foreground/55 leading-snug">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ПРАВАЯ КАРТОЧКА — окно редактора */}
            <motion.div variants={staggerItem} className="relative">
              <CodeWindow
                title="App.jsx"
                interactive
                stack={["React", "Tailwind", "JS ES6+", "Git", "Netlify"]}
                className="glow-hover max-w-md mx-auto"
                code={`import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Кликнули {count} раз
    </button>
  );
}`}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 🏆 ЧТО ПОЛУЧИТ К КОНЦУ КУРСА */}
      <motion.section className="relative py-16 sm:py-20 border-t border-border bg-muted/20" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-12">
            <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("Результат", "Нәтиже", "The result")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {tr("Что будет у ребёнка ", "Курстан кейін ", "What your child has ")}<span className="text-accent">{tr("после курса", "балада не болады", "after the course")}</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "rocket" as const, title: tr("React-приложение в интернете", "Интернеттегі React-қосымша", "A React app online"), desc: tr("Реальный финальный проект на React + Tailwind + API. Работает 24/7 по ссылке.", "React + Tailwind + API-дегі нақты финалдық жоба. Сілтеме бойынша 24/7 жұмыс істейді.", "A real final project on React + Tailwind + API. Runs 24/7 at a link.") },
              { icon: "briefcase" as const, title: tr("GitHub-портфолио", "GitHub-портфолио", "A GitHub portfolio"), desc: tr("5–7 проектов в портфолио с README, PR-историей, CI/CD. Готово к показу работодателю.", "README, PR-тарихы, CI/CD-мен 5–7 жоба. Жұмыс берушіге көрсетуге дайын.", "5–7 projects with README, PR history, CI/CD. Ready to show an employer.") },
              { icon: "award" as const, title: tr("6 сертификатов", "6 сертификат", "6 certificates"), desc: tr("Web Starter, HTML Master, CSS Master, JS Developer, React Developer + ДИПЛОМ Web Developer.", "Web Starter, HTML Master, CSS Master, JS Developer, React Developer + Web Developer ДИПЛОМЫ.", "Web Starter, HTML Master, CSS Master, JS Developer, React Developer + a Web Developer DIPLOMA.") },
              { icon: "bot" as const, title: tr("Опыт работы с AI", "AI-мен жұмыс тәжірибесі", "Experience working with AI"), desc: tr("Умеет работать с ChatGPT, v0, Lovable. Но защищает проект БЕЗ AI — всё своё.", "ChatGPT, v0, Lovable-мен жұмыс істей алады. Бірақ жобаны AI-СЫЗ қорғайды — бәрі өзінікі.", "Can work with ChatGPT, v0, Lovable. But defends the project WITHOUT AI — all their own.") },
            ].map((item, i) => (
              <motion.div key={i} variants={staggerItem} whileHover={{ y: -6 }} className="p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 hover:shadow-xl transition-all duration-300">
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name={item.icon} className="h-6 w-6" /></span>
                <h3 className="font-display text-lg font-bold mb-2 leading-tight">{item.title}</h3>
                <p className="text-sm text-foreground/65 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 📚 ПРОГРАММА КУРСА — 3 ЭТАПА */}
      <motion.section id="program" className="relative py-20 sm:py-28 border-t border-border" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-14">
            <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("Программа курса", "Курс бағдарламасы", "Course program")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              {tr("3 этапа, ", "3 кезең, ", "3 stages, ")}<span className="text-accent">{tr("48 уроков, 6 сертификатов", "48 сабақ, 6 сертификат", "48 lessons, 6 certificates")}</span>
            </h2>
            <p className="text-lg text-foreground/70">
              {tr("Каждый этап ведёт к промежуточному результату — конкретный артефакт, который можно показать.", "Әр кезең аралық нәтижеге жетелейді — көрсетуге болатын нақты артефакт.", "Each stage leads to a milestone result — a concrete artifact you can show.")}
            </p>
          </motion.div>

          <div className="space-y-6 lg:space-y-8">
            {stages.map((stage, i) => (
              <motion.div key={i} variants={staggerItem} className={`relative p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-br ${stage.color} to-transparent bg-surface border-2 border-border hover:border-accent/30 transition-all duration-300 overflow-hidden`}>
                <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-10">
                  {/* Левая колонка — описание этапа */}
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 mb-4">
                      <span className="text-xs font-bold text-accent uppercase tracking-wider">{stage.badge}</span>
                      <span className="text-xs text-foreground/60">·</span>
                      <span className="text-xs font-medium text-foreground/70">{stage.duration}</span>
                    </div>

                    <div className="text-6xl mb-4">{stage.emoji}</div>

                    <h3 className="font-display text-2xl sm:text-3xl font-bold leading-tight mb-3">{stage.title}</h3>
                    <p className="text-base text-foreground/70 leading-relaxed mb-5">{stage.description}</p>

                    <div className="p-4 rounded-xl bg-surface border border-border mb-4">
                      <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">{tr("К концу этапа", "Кезең соңында", "By the end of the stage")}</p>
                      <p className="text-sm text-foreground leading-relaxed">{stage.outcome}</p>
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/30">
                      <span className="text-lg">🏆</span>
                      <span className="text-sm font-semibold text-accent">{stage.certificate}</span>
                    </div>
                  </div>

                  {/* Правая колонка — раскрывающийся список уроков */}
                  <details className="group">
                    <summary className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-surface border border-border cursor-pointer list-none hover:border-accent/30 transition-colors">
                      <div>
                        <p className="font-display text-lg font-bold leading-tight">{tr("Подробная программа", "Толық бағдарлама", "Detailed program")}</p>
                        <p className="text-sm text-foreground/55 mt-0.5">{stage.lessons.length} {tr("уроков — нажмите чтобы развернуть", "сабақ — ашу үшін басыңыз", "lessons — click to expand")}</p>
                      </div>
                      <span className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 group-open:bg-accent flex items-center justify-center transition-all group-open:rotate-45">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-accent group-open:text-white transition-colors">
                          <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </span>
                    </summary>

                    <div className="mt-4 space-y-2">
                      {stage.lessons.map((lesson) => (
                        <div key={lesson.num} className="flex gap-4 p-4 rounded-xl bg-surface border border-border hover:border-accent/20 transition-colors">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center font-display font-bold text-accent text-sm">
                            {lesson.num}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm leading-snug mb-1">{lesson.title}</p>
                            <p className="text-xs text-foreground/60 leading-relaxed">{lesson.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 🤖 AI-СТРАТЕГИЯ */}
      <motion.section className="relative py-20 sm:py-28 border-t border-border bg-muted/20" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-14">
            <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("AI-стратегия курса", "Курстың AI-стратегиясы", "The course's AI strategy")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              {tr("AI — это ", "AI — бұл ", "AI is ")}<span className="text-accent">{tr("инструмент, не замена", "құрал, алмастырушы емес", "a tool, not a replacement")}</span>
            </h2>
            <p className="text-lg text-foreground/70">
              {tr("Мы не делаем вид что ChatGPT не существует. Учим работать с ним правильно — на каждом этапе своя стратегия.", "Біз ChatGPT жоқтай сыңай танытпаймыз. Онымен дұрыс жұмыс істеуді үйретеміз — әр кезеңде өз стратегиясы.", "We don't pretend ChatGPT doesn't exist. We teach working with it properly — a different strategy at each stage.")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
            {[
              { num: "01", emoji: "🚀", title: tr("Этап 1: AI делает всё", "1-кезең: AI бәрін жасайды", "Stage 1: AI does everything"), desc: tr("Ученик за 3 недели получает рабочий сайт через ChatGPT. Видит вау-эффект — «оказывается, я могу!». Влюбляется в IT.", "Оқушы 3 аптада ChatGPT арқылы жұмыс істейтін сайт алады. Вау-әсерді көреді — «мен істей аламын екенмін!». IT-ге ғашық болады.", "In 3 weeks the student gets a working site via ChatGPT. They see the wow-effect — 'turns out I can!'. They fall in love with IT."), tag: "Vibe-coding" },
              { num: "02", emoji: "🎯", title: tr("Этап 2: Отбираем у AI", "2-кезең: AI-дан алып қоямыз", "Stage 2: Taking it back from AI"), desc: tr("AI = объяснение, ученик пишет код. На уроках разбираем «вот что сгенерил AI — вот 3 ошибки». Ученик учится критическому взгляду.", "AI = түсіндіру, кодты оқушы жазады. Сабақтарда «AI осыны жасады — мынау 3 қате» деп талдаймыз. Оқушы сыни көзқарасқа үйренеді.", "AI = explanation, the student writes the code. In class we break down 'here's what AI made — here are 3 mistakes'. The student learns a critical eye."), tag: tr("Можно вопросы, нельзя код", "Сұрақ болады, код болмайды", "Questions yes, code no") },
              { num: "03", emoji: "🏆", title: tr("Этап 3: Защита без AI", "3-кезең: AI-сыз қорғау", "Stage 3: Defense without AI"), desc: tr("На финальной защите ученик работает один. Всё что показывает — его. Так же, как на реальных собеседованиях.", "Финалдық қорғауда оқушы жалғыз жұмыс істейді. Көрсеткенінің бәрі — өзінікі. Нақты сұхбаттардағыдай.", "At the final defense the student works alone. Everything they show is their own. Just like in real interviews."), tag: tr("Самостоятельность", "Дербестік", "Independence") },
            ].map((item, i) => (
              <motion.div key={i} variants={staggerItem} whileHover={{ y: -8 }} className="relative p-7 rounded-2xl bg-surface border border-border hover:border-accent/30 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-display text-5xl font-bold text-accent/30 leading-none">{item.num}</span>
                  <span className="text-3xl">{item.emoji}</span>
                </div>
                <h3 className="font-display text-xl font-bold mb-3 leading-tight">{item.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed mb-4">{item.desc}</p>
                <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-xs font-semibold text-accent">{item.tag}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 🎮 ИГРЫ И ТРЕНАЖЁРЫ */}
      <motion.section className="relative py-20 sm:py-28 border-t border-border" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="max-w-2xl mb-12">
            <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("Учимся через игры", "Ойын арқылы үйренеміз", "Learning through games")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {tr("Не зубрёжка, а ", "Жаттау емес, ", "Not cramming, but ")}<span className="text-accent">{tr("тренажёры и геймификация", "тренажёрлар мен геймификация", "trainers and gamification")}</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: "Learn Git Branching", desc: tr("Учим Git через интерактивные уровни в браузере. Без страха перед командной строкой.", "Git-ті браузердегі интерактивті деңгейлер арқылы үйренеміз. Командалық жолдан қорықпай.", "Learn Git through interactive levels in the browser. No fear of the command line."), emoji: "🌿" },
              { name: "CSS Diner", desc: tr("32 уровня на CSS-селекторы. Кормим существ через правильные селекторы.", "CSS-селекторларға 32 деңгей. Дұрыс селекторлармен жәндіктерді тамақтандырамыз.", "32 levels on CSS selectors. Feed creatures with the right selectors."), emoji: "🍽" },
              { name: "Flexbox Froggy", desc: tr("24 уровня — перемещаем лягушек через flexbox-свойства. К концу — мастер Flexbox.", "24 деңгей — бақаларды flexbox-қасиеттерімен жылжытамыз. Соңында — Flexbox шебері.", "24 levels — move frogs with flexbox properties. By the end, a Flexbox master."), emoji: "🐸" },
              { name: "CSS Grid Garden", desc: tr("28 уровней про CSS Grid. Поливаем огород через grid-области.", "CSS Grid туралы 28 деңгей. Бақшаны grid-аймақтармен суарамыз.", "28 levels on CSS Grid. Water the garden with grid areas."), emoji: "🌱" },
              { name: "JSchallenger", desc: tr("JS-задачи с мгновенной проверкой. От «Basics» до «Arrays» — реальная практика.", "Лезде тексерілетін JS-тапсырмалар. «Basics»-тен «Arrays»-ге дейін — нақты тәжірибе.", "JS tasks with instant checks. From 'Basics' to 'Arrays' — real practice."), emoji: "💪" },
              { name: "CodeCombat", desc: tr("Управляем героем JavaScript-кодом. Учим циклы и условия через приключение.", "Кейіпкерді JavaScript-кодпен басқарамыз. Циклдар мен шарттарды шытырман оқиға арқылы үйренеміз.", "Control a hero with JavaScript code. Learn loops and conditions through an adventure."), emoji: "⚔️" },
            ].map((game, i) => (
              <motion.div key={i} variants={staggerItem} whileHover={{ y: -6 }} className="p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-3">{game.emoji}</div>
                <h4 className="font-display text-base font-bold mb-2">{game.name}</h4>
                <p className="text-sm text-foreground/65 leading-relaxed">{game.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 🪜 ДВА УРОВНЯ ДЗ */}
      <motion.section className="relative py-20 sm:py-28 border-t border-border bg-muted/20" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div variants={fadeInUp}>
              <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("Никто не застревает", "Ешкім тұрып қалмайды", "No one gets stuck")}</p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-5">
                {tr("Два уровня ", "Үй тапсырмасының ", "Two levels of ")}<span className="text-accent">{tr("домашних заданий", "екі деңгейі", "homework")}</span>
              </h2>
              <p className="text-lg text-foreground/70 leading-relaxed mb-6">
                {tr("Если ученик не справляется с основным заданием — через 48 часов открывается облегчённая версия. Готовый шаблон кода, подсказки с таймкодами видео. Главное — движение, а не «сижу неделю на одной задаче».", "Егер оқушы негізгі тапсырманы орындай алмаса — 48 сағаттан кейін жеңілдетілген нұсқасы ашылады. Дайын код шаблоны, видео таймкодтарымен кеңестер. Ең бастысы — қозғалыс, «бір тапсырмада апта бойы отыру» емес.", "If the student can't handle the main task — an easier version unlocks after 48 hours. A ready code template, hints with video timecodes. The point is momentum, not 'sitting on one task for a week'.")}
              </p>
              <p className="text-base text-foreground/65 italic">
                {tr("Уровень 2 — не стыдно. Это scaffold чтобы идти дальше, а не вариант для «слабых».", "2-деңгей — ұят емес. Бұл әрі қарай жүру үшін scaffold, «әлсіздерге» арналған нұсқа емес.", "Level 2 is nothing to be ashamed of. It's a scaffold to move forward, not an option for the 'weak'.")}
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-4">
              <div className="p-6 rounded-2xl bg-surface border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">1</div>
                  <h3 className="font-display text-xl font-bold">{tr("Уровень 1 — основной", "1-деңгей — негізгі", "Level 1 — main")}</h3>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {tr("Полноценное задание без подсказок. Если справился — идём дальше. 5-7 пунктов, иногда видео-демонстрация работы.", "Нұсқаусыз толыққанды тапсырма. Орындаса — әрі қарай жүреміз. 5-7 тармақ, кейде жұмыстың видео-демонстрациясы.", "A full task with no hints. If you manage — we move on. 5–7 items, sometimes a video demo of the work.")}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent border-2 border-accent/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">2</div>
                  <h3 className="font-display text-xl font-bold">{tr("Уровень 2 — облегчённый", "2-деңгей — жеңілдетілген", "Level 2 — easier")}</h3>
                </div>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li className="flex gap-2"><span className="text-accent">✓</span> {tr("Готовый шаблон кода (60-70%), дописываем остальное", "Дайын код шаблоны (60-70%), қалғанын жазамыз", "A ready code template (60–70%), you finish the rest")}</li>
                  <li className="flex gap-2"><span className="text-accent">✓</span> {tr("3-4 пункта вместо 5-7", "5-7 орнына 3-4 тармақ", "3–4 items instead of 5–7")}</li>
                  <li className="flex gap-2"><span className="text-accent">✓</span> {tr("Подсказки с таймкодами видео", "Видео таймкодтарымен кеңестер", "Hints with video timecodes")}</li>
                  <li className="flex gap-2"><span className="text-accent">✓</span> {tr("Текст или скрин вместо видео-задания", "Видео-тапсырманың орнына мәтін не скрин", "Text or a screenshot instead of a video task")}</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 👨‍💻 ПРЕПОДАВАТЕЛЬ КУРСА */}
      <motion.section className="relative py-20 sm:py-28 border-t border-border" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("Преподаватель курса", "Курс ұстазы", "Course instructor")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {tr("Не теоретик. ", "Теоретик емес. ", "Not a theorist. ")}<span className="text-accent">{tr("Действующий разработчик.", "Нағыз әзірлеуші.", "A working developer.")}</span>
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid sm:grid-cols-[auto_1fr] gap-6 lg:gap-10 items-center p-6 sm:p-8 lg:p-10 rounded-3xl bg-surface border border-border">
            <div className="relative w-32 h-32 sm:w-44 sm:h-44 lg:w-52 lg:h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-accent via-accent-soft to-muted flex items-center justify-center flex-shrink-0">
              <span className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg">МБ</span>
            </div>

            <div>
              <h3 className="font-display text-2xl lg:text-3xl font-bold mb-1">Молдаханов Бектас</h3>
              <p className="text-base font-semibold text-accent mb-4">{tr("Frontend-разработчик", "Frontend-әзірлеуші", "Frontend developer")}</p>

              <p className="text-base text-foreground/70 leading-relaxed mb-5">
                {tr("Действующий frontend-разработчик — каждый день пишет интерфейсы на React в продакшене. Не теоретик из университета, а практик, который делает реальные проекты и учит тому же.", "Нағыз frontend-әзірлеуші — күнде продакшенде React-те интерфейс жазады. Университет теоретигі емес, нақты жобалар жасайтын және соны үйрететін практик.", "A working frontend developer — writes React interfaces in production every day. Not a university theorist, but a practitioner who builds real projects and teaches the same.")}
              </p>

              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "Tailwind", "Node.js", "Git"].map((tech, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-accent/10 text-xs font-semibold text-accent">{tech}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 💰 ЦЕНА + 📅 РАСПИСАНИЕ */}
      <motion.section className="relative py-20 sm:py-28 border-t border-border bg-muted/20" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-12">
            <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("Стоимость и старт", "Құны мен старты", "Price & start")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {tr("Сколько стоит и ", "Қанша тұрады және ", "How much it costs and ")}<span className="text-accent">{tr("когда начинаем", "қашан бастаймыз", "when we start")}</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5 lg:gap-6 max-w-4xl mx-auto">
            {/* Цена */}
            <motion.div variants={staggerItem} className="p-7 lg:p-9 rounded-3xl bg-surface border-2 border-border hover:border-accent/30 transition-colors">
              <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent"><Icon name="wallet" className="h-7 w-7" /></span>
              <h3 className="font-display text-2xl font-bold mb-2">{tr("Цена", "Баға", "Price")}</h3>
              <div className="flex items-baseline gap-2 flex-wrap mb-2">
                <span className="font-display text-3xl lg:text-4xl font-bold text-foreground leading-none tabular-nums">75 000 ₸</span>
                <span className="text-foreground/50 text-lg">/ {tr("месяц", "ай", "month")}</span>
              </div>
              <p className="text-sm text-foreground/65 mb-5">{tr("Одинаково весь период обучения · без скрытых доплат", "Бүкіл оқу кезеңінде бірдей · жасырын төлемсіз", "The same for the whole course · no hidden fees")}</p>

              <div className="space-y-2 text-sm text-foreground/70 mb-6">
                <p className="flex gap-2"><span className="text-accent">💛</span> {tr("Льготникам (многодетные, инвалиды) — 60 000 ₸ в месяц", "Жеңілдік санатына (көп балалы, мүгедектік) — айына 60 000 ₸", "Eligible categories (large families, disability) — 60,000 ₸ a month")}</p>
                <p className="flex gap-2"><span className="text-accent">🔥</span> {tr("Kaspi-рассрочка 0% на 3 или 6 месяцев", "Kaspi 0% бөліп төлеу 3 не 6 айға", "Kaspi 0% installments over 3 or 6 months")}</p>
                <p className="flex gap-2"><span className="text-accent">🔒</span> {tr("Цена фиксирована на весь курс", "Баға бүкіл курсқа бекітілген", "The price is fixed for the whole course")}</p>
              </div>

              <a href="/#pricing" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover transition-colors">
                {tr("Подробнее про оплату", "Төлем туралы толығырақ", "More about payment")} <span>→</span>
              </a>
            </motion.div>

            {/* Расписание */}
            <motion.div variants={staggerItem} className="p-7 lg:p-9 rounded-3xl bg-gradient-to-br from-accent/10 via-accent-soft/10 to-transparent border-2 border-accent/30">
              <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent"><Icon name="calendar" className="h-7 w-7" /></span>
              <h3 className="font-display text-2xl font-bold mb-2">{tr("Набор в группы", "Топтарға қабылдау", "Group enrollment")}</h3>
              <p className="font-display text-4xl lg:text-5xl font-bold text-accent leading-tight mb-2">{tr("Открыт", "Ашық", "Open")}</p>
              <p className="text-sm text-foreground/65 mb-5">{tr("старт по мере набора группы", "топ жиналған сайын басталады", "starts as the group fills")}</p>

              <div className="space-y-2 text-sm text-foreground/70 mb-6">
                <p className="flex gap-2"><span className="text-accent">🕐</span> <strong>{tr("2 раза", "2 рет", "2×")}</strong> {tr("в неделю, по 90 мин", "аптасына, 90 минуттан", "a week, 90 min each")}</p>
                <p className="flex gap-2"><span className="text-accent">📆</span> {tr("Гибкий график — ", "Икемді кесте — ", "Flexible schedule — ")}<em>{tr("подберём удобные дни и время", "ыңғайлы күн мен уақыт таңдаймыз", "we'll pick convenient days and times")}</em></p>
                <p className="flex gap-2"><span className="text-accent">👥</span> {tr("Группа до 8 человек", "Топ 8 адамға дейін", "A group of up to 8")}</p>
              </div>

              <a href="/#schedule" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover transition-colors">
                {tr("Подробнее про расписание", "Кесте туралы толығырақ", "More about the schedule")} <span>→</span>
              </a>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 🎁 ФИНАЛЬНЫЙ CTA */}
      <motion.section className="relative py-24 sm:py-32 border-t border-border overflow-hidden" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center">
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-accent animate-soft-pulse" />
              <span className="relative w-2 h-2 rounded-full bg-accent" />
            </span>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">{tr("Бесплатно", "Тегін", "Free")}</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-5">
            {tr("Первый урок — ", "Алғашқы сабақ — ", "The first lesson — ")}<span className="text-accent">{tr("бесплатно", "тегін", "free")}</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="text-lg lg:text-xl text-foreground/70 leading-relaxed mb-10 max-w-xl mx-auto">
            {tr("Ребёнок попробует, познакомится с преподавателем, сделает первый сайт через AI. Если не понравится — никаких обязательств.", "Бала байқап көреді, ұстазбен танысады, AI арқылы алғашқы сайтын жасайды. Ұнамаса — ешқандай міндеттеме жоқ.", "Your child will try it, meet the instructor, and build their first site with AI. If they don't like it — no obligations.")}
          </motion.p>

          <motion.button variants={fadeInUp} onClick={openApply} className="inline-flex items-center gap-3 px-8 py-5 bg-accent hover:bg-accent-hover text-white rounded-full font-semibold text-lg hover:scale-[1.02] transition-all duration-300 shadow-2xl shadow-accent/40">
            {tr("Записаться на пробный урок", "Сынақ сабаққа жазылу", "Book a free trial")} <span>→</span>
          </motion.button>

          <motion.p variants={fadeInUp} className="text-sm text-foreground/50 mt-6">
            {tr("60 минут · в Discord · менеджер свяжется в течение часа", "60 минут · Discord-та · менеджер бір сағат ішінде хабарласады", "60 minutes · on Discord · a manager will contact you within an hour")}
          </motion.p>
        </div>
      </motion.section>

      {/* МИНИ-FOOTER */}
      <footer className="border-t border-border bg-foreground text-surface py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center font-display font-bold text-lg">Az</div>
              <span className="font-display text-xl font-bold">Alfa Z</span>
            </a>
            <div className="flex flex-wrap gap-6 text-sm text-surface/60">
              <a href="/" className="hover:text-accent transition-colors">{tr("Главная", "Басты бет", "Home")}</a>
              <a href="/#courses" className="hover:text-accent transition-colors">{tr("Все курсы", "Барлық курстар", "All courses")}</a>
              <a href="/#pricing" className="hover:text-accent transition-colors">{tr("Цены", "Бағалар", "Pricing")}</a>
              <a href="/#faq" className="hover:text-accent transition-colors">FAQ</a>
            </div>
            <p className="text-xs text-surface/40">© 2026 Alfa Z · {tr("Астана", "Астана", "Astana")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
