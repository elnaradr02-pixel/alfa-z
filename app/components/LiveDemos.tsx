"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/app/i18n/lang";
import Icon, { type IconName } from "@/app/components/Icon";
import TelegramBotSim from "@/app/components/sims/TelegramBotSim";
import FlutterQuizSim from "@/app/components/sims/FlutterQuizSim";
import UnityMiniGame from "@/app/components/sims/UnityMiniGame";
import CaesarCipherSim from "@/app/components/sims/CaesarCipherSim";
import WebBuilderSim from "@/app/components/sims/WebBuilderSim";

/**
 * Живые кликабельные демо вместо статичных скриншотов: по одному симулятору
 * на каждый курс. Вкладки сверху, активный симулятор рендерится ниже.
 * Каждый симулятор — самодостаточный клиентский компонент в тёмной рамке
 * терминала; переключение вкладки перемонтирует демо (сброс состояния).
 */

type Tab = {
  key: string;
  icon: IconName;
  label: string;
  desc: string;
  Comp: React.ComponentType;
};

export default function LiveDemos() {
  const { tr, locale } = useLang();

  const tabs: Tab[] = [
    {
      key: "backend",
      icon: "server",
      label: tr("Бэкенд", "Бэкенд", "Backend"),
      desc: tr(
        "Симулятор Telegram-бота: жмёшь команды — бот отвечает по логике if / elif / else. Ровно это ребёнок пишет на первых уроках Python.",
        "Telegram-бот симуляторы: командаларды басасың — бот if / elif / else логикасымен жауап береді. Дәл осыны бала Python-ның алғашқы сабақтарында жазады.",
        "A Telegram bot simulator: press commands and the bot replies via if / elif / else logic. Exactly what your child writes in the first Python lessons.",
      ),
      Comp: TelegramBotSim,
    },
    {
      key: "mobile",
      icon: "smartphone",
      label: tr("Мобильная", "Мобильді", "Mobile"),
      desc: tr(
        "Настоящее Flutter-приложение в рамке телефона: тапаешь ответы — квиз ведёт к результату. Первое приложение ученик собирает за 3 недели.",
        "Телефон рамкасындағы нағыз Flutter қосымшасы: жауаптарды тапасың — квиз нәтижеге жеткізеді. Алғашқы қосымшаны оқушы 3 аптада жинайды.",
        "A real Flutter app in a phone frame: tap answers and the quiz leads to a result. Students build their first app in 3 weeks.",
      ),
      Comp: FlutterQuizSim,
    },
    {
      key: "gamedev",
      icon: "gamepad",
      label: tr("Геймдев", "Геймдев", "Game dev"),
      desc: tr(
        "Мини-игра на Unity-логике: лови монеты стрелками, мышкой или пальцем. Играбельная 2D-игра — реальный проект из курса.",
        "Unity-логикасындағы мини-ойын: тиындарды бағыттауыш, тінтуір не саусақпен ұста. Ойналатын 2D-ойын — курстан нақты жоба.",
        "A mini-game on Unity logic: catch coins with arrows, mouse or finger. A playable 2D game — a real project from the course.",
      ),
      Comp: UnityMiniGame,
    },
    {
      key: "cs50",
      icon: "graduation",
      label: "CS50",
      desc: tr(
        "Легендарное задание Гарварда — шифр Цезаря: вводишь текст и сдвиг, видишь шифр и код на C рядом. Так учат мыслить как программист.",
        "Гарвардтың аңызға айналған тапсырмасы — Цезарь шифрі: мәтін мен жылжуды енгізесің, шифр мен C кодын қатар көресің. Осылай программист сияқты ойлауды үйретеді.",
        "Harvard's legendary exercise — the Caesar cipher: enter text and a shift, see the cipher and the C code side by side. This is how you learn to think like a programmer.",
      ),
      Comp: CaesarCipherSim,
    },
    {
      key: "frontend",
      icon: "code",
      label: tr("Фронтенд", "Фронтенд", "Frontend"),
      desc: tr(
        "Живой конструктор сайта: меняешь заголовок, цвет и кнопку — превью и код обновляются мгновенно. Так работает настоящая веб-разработка.",
        "Тірі сайт конструкторы: тақырыпты, түсті және батырманы өзгертесің — алдын ала қарау мен код лезде жаңарады. Нағыз веб-әзірлеу осылай жұмыс істейді.",
        "A live website builder: change the headline, color and button — the preview and code update instantly. This is how real web development works.",
      ),
      Comp: WebBuilderSim,
    },
  ];

  const [active, setActive] = useState(0);
  const ActiveComp = tabs[active].Comp;

  return (
    <div>
      {/* Вкладки курсов */}
      <div className="mb-6 flex flex-wrap gap-2 sm:gap-3">
        {tabs.map((t, i) => {
          const on = i === active;
          return (
            <button
              key={t.key}
              onClick={() => setActive(i)}
              aria-pressed={on}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                on
                  ? "border-accent bg-accent text-white shadow-lg shadow-accent/30"
                  : "border-border bg-surface text-foreground/65 hover:border-accent/40 hover:text-foreground"
              }`}
            >
              <Icon name={t.icon} className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem] gap-6 lg:gap-8 items-start">
        {/* Активный симулятор */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${tabs[active].key}-${locale}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <ActiveComp />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Пояснение к активному демо */}
        <motion.div
          key={`desc-${tabs[active].key}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="lg:sticky lg:top-24"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-accent animate-soft-pulse" />
              <span className="relative h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              {tr("Это не видео — попробуй сам", "Бұл видео емес — өзің көр", "Not a video — try it yourself")}
            </span>
          </div>
          <p className="text-base sm:text-lg text-foreground/75 leading-relaxed">{tabs[active].desc}</p>
        </motion.div>
      </div>
    </div>
  );
}
