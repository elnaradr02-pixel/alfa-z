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

// ✉️ Модалка записи
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
                    {tr("Запись на", "Жазылу", "Book a")} <span className="text-accent">{tr("пробный урок", "сынақ сабаққа", "trial lesson")}</span>
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
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="15" min="14" max="18" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">{tr("Телефон родителя", "Ата-ананың телефоны", "Parent's phone")} <span className="text-accent">*</span></label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+7 (___) ___-__-__" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">{tr("Курс", "Курс", "Course")}</label>
                    <select value={course} onChange={(e) => setCourse(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all">
                      <option value="Мобильная разработка">📱 {tr("Мобильная разработка", "Мобильді әзірлеу", "Mobile development")}</option>
                      <option value="Веб-разработка">🌐 {tr("Веб-разработка", "Веб-әзірлеу", "Web development")}</option>
                      <option value="Геймдев на Unity">🎮 {tr("Геймдев на Unity", "Unity-де геймдев", "Game dev on Unity")}</option>
                      <option value="Бэкенд на Python">⚙️ {tr("Бэкенд на Python", "Python-дағы бэкенд", "Backend on Python")}</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full px-6 py-4 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold transition-all shadow-lg shadow-accent/30 hover:scale-[1.01] flex items-center justify-center gap-2">
                  <span>💬</span> {tr("Отправить заявку в WhatsApp", "WhatsApp арқылы өтінім жіберу", "Send request via WhatsApp")}
                </button>
                <p className="text-xs text-foreground/45 text-center mt-4 leading-relaxed">{tr("Нажимая на кнопку, вы соглашаетесь с обработкой персональных данных", "Батырманы басу арқылы сіз дербес деректерді өңдеуге келісесіз", "By clicking, you agree to the processing of personal data")}</p>
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
type Tr = (ru: string, kz: string, en: string) => string;
function makeModules(tr: Tr) {
  return [
  {
    badge: "M1",
    duration: tr("3 недели · 6 уроков", "3 апта · 6 сабақ", "3 weeks · 6 lessons"),
    title: "FlutterFlow Start",
    emoji: "🟢",
    accent: tr("🚀 Старт", "🚀 Старт", "🚀 Start"),
    color: "from-accent/15 via-accent-soft/10",
    description: tr("Первое работающее приложение с Firebase на телефоне за 3 недели через FlutterFlow AI. Никакого кода — клики и магия.", "FlutterFlow AI арқылы 3 аптада телефонда Firebase-пен алғашқы жұмыс істейтін қосымша. Кодсыз — тек кликтер мен сиқыр.", "Your first working app with Firebase on your phone in 3 weeks via FlutterFlow AI. No code — just clicks and magic."),
    outcome: tr("✓ APK с авторизацией и облачной БД на твоём телефоне ✓ Видео-презентация ✓ GitHub-профиль", "✓ Авторизациясы мен бұлттық ДБ бар APK телефоныңда ✓ Видео-презентация ✓ GitHub-профиль", "✓ An APK with auth and a cloud DB on your phone ✓ A video presentation ✓ A GitHub profile"),
    certificate: "FlutterFlow Builder",
    lessons: [
      { num: 1, title: tr("Введение: Flutter vs FlutterFlow + подростковая мотивация", "Кіріспе: Flutter vs FlutterFlow + мотивация", "Intro: Flutter vs FlutterFlow + motivation"), desc: tr("Что такое мобильная разработка. Логика курса: что будешь делать за 24 недели.", "Мобильді әзірлеу дегеніміз не. Курс логикасы: 24 аптада не істейсің.", "What mobile development is. The course logic: what you'll do over 24 weeks.") },
      { num: 2, title: tr("Регистрация на FlutterFlow + первое приложение через AI", "FlutterFlow-ға тіркелу + AI арқылы алғашқы қосымша", "Sign up for FlutterFlow + first app via AI"), desc: tr("Генерируем quiz «Какой ты персонаж» за 3 минуты через FlutterFlow AI.", "FlutterFlow AI арқылы 3 минутта «Сен қай кейіпкерсің» квизін жасаймыз.", "We generate a 'Which character are you' quiz in 3 minutes via FlutterFlow AI.") },
      { num: 3, title: tr("Ключевые виджеты + Material 3", "Негізгі виджеттер + Material 3", "Key widgets + Material 3"), desc: tr("Container, Text, Button, Column, Row. Material Theme Builder для своего стиля.", "Container, Text, Button, Column, Row. Өз стиліңе Material Theme Builder.", "Container, Text, Button, Column, Row. Material Theme Builder for your own style.") },
      { num: 4, title: tr("Actions и переменные — интерактив без кода", "Actions пен айнымалылар — кодсыз интерактив", "Actions and variables — interactivity without code"), desc: tr("On Tap, Navigate, Update State. App State vs Local State. Условная логика.", "On Tap, Navigate, Update State. App State vs Local State. Шартты логика.", "On Tap, Navigate, Update State. App State vs Local State. Conditional logic.") },
      { num: 5, title: tr("Firebase + APK на свой телефон", "Firebase + өз телефоныңа APK", "Firebase + an APK on your phone"), desc: tr("Setup Wizard FlutterFlow. Auth + Firestore за 5 кликов. Codemagic для сборки APK.", "FlutterFlow Setup Wizard. 5 кликте Auth + Firestore. APK жинауға Codemagic.", "FlutterFlow Setup Wizard. Auth + Firestore in 5 clicks. Codemagic to build the APK.") },
      { num: 6, title: tr("Demo-day #1 + Mini-quiz #1 + GitHub профиль", "Demo-day #1 + Mini-quiz #1 + GitHub профиль", "Demo-day #1 + Mini-quiz #1 + GitHub profile"), desc: tr("Презентация приложения. GitHub-аккаунт. Первый сертификат.", "Қосымшаны презентациялау. GitHub-аккаунт. Алғашқы сертификат.", "An app presentation. A GitHub account. Your first certificate.") },
    ],
  },
  {
    badge: "M2",
    duration: tr("3 недели · 6 уроков", "3 апта · 6 сабақ", "3 weeks · 6 lessons"),
    title: tr("Dart через Quiz App", "Quiz App арқылы Dart", "Dart via the Quiz App"),
    emoji: "🟡",
    accent: tr("🎯 Код", "🎯 Код", "🎯 Code"),
    color: "from-accent-soft/20 via-muted/30",
    description: tr("Сквозной проект на 17 уроков: Quiz App «Какой ты персонаж». Переход от FlutterFlow к настоящему коду на Dart.", "17 сабаққа арналған сквозной жоба: «Сен қай кейіпкерсің» Quiz App. FlutterFlow-дан Dart-тағы нағыз кодқа көшу.", "A 17-lesson through-project: the 'Which character are you' Quiz App. Moving from FlutterFlow to real Dart code."),
    outcome: tr("✓ Quiz App начат в коде ✓ Понимание типов, ООП, async ✓ Mini-quiz #2 + Micro-demo", "✓ Quiz App кодта басталды ✓ Типтерді, ООП, async түсіну ✓ Mini-quiz #2 + Micro-demo", "✓ Quiz App started in code ✓ Understanding types, OOP, async ✓ Mini-quiz #2 + Micro-demo"),
    certificate: "Dart Starter",
    lessons: [
      { num: 7, title: tr("Мост FlutterFlow → Flutter: старт Quiz App", "Көпір FlutterFlow → Flutter: Quiz App старты", "Bridge FlutterFlow → Flutter: starting Quiz App"), desc: tr("Export Code из FF. Открываем в VS Code. Создаём новый проект Quiz.", "FF-тен Export Code. VS Code-та ашамыз. Жаңа Quiz жобасын жасаймыз.", "Export Code from FF. Open in VS Code. Create a new Quiz project.") },
      { num: 8, title: tr("Типы + null-safety → модель Question", "Типтер + null-safety → Question моделі", "Types + null-safety → the Question model"), desc: tr("var/final/const, типы, null-safety. Класс Question со списком вопросов.", "var/final/const, типтер, null-safety. Сұрақтар тізімі бар Question класы.", "var/final/const, types, null-safety. A Question class with a list of questions.") },
      { num: 9, title: tr("Условия, циклы, коллекции → логика подсчёта", "Шарттар, циклдар, коллекциялар → санау логикасы", "Conditions, loops, collections → scoring logic"), desc: tr("if/else, switch, циклы. Подсчёт баллов через Map<String, int>.", "if/else, switch, циклдар. Map<String, int> арқылы балл санау.", "if/else, switch, loops. Scoring via Map<String, int>.") },
      { num: 10, title: tr("Функции + ООП → ResultCalculator", "Функциялар + ООП → ResultCalculator", "Functions + OOP → ResultCalculator"), desc: tr("Классы, наследование. Character → Hero/Villain/Neutral со своими методами.", "Кластар, мұрагерлік. Character → Hero/Villain/Neutral өз әдістерімен.", "Classes, inheritance. Character → Hero/Villain/Neutral with their own methods.") },
      { num: 11, title: tr("Async / Future → загрузка картинок", "Async / Future → суреттерді жүктеу", "Async / Future → loading images"), desc: tr("Future, async/await. Имитация загрузки. CircularProgressIndicator.", "Future, async/await. Жүктеуді имитациялау. CircularProgressIndicator.", "Future, async/await. Simulating loading. CircularProgressIndicator.") },
      { num: 12, title: tr("🎮 Fun-day: Dart Battle + Mini-quiz #2 + Micro-demo", "🎮 Fun-day: Dart Battle + Mini-quiz #2 + Micro-demo", "🎮 Fun-day: Dart Battle + Mini-quiz #2 + Micro-demo"), desc: tr("Соревнование на скорость в Discord. 15 задач, таблица лидеров.", "Discord-та жылдамдыққа жарыс. 15 тапсырма, көшбасшылар кестесі.", "A speed contest on Discord. 15 tasks, a leaderboard.") },
    ],
  },
  {
    badge: "M3",
    duration: tr("3 недели · 6 уроков", "3 апта · 6 сабақ", "3 weeks · 6 lessons"),
    title: tr("UI через Quiz + AI IDE", "Quiz + AI IDE арқылы UI", "UI via Quiz + AI IDE"),
    emoji: "🔵",
    accent: tr("🎨 Дизайн", "🎨 Дизайн", "🎨 Design"),
    color: "from-foreground/[0.04] via-muted/40",
    description: tr("Красивый Quiz с 4 экранами. С урока 13 — AI IDE (Cursor/Copilot) становится стандартом разработки.", "4 экраны бар әдемі Quiz. 13-сабақтан бастап AI IDE (Cursor/Copilot) әзірлеу стандартына айналады.", "A beautiful Quiz with 4 screens. From lesson 13, an AI IDE (Cursor/Copilot) becomes the development standard."),
    outcome: tr("✓ Quiz App UI готов, 4 экрана работают ✓ Hot Reload + AI IDE в работе ✓ Mini-quiz #3", "✓ Quiz App UI дайын, 4 экран жұмыс істейді ✓ Hot Reload + AI IDE жұмыста ✓ Mini-quiz #3", "✓ Quiz App UI ready, 4 screens work ✓ Hot Reload + AI IDE in use ✓ Mini-quiz #3"),
    certificate: "Flutter Builder",
    lessons: [
      { num: 13, title: tr("Widget tree + 🔥 Hot Reload + 🤖 AI IDE", "Widget tree + 🔥 Hot Reload + 🤖 AI IDE", "Widget tree + 🔥 Hot Reload + 🤖 AI IDE"), desc: tr("Стандарт джуна 2026: AI IDE с этого урока. Cursor/Copilot/Codeium.", "2026 жунының стандарты: осы сабақтан AI IDE. Cursor/Copilot/Codeium.", "The 2026 junior standard: an AI IDE from this lesson. Cursor/Copilot/Codeium.") },
      { num: 14, title: tr("Layouts → красивый экран вопроса", "Layouts → әдемі сұрақ экраны", "Layouts → a beautiful question screen"), desc: tr("Column, Row, Stack. Градиенты, тени, прогресс-бар. Бейдж Layout Lord.", "Column, Row, Stack. Градиенттер, көлеңкелер, прогресс-бар. Layout Lord бейджі.", "Column, Row, Stack. Gradients, shadows, a progress bar. The Layout Lord badge.") },
      { num: 15, title: tr("ListView + GridView → топ персонажей", "ListView + GridView → кейіпкерлер тобы", "ListView + GridView → a top-characters screen"), desc: tr("Списки и сетки. Pull-to-refresh. Экран с галереей персонажей.", "Тізімдер мен торлар. Pull-to-refresh. Кейіпкерлер галереясы бар экран.", "Lists and grids. Pull-to-refresh. A character gallery screen.") },
      { num: 16, title: tr("Навигация → 4 экрана Quiz", "Навигация → Quiz-тің 4 экраны", "Navigation → 4 Quiz screens"), desc: tr("Navigator.push/pop. Bottom Navigation Bar. 4 экрана + переходы.", "Navigator.push/pop. Bottom Navigation Bar. 4 экран + өтулер.", "Navigator.push/pop. A Bottom Navigation Bar. 4 screens + transitions.") },
      { num: 17, title: tr("FlutterFlow vs Flutter — тот же Quiz", "FlutterFlow vs Flutter — сол Quiz", "FlutterFlow vs Flutter — the same Quiz"), desc: tr("Сравниваем: тот же квиз в FF и в коде. Когда что выбирать.", "Салыстырамыз: сол квиз FF-те және кодта. Қашан нені таңдау керек.", "We compare: the same quiz in FF and in code. When to choose which.") },
      { num: 18, title: tr("🎮 Fun-day: UI Speed Run + Mini-quiz #3", "🎮 Fun-day: UI Speed Run + Mini-quiz #3", "🎮 Fun-day: UI Speed Run + Mini-quiz #3"), desc: tr("3 макета в Figma. Кто быстрее соберёт. Голосование, чемпион.", "Figma-да 3 макет. Кім тезірек жинайды. Дауыс беру, чемпион.", "3 mockups in Figma. Who builds them fastest. A vote, a champion.") },
    ],
  },
  {
    badge: "M4",
    duration: tr("3 недели · 6 уроков", "3 апта · 6 сабақ", "3 weeks · 6 lessons"),
    title: tr("Data через Quiz", "Quiz арқылы Data", "Data via Quiz"),
    emoji: "🟠",
    accent: tr("📌 Точка выхода", "📌 Шығу нүктесі", "📌 Exit point"),
    color: "from-accent/10 via-accent-soft/15",
    description: tr("Реальный API, SQLite, Provider. Quiz App финализирован. Можно остановиться здесь — уже сильное портфолио.", "Нақты API, SQLite, Provider. Quiz App аяқталды. Осы жерде тоқтауға болады — портфолио қазірдің өзінде күшті.", "A real API, SQLite, Provider. The Quiz App is finalized. You can stop here — the portfolio is already strong."),
    outcome: tr("✓ ЗАКОНЧЕН Quiz App (17 уроков работы!) ✓ Реальные вопросы из OpenTDB ✓ ТОЧКА БЕЗОПАСНОГО ВЫХОДА", "✓ Quiz App АЯҚТАЛДЫ (17 сабақтық жұмыс!) ✓ OpenTDB-дан нақты сұрақтар ✓ ҚАУІПСІЗ ШЫҒУ НҮКТЕСІ", "✓ Quiz App FINISHED (17 lessons of work!) ✓ Real questions from OpenTDB ✓ A SAFE EXIT POINT"),
    certificate: "Data Master",
    lessons: [
      { num: 19, title: tr("HTTP → реальный API из интернета", "HTTP → интернеттен нақты API", "HTTP → a real API from the internet"), desc: tr("GET/POST, обработка ошибок. Open Trivia DB с тысячами вопросов.", "GET/POST, қателерді өңдеу. Мыңдаған сұрағы бар Open Trivia DB.", "GET/POST, error handling. The Open Trivia DB with thousands of questions.") },
      { num: 20, title: tr("JSON → модель QuestionsSet", "JSON → QuestionsSet моделі", "JSON → the QuestionsSet model"), desc: tr("json.decode, fromJson. Типизированные модели вместо Map. JSON Wizard.", "json.decode, fromJson. Map орнына типтелген модельдер. JSON Wizard.", "json.decode, fromJson. Typed models instead of Map. JSON Wizard.") },
      { num: 21, title: tr("SharedPreferences → запоминаем настройки", "SharedPreferences → параметрлерді есте сақтаймыз", "SharedPreferences → remembering settings"), desc: tr("Любимые категории, имя игрока, тёмная тема. Quiz помнит пользователя.", "Сүйікті санаттар, ойыншы аты, қараңғы тақырып. Quiz пайдаланушыны есте сақтайды.", "Favorite categories, player name, dark theme. The Quiz remembers the user.") },
      { num: 22, title: tr("SQLite + 🔧 Flutter DevTools", "SQLite + 🔧 Flutter DevTools", "SQLite + 🔧 Flutter DevTools"), desc: tr("Настоящая БД sqflite. История прохождений. Widget Inspector в DevTools.", "Нағыз sqflite ДБ. Өту тарихы. DevTools-тегі Widget Inspector.", "A real sqflite DB. A play history. The Widget Inspector in DevTools.") },
      { num: 23, title: tr("Provider → state management", "Provider → state management", "Provider → state management"), desc: tr("ChangeNotifier, Consumer. Стандарт Flutter. Provider Inspector в DevTools.", "ChangeNotifier, Consumer. Flutter стандарты. DevTools-тегі Provider Inspector.", "ChangeNotifier, Consumer. The Flutter standard. The Provider Inspector in DevTools.") },
      { num: 24, title: tr("🎯 Quiz App FINAL + Demo-day #2 + Mini-quiz #4", "🎯 Quiz App FINAL + Demo-day #2 + Mini-quiz #4", "🎯 Quiz App FINAL + Demo-day #2 + Mini-quiz #4"), desc: tr("Финал квиза. Демо 3 мин. APK другу для теста. Сертификат Data Master.", "Квиз финалы. 3 минут демо. Досқа тест үшін APK. Data Master сертификаты.", "The quiz finale. A 3-min demo. An APK for a friend to test. The Data Master certificate.") },
    ],
  },
  {
    badge: "M5",
    duration: tr("3 недели · 6 уроков", "3 апта · 6 сабақ", "3 weeks · 6 lessons"),
    title: tr("Firebase через ClassGram", "ClassGram арқылы Firebase", "Firebase via ClassGram"),
    emoji: "🟣",
    accent: tr("📱 ClassGram", "📱 ClassGram", "📱 ClassGram"),
    color: "from-accent-soft/20 via-muted/20",
    description: tr("МИНИ-INSTAGRAM для класса! Лента, фото, лайки, комменты. Урок 30 — День X: реальный AdMob + Upwork/Kwork.", "Сынып үшін МИНИ-INSTAGRAM! Лента, фото, лайктар, комментарийлер. 30-сабақ — X күні: нақты AdMob + Upwork/Kwork.", "A MINI-INSTAGRAM for the class! A feed, photos, likes, comments. Lesson 30 — Day X: real AdMob + Upwork/Kwork."),
    outcome: tr("✓ ClassGram работает: Auth + Firestore + Storage + push ✓ AdMob баннер в приложении (тест) ✓ Реальные профили Upwork/Kwork", "✓ ClassGram жұмыс істейді: Auth + Firestore + Storage + push ✓ Қосымшада AdMob баннер (тест) ✓ Нақты Upwork/Kwork профильдері", "✓ ClassGram works: Auth + Firestore + Storage + push ✓ An AdMob banner in the app (test) ✓ Real Upwork/Kwork profiles"),
    certificate: "Flutter Developer + 💰 Future Earner",
    lessons: [
      { num: 25, title: tr("Firebase Auth в коде → регистрация в ClassGram", "Firebase Auth кодта → ClassGram-ға тіркелу", "Firebase Auth in code → registration in ClassGram"), desc: tr("Новый проект ClassGram. flutterfire configure. Email/password + Google Sign-In.", "Жаңа ClassGram жобасы. flutterfire configure. Email/password + Google Sign-In.", "A new ClassGram project. flutterfire configure. Email/password + Google Sign-In.") },
      { num: 26, title: tr("Firestore → лента постов real-time", "Firestore → real-time посттар лентасы", "Firestore → a real-time post feed"), desc: tr("NoSQL БД. StreamBuilder — посты появляются мгновенно на всех устройствах.", "NoSQL ДБ. StreamBuilder — посттар барлық құрылғыда лезде пайда болады.", "A NoSQL DB. StreamBuilder — posts appear instantly on all devices.") },
      { num: 27, title: tr("Firebase Storage → фото в постах", "Firebase Storage → посттардағы фото", "Firebase Storage → photos in posts"), desc: tr("Загрузка файлов в облако. Свободные 5 ГБ. Permissions к галерее.", "Файлдарды бұлтқа жүктеу. Тегін 5 ГБ. Галереяға permissions.", "Uploading files to the cloud. A free 5 GB. Gallery permissions.") },
      { num: 28, title: tr("Камера + геолокация + permissions", "Камера + геолокация + permissions", "Camera + geolocation + permissions"), desc: tr("image_picker, geolocator. Пост с фото и геометкой «сделано в школе».", "image_picker, geolocator. «Мектепте жасалған» геобелгісі бар фото пост.", "image_picker, geolocator. A post with a photo and a 'made at school' geotag.") },
      { num: 29, title: tr("Push + анимации → real-time реакции", "Push + анимациялар → real-time реакциялар", "Push + animations → real-time reactions"), desc: tr("FCM push-уведомления. Hero-анимации, Lottie. Лайк → push другу.", "FCM push-хабарламалар. Hero-анимациялар, Lottie. Лайк → досқа push.", "FCM push notifications. Hero animations, Lottie. A like → a push to a friend.") },
      { num: 30, title: tr("💰 День X: AdMob + Upwork + Mini-quiz #5", "💰 X күні: AdMob + Upwork + Mini-quiz #5", "💰 Day X: AdMob + Upwork + Mini-quiz #5"), desc: tr("РЕАЛЬНАЯ монетизация: AdMob test, профиль Upwork, услуга на Kwork. Сертификат Future Earner.", "НАҚТЫ монетизация: AdMob test, Upwork профилі, Kwork-тағы қызмет. Future Earner сертификаты.", "REAL monetization: an AdMob test, an Upwork profile, a Kwork service. The Future Earner certificate.") },
    ],
  },
  {
    badge: "M6",
    duration: tr("1.5 недели · 3 урока", "1,5 апта · 3 сабақ", "1.5 weeks · 3 lessons"),
    title: "🎮 Flame Games — Flappy Bird",
    emoji: "🎮",
    accent: tr("Игра!", "Ойын!", "A game!"),
    color: "from-accent/20 via-accent-soft/15",
    description: tr("МОТИВАЦИОННЫЙ БУСТ — РЕДКАЯ ФИЧА. Делаем Flappy Bird клон на Flame engine. Друзья играют, лидерборд.", "МОТИВАЦИЯЛЫҚ СЕРПІН — СИРЕК ФИЧА. Flame engine-де Flappy Bird клонын жасаймыз. Достар ойнайды, лидерборд.", "A MOTIVATION BOOST — A RARE FEATURE. We build a Flappy Bird clone on the Flame engine. Friends play, a leaderboard."),
    outcome: tr("✓ Рабочая Flappy Bird на телефоне ✓ Опубликовано на itch.io ✓ Друзья играют, лидерборд", "✓ Телефонда жұмыс істейтін Flappy Bird ✓ itch.io-да жарияланды ✓ Достар ойнайды, лидерборд", "✓ A working Flappy Bird on your phone ✓ Published on itch.io ✓ Friends play, a leaderboard"),
    certificate: "Game Maker",
    lessons: [
      { num: 31, title: tr("Введение в Flame: game loop, сцена, игрок", "Flame-ге кіріспе: game loop, сахна, ойыншы", "Intro to Flame: game loop, scene, player"), desc: tr("Официальный 2D движок Flutter. Game loop, FlameGame, Sprite. Птичка прыгает.", "Flutter-дің ресми 2D қозғалтқышы. Game loop, FlameGame, Sprite. Құс секіреді.", "Flutter's official 2D engine. Game loop, FlameGame, Sprite. The bird jumps.") },
      { num: 32, title: tr("Flappy Bird: препятствия + коллизии + счёт", "Flappy Bird: кедергілер + коллизиялар + есеп", "Flappy Bird: obstacles + collisions + score"), desc: tr("Трубы, Hitbox-коллизии, счёт, Game Over, Restart. Играем на стриме.", "Құбырлар, Hitbox-коллизиялар, есеп, Game Over, Restart. Стримде ойнаймыз.", "Pipes, hitbox collisions, score, Game Over, Restart. We play on stream.") },
      { num: 33, title: tr("Полировка + публикация на itch.io", "Жылтырату + itch.io-да жариялау", "Polish + publishing on itch.io"), desc: tr("Анимация птицы, параллакс, рекорды. Публикуем игру для друзей.", "Құс анимациясы, параллакс, рекордтар. Ойынды достарға жариялаймыз.", "Bird animation, parallax, high scores. We publish the game for friends.") },
    ],
  },
  {
    badge: "M7",
    duration: tr("5 недель · 10 уроков", "5 апта · 10 сабақ", "5 weeks · 10 lessons"),
    title: tr("Final Project — твой проект", "Final Project — сенің жобаң", "Final Project — your project"),
    emoji: "🔴",
    accent: tr("💪 Финал", "💪 Финал", "💪 Finale"),
    color: "from-foreground/[0.05] via-muted/30",
    description: tr("Спикер ведёт демо-проект FlickApp, ты делаешь свой. Repository pattern, виральность, code review, security.", "Спикер FlickApp демо-жобасын жүргізеді, сен өзіңдікін жасайсың. Repository pattern, виралдылық, code review, қауіпсіздік.", "The speaker runs a demo project FlickApp while you build your own. Repository pattern, virality, code review, security."),
    outcome: tr("✓ Свой финальный проект на Flutter ✓ Repository pattern, виральная фича ✓ Security/Performance/Testing pro", "✓ Flutter-де өз финалдық жобаң ✓ Repository pattern, виралды фича ✓ Security/Performance/Testing pro", "✓ Your own final project on Flutter ✓ Repository pattern, a viral feature ✓ Security/Performance/Testing pro"),
    certificate: "Creative Mind + Viral Architect + Code Reviewer + Security/Performance/Debug Pro",
    lessons: [
      { num: 34, title: tr("Старт финала: ТЗ + архитектура + Git", "Финал старты: ТТ + архитектура + Git", "Finale start: spec + architecture + Git"), desc: tr("Выбираем тему. ТЗ 5 предложений. Widget tree. Репо + develop ветка.", "Тақырып таңдаймыз. 5 сөйлемдік ТТ. Widget tree. Репо + develop тармағы.", "Choose a topic. A 5-sentence spec. Widget tree. A repo + a develop branch.") },
      { num: 35, title: tr("M7 Фундамент: скелет UI + навигация", "M7 Іргетас: UI қаңқасы + навигация", "M7 Foundation: UI skeleton + navigation"), desc: tr("Все экраны сверстаны. Navigation работает. PR + merge в develop.", "Барлық экрандар верстальды. Navigation жұмыс істейді. PR + develop-қа merge.", "All screens built. Navigation works. A PR + merge into develop.") },
      { num: 36, title: tr("M7 Душа: State + AI-pair-programming", "M7 Жан: State + AI-pair-programming", "M7 Soul: State + AI pair-programming"), desc: tr("Provider, ChangeNotifier. Мастер-класс AI prompting — формула вопроса.", "Provider, ChangeNotifier. AI prompting мастер-класы — сұрақ формуласы.", "Provider, ChangeNotifier. An AI prompting masterclass — the question formula.") },
      { num: 37, title: tr("M7 Подключение к миру: API + Repository pattern", "M7 Әлемге қосылу: API + Repository pattern", "M7 Connecting to the world: API + Repository pattern"), desc: tr("Repository слой между UI и API. 4 состояния (loading/error/empty/success).", "UI мен API арасындағы Repository қабаты. 4 күй (loading/error/empty/success).", "A Repository layer between the UI and the API. 4 states (loading/error/empty/success).") },
      { num: 38, title: tr("Mid-demo + Mini-quiz #6", "Mid-demo + Mini-quiz #6", "Mid-demo + Mini-quiz #6"), desc: tr("Демо 3 мин, проект на 70%. Self-feedback. Голосование Best Feature.", "3 минут демо, жоба 70%-да. Self-feedback. Best Feature дауыс беру.", "A 3-min demo, the project at 70%. Self-feedback. A Best Feature vote.") },
      { num: 39, title: tr("🚀 M7 Вирусный след: уникальная фича + share", "🚀 M7 Виралды із: бірегей фича + share", "🚀 M7 Viral trail: a unique feature + share"), desc: tr("Share-кнопка, deep links, referral. Виральная механика для роста.", "Share-батырма, deep links, referral. Өсуге арналған виралды механика.", "A share button, deep links, referral. Viral mechanics for growth.") },
      { num: 40, title: tr("✨ M7 Wow-фактор: анимации + Lottie + shimmer", "✨ M7 Wow-фактор: анимациялар + Lottie + shimmer", "✨ M7 Wow-factor: animations + Lottie + shimmer"), desc: tr("Hero-анимации, AnimatedSwitcher, Lottie. Кастомные переходы.", "Hero-анимациялар, AnimatedSwitcher, Lottie. Кастом өтулер.", "Hero animations, AnimatedSwitcher, Lottie. Custom transitions.") },
      { num: 41, title: tr("👀 Code Review Jam + Mini-quiz #7", "👀 Code Review Jam + Mini-quiz #7", "👀 Code Review Jam + Mini-quiz #7"), desc: tr("Парная проверка кода с одноклассником. 3+ комментариев в PR.", "Сыныптасыңмен жұптық код тексеру. PR-да 3+ комментарий.", "Pair code review with a classmate. 3+ comments in a PR.") },
      { num: 42, title: tr("🛡 Security + Performance + Testing", "🛡 Security + Performance + Testing", "🛡 Security + Performance + Testing"), desc: tr("GitGuardian, .env. DevTools Performance. Unit-тесты. Bug Hunt.", "GitGuardian, .env. DevTools Performance. Unit-тесттер. Bug Hunt.", "GitGuardian, .env. DevTools Performance. Unit tests. Bug Hunt.") },
      { num: 43, title: tr("🔍 Финальная шлифовка + UX-тест на бабушке", "🔍 Финалдық жылтырату + әжеге UX-тест", "🔍 Final polish + a grandma UX test"), desc: tr("Чек-лист 15 пунктов. Backup-видео. Понимает бабушка → релиз.", "15 тармақтан чек-лист. Backup-видео. Әже түсінсе → релиз.", "A 15-point checklist. A backup video. If grandma gets it → release.") },
    ],
  },
  {
    badge: "M8",
    duration: tr("2.5 недели · 5 уроков", "2,5 апта · 5 сабақ", "2.5 weeks · 5 lessons"),
    title: tr("Career Launch — карьера", "Career Launch — мансап", "Career Launch — your career"),
    emoji: "💼",
    accent: tr("🏆 Карьера", "🏆 Мансап", "🏆 Career"),
    color: "from-accent/15 via-accent-soft/10",
    description: tr("РЕЛИЗ в Google Play + IT-English + резюме + 3 реальных отклика на вакансии + 1-на-1 mentor-сессия с разработчиком из IT-компании KZ/РФ.", "Google Play-ге РЕЛИЗ + IT-English + резюме + 3 нақты вакансияға өтінім + KZ/РФ IT-компаниясының әзірлеушісімен 1-ге-1 mentor-сессия.", "A RELEASE to Google Play + IT-English + a resume + 3 real job applications + a 1-on-1 mentor session with a developer from a KZ/RU IT company."),
    outcome: tr("✓ Приложение в Google Play ✓ Резюме + LinkedIn + GitHub README ✓ 3 реальных отклика ✓ ДИПЛОМ Mobile Developer", "✓ Google Play-дегі қосымша ✓ Резюме + LinkedIn + GitHub README ✓ 3 нақты өтінім ✓ Mobile Developer ДИПЛОМЫ", "✓ An app on Google Play ✓ A resume + LinkedIn + a GitHub README ✓ 3 real applications ✓ A Mobile Developer DIPLOMA"),
    certificate: tr("ДИПЛОМ «Mobile Developer» + 14+ сертификатов", "«Mobile Developer» ДИПЛОМЫ + 14+ сертификат", "A 'Mobile Developer' DIPLOMA + 14+ certificates"),
    lessons: [
      { num: 44, title: tr("🚀 Релиз: Google Play + App Store", "🚀 Релиз: Google Play + App Store", "🚀 Release: Google Play + App Store"), desc: tr("Developer-аккаунт, AAB, иконка, скриншоты, описание. Заливка в Play Store.", "Developer-аккаунт, AAB, иконка, скриншоттар, сипаттама. Play Store-ге жүктеу.", "A developer account, AAB, an icon, screenshots, a description. Uploading to the Play Store.") },
      { num: 45, title: tr("🗣 IT-English: docs, StackOverflow, 50 слов", "🗣 IT-English: docs, StackOverflow, 50 сөз", "🗣 IT-English: docs, StackOverflow, 50 words"), desc: tr("Читаем Flutter docs без переводчика. Задаём вопрос на StackOverflow.", "Flutter docs-ты аудармашысыз оқимыз. StackOverflow-да сұрақ қоямыз.", "We read the Flutter docs without a translator. We ask a question on StackOverflow.") },
      { num: 46, title: tr("📄 Резюме + LinkedIn + GitHub + портфолио-сайт", "📄 Резюме + LinkedIn + GitHub + портфолио-сайт", "📄 Resume + LinkedIn + GitHub + a portfolio site"), desc: tr("4 артефакта джуна за 25 минут. Шаблоны, проверка куратором.", "25 минутта жунының 4 артефактісі. Шаблондар, куратор тексеруі.", "4 junior artifacts in 25 minutes. Templates, a review by the mentor.") },
      { num: 47, title: tr("💼 3 реальных отклика + 1-на-1 mentor-сессия", "💼 3 нақты өтінім + 1-ге-1 mentor-сессия", "💼 3 real applications + a 1-on-1 mentor session"), desc: tr("Вакансии в Kaspi/Halyk/inDriver/Яндекс/VK. Mock-интервью. 30 мин 1-на-1 с разработчиком.", "Kaspi/Halyk/inDriver/Яндекс/VK-дегі вакансиялар. Mock-сұхбат. Әзірлеушімен 30 мин 1-ге-1.", "Openings at Kaspi/Halyk/inDriver/Yandex/VK. A mock interview. 30 min 1-on-1 with a developer.") },
      { num: 48, title: tr("🏆 FINAL DEMO DAY → ДИПЛОМ", "🏆 FINAL DEMO DAY → ДИПЛОМ", "🏆 FINAL DEMO DAY → DIPLOMA"), desc: tr("Финальная защита БЕЗ AI. Голосование Best App. Диплом Mobile Developer.", "AI-СЫЗ финалдық қорғау. Best App дауыс беру. Mobile Developer дипломы.", "A final defense WITHOUT AI. A Best App vote. A Mobile Developer diploma.") },
    ],
  },
  ];
}

export default function MobileCoursePage() {
  const { tr } = useLang();
  const modules = makeModules(tr);
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
            <li><a href="/#courses" className="hover:text-foreground transition-colors">{tr("Все курсы", "Барлық курстар", "All courses")}</a></li>
            <li><a href="/#pricing" className="hover:text-foreground transition-colors">{tr("Цены", "Бағалар", "Pricing")}</a></li>
            <li><a href="/#schedule" className="hover:text-foreground transition-colors">{tr("Расписание", "Кесте", "Schedule")}</a></li>
            <li><a href="/#reviews" className="hover:text-foreground transition-colors">{tr("Отзывы", "Пікірлер", "Reviews")}</a></li>
          </ul>
          <div className="flex items-center gap-3">
            <LangSwitcher className="hidden sm:inline-flex" />
            <button onClick={openApply} className="px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-all hover:scale-[1.03] shadow-md shadow-accent/20">
              {tr("Пробный урок", "Сынақ сабақ", "Trial lesson")}
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

      {/* 📱 HERO КУРСА */}
      <motion.section initial="hidden" animate="visible" variants={staggerContainer} className="relative py-12 sm:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16 items-center">
            <div>
              <motion.p variants={staggerItem} className="font-mono text-xs sm:text-sm text-accent tracking-wider mb-3">~/courses/mobile $ flutter run</motion.p>
              <motion.div variants={staggerItem} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <Icon name="smartphone" className="h-5 w-5 text-accent" />
                <span className="text-xs font-bold text-accent uppercase tracking-wider">{tr("Курс мобильной разработки", "Мобильді әзірлеу курсы", "Mobile development course")}</span>
              </motion.div>

              <motion.h1 variants={staggerItem} className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] mb-5">
                {tr("От ", "", "From ")}<span className="text-accent">FlutterFlow</span>{tr(" до Google Play", "-тан Google Play-ге дейін", " to Google Play")}
              </motion.h1>

              <motion.p variants={staggerItem} className="text-lg lg:text-xl text-foreground/70 leading-relaxed mb-6 max-w-2xl">
                {tr("За 24 недели ребёнок пройдёт путь от первого приложения за 3 недели через FlutterFlow до публикации финального проекта в Google Play. С реальной монетизацией через AdMob и Upwork.", "24 аптада бала FlutterFlow арқылы 3 аптада жасалған алғашқы қосымшадан бастап финалдық жобаны Google Play-ге жариялауға дейінгі жолдан өтеді. AdMob пен Upwork арқылы нақты монетизациямен.", "In 24 weeks your child goes from a first app in 3 weeks via FlutterFlow to publishing a final project on Google Play. With real monetization through AdMob and Upwork.")}
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
                  { value: 14, suffix: "+", label: tr("сертификатов", "сертификат", "certificates") },
                  { value: 14, suffix: "–17", label: tr("лет", "жас", "years old") },
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

            {/* ПРАВАЯ КАРТОЧКА — окно редактора со скриншотом урока */}
            <motion.div variants={staggerItem} className="relative">
              <CodeWindow
                title="scaffold.dart"
                image="/assets/screenshots/mobile-3.png"
                imageAlt={tr("Конструктор экрана Flutter Scaffold", "Flutter Scaffold экран конструкторы", "A Flutter Scaffold screen builder")}
                imageFit="contain"
                stack={["Flutter", "Dart", "Firebase", "AdMob"]}
                className="glow-hover max-w-md mx-auto"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 🏆 ЧТО ПОЛУЧИТ К КОНЦУ КУРСА */}
      <motion.section className="relative py-16 sm:py-20 border-t border-border bg-muted/20" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-12">
            <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("Результат", "Нәтиже", "Result")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {tr("Что будет у ребёнка", "Балада не болады", "What your child will have")} <span className="text-accent">{tr("после курса", "курстан кейін", "after the course")}</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { emoji: "🚀", title: tr("Приложение в Google Play", "Google Play-дегі қосымша", "An app on Google Play"), desc: tr("Финальный проект публикуется в Google Play. Друзья и родственники могут установить через сторе.", "Финалдық жоба Google Play-ге жарияланады. Достар мен туыстар дүкен арқылы орната алады.", "The final project is published on Google Play. Friends and relatives can install it from the store.") },
              { emoji: "📱", title: tr("5 приложений в портфолио", "Портфолиода 5 қосымша", "5 apps in the portfolio"), desc: tr("FlutterFlow-проект, Quiz App, ClassGram, Flappy Bird, финальный проект. Сильное портфолио джуна.", "FlutterFlow-жоба, Quiz App, ClassGram, Flappy Bird, финалдық жоба. Жунының күшті портфолиосы.", "A FlutterFlow project, Quiz App, ClassGram, Flappy Bird, a final project. A strong junior portfolio.") },
              { emoji: "💰", title: tr("Реальные Upwork и Kwork", "Нақты Upwork пен Kwork", "Real Upwork and Kwork"), desc: tr("Профили на фриланс-биржах с реальным портфолио. Услуга на Kwork «Сделаю Flutter-приложение».", "Нақты портфолиосы бар фриланс-биржалардағы профильдер. Kwork-тағы «Flutter-қосымша жасаймын» қызметі.", "Profiles on freelance marketplaces with a real portfolio. A Kwork service: 'I'll build a Flutter app'.") },
              { emoji: "💼", title: tr("3 реальных отклика на вакансии", "Вакансияларға 3 нақты өтінім", "3 real job applications"), desc: tr("На junior Flutter в Kaspi, Halyk, inDriver, Яндекс, VK. С готовым резюме и cover-letter.", "Kaspi, Halyk, inDriver, Яндекс, VK-дегі junior Flutter-ге. Дайын резюме мен cover-letter-мен.", "For junior Flutter roles at Kaspi, Halyk, inDriver, Yandex, VK. With a ready resume and cover letter.") },
              { emoji: "👤", title: tr("1-на-1 mentor-сессия", "1-ге-1 mentor-сессия", "A 1-on-1 mentor session"), desc: tr("30 минут с разработчиком из Kaspi/inDriver/Halyk. Персональный ревью + ответы на твои вопросы (обычно стоит $50-100).", "Kaspi/inDriver/Halyk әзірлеушісімен 30 минут. Жеке ревью + сұрақтарыңа жауап (әдетте $50-100 тұрады).", "30 minutes with a developer from Kaspi/inDriver/Halyk. A personal review + answers to your questions (usually costs $50-100).") },
              { emoji: "🏆", title: tr("14+ сертификатов + ДИПЛОМ", "14+ сертификат + ДИПЛОМ", "14+ certificates + a DIPLOMA"), desc: tr("FlutterFlow Builder, Dart Starter, Flutter Developer, Game Maker, Mobile Developer Diploma.", "FlutterFlow Builder, Dart Starter, Flutter Developer, Game Maker, Mobile Developer Diploma.", "FlutterFlow Builder, Dart Starter, Flutter Developer, Game Maker, Mobile Developer Diploma.") },
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
            <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("Уникальные фишки", "Бірегей ерекшеліктер", "Unique features")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              {tr("Чего", "Басқа мектептерде", "What you")} <span className="text-accent">{tr("нет в других школах", "жоқ нәрсе", "won't find at other schools")}</span>
            </h2>
            <p className="text-lg text-foreground/70">
              {tr("Мы взяли подростковые темы и встроили реальный заработок прямо в учебную программу.", "Біз жасөспірімдерге жақын тақырыптарды алып, оқу бағдарламасына нақты табысты кіріктірдік.", "We took teen-friendly topics and built real earning right into the curriculum.")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
            {[
              { emoji: "📱", title: "ClassGram", subtitle: tr("Мини-Instagram для класса", "Сынып үшін мини-Instagram", "A mini-Instagram for the class"), desc: tr("Лента, фото с геометкой, лайки, комменты, push-уведомления. Ученик делится с одноклассниками — те регистрируются и пользуются. Виральная подростковая тема — родители видят как ребёнок становится автором приложения, которым пользуется его класс.", "Лента, геобелгісі бар фото, лайктар, комментарийлер, push-хабарламалар. Оқушы сыныптастарымен бөліседі — олар тіркеліп қолданады. Виралды жасөспірім тақырыбы — ата-аналар баласы бүкіл сыныбы қолданатын қосымшаның авторына айналғанын көреді.", "A feed, geotagged photos, likes, comments, push notifications. The student shares it with classmates who sign up and use it. A viral teen topic — parents see their child become the author of an app the whole class uses.") },
              { emoji: "🎮", title: tr("Flappy Bird на Flame", "Flame-дегі Flappy Bird", "Flappy Bird on Flame"), subtitle: tr("Настоящая 2D игра в портфолио", "Портфолиодағы нағыз 2D ойын", "A real 2D game in the portfolio"), desc: tr("На уроках M6 делаем клон Flappy Bird на движке Flame. Публикуем на itch.io — друзья играют, лидерборд. Редкая фича: ни у одной школы программирования для подростков нет реального геймдева в курсе мобильной разработки.", "M6 сабақтарында Flame қозғалтқышында Flappy Bird клонын жасаймыз. itch.io-да жариялаймыз — достар ойнайды, лидерборд. Сирек ерекшелік: жасөспірімдерге арналған бірде-бір бағдарламалау мектебінде мобильді әзірлеу курсында нақты геймдев жоқ.", "In M6 lessons we build a Flappy Bird clone on the Flame engine. We publish it on itch.io — friends play, a leaderboard. A rare feature: no other teen coding school has real game dev inside a mobile development course.") },
              { emoji: "💰", title: tr("День X — реальный заработок", "X күні — нақты табыс", "Day X — real earning"), subtitle: "Урок 30: AdMob + Upwork + Kwork", desc: tr("Не теория «как зарабатывать», а реальные действия: интегрируем AdMob test-баннер в ClassGram, регистрируемся на Upwork с настоящим портфолио, создаём услугу на Kwork «Сделаю Flutter-приложение». Ребёнок выходит из урока с активными фрилансер-профилями.", "«Қалай ақша табу керек» теориясы емес, нақты әрекеттер: ClassGram-ға AdMob test-баннер кіріктіреміз, нақты портфолиомен Upwork-қа тіркелеміз, Kwork-та «Flutter-қосымша жасаймын» қызметін жасаймыз. Бала сабақтан белсенді фрилансер профильдерімен шығады.", "Not theory about 'how to earn', but real actions: we integrate an AdMob test banner into ClassGram, sign up on Upwork with a real portfolio, create a Kwork service 'I'll build a Flutter app'. The student leaves the lesson with active freelancer profiles.") },
              { emoji: "👤", title: tr("1-на-1 с разработчиком", "Әзірлеушімен 1-ге-1", "1-on-1 with a developer"), subtitle: tr("30 минут персональной mentor-сессии", "30 минуттық жеке mentor-сессия", "A 30-minute personal mentor session"), desc: tr("В M8 (урок 47) — 30-минутный Discord-созвон 1-на-1 с действующим Mobile Developer из Kaspi.kz, inDriver, Halyk Bank или Яндекса. Персональный ревью резюме, LinkedIn и проектов. Это БОЛЬШАЯ ценность — обычно такие сессии стоят $50-100.", "M8-де (47-сабақ) — Kaspi.kz, inDriver, Halyk Bank немесе Яндекстің қолданыстағы Mobile Developer-імен 30 минуттық Discord-қоңырау 1-ге-1. Резюме, LinkedIn және жобаларды жеке ревью. Бұл ҮЛКЕН құндылық — әдетте мұндай сессиялар $50-100 тұрады.", "In M8 (lesson 47) — a 30-minute 1-on-1 Discord call with a working Mobile Developer from Kaspi.kz, inDriver, Halyk Bank or Yandex. A personal review of the resume, LinkedIn and projects. This is HUGE value — such sessions usually cost $50-100.") },
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
            <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("Программа курса", "Курс бағдарламасы", "Course program")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              {tr("8 модулей,", "8 модуль,", "8 modules,")} <span className="text-accent">{tr("48 уроков, 14+ сертификатов", "48 сабақ, 14+ сертификат", "48 lessons, 14+ certificates")}</span>
            </h2>
            <p className="text-lg text-foreground/70">
              {tr("После каждого модуля — промежуточный сертификат и работающее приложение в портфолио.", "Әр модульден кейін — аралық сертификат және портфолиодағы жұмыс істейтін қосымша.", "After each module — an interim certificate and a working app in the portfolio.")}
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
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name="rocket" className="h-6 w-6" /></span>
                      <span className="text-xs font-semibold text-accent">{mod.accent}</span>
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-bold leading-tight mb-3">{mod.title}</h3>
                    <p className="text-sm text-foreground/70 leading-relaxed mb-4">{mod.description}</p>

                    <div className="p-3 rounded-xl bg-surface border border-border mb-3">
                      <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1.5">{tr("К концу модуля", "Модуль соңында", "By the end of the module")}</p>
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
                        <p className="font-display text-base sm:text-lg font-bold leading-tight">{tr("Подробная программа модуля", "Модульдің толық бағдарламасы", "Detailed module program")}</p>
                        <p className="text-xs text-foreground/55 mt-0.5">{mod.lessons.length} {tr("уроков — нажмите чтобы развернуть", "сабақ — ашу үшін басыңыз", "lessons — click to expand")}</p>
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
            <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("AI-стратегия курса", "Курстың AI-стратегиясы", "The course's AI strategy")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              {tr("3 AI-инструмента", "3 AI-құрал", "3 AI tools")} <span className="text-accent">{tr("от старта до защиты", "стартан қорғауға дейін", "from start to defense")}</span>
            </h2>
            <p className="text-lg text-foreground/70">
              {tr("Не 20 инструментов сразу — а 3 категории за курс. Ученик выбирает по одному в каждой и не переключается.", "Бірден 20 құрал емес — курс бойы 3 санат. Оқушы әрқайсысынан біреуін таңдап, ауыстырмайды.", "Not 20 tools at once — 3 categories across the course. The student picks one in each and doesn't switch.")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
            {[
              { num: "1", emoji: "🤖", title: tr("AI-ассистент", "AI-ассистент", "AI assistant"), subtitle: tr("Вопросы, объяснения, ревью", "Сұрақтар, түсіндірмелер, ревью", "Questions, explanations, reviews"), desc: tr("На любом уроке M2–M8: «Объясни эту строку», «Почему ошибка?», «Сделай ревью архитектуры». Генерация cover-letter, резюме, LinkedIn.", "M2–M8 кез келген сабақта: «Осы жолды түсіндір», «Неге қате?», «Архитектураны ревью жаса». Cover-letter, резюме, LinkedIn генерациясы.", "In any M2–M8 lesson: 'Explain this line', 'Why the error?', 'Review the architecture'. Generating a cover letter, resume, LinkedIn."), tools: "Claude · ChatGPT · Gemini · DeepSeek" },
              { num: "2", emoji: "⌨️", title: "AI IDE", subtitle: tr("С урока 13: автокомплит кода", "13-сабақтан: код автотолтыруы", "From lesson 13: code autocomplete"), desc: tr("Стандарт джуна 2026 — AI пишет код вместе с тобой. Cmd+K — генерация по комментарию. Cmd+L — чат с контекстом файла.", "2026 жунының стандарты — AI сенімен бірге код жазады. Cmd+K — комментарий бойынша генерация. Cmd+L — файл контекстімен чат.", "The 2026 junior standard — AI writes code with you. Cmd+K — generate from a comment. Cmd+L — chat with the file's context."), tools: "Cursor · GitHub Copilot · Codeium · Windsurf" },
              { num: "3", emoji: "🎨", title: "FlutterFlow AI", subtitle: tr("Только в M1 + 17, 32, 34", "Тек M1 + 17, 32, 34-те", "Only in M1 + 17, 32, 34"), desc: tr("Визуальная генерация приложения по тексту. Главный инструмент Модуля 1 — первое приложение за 3 минуты.", "Мәтін бойынша қосымшаның визуалды генерациясы. 1-модульдің басты құралы — 3 минутта алғашқы қосымша.", "Visual app generation from text. The main tool of Module 1 — your first app in 3 minutes."), tools: tr("FlutterFlow AI (фича платформы)", "FlutterFlow AI (платформа мүмкіндігі)", "FlutterFlow AI (platform feature)") },
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
            <span className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent"><Icon name="award" className="h-7 w-7" /></span>
            <h3 className="font-display text-xl sm:text-2xl font-bold mb-2">
              {tr("На ", "", "")}<span className="text-accent">{tr("финальной защите", "Финалдық қорғауда", "At the final defense")}</span> {tr("— БЕЗ AI", "— AI-СЫЗ", "— WITHOUT AI")}
            </h3>
            <p className="text-sm text-foreground/70 leading-relaxed">
              {tr("Всё, что показываешь — твоё. Так же, как на реальных собеседованиях в Kaspi или Яндекс. AI помогает учиться, но самостоятельность доказывают сами.", "Көрсететініңнің бәрі — өзіңдікі. Kaspi немесе Яндекстегі нақты сұхбаттардағыдай. AI үйренуге көмектеседі, бірақ дербестікті өздері дәлелдейді.", "Everything you show is yours. Just like at real interviews at Kaspi or Yandex. AI helps you learn, but you prove your independence yourself.")}
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* 🎮 ИНСТРУМЕНТЫ И ИГРЫ */}
      <motion.section className="relative py-20 sm:py-28 border-t border-border bg-muted/20" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="max-w-2xl mb-12">
            <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("Инструменты курса", "Курс құралдары", "Course tools")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {tr("Реальные сервисы и", "Нақты сервистер мен", "Real services and")} <span className="text-accent">{tr("тренажёры", "тренажёрлер", "trainers")}</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { name: "FlutterFlow", desc: tr("Визуальный билдер Flutter-приложений с AI. Главный инструмент M1.", "AI бар Flutter-қосымшалардың визуалды билдері. M1-дің басты құралы.", "A visual builder for Flutter apps with AI. The main tool of M1."), emoji: "🎨" },
              { name: "Cursor / Copilot", desc: tr("AI IDE с урока 13. Стандарт разработчика 2026. Автокомплит и чат.", "13-сабақтан AI IDE. 2026 әзірлеушісінің стандарты. Автотолтыру мен чат.", "An AI IDE from lesson 13. The 2026 developer standard. Autocomplete and chat."), emoji: "⌨️" },
              { name: "DartPad", desc: tr("Онлайн-площадка для Dart. Решаем задачи M2 без установки.", "Dart-қа арналған онлайн-алаң. M2 тапсырмаларын орнатусыз шешеміз.", "An online playground for Dart. We solve M2 tasks without installing anything."), emoji: "🎯" },
              { name: "Flame Engine", desc: tr("2D игровой движок Flutter. На нём делаем Flappy Bird клон.", "Flutter-дің 2D ойын қозғалтқышы. Онда Flappy Bird клонын жасаймыз.", "Flutter's 2D game engine. We build a Flappy Bird clone on it."), emoji: "🎮" },
              { name: "itch.io", desc: tr("Платформа для публикации игр. Туда заливаем Flappy Bird.", "Ойындарды жариялау платформасы. Flappy Bird-ты сонда жүктейміз.", "A platform for publishing games. We upload Flappy Bird there."), emoji: "🚀" },
              { name: "OpenTDB", desc: tr("API с тысячами quiz-вопросов. Подключаем в M4.", "Мыңдаған quiz-сұрағы бар API. M4-те қосамыз.", "An API with thousands of quiz questions. We connect it in M4."), emoji: "📚" },
              { name: "Firebase Console", desc: tr("Auth, Firestore, Storage, push. Сердце ClassGram.", "Auth, Firestore, Storage, push. ClassGram-ның жүрегі.", "Auth, Firestore, Storage, push. The heart of ClassGram."), emoji: "🔥" },
              { name: "AdMob Console", desc: tr("Реальная монетизация. Тестовые баннеры в M5 (День X).", "Нақты монетизация. M5-тегі тест баннерлер (X күні).", "Real monetization. Test banners in M5 (Day X)."), emoji: "💰" },
              { name: "Codemagic", desc: tr("Браузерная сборка APK/iOS. Не нужен Mac для App Store.", "Браузерлік APK/iOS жинау. App Store үшін Mac қажет емес.", "Browser-based APK/iOS builds. No Mac needed for the App Store."), emoji: "📦" },
              { name: "Codewars", desc: tr("Dart-задачи 8 kyu. Прокачиваем алгоритмы.", "8 kyu Dart-тапсырмалары. Алгоритмдерді дамытамыз.", "8 kyu Dart tasks. We level up algorithms."), emoji: "💪" },
              { name: "Oh My Git", desc: tr("Интерактивные уровни Git. Без страха перед терминалом.", "Git-тің интерактивті деңгейлері. Терминалдан қорықпай.", "Interactive Git levels. No fear of the terminal."), emoji: "🌿" },
              { name: "LottieFiles", desc: tr("Готовые анимации для приложений. M5 и M7.", "Қосымшаларға дайын анимациялар. M5 пен M7.", "Ready-made animations for apps. M5 and M7."), emoji: "✨" },
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
              <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("Геймификация", "Геймификация", "Gamification")}</p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-5">
                {tr("XP-система, бейджи,", "XP-жүйе, бейджтер,", "XP system, badges,")} <span className="text-accent">mini-quizzes</span>
              </h2>
              <p className="text-lg text-foreground/70 leading-relaxed mb-6">
                {tr("Подростки любят геймифицированный прогресс. Каждое ДЗ даёт XP, бонусные задания — дополнительные баллы. Бейджи открываются за достижения: «Layout Lord», «JSON Wizard», «Game Maker», «Viral Architect», «Code Reviewer».", "Жасөспірімдер геймификацияланған прогресті ұнатады. Әр ҮЖ XP береді, бонустық тапсырмалар — қосымша ұпай. Бейджтер жетістіктер үшін ашылады: «Layout Lord», «JSON Wizard», «Game Maker», «Viral Architect», «Code Reviewer».", "Teens love gamified progress. Each homework gives XP, bonus tasks give extra points. Badges unlock for achievements: 'Layout Lord', 'JSON Wizard', 'Game Maker', 'Viral Architect', 'Code Reviewer'.")}
              </p>
              <p className="text-base text-foreground/65 italic">
                {tr("Это не «дневник с оценками», а «прокачка персонажа в IT». Мотивация на полгода обучения.", "Бұл «бағалар күнделігі» емес, «IT-дегі кейіпкерді дамыту». Жарты жыл оқуға мотивация.", "It's not a 'gradebook' but 'leveling up a character in IT'. Motivation for half a year of study.")}
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-surface border border-border">
                <span className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name="zap" className="h-6 w-6" /></span>
                <p className="font-display text-3xl font-bold text-accent mb-1">XP</p>
                <p className="text-xs text-foreground/60">{tr("за каждое задание + бонусы", "әр тапсырма үшін + бонустар", "for each task + bonuses")}</p>
              </div>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent border-2 border-accent/30">
                <span className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name="award" className="h-6 w-6" /></span>
                <p className="font-display text-3xl font-bold text-accent mb-1">14+</p>
                <p className="text-xs text-foreground/60">{tr("сертификатов и бейджей", "сертификат пен бейдж", "certificates and badges")}</p>
              </div>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-accent-soft/15 to-transparent border-2 border-accent/20">
                <span className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name="message" className="h-6 w-6" /></span>
                <p className="font-display text-3xl font-bold text-accent mb-1">7</p>
                <p className="text-xs text-foreground/60">{tr("mini-quizzes по 5 вопросов", "5 сұрақтан mini-quizzes", "mini-quizzes of 5 questions each")}</p>
              </div>
              <div className="p-5 rounded-2xl bg-surface border border-border">
                <span className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name="sparkle" className="h-6 w-6" /></span>
                <p className="font-display text-3xl font-bold text-accent mb-1">5</p>
                <p className="text-xs text-foreground/60">{tr("fun-days с соревнованиями", "жарыстары бар fun-days", "fun-days with competitions")}</p>
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
              <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("Никто не застревает", "Ешкім тұрып қалмайды", "Nobody gets stuck")}</p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-5">
                {tr("Два уровня", "Екі деңгейлі", "Two levels of")} <span className="text-accent">{tr("домашних заданий", "үй тапсырмалары", "homework")}</span>
              </h2>
              <p className="text-lg text-foreground/70 leading-relaxed mb-6">
                {tr("Если ученик не справляется с основным заданием — через 48 часов открывается облегчённая версия. Готовый шаблон кода (60-70%), подсказки с таймкодами видео. Главное — двигаться дальше.", "Егер оқушы негізгі тапсырманы орындай алмаса — 48 сағаттан кейін жеңілдетілген нұсқа ашылады. Дайын код шаблоны (60-70%), видео таймкодтарымен кеңестер. Ең бастысы — алға жылжу.", "If a student can't handle the main task — a lighter version opens after 48 hours. A ready code template (60-70%), hints with video timecodes. The main thing is to keep moving.")}
              </p>
              <p className="text-base text-foreground/65 italic">
                {tr("Уровень 2 — не стыдно. Это scaffold чтобы идти дальше, а не вариант для «слабых».", "2-деңгей — ұят емес. Бұл алға жүру үшін scaffold, «әлсіздерге» арналған нұсқа емес.", "Level 2 is nothing to be ashamed of. It's a scaffold to keep going, not an option for 'the weak'.")}
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-4">
              <div className="p-6 rounded-2xl bg-surface border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">1</div>
                  <h3 className="font-display text-xl font-bold">{tr("Уровень 1 — основной", "1-деңгей — негізгі", "Level 1 — main")}</h3>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {tr("Полноценное задание без подсказок. 5-7 пунктов, иногда видео-демонстрация работы. Если справился — идём дальше.", "Кеңессіз толыққанды тапсырма. 5-7 тармақ, кейде жұмыстың видео-демонстрациясы. Орындасаң — алға жүреміз.", "A full task with no hints. 5-7 points, sometimes a video demo of the work. If you handle it — we move on.")}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent border-2 border-accent/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">2</div>
                  <h3 className="font-display text-xl font-bold">{tr("Уровень 2 — облегчённый", "2-деңгей — жеңілдетілген", "Level 2 — lighter")}</h3>
                </div>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li className="flex gap-2"><span className="text-accent">✓</span> {tr("Готовый шаблон кода (60-70%), дописываем остальное", "Дайын код шаблоны (60-70%), қалғанын жазамыз", "A ready code template (60-70%), we finish the rest")}</li>
                  <li className="flex gap-2"><span className="text-accent">✓</span> {tr("3-4 пункта вместо 5-7", "5-7 орнына 3-4 тармақ", "3-4 points instead of 5-7")}</li>
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
              {tr("Практикующий", "Тәжірибелі", "A practicing")} <span className="text-accent">{tr("мобильный разработчик", "мобильді әзірлеуші", "mobile developer")}</span>
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid sm:grid-cols-[auto_1fr] gap-6 lg:gap-10 items-center p-6 sm:p-8 lg:p-10 rounded-3xl bg-surface border border-border">
            <div className="relative w-32 h-32 sm:w-44 sm:h-44 lg:w-52 lg:h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-accent via-accent-soft to-muted flex items-center justify-center flex-shrink-0">
              <span className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg">ЭМ</span>
            </div>

            <div>
              <h3 className="font-display text-2xl lg:text-3xl font-bold mb-1">{tr("Эльнара М.", "Эльнара М.", "Elnara M.")}</h3>
              <p className="text-base font-semibold text-accent mb-4">AI assisted developer</p>

              <p className="text-base text-foreground/70 leading-relaxed mb-5">
                {tr("Практикующий мобильный разработчик. Учит собирать приложения с помощью AI-инструментов — от FlutterFlow до публикации в Google Play. Свободно владеет русским и казахским.", "Тәжірибелі мобильді әзірлеуші. AI-құралдардың көмегімен қосымша жасауды үйретеді — FlutterFlow-дан Google Play-ге жариялауға дейін. Орыс және қазақ тілдерін еркін меңгерген.", "A practicing mobile developer. Teaches how to build apps with AI tools — from FlutterFlow to publishing on Google Play. Fluent in Russian and Kazakh.")}
              </p>

              <div className="flex flex-wrap gap-2">
                {["Flutter", "Dart", "Firebase", "Native iOS/Android", "Flame", "AdMob"].map((tech, i) => (
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
            <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("Стоимость и старт", "Құны мен старты", "Price and start")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {tr("Сколько стоит и", "Қанша тұрады және", "How much it costs and")} <span className="text-accent">{tr("когда начинаем", "қашан бастаймыз", "when we start")}</span>
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
              <p className="text-sm text-foreground/65 mb-5">{tr("Одинаково весь период обучения · без скрытых доплат", "Бүкіл оқу кезеңінде бірдей · жасырын қосымша ақысыз", "The same for the whole course · no hidden fees")}</p>

              <div className="space-y-2 text-sm text-foreground/70 mb-6">
                <p className="flex gap-2"><span className="text-accent">💛</span> {tr("Льготникам (многодетные, инвалиды) — 60 000 ₸ в месяц", "Жеңілдік алушыларға (көпбалалы, мүгедектер) — айына 60 000 ₸", "For eligible families (large families, people with disabilities) — 60 000 ₸ per month")}</p>
                <p className="flex gap-2"><span className="text-accent">🔥</span> {tr("Kaspi-рассрочка 0% на 3 или 6 месяцев", "3 не 6 айға 0% Kaspi-бөліп төлеу", "0% Kaspi installments for 3 or 6 months")}</p>
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
              <p className="text-sm text-foreground/65 mb-5">{tr("старт по мере набора группы", "топ жиналған сайын басталады", "starts as the group fills up")}</p>

              <div className="space-y-2 text-sm text-foreground/70 mb-6">
                <p className="flex gap-2"><span className="text-accent">🕐</span> <strong>{tr("2 раза", "аптасына 2 рет", "2 times")}</strong> {tr("в неделю, по 90 мин", ", 90 минуттан", "a week, 90 min each")}</p>
                <p className="flex gap-2"><span className="text-accent">📆</span> {tr("Гибкий график —", "Икемді кесте —", "A flexible schedule —")} <em>{tr("подберём удобные дни и время", "ыңғайлы күндер мен уақытты таңдаймыз", "we'll pick convenient days and times")}</em></p>
                <p className="flex gap-2"><span className="text-accent">👥</span> {tr("Группа до 8 человек", "Топта 8 адамға дейін", "A group of up to 8 people")}</p>
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
            {tr("Первый урок —", "Алғашқы сабақ —", "The first lesson is")} <span className="text-accent">{tr("бесплатно", "тегін", "free")}</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="text-lg lg:text-xl text-foreground/70 leading-relaxed mb-10 max-w-xl mx-auto">
            {tr("Ребёнок попробует, познакомится с преподавателем, сгенерирует первое приложение через FlutterFlow AI. Если не понравится — никаких обязательств.", "Бала байқап көреді, ұстазбен танысады, FlutterFlow AI арқылы алғашқы қосымшаны жасайды. Ұнамаса — ешқандай міндеттеме жоқ.", "Your child tries it, meets the teacher, generates a first app via FlutterFlow AI. If they don't like it — no obligations.")}
          </motion.p>

          <motion.button variants={fadeInUp} onClick={openApply} className="inline-flex items-center gap-3 px-8 py-5 bg-accent hover:bg-accent-hover text-white rounded-full font-semibold text-lg hover:scale-[1.02] transition-all duration-300 shadow-2xl shadow-accent/40">
            {tr("Записаться на пробный урок", "Сынақ сабаққа жазылу", "Book a trial lesson")} <span>→</span>
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
