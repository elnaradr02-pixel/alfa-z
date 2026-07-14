"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from "framer-motion";

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
            <button onClick={onClose} aria-label="Закрыть" className="absolute top-4 right-4 w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors z-10">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" /></svg>
            </button>
            {submitted ? (
              <div className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="text-7xl mb-5">✅</motion.div>
                <h3 className="font-display text-2xl font-bold mb-2">Заявка отправлена!</h3>
                <p className="text-foreground/65 text-sm">Сейчас откроется WhatsApp. Менеджер ответит в течение часа.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-soft-pulse" />
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">Бесплатно</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold mb-2 leading-tight">
                    Запись на <span className="text-accent">пробный урок</span>
                  </h3>
                  <p className="text-foreground/65 text-sm">60 минут, без обязательств.</p>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Имя ребёнка <span className="text-accent">*</span></label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Айдар" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Возраст</label>
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="14" min="12" max="18" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Телефон родителя <span className="text-accent">*</span></label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+7 (___) ___-__-__" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Курс</label>
                    <select value={course} onChange={(e) => setCourse(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all">
                      <option value="Веб-разработка">🌐 Веб-разработка</option>
                      <option value="Мобильная разработка">📱 Мобильная разработка</option>
                      <option value="Геймдев на Unity">🎮 Геймдев на Unity</option>
                      <option value="Бэкенд на Python">⚙️ Бэкенд на Python</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full px-6 py-4 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold transition-all shadow-lg shadow-accent/30 hover:scale-[1.01] flex items-center justify-center gap-2">
                  <span>💬</span> Отправить заявку в WhatsApp
                </button>
                <p className="text-xs text-foreground/45 text-center mt-4 leading-relaxed">Нажимая на кнопку, вы соглашаетесь с обработкой персональных данных</p>
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
const stages = [
  {
    badge: "Этап 1",
    duration: "3 недели · 6 уроков",
    title: "Vibe-coding: первый сайт через AI",
    emoji: "🚀",
    color: "from-accent/15 via-accent-soft/10",
    description: "Ученик за 3 недели получает рабочий сайт с помощью ChatGPT. Видит вау-эффект, влюбляется в IT, понимает зачем нужен код.",
    outcome: "✓ Первый сайт в интернете (Netlify) ✓ GitHub-профиль ✓ Demo-day презентация",
    certificate: "Web Starter",
    lessons: [
      { num: 1, title: "Добро пожаловать в веб-разработку", desc: "Из чего состоит сайт: HTML, CSS, JS. StackBlitz — IDE в браузере." },
      { num: 2, title: "Vibe-coding: первый сайт через ИИ", desc: "Что такое prompt. Генерируем сайт-портфолио через ChatGPT." },
      { num: 3, title: "Кастомизация: делаем сайт «своим»", desc: "Unsplash, Google Fonts, палитра. Правило: «ИИ не пишет за тебя»." },
      { num: 4, title: "Интерактив через ИИ", desc: "Кнопки, анимации, слайдеры через ChatGPT. Как читать чужой код." },
      { num: 5, title: "Git и деплой на Netlify", desc: "git init/add/commit/push. GitHub. Деплой сайта в интернет." },
      { num: 6, title: "Demo-day #1: «Что сделал я, а что ИИ»", desc: "Видеопрезентация: показать сайт, рассказать что свой код." },
    ],
  },
  {
    badge: "Этап 2",
    duration: "12 недель · 24 урока",
    title: "Фундамент: HTML, CSS, JavaScript, React",
    emoji: "🛠",
    color: "from-foreground/[0.04] via-muted/40",
    description: "Учимся писать код руками. На каждом уроке — разбор: «вот что сгенерил AI, вот что не так, вот как правильно». Tailwind, Flexbox, React Hooks, fetch API.",
    outcome: "✓ Лендинг по AI-макету ✓ Портфолио с интерактивом ✓ Todo-list ✓ Dashboard с API ✓ React SPA-портфолио",
    certificate: "HTML Master · CSS Master · JS Developer (3 сертификата)",
    lessons: [
      { num: 7, title: "HTML: структура и семантика", desc: "header/main/section/footer. Валидатор W3C. Почему AI пишет div везде." },
      { num: 8, title: "Формы, которые ИИ делает неправильно", desc: "input, validation. Провокация: показываем ошибки AI." },
      { num: 9, title: "Медиа и скорость: почему сайт тормозит", desc: "Картинки, WebP, lazy-loading. Lighthouse." },
      { num: 10, title: "AI-макет за 5 минут (v0.dev)", desc: "Vercel v0. Figma как читалка макета." },
      { num: 11, title: "Адаптивный дизайн: mobile-first", desc: "Media queries, DevTools, breakpoints." },
      { num: 12, title: "Лендинг по AI-макету", desc: "Верстаем v0-макет руками. Можно вопросы AI — нельзя код." },
      { num: 13, title: "CSS-детектив: каскад и специфичность", desc: "Селекторы, !important. CSS Diner — 32 уровня." },
      { num: 14, title: "Flexbox + промежуточный результат", desc: "Flexbox Froggy — 24 уровня. Сертификат HTML Master." },
      { num: 15, title: "CSS Grid: двумерные лэйауты", desc: "Grid Garden — 28 уровней. Галерея на Grid." },
      { num: 16, title: "Анимации + первый JS", desc: "CSS transitions, keyframes. addEventListener." },
      { num: 17, title: "v0 + Tailwind: компоненты за секунды", desc: "Utility-first CSS. Стандарт React-разработки 2026." },
      { num: 18, title: "Портфолио-сайт на Tailwind", desc: "Сборка портфолио с нуля. Можно вопросы AI." },
      { num: 19, title: "JavaScript: переменные и типы", desc: "VS Code. var/let/const, операторы. JSchallenger." },
      { num: 20, title: "Условия и циклы", desc: "if/else, for, while. CodeCombat — JS через игру." },
      { num: 21, title: "Функции и события", desc: "Arrow functions, scope. localStorage. AI как рефакторщик." },
      { num: 22, title: "DOM + сертификат CSS Master", desc: "querySelector, classList. Переключатель темы + модалка." },
      { num: 23, title: "API и fetch: внешние данные", desc: "HTTP, JSON, async/await. Виджет погоды/шуток." },
      { num: 24, title: "Dashboard на 2–3 виджетах", desc: "Все состояния: loading/error/success. Точка выхода." },
      { num: 25, title: "Введение в React: следующий уровень", desc: "Компонент = функция. JSX. Vite + Tailwind." },
      { num: 26, title: "Props и композиция", desc: "Props, children, .map() + key. Card-компонент." },
      { num: 27, title: "useState и события", desc: "Иммутабельность. Табы, форма-фильтр." },
      { num: 28, title: "useEffect: «почему зациклился»", desc: "Начинаем с бага: dependency array. Виджет погоды." },
      { num: 29, title: "React Router: многостраничность", desc: "BrowserRouter, Routes, Link. Портфолио → SPA с 4 маршрутами." },
      { num: 30, title: "Lovable: приложение за 10 мин + сертификат JS Developer", desc: "Кульминация: Lovable + ручная починка строк. «Ты сильнее AI»." },
    ],
  },
  {
    badge: "Этап 3",
    duration: "9 недель · 18 уроков",
    title: "Реальный проект: от ТЗ до защиты",
    emoji: "🎯",
    color: "from-accent-soft/20 via-muted/30",
    description: "Спикер ведёт демо-проект «КиноГид» (React SPA), ученик параллельно делает свой. Спринты, PR, code review, защита. AI — помощник, но защита БЕЗ AI.",
    outcome: "✓ Готовый проект в интернете ✓ GitHub с README и CI/CD ✓ Lighthouse ≥85 ✓ Видео защиты",
    certificate: "React Developer + ДИПЛОМ Web Developer",
    lessons: [
      { num: 31, title: "Выбор проекта + повторение HTML-семантики", desc: "Темы проектов. ТЗ в 5 предложений. HTML-скелет." },
      { num: 32, title: "ТЗ + AI-макет + Tailwind", desc: "v0 для финального проекта. Установка Tailwind." },
      { num: 33, title: "Git-workflow: ветки и PR", desc: "develop, feature-branch, merge-конфликты. Oh My Git!" },
      { num: 34, title: "Спринт 1: скелет (Flex/Grid)", desc: "Bolt.new для scaffolding. Лэйаут на Tailwind." },
      { num: 35, title: "Спринт 2: стилизация + dark mode", desc: "Адаптив через sm:/md:/lg:. dark: классы." },
      { num: 36, title: "Спринт 3: JS-функционал", desc: "Поиск, фильтрация, иммутабельность. AI как debug-помощник." },
      { num: 37, title: "Спринт 4: API + 4 состояния", desc: "TMDB API. Loading/error/empty/success — Tailwind для каждого." },
      { num: 38, title: "Mid-demo #5: проект на 70%", desc: "Видео-презентация. Self-feedback start/stop/continue." },
      { num: 39, title: "Firebase: БД без бэкенда (опц.)", desc: "Firestore + auth. Или Supabase как альтернатива." },
      { num: 40, title: "Формы с доставкой", desc: "Formspree. Почему mailto: плохо." },
      { num: 41, title: "Безопасность: история счёта на $400", desc: "Реальная история. .env, GitGuardian, XSS." },
      { num: 42, title: "Оптимизация: −1 сек = +7% конверсии", desc: "Lighthouse, WebP, lazy-loading, Core Web Vitals." },
      { num: 43, title: "Доступность + SEO", desc: "WAVE, ARIA. Open Graph, sitemap." },
      { num: 44, title: "Тестирование и баг-фикс", desc: "Чек-лист. GitHub Issues. Bug Hunt Challenge." },
      { num: 45, title: "CI/CD + README", desc: "Автодеплой. GitHub Action. Readme.so." },
      { num: 46, title: "Mock-интервью + сертификат React Developer", desc: "5-мин питч. «Не знаю» — нормально." },
      { num: 47, title: "Полировка и backup", desc: "Финальный чек-лист 15 пунктов. Backup-видео." },
      { num: 48, title: "ФИНАЛЬНЫЙ DEMO-DAY → ДИПЛОМ", desc: "Защита БЕЗ AI. 7 мин демо + 5 мин QA. Диплом Web Developer." },
    ],
  },
];

export default function WebCoursePage() {
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
            <li><a href="/#courses" className="hover:text-foreground transition-colors">Все курсы</a></li>
            <li><a href="/#pricing" className="hover:text-foreground transition-colors">Цены</a></li>
            <li><a href="/#schedule" className="hover:text-foreground transition-colors">Расписание</a></li>
            <li><a href="/#reviews" className="hover:text-foreground transition-colors">Отзывы</a></li>
          </ul>
          <button onClick={openApply} className="px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-all hover:scale-[1.03] shadow-md shadow-accent/20">
            Пробный урок
          </button>
        </nav>
      </header>

      {/* ХЛЕБНЫЕ КРОШКИ */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-6">
        <a href="/#courses" className="inline-flex items-center gap-2 text-sm text-foreground/55 hover:text-accent transition-colors">
          <span>←</span> Все курсы
        </a>
      </div>

      {/* 🌐 HERO КУРСА */}
      <motion.section initial="hidden" animate="visible" variants={staggerContainer} className="relative py-12 sm:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16 items-center">
            <div>
              <motion.div variants={staggerItem} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <span className="text-2xl leading-none">🌐</span>
                <span className="text-xs font-bold text-accent uppercase tracking-wider">Курс веб-разработки</span>
              </motion.div>

              <motion.h1 variants={staggerItem} className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] mb-5">
                От первого <span className="text-accent">«Hello, World!»</span> до React-приложения
              </motion.h1>

              <motion.p variants={staggerItem} className="text-lg lg:text-xl text-foreground/70 leading-relaxed mb-6 max-w-2xl">
                Учимся делать современные сайты как профессионалы. HTML → CSS → Tailwind → JavaScript → React. За 6 месяцев ребёнок пройдёт путь от vibe-coding с AI до настоящего React-разработчика.
              </motion.p>

              <motion.div variants={staggerItem} className="flex flex-wrap gap-3 sm:gap-4 mb-10">
                <button onClick={openApply} className="inline-flex items-center gap-2 px-7 py-4 bg-accent hover:bg-accent-hover text-white rounded-full font-semibold hover:scale-[1.02] transition-all duration-300 shadow-2xl shadow-accent/40">
                  Записаться на курс <span aria-hidden>→</span>
                </button>
                <a href="#program" className="inline-flex items-center gap-2 px-7 py-4 bg-foreground/5 hover:bg-foreground/10 border border-border text-foreground rounded-full font-semibold transition-all duration-300">
                  Смотреть программу
                </a>
              </motion.div>

              {/* СТАТЫ */}
              <motion.div variants={staggerItem} className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { value: 48, suffix: "", label: "уроков" },
                  { value: 24, suffix: "", label: "недели" },
                  { value: 6, suffix: "", label: "сертификатов" },
                  { value: 12, suffix: "–17", label: "лет" },
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

            {/* ПРАВАЯ КАРТОЧКА — стек */}
            <motion.div variants={staggerItem} className="relative">
              <div className="relative aspect-square max-w-md mx-auto w-full">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/40 via-accent-soft/30 to-muted/50 shadow-xl shadow-accent/20 rotate-3" />
                <div className="absolute inset-0 rounded-3xl bg-surface border border-border shadow-lg -rotate-3 p-8 flex flex-col">
                  <div className="text-7xl mb-4">🌐</div>
                  <p className="text-sm font-bold text-foreground/55 uppercase tracking-wider mb-2">Технологии курса</p>
                  <div className="grid grid-cols-2 gap-2 mb-auto">
                    {["HTML5", "CSS3", "Tailwind", "JS ES6+", "React", "Router", "Git", "Netlify"].map((tech, i) => (
                      <span key={i} className="px-3 py-2 rounded-lg bg-foreground/5 text-sm font-semibold text-foreground/80 text-center">{tech}</span>
                    ))}
                  </div>
                  <div className="mt-5 pt-5 border-t border-border">
                    <p className="font-display text-lg font-bold mb-1">+ работа с AI</p>
                    <p className="text-xs text-foreground/55">ChatGPT, v0.dev, Lovable, Bolt</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 🏆 ЧТО ПОЛУЧИТ К КОНЦУ КУРСА */}
      <motion.section className="relative py-16 sm:py-20 border-t border-border bg-muted/20" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Результат</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Что будет у ребёнка <span className="text-accent">после курса</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { emoji: "🚀", title: "React-приложение в интернете", desc: "Реальный финальный проект на React + Tailwind + API. Работает 24/7 по ссылке." },
              { emoji: "💼", title: "GitHub-портфолио", desc: "5–7 проектов в портфолио с README, PR-историей, CI/CD. Готово к показу работодателю." },
              { emoji: "🏅", title: "6 сертификатов", desc: "Web Starter, HTML Master, CSS Master, JS Developer, React Developer + ДИПЛОМ Web Developer." },
              { emoji: "🤖", title: "Опыт работы с AI", desc: "Умеет работать с ChatGPT, v0, Lovable. Но защищает проект БЕЗ AI — всё своё." },
            ].map((item, i) => (
              <motion.div key={i} variants={staggerItem} whileHover={{ y: -6 }} className="p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-3">{item.emoji}</div>
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
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Программа курса</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              3 этапа, <span className="text-accent">48 уроков, 6 сертификатов</span>
            </h2>
            <p className="text-lg text-foreground/70">
              Каждый этап ведёт к промежуточному результату — конкретный артефакт, который можно показать.
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
                      <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">К концу этапа</p>
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
                        <p className="font-display text-lg font-bold leading-tight">Подробная программа</p>
                        <p className="text-sm text-foreground/55 mt-0.5">{stage.lessons.length} уроков — нажмите чтобы развернуть</p>
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
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">AI-стратегия курса</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              AI — это <span className="text-accent">инструмент, не замена</span>
            </h2>
            <p className="text-lg text-foreground/70">
              Мы не делаем вид что ChatGPT не существует. Учим работать с ним правильно — на каждом этапе своя стратегия.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
            {[
              { num: "01", emoji: "🚀", title: "Этап 1: AI делает всё", desc: "Ученик за 3 недели получает рабочий сайт через ChatGPT. Видит вау-эффект — «оказывается, я могу!». Влюбляется в IT.", tag: "Vibe-coding" },
              { num: "02", emoji: "🎯", title: "Этап 2: Отбираем у AI", desc: "AI = объяснение, ученик пишет код. На уроках разбираем «вот что сгенерил AI — вот 3 ошибки». Ученик учится критическому взгляду.", tag: "Можно вопросы, нельзя код" },
              { num: "03", emoji: "🏆", title: "Этап 3: Защита без AI", desc: "На финальной защите ученик работает один. Всё что показывает — его. Так же, как на реальных собеседованиях.", tag: "Самостоятельность" },
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
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Учимся через игры</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Не зубрёжка, а <span className="text-accent">тренажёры и геймификация</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: "Learn Git Branching", desc: "Учим Git через интерактивные уровни в браузере. Без страха перед командной строкой.", emoji: "🌿" },
              { name: "CSS Diner", desc: "32 уровня на CSS-селекторы. Кормим существ через правильные селекторы.", emoji: "🍽" },
              { name: "Flexbox Froggy", desc: "24 уровня — перемещаем лягушек через flexbox-свойства. К концу — мастер Flexbox.", emoji: "🐸" },
              { name: "CSS Grid Garden", desc: "28 уровней про CSS Grid. Поливаем огород через grid-области.", emoji: "🌱" },
              { name: "JSchallenger", desc: "JS-задачи с мгновенной проверкой. От «Basics» до «Arrays» — реальная практика.", emoji: "💪" },
              { name: "CodeCombat", desc: "Управляем героем JavaScript-кодом. Учим циклы и условия через приключение.", emoji: "⚔️" },
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
              <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Никто не застревает</p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-5">
                Два уровня <span className="text-accent">домашних заданий</span>
              </h2>
              <p className="text-lg text-foreground/70 leading-relaxed mb-6">
                Если ученик не справляется с основным заданием — через 48 часов открывается облегчённая версия. Готовый шаблон кода, подсказки с таймкодами видео. Главное — движение, а не «сижу неделю на одной задаче».
              </p>
              <p className="text-base text-foreground/65 italic">
                Уровень 2 — не стыдно. Это scaffold чтобы идти дальше, а не вариант для «слабых».
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-4">
              <div className="p-6 rounded-2xl bg-surface border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">1</div>
                  <h3 className="font-display text-xl font-bold">Уровень 1 — основной</h3>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  Полноценное задание без подсказок. Если справился — идём дальше. 5-7 пунктов, иногда видео-демонстрация работы.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent border-2 border-accent/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">2</div>
                  <h3 className="font-display text-xl font-bold">Уровень 2 — облегчённый</h3>
                </div>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li className="flex gap-2"><span className="text-accent">✓</span> Готовый шаблон кода (60-70%), дописываем остальное</li>
                  <li className="flex gap-2"><span className="text-accent">✓</span> 3-4 пункта вместо 5-7</li>
                  <li className="flex gap-2"><span className="text-accent">✓</span> Подсказки с таймкодами видео</li>
                  <li className="flex gap-2"><span className="text-accent">✓</span> Текст или скрин вместо видео-задания</li>
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
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Преподаватель курса</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Не теоретик. <span className="text-accent">Действующий разработчик.</span>
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid sm:grid-cols-[auto_1fr] gap-6 lg:gap-10 items-center p-6 sm:p-8 lg:p-10 rounded-3xl bg-surface border border-border">
            <div className="relative w-32 h-32 sm:w-44 sm:h-44 lg:w-52 lg:h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-accent via-accent-soft to-muted flex items-center justify-center flex-shrink-0">
              <span className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg">ТМ</span>
            </div>

            <div>
              <h3 className="font-display text-2xl lg:text-3xl font-bold mb-1">Тимур М.</h3>
              <p className="text-base font-semibold text-accent mb-4">Frontend Engineer · inDriver</p>

              <p className="text-base text-foreground/70 leading-relaxed mb-5">
                4 года в IT. В inDriver работает над интерфейсом приложения, которое использует 200+ миллионов человек. До этого — фрилансер, делал лендинги для алматинских студий.
              </p>

              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "Tailwind", "Node.js", "Git"].map((tech, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-accent/10 text-xs font-semibold text-accent">{tech}</span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.p variants={fadeInUp} className="text-sm text-foreground/50 mt-6 text-center">
            ⚠️ Имя и компания — пример. Когда подтвердим реального преподавателя, заменим за 2 минуты.
          </motion.p>
        </div>
      </motion.section>

      {/* 💰 ЦЕНА + 📅 РАСПИСАНИЕ */}
      <motion.section className="relative py-20 sm:py-28 border-t border-border bg-muted/20" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Стоимость и старт</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Сколько стоит и <span className="text-accent">когда начинаем</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5 lg:gap-6 max-w-4xl mx-auto">
            {/* Цена */}
            <motion.div variants={staggerItem} className="p-7 lg:p-9 rounded-3xl bg-surface border-2 border-border hover:border-accent/30 transition-colors">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="font-display text-2xl font-bold mb-2">Цена</h3>
              <div className="flex items-baseline gap-2 flex-wrap mb-2">
                <span className="font-display text-3xl lg:text-4xl font-bold text-foreground leading-none tabular-nums">75 000 ₸</span>
                <span className="text-foreground/50 text-lg">/ месяц</span>
              </div>
              <p className="text-sm text-foreground/65 mb-5">Одинаково весь период обучения · без скрытых доплат</p>

              <div className="space-y-2 text-sm text-foreground/70 mb-6">
                <p className="flex gap-2"><span className="text-accent">💛</span> Льготникам (многодетные, инвалиды) — 60 000 ₸ в месяц</p>
                <p className="flex gap-2"><span className="text-accent">🔥</span> Kaspi-рассрочка 0% на 3 или 6 месяцев</p>
                <p className="flex gap-2"><span className="text-accent">🔒</span> Цена фиксирована на весь курс</p>
              </div>

              <a href="/#pricing" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover transition-colors">
                Подробнее про оплату <span>→</span>
              </a>
            </motion.div>

            {/* Расписание */}
            <motion.div variants={staggerItem} className="p-7 lg:p-9 rounded-3xl bg-gradient-to-br from-accent/10 via-accent-soft/10 to-transparent border-2 border-accent/30">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="font-display text-2xl font-bold mb-2">Старт первого потока</h3>
              <p className="font-display text-4xl lg:text-5xl font-bold text-accent leading-tight mb-2">1 июля 2026</p>
              <p className="text-sm text-foreground/65 mb-5">старт обучения</p>

              <div className="space-y-2 text-sm text-foreground/70 mb-6">
                <p className="flex gap-2"><span className="text-accent">🕐</span> <strong>20:00</strong> по Алматы</p>
                <p className="flex gap-2"><span className="text-accent">📆</span> Вт + Чт <em>или</em> Ср + Пт</p>
                <p className="flex gap-2"><span className="text-accent">👥</span> Группа до 8 человек</p>
              </div>

              <a href="/#schedule" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover transition-colors">
                Подробнее про расписание <span>→</span>
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
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Бесплатно</span>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-5">
            Первый урок — <span className="text-accent">бесплатно</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="text-lg lg:text-xl text-foreground/70 leading-relaxed mb-10 max-w-xl mx-auto">
            Ребёнок попробует, познакомится с преподавателем, сделает первый сайт через AI. Если не понравится — никаких обязательств.
          </motion.p>

          <motion.button variants={fadeInUp} onClick={openApply} className="inline-flex items-center gap-3 px-8 py-5 bg-accent hover:bg-accent-hover text-white rounded-full font-semibold text-lg hover:scale-[1.02] transition-all duration-300 shadow-2xl shadow-accent/40">
            Записаться на пробный урок <span>→</span>
          </motion.button>

          <motion.p variants={fadeInUp} className="text-sm text-foreground/50 mt-6">
            60 минут · в Discord · менеджер свяжется в течение часа
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
              <a href="/" className="hover:text-accent transition-colors">Главная</a>
              <a href="/#courses" className="hover:text-accent transition-colors">Все курсы</a>
              <a href="/#pricing" className="hover:text-accent transition-colors">Цены</a>
              <a href="/#faq" className="hover:text-accent transition-colors">FAQ</a>
            </div>
            <p className="text-xs text-surface/40">© 2026 Alfa Z · Алматы</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
