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
    title: tr("От бота до REST API", "Боттан REST API-ге дейін", "From a bot to a REST API"),
    lessons: tr("Уроки 1–29", "1–29 сабақ", "Lessons 1–29"),
    weeks: tr("15 недель", "15 апта", "15 weeks"),
    result: tr("REST API + Swagger + HTML-фронтенд + Telegram-бот 24/7", "REST API + Swagger + HTML-фронтенд + Telegram-бот 24/7", "REST API + Swagger + HTML frontend + a 24/7 Telegram bot"),
    color: "from-accent/80 to-accent-soft/80",
    bg: "bg-accent/5",
    border: "border-accent/20",
    stages: [
      {
        name: tr("Этап 1 · Vibe-coding", "1-кезең · Vibe-coding", "Stage 1 · Vibe-coding"),
        lessons: tr("Уроки 1–6", "1–6 сабақ", "Lessons 1–6"),
        desc: tr("Установка Python и VS Code. Первый Telegram-бот через ChatGPT за 2 урока. Кастомизация, память через JSON, деплой на PythonAnywhere — бот работает 24/7.", "Python және VS Code орнату. ChatGPT арқылы алғашқы Telegram-бот 2 сабақта. Кастомизация, JSON арқылы жады, PythonAnywhere-ге деплой — бот 24/7 жұмыс істейді.", "Installing Python and VS Code. Your first Telegram bot via ChatGPT in 2 lessons. Customization, memory via JSON, deployment to PythonAnywhere — the bot runs 24/7."),
        highlight: tr("🤖 Через 3 недели — бот, которому можно написать с маминого телефона", "🤖 3 аптадан кейін — анаңның телефонынан жазуға болатын бот", "🤖 In 3 weeks — a bot you can message from mom's phone"),
        topics: [tr("Установка Python + VS Code", "Python + VS Code орнату", "Installing Python + VS Code"), tr("BotFather → токен бота", "BotFather → бот токені", "BotFather → the bot token"), tr("Vibe-coding через ChatGPT", "ChatGPT арқылы vibe-coding", "Vibe-coding via ChatGPT"), tr("Кастомизация (inline-кнопки)", "Кастомизация (inline-батырмалар)", "Customization (inline buttons)"), tr("Память: dict + JSON", "Жады: dict + JSON", "Memory: dict + JSON"), tr("Git + деплой 24/7", "Git + деплой 24/7", "Git + 24/7 deploy"), "Demo-day #1"],
      },
      {
        name: tr("Этап 2 · Python с нуля", "2-кезең · Python нөлден", "Stage 2 · Python from scratch"),
        lessons: tr("Уроки 7–13", "7–13 сабақ", "Lessons 7–13"),
        desc: tr("Каждый урок Python привязан к новой фиче бота: визитка → угадайка → рефакторинг → /leaderboard → файлы + отладка. Контрольная без AI.", "Әр Python сабағы боттың жаңа фичасына байланысты: визитка → тапқыш → рефакторинг → /leaderboard → файлдар + баптау. Бақылау жұмысы AI-сыз.", "Every Python lesson ties to a new bot feature: a card → a guessing game → refactoring → /leaderboard → files + debugging. A test without AI."),
        highlight: tr("🐍 Урок 12 — Python Battle: чтение чужого open-source кода", "🐍 12-сабақ — Python Battle: бөгде open-source кодты оқу", "🐍 Lesson 12 — Python Battle: reading others' open-source code"),
        topics: [tr("Переменные → /about бота", "Айнымалылар → боттың /about", "Variables → the bot's /about"), tr("Циклы + условия → /game", "Циклдар + шарттар → /game", "Loops + conditions → /game"), tr("Функции + DRY → рефакторинг", "Функциялар + DRY → рефакторинг", "Functions + DRY → refactoring"), tr("Списки/словари → /leaderboard", "Тізімдер/сөздіктер → /leaderboard", "Lists/dicts → /leaderboard"), tr("Файлы + try/except + отладчик", "Файлдар + try/except + баптаушы", "Files + try/except + the debugger"), tr("🎮 Python Battle (fun-day)", "🎮 Python Battle (fun-day)", "🎮 Python Battle (fun-day)"), tr("Контрольная без AI", "AI-сыз бақылау жұмысы", "A test without AI")],
      },
      {
        name: tr("Этап 2 · SQL и базы данных", "2-кезең · SQL және дерекқорлар", "Stage 2 · SQL and databases"),
        lessons: tr("Уроки 14–21", "14–21 сабақ", "Lessons 14–21"),
        desc: tr("Игровая БД GameDB как сквозной проект: SELECT, JOIN, UPDATE/DELETE. SQL-детектив — расследование «преступления» через запросы. CRUD + бот с настоящей базой.", "GameDB ойын ДБ-сы сквозной жоба ретінде: SELECT, JOIN, UPDATE/DELETE. SQL-детектив — сұраныстар арқылы «қылмысты» тергеу. CRUD + нағыз дерекқоры бар бот.", "The GameDB game database as an end-to-end project: SELECT, JOIN, UPDATE/DELETE. SQL detective — investigating a 'crime' via queries. CRUD + a bot with a real database."),
        highlight: tr("🔍 Урок 18 — SQL-детектив: найди вора через 5 SQL-запросов", "🔍 18-сабақ — SQL-детектив: 5 SQL-сұраныс арқылы ұрыны тап", "🔍 Lesson 18 — SQL detective: find the thief in 5 SQL queries"),
        topics: [tr("SQLite + DB Browser", "SQLite + DB Browser", "SQLite + DB Browser"), tr("SELECT, WHERE, GROUP BY", "SELECT, WHERE, GROUP BY", "SELECT, WHERE, GROUP BY"), tr("UPDATE/DELETE + AI-провокация", "UPDATE/DELETE + AI-провокация", "UPDATE/DELETE + an AI provocation"), tr("JOIN — связи таблиц", "JOIN — кестелер байланысы", "JOIN — table relationships"), tr("🔍 SQL-детектив (fun-day)", "🔍 SQL-детектив (fun-day)", "🔍 SQL detective (fun-day)"), tr("ER-диаграммы (dbdiagram.io)", "ER-диаграммалар (dbdiagram.io)", "ER diagrams (dbdiagram.io)"), tr("CRUD + Telegram-бот с БД", "CRUD + ДБ-мен Telegram-бот", "CRUD + a Telegram bot with a DB")],
      },
      {
        name: tr("Этап 2 · REST API", "2-кезең · REST API", "Stage 2 · REST API"),
        lessons: tr("Уроки 22–29", "22–29 сабақ", "Lessons 22–29"),
        desc: tr("HTTP, GET/POST/PUT/DELETE, Flask и FastAPI. Аутентификация с хэшированием паролей. Полноценный API + Swagger + HTML-фронтенд. Чтение документации как отдельный навык.", "HTTP, GET/POST/PUT/DELETE, Flask және FastAPI. Құпиясөздерді хэштеумен аутентификация. Толыққанды API + Swagger + HTML-фронтенд. Құжаттаманы оқу — жеке дағды.", "HTTP, GET/POST/PUT/DELETE, Flask and FastAPI. Authentication with password hashing. A full API + Swagger + HTML frontend. Reading documentation as a separate skill."),
        highlight: tr("🎓 Конец Модуля 1: REST API с регистрацией → точка безопасного выхода", "🎓 1-модуль соңы: тіркеуі бар REST API → қауіпсіз шығу нүктесі", "🎓 End of Module 1: a REST API with registration → a safe exit point"),
        topics: [tr("HTTP, Postman, статус-коды", "HTTP, Postman, статус-кодтар", "HTTP, Postman, status codes"), tr("Flask: первый сервер", "Flask: алғашқы сервер", "Flask: your first server"), tr("REST API: GET/POST + HTML", "REST API: GET/POST + HTML", "REST API: GET/POST + HTML"), tr("PUT/DELETE + SQLite", "PUT/DELETE + SQLite", "PUT/DELETE + SQLite"), tr("FastAPI + Swagger UI", "FastAPI + Swagger UI", "FastAPI + Swagger UI"), tr("Хэширование паролей (bcrypt)", "Құпиясөздерді хэштеу (bcrypt)", "Password hashing (bcrypt)"), tr("📖 Документация без AI", "📖 AI-сыз құжаттама", "📖 Docs without AI"), "Demo-day #2"],
      },
    ],
  },
  {
    id: "m2",
    label: tr("Модуль 2", "2-модуль", "Module 2"),
    title: tr("DevOps + свой проект в интернете", "DevOps + интернеттегі өз жобаң", "DevOps + your own project online"),
    lessons: tr("Уроки 30–52", "30–52 сабақ", "Lessons 30–52"),
    weeks: tr("11 недель", "11 апта", "11 weeks"),
    result: tr("Свой REST API на Docker, в продакшене, по реальной ссылке в интернете", "Docker-дегі өз REST API-ің, продакшенде, интернеттегі нақты сілтеме бойынша", "Your own REST API on Docker, in production, at a real link online"),
    color: "from-accent-3 to-accent-3",
    bg: "bg-accent-3/8",
    border: "border-accent-3/20",
    stages: [
      {
        name: tr("Этап 2 · Продвинутые навыки", "2-кезең · Кеңейтілген дағдылар", "Stage 2 · Advanced skills"),
        lessons: tr("Уроки 30–37", "30–37 сабақ", "Lessons 30–37"),
        desc: tr("ООП в Python (RPG-мини-игра как пример), внешние API (бот показывает погоду), тестирование через pytest, Docker, CI/CD на GitHub Actions, безопасность.", "Python-дағы ООП (мысал ретінде RPG-мини-ойын), сыртқы API (бот ауа райын көрсетеді), pytest арқылы тестілеу, Docker, GitHub Actions-тегі CI/CD, қауіпсіздік.", "OOP in Python (an RPG mini-game as an example), external APIs (the bot shows the weather), testing with pytest, Docker, CI/CD on GitHub Actions, security."),
        highlight: tr("💻 «История про $400» — реальная утечка API-ключа в GitHub", "💻 «$400 туралы оқиға» — GitHub-тағы нақты API-кілт ағуы", "💻 'The $400 story' — a real API key leak on GitHub"),
        topics: [tr("ООП: классы + RPG-мини-игра", "ООП: класстар + RPG-мини-ойын", "OOP: classes + an RPG mini-game"), tr("Наследование (Warrior/Mage/Archer)", "Мұрагерлік (Warrior/Mage/Archer)", "Inheritance (Warrior/Mage/Archer)"), tr("Внешние API → бот с погодой", "Сыртқы API → ауа райы боты", "External APIs → a weather bot"), tr("pytest + Test Battle (8 багов)", "pytest + Test Battle (8 баг)", "pytest + Test Battle (8 bugs)"), tr("🐳 Docker: контейнеризация", "🐳 Docker: контейнерлеу", "🐳 Docker: containerization"), tr("GitHub Actions: автотесты", "GitHub Actions: автотесттер", "GitHub Actions: automated tests"), tr("🔒 Безопасность + GitGuardian", "🔒 Қауіпсіздік + GitGuardian", "🔒 Security + GitGuardian"), tr("🎉 Мини-хакатон", "🎉 Мини-хакатон", "🎉 A mini-hackathon")],
      },
      {
        name: tr("Этап 3 · Свой проект", "3-кезең · Өз жобаң", "Stage 3 · Your own project"),
        lessons: tr("Уроки 38–52", "38–52 сабақ", "Lessons 38–52"),
        desc: tr("Финальный проект ученика + спикер ведёт пример TaskMaster. От ТЗ и ER-диаграммы до деплоя на Render. JWT-аутентификация, пагинация, docker-compose, mock-интервью.", "Оқушының финалдық жобасы + спикер TaskMaster мысалын жүргізеді. ТТ мен ER-диаграммадан Render-ге деплойға дейін. JWT-аутентификация, пагинация, docker-compose, mock-сұхбат.", "The student's final project + the speaker runs the TaskMaster example. From the spec and ER diagram to deployment on Render. JWT auth, pagination, docker-compose, a mock interview."),
        highlight: tr("🏆 Защита БЕЗ AI: 7 мин + 5 вопросов от жюри", "🏆 AI-СЫЗ қорғау: 7 мин + қазылардан 5 сұрақ", "🏆 Defense WITHOUT AI: 7 min + 5 questions from the jury"),
        topics: [
          tr("Выбор темы + ТЗ (1 стр.)", "Тақырып таңдау + ТТ (1 бет)", "Choosing a topic + a spec (1 page)"),
          tr("ER-диаграмма + API-контракт", "ER-диаграмма + API-келісім", "ER diagram + an API contract"),
          tr("Спринт 1: SQLAlchemy + seed", "Спринт 1: SQLAlchemy + seed", "Sprint 1: SQLAlchemy + seed"),
          tr("Спринт 2: CRUD endpoints", "Спринт 2: CRUD endpoints", "Sprint 2: CRUD endpoints"),
          tr("Спринт 3: бизнес-логика + 🚀 уникальная фича", "Спринт 3: бизнес-логика + 🚀 бірегей фича", "Sprint 3: business logic + 🚀 a unique feature"),
          tr("🔧 Debug Championship + Code Review", "🔧 Debug Championship + Code Review", "🔧 Debug Championship + Code Review"),
          tr("Mid-demo: проект на 50%", "Mid-demo: жоба 50%-да", "Mid-demo: project at 50%"),
          tr("Спринт 4: JWT-аутентификация", "Спринт 4: JWT-аутентификация", "Sprint 4: JWT authentication"),
          tr("Спринт 5: пагинация + CORS + logging", "Спринт 5: пагинация + CORS + logging", "Sprint 5: pagination + CORS + logging"),
          tr("Спринт 6: тесты + Bug Hunt", "Спринт 6: тесттер + Bug Hunt", "Sprint 6: tests + Bug Hunt"),
          tr("🐳 docker-compose + 🚀 деплой на Render", "🐳 docker-compose + 🚀 Render-ге деплой", "🐳 docker-compose + 🚀 deploy to Render"),
          tr("Swagger + README + портфолио-сайт", "Swagger + README + портфолио-сайт", "Swagger + README + a portfolio site"),
          tr("Mock-интервью", "Mock-сұхбат", "A mock interview"),
          tr("🏆 ФИНАЛЬНЫЙ DEMO-DAY", "🏆 ФИНАЛДЫҚ DEMO-DAY", "🏆 FINAL DEMO-DAY"),
        ],
      },
    ],
  },
  ];
}

function makeLevels(tr: Tr) {
  return [
  { icon: "bot" as const, name: "Bot Maker", lessons: "1–6", desc: tr("Telegram-бот через AI, деплой 24/7", "AI арқылы Telegram-бот, 24/7 деплой", "A Telegram bot via AI, 24/7 deploy") },
  { icon: "code" as const, name: "Python Coder", lessons: "7–13", desc: tr("Python сам, 5 фич бота, читает чужой код", "Python-ды өзі, боттың 5 фичасы, бөгде кодты оқиды", "Python on their own, 5 bot features, reads others' code") },
  { icon: "database" as const, name: "Data Keeper", lessons: "14–21", desc: tr("Проектирует БД, SQL-детектив, CRUD", "ДБ жобалайды, SQL-детектив, CRUD", "Designs a DB, SQL detective, CRUD") },
  { icon: "globe" as const, name: "API Builder", lessons: "22–29", desc: tr("REST API + Swagger, читает документацию", "REST API + Swagger, құжаттаманы оқиды", "REST API + Swagger, reads documentation") },
  { icon: "settings" as const, name: "DevOps Starter", lessons: "30–37", desc: tr("ООП, тесты, Docker, CI/CD, безопасность", "ООП, тесттер, Docker, CI/CD, қауіпсіздік", "OOP, tests, Docker, CI/CD, security") },
  { icon: "award" as const, name: "Backend Pro", lessons: "38–52", desc: tr("Свой проект: ТЗ → деплой + debug + ревью", "Өз жобаң: ТТ → деплой + debug + ревью", "Own project: spec → deploy + debug + review") },
  ];
}

function makeAiProgression(tr: Tr) {
  return [
  { stage: tr("Уроки 1–6", "1–6 сабақ", "Lessons 1–6"), mode: tr("🟢 Генерирует", "🟢 Генерациялайды", "🟢 Generates"), desc: tr("AI пишет код целиком. Wow-эффект, бот работает 24/7.", "AI кодты толықтай жазады. Wow-әсер, бот 24/7 жұмыс істейді.", "AI writes all the code. The wow-effect, the bot runs 24/7.") },
  { stage: tr("Уроки 7–13", "7–13 сабақ", "Lessons 7–13"), mode: tr("🟡 Объясняет", "🟡 Түсіндіреді", "🟡 Explains"), desc: tr("AI объясняет ошибки. Код пишет ученик. Контрольная — без AI.", "AI қателерді түсіндіреді. Кодты оқушы жазады. Бақылау жұмысы — AI-сыз.", "AI explains mistakes. The student writes the code. The test is without AI.") },
  { stage: tr("Уроки 14–21", "14–21 сабақ", "Lessons 14–21"), mode: tr("🟡 + 🔥 Провокации", "🟡 + 🔥 Провокациялар", "🟡 + 🔥 Provocations"), desc: tr("Спикер показывает ошибки AI: SQL injection, DELETE без WHERE.", "Спикер AI қателерін көрсетеді: SQL injection, WHERE-сіз DELETE.", "The speaker shows AI's mistakes: SQL injection, DELETE without WHERE.") },
  { stage: tr("Уроки 22–29", "22–29 сабақ", "Lessons 22–29"), mode: tr("🟠 Ревьюит", "🟠 Ревью жасайды", "🟠 Reviews"), desc: tr("Код свой → AI делает ревью. Урок 28: AI ЗАКРЫТ, только docs.", "Код өзіндік → AI ревью жасайды. 28-сабақ: AI ЖАБЫҚ, тек docs.", "Your own code → AI reviews it. Lesson 28: AI is OFF, docs only.") },
  { stage: tr("Уроки 30–37", "30–37 сабақ", "Lessons 30–37"), mode: tr("🟠 + тесты", "🟠 + тесттер", "🟠 + tests"), desc: tr("AI помогает с QA: генерация тестов, debug. Бизнес-логику — сам.", "AI QA-ға көмектеседі: тест генерациясы, debug. Бизнес-логиканы — өзі.", "AI helps with QA: generating tests, debug. Business logic — on their own.") },
  { stage: tr("Уроки 38–52", "38–52 сабақ", "Lessons 38–52"), mode: tr("🔴 Ассистент", "🔴 Ассистент", "🔴 Assistant"), desc: tr("Только вопросы и debug. Защита БЕЗ AI.", "Тек сұрақтар мен debug. Қорғау AI-СЫЗ.", "Only questions and debug. The defense is WITHOUT AI.") },
  ];
}

function makePortfolio(tr: Tr) {
  return [
  { num: 1, name: tr("Telegram-бот 24/7", "Telegram-бот 24/7", "A 24/7 Telegram bot"), lesson: tr("Уроки 1–13", "1–13 сабақ", "Lessons 1–13"), platform: tr("Vibe-coded + 5 фич Python", "Vibe-coded + Python-ның 5 фичасы", "Vibe-coded + 5 Python features") },
  { num: 2, name: tr("GameDB + SQL-детектив", "GameDB + SQL-детектив", "GameDB + SQL detective"), lesson: tr("Уроки 14–21", "14–21 сабақ", "Lessons 14–21"), platform: tr("SQLite + ER-диаграмма", "SQLite + ER-диаграмма", "SQLite + an ER diagram") },
  { num: 3, name: tr("Бот с настоящей БД", "Нағыз ДБ-мен бот", "A bot with a real DB"), lesson: tr("Урок 20", "20-сабақ", "Lesson 20"), platform: "Telegram + SQLite" },
  { num: 4, name: tr("REST API + Swagger", "REST API + Swagger", "REST API + Swagger"), lesson: tr("Урок 29", "29-сабақ", "Lesson 29"), platform: tr("Flask + HTML-фронтенд ⭐", "Flask + HTML-фронтенд ⭐", "Flask + an HTML frontend ⭐") },
  { num: 5, name: tr("API в Docker + CI/CD", "Docker-дегі API + CI/CD", "API in Docker + CI/CD"), lesson: tr("Урок 37", "37-сабақ", "Lesson 37"), platform: "Docker + GitHub Actions" },
  { num: 6, name: tr("Портфолио + GitHub README", "Портфолио + GitHub README", "Portfolio + a GitHub README"), lesson: tr("Урок 49", "49-сабақ", "Lesson 49"), platform: tr("Readme.so + сайт", "Readme.so + сайт", "Readme.so + a site") },
  { num: 7, name: tr("Финальный API в интернете", "Интернеттегі финалдық API", "A final API online"), lesson: tr("Урок 52", "52-сабақ", "Lesson 52"), platform: "Render + docker-compose 🏆" },
  ];
}

function makeFaqs(tr: Tr) {
  return [
  {
    q: tr("Чем бэкенд отличается от фронтенда?", "Бэкенд фронтендтен несімен ерекшеленеді?", "How is the backend different from the frontend?"),
    a: tr("Фронтенд — это витрина магазина: всё что пользователь видит и трогает (кнопки, формы, дизайн). Бэкенд — это склад, касса и охранник: где хранятся данные, кто проверяет пароли, кто отвечает за то, чтобы ничего не сломалось при 1000 пользователях. Без бэкенда витрина пустая. Бэкенд-разработчики обычно получают зарплату выше фронтенд-разработчиков (это более серьёзная инженерная работа).", "Фронтенд — дүкеннің витринасы: пайдаланушы көретін және басатын бәрі (батырмалар, формалар, дизайн). Бэкенд — қойма, касса және күзетші: деректер қайда сақталады, кім құпиясөздерді тексереді, 1000 пайдаланушыда ешнәрсе сынбауына кім жауап береді. Бэкендсіз витрина бос. Бэкенд-әзірлеушілер әдетте фронтенд-әзірлеушілерден жоғары жалақы алады (бұл — күрделірек инженерлік жұмыс).", "The frontend is the shop window: everything the user sees and touches (buttons, forms, design). The backend is the warehouse, the cash register and the guard: where data is stored, who checks passwords, who makes sure nothing breaks with 1000 users. Without a backend the window is empty. Backend developers usually earn more than frontend developers (it's more serious engineering work)."),
  },
  {
    q: tr("Какие реальные расходы помимо курса?", "Курстан бөлек нақты шығындар қандай?", "What are the real costs besides the course?"),
    a: tr("Ноль. Полностью бесплатно. Python, VS Code, GitHub, PythonAnywhere (хостинг бота 24/7), Render (хостинг финального API), Docker — всё бесплатно. Все тренажёры (Питонтьютор, Снейк.про, SQL Academy, CodeCombat, Learn Git Branching) — на русском, бесплатные.", "Нөл. Толығымен тегін. Python, VS Code, GitHub, PythonAnywhere (24/7 бот хостингі), Render (финалдық API хостингі), Docker — бәрі тегін. Барлық тренажёрлар (Питонтьютор, Снейк.про, SQL Academy, CodeCombat, Learn Git Branching) — орысша, тегін.", "Zero. Completely free. Python, VS Code, GitHub, PythonAnywhere (24/7 bot hosting), Render (hosting for the final API), Docker — all free. All the trainers (Pythontutor, Snake.pro, SQL Academy, CodeCombat, Learn Git Branching) are free, in Russian."),
  },
  {
    q: tr("Зачем боту работать 24/7? И где он работает?", "Ботқа 24/7 жұмыс істеу не үшін керек? Ол қайда жұмыс істейді?", "Why does the bot need to run 24/7? And where does it run?"),
    a: tr("Это и есть «бэкенд» — приложение, работающее на сервере где-то в интернете (мы используем PythonAnywhere, бесплатный сервис для Python-проектов). Бот запущен там 24/7, и если в 3 часа ночи кто-то напишет — он ответит. Это первый момент, когда ребёнок понимает: «Моя программа работает в интернете, как настоящая. Не на моём ноутбуке».", "Бұл — «бэкенд» — интернеттегі бір жерде серверде жұмыс істейтін қосымша (біз PythonAnywhere қолданамыз, Python-жобаларға арналған тегін сервис). Бот сонда 24/7 іске қосылған, түнгі 3-те біреу жазса — ол жауап береді. Дәл осы сәтте бала түсінеді: «Менің бағдарламам интернетте, нағыз бағдарлама сияқты жұмыс істейді. Менің ноутбугымда емес».", "This is the 'backend' — an app running on a server somewhere online (we use PythonAnywhere, a free service for Python projects). The bot runs there 24/7, and if someone writes at 3 a.m. it will answer. This is the first moment a child understands: 'My program runs online, like a real one. Not on my laptop.'"),
  },
  {
    q: tr("А если ребёнок никогда не программировал?", "Ал бала бұрын ешқашан бағдарламаламаса ше?", "What if the child has never programmed before?"),
    a: tr("Курс рассчитан с нуля. Первые 6 уроков — vibe-coding, ребёнок создаёт бота через ChatGPT, без знаний Python. Сначала видит «работает!» (wow-эффект), потом мы постепенно объясняем что происходит внутри. Это снимает страх и даёт мотивацию.", "Курс нөлден есептелген. Алғашқы 6 сабақ — vibe-coding, бала ChatGPT арқылы Python білмей-ақ бот жасайды. Алдымен «жұмыс істейді!» дегенді көреді (wow-әсер), содан кейін біз ішінде не болып жатқанын біртіндеп түсіндіреміз. Бұл қорқынышты кетіреді және мотивация береді.", "The course starts from zero. The first 6 lessons are vibe-coding — the child builds a bot via ChatGPT without knowing Python. First they see 'it works!' (the wow-effect), then we gradually explain what's happening inside. This removes fear and builds motivation."),
  },
  {
    q: tr("Что если ребёнок не знает английского?", "Бала ағылшын тілін білмесе ше?", "What if the child doesn't know English?"),
    a: tr("Все тренажёры на русском: Питонтьютор, Снейк.про, SQL Academy, CodeCombat (русская версия), Learn Git Branching (русский), документация Flask. На уроке 28 мы отдельно учим читать английскую документацию — но к этому моменту ученик уже знает Python и понимает контекст.", "Барлық тренажёрлар орысша: Питонтьютор, Снейк.про, SQL Academy, CodeCombat (орыс нұсқасы), Learn Git Branching (орысша), Flask құжаттамасы. 28-сабақта біз ағылшын құжаттамасын оқуды бөлек үйретеміз — бірақ бұл кезде оқушы Python-ды біледі және контексті түсінеді.", "All the trainers are in Russian: Pythontutor, Snake.pro, SQL Academy, CodeCombat (Russian version), Learn Git Branching (Russian), the Flask docs. In lesson 28 we separately teach reading English documentation — but by then the student already knows Python and understands the context."),
  },
  {
    q: tr("Что если ребёнок застрянет на сложном уроке?", "Бала қиын сабақта тұрып қалса ше?", "What if the child gets stuck on a hard lesson?"),
    a: tr("Каждое ДЗ имеет 2 уровня сложности. Уровень 1 — основное задание. Если не получается за 48ч — открывается Уровень 2: шаблоны кода, подсказки, каркас. Это не «облегчёнка», а scaffold для возвращения в строй. Куратор группы (1 на 10–15 учеников) отвечает на вопросы за 24ч, проверяет ДЗ за 48ч.", "Әр үй тапсырмасының 2 күрделілік деңгейі бар. 1-деңгей — негізгі тапсырма. 48 сағатта шықпаса — 2-деңгей ашылады: код үлгілері, кеңестер, қаңқа. Бұл «жеңілдетілген» емес, қатарға оралуға арналған scaffold. Топ кураторы (10–15 оқушыға 1) сұрақтарға 24 сағатта жауап береді, үй тапсырмасын 48 сағатта тексереді.", "Every homework has 2 difficulty levels. Level 1 is the main task. If it doesn't work out in 48h, Level 2 opens: code templates, hints, a scaffold. It's not a 'lite version' but a scaffold to get back on track. The group curator (1 per 10–15 students) answers questions within 24h and checks homework within 48h."),
  },
  {
    q: tr("Какие требования к компьютеру?", "Компьютерге қандай талаптар қойылады?", "What are the computer requirements?"),
    a: tr("Самые скромные. Любой ноутбук или ПК с 4 ГБ RAM и Windows / macOS / Linux. Python весит 50 МБ, VS Code — 200 МБ. В отличие от геймдева, никаких требований к видеокарте, RAM 16 ГБ или SSD. Бэкенд работает на серверах с 512 МБ RAM — этому учим.", "Ең қарапайым. 4 ГБ RAM және Windows / macOS / Linux бар кез келген ноутбук немесе ДК. Python 50 МБ, VS Code — 200 МБ. Геймдевтен айырмашылығы, бейнекартаға, 16 ГБ RAM-ға немесе SSD-ге ешқандай талап жоқ. Бэкенд 512 МБ RAM бар серверлерде жұмыс істейді — соны үйретеміз.", "Very modest. Any laptop or PC with 4 GB RAM and Windows / macOS / Linux. Python is 50 MB, VS Code is 200 MB. Unlike game dev, there are no requirements for a graphics card, 16 GB RAM or an SSD. The backend runs on servers with 512 MB RAM — that's what we teach."),
  },
  {
    q: tr("Сколько времени в неделю?", "Аптасына қанша уақыт?", "How much time per week?"),
    a: tr("2 урока в неделю, каждый ~2 часа: видео 20–25 мин + практика 40–60 мин + ДЗ 30–60 мин. Итого 4–5 часов в неделю. Куратор оперативно проверяет ДЗ и отвечает на вопросы.", "Аптасына 2 сабақ, әрқайсысы ~2 сағат: видео 20–25 мин + практика 40–60 мин + үй тапсырмасы 30–60 мин. Барлығы аптасына 4–5 сағат. Куратор үй тапсырмасын жедел тексереді және сұрақтарға жауап береді.", "2 lessons a week, each ~2 hours: a 20–25 min video + 40–60 min of practice + 30–60 min of homework. That's 4–5 hours a week. The curator promptly checks homework and answers questions."),
  },
  {
    q: tr("Можно ли остановиться после Модуля 1?", "1-модульден кейін тоқтауға бола ма?", "Can you stop after Module 1?"),
    a: tr("Да. Модуль 1 (уроки 1–29) — самодостаточный: в конце ребёнок выпускает REST API с регистрацией и Swagger-документацией. Это «точка безопасного выхода». Если хочется в продакшен (Docker + CI/CD + деплой в интернет) — берём Модуль 2.", "Иә. 1-модуль (1–29 сабақ) — өзін-өзі қамтамасыз ететін: соңында бала тіркеуі мен Swagger-құжаттамасы бар REST API шығарады. Бұл — «қауіпсіз шығу нүктесі». Продакшенге (Docker + CI/CD + интернетке деплой) барғың келсе — 2-модульді аламыз.", "Yes. Module 1 (lessons 1–29) is self-contained: at the end the child ships a REST API with registration and Swagger documentation. It's a 'safe exit point'. If you want to go to production (Docker + CI/CD + deploy online), take Module 2."),
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

export default function BackendCourse() {
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
      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/12 via-accent-soft/10 to-accent-3/12" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-accent transition">
              ← {tr("Все курсы", "Барлық курстар", "All courses")}
            </Link>
            <LangSwitcher className="hidden sm:inline-flex" />
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="font-mono text-xs sm:text-sm text-accent tracking-wider mb-3">~/courses/backend $ ./start</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-ink-1 text-white rounded-full text-sm font-medium mb-6">
              <Icon name="code" className="h-4 w-4" /> {tr("Бэкенд-разработка на Python", "Python-дағы бэкенд-әзірлеу", "Backend development in Python")}
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
              {tr("Telegram-бот за 3 недели.", "3 аптада Telegram-бот.", "A Telegram bot in 3 weeks.")}<br />
              <span className="bg-gradient-to-r from-accent to-accent-3 bg-clip-text text-transparent">
                {tr("REST API в интернете за 26.", "26 аптада интернеттегі REST API.", "A REST API online in 26.")}
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-foreground/70 max-w-3xl mb-10 leading-relaxed">
              {tr("За 26 недель ребёнок создаст ", "26 аптада бала ", "In 26 weeks the child builds ")}<strong>{tr("5–7 проектов", "5–7 жоба", "5–7 projects")}</strong>{tr(": Telegram-бот работающий 24/7, базу данных, REST API на FastAPI и финальный проект в продакшене на Docker — ", ": 24/7 жұмыс істейтін Telegram-бот, дерекқор, FastAPI-дегі REST API және Docker-дегі продакшендегі финалдық жоба — ", ": a 24/7 Telegram bot, a database, a REST API on FastAPI and a final project in production on Docker — ")}<strong>{tr("по реальной ссылке в интернете", "интернеттегі нақты сілтеме бойынша", "at a real link online")}</strong>.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              {[
                { icon: "calendar" as const, text: tr("26 недель · 52 урока", "26 апта · 52 сабақ", "26 weeks · 52 lessons") },
                { icon: "code" as const, text: "Python + Flask + FastAPI" },
                { icon: "container" as const, text: "Docker + CI/CD" },
                { icon: "lock" as const, text: tr("JWT + bcrypt + БД", "JWT + bcrypt + ДБ", "JWT + bcrypt + DB") },
                { icon: "wallet" as const, text: tr("0 ₸ доп. расходов", "0 ₸ қосымша шығын", "0 ₸ extra costs") },
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
            <CodeWindow title="bot_simulator.py" image="/assets/screenshots/backend-1.png" imageAlt={tr("Симулятор Telegram-бота", "Telegram-бот симуляторы", "Telegram bot simulator")} imageFit="contain" stack={["Python", "Flask", "FastAPI", "Docker"]} className="glow-hover" />
          </motion.div>
          </div>
        </div>
      </section>

      {/* ───────── ЧТО СОЗДАСТ РЕБЁНОК ───────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div {...fadeIn} className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">{tr("Что ребёнок создаст", "Бала не жасайды", "What the child will build")}</h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">{tr("7 реальных проектов. Не учебные «примеры», а работающие приложения в интернете.", "7 нақты жоба. Оқу «мысалдары» емес, интернетте жұмыс істейтін қосымшалар.", "7 real projects. Not classroom 'examples', but working apps online.")}</p>
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
          {tr("⭐ — финальные проекты модулей, обязательная публикация", "⭐ — модульдердің финалдық жобалары, міндетті жариялау", "⭐ — module final projects, mandatory publication")}
        </motion.p>
      </section>

      {/* ───────── ЧЕМ БЭКЕНД ОТЛИЧАЕТСЯ ───────── */}
      <section className="border-y border-border bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.div {...fadeIn} className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
                {tr("Главный вопрос родителей", "Ата-аналардың басты сұрағы", "Parents' main question")}
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">{tr("Чем бэкенд отличается от фронтенда?", "Бэкенд фронтендтен несімен ерекшеленеді?", "How is the backend different from the frontend?")}</h2>
              <p className="text-lg text-foreground/70 mb-6 leading-relaxed">
                <strong>{tr("Фронтенд", "Фронтенд", "The frontend")}</strong>{tr(" — это витрина магазина: всё что пользователь видит и трогает.", " — дүкеннің витринасы: пайдаланушы көретін және басатын бәрі.", " is the shop window: everything the user sees and touches.")}
              </p>
              <p className="text-lg text-foreground/70 mb-6 leading-relaxed">
                <strong>{tr("Бэкенд", "Бэкенд", "The backend")}</strong>{tr(" — это склад, касса и охранник: где хранятся данные, кто проверяет пароли, кто отвечает за работу при 1000 пользователях. ", " — қойма, касса және күзетші: деректер қайда сақталады, кім құпиясөздерді тексереді, 1000 пайдаланушыда жұмысқа кім жауап береді. ", " is the warehouse, cash register and guard: where data is stored, who checks passwords, who is responsible for it working with 1000 users. ")}<strong>{tr("Без бэкенда витрина пустая.", "Бэкендсіз витрина бос.", "Without a backend the window is empty.")}</strong>
              </p>
              <p className="text-lg text-foreground/70 leading-relaxed">
                {tr("Бэкенд-разработчики обычно получают зарплату выше фронтенд-разработчиков — это более серьёзная инженерная работа с базами данных, безопасностью и серверами.", "Бэкенд-әзірлеушілер әдетте фронтенд-әзірлеушілерден жоғары жалақы алады — бұл дерекқорлармен, қауіпсіздікпен және серверлермен күрделірек инженерлік жұмыс.", "Backend developers usually earn more than frontend developers — it's more serious engineering work with databases, security and servers.")}
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-accent/5 rounded-2xl border border-accent/20">
                <div className="text-sm text-foreground/50 mb-1">{tr("Реальные технологии в курсе", "Курстағы нақты технологиялар", "Real technologies in the course")}</div>
                <div className="font-semibold">{tr("Python, Flask, FastAPI, SQLite, Docker — те же что в Yandex, Kaspi, inDriver", "Python, Flask, FastAPI, SQLite, Docker — Yandex, Kaspi, inDriver-дегідей", "Python, Flask, FastAPI, SQLite, Docker — the same as at Yandex, Kaspi, inDriver")}</div>
              </div>
              <div className="p-5 bg-accent-soft/8 rounded-2xl border border-accent-soft/25">
                <div className="text-sm text-foreground/50 mb-1">{tr("Зарплаты в Казахстане", "Қазақстандағы жалақылар", "Salaries in Kazakhstan")}</div>
                <div className="font-semibold">{tr("Junior backend: 350–500K ₸", "Junior backend: 350–500K ₸", "Junior backend: 350–500K ₸")}<br />Middle: 600K–1.2M ₸<br />Senior: 1.5M+ ₸</div>
              </div>
              <div className="p-5 bg-accent-3/8 rounded-2xl border border-accent-3/20">
                <div className="text-sm text-foreground/50 mb-1">{tr("Где работают", "Қайда жұмыс істейді", "Where they work")}</div>
                <div className="font-semibold">{tr("Везде где есть приложение: банки, такси, доставка, маркетплейсы, госсервисы.", "Қосымша бар жердің бәрінде: банктер, такси, жеткізу, маркетплейстер, мемлекеттік сервистер.", "Everywhere there's an app: banks, taxis, delivery, marketplaces, government services.")}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────── ПРОГРАММА (MODULES) ───────── */}
      <section id="program" className="max-w-6xl mx-auto px-6 py-20">
        <motion.div {...fadeIn} className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">{tr("Программа курса", "Курс бағдарламасы", "Course program")}</h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">{tr("2 модуля по 25+ уроков. Модуль 1 самодостаточен: в конце — рабочий REST API с авторизацией.", "25+ сабақтан 2 модуль. 1-модуль өзін-өзі қамтамасыз етеді: соңында — авторизациясы бар жұмыс істейтін REST API.", "2 modules of 25+ lessons each. Module 1 is self-contained: at the end — a working REST API with authorization.")}</p>
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
              <span className="text-sm text-foreground/50">🎯 {tr("Результат: ", "Нәтиже: ", "Result: ")}</span>
              <span className="font-semibold">{modules[activeModule].result}</span>
            </div>
          </div>

          <div className="space-y-4">
            {modules[activeModule].stages.map((s) => (
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
            <p className="text-lg text-white/60 max-w-2xl mx-auto">{tr("На каждом этапе ребёнок получает бейдж и сертификат. От Bot Maker до Backend Pro.", "Әр кезеңде бала бейдж бен сертификат алады. Bot Maker-ден Backend Pro-ға дейін.", "At each stage the child earns a badge and a certificate. From Bot Maker to Backend Pro.")}</p>
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

      {/* ───────── FUN-DAYS ───────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div {...fadeIn} className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">{tr("Fun-day каждые 5–6 уроков", "Әр 5–6 сабақ сайын Fun-day", "A Fun-day every 5–6 lessons")}</h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">{tr("Серьёзный курс ≠ скучный курс. Между блоками — разгрузочные уроки с челленджами и играми.", "Байыпты курс ≠ жалықтыратын курс. Блоктар арасында — челлендждер мен ойындары бар демалыс сабақтары.", "A serious course ≠ a boring course. Between blocks — lighter lessons with challenges and games.")}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "gamepad" as const, name: "Python Battle", lesson: tr("Урок 12", "12-сабақ", "Lesson 12"), desc: tr("Чтение open-source кода + соревнование на скорость", "Open-source кодты оқу + жылдамдыққа жарыс", "Reading open-source code + a speed contest") },
            { icon: "target" as const, name: tr("SQL-детектив", "SQL-детектив", "SQL detective"), lesson: tr("Урок 18", "18-сабақ", "Lesson 18"), desc: tr("Раскрыть кражу легендарного меча через 5 запросов", "5 сұраныс арқылы аңызға айналған семсердің ұрлығын ашу", "Solve the theft of a legendary sword in 5 queries") },
            { icon: "book" as const, name: tr("Читаем документацию", "Құжаттаманы оқимыз", "Reading documentation"), lesson: tr("Урок 28", "28-сабақ", "Lesson 28"), desc: tr("Подключить незнакомый API только через docs. БЕЗ AI", "Бейтаныс API-ді тек docs арқылы қосу. AI-СЫЗ", "Connect an unfamiliar API using only the docs. WITHOUT AI") },
            { icon: "settings" as const, name: "Debug Championship", lesson: tr("Урок 43", "43-сабақ", "Lesson 43"), desc: tr("Починить 5 сломанных эндпоинтов через debugger", "Debugger арқылы 5 сынған эндпоинтті түзету", "Fix 5 broken endpoints using the debugger") },
          ].map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 bg-white border border-border rounded-2xl hover:shadow-lg transition"
            >
              <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name={f.icon} className="h-6 w-6" /></span>
              <div className="text-xs text-foreground/50 mb-1">{f.lesson}</div>
              <h3 className="font-bold mb-2">{f.name}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────── AI-ПРОГРЕССИЯ ───────── */}
      <section className="border-y border-border bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.div {...fadeIn} className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">{tr("AI как инструмент,", "AI — құрал,", "AI as a tool,")}<br />{tr("не как замена", "алмастырушы емес", "not a replacement")}</h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">{tr("Чёткая прогрессия: от полной генерации до полной самостоятельности. Финальная защита — БЕЗ AI.", "Айқын прогрессия: толық генерациядан толық дербестікке дейін. Финалдық қорғау — AI-СЫЗ.", "A clear progression: from full generation to full independence. The final defense is WITHOUT AI.")}</p>
          </motion.div>

          <div className="space-y-3 max-w-4xl mx-auto">
            {aiProgression.map((a, i) => (
              <motion.div
                key={a.stage}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex flex-col md:flex-row md:items-center gap-4 p-5 bg-background border border-border rounded-2xl"
              >
                <div className="text-sm font-mono text-foreground/40 md:w-32 flex-shrink-0">{a.stage}</div>
                <div className="md:w-56 flex-shrink-0">
                  <span className="font-bold text-base">{a.mode}</span>
                </div>
                <p className="text-foreground/70 flex-1 text-sm">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── ИСТОРИЯ ПРО $400 ───────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div {...fadeIn} className="bg-gradient-to-br from-accent/8 to-accent-soft/8 border border-accent/20 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-8 items-center">
            <div className="text-9xl text-center">💸</div>
            <div>
              <span className="inline-block px-4 py-2 bg-white rounded-full text-sm font-medium mb-4">
                {tr("Урок 36 · Безопасность", "36-сабақ · Қауіпсіздік", "Lesson 36 · Security")}
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">{tr("«История про $400»", "«$400 туралы оқиға»", "'The $400 story'")}</h2>
              <p className="text-lg text-foreground/70 leading-relaxed mb-4">
                {tr("Реальный кейс: программист случайно запушил API-ключ в публичный GitHub. Через 5 минут боты нашли ключ, начали слать запросы. Счёт за API — ", "Нақты кейс: бағдарламашы API-кілтті кездейсоқ ашық GitHub-қа пушпен жіберді. 5 минуттан кейін боттар кілтті тауып, сұраныстар жібере бастады. API шоты — ", "A real case: a developer accidentally pushed an API key to a public GitHub. Within 5 minutes bots found the key and started sending requests. The API bill — ")}<strong>{tr("$400 за ночь", "бір түнде $400", "$400 overnight")}</strong>.
              </p>
              <p className="text-lg text-foreground/70 leading-relaxed">
                {tr("Эту историю ребёнок услышит ОДИН раз. Запомнит на ВСЮ жизнь. После этого ", "Бұл оқиғаны бала БІР рет естиді. ӨМІР бойы есінде сақтайды. Осыдан кейін ", "The child hears this story ONCE. Remembers it for LIFE. After that ")}<code className="px-2 py-0.5 bg-ink-1 text-white rounded text-sm">.env</code> {tr("и", "және", "and")} <code className="px-2 py-0.5 bg-ink-1 text-white rounded text-sm">.gitignore</code> {tr("будут автоматически.", "автоматты түрде болады.", "become automatic.")}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ───────── 2 УРОВНЯ ДЗ ───────── */}
      <section className="border-y border-border bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.div {...fadeIn} className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 grid gap-4">
              <div className="p-6 bg-accent/5 rounded-2xl border border-accent/20">
                <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name="book" className="h-6 w-6" /></span>
                <h3 className="text-lg font-bold mb-2">{tr("Уровень 1 — основной", "1-деңгей — негізгі", "Level 1 — the main one")}</h3>
                <p className="text-sm text-foreground/70">{tr("Полноценное задание для среднего ученика. Открывается сразу после видеоурока.", "Орташа оқушыға арналған толыққанды тапсырма. Видеосабақтан кейін бірден ашылады.", "A full task for an average student. Opens right after the video lesson.")}</p>
              </div>
              <div className="p-6 bg-accent-soft/8 rounded-2xl border border-accent-soft/25">
                <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name="clipboard" className="h-6 w-6" /></span>
                <h3 className="text-lg font-bold mb-2">{tr("Уровень 2 — поддерживающий", "2-деңгей — қолдау көрсететін", "Level 2 — the supporting one")}</h3>
                <p className="text-sm text-foreground/70">{tr("Шаблоны кода, подсказки, каркас. Открывается через 48ч если первый не получается. Это не стыд — это путь дальше.", "Код үлгілері, кеңестер, қаңқа. Біріншісі шықпаса, 48 сағаттан кейін ашылады. Бұл ұят емес — бұл алға жол.", "Code templates, hints, a scaffold. Opens after 48h if the first one doesn't work. It's not shameful — it's a way forward.")}</p>
              </div>
              <div className="p-6 bg-accent-3/8 rounded-2xl border border-accent-3/20">
                <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name="users" className="h-6 w-6" /></span>
                <h3 className="text-lg font-bold mb-2">{tr("Куратор группы", "Топ кураторы", "The group curator")}</h3>
                <p className="text-sm text-foreground/70">{tr("1 куратор на 10–15 учеников. Отвечает на вопросы за 24ч, проверяет ДЗ за 48ч, при необходимости — личная помощь.", "10–15 оқушыға 1 куратор. Сұрақтарға 24 сағатта жауап береді, үй тапсырмасын 48 сағатта тексереді, қажет болса — жеке көмек.", "1 curator per 10–15 students. Answers questions within 24h, checks homework within 48h, and gives personal help if needed.")}</p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
                {tr("Никто не застревает", "Ешкім тұрып қалмайды", "Nobody gets stuck")}
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">{tr("2 уровня ДЗ + живой куратор", "2 деңгейлі үй тапсырмасы + тірі куратор", "2 homework levels + a live curator")}</h2>
              <p className="text-lg text-foreground/70 mb-6 leading-relaxed">
                {tr("Если ребёнок застрял — это не его проблема, а наша. У каждого задания есть запасной путь. Если и он не получается — куратор помогает лично.", "Егер бала тұрып қалса — бұл оның емес, біздің мәселеміз. Әр тапсырманың қосалқы жолы бар. Ол да шықпаса — куратор жеке көмектеседі.", "If the child gets stuck, it's not their problem, it's ours. Every task has a backup path. If that doesn't work either, the curator helps personally.")}
              </p>
              <p className="text-lg text-foreground/70 leading-relaxed">
                {tr("Отдельный фокус на навыки: ", "Дағдыларға бөлек назар: ", "A separate focus on skills: ")}<strong>debugging</strong> (VS Code debugger), <strong>{tr("чтение чужого кода", "бөгде кодты оқу", "reading others' code")}</strong>, <strong>{tr("работа с документацией", "құжаттамамен жұмыс", "working with documentation")}</strong>. {tr("Это 70% работы реального разработчика.", "Бұл — нағыз әзірлеуші жұмысының 70%-ы.", "That's 70% of a real developer's work.")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────── РАСХОДЫ — ВСЁ БЕСПЛАТНО ───────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div {...fadeIn} className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">{tr("Все инструменты — ", "Барлық құралдар — ", "All the tools are ")}<span className="text-accent">{tr("бесплатные", "тегін", "free")}</span></h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">{tr("В отличие от геймдева, никаких доп. расходов на магазины приложений. Всё что используется в курсе — 0 ₸.", "Геймдевтен айырмашылығы, қосымша дүкендеріне ешқандай қосымша шығын жоқ. Курста қолданылатын бәрі — 0 ₸.", "Unlike game dev, no extra costs for app stores. Everything used in the course is 0 ₸.")}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: "code" as const, name: "Python + VS Code", price: tr("Бесплатно", "Тегін", "Free"), desc: tr("Установка за 15 минут на любой ОС", "Кез келген ОЖ-де 15 минутта орнату", "Installs in 15 minutes on any OS") },
            { icon: "bot" as const, name: "PythonAnywhere", price: tr("Бесплатно", "Тегін", "Free"), desc: tr("Хостинг бота 24/7", "24/7 бот хостингі", "24/7 bot hosting") },
            { icon: "container" as const, name: "Docker Desktop", price: tr("Бесплатно", "Тегін", "Free"), desc: tr("Для домашнего использования", "Үйде қолдануға арналған", "For home use") },
            { icon: "globe" as const, name: "Render.com", price: tr("Бесплатно", "Тегін", "Free"), desc: tr("Хостинг финального API в интернете", "Интернеттегі финалдық API хостингі", "Hosting the final API online") },
            { icon: "book" as const, name: tr("Все тренажёры", "Барлық тренажёрлар", "All the trainers"), price: tr("Бесплатно", "Тегін", "Free"), desc: tr("Питонтьютор, SQL Academy, Codewars на русском", "Питонтьютор, SQL Academy, Codewars орысша", "Pythontutor, SQL Academy, Codewars in Russian") },
            { icon: "git" as const, name: "GitHub", price: tr("Бесплатно", "Тегін", "Free"), desc: tr("Репозитории + GitHub Actions", "Репозиторийлер + GitHub Actions", "Repositories + GitHub Actions") },
          ].map((t) => (
            <div key={t.name} className="p-6 bg-white border border-border rounded-2xl">
              <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name={t.icon} className="h-6 w-6" /></span>
              <h3 className="font-bold mb-1">{t.name}</h3>
              <div className="text-accent font-bold mb-2">{t.price}</div>
              <p className="text-sm text-foreground/60">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── ПРЕПОДАВАТЕЛЬ ───────── */}
      <section className="bg-gradient-to-br from-accent/8 via-accent-soft/6 to-accent-3/8 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeIn} className="grid lg:grid-cols-[1fr_2fr] gap-12 items-center">
            <div className="aspect-square bg-gradient-to-br from-accent via-accent-soft to-accent-3 rounded-3xl flex items-center justify-center">
              <span className="font-display font-bold text-7xl text-white drop-shadow-lg">АК</span>
            </div>
            <div>
              <span className="inline-block px-4 py-2 bg-white rounded-full text-sm font-medium mb-4 font-mono">// {tr("преподаватель", "оқытушы", "instructor")}</span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-2">Айбат К.</h2>
              <p className="text-lg text-accent font-semibold mb-4">{tr("Backend-разработчик", "Backend-әзірлеуші", "Backend developer")} · Python</p>
              <p className="text-lg text-foreground/70 mb-6 leading-relaxed">
                {tr("Практикующий backend-разработчик на Python: Flask, FastAPI, базы данных, Docker. Учит подростков создавать ботов, API и реальные проекты. На курсе ведёт сквозной пример TaskMaster — от ТЗ до деплоя на Render.com.", "Python-дағы практик backend-әзірлеуші: Flask, FastAPI, дерекқорлар, Docker. Жасөспірімдерге боттар, API және нақты жобалар жасауды үйретеді. Курста TaskMaster сквозной мысалын жүргізеді — ТТ-дан Render.com-ға деплойға дейін.", "A practicing Python backend developer: Flask, FastAPI, databases, Docker. Teaches teens to build bots, APIs and real projects. In the course he runs the end-to-end TaskMaster example — from spec to deployment on Render.com.")}
              </p>
              <div className="flex flex-wrap gap-3">
                {[tr("5+ лет на Python", "Python-да 5+ жыл", "5+ years with Python"), tr("Production-проекты", "Production-жобалар", "Production projects"), tr("Опыт обучения подростков", "Жасөспірімдерді оқыту тәжірибесі", "Experience teaching teens"), "Mentor 1-on-1"].map((t) => (
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
            <div className="text-sm uppercase tracking-wider opacity-60 mb-3">{tr("Цена", "Баға", "Price")}</div>
            <div className="flex items-baseline justify-center gap-3 flex-wrap mb-3">
              <span className="text-4xl lg:text-5xl font-bold">75 000 ₸</span>
              <span className="text-white/50 text-2xl">/ {tr("месяц", "ай", "month")}</span>
            </div>
            <div className="text-white/60 text-sm">{tr("Одинаково весь период обучения · льготным категориям 60 000 ₸ · Kaspi-рассрочка 0%", "Оқудың бүкіл кезеңінде бірдей · жеңілдік санаттарына 60 000 ₸ · Kaspi-бөліп төлеу 0%", "The same throughout the whole course · 60 000 ₸ for eligible categories · Kaspi installments 0%")}</div>
          </div>

          <div className="space-y-3 mb-8">
            {[
              tr("✓ 52 урока по 2 часа", "✓ 2 сағаттан 52 сабақ", "✓ 52 lessons of 2 hours"),
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
              <div className="text-sm opacity-80 mb-1">{tr("Льготникам −20%", "Жеңілдік алушыларға −20%", "−20% for eligible students")}</div>
              <div className="text-xl font-bold">60 000 ₸</div>
              <div className="text-xs opacity-60">{tr("в месяц", "айына", "per month")}</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-sm opacity-60 mb-1">{tr("Kaspi-рассрочка", "Kaspi-бөліп төлеу", "Kaspi installments")}</div>
              <div className="text-xl font-bold">{tr("0% · 3 или 6 мес", "0% · 3 немесе 6 ай", "0% · 3 or 6 months")}</div>
              <div className="text-xs opacity-60">{tr("без переплаты", "үстеме төлемсіз", "no overpayment")}</div>
            </div>
          </div>

          <button className="w-full py-4 bg-accent hover:bg-white hover:text-foreground rounded-2xl font-semibold text-lg transition">
            {tr("Записаться на пробный урок", "Сынақ сабаққа жазылу", "Sign up for a trial lesson")} →
          </button>
          <p className="text-center text-sm text-white/50 mt-4">{tr("Пробный урок — бесплатно", "Сынақ сабақ — тегін", "The trial lesson is free")}</p>
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
            {tr("Запишитесь на бесплатный пробный урок — посмотрим вместе подходит ли курс ребёнку.", "Тегін сынақ сабаққа жазылыңыз — курс балаға сай келе ме, бірге көреміз.", "Sign up for a free trial lesson — let's see together whether the course suits your child.")}
          </motion.p>
          <motion.a {...fadeIn} href="#apply" className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-white hover:text-foreground rounded-2xl font-semibold text-lg transition shadow-lg">
            {tr("Записаться на пробный урок", "Сынақ сабаққа жазылу", "Sign up for a trial lesson")} →
          </motion.a>
        </div>
      </section>
    </main>
  );
}
