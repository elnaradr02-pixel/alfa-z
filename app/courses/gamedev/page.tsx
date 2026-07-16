"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import CodeWindow from "@/app/components/CodeWindow";
import Icon from "@/app/components/Icon";
import LangSwitcher from "@/app/components/LangSwitcher";
import { useLang } from "@/app/i18n/lang";

/* ============================================================
   ДАННЫЕ КУРСА
   ============================================================ */

type Tr = (ru: string, kz: string, en: string) => string;

function makeModules(tr: Tr) {
  return [
  {
    id: "m1",
    label: tr("Модуль 1", "1-модуль", "Module 1"),
    title: tr("Основы геймдева", "Геймдев негіздері", "Game dev fundamentals"),
    lessons: tr("Уроки 1–25", "1–25 сабақтар", "Lessons 1–25"),
    weeks: tr("12 недель", "12 апта", "12 weeks"),
    result: tr("Полноценный платформер на itch.io + 4 игры в портфолио", "itch.io-дегі толыққанды платформер + портфолиода 4 ойын", "A full platformer on itch.io + 4 games in the portfolio"),
    color: "from-accent to-accent-soft",
    bg: "bg-accent/5",
    border: "border-accent/20",
    stages: [
      {
        name: tr("Этап 1 · Vibe-coding", "1-кезең · Vibe-coding", "Stage 1 · Vibe-coding"),
        lessons: tr("Уроки 1–6", "1–6 сабақтар", "Lessons 1–6"),
        desc: tr("Первая игра через AI. Установка Unity, генерация кода через ChatGPT, кастомизация спрайтов, публикация на itch.io.", "AI арқылы алғашқы ойын. Unity орнату, ChatGPT арқылы код генерациясы, спрайттарды кастомизациялау, itch.io-да жариялау.", "Your first game via AI. Installing Unity, generating code with ChatGPT, customizing sprites, publishing to itch.io."),
        highlight: tr("🎮 Игра в браузере за 5 уроков → пришлёшь ссылку маме", "🎮 5 сабақта браузердегі ойын → анаңа сілтеме жібересің", "🎮 A game in the browser in 5 lessons → send mom the link"),
        topics: [tr("Установка Unity 6 + VS Code", "Unity 6 + VS Code орнату", "Installing Unity 6 + VS Code"), tr("Vibe-coding через ChatGPT", "ChatGPT арқылы Vibe-coding", "Vibe-coding with ChatGPT"), tr("Замена спрайтов в Piskel", "Piskel-де спрайттарды ауыстыру", "Replacing sprites in Piskel"), tr("Звуки, очки, Game Over", "Дыбыстар, ұпайлар, Game Over", "Sounds, score, Game Over"), tr("Git + публикация на itch.io", "Git + itch.io-да жариялау", "Git + publishing to itch.io"), "Demo-day #1"],
      },
      {
        name: tr("Этап 2 · C# с нуля", "2-кезең · C# нөлден", "Stage 2 · C# from scratch"),
        lessons: tr("Уроки 7–13", "7–13 сабақтар", "Lessons 7–13"),
        desc: tr("Переменные, условия, циклы, функции, массивы, компоненты Unity. Контрольная и игра Pong полностью без AI.", "Айнымалылар, шарттар, циклдар, функциялар, массивтер, Unity компоненттері. Бақылау және Pong ойыны толығымен AI-сыз.", "Variables, conditions, loops, functions, arrays, Unity components. A test and the Pong game fully without AI."),
        highlight: tr("💻 Урок 10: Pong на 100% своём коде — без подсказок ИИ", "💻 10-сабақ: 100% өз кодыңдағы Pong — AI кеңесінсіз", "💻 Lesson 10: Pong on 100% your own code — no AI hints"),
        topics: [tr("Переменные + HP-система", "Айнымалылар + HP-жүйе", "Variables + HP system"), tr("Циклы + волны врагов", "Циклдар + жау толқындары", "Loops + enemy waves"), tr("Функции + рефакторинг", "Функциялар + рефакторинг", "Functions + refactoring"), tr("🎮 Pong БЕЗ AI", "🎮 AI-СЫЗ Pong", "🎮 Pong WITHOUT AI"), tr("Массивы + инвентарь", "Массивтер + инвентарь", "Arrays + inventory"), tr("Компоненты Unity", "Unity компоненттері", "Unity components"), tr("Game Jam + контрольная", "Game Jam + бақылау", "Game Jam + a test")],
      },
      {
        name: tr("Этап 2 · 2D-движок", "2-кезең · 2D-қозғалтқыш", "Stage 2 · 2D engine"),
        lessons: tr("Уроки 14–19", "14–19 сабақтар", "Lessons 14–19"),
        desc: tr("Физика Rigidbody2D, New Input System, коллайдеры, анимации Animator, Tilemap для уровней, AI врагов.", "Rigidbody2D физикасы, New Input System, коллайдерлер, Animator анимациялары, деңгейлерге арналған Tilemap, жаулардың AI-ы.", "Rigidbody2D physics, New Input System, colliders, Animator animations, Tilemap for levels, enemy AI."),
        highlight: tr("🕹 Сквозной платформер растёт от урока к уроку", "🕹 Тұтас платформер сабақтан сабаққа өседі", "🕹 A continuous platformer grows lesson by lesson"),
        topics: ["Rigidbody2D + New Input System", tr("Collider2D + монеты/ловушки", "Collider2D + монеталар/қақпандар", "Collider2D + coins/traps"), tr("Animator + анимации", "Animator + анимациялар", "Animator + animations"), "Tilemap + Pixel Art", tr("Враги: патруль/преследование/атака", "Жаулар: патруль/қуу/шабуыл", "Enemies: patrol/chase/attack"), "Game Design Detective"],
      },
      {
        name: tr("Этап 2 · Механики", "2-кезең · Механикалар", "Stage 2 · Mechanics"),
        lessons: tr("Уроки 20–25", "20–25 сабақтар", "Lessons 20–25"),
        desc: tr("UI (Canvas, TextMeshPro), AudioMixer, переходы между уровнями (Coroutines), Cinemachine, сохранение через PlayerPrefs и JSON.", "UI (Canvas, TextMeshPro), AudioMixer, деңгейлер арасындағы ауысулар (Coroutines), Cinemachine, PlayerPrefs пен JSON арқылы сақтау.", "UI (Canvas, TextMeshPro), AudioMixer, level transitions (Coroutines), Cinemachine, saving via PlayerPrefs and JSON."),
        highlight: tr("🎓 Конец Модуля 1: полный платформер с 3+ уровнями на itch.io", "🎓 1-модуль соңы: itch.io-да 3+ деңгейлі толық платформер", "🎓 End of Module 1: a full platformer with 3+ levels on itch.io"),
        topics: [tr("UI: меню + HUD + Pause", "UI: мәзір + HUD + Pause", "UI: menu + HUD + Pause"), tr("Звук + AudioMixer", "Дыбыс + AudioMixer", "Sound + AudioMixer"), tr("Уровни + Coroutines", "Деңгейлер + Coroutines", "Levels + Coroutines"), "Cinemachine + camera shake", tr("Сохранение (PlayerPrefs + JSON)", "Сақтау (PlayerPrefs + JSON)", "Saving (PlayerPrefs + JSON)"), tr("Demo-day #2 + платформер", "Demo-day #2 + платформер", "Demo-day #2 + platformer")],
      },
    ],
  },
  {
    id: "m2",
    label: tr("Модуль 2", "2-модуль", "Module 2"),
    title: tr("Продвинутый геймдев + мобильная публикация", "Кеңейтілген геймдев + мобильді жариялау", "Advanced game dev + mobile publishing"),
    lessons: tr("Уроки 26–50", "26–50 сабақтар", "Lessons 26–50"),
    weeks: tr("13 недель", "13 апта", "13 weeks"),
    result: tr("Финальная игра на itch.io + Google Play + App Store + мультиплеер", "itch.io + Google Play + App Store-дағы финалдық ойын + мультиплеер", "A final game on itch.io + Google Play + App Store + multiplayer"),
    color: "from-accent-3 to-accent-3",
    bg: "bg-accent-3/8",
    border: "border-accent-3/20",
    stages: [
      {
        name: tr("Этап 2 · Продвинутый Unity", "2-кезең · Кеңейтілген Unity", "Stage 2 · Advanced Unity"),
        lessons: tr("Уроки 26–33", "26–33 сабақтар", "Lessons 26–33"),
        desc: tr("ООП (наследование, интерфейсы, события), Singleton, State Machine, Particle System, оптимизация через Object Pool и Profiler.", "ООП (мұрагерлік, интерфейстер, оқиғалар), Singleton, State Machine, Particle System, Object Pool пен Profiler арқылы оптимизация.", "OOP (inheritance, interfaces, events), Singleton, State Machine, Particle System, optimization via Object Pool and Profiler."),
        highlight: tr("⚡ Профессиональные паттерны — как в инди-студиях", "⚡ Кәсіби паттерндер — инди-студиялардағыдай", "⚡ Professional patterns — like in indie studios"),
        topics: [tr("Наследование: BaseEnemy → Walker/Flyer", "Мұрагерлік: BaseEnemy → Walker/Flyer", "Inheritance: BaseEnemy → Walker/Flyer"), tr("Практика ООП на своём проекте", "Өз жобаңдағы ООП тәжірибесі", "OOP practice on your own project"), tr("Интерфейсы + события", "Интерфейстер + оқиғалар", "Interfaces + events"), "Singleton + State Machine", "Particle System + game feel", tr("Документация Unity без AI", "AI-сыз Unity құжаттамасы", "Unity docs without AI"), "Profiler + Object Pool", tr("Мини-хакатон", "Мини-хакатон", "Mini-hackathon")],
      },
      {
        name: tr("Этап 3 · Свой проект", "3-кезең · Өз жобаң", "Stage 3 · Your own project"),
        lessons: tr("Уроки 34–50", "34–50 сабақтар", "Lessons 34–50"),
        desc: tr("Финальная игра ученика + 2 жанра-примера от спикера (top-down шутер «NeonStrike» и roguelike «DungeonSlash»). Тач-управление, мультиплеер, деплой на 3 платформы.", "Оқушының финалдық ойыны + спикерден 2 жанр-мысал (top-down шутер «NeonStrike» және roguelike «DungeonSlash»). Тач-басқару, мультиплеер, 3 платформаға деплой.", "The student's final game + 2 example genres from the speaker (top-down shooter 'NeonStrike' and roguelike 'DungeonSlash'). Touch controls, multiplayer, deploy to 3 platforms."),
        highlight: tr("🏆 Защита БЕЗ AI: 7 мин + 5 вопросов от жюри", "🏆 AI-СЫЗ қорғау: 7 мин + қазылардан 5 сұрақ", "🏆 Defense WITHOUT AI: 7 min + 5 questions from the jury"),
        topics: [
          tr("Выбор жанра + Git-workflow", "Жанр таңдау + Git-workflow", "Choosing a genre + Git workflow"),
          tr("GDD из 5 готовых шаблонов", "5 дайын үлгіден GDD", "A GDD from 5 ready templates"),
          tr("Прототип: персонаж + механики", "Прототип: кейіпкер + механикалар", "Prototype: character + mechanics"),
          tr("Враги + волны (баланс)", "Жаулар + толқындар (баланс)", "Enemies + waves (balance)"),
          "Sprint Challenge + peer review",
          tr("Уровни + арт (Asset Store / Piskel)", "Деңгейлер + арт (Asset Store / Piskel)", "Levels + art (Asset Store / Piskel)"),
          tr("Mid-demo: проект на 50%", "Mid-demo: жоба 50%-да", "Mid-demo: project at 50%"),
          tr("СМЕНА ЖАНРА → DungeonSlash", "ЖАНР АУЫСУЫ → DungeonSlash", "GENRE SWITCH → DungeonSlash"),
          "Game feel: shake, hitstop, particles",
          tr("📱 Тач-управление через New Input System", "📱 New Input System арқылы тач-басқару", "📱 Touch controls via New Input System"),
          tr("🎮 Локальный мультиплеер (split-screen)", "🎮 Жергілікті мультиплеер (split-screen)", "🎮 Local multiplayer (split-screen)"),
          tr("Bug Hunt + плейтест", "Bug Hunt + плейтест", "Bug Hunt + playtest"),
          tr("📦 Экспорт: WebGL + Android APK + Google Play", "📦 Экспорт: WebGL + Android APK + Google Play", "📦 Export: WebGL + Android APK + Google Play"),
          tr("🎬 Трейлер + iOS-обзор", "🎬 Трейлер + iOS-шолу", "🎬 Trailer + iOS review"),
          tr("🔒 Безопасность (GitGuardian) + QA", "🔒 Қауіпсіздік (GitGuardian) + QA", "🔒 Security (GitGuardian) + QA"),
          tr("Mock-интервью + полировка", "Mock-сұхбат + жылтырату", "Mock interview + polish"),
          tr("🏆 ФИНАЛЬНЫЙ DEMO-DAY", "🏆 ФИНАЛДЫҚ DEMO-DAY", "🏆 FINAL DEMO-DAY"),
        ],
      },
    ],
  },
  ];
}

function makeLevels(tr: Tr) {
  return [
  { icon: "rocket" as const, name: "Game Creator", lessons: "1–6", desc: tr("Первая игра через AI на itch.io", "itch.io-да AI арқылы алғашқы ойын", "First game via AI on itch.io") },
  { icon: "code" as const, name: "C# Coder", lessons: "7–13", desc: tr("C# сам, HP, волны, Pong, инвентарь", "C# өзің, HP, толқындар, Pong, инвентарь", "C# yourself, HP, waves, Pong, inventory") },
  { icon: "gamepad" as const, name: "2D Builder", lessons: "14–19", desc: tr("Rigidbody2D, анимации, Tilemap, враги", "Rigidbody2D, анимациялар, Tilemap, жаулар", "Rigidbody2D, animations, Tilemap, enemies") },
  { icon: "palette" as const, name: "Level Designer", lessons: "20–25", desc: tr("UI, звук, уровни, сохранение → конец Модуля 1", "UI, дыбыс, деңгейлер, сақтау → 1-модуль соңы", "UI, sound, levels, saving → end of Module 1") },
  { icon: "zap" as const, name: "Unity Developer", lessons: "26–33", desc: tr("ООП, паттерны, оптимизация", "ООП, паттерндер, оптимизация", "OOP, patterns, optimization") },
  { icon: "award" as const, name: "Game Developer", lessons: "34–50", desc: tr("Свой проект на 3 платформах + мультиплеер", "3 платформадағы өз жобаң + мультиплеер", "Your own project on 3 platforms + multiplayer") },
  ];
}

function makeAiProgression(tr: Tr) {
  return [
  { stage: tr("Уроки 1–6", "1–6 сабақтар", "Lessons 1–6"), mode: tr("🟢 Генерирует", "🟢 Генерациялайды", "🟢 Generates"), desc: tr("AI пишет код. Wow-эффект, ученик публикует игру.", "AI код жазады. Wow-әсер, оқушы ойынды жариялайды.", "AI writes the code. The wow-effect, the student publishes a game.") },
  { stage: tr("Уроки 7–13", "7–13 сабақтар", "Lessons 7–13"), mode: tr("🟡 Объясняет", "🟡 Түсіндіреді", "🟡 Explains"), desc: tr("AI объясняет ошибки. Код — сам. Урок 10 — Pong БЕЗ AI.", "AI қателерді түсіндіреді. Код — өзің. 10-сабақ — AI-СЫЗ Pong.", "AI explains mistakes. The code is yours. Lesson 10 — Pong WITHOUT AI.") },
  { stage: tr("Уроки 14–25", "14–25 сабақтар", "Lessons 14–25"), mode: tr("🟠 Ревьюит", "🟠 Ревью жасайды", "🟠 Reviews"), desc: tr("AI задаёт вопросы. Код — самостоятельно.", "AI сұрақ қояды. Код — өз бетіңше.", "AI asks questions. The code is done on your own.") },
  { stage: tr("Уроки 26–33", "26–33 сабақтар", "Lessons 26–33"), mode: tr("🟠 + тесты", "🟠 + тесттер", "🟠 + tests"), desc: tr("AI помогает с ООП. Урок 31 — AI ЗАКРЫТ.", "AI ООП-пен көмектеседі. 31-сабақ — AI ЖАБЫҚ.", "AI helps with OOP. Lesson 31 — AI is CLOSED.") },
  { stage: tr("Уроки 34–50", "34–50 сабақтар", "Lessons 34–50"), mode: tr("🔴 Ассистент", "🔴 Ассистент", "🔴 Assistant"), desc: tr("Только вопросы. Защита БЕЗ AI.", "Тек сұрақтар. AI-СЫЗ қорғау.", "Questions only. Defense WITHOUT AI.") },
  ];
}

function makePortfolio(tr: Tr) {
  return [
  { num: 1, name: tr("Первая игра (vibe-coded)", "Алғашқы ойын (vibe-coded)", "First game (vibe-coded)"), lesson: tr("Урок 6", "6-сабақ", "Lesson 6"), platform: "itch.io" },
  { num: 2, name: tr("Pong — без AI", "Pong — AI-сыз", "Pong — without AI"), lesson: tr("Урок 10", "10-сабақ", "Lesson 10"), platform: tr("Свой код", "Өз коды", "Own code") },
  { num: 3, name: tr("Game Jam прототип", "Game Jam прототипі", "Game Jam prototype"), lesson: tr("Урок 13", "13-сабақ", "Lesson 13"), platform: tr("Локально", "Жергілікті", "Locally") },
  { num: 4, name: tr("Полноценный платформер", "Толыққанды платформер", "A full platformer"), lesson: tr("Урок 25", "25-сабақ", "Lesson 25"), platform: "itch.io ⭐" },
  { num: 5, name: tr("Хакатон-прототип", "Хакатон-прототип", "Hackathon prototype"), lesson: tr("Урок 33", "33-сабақ", "Lesson 33"), platform: tr("Локально", "Жергілікті", "Locally") },
  { num: 6, name: "Sprint Challenge", lesson: tr("Урок 38", "38-сабақ", "Lesson 38"), platform: tr("Локально", "Жергілікті", "Locally") },
  { num: 7, name: tr("Финальная игра", "Финалдық ойын", "Final game"), lesson: tr("Урок 50", "50-сабақ", "Lesson 50"), platform: "itch.io + Google Play + App Store 🏆" },
  ];
}

function makeFaqs(tr: Tr) {
  return [
  {
    q: tr("Почему 2D, а не 3D?", "Неге 2D, 3D емес?", "Why 2D, not 3D?"),
    a: tr("Фундамент одинаковый: физика, коллизии, AI, UI, анимации, паттерны — всё то же. Освоив 2D, переход в 3D займёт 2–3 недели. В 2D первая играбельная игра — за 3 недели, в 3D — через 2–3 месяца (моделирование, текстуры, освещение). Все инди-хиты — 2D: Celeste, Hollow Knight, Dead Cells, Balatro, Stardew Valley. Жанр живёт и процветает.", "Іргетас бірдей: физика, коллизиялар, AI, UI, анимациялар, паттерндер — бәрі сол. 2D-ні меңгерген соң 3D-ге көшу 2–3 аптаға созылады. 2D-де алғашқы ойналатын ойын — 3 аптада, 3D-де — 2–3 айдан кейін (модельдеу, текстуралар, жарық). Барлық инди-хиттер — 2D: Celeste, Hollow Knight, Dead Cells, Balatro, Stardew Valley. Жанр өмір сүріп, гүлденіп жатыр.", "The foundation is the same: physics, collisions, AI, UI, animations, patterns — all the same. Once you master 2D, moving to 3D takes 2–3 weeks. In 2D the first playable game takes 3 weeks; in 3D — 2–3 months (modeling, textures, lighting). All indie hits are 2D: Celeste, Hollow Knight, Dead Cells, Balatro, Stardew Valley. The genre is alive and thriving."),
  },
  {
    q: tr("Какие реальные расходы родителю помимо курса?", "Курстан бөлек ата-анаға нақты қандай шығындар?", "What real costs does a parent have besides the course?"),
    a: tr("Базовый вариант — 0 ₸. itch.io — бесплатно, можно публиковать сколько угодно игр. Google Play Console — $25 единоразово (можем использовать аккаунт школы на всю группу). Apple Developer — $99/год, опционально и только если есть Mac. Полноценный курс возможен без затрат — все навыки доступны.", "Базалық нұсқа — 0 ₸. itch.io — тегін, қалағаныңша ойын жариялауға болады. Google Play Console — $25 бір рет (бүкіл топқа мектеп аккаунтын пайдалана аламыз). Apple Developer — $99/жыл, опционалды және тек Mac болса ғана. Толыққанды курс шығынсыз мүмкін — барлық дағдылар қолжетімді.", "The basic option is 0 ₸. itch.io is free — you can publish as many games as you like. Google Play Console — $25 one-time (we can use the school's account for the whole group). Apple Developer — $99/year, optional and only if you have a Mac. A full course is possible with no costs — all skills are available."),
  },
  {
    q: tr("Нужен ли Mac для iOS?", "iOS үшін Mac керек пе?", "Do you need a Mac for iOS?"),
    a: tr("Для теста на своём iPhone — нет, достаточно бесплатного Apple ID. Для публикации в App Store — нужен Mac с Xcode. Без Mac есть бесплатная альтернатива: Unity Cloud Build делает iOS-сборку через сервис Unity. На уроке 47 разбираем оба варианта.", "Өз iPhone-да тексеру үшін — жоқ, тегін Apple ID жеткілікті. App Store-да жариялау үшін — Xcode бар Mac қажет. Mac-сыз тегін балама бар: Unity Cloud Build Unity сервисі арқылы iOS-жинақ жасайды. 47-сабақта екі нұсқаны да талдаймыз.", "For testing on your own iPhone — no, a free Apple ID is enough. To publish to the App Store you need a Mac with Xcode. Without a Mac there's a free alternative: Unity Cloud Build makes the iOS build through the Unity service. In lesson 47 we cover both options."),
  },
  {
    q: tr("Какие требования к компьютеру?", "Компьютерге қандай талаптар?", "What are the computer requirements?"),
    a: tr("Минимум: Windows 10 / macOS 12+, 8 ГБ RAM, 20 ГБ свободного места. Рекомендовано: Windows 11 / macOS 14+, 16 ГБ RAM, SSD. Если ПК слабее — есть «План Б»: ставим только 2D-модули Unity, отключаем Burst Compiler, играем с настройками качества. Курс адаптируется под почти любую конфигурацию.", "Минимум: Windows 10 / macOS 12+, 8 ГБ RAM, 20 ГБ бос орын. Ұсынылады: Windows 11 / macOS 14+, 16 ГБ RAM, SSD. Егер ПК әлсіздеу болса — «Б жоспары» бар: тек Unity-дің 2D-модульдерін орнатамыз, Burst Compiler-ды өшіреміз, сапа баптауларымен ойнаймыз. Курс кез келген дерлік конфигурацияға бейімделеді.", "Minimum: Windows 10 / macOS 12+, 8 GB RAM, 20 GB free space. Recommended: Windows 11 / macOS 14+, 16 GB RAM, SSD. If the PC is weaker there's a 'Plan B': we install only Unity's 2D modules, disable the Burst Compiler, and adjust quality settings. The course adapts to almost any configuration."),
  },
  {
    q: tr("А что если ребёнок не знает английского?", "Ал бала ағылшын тілін білмесе ше?", "What if the child doesn't know English?"),
    a: tr("Все тренажёры подобраны на русском: Степик (C#), Metanit, CodeCombat (рус), Learn Git Branching (рус), документация Unity (docs.unity3d.com/ru), itProger. Английский требуется только в Asset Store на уровне «купить актив», но и там визуальный интерфейс.", "Барлық тренажёрлар орыс тілінде таңдалған: Степик (C#), Metanit, CodeCombat (орыс), Learn Git Branching (орыс), Unity құжаттамасы (docs.unity3d.com/ru), itProger. Ағылшын тілі тек Asset Store-да «актив сатып алу» деңгейінде қажет, бірақ онда да визуалды интерфейс.", "All trainers are chosen in Russian: Stepik (C#), Metanit, CodeCombat (RU), Learn Git Branching (RU), Unity docs (docs.unity3d.com/ru), itProger. English is only needed in the Asset Store at the 'buy an asset' level, and even there the interface is visual."),
  },
  {
    q: tr("Что если ребёнок застрянет на сложном уроке?", "Бала қиын сабақта тұрып қалса ше?", "What if the child gets stuck on a hard lesson?"),
    a: tr("Действуют 3 уровня ДЗ. Уровень 1 — полноценное задание. Если не получается, через 48ч открывается Уровень 2: шаблоны, подсказки, каркас кода — но всё ещё с пониманием. Для самых сложных уроков (12, 26, 28, 29) — Уровень 3: готовый проект, в котором нужно изучить структуру, найти ключевую строку, поменять параметр. Никто не выпадает.", "3 деңгейлі үй тапсырмасы жұмыс істейді. 1-деңгей — толыққанды тапсырма. Шықпаса, 48 сағаттан кейін 2-деңгей ашылады: үлгілер, кеңестер, код қаңқасы — бірақ бәрібір түсінумен. Ең қиын сабақтарға (12, 26, 28, 29) — 3-деңгей: дайын жоба, онда құрылымды зерттеп, кілт жолды тауып, параметрді өзгерту керек. Ешкім қалып қоймайды.", "There are 3 homework levels. Level 1 is a full task. If it doesn't work out, after 48h Level 2 opens: templates, hints, a code skeleton — but still with understanding. For the hardest lessons (12, 26, 28, 29) there's Level 3: a ready project where you study the structure, find the key line, and change a parameter. No one gets left behind."),
  },
  {
    q: tr("Сколько времени в неделю?", "Аптасына қанша уақыт?", "How much time per week?"),
    a: tr("2 урока в неделю, каждый ~2–3 часа: видео 20 мин + практика 40–60 мин + ДЗ 30–60 мин. Итого 5–6 часов в неделю на курс. Плюс куратор проверяет ДЗ за 48ч, отвечает на вопросы за 24ч.", "Аптасына 2 сабақ, әрқайсысы ~2–3 сағат: видео 20 мин + тәжірибе 40–60 мин + үй тапсырмасы 30–60 мин. Барлығы аптасына 5–6 сағат курсқа. Оған қоса куратор үй тапсырмасын 48 сағатта тексереді, сұрақтарға 24 сағатта жауап береді.", "2 lessons a week, each ~2–3 hours: 20 min video + 40–60 min practice + 30–60 min homework. In total 5–6 hours a week for the course. Plus a curator checks homework within 48h and answers questions within 24h."),
  },
  {
    q: tr("Можно ли купить только Модуль 1?", "Тек 1-модульді сатып алуға бола ма?", "Can I buy only Module 1?"),
    a: tr("Да. Модуль 1 — самодостаточный: в конце ребёнок выпускает полноценный платформер на itch.io. Это «точка безопасного выхода». Если устал/нет интереса к мобильной публикации — можно остановиться. Если хочет Google Play и App Store — берём Модуль 2.", "Иә. 1-модуль өзін-өзі қамтамасыз етеді: соңында бала itch.io-да толыққанды платформер шығарады. Бұл «қауіпсіз шығу нүктесі». Егер шаршаса/мобильді жариялауға қызығушылығы болмаса — тоқтауға болады. Егер Google Play мен App Store қаласа — 2-модульді аламыз.", "Yes. Module 1 is self-contained: at the end the child ships a full platformer on itch.io. This is a 'safe exit point'. If they're tired or not interested in mobile publishing, they can stop. If they want Google Play and the App Store, we take Module 2."),
  },
  ];
}

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
  const { tr } = useLang();
  const modules = makeModules(tr);
  const levels = makeLevels(tr);
  const aiProgression = makeAiProgression(tr);
  const portfolio = makePortfolio(tr);
  const faqs = makeFaqs(tr);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeModule, setActiveModule] = useState(0);

  return (
    <main className="bg-background text-foreground">
      {/* ───────── ШАПКА ───────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white font-display font-bold text-lg shadow-lg shadow-accent/30">Az</div>
            <span className="font-display font-bold text-xl tracking-tight">Alfa Z</span>
          </Link>
          <ul className="hidden lg:flex items-center gap-8 text-sm font-medium text-foreground/70">
            <li><a href="/#courses" className="hover:text-foreground transition-colors">{tr("Все курсы", "Барлық курстар", "All courses")}</a></li>
            <li><a href="/#pricing" className="hover:text-foreground transition-colors">{tr("Цены", "Бағалар", "Pricing")}</a></li>
            <li><a href="/#schedule" className="hover:text-foreground transition-colors">{tr("Расписание", "Кесте", "Schedule")}</a></li>
            <li><a href="/#reviews" className="hover:text-foreground transition-colors">{tr("Отзывы", "Пікірлер", "Reviews")}</a></li>
          </ul>
          <div className="flex items-center gap-3">
            <LangSwitcher className="hidden sm:inline-flex" />
            <a href="#apply" className="px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-all hover:scale-[1.03] shadow-md shadow-accent/20 whitespace-nowrap">
              {tr("Пробный урок", "Сынақ сабақ", "Free trial")}
            </a>
          </div>
        </nav>
      </header>

      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/12 via-accent-soft/10 to-accent-3/12" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-accent transition mb-8">
            ← {tr("Все курсы", "Барлық курстар", "All courses")}
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="font-mono text-xs sm:text-sm text-accent tracking-wider mb-3">~/courses/gamedev $ ./play</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-ink-1 text-white rounded-full text-sm font-medium mb-6">
              <Icon name="gamepad" className="h-4 w-4" /> {tr("Геймдев на Unity · 2D", "Unity-де геймдев · 2D", "Game dev on Unity · 2D")}
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
              {tr("Создай свою игру.", "Өз ойыныңды жаса.", "Create your own game.")}<br />
              <span className="bg-gradient-to-r from-accent to-accent-3 bg-clip-text text-transparent">
                {tr("Опубликуй на 3 платформах.", "3 платформада жариялa.", "Publish on 3 platforms.")}
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-foreground/70 max-w-3xl mb-10 leading-relaxed">
              {tr("За 25 недель ребёнок создаст ", "25 аптада бала ", "In 25 weeks your child will make ")}<strong>{tr("5–8 игр", "5–8 ойын", "5–8 games")}</strong>{tr(" и финальную мультиплатформенную игру на ", " және финалдық мультиплатформалық ойын жасайды: ", " and a final multi-platform game on ")}<strong>itch.io, Google Play {tr("и", "және", "and")} App Store</strong>{tr(". С локальным мультиплеером и трейлером.", ". Жергілікті мультиплеер мен трейлермен.", ". With local multiplayer and a trailer.")}
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              {[
                { icon: "calendar" as const, text: tr("25 недель · 50 уроков", "25 апта · 50 сабақ", "25 weeks · 50 lessons") },
                { icon: "code" as const, text: "Unity 6 + C#" },
                { icon: "smartphone" as const, text: tr("3 платформы", "3 платформа", "3 platforms") },
                { icon: "users" as const, text: tr("Мультиплеер", "Мультиплеер", "Multiplayer") },
                { icon: "video" as const, text: tr("Своя трейлер-сцена", "Өз трейлер-сахнаң", "Your own trailer scene") },
              ].map((t) => (
                <span key={t.text} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-full text-sm font-medium">
                  <Icon name={t.icon} className="w-4 h-4 text-accent" /> {t.text}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#apply" className="glow-hover inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white rounded-2xl font-semibold text-lg hover:bg-accent-hover transition shadow-lg shadow-accent/20">
                {tr("Записаться на пробный урок", "Сынақ сабаққа жазылу", "Sign up for a trial lesson")} →
              </a>
              <a href="#program" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border rounded-2xl font-semibold text-lg hover:bg-foreground/5 transition">
                {tr("Посмотреть программу", "Бағдарламаны қарау", "See the program")}
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
            <CodeWindow
              title="Player.cs"
              interactive
              stack={["Unity 6", "C#", "2D"]}
              className="glow-hover"
              code={`using UnityEngine;

public class Player : MonoBehaviour {
    public float speed = 8f;

    void Update() {
        float x = Input.GetAxis("Horizontal");
        transform.Translate(x * speed * Time.deltaTime, 0, 0);
    }
}`}
            />
          </motion.div>
          </div>
        </div>
      </section>

      {/* ───────── ЧТО СОЗДАСТ РЕБЁНОК ───────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div {...fadeIn} className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">{tr("Что ребёнок создаст", "Бала нені жасайды", "What your child will build")}</h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">{tr("7 игр в портфолио + финальный мультиплатформенный проект. Каждая игра — реальная, играбельная, по ссылке.", "Портфолиода 7 ойын + финалдық мультиплатформалық жоба. Әр ойын — нақты, ойналатын, сілтеме бойынша.", "7 games in the portfolio + a final multi-platform project. Every game is real, playable, at a link.")}</p>
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
                p.num === 4 || p.num === 7 ? "bg-gradient-to-br from-accent/8 to-accent-soft/8 border-accent/30" : "bg-white border-border"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl font-bold text-accent">#{p.num}</span>
                <span className="text-xs text-foreground/50">{p.lesson}</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{p.name}</h3>
              <p className="text-sm text-foreground/60">{p.platform}</p>
            </motion.div>
          ))}
        </div>

        <motion.p {...fadeIn} className="text-center mt-10 text-sm text-foreground/50">
          {tr("⭐ — финальные проекты модулей, обязательная публикация", "⭐ — модульдердің финалдық жобалары, міндетті жариялау", "⭐ — module final projects, publishing required")}
        </motion.p>
      </section>

      {/* ───────── ПОЧЕМУ 2D ───────── */}
      <section className="border-y border-border bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.div {...fadeIn} className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-accent-3/12 text-accent rounded-full text-sm font-medium mb-4">
                {tr("Главный вопрос родителей", "Ата-аналардың басты сұрағы", "Parents' main question")}
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">{tr("Почему 2D, а не 3D?", "Неге 2D, 3D емес?", "Why 2D, not 3D?")}</h2>
              <p className="text-lg text-foreground/70 mb-6 leading-relaxed">
                {tr("Фундамент ", "Іргетас ", "The foundation is ")}<strong>{tr("одинаковый", "бірдей", "the same")}</strong>{tr(": физика, коллизии, AI, UI, анимации, паттерны — всё то же в 2D и 3D. Освоив 2D, переход в 3D займёт 2–3 недели.", ": физика, коллизиялар, AI, UI, анимациялар, паттерндер — 2D мен 3D-де бәрі сол. 2D-ні меңгерген соң 3D-ге көшу 2–3 аптаға созылады.", ": physics, collisions, AI, UI, animations, patterns — all the same in 2D and 3D. Once you master 2D, moving to 3D takes 2–3 weeks.")}
              </p>
              <p className="text-lg text-foreground/70 leading-relaxed">
                {tr("Главное отличие — ", "Басты айырмашылық — ", "The key difference is ")}<strong>{tr("скорость результата", "нәтиже жылдамдығы", "the speed of the result")}</strong>{tr(". В 2D играбельная игра — за 3 недели. В 3D первый результат — через 2–3 месяца (моделирование, текстуры, освещение). Мы хотим, чтобы ребёнок получил wow-эффект сразу.", ". 2D-де ойналатын ойын — 3 аптада. 3D-де алғашқы нәтиже — 2–3 айдан кейін (модельдеу, текстуралар, жарық). Біз баланың wow-әсерді бірден алғанын қалаймыз.", ". In 2D a playable game takes 3 weeks. In 3D the first result comes in 2–3 months (modeling, textures, lighting). We want the child to get the wow-effect right away.")}
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-accent/5 rounded-2xl border border-accent/20">
                <div className="text-sm text-foreground/50 mb-1">{tr("Инди-хиты на 2D", "2D-дегі инди-хиттер", "Indie hits on 2D")}</div>
                <div className="font-semibold">Celeste, Hollow Knight, Dead Cells,<br />Balatro, Animal Well, Stardew Valley</div>
              </div>
              <div className="p-5 bg-accent-soft/10 rounded-2xl border border-accent-soft/25">
                <div className="text-sm text-foreground/50 mb-1">{tr("Что дальше?", "Одан әрі не?", "What's next?")}</div>
                <div className="font-semibold">{tr("Курс «3D-геймдев» — как продолжение. Все навыки C#, ООП, паттерны переносятся 1:1.", "«3D-геймдев» курсы — жалғасы ретінде. C#, ООП, паттерндердің барлық дағдылары 1:1 ауысады.", "The '3D game dev' course as a continuation. All C#, OOP, pattern skills transfer 1:1.")}</div>
              </div>
              <div className="p-5 bg-accent-3/8 rounded-2xl border border-accent-3/20">
                <div className="text-sm text-foreground/50 mb-1">{tr("Технологии", "Технологиялар", "Technologies")}</div>
                <div className="font-semibold">{tr("Unity = 51% игр на Steam.", "Unity = Steam-дегі ойындардың 51%.", "Unity = 51% of games on Steam.")}<br />{tr("C# = топ-5 языков мира.", "C# = әлемдегі топ-5 тіл.", "C# = top-5 languages in the world.")}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────── ПРОГРАММА (MODULES) ───────── */}
      <section id="program" className="max-w-6xl mx-auto px-6 py-20">
        <motion.div {...fadeIn} className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">{tr("Программа курса", "Курс бағдарламасы", "Course program")}</h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">{tr("2 модуля по 25 уроков. Каждый можно купить отдельно. Модуль 1 — самодостаточный.", "25 сабақтан 2 модуль. Әрқайсысын бөлек сатып алуға болады. 1-модуль өзін-өзі қамтамасыз етеді.", "2 modules of 25 lessons each. Each can be bought separately. Module 1 is self-contained.")}</p>
        </motion.div>

        {/* Module Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-2xl p-2 border border-border">
          {modules.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActiveModule(i)}
              className={`flex-1 px-4 py-3 rounded-xl text-sm lg:text-base font-medium transition ${
                activeModule === i ? "bg-ink-1 text-white" : "text-foreground/60 hover:bg-foreground/5"
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
            <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
              <span>📅 {modules[activeModule].weeks}</span>
              <span>📚 {modules[activeModule].lessons}</span>
            </div>
            <div className="mt-4 p-4 bg-white rounded-2xl border border-border inline-block">
              <span className="text-sm text-foreground/50">🎯 {tr("Результат", "Нәтиже", "Result")}: </span>
              <span className="font-semibold">{modules[activeModule].result}</span>
            </div>
          </div>

          <div className="space-y-4">
            {modules[activeModule].stages.map((s, i) => (
              <div key={s.name} className="bg-white rounded-2xl p-6 border border-border">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-2">
                      <h4 className="text-xl font-bold">{s.name}</h4>
                      <span className="text-xs text-foreground/40">{s.lessons}</span>
                    </div>
                    <p className="text-foreground/70 mb-3 leading-relaxed">{s.desc}</p>
                    <p className="text-sm font-medium text-accent mb-4">{s.highlight}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {s.topics.map((t) => (
                    <span key={t} className="px-3 py-1.5 bg-foreground/5 rounded-lg text-xs">
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
      <section className="bg-ink-1 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">{tr("6 уровней — 6 побед", "6 деңгей — 6 жеңіс", "6 levels — 6 wins")}</h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">{tr("На каждом этапе ребёнок получает бейдж и сертификат. Видимый прогресс мотивирует.", "Әр кезеңде бала бейдж бен сертификат алады. Көрінетін прогресс мотивация береді.", "At each stage the child earns a badge and a certificate. Visible progress motivates.")}</p>
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
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name={l.icon} className="h-6 w-6" /></span>
                <div className="text-xs text-white/40 mb-1">{tr("Уроки", "Сабақтар", "Lessons")} {l.lessons}</div>
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
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">{tr("AI как инструмент,", "AI — құрал,", "AI as a tool,")}<br />{tr("не как замена", "алмастырушы емес", "not a replacement")}</h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">{tr("Чёткая прогрессия: от полной генерации до полной самостоятельности. Финальная защита — БЕЗ AI.", "Айқын прогрессия: толық генерациядан толық дербестікке дейін. Финалдық қорғау — AI-СЫЗ.", "A clear progression: from full generation to full independence. The final defense is WITHOUT AI.")}</p>
        </motion.div>

        <div className="space-y-3">
          {aiProgression.map((a, i) => (
            <motion.div
              key={a.stage}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col md:flex-row md:items-center gap-4 p-5 bg-white border border-border rounded-2xl"
            >
              <div className="text-sm font-mono text-foreground/40 md:w-32 flex-shrink-0">{a.stage}</div>
              <div className="md:w-48 flex-shrink-0">
                <span className="font-bold text-lg">{a.mode}</span>
              </div>
              <p className="text-foreground/70 flex-1">{a.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────── 2 УРОВНЯ ДЗ ───────── */}
      <section className="border-y border-border bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.div {...fadeIn} className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 grid gap-4">
              <div className="p-6 bg-accent/5 rounded-2xl border border-accent/20">
                <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name="book" className="h-6 w-6" /></span>
                <h3 className="text-lg font-bold mb-2">{tr("Уровень 1 — основной", "1-деңгей — негізгі", "Level 1 — main")}</h3>
                <p className="text-sm text-foreground/70">{tr("Полноценное задание для среднего ученика. Открывается сразу после видеоурока.", "Орташа оқушыға арналған толыққанды тапсырма. Видеосабақтан кейін бірден ашылады.", "A full task for an average student. Opens right after the video lesson.")}</p>
              </div>
              <div className="p-6 bg-accent-soft/10 rounded-2xl border border-accent-soft/25">
                <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name="clipboard" className="h-6 w-6" /></span>
                <h3 className="text-lg font-bold mb-2">{tr("Уровень 2 — поддерживающий", "2-деңгей — қолдаушы", "Level 2 — supporting")}</h3>
                <p className="text-sm text-foreground/70">{tr("Шаблоны, подсказки, каркас кода. Открывается через 48ч, если первый не получается. Это не стыд — это путь дальше.", "Үлгілер, кеңестер, код қаңқасы. Егер біріншісі шықпаса, 48 сағаттан кейін ашылады. Бұл ұят емес — бұл алға жол.", "Templates, hints, a code skeleton. Opens after 48h if the first one doesn't work out. It's not shameful — it's a way forward.")}</p>
              </div>
              <div className="p-6 bg-accent-3/8 rounded-2xl border border-accent-3/20">
                <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name="file" className="h-6 w-6" /></span>
                <h3 className="text-lg font-bold mb-2">{tr("Уровень 3 — для самых сложных уроков", "3-деңгей — ең қиын сабақтарға", "Level 3 — for the hardest lessons")}</h3>
                <p className="text-sm text-foreground/70">{tr("Готовый проект для изучения. Найди ключевую строку, поменяй параметр, посмотри что произошло. Никто не выпадает.", "Зерттеуге арналған дайын жоба. Кілт жолды тап, параметрді өзгерт, не болғанын қара. Ешкім қалып қоймайды.", "A ready project to study. Find the key line, change a parameter, see what happens. No one gets left behind.")}</p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
                {tr("Никто не застревает", "Ешкім тұрып қалмайды", "No one gets stuck")}
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">{tr("3 уровня сложности на каждое ДЗ", "Әр үй тапсырмасына 3 күрделілік деңгейі", "3 difficulty levels for every homework")}</h2>
              <p className="text-lg text-foreground/70 mb-6 leading-relaxed">
                {tr("Если ребёнок застрял — это не его проблема, а наша. У каждого задания есть запасной путь. И ещё один. И ещё.", "Егер бала тұрып қалса — бұл оның мәселесі емес, біздің. Әр тапсырманың сақтық жолы бар. Тағы біреуі. Тағы да.", "If the child gets stuck, it's not their problem — it's ours. Every task has a fallback path. And another. And another.")}
              </p>
              <p className="text-lg text-foreground/70 leading-relaxed">
                {tr("Куратор группы (1 на 10–15 учеников) отвечает на вопросы за 24ч, проверяет ДЗ за 48ч, при необходимости — личная помощь.", "Топ кураторы (10–15 оқушыға 1) сұрақтарға 24 сағатта жауап береді, үй тапсырмасын 48 сағатта тексереді, қажет болса — жеке көмек.", "The group curator (1 per 10–15 students) answers questions within 24h, checks homework within 48h, and gives personal help when needed.")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────── РАСХОДЫ — ПРОЗРАЧНО ───────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div {...fadeIn} className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">{tr("Прозрачные расходы", "Ашық шығындар", "Transparent costs")}</h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">{tr("Полноценный курс возможен без дополнительных затрат. Если хочется в магазины — расходы минимальны.", "Толыққанды курс қосымша шығынсыз мүмкін. Дүкендерге шыққысы келсе — шығындар аз.", "A full course is possible with no extra costs. If you want the stores, the costs are minimal.")}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-6 bg-accent/5 rounded-2xl border border-accent/20">
            <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name="globe" className="h-6 w-6" /></span>
            <h3 className="text-lg font-bold mb-1">itch.io</h3>
            <div className="text-2xl font-bold text-accent mb-2">{tr("Бесплатно", "Тегін", "Free")}</div>
            <p className="text-sm text-foreground/60">{tr("Все игры публикуются здесь по умолчанию. Платформа для инди-разработчиков.", "Барлық ойындар әдепкі бойынша осында жарияланады. Инди-әзірлеушілерге арналған платформа.", "All games are published here by default. A platform for indie developers.")}</p>
          </div>

          <div className="p-6 bg-accent-soft/10 rounded-2xl border border-accent-soft/25">
            <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name="bot" className="h-6 w-6" /></span>
            <h3 className="text-lg font-bold mb-1">Google Play</h3>
            <div className="text-2xl font-bold text-accent mb-2">$25 (~12 000 ₸)</div>
            <p className="text-sm text-foreground/60">{tr("Единоразовый платёж за аккаунт разработчика. Можем использовать аккаунт школы на всю группу.", "Әзірлеуші аккаунты үшін бір реттік төлем. Бүкіл топқа мектеп аккаунтын пайдалана аламыз.", "A one-time payment for a developer account. We can use the school's account for the whole group.")}</p>
          </div>

          <div className="p-6 bg-accent/5 rounded-2xl border border-accent/20">
            <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name="smartphone" className="h-6 w-6" /></span>
            <h3 className="text-lg font-bold mb-1">App Store</h3>
            <div className="text-2xl font-bold text-accent mb-2">{tr("$99/год", "$99/жыл", "$99/year")}</div>
            <p className="text-sm text-foreground/60">{tr("Опционально. Тест на своём iPhone — бесплатно. Без Mac — Unity Cloud Build (тоже бесплатно).", "Опционалды. Өз iPhone-да тексеру — тегін. Mac-сыз — Unity Cloud Build (ол да тегін).", "Optional. Testing on your own iPhone is free. Without a Mac — Unity Cloud Build (also free).")}</p>
          </div>
        </div>
      </section>

      {/* ───────── ПРЕПОДАВАТЕЛЬ ───────── */}
      <section className="bg-gradient-to-br from-accent-3/8 via-accent/6 to-accent-soft/8 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn} className="grid lg:grid-cols-[1fr_2fr] gap-12 items-center">
            <div className="aspect-square bg-gradient-to-br from-accent via-accent-soft to-accent-3 rounded-3xl flex items-center justify-center">
              <span className="font-display font-bold text-7xl text-white drop-shadow-lg">МА</span>
            </div>
            <div>
              <span className="inline-block px-4 py-2 bg-white rounded-full text-sm font-medium mb-4 font-mono">// {tr("преподаватель", "оқытушы", "instructor")}</span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-2">Мадениетова Арайлым</h2>
              <p className="text-lg text-accent font-semibold mb-4">Unity Game Developer</p>
              <p className="text-lg text-foreground/70 mb-6 leading-relaxed">
                {tr("Практикующий Unity-разработчик. Учит подростков доводить игры до готового продукта — от идеи до публикации. Вместе с учениками разберёт 2 жанра-эталона: top-down шутер «NeonStrike» и roguelike «DungeonSlash».", "Тәжірибелі Unity-әзірлеуші. Жасөспірімдерді ойынды дайын өнімге жеткізуге үйретеді — идеядан жариялауға дейін. Оқушылармен бірге 2 жанр-эталонды талдайды: top-down шутер «NeonStrike» және roguelike «DungeonSlash».", "A practicing Unity developer. Teaches teens to take games all the way to a finished product — from idea to publishing. Together with students, walks through 2 reference genres: the top-down shooter 'NeonStrike' and the roguelike 'DungeonSlash'.")}
              </p>
              <div className="flex flex-wrap gap-3">
                {[tr("Практикующий Unity-разработчик", "Тәжірибелі Unity-әзірлеуші", "Practicing Unity developer"), tr("Публикует свои игры", "Өз ойындарын жариялайды", "Publishes own games"), tr("Опыт обучения подростков", "Жасөспірімдерді оқыту тәжірибесі", "Experience teaching teens"), "Mentor 1-on-1"].map((t) => (
                  <span key={t} className="px-4 py-2 bg-white rounded-full text-sm font-medium border border-border">
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
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">{tr("Стоимость", "Құны", "Pricing")}</h2>
          <p className="text-lg text-foreground/60">{tr("Можно платить помесячно или сразу со скидкой", "Ай сайын немесе бірден жеңілдікпен төлеуге болады", "You can pay monthly or upfront with a discount")}</p>
        </motion.div>

        <div className="max-w-2xl mx-auto bg-gradient-to-br from-ink-1 to-ink-2 text-white rounded-3xl p-10 lg:p-12">
          <div className="text-center mb-8">
            <div className="text-sm uppercase tracking-wider opacity-60 mb-3">{tr("Цена", "Бағасы", "Price")}</div>
            <div className="flex items-baseline justify-center gap-3 flex-wrap mb-3">
              <span className="text-4xl lg:text-5xl font-bold">75 000 ₸</span>
              <span className="text-white/50 text-2xl">/ {tr("месяц", "ай", "month")}</span>
            </div>
            <div className="text-white/60 text-sm">{tr("Одинаково весь период обучения · льготным категориям 60 000 ₸ · Kaspi-рассрочка 0%", "Оқудың бүкіл кезеңінде бірдей · жеңілдік санаттарына 60 000 ₸ · Kaspi-бөліп төлеу 0%", "The same for the whole course · 60 000 ₸ for eligible categories · Kaspi installment 0%")}</div>
          </div>

          <div className="space-y-3 mb-8">
            {[
              tr("✓ 50 уроков по 2–3 часа", "✓ 2–3 сағаттан 50 сабақ", "✓ 50 lessons of 2–3 hours"),
              tr("✓ Куратор группы (1 на 10–15 чел)", "✓ Топ кураторы (10–15 адамға 1)", "✓ A group curator (1 per 10–15 people)"),
              tr("✓ Проверка ДЗ за 48ч", "✓ Үй тапсырмасын 48 сағатта тексеру", "✓ Homework checked within 48h"),
              tr("✓ 4 demo-day + финальная защита", "✓ 4 demo-day + финалдық қорғау", "✓ 4 demo-days + a final defense"),
              tr("✓ Сертификат + диплом", "✓ Сертификат + диплом", "✓ A certificate + a diploma"),
              tr("✓ Можно прекратить в любой момент", "✓ Кез келген сәтте тоқтатуға болады", "✓ You can stop at any time"),
            ].map((t) => (
              <div key={t} className="text-white/90">{t}</div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            <div className="p-4 bg-accent/15 rounded-xl border border-accent/30">
              <div className="text-sm opacity-80 mb-1">{tr("Льготникам −20%", "Жеңілдік алушыларға −20%", "−20% for eligible")}</div>
              <div className="text-xl font-bold">60 000 ₸</div>
              <div className="text-xs opacity-60">{tr("в месяц", "айына", "per month")}</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-sm opacity-60 mb-1">{tr("Kaspi-рассрочка", "Kaspi-бөліп төлеу", "Kaspi installment")}</div>
              <div className="text-xl font-bold">{tr("0% · 3 или 6 мес", "0% · 3 немесе 6 ай", "0% · 3 or 6 months")}</div>
              <div className="text-xs opacity-60">{tr("без переплаты", "үстеме төлемсіз", "no overpayment")}</div>
            </div>
          </div>

          <a href="#apply" className="block text-center w-full py-4 bg-accent hover:bg-white hover:text-foreground rounded-2xl font-semibold text-lg transition">
            {tr("Записаться на пробный урок", "Сынақ сабаққа жазылу", "Sign up for a trial lesson")} →
          </a>
          <p className="text-center text-sm text-white/50 mt-4">{tr("Пробный урок — бесплатно", "Сынақ сабақ — тегін", "Trial lesson — free")}</p>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="bg-white border-t border-border py-20">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2 {...fadeIn} className="text-4xl lg:text-5xl font-bold text-center mb-12">
            {tr("Частые вопросы", "Жиі қойылатын сұрақтар", "Frequently asked questions")}
          </motion.h2>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="border border-border rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-foreground/5 transition"
                >
                  <span className="font-semibold text-lg">{f.q}</span>
                  <span className={`text-2xl transition ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-5 text-foreground/70 leading-relaxed"
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
      <section className="bg-ink-1 text-white py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2 {...fadeIn} className="text-4xl lg:text-5xl font-bold mb-4">
            {tr("Готовы начать?", "Бастауға дайынсыз ба?", "Ready to start?")}
          </motion.h2>
          <motion.p {...fadeIn} className="text-lg text-white/60 mb-8">
            {tr("Запишитесь на бесплатный пробный урок — посмотрим вместе подходит ли курс ребёнку.", "Тегін сынақ сабаққа жазылыңыз — курс балаға сай келе ме, бірге қараймыз.", "Sign up for a free trial lesson — together we'll see if the course fits your child.")}
          </motion.p>
          <motion.a {...fadeIn} href="#apply" className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-white hover:text-foreground rounded-2xl font-semibold text-lg transition shadow-lg">
            {tr("Записаться на пробный урок", "Сынақ сабаққа жазылу", "Sign up for a trial lesson")} →
          </motion.a>
        </div>
      </section>
    </main>
  );
}
