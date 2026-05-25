"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

/* ============================================================
   ДАННЫЕ КУРСА
   ============================================================ */

const modules = [
  {
    id: "m1",
    label: "Модуль 1",
    title: "От бота до REST API",
    lessons: "Уроки 1–29",
    weeks: "15 недель",
    result: "REST API + Swagger + HTML-фронтенд + Telegram-бот 24/7",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    stages: [
      {
        name: "Этап 1 · Vibe-coding",
        lessons: "Уроки 1–6",
        desc: "Установка Python и VS Code. Первый Telegram-бот через ChatGPT за 2 урока. Кастомизация, память через JSON, деплой на PythonAnywhere — бот работает 24/7.",
        highlight: "🤖 Через 3 недели — бот, которому можно написать с маминого телефона",
        topics: ["Установка Python + VS Code", "BotFather → токен бота", "Vibe-coding через ChatGPT", "Кастомизация (inline-кнопки)", "Память: dict + JSON", "Git + деплой 24/7", "Demo-day #1"],
      },
      {
        name: "Этап 2 · Python с нуля",
        lessons: "Уроки 7–13",
        desc: "Каждый урок Python привязан к новой фиче бота: визитка → угадайка → рефакторинг → /leaderboard → файлы + отладка. Контрольная без AI.",
        highlight: "🐍 Урок 12 — Python Battle: чтение чужого open-source кода",
        topics: ["Переменные → /about бота", "Циклы + условия → /game", "Функции + DRY → рефакторинг", "Списки/словари → /leaderboard", "Файлы + try/except + отладчик", "🎮 Python Battle (fun-day)", "Контрольная без AI"],
      },
      {
        name: "Этап 2 · SQL и базы данных",
        lessons: "Уроки 14–21",
        desc: "Игровая БД GameDB как сквозной проект: SELECT, JOIN, UPDATE/DELETE. SQL-детектив — расследование «преступления» через запросы. CRUD + бот с настоящей базой.",
        highlight: "🔍 Урок 18 — SQL-детектив: найди вора через 5 SQL-запросов",
        topics: ["SQLite + DB Browser", "SELECT, WHERE, GROUP BY", "UPDATE/DELETE + AI-провокация", "JOIN — связи таблиц", "🔍 SQL-детектив (fun-day)", "ER-диаграммы (dbdiagram.io)", "CRUD + Telegram-бот с БД"],
      },
      {
        name: "Этап 2 · REST API",
        lessons: "Уроки 22–29",
        desc: "HTTP, GET/POST/PUT/DELETE, Flask и FastAPI. Аутентификация с хэшированием паролей. Полноценный API + Swagger + HTML-фронтенд. Чтение документации как отдельный навык.",
        highlight: "🎓 Конец Модуля 1: REST API с регистрацией → точка безопасного выхода",
        topics: ["HTTP, Postman, статус-коды", "Flask: первый сервер", "REST API: GET/POST + HTML", "PUT/DELETE + SQLite", "FastAPI + Swagger UI", "Хэширование паролей (bcrypt)", "📖 Документация без AI", "Demo-day #2"],
      },
    ],
  },
  {
    id: "m2",
    label: "Модуль 2",
    title: "DevOps + свой проект в интернете",
    lessons: "Уроки 30–52",
    weeks: "11 недель",
    result: "Свой REST API на Docker, в продакшене, по реальной ссылке в интернете",
    color: "from-indigo-500 to-purple-500",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    stages: [
      {
        name: "Этап 2 · Продвинутые навыки",
        lessons: "Уроки 30–37",
        desc: "ООП в Python (RPG-мини-игра как пример), внешние API (бот показывает погоду), тестирование через pytest, Docker, CI/CD на GitHub Actions, безопасность.",
        highlight: "💻 «История про $400» — реальная утечка API-ключа в GitHub",
        topics: ["ООП: классы + RPG-мини-игра", "Наследование (Warrior/Mage/Archer)", "Внешние API → бот с погодой", "pytest + Test Battle (8 багов)", "🐳 Docker: контейнеризация", "GitHub Actions: автотесты", "🔒 Безопасность + GitGuardian", "🎉 Мини-хакатон"],
      },
      {
        name: "Этап 3 · Свой проект",
        lessons: "Уроки 38–52",
        desc: "Финальный проект ученика + спикер ведёт пример TaskMaster. От ТЗ и ER-диаграммы до деплоя на Render. JWT-аутентификация, пагинация, docker-compose, mock-интервью.",
        highlight: "🏆 Защита БЕЗ AI: 7 мин + 5 вопросов от жюри",
        topics: [
          "Выбор темы + ТЗ (1 стр.)",
          "ER-диаграмма + API-контракт",
          "Спринт 1: SQLAlchemy + seed",
          "Спринт 2: CRUD endpoints",
          "Спринт 3: бизнес-логика + 🚀 уникальная фича",
          "🔧 Debug Championship + Code Review",
          "Mid-demo: проект на 50%",
          "Спринт 4: JWT-аутентификация",
          "Спринт 5: пагинация + CORS + logging",
          "Спринт 6: тесты + Bug Hunt",
          "🐳 docker-compose + 🚀 деплой на Render",
          "Swagger + README + портфолио-сайт",
          "Mock-интервью",
          "🏆 ФИНАЛЬНЫЙ DEMO-DAY",
        ],
      },
    ],
  },
];

const levels = [
  { emoji: "🤖", name: "Bot Maker", lessons: "1–6", desc: "Telegram-бот через AI, деплой 24/7" },
  { emoji: "🐍", name: "Python Coder", lessons: "7–13", desc: "Python сам, 5 фич бота, читает чужой код" },
  { emoji: "🗃", name: "Data Keeper", lessons: "14–21", desc: "Проектирует БД, SQL-детектив, CRUD" },
  { emoji: "🌐", name: "API Builder", lessons: "22–29", desc: "REST API + Swagger, читает документацию" },
  { emoji: "🛠", name: "DevOps Starter", lessons: "30–37", desc: "ООП, тесты, Docker, CI/CD, безопасность" },
  { emoji: "🏆", name: "Backend Pro", lessons: "38–52", desc: "Свой проект: ТЗ → деплой + debug + ревью" },
];

const aiProgression = [
  { stage: "Уроки 1–6", mode: "🟢 Генерирует", desc: "AI пишет код целиком. Wow-эффект, бот работает 24/7." },
  { stage: "Уроки 7–13", mode: "🟡 Объясняет", desc: "AI объясняет ошибки. Код пишет ученик. Контрольная — без AI." },
  { stage: "Уроки 14–21", mode: "🟡 + 🔥 Провокации", desc: "Спикер показывает ошибки AI: SQL injection, DELETE без WHERE." },
  { stage: "Уроки 22–29", mode: "🟠 Ревьюит", desc: "Код свой → AI делает ревью. Урок 28: AI ЗАКРЫТ, только docs." },
  { stage: "Уроки 30–37", mode: "🟠 + тесты", desc: "AI помогает с QA: генерация тестов, debug. Бизнес-логику — сам." },
  { stage: "Уроки 38–52", mode: "🔴 Ассистент", desc: "Только вопросы и debug. Защита БЕЗ AI." },
];

const portfolio = [
  { num: 1, name: "Telegram-бот 24/7", lesson: "Уроки 1–13", platform: "Vibe-coded + 5 фич Python" },
  { num: 2, name: "GameDB + SQL-детектив", lesson: "Уроки 14–21", platform: "SQLite + ER-диаграмма" },
  { num: 3, name: "Бот с настоящей БД", lesson: "Урок 20", platform: "Telegram + SQLite" },
  { num: 4, name: "REST API + Swagger", lesson: "Урок 29", platform: "Flask + HTML-фронтенд ⭐" },
  { num: 5, name: "API в Docker + CI/CD", lesson: "Урок 37", platform: "Docker + GitHub Actions" },
  { num: 6, name: "Портфолио + GitHub README", lesson: "Урок 49", platform: "Readme.so + сайт" },
  { num: 7, name: "Финальный API в интернете", lesson: "Урок 52", platform: "Render + docker-compose 🏆" },
];

const faqs = [
  {
    q: "Чем бэкенд отличается от фронтенда?",
    a: "Фронтенд — это витрина магазина: всё что пользователь видит и трогает (кнопки, формы, дизайн). Бэкенд — это склад, касса и охранник: где хранятся данные, кто проверяет пароли, кто отвечает за то, чтобы ничего не сломалось при 1000 пользователях. Без бэкенда витрина пустая. Бэкенд-разработчики обычно получают зарплату выше фронтенд-разработчиков (это более серьёзная инженерная работа).",
  },
  {
    q: "Какие реальные расходы помимо курса?",
    a: "Ноль. Полностью бесплатно. Python, VS Code, GitHub, PythonAnywhere (хостинг бота 24/7), Render (хостинг финального API), Docker — всё бесплатно. Все тренажёры (Питонтьютор, Снейк.про, SQL Academy, CodeCombat, Learn Git Branching) — на русском, бесплатные.",
  },
  {
    q: "Зачем боту работать 24/7? И где он работает?",
    a: "Это и есть «бэкенд» — приложение, работающее на сервере где-то в интернете (мы используем PythonAnywhere, бесплатный сервис для Python-проектов). Бот запущен там 24/7, и если в 3 часа ночи кто-то напишет — он ответит. Это первый момент, когда ребёнок понимает: «Моя программа работает в интернете, как настоящая. Не на моём ноутбуке».",
  },
  {
    q: "А если ребёнок никогда не программировал?",
    a: "Курс рассчитан с нуля. Первые 6 уроков — vibe-coding, ребёнок создаёт бота через ChatGPT, без знаний Python. Сначала видит «работает!» (wow-эффект), потом мы постепенно объясняем что происходит внутри. Это снимает страх и даёт мотивацию.",
  },
  {
    q: "Что если ребёнок не знает английского?",
    a: "Все тренажёры на русском: Питонтьютор, Снейк.про, SQL Academy, CodeCombat (русская версия), Learn Git Branching (русский), документация Flask. На уроке 28 мы отдельно учим читать английскую документацию — но к этому моменту ученик уже знает Python и понимает контекст.",
  },
  {
    q: "Что если ребёнок застрянет на сложном уроке?",
    a: "Каждое ДЗ имеет 2 уровня сложности. Уровень 1 — основное задание. Если не получается за 48ч — открывается Уровень 2: шаблоны кода, подсказки, каркас. Это не «облегчёнка», а scaffold для возвращения в строй. Куратор группы (1 на 10–15 учеников) отвечает на вопросы за 24ч, проверяет ДЗ за 48ч.",
  },
  {
    q: "Какие требования к компьютеру?",
    a: "Самые скромные. Любой ноутбук или ПК с 4 ГБ RAM и Windows / macOS / Linux. Python весит 50 МБ, VS Code — 200 МБ. В отличие от геймдева, никаких требований к видеокарте, RAM 16 ГБ или SSD. Бэкенд работает на серверах с 512 МБ RAM — этому учим.",
  },
  {
    q: "Сколько времени в неделю?",
    a: "2 урока в неделю, каждый ~2 часа: видео 20–25 мин + практика 40–60 мин + ДЗ 30–60 мин. Итого 4–5 часов в неделю. Куратор оперативно проверяет ДЗ и отвечает на вопросы.",
  },
  {
    q: "Можно ли остановиться после Модуля 1?",
    a: "Да. Модуль 1 (уроки 1–29) — самодостаточный: в конце ребёнок выпускает REST API с регистрацией и Swagger-документацией. Это «точка безопасного выхода». Если хочется в продакшен (Docker + CI/CD + деплой в интернет) — берём Модуль 2.",
  },
];

/* ============================================================
   ВСПОМОГАТЕЛЬНОЕ: анимации
   ============================================================ */

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 },
};

/* ============================================================
   ОСНОВНОЙ КОМПОНЕНТ
   ============================================================ */

export default function BackendCourse() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeModule, setActiveModule] = useState(0);

  return (
    <main className="bg-[#FFFBF5] text-[#0F0F1A]">
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden border-b border-[#0F0F1A]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/40 via-teal-100/30 to-indigo-100/40" />
        <div className="absolute top-10 right-10 text-[180px] opacity-10 select-none">🐍</div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#0F0F1A]/60 hover:text-[#FF6B47] transition mb-8">
            ← Все курсы
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F0F1A] text-white rounded-full text-sm font-medium mb-6">
              🐍 Бэкенд-разработка на Python
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
              Telegram-бот за 3 недели.<br />
              <span className="bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">
                REST API в интернете за 26.
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-[#0F0F1A]/70 max-w-3xl mb-10 leading-relaxed">
              За 26 недель ребёнок создаст <strong>5–7 проектов</strong>: Telegram-бот работающий 24/7, базу данных, REST API на FastAPI и финальный проект в продакшене на Docker — <strong>по реальной ссылке в интернете</strong>.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              {[
                { icon: "📅", text: "26 недель · 52 урока" },
                { icon: "🐍", text: "Python + Flask + FastAPI" },
                { icon: "🐳", text: "Docker + CI/CD" },
                { icon: "🔒", text: "JWT + bcrypt + БД" },
                { icon: "💰", text: "0 ₸ доп. расходов" },
              ].map((t) => (
                <span key={t.text} className="px-4 py-2 bg-white border border-[#0F0F1A]/10 rounded-full text-sm font-medium">
                  {t.icon} {t.text}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#apply" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FF6B47] text-white rounded-2xl font-semibold text-lg hover:bg-[#0F0F1A] transition shadow-lg shadow-emerald-100">
                Записаться на пробный урок →
              </a>
              <a href="#program" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#0F0F1A]/20 rounded-2xl font-semibold text-lg hover:bg-[#0F0F1A]/5 transition">
                Посмотреть программу
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────── ЧТО СОЗДАСТ РЕБЁНОК ───────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div {...fadeIn} className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Что ребёнок создаст</h2>
          <p className="text-lg text-[#0F0F1A]/60 max-w-2xl mx-auto">7 реальных проектов. Не учебные «примеры», а работающие приложения в интернете.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolio.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`p-6 rounded-2xl border ${
                p.num === 4 || p.num === 7 ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-500/30" : "bg-white border-[#0F0F1A]/10"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl font-bold text-emerald-600">#{p.num}</span>
                <span className="text-xs text-[#0F0F1A]/50">{p.lesson}</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{p.name}</h3>
              <p className="text-sm text-[#0F0F1A]/60">{p.platform}</p>
            </motion.div>
          ))}
        </div>

        <motion.p {...fadeIn} className="text-center mt-10 text-sm text-[#0F0F1A]/50">
          ⭐ — финальные проекты модулей, обязательная публикация
        </motion.p>
      </section>

      {/* ───────── ЧЕМ БЭКЕНД ОТЛИЧАЕТСЯ ───────── */}
      <section className="border-y border-[#0F0F1A]/10 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.div {...fadeIn} className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                Главный вопрос родителей
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">Чем бэкенд отличается от фронтенда?</h2>
              <p className="text-lg text-[#0F0F1A]/70 mb-6 leading-relaxed">
                <strong>Фронтенд</strong> — это витрина магазина: всё что пользователь видит и трогает.
              </p>
              <p className="text-lg text-[#0F0F1A]/70 mb-6 leading-relaxed">
                <strong>Бэкенд</strong> — это склад, касса и охранник: где хранятся данные, кто проверяет пароли, кто отвечает за работу при 1000 пользователях. <strong>Без бэкенда витрина пустая.</strong>
              </p>
              <p className="text-lg text-[#0F0F1A]/70 leading-relaxed">
                Бэкенд-разработчики обычно получают зарплату выше фронтенд-разработчиков — это более серьёзная инженерная работа с базами данных, безопасностью и серверами.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="text-sm text-[#0F0F1A]/50 mb-1">Реальные технологии в курсе</div>
                <div className="font-semibold">Python, Flask, FastAPI, SQLite, Docker — те же что в Yandex, Kaspi, inDriver</div>
              </div>
              <div className="p-5 bg-teal-50 rounded-2xl border border-teal-200">
                <div className="text-sm text-[#0F0F1A]/50 mb-1">Зарплаты в Казахстане</div>
                <div className="font-semibold">Junior backend: 350–500K ₸<br />Middle: 600K–1.2M ₸<br />Senior: 1.5M+ ₸</div>
              </div>
              <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-200">
                <div className="text-sm text-[#0F0F1A]/50 mb-1">Где работают</div>
                <div className="font-semibold">Везде где есть приложение: банки, такси, доставка, маркетплейсы, госсервисы.</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────── ПРОГРАММА (MODULES) ───────── */}
      <section id="program" className="max-w-6xl mx-auto px-6 py-20">
        <motion.div {...fadeIn} className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Программа курса</h2>
          <p className="text-lg text-[#0F0F1A]/60 max-w-2xl mx-auto">2 модуля по 25+ уроков. Модуль 1 самодостаточен: в конце — рабочий REST API с авторизацией.</p>
        </motion.div>

        {/* Module Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-2xl p-2 border border-[#0F0F1A]/10">
          {modules.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActiveModule(i)}
              className={`flex-1 px-4 py-3 rounded-xl text-sm lg:text-base font-medium transition ${
                activeModule === i ? "bg-[#0F0F1A] text-white" : "text-[#0F0F1A]/60 hover:bg-[#0F0F1A]/5"
              }`}
            >
              <div>{m.label}</div>
              <div className="text-xs opacity-70 mt-1">{m.lessons}</div>
            </button>
          ))}
        </div>

        {/* Active module */}
        <motion.div
          key={activeModule}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${modules[activeModule].bg} ${modules[activeModule].border} border rounded-3xl p-8 lg:p-12`}
        >
          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-3">{modules[activeModule].title}</h3>
            <div className="flex flex-wrap gap-4 text-sm text-[#0F0F1A]/60">
              <span>📅 {modules[activeModule].weeks}</span>
              <span>📚 {modules[activeModule].lessons}</span>
            </div>
            <div className="mt-4 p-4 bg-white rounded-2xl border border-[#0F0F1A]/10 inline-block">
              <span className="text-sm text-[#0F0F1A]/50">🎯 Результат: </span>
              <span className="font-semibold">{modules[activeModule].result}</span>
            </div>
          </div>

          <div className="space-y-4">
            {modules[activeModule].stages.map((s) => (
              <div key={s.name} className="bg-white rounded-2xl p-6 border border-[#0F0F1A]/10">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-2">
                      <h4 className="text-xl font-bold">{s.name}</h4>
                      <span className="text-xs text-[#0F0F1A]/40">{s.lessons}</span>
                    </div>
                    <p className="text-[#0F0F1A]/70 mb-3 leading-relaxed">{s.desc}</p>
                    <p className="text-sm font-medium text-emerald-600 mb-4">{s.highlight}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {s.topics.map((t) => (
                    <span key={t} className="px-3 py-1.5 bg-[#0F0F1A]/5 rounded-lg text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ───────── УРОВНИ И БЕЙДЖИ ───────── */}
      <section className="bg-[#0F0F1A] text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">6 уровней — 6 побед</h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">На каждом этапе ребёнок получает бейдж и сертификат. От Bot Maker до Backend Pro.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {levels.map((l, i) => (
              <motion.div
                key={l.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition"
              >
                <div className="text-4xl mb-3">{l.emoji}</div>
                <div className="text-xs text-white/40 mb-1">Уроки {l.lessons}</div>
                <h3 className="text-xl font-bold mb-2">{l.name}</h3>
                <p className="text-sm text-white/60">{l.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FUN-DAYS ───────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div {...fadeIn} className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Fun-day каждые 5–6 уроков</h2>
          <p className="text-lg text-[#0F0F1A]/60 max-w-2xl mx-auto">Серьёзный курс ≠ скучный курс. Между блоками — разгрузочные уроки с челленджами и играми.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { emoji: "🎮", name: "Python Battle", lesson: "Урок 12", desc: "Чтение open-source кода + соревнование на скорость" },
            { emoji: "🔍", name: "SQL-детектив", lesson: "Урок 18", desc: "Раскрыть кражу легендарного меча через 5 запросов" },
            { emoji: "📖", name: "Читаем документацию", lesson: "Урок 28", desc: "Подключить незнакомый API только через docs. БЕЗ AI" },
            { emoji: "🔧", name: "Debug Championship", lesson: "Урок 43", desc: "Починить 5 сломанных эндпоинтов через debugger" },
          ].map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 bg-white border border-[#0F0F1A]/10 rounded-2xl hover:shadow-lg transition"
            >
              <div className="text-4xl mb-3">{f.emoji}</div>
              <div className="text-xs text-[#0F0F1A]/50 mb-1">{f.lesson}</div>
              <h3 className="font-bold mb-2">{f.name}</h3>
              <p className="text-sm text-[#0F0F1A]/60 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────── AI-ПРОГРЕССИЯ ───────── */}
      <section className="border-y border-[#0F0F1A]/10 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.div {...fadeIn} className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">AI как инструмент,<br />не как замена</h2>
            <p className="text-lg text-[#0F0F1A]/60 max-w-2xl mx-auto">Чёткая прогрессия: от полной генерации до полной самостоятельности. Финальная защита — БЕЗ AI.</p>
          </motion.div>

          <div className="space-y-3 max-w-4xl mx-auto">
            {aiProgression.map((a, i) => (
              <motion.div
                key={a.stage}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex flex-col md:flex-row md:items-center gap-4 p-5 bg-[#FFFBF5] border border-[#0F0F1A]/10 rounded-2xl"
              >
                <div className="text-sm font-mono text-[#0F0F1A]/40 md:w-32 flex-shrink-0">{a.stage}</div>
                <div className="md:w-56 flex-shrink-0">
                  <span className="font-bold text-base">{a.mode}</span>
                </div>
                <p className="text-[#0F0F1A]/70 flex-1 text-sm">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── ИСТОРИЯ ПРО $400 ───────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div {...fadeIn} className="bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-200 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-8 items-center">
            <div className="text-9xl text-center">💸</div>
            <div>
              <span className="inline-block px-4 py-2 bg-white rounded-full text-sm font-medium mb-4">
                Урок 36 · Безопасность
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">«История про $400»</h2>
              <p className="text-lg text-[#0F0F1A]/70 leading-relaxed mb-4">
                Реальный кейс: программист случайно запушил API-ключ в публичный GitHub. Через 5 минут боты нашли ключ, начали слать запросы. Счёт за API — <strong>$400 за ночь</strong>.
              </p>
              <p className="text-lg text-[#0F0F1A]/70 leading-relaxed">
                Эту историю ребёнок услышит ОДИН раз. Запомнит на ВСЮ жизнь. После этого <code className="px-2 py-0.5 bg-[#0F0F1A] text-white rounded text-sm">.env</code> и <code className="px-2 py-0.5 bg-[#0F0F1A] text-white rounded text-sm">.gitignore</code> будут автоматически.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ───────── 2 УРОВНЯ ДЗ ───────── */}
      <section className="border-y border-[#0F0F1A]/10 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.div {...fadeIn} className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 grid gap-4">
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="text-3xl mb-3">📘</div>
                <h3 className="text-lg font-bold mb-2">Уровень 1 — основной</h3>
                <p className="text-sm text-[#0F0F1A]/70">Полноценное задание для среднего ученика. Открывается сразу после видеоурока.</p>
              </div>
              <div className="p-6 bg-teal-50 rounded-2xl border border-teal-200">
                <div className="text-3xl mb-3">📗</div>
                <h3 className="text-lg font-bold mb-2">Уровень 2 — поддерживающий</h3>
                <p className="text-sm text-[#0F0F1A]/70">Шаблоны кода, подсказки, каркас. Открывается через 48ч если первый не получается. Это не стыд — это путь дальше.</p>
              </div>
              <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-200">
                <div className="text-3xl mb-3">👨‍🏫</div>
                <h3 className="text-lg font-bold mb-2">Куратор группы</h3>
                <p className="text-sm text-[#0F0F1A]/70">1 куратор на 10–15 учеников. Отвечает на вопросы за 24ч, проверяет ДЗ за 48ч, при необходимости — личная помощь.</p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                Никто не застревает
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">2 уровня ДЗ + живой куратор</h2>
              <p className="text-lg text-[#0F0F1A]/70 mb-6 leading-relaxed">
                Если ребёнок застрял — это не его проблема, а наша. У каждого задания есть запасной путь. Если и он не получается — куратор помогает лично.
              </p>
              <p className="text-lg text-[#0F0F1A]/70 leading-relaxed">
                Отдельный фокус на навыки: <strong>debugging</strong> (VS Code debugger), <strong>чтение чужого кода</strong>, <strong>работа с документацией</strong>. Это 70% работы реального разработчика.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────── РАСХОДЫ — ВСЁ БЕСПЛАТНО ───────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div {...fadeIn} className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Все инструменты — <span className="text-emerald-600">бесплатные</span></h2>
          <p className="text-lg text-[#0F0F1A]/60 max-w-2xl mx-auto">В отличие от геймдева, никаких доп. расходов на магазины приложений. Всё что используется в курсе — 0 ₸.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { emoji: "🐍", name: "Python + VS Code", price: "Бесплатно", desc: "Установка за 15 минут на любой ОС" },
            { emoji: "🤖", name: "PythonAnywhere", price: "Бесплатно", desc: "Хостинг бота 24/7" },
            { emoji: "🐳", name: "Docker Desktop", price: "Бесплатно", desc: "Для домашнего использования" },
            { emoji: "🌐", name: "Render.com", price: "Бесплатно", desc: "Хостинг финального API в интернете" },
            { emoji: "📚", name: "Все тренажёры", price: "Бесплатно", desc: "Питонтьютор, SQL Academy, Codewars на русском" },
            { emoji: "🐙", name: "GitHub", price: "Бесплатно", desc: "Репозитории + GitHub Actions" },
          ].map((t) => (
            <div key={t.name} className="p-6 bg-white border border-[#0F0F1A]/10 rounded-2xl">
              <div className="text-3xl mb-3">{t.emoji}</div>
              <h3 className="font-bold mb-1">{t.name}</h3>
              <div className="text-emerald-600 font-bold mb-2">{t.price}</div>
              <p className="text-sm text-[#0F0F1A]/60">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── ПРЕПОДАВАТЕЛЬ ───────── */}
      <section className="bg-gradient-to-br from-emerald-50 via-teal-50 to-indigo-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn} className="grid lg:grid-cols-[1fr_2fr] gap-12 items-center">
            <div className="aspect-square bg-gradient-to-br from-emerald-200 to-indigo-200 rounded-3xl flex items-center justify-center text-9xl">
              👨‍💻
            </div>
            <div>
              <span className="inline-block px-4 py-2 bg-white rounded-full text-sm font-medium mb-4">
                Преподаватель
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">Имя Фамилия</h2>
              <p className="text-lg text-[#0F0F1A]/70 mb-6 leading-relaxed">
                Опытный Python-разработчик с production-проектами на Flask и FastAPI. На курсе ведёт сквозной пример TaskMaster — от ТЗ до деплоя на Render.com.
              </p>
              <div className="flex flex-wrap gap-3">
                {["5+ лет на Python", "Production-проекты", "Опыт обучения подростков", "Mentor 1-on-1"].map((t) => (
                  <span key={t} className="px-4 py-2 bg-white rounded-full text-sm font-medium border border-[#0F0F1A]/10">
                    ✓ {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────── СТОИМОСТЬ ───────── */}
      <section id="apply" className="max-w-6xl mx-auto px-6 py-20">
        <motion.div {...fadeIn} className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Стоимость</h2>
          <p className="text-lg text-[#0F0F1A]/60">Можно платить помесячно или сразу со скидкой</p>
        </motion.div>

        <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#0F0F1A] to-[#0F0F1A] text-white rounded-3xl p-10 lg:p-12">
          <div className="text-center mb-8">
            <div className="text-sm uppercase tracking-wider opacity-60 mb-3">Цена</div>
            <div className="flex items-baseline justify-center gap-3 flex-wrap mb-3">
              <span className="text-4xl lg:text-5xl font-bold">75 000 ₸</span>
              <span className="text-white/40 text-2xl">→</span>
              <span className="text-4xl lg:text-5xl font-bold text-[#FF6B47]">47 500 ₸</span>
            </div>
            <div className="text-white/60 text-sm">Первый месяц · со 2-го месяца при посещении всех 8 уроков</div>
          </div>

          <div className="space-y-3 mb-8">
            {[
              "✓ 52 урока по 2 часа",
              "✓ Куратор группы (1 на 10–15 чел)",
              "✓ Проверка ДЗ за 48ч",
              "✓ 4 demo-day + финальная защита",
              "✓ Сертификат + диплом",
              "✓ Можно прекратить в любой момент",
            ].map((t) => (
              <div key={t} className="text-white/90">{t}</div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            <div className="p-4 bg-[#FF6B47]/15 rounded-xl border border-[#FF6B47]/30">
              <div className="text-sm opacity-80 mb-1">Льготникам −20%</div>
              <div className="text-xl font-bold">60 000 ₸</div>
              <div className="text-xs opacity-60">первый месяц</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-sm opacity-60 mb-1">Kaspi-рассрочка</div>
              <div className="text-xl font-bold">0% · 3 или 6 мес</div>
              <div className="text-xs opacity-60">без переплаты</div>
            </div>
          </div>

          <button className="w-full py-4 bg-[#FF6B47] hover:bg-white hover:text-[#0F0F1A] rounded-2xl font-semibold text-lg transition">
            Записаться на пробный урок →
          </button>
          <p className="text-center text-sm text-white/50 mt-4">Пробный урок — бесплатно</p>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="bg-white border-t border-[#0F0F1A]/10 py-20">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2 {...fadeIn} className="text-4xl lg:text-5xl font-bold text-center mb-12">
            Частые вопросы
          </motion.h2>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="border border-[#0F0F1A]/10 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-[#0F0F1A]/5 transition"
                >
                  <span className="font-semibold text-lg">{f.q}</span>
                  <span className={`text-2xl transition ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-5 text-[#0F0F1A]/70 leading-relaxed"
                  >
                    {f.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── ФИНАЛЬНЫЙ CTA ───────── */}
      <section className="bg-[#0F0F1A] text-white py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2 {...fadeIn} className="text-4xl lg:text-5xl font-bold mb-4">
            Готовы начать?
          </motion.h2>
          <motion.p {...fadeIn} className="text-lg text-white/60 mb-8">
            Запишитесь на бесплатный пробный урок — посмотрим вместе подходит ли курс ребёнку.
          </motion.p>
          <motion.a {...fadeIn} href="#apply" className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6B47] hover:bg-white hover:text-[#0F0F1A] rounded-2xl font-semibold text-lg transition shadow-lg">
            Записаться на пробный урок →
          </motion.a>
        </div>
      </section>
    </main>
  );
}
