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
    title: "Основы геймдева",
    lessons: "Уроки 1–25",
    weeks: "12 недель",
    result: "Полноценный платформер на itch.io + 4 игры в портфолио",
    color: "from-rose-500 to-orange-500",
    bg: "bg-rose-50",
    border: "border-rose-200",
    stages: [
      {
        name: "Этап 1 · Vibe-coding",
        lessons: "Уроки 1–6",
        desc: "Первая игра через AI. Установка Unity, генерация кода через ChatGPT, кастомизация спрайтов, публикация на itch.io.",
        highlight: "🎮 Игра в браузере за 5 уроков → пришлёшь ссылку маме",
        topics: ["Установка Unity 6 + VS Code", "Vibe-coding через ChatGPT", "Замена спрайтов в Piskel", "Звуки, очки, Game Over", "Git + публикация на itch.io", "Demo-day #1"],
      },
      {
        name: "Этап 2 · C# с нуля",
        lessons: "Уроки 7–13",
        desc: "Переменные, условия, циклы, функции, массивы, компоненты Unity. Контрольная и игра Pong полностью без AI.",
        highlight: "💻 Урок 10: Pong на 100% своём коде — без подсказок ИИ",
        topics: ["Переменные + HP-система", "Циклы + волны врагов", "Функции + рефакторинг", "🎮 Pong БЕЗ AI", "Массивы + инвентарь", "Компоненты Unity", "Game Jam + контрольная"],
      },
      {
        name: "Этап 2 · 2D-движок",
        lessons: "Уроки 14–19",
        desc: "Физика Rigidbody2D, New Input System, коллайдеры, анимации Animator, Tilemap для уровней, AI врагов.",
        highlight: "🕹 Сквозной платформер растёт от урока к уроку",
        topics: ["Rigidbody2D + New Input System", "Collider2D + монеты/ловушки", "Animator + анимации", "Tilemap + Pixel Art", "Враги: патруль/преследование/атака", "Game Design Detective"],
      },
      {
        name: "Этап 2 · Механики",
        lessons: "Уроки 20–25",
        desc: "UI (Canvas, TextMeshPro), AudioMixer, переходы между уровнями (Coroutines), Cinemachine, сохранение через PlayerPrefs и JSON.",
        highlight: "🎓 Конец Модуля 1: полный платформер с 3+ уровнями на itch.io",
        topics: ["UI: меню + HUD + Pause", "Звук + AudioMixer", "Уровни + Coroutines", "Cinemachine + camera shake", "Сохранение (PlayerPrefs + JSON)", "Demo-day #2 + платформер"],
      },
    ],
  },
  {
    id: "m2",
    label: "Модуль 2",
    title: "Продвинутый геймдев + мобильная публикация",
    lessons: "Уроки 26–50",
    weeks: "13 недель",
    result: "Финальная игра на itch.io + Google Play + App Store + мультиплеер",
    color: "from-indigo-500 to-purple-500",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    stages: [
      {
        name: "Этап 2 · Продвинутый Unity",
        lessons: "Уроки 26–33",
        desc: "ООП (наследование, интерфейсы, события), Singleton, State Machine, Particle System, оптимизация через Object Pool и Profiler.",
        highlight: "⚡ Профессиональные паттерны — как в инди-студиях",
        topics: ["Наследование: BaseEnemy → Walker/Flyer", "Практика ООП на своём проекте", "Интерфейсы + события", "Singleton + State Machine", "Particle System + game feel", "Документация Unity без AI", "Profiler + Object Pool", "Мини-хакатон"],
      },
      {
        name: "Этап 3 · Свой проект",
        lessons: "Уроки 34–50",
        desc: "Финальная игра ученика + 2 жанра-примера от спикера (top-down шутер «NeonStrike» и roguelike «DungeonSlash»). Тач-управление, мультиплеер, деплой на 3 платформы.",
        highlight: "🏆 Защита БЕЗ AI: 7 мин + 5 вопросов от жюри",
        topics: [
          "Выбор жанра + Git-workflow",
          "GDD из 5 готовых шаблонов",
          "Прототип: персонаж + механики",
          "Враги + волны (баланс)",
          "Sprint Challenge + peer review",
          "Уровни + арт (Asset Store / Piskel)",
          "Mid-demo: проект на 50%",
          "СМЕНА ЖАНРА → DungeonSlash",
          "Game feel: shake, hitstop, particles",
          "📱 Тач-управление через New Input System",
          "🎮 Локальный мультиплеер (split-screen)",
          "Bug Hunt + плейтест",
          "📦 Экспорт: WebGL + Android APK + Google Play",
          "🎬 Трейлер + iOS-обзор",
          "🔒 Безопасность (GitGuardian) + QA",
          "Mock-интервью + полировка",
          "🏆 ФИНАЛЬНЫЙ DEMO-DAY",
        ],
      },
    ],
  },
];

const levels = [
  { emoji: "🎮", name: "Game Creator", lessons: "1–6", desc: "Первая игра через AI на itch.io" },
  { emoji: "💻", name: "C# Coder", lessons: "7–13", desc: "C# сам, HP, волны, Pong, инвентарь" },
  { emoji: "🕹", name: "2D Builder", lessons: "14–19", desc: "Rigidbody2D, анимации, Tilemap, враги" },
  { emoji: "🎨", name: "Level Designer", lessons: "20–25", desc: "UI, звук, уровни, сохранение → конец Модуля 1" },
  { emoji: "⚡", name: "Unity Developer", lessons: "26–33", desc: "ООП, паттерны, оптимизация" },
  { emoji: "🏆", name: "Game Developer", lessons: "34–50", desc: "Свой проект на 3 платформах + мультиплеер" },
];

const aiProgression = [
  { stage: "Уроки 1–6", mode: "🟢 Генерирует", desc: "AI пишет код. Wow-эффект, ученик публикует игру." },
  { stage: "Уроки 7–13", mode: "🟡 Объясняет", desc: "AI объясняет ошибки. Код — сам. Урок 10 — Pong БЕЗ AI." },
  { stage: "Уроки 14–25", mode: "🟠 Ревьюит", desc: "AI задаёт вопросы. Код — самостоятельно." },
  { stage: "Уроки 26–33", mode: "🟠 + тесты", desc: "AI помогает с ООП. Урок 31 — AI ЗАКРЫТ." },
  { stage: "Уроки 34–50", mode: "🔴 Ассистент", desc: "Только вопросы. Защита БЕЗ AI." },
];

const portfolio = [
  { num: 1, name: "Первая игра (vibe-coded)", lesson: "Урок 6", platform: "itch.io" },
  { num: 2, name: "Pong — без AI", lesson: "Урок 10", platform: "Свой код" },
  { num: 3, name: "Game Jam прототип", lesson: "Урок 13", platform: "Локально" },
  { num: 4, name: "Полноценный платформер", lesson: "Урок 25", platform: "itch.io ⭐" },
  { num: 5, name: "Хакатон-прототип", lesson: "Урок 33", platform: "Локально" },
  { num: 6, name: "Sprint Challenge", lesson: "Урок 38", platform: "Локально" },
  { num: 7, name: "Финальная игра", lesson: "Урок 50", platform: "itch.io + Google Play + App Store 🏆" },
];

const faqs = [
  {
    q: "Почему 2D, а не 3D?",
    a: "Фундамент одинаковый: физика, коллизии, AI, UI, анимации, паттерны — всё то же. Освоив 2D, переход в 3D займёт 2–3 недели. В 2D первая играбельная игра — за 3 недели, в 3D — через 2–3 месяца (моделирование, текстуры, освещение). Все инди-хиты — 2D: Celeste, Hollow Knight, Dead Cells, Balatro, Stardew Valley. Жанр живёт и процветает.",
  },
  {
    q: "Какие реальные расходы родителю помимо курса?",
    a: "Базовый вариант — 0 ₸. itch.io — бесплатно, можно публиковать сколько угодно игр. Google Play Console — $25 единоразово (можем использовать аккаунт школы на всю группу). Apple Developer — $99/год, опционально и только если есть Mac. Полноценный курс возможен без затрат — все навыки доступны.",
  },
  {
    q: "Нужен ли Mac для iOS?",
    a: "Для теста на своём iPhone — нет, достаточно бесплатного Apple ID. Для публикации в App Store — нужен Mac с Xcode. Без Mac есть бесплатная альтернатива: Unity Cloud Build делает iOS-сборку через сервис Unity. На уроке 47 разбираем оба варианта.",
  },
  {
    q: "Какие требования к компьютеру?",
    a: "Минимум: Windows 10 / macOS 12+, 8 ГБ RAM, 20 ГБ свободного места. Рекомендовано: Windows 11 / macOS 14+, 16 ГБ RAM, SSD. Если ПК слабее — есть «План Б»: ставим только 2D-модули Unity, отключаем Burst Compiler, играем с настройками качества. Курс адаптируется под почти любую конфигурацию.",
  },
  {
    q: "А что если ребёнок не знает английского?",
    a: "Все тренажёры подобраны на русском: Степик (C#), Metanit, CodeCombat (рус), Learn Git Branching (рус), документация Unity (docs.unity3d.com/ru), itProger. Английский требуется только в Asset Store на уровне «купить актив», но и там визуальный интерфейс.",
  },
  {
    q: "Что если ребёнок застрянет на сложном уроке?",
    a: "Действуют 3 уровня ДЗ. Уровень 1 — полноценное задание. Если не получается, через 48ч открывается Уровень 2: шаблоны, подсказки, каркас кода — но всё ещё с пониманием. Для самых сложных уроков (12, 26, 28, 29) — Уровень 3: готовый проект, в котором нужно изучить структуру, найти ключевую строку, поменять параметр. Никто не выпадает.",
  },
  {
    q: "Сколько времени в неделю?",
    a: "2 урока в неделю, каждый ~2–3 часа: видео 20 мин + практика 40–60 мин + ДЗ 30–60 мин. Итого 5–6 часов в неделю на курс. Плюс куратор проверяет ДЗ за 48ч, отвечает на вопросы за 24ч.",
  },
  {
    q: "Можно ли купить только Модуль 1?",
    a: "Да. Модуль 1 — самодостаточный: в конце ребёнок выпускает полноценный платформер на itch.io. Это «точка безопасного выхода». Если устал/нет интереса к мобильной публикации — можно остановиться. Если хочет Google Play и App Store — берём Модуль 2.",
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

export default function GameDevCourse() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeModule, setActiveModule] = useState(0);

  return (
    <main className="bg-[#FFFBF5] text-[#0F0F1A]">
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden border-b border-[#0F0F1A]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100/40 via-orange-100/30 to-purple-100/40" />
        <div className="absolute top-10 right-10 text-[180px] opacity-10 select-none">🎮</div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#0F0F1A]/60 hover:text-[#FF6B47] transition mb-8">
            ← Все курсы
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F0F1A] text-white rounded-full text-sm font-medium mb-6">
              🎮 Геймдев на Unity · 2D
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
              Создай свою игру.<br />
              <span className="bg-gradient-to-r from-[#FF6B47] to-purple-600 bg-clip-text text-transparent">
                Опубликуй на 3 платформах.
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-[#0F0F1A]/70 max-w-3xl mb-10 leading-relaxed">
              За 25 недель ребёнок создаст <strong>5–8 игр</strong> и финальную мультиплатформенную игру на <strong>itch.io, Google Play и App Store</strong>. С локальным мультиплеером и трейлером.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              {[
                { icon: "📅", text: "25 недель · 50 уроков" },
                { icon: "👨‍💻", text: "Unity 6 + C#" },
                { icon: "📱", text: "3 платформы" },
                { icon: "👥", text: "Мультиплеер" },
                { icon: "🎬", text: "Своя трейлер-сцена" },
              ].map((t) => (
                <span key={t.text} className="px-4 py-2 bg-white border border-[#0F0F1A]/10 rounded-full text-sm font-medium">
                  {t.icon} {t.text}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#apply" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FF6B47] text-white rounded-2xl font-semibold text-lg hover:bg-[#0F0F1A] transition shadow-lg shadow-rose-200">
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
          <p className="text-lg text-[#0F0F1A]/60 max-w-2xl mx-auto">7 игр в портфолио + финальный мультиплатформенный проект. Каждая игра — реальная, играбельная, по ссылке.</p>
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
                p.num === 4 || p.num === 7 ? "bg-gradient-to-br from-rose-50 to-orange-50 border-[#FF6B47]/30" : "bg-white border-[#0F0F1A]/10"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl font-bold text-[#FF6B47]">#{p.num}</span>
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

      {/* ───────── ПОЧЕМУ 2D ───────── */}
      <section className="border-y border-[#0F0F1A]/10 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.div {...fadeIn} className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                Главный вопрос родителей
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">Почему 2D, а не 3D?</h2>
              <p className="text-lg text-[#0F0F1A]/70 mb-6 leading-relaxed">
                Фундамент <strong>одинаковый</strong>: физика, коллизии, AI, UI, анимации, паттерны — всё то же в 2D и 3D. Освоив 2D, переход в 3D займёт 2–3 недели.
              </p>
              <p className="text-lg text-[#0F0F1A]/70 leading-relaxed">
                Главное отличие — <strong>скорость результата</strong>. В 2D играбельная игра — за 3 недели. В 3D первый результат — через 2–3 месяца (моделирование, текстуры, освещение). Мы хотим, чтобы ребёнок получил wow-эффект сразу.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200">
                <div className="text-sm text-[#0F0F1A]/50 mb-1">Инди-хиты на 2D</div>
                <div className="font-semibold">Celeste, Hollow Knight, Dead Cells,<br />Balatro, Animal Well, Stardew Valley</div>
              </div>
              <div className="p-5 bg-orange-50 rounded-2xl border border-orange-200">
                <div className="text-sm text-[#0F0F1A]/50 mb-1">Что дальше?</div>
                <div className="font-semibold">Курс «3D-геймдев» — как продолжение. Все навыки C#, ООП, паттерны переносятся 1:1.</div>
              </div>
              <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-200">
                <div className="text-sm text-[#0F0F1A]/50 mb-1">Технологии</div>
                <div className="font-semibold">Unity = 51% игр на Steam.<br />C# = топ-5 языков мира.</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────── ПРОГРАММА (MODULES) ───────── */}
      <section id="program" className="max-w-6xl mx-auto px-6 py-20">
        <motion.div {...fadeIn} className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Программа курса</h2>
          <p className="text-lg text-[#0F0F1A]/60 max-w-2xl mx-auto">2 модуля по 25 уроков. Каждый можно купить отдельно. Модуль 1 — самодостаточный.</p>
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
            {modules[activeModule].stages.map((s, i) => (
              <div key={s.name} className="bg-white rounded-2xl p-6 border border-[#0F0F1A]/10">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-2">
                      <h4 className="text-xl font-bold">{s.name}</h4>
                      <span className="text-xs text-[#0F0F1A]/40">{s.lessons}</span>
                    </div>
                    <p className="text-[#0F0F1A]/70 mb-3 leading-relaxed">{s.desc}</p>
                    <p className="text-sm font-medium text-[#FF6B47] mb-4">{s.highlight}</p>
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
            <p className="text-lg text-white/60 max-w-2xl mx-auto">На каждом этапе ребёнок получает бейдж и сертификат. Видимый прогресс мотивирует.</p>
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

      {/* ───────── AI-ПРОГРЕССИЯ ───────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div {...fadeIn} className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">AI как инструмент,<br />не как замена</h2>
          <p className="text-lg text-[#0F0F1A]/60 max-w-2xl mx-auto">Чёткая прогрессия: от полной генерации до полной самостоятельности. Финальная защита — БЕЗ AI.</p>
        </motion.div>

        <div className="space-y-3">
          {aiProgression.map((a, i) => (
            <motion.div
              key={a.stage}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col md:flex-row md:items-center gap-4 p-5 bg-white border border-[#0F0F1A]/10 rounded-2xl"
            >
              <div className="text-sm font-mono text-[#0F0F1A]/40 md:w-32 flex-shrink-0">{a.stage}</div>
              <div className="md:w-48 flex-shrink-0">
                <span className="font-bold text-lg">{a.mode}</span>
              </div>
              <p className="text-[#0F0F1A]/70 flex-1">{a.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────── 2 УРОВНЯ ДЗ ───────── */}
      <section className="border-y border-[#0F0F1A]/10 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.div {...fadeIn} className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 grid gap-4">
              <div className="p-6 bg-rose-50 rounded-2xl border border-rose-200">
                <div className="text-3xl mb-3">📘</div>
                <h3 className="text-lg font-bold mb-2">Уровень 1 — основной</h3>
                <p className="text-sm text-[#0F0F1A]/70">Полноценное задание для среднего ученика. Открывается сразу после видеоурока.</p>
              </div>
              <div className="p-6 bg-orange-50 rounded-2xl border border-orange-200">
                <div className="text-3xl mb-3">📗</div>
                <h3 className="text-lg font-bold mb-2">Уровень 2 — поддерживающий</h3>
                <p className="text-sm text-[#0F0F1A]/70">Шаблоны, подсказки, каркас кода. Открывается через 48ч, если первый не получается. Это не стыд — это путь дальше.</p>
              </div>
              <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-200">
                <div className="text-3xl mb-3">📕</div>
                <h3 className="text-lg font-bold mb-2">Уровень 3 — для самых сложных уроков</h3>
                <p className="text-sm text-[#0F0F1A]/70">Готовый проект для изучения. Найди ключевую строку, поменяй параметр, посмотри что произошло. Никто не выпадает.</p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="inline-block px-4 py-2 bg-rose-100 text-rose-700 rounded-full text-sm font-medium mb-4">
                Никто не застревает
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">3 уровня сложности на каждое ДЗ</h2>
              <p className="text-lg text-[#0F0F1A]/70 mb-6 leading-relaxed">
                Если ребёнок застрял — это не его проблема, а наша. У каждого задания есть запасной путь. И ещё один. И ещё.
              </p>
              <p className="text-lg text-[#0F0F1A]/70 leading-relaxed">
                Куратор группы (1 на 10–15 учеников) отвечает на вопросы за 24ч, проверяет ДЗ за 48ч, при необходимости — личная помощь.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────── РАСХОДЫ — ПРОЗРАЧНО ───────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div {...fadeIn} className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Прозрачные расходы</h2>
          <p className="text-lg text-[#0F0F1A]/60 max-w-2xl mx-auto">Полноценный курс возможен без дополнительных затрат. Если хочется в магазины — расходы минимальны.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="text-lg font-bold mb-1">itch.io</h3>
            <div className="text-2xl font-bold text-emerald-700 mb-2">Бесплатно</div>
            <p className="text-sm text-[#0F0F1A]/60">Все игры публикуются здесь по умолчанию. Платформа для инди-разработчиков.</p>
          </div>

          <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-lg font-bold mb-1">Google Play</h3>
            <div className="text-2xl font-bold text-amber-700 mb-2">$25 (~12 000 ₸)</div>
            <p className="text-sm text-[#0F0F1A]/60">Единоразовый платёж за аккаунт разработчика. Можем использовать аккаунт школы на всю группу.</p>
          </div>

          <div className="p-6 bg-rose-50 rounded-2xl border border-rose-200">
            <div className="text-3xl mb-3">🍎</div>
            <h3 className="text-lg font-bold mb-1">App Store</h3>
            <div className="text-2xl font-bold text-rose-700 mb-2">$99/год</div>
            <p className="text-sm text-[#0F0F1A]/60">Опционально. Тест на своём iPhone — бесплатно. Без Mac — Unity Cloud Build (тоже бесплатно).</p>
          </div>
        </div>
      </section>

      {/* ───────── ПРЕПОДАВАТЕЛЬ ───────── */}
      <section className="bg-gradient-to-br from-purple-50 via-rose-50 to-orange-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn} className="grid lg:grid-cols-[1fr_2fr] gap-12 items-center">
            <div className="aspect-square bg-gradient-to-br from-purple-200 to-rose-200 rounded-3xl flex items-center justify-center text-9xl">
              👨‍💻
            </div>
            <div>
              <span className="inline-block px-4 py-2 bg-white rounded-full text-sm font-medium mb-4">
                Преподаватель
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">Имя Фамилия</h2>
              <p className="text-lg text-[#0F0F1A]/70 mb-6 leading-relaxed">
                Опытный Unity-разработчик с публикациями в Google Play и App Store. Создаст вместе с учениками 2 жанра-эталона: top-down шутер «NeonStrike» и roguelike «DungeonSlash».
              </p>
              <div className="flex flex-wrap gap-3">
                {["5+ лет на Unity", "Опубликованные игры", "Опыт обучения подростков", "Mentor 1-on-1"].map((t) => (
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
              <span className="text-white/50 text-2xl">/ месяц</span>
            </div>
            <div className="text-white/60 text-sm">Одинаково весь период обучения · льготным категориям 60 000 ₸ · Kaspi-рассрочка 0%</div>
          </div>

          <div className="space-y-3 mb-8">
            {[
              "✓ 50 уроков по 2–3 часа",
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
              <div className="text-xs opacity-60">в месяц</div>
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
