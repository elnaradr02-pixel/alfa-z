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

// ✉️ Модалка записи
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
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="15" min="14" max="18" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Телефон родителя <span className="text-accent">*</span></label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+7 (___) ___-__-__" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Курс</label>
                    <select value={course} onChange={(e) => setCourse(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all">
                      <option value="Мобильная разработка">📱 Мобильная разработка</option>
                      <option value="Веб-разработка">🌐 Веб-разработка</option>
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
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const staggerItem = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any } } };
const scrollViewport = { once: true, amount: 0.1 };

// 📚 ПРОГРАММА КУРСА — 8 МОДУЛЕЙ ИЗ РЕАЛЬНОГО КТП
const modules = [
  {
    badge: "M1",
    duration: "3 недели · 6 уроков",
    title: "FlutterFlow Start",
    emoji: "🟢",
    accent: "🚀 Старт",
    color: "from-accent/15 via-accent-soft/10",
    description: "Первое работающее приложение с Firebase на телефоне за 3 недели через FlutterFlow AI. Никакого кода — клики и магия.",
    outcome: "✓ APK с авторизацией и облачной БД на твоём телефоне ✓ Видео-презентация ✓ GitHub-профиль",
    certificate: "FlutterFlow Builder",
    lessons: [
      { num: 1, title: "Введение: Flutter vs FlutterFlow + подростковая мотивация", desc: "Что такое мобильная разработка. Логика курса: что будешь делать за 24 недели." },
      { num: 2, title: "Регистрация на FlutterFlow + первое приложение через AI", desc: "Генерируем quiz «Какой ты персонаж» за 3 минуты через FlutterFlow AI." },
      { num: 3, title: "Ключевые виджеты + Material 3", desc: "Container, Text, Button, Column, Row. Material Theme Builder для своего стиля." },
      { num: 4, title: "Actions и переменные — интерактив без кода", desc: "On Tap, Navigate, Update State. App State vs Local State. Условная логика." },
      { num: 5, title: "Firebase + APK на свой телефон", desc: "Setup Wizard FlutterFlow. Auth + Firestore за 5 кликов. Codemagic для сборки APK." },
      { num: 6, title: "Demo-day #1 + Mini-quiz #1 + GitHub профиль", desc: "Презентация приложения. GitHub-аккаунт. Первый сертификат." },
    ],
  },
  {
    badge: "M2",
    duration: "3 недели · 6 уроков",
    title: "Dart через Quiz App",
    emoji: "🟡",
    accent: "🎯 Код",
    color: "from-accent-soft/20 via-muted/30",
    description: "Сквозной проект на 17 уроков: Quiz App «Какой ты персонаж». Переход от FlutterFlow к настоящему коду на Dart.",
    outcome: "✓ Quiz App начат в коде ✓ Понимание типов, ООП, async ✓ Mini-quiz #2 + Micro-demo",
    certificate: "Dart Starter",
    lessons: [
      { num: 7, title: "Мост FlutterFlow → Flutter: старт Quiz App", desc: "Export Code из FF. Открываем в VS Code. Создаём новый проект Quiz." },
      { num: 8, title: "Типы + null-safety → модель Question", desc: "var/final/const, типы, null-safety. Класс Question со списком вопросов." },
      { num: 9, title: "Условия, циклы, коллекции → логика подсчёта", desc: "if/else, switch, циклы. Подсчёт баллов через Map<String, int>." },
      { num: 10, title: "Функции + ООП → ResultCalculator", desc: "Классы, наследование. Character → Hero/Villain/Neutral со своими методами." },
      { num: 11, title: "Async / Future → загрузка картинок", desc: "Future, async/await. Имитация загрузки. CircularProgressIndicator." },
      { num: 12, title: "🎮 Fun-day: Dart Battle + Mini-quiz #2 + Micro-demo", desc: "Соревнование на скорость в Discord. 15 задач, таблица лидеров." },
    ],
  },
  {
    badge: "M3",
    duration: "3 недели · 6 уроков",
    title: "UI через Quiz + AI IDE",
    emoji: "🔵",
    accent: "🎨 Дизайн",
    color: "from-foreground/[0.04] via-muted/40",
    description: "Красивый Quiz с 4 экранами. С урока 13 — AI IDE (Cursor/Copilot) становится стандартом разработки.",
    outcome: "✓ Quiz App UI готов, 4 экрана работают ✓ Hot Reload + AI IDE в работе ✓ Mini-quiz #3",
    certificate: "Flutter Builder",
    lessons: [
      { num: 13, title: "Widget tree + 🔥 Hot Reload + 🤖 AI IDE", desc: "Стандарт джуна 2026: AI IDE с этого урока. Cursor/Copilot/Codeium." },
      { num: 14, title: "Layouts → красивый экран вопроса", desc: "Column, Row, Stack. Градиенты, тени, прогресс-бар. Бейдж Layout Lord." },
      { num: 15, title: "ListView + GridView → топ персонажей", desc: "Списки и сетки. Pull-to-refresh. Экран с галереей персонажей." },
      { num: 16, title: "Навигация → 4 экрана Quiz", desc: "Navigator.push/pop. Bottom Navigation Bar. 4 экрана + переходы." },
      { num: 17, title: "FlutterFlow vs Flutter — тот же Quiz", desc: "Сравниваем: тот же квиз в FF и в коде. Когда что выбирать." },
      { num: 18, title: "🎮 Fun-day: UI Speed Run + Mini-quiz #3", desc: "3 макета в Figma. Кто быстрее соберёт. Голосование, чемпион." },
    ],
  },
  {
    badge: "M4",
    duration: "3 недели · 6 уроков",
    title: "Data через Quiz",
    emoji: "🟠",
    accent: "📌 Точка выхода",
    color: "from-accent/10 via-accent-soft/15",
    description: "Реальный API, SQLite, Provider. Quiz App финализирован. Можно остановиться здесь — уже сильное портфолио.",
    outcome: "✓ ЗАКОНЧЕН Quiz App (17 уроков работы!) ✓ Реальные вопросы из OpenTDB ✓ ТОЧКА БЕЗОПАСНОГО ВЫХОДА",
    certificate: "Data Master",
    lessons: [
      { num: 19, title: "HTTP → реальный API из интернета", desc: "GET/POST, обработка ошибок. Open Trivia DB с тысячами вопросов." },
      { num: 20, title: "JSON → модель QuestionsSet", desc: "json.decode, fromJson. Типизированные модели вместо Map. JSON Wizard." },
      { num: 21, title: "SharedPreferences → запоминаем настройки", desc: "Любимые категории, имя игрока, тёмная тема. Quiz помнит пользователя." },
      { num: 22, title: "SQLite + 🔧 Flutter DevTools", desc: "Настоящая БД sqflite. История прохождений. Widget Inspector в DevTools." },
      { num: 23, title: "Provider → state management", desc: "ChangeNotifier, Consumer. Стандарт Flutter. Provider Inspector в DevTools." },
      { num: 24, title: "🎯 Quiz App FINAL + Demo-day #2 + Mini-quiz #4", desc: "Финал квиза. Демо 3 мин. APK другу для теста. Сертификат Data Master." },
    ],
  },
  {
    badge: "M5",
    duration: "3 недели · 6 уроков",
    title: "Firebase через ClassGram",
    emoji: "🟣",
    accent: "📱 ClassGram",
    color: "from-accent-soft/20 via-muted/20",
    description: "МИНИ-INSTAGRAM для класса! Лента, фото, лайки, комменты. Урок 30 — День X: реальный AdMob + Upwork/Kwork.",
    outcome: "✓ ClassGram работает: Auth + Firestore + Storage + push ✓ AdMob баннер в приложении (тест) ✓ Реальные профили Upwork/Kwork",
    certificate: "Flutter Developer + 💰 Future Earner",
    lessons: [
      { num: 25, title: "Firebase Auth в коде → регистрация в ClassGram", desc: "Новый проект ClassGram. flutterfire configure. Email/password + Google Sign-In." },
      { num: 26, title: "Firestore → лента постов real-time", desc: "NoSQL БД. StreamBuilder — посты появляются мгновенно на всех устройствах." },
      { num: 27, title: "Firebase Storage → фото в постах", desc: "Загрузка файлов в облако. Свободные 5 ГБ. Permissions к галерее." },
      { num: 28, title: "Камера + геолокация + permissions", desc: "image_picker, geolocator. Пост с фото и геометкой «сделано в школе»." },
      { num: 29, title: "Push + анимации → real-time реакции", desc: "FCM push-уведомления. Hero-анимации, Lottie. Лайк → push другу." },
      { num: 30, title: "💰 День X: AdMob + Upwork + Mini-quiz #5", desc: "РЕАЛЬНАЯ монетизация: AdMob test, профиль Upwork, услуга на Kwork. Сертификат Future Earner." },
    ],
  },
  {
    badge: "M6",
    duration: "1.5 недели · 3 урока",
    title: "🎮 Flame Games — Flappy Bird",
    emoji: "🎮",
    accent: "Игра!",
    color: "from-accent/20 via-accent-soft/15",
    description: "МОТИВАЦИОННЫЙ БУСТ — РЕДКАЯ ФИЧА. Делаем Flappy Bird клон на Flame engine. Друзья играют, лидерборд.",
    outcome: "✓ Рабочая Flappy Bird на телефоне ✓ Опубликовано на itch.io ✓ Друзья играют, лидерборд",
    certificate: "Game Maker",
    lessons: [
      { num: 31, title: "Введение в Flame: game loop, сцена, игрок", desc: "Официальный 2D движок Flutter. Game loop, FlameGame, Sprite. Птичка прыгает." },
      { num: 32, title: "Flappy Bird: препятствия + коллизии + счёт", desc: "Трубы, Hitbox-коллизии, счёт, Game Over, Restart. Играем на стриме." },
      { num: 33, title: "Полировка + публикация на itch.io", desc: "Анимация птицы, параллакс, рекорды. Публикуем игру для друзей." },
    ],
  },
  {
    badge: "M7",
    duration: "5 недель · 10 уроков",
    title: "Final Project — твой проект",
    emoji: "🔴",
    accent: "💪 Финал",
    color: "from-foreground/[0.05] via-muted/30",
    description: "Спикер ведёт демо-проект FlickApp, ты делаешь свой. Repository pattern, виральность, code review, security.",
    outcome: "✓ Свой финальный проект на Flutter ✓ Repository pattern, виральная фича ✓ Security/Performance/Testing pro",
    certificate: "Creative Mind + Viral Architect + Code Reviewer + Security/Performance/Debug Pro",
    lessons: [
      { num: 34, title: "Старт финала: ТЗ + архитектура + Git", desc: "Выбираем тему. ТЗ 5 предложений. Widget tree. Репо + develop ветка." },
      { num: 35, title: "M7 Фундамент: скелет UI + навигация", desc: "Все экраны сверстаны. Navigation работает. PR + merge в develop." },
      { num: 36, title: "M7 Душа: State + AI-pair-programming", desc: "Provider, ChangeNotifier. Мастер-класс AI prompting — формула вопроса." },
      { num: 37, title: "M7 Подключение к миру: API + Repository pattern", desc: "Repository слой между UI и API. 4 состояния (loading/error/empty/success)." },
      { num: 38, title: "Mid-demo + Mini-quiz #6", desc: "Демо 3 мин, проект на 70%. Self-feedback. Голосование Best Feature." },
      { num: 39, title: "🚀 M7 Вирусный след: уникальная фича + share", desc: "Share-кнопка, deep links, referral. Виральная механика для роста." },
      { num: 40, title: "✨ M7 Wow-фактор: анимации + Lottie + shimmer", desc: "Hero-анимации, AnimatedSwitcher, Lottie. Кастомные переходы." },
      { num: 41, title: "👀 Code Review Jam + Mini-quiz #7", desc: "Парная проверка кода с одноклассником. 3+ комментариев в PR." },
      { num: 42, title: "🛡 Security + Performance + Testing", desc: "GitGuardian, .env. DevTools Performance. Unit-тесты. Bug Hunt." },
      { num: 43, title: "🔍 Финальная шлифовка + UX-тест на бабушке", desc: "Чек-лист 15 пунктов. Backup-видео. Понимает бабушка → релиз." },
    ],
  },
  {
    badge: "M8",
    duration: "2.5 недели · 5 уроков",
    title: "Career Launch — карьера",
    emoji: "💼",
    accent: "🏆 Карьера",
    color: "from-accent/15 via-accent-soft/10",
    description: "РЕЛИЗ в Google Play + IT-English + резюме + 3 реальных отклика на вакансии + 1-на-1 mentor-сессия с разработчиком из IT-компании KZ/РФ.",
    outcome: "✓ Приложение в Google Play ✓ Резюме + LinkedIn + GitHub README ✓ 3 реальных отклика ✓ ДИПЛОМ Mobile Developer",
    certificate: "ДИПЛОМ «Mobile Developer» + 14+ сертификатов",
    lessons: [
      { num: 44, title: "🚀 Релиз: Google Play + App Store", desc: "Developer-аккаунт, AAB, иконка, скриншоты, описание. Заливка в Play Store." },
      { num: 45, title: "🗣 IT-English: docs, StackOverflow, 50 слов", desc: "Читаем Flutter docs без переводчика. Задаём вопрос на StackOverflow." },
      { num: 46, title: "📄 Резюме + LinkedIn + GitHub + портфолио-сайт", desc: "4 артефакта джуна за 25 минут. Шаблоны, проверка куратором." },
      { num: 47, title: "💼 3 реальных отклика + 1-на-1 mentor-сессия", desc: "Вакансии в Kaspi/Halyk/inDriver/Яндекс/VK. Mock-интервью. 30 мин 1-на-1 с разработчиком." },
      { num: 48, title: "🏆 FINAL DEMO DAY → ДИПЛОМ", desc: "Финальная защита БЕЗ AI. Голосование Best App. Диплом Mobile Developer." },
    ],
  },
];

export default function MobileCoursePage() {
  const [applyOpen, setApplyOpen] = useState(false);
  const openApply = () => setApplyOpen(true);

  return (
    <div className="min-h-screen bg-background">
      <ApplyModal open={applyOpen} onClose={() => setApplyOpen(false)} defaultCourse="Мобильная разработка" />

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

      {/* 📱 HERO КУРСА */}
      <motion.section initial="hidden" animate="visible" variants={staggerContainer} className="relative py-12 sm:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16 items-center">
            <div>
              <motion.div variants={staggerItem} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <span className="text-2xl leading-none">📱</span>
                <span className="text-xs font-bold text-accent uppercase tracking-wider">Курс мобильной разработки</span>
              </motion.div>

              <motion.h1 variants={staggerItem} className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] mb-5">
                От <span className="text-accent">FlutterFlow</span> до Google Play
              </motion.h1>

              <motion.p variants={staggerItem} className="text-lg lg:text-xl text-foreground/70 leading-relaxed mb-6 max-w-2xl">
                За 24 недели ребёнок пройдёт путь от первого приложения за 3 недели через FlutterFlow до публикации финального проекта в Google Play. С реальной монетизацией через AdMob и Upwork.
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
                  { value: 14, suffix: "+", label: "сертификатов" },
                  { value: 14, suffix: "–17", label: "лет" },
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
                  <div className="text-7xl mb-4">📱</div>
                  <p className="text-sm font-bold text-foreground/55 uppercase tracking-wider mb-2">Технологии курса</p>
                  <div className="grid grid-cols-2 gap-2 mb-auto">
                    {["FlutterFlow", "Flutter", "Dart", "Firebase", "Flame", "AdMob", "Codemagic", "Git"].map((tech, i) => (
                      <span key={i} className="px-3 py-2 rounded-lg bg-foreground/5 text-sm font-semibold text-foreground/80 text-center">{tech}</span>
                    ))}
                  </div>
                  <div className="mt-5 pt-5 border-t border-border">
                    <p className="font-display text-lg font-bold mb-1">+ работа с AI</p>
                    <p className="text-xs text-foreground/55">Claude, Cursor, FlutterFlow AI</p>
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { emoji: "🚀", title: "Приложение в Google Play", desc: "Финальный проект публикуется в Google Play. Друзья и родственники могут установить через сторе." },
              { emoji: "📱", title: "5 приложений в портфолио", desc: "FlutterFlow-проект, Quiz App, ClassGram, Flappy Bird, финальный проект. Сильное портфолио джуна." },
              { emoji: "💰", title: "Реальные Upwork и Kwork", desc: "Профили на фриланс-биржах с реальным портфолио. Услуга на Kwork «Сделаю Flutter-приложение»." },
              { emoji: "💼", title: "3 реальных отклика на вакансии", desc: "На junior Flutter в Kaspi, Halyk, inDriver, Яндекс, VK. С готовым резюме и cover-letter." },
              { emoji: "👤", title: "1-на-1 mentor-сессия", desc: "30 минут с разработчиком из Kaspi/inDriver/Halyk. Персональный ревью + ответы на твои вопросы (обычно стоит $50-100)." },
              { emoji: "🏆", title: "14+ сертификатов + ДИПЛОМ", desc: "FlutterFlow Builder, Dart Starter, Flutter Developer, Game Maker, Mobile Developer Diploma." },
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

      {/* 🔥 ЧТО ДЕЛАЕТ КУРС ОСОБЕННЫМ */}
      <motion.section className="relative py-20 sm:py-24 border-t border-border" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Уникальные фишки</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              Чего <span className="text-accent">нет в других школах</span>
            </h2>
            <p className="text-lg text-foreground/70">
              Мы взяли подростковые темы и встроили реальный заработок прямо в учебную программу.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
            {[
              { emoji: "📱", title: "ClassGram", subtitle: "Мини-Instagram для класса", desc: "Лента, фото с геометкой, лайки, комменты, push-уведомления. Ученик делится с одноклассниками — те регистрируются и пользуются. Виральная подростковая тема — родители видят как ребёнок становится автором приложения, которым пользуется его класс." },
              { emoji: "🎮", title: "Flappy Bird на Flame", subtitle: "Настоящая 2D игра в портфолио", desc: "На уроках M6 делаем клон Flappy Bird на движке Flame. Публикуем на itch.io — друзья играют, лидерборд. Редкая фича: ни у одной школы программирования для подростков нет реального геймдева в курсе мобильной разработки." },
              { emoji: "💰", title: "День X — реальный заработок", subtitle: "Урок 30: AdMob + Upwork + Kwork", desc: "Не теория «как зарабатывать», а реальные действия: интегрируем AdMob test-баннер в ClassGram, регистрируемся на Upwork с настоящим портфолио, создаём услугу на Kwork «Сделаю Flutter-приложение». Ребёнок выходит из урока с активными фрилансер-профилями." },
              { emoji: "👤", title: "1-на-1 с разработчиком", subtitle: "30 минут персональной mentor-сессии", desc: "В M8 (урок 47) — 30-минутный Zoom 1-на-1 с действующим Mobile Developer из Kaspi.kz, inDriver, Halyk Bank или Яндекса. Персональный ревью резюме, LinkedIn и проектов. Это БОЛЬШАЯ ценность — обычно такие сессии стоят $50-100." },
            ].map((item, i) => (
              <motion.div key={i} variants={staggerItem} whileHover={{ y: -8 }} className="p-7 lg:p-8 rounded-2xl bg-gradient-to-br from-accent/8 via-accent-soft/8 to-transparent border-2 border-accent/20 hover:border-accent/40 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-5xl flex-shrink-0">{item.emoji}</div>
                  <div>
                    <h3 className="font-display text-xl lg:text-2xl font-bold leading-tight mb-1">{item.title}</h3>
                    <p className="text-sm font-semibold text-accent">{item.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 📚 ПРОГРАММА КУРСА — 8 МОДУЛЕЙ */}
      <motion.section id="program" className="relative py-20 sm:py-28 border-t border-border bg-muted/20" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Программа курса</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              8 модулей, <span className="text-accent">48 уроков, 14+ сертификатов</span>
            </h2>
            <p className="text-lg text-foreground/70">
              После каждого модуля — промежуточный сертификат и работающее приложение в портфолио.
            </p>
          </motion.div>

          <div className="space-y-5 lg:space-y-6">
            {modules.map((mod, i) => (
              <motion.div key={i} variants={staggerItem} className={`relative p-6 sm:p-7 lg:p-8 rounded-3xl bg-gradient-to-br ${mod.color} to-transparent bg-surface border-2 border-border hover:border-accent/30 transition-all duration-300`}>
                <div className="grid lg:grid-cols-[1fr_2fr] gap-6 lg:gap-8">
                  {/* Левая колонка — описание модуля */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30">
                        <span className="text-xs font-bold text-accent uppercase tracking-wider">{mod.badge}</span>
                      </div>
                      <span className="text-xs font-medium text-foreground/55">{mod.duration}</span>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-5xl">{mod.emoji}</div>
                      <span className="text-xs font-semibold text-accent">{mod.accent}</span>
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-bold leading-tight mb-3">{mod.title}</h3>
                    <p className="text-sm text-foreground/70 leading-relaxed mb-4">{mod.description}</p>

                    <div className="p-3 rounded-xl bg-surface border border-border mb-3">
                      <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1.5">К концу модуля</p>
                      <p className="text-xs text-foreground leading-relaxed">{mod.outcome}</p>
                    </div>

                    <div className="inline-flex items-start gap-2 px-3 py-2 rounded-xl bg-accent/10 border border-accent/30">
                      <span className="text-base flex-shrink-0">🏅</span>
                      <span className="text-xs font-semibold text-accent leading-tight">{mod.certificate}</span>
                    </div>
                  </div>

                  {/* Правая колонка — раскрывающийся список уроков */}
                  <details className="group">
                    <summary className="flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-surface border border-border cursor-pointer list-none hover:border-accent/30 transition-colors">
                      <div>
                        <p className="font-display text-base sm:text-lg font-bold leading-tight">Подробная программа модуля</p>
                        <p className="text-xs text-foreground/55 mt-0.5">{mod.lessons.length} уроков — нажмите чтобы развернуть</p>
                      </div>
                      <span className="flex-shrink-0 w-9 h-9 rounded-full bg-accent/10 group-open:bg-accent flex items-center justify-center transition-all group-open:rotate-45">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-accent group-open:text-white transition-colors">
                          <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </span>
                    </summary>

                    <div className="mt-3 space-y-2">
                      {mod.lessons.map((lesson) => (
                        <div key={lesson.num} className="flex gap-3 p-3 rounded-xl bg-surface border border-border hover:border-accent/20 transition-colors">
                          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center font-display font-bold text-accent text-xs">
                            {lesson.num}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm leading-snug mb-0.5">{lesson.title}</p>
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
      <motion.section className="relative py-20 sm:py-28 border-t border-border" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">AI-стратегия курса</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              3 AI-инструмента <span className="text-accent">от старта до защиты</span>
            </h2>
            <p className="text-lg text-foreground/70">
              Не 20 инструментов сразу — а 3 категории за курс. Ученик выбирает по одному в каждой и не переключается.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
            {[
              { num: "1", emoji: "🤖", title: "AI-ассистент", subtitle: "Вопросы, объяснения, ревью", desc: "На любом уроке M2–M8: «Объясни эту строку», «Почему ошибка?», «Сделай ревью архитектуры». Генерация cover-letter, резюме, LinkedIn.", tools: "Claude · ChatGPT · Gemini · DeepSeek" },
              { num: "2", emoji: "⌨️", title: "AI IDE", subtitle: "С урока 13: автокомплит кода", desc: "Стандарт джуна 2026 — AI пишет код вместе с тобой. Cmd+K — генерация по комментарию. Cmd+L — чат с контекстом файла.", tools: "Cursor · GitHub Copilot · Codeium · Windsurf" },
              { num: "3", emoji: "🎨", title: "FlutterFlow AI", subtitle: "Только в M1 + 17, 32, 34", desc: "Визуальная генерация приложения по тексту. Главный инструмент Модуля 1 — первое приложение за 3 минуты.", tools: "FlutterFlow AI (фича платформы)" },
            ].map((item, i) => (
              <motion.div key={i} variants={staggerItem} whileHover={{ y: -8 }} className="relative p-7 rounded-2xl bg-surface border border-border hover:border-accent/30 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-display text-5xl font-bold text-accent/30 leading-none">{item.num}</span>
                  <span className="text-3xl">{item.emoji}</span>
                </div>
                <h3 className="font-display text-xl font-bold mb-1 leading-tight">{item.title}</h3>
                <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">{item.subtitle}</p>
                <p className="text-sm text-foreground/70 leading-relaxed mb-4">{item.desc}</p>
                <p className="text-xs text-foreground/55 leading-relaxed pt-3 border-t border-border">{item.tools}</p>
              </motion.div>
            ))}
          </div>

          {/* Защита без AI */}
          <motion.div variants={fadeInUp} className="mt-10 p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-accent/10 via-accent-soft/10 to-muted/30 border-2 border-accent/20 text-center max-w-3xl mx-auto">
            <div className="text-5xl mb-3">🏆</div>
            <h3 className="font-display text-xl sm:text-2xl font-bold mb-2">
              На <span className="text-accent">финальной защите</span> — БЕЗ AI
            </h3>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Всё, что показываешь — твоё. Так же, как на реальных собеседованиях в Kaspi или Яндекс. AI помогает учиться, но самостоятельность доказывают сами.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* 🎮 ИНСТРУМЕНТЫ И ИГРЫ */}
      <motion.section className="relative py-20 sm:py-28 border-t border-border bg-muted/20" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="max-w-2xl mb-12">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Инструменты курса</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Реальные сервисы и <span className="text-accent">тренажёры</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: "FlutterFlow", desc: "Визуальный билдер Flutter-приложений с AI. Главный инструмент M1.", emoji: "🎨" },
              { name: "Cursor / Copilot", desc: "AI IDE с урока 13. Стандарт разработчика 2026. Автокомплит и чат.", emoji: "⌨️" },
              { name: "DartPad", desc: "Онлайн-площадка для Dart. Решаем задачи M2 без установки.", emoji: "🎯" },
              { name: "Flame Engine", desc: "2D игровой движок Flutter. На нём делаем Flappy Bird клон.", emoji: "🎮" },
              { name: "itch.io", desc: "Платформа для публикации игр. Туда заливаем Flappy Bird.", emoji: "🚀" },
              { name: "OpenTDB", desc: "API с тысячами quiz-вопросов. Подключаем в M4.", emoji: "📚" },
              { name: "Firebase Console", desc: "Auth, Firestore, Storage, push. Сердце ClassGram.", emoji: "🔥" },
              { name: "AdMob Console", desc: "Реальная монетизация. Тестовые баннеры в M5 (День X).", emoji: "💰" },
              { name: "Codemagic", desc: "Браузерная сборка APK/iOS. Не нужен Mac для App Store.", emoji: "📦" },
              { name: "Codewars", desc: "Dart-задачи 8 kyu. Прокачиваем алгоритмы.", emoji: "💪" },
              { name: "Oh My Git", desc: "Интерактивные уровни Git. Без страха перед терминалом.", emoji: "🌿" },
              { name: "LottieFiles", desc: "Готовые анимации для приложений. M5 и M7.", emoji: "✨" },
            ].map((tool, i) => (
              <motion.div key={i} variants={staggerItem} whileHover={{ y: -4 }} className="p-5 rounded-2xl bg-surface border border-border hover:border-accent/30 hover:shadow-md transition-all duration-300">
                <div className="text-3xl mb-2">{tool.emoji}</div>
                <h4 className="font-display text-base font-bold mb-1.5">{tool.name}</h4>
                <p className="text-xs text-foreground/65 leading-relaxed">{tool.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 🎯 ГЕЙМИФИКАЦИЯ */}
      <motion.section className="relative py-20 sm:py-28 border-t border-border" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div variants={fadeInUp}>
              <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Геймификация</p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-5">
                XP-система, бейджи, <span className="text-accent">mini-quizzes</span>
              </h2>
              <p className="text-lg text-foreground/70 leading-relaxed mb-6">
                Подростки любят геймифицированный прогресс. Каждое ДЗ даёт XP, бонусные задания — дополнительные баллы. Бейджи открываются за достижения: «Layout Lord», «JSON Wizard», «Game Maker», «Viral Architect», «Code Reviewer».
              </p>
              <p className="text-base text-foreground/65 italic">
                Это не «дневник с оценками», а «прокачка персонажа в IT». Мотивация на полгода обучения.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-surface border border-border">
                <div className="text-3xl mb-2">⚡</div>
                <p className="font-display text-3xl font-bold text-accent mb-1">XP</p>
                <p className="text-xs text-foreground/60">за каждое задание + бонусы</p>
              </div>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent border-2 border-accent/30">
                <div className="text-3xl mb-2">🏅</div>
                <p className="font-display text-3xl font-bold text-accent mb-1">14+</p>
                <p className="text-xs text-foreground/60">сертификатов и бейджей</p>
              </div>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-accent-soft/15 to-transparent border-2 border-accent/20">
                <div className="text-3xl mb-2">❓</div>
                <p className="font-display text-3xl font-bold text-accent mb-1">7</p>
                <p className="text-xs text-foreground/60">mini-quizzes по 5 вопросов</p>
              </div>
              <div className="p-5 rounded-2xl bg-surface border border-border">
                <div className="text-3xl mb-2">🎉</div>
                <p className="font-display text-3xl font-bold text-accent mb-1">5</p>
                <p className="text-xs text-foreground/60">fun-days с соревнованиями</p>
              </div>
            </motion.div>
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
                Если ученик не справляется с основным заданием — через 48 часов открывается облегчённая версия. Готовый шаблон кода (60-70%), подсказки с таймкодами видео. Главное — двигаться дальше.
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
                  Полноценное задание без подсказок. 5-7 пунктов, иногда видео-демонстрация работы. Если справился — идём дальше.
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
              Mobile Developer <span className="text-accent">из Kaspi.kz</span>
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid sm:grid-cols-[auto_1fr] gap-6 lg:gap-10 items-center p-6 sm:p-8 lg:p-10 rounded-3xl bg-surface border border-border">
            <div className="relative w-32 h-32 sm:w-44 sm:h-44 lg:w-52 lg:h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-accent via-accent-soft to-muted flex items-center justify-center flex-shrink-0">
              <span className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg">АК</span>
            </div>

            <div>
              <h3 className="font-display text-2xl lg:text-3xl font-bold mb-1">Алмас К.</h3>
              <p className="text-base font-semibold text-accent mb-4">Mobile Developer · Kaspi.kz</p>

              <p className="text-base text-foreground/70 leading-relaxed mb-5">
                5 лет в IT. В Kaspi.kz работает над приложением которое использует вся страна. До этого — фрилансер на Upwork, опыт работы с международными клиентами. Свободно владеет английским и русским.
              </p>

              <div className="flex flex-wrap gap-2">
                {["Flutter", "Dart", "Firebase", "Native iOS/Android", "Flame", "AdMob"].map((tech, i) => (
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
              <p className="font-display text-5xl lg:text-6xl font-bold text-accent leading-none mb-2 tabular-nums">47 500 <span className="text-2xl text-foreground/60">₸</span></p>
              <p className="text-sm text-foreground/65 mb-5">в месяц · абонемент</p>

              <div className="space-y-2 text-sm text-foreground/70 mb-6">
                <p className="flex gap-2"><span className="text-accent">✓</span> Помесячно — платите когда учитесь</p>
                <p className="flex gap-2"><span className="text-accent">✓</span> Kaspi-рассрочка на 6 мес, 0% переплаты</p>
                <p className="flex gap-2"><span className="text-accent">✓</span> Скидка 10% при оплате 6 мес сразу</p>
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
                <p className="flex gap-2"><span className="text-accent">📆</span> Ср + Пт <em>или</em> Вт + Чт</p>
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
            Ребёнок попробует, познакомится с преподавателем, сгенерирует первое приложение через FlutterFlow AI. Если не понравится — никаких обязательств.
          </motion.p>

          <motion.button variants={fadeInUp} onClick={openApply} className="inline-flex items-center gap-3 px-8 py-5 bg-accent hover:bg-accent-hover text-white rounded-full font-semibold text-lg hover:scale-[1.02] transition-all duration-300 shadow-2xl shadow-accent/40">
            Записаться на пробный урок <span>→</span>
          </motion.button>

          <motion.p variants={fadeInUp} className="text-sm text-foreground/50 mt-6">
            60 минут · в Zoom · менеджер свяжется в течение часа
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
