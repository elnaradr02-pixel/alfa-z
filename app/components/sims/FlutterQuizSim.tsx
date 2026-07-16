"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/app/i18n/lang";

/**
 * FlutterQuizSim — интерактивная демка курса «Мобильная разработка».
 * Внутри окна редактора (quiz_app.dart) живёт макет телефона, в котором
 * крутится персональный квиз «Какой ты персонаж?»: 3 вопроса → результат.
 * Чистый React + Tailwind, без внешних ассетов. Всё тапабельно (мышь + тач).
 */

type CharKey = "hero" | "mage" | "ninja" | "robot";

export default function FlutterQuizSim() {
  const { tr } = useLang();

  // Каждый ответ добавляет очко персонажу. Победитель — результат квиза.
  const questions: {
    q: [string, string, string];
    options: { label: [string, string, string]; char: CharKey }[];
  }[] = [
    {
      q: ["Пятница вечер — твой план?", "Жұма кеші — жоспарың қандай?", "Friday night — your plan?"],
      options: [
        { label: ["Спасать друзей", "Достарды құтқару", "Save my friends"], char: "hero" },
        { label: ["Изучать новое", "Жаңаны үйрену", "Study something new"], char: "mage" },
        { label: ["Тихо, в тени", "Тыныш, көлеңкеде", "Quietly, in the shadows"], char: "ninja" },
      ],
    },
    {
      q: ["Как решаешь проблему?", "Мәселені қалай шешесің?", "How do you solve a problem?"],
      options: [
        { label: ["В лоб, напролом", "Тікелей, батыл", "Head-on, brute force"], char: "hero" },
        { label: ["По алгоритму", "Алгоритммен", "By an algorithm"], char: "robot" },
        { label: ["Хитрым планом", "Айлакер жоспармен", "With a clever plan"], char: "ninja" },
      ],
    },
    {
      q: ["Твоя суперсила?", "Суперкүшің қандай?", "Your superpower?"],
      options: [
        { label: ["Сила и смелость", "Күш пен батылдық", "Strength & courage"], char: "hero" },
        { label: ["Знание и магия", "Білім мен сиқыр", "Knowledge & magic"], char: "mage" },
        { label: ["Точность 100%", "100% дәлдік", "100% precision"], char: "robot" },
      ],
    },
  ];

  const results: Record<
    CharKey,
    { emoji: string; name: [string, string, string]; desc: [string, string, string] }
  > = {
    hero: {
      emoji: "🦸",
      name: ["Герой", "Батыр", "Hero"],
      desc: ["Смелый, идёшь первым в бой", "Батыл, әрқашан алда", "Brave, first into the fight"],
    },
    mage: {
      emoji: "🧙",
      name: ["Маг", "Сиқыршы", "Mage"],
      desc: ["Мудрость — твоё оружие", "Даналық — сенің қаруың", "Wisdom is your weapon"],
    },
    ninja: {
      emoji: "🥷",
      name: ["Ниндзя", "Ниндзя", "Ninja"],
      desc: ["Быстрый, тихий, точный", "Жылдам, тыныш, дәл", "Fast, silent, precise"],
    },
    robot: {
      emoji: "🤖",
      name: ["Робот", "Робот", "Robot"],
      desc: ["Логика без ошибок", "Қатесіз логика", "Flawless logic"],
    },
  };

  const [step, setStep] = useState(0); // 0..2 вопросы, 3 = результат
  const [counts, setCounts] = useState<Record<CharKey, number>>({
    hero: 0,
    mage: 0,
    ninja: 0,
    robot: 0,
  });

  const pick = (char: CharKey) => {
    setCounts((prev) => ({ ...prev, [char]: prev[char] + 1 }));
    setStep((s) => s + 1);
  };

  const restart = () => {
    setCounts({ hero: 0, mage: 0, ninja: 0, robot: 0 });
    setStep(0);
  };

  // Победитель: макс. очков (при равенстве — первый в порядке hero→mage→ninja→robot).
  const winner = (Object.keys(counts) as CharKey[]).reduce((a, b) =>
    counts[b] > counts[a] ? b : a,
  );

  const isResult = step >= questions.length;
  const progress = isResult ? 1 : step / questions.length;

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0F0F1A] shadow-xl">
      {/* Title bar редактора */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white/[0.04] border-b border-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B47]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFB088]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFB088]" />
        <span className="ml-2.5 font-mono text-[11px] text-white/45">quiz_app.dart</span>
      </div>

      <div className="p-4 sm:p-5 min-h-[360px] flex items-center justify-center">
        {/* Макет телефона */}
        <div className="relative w-[260px] rounded-[2.5rem] border border-white/15 bg-[#1A1A2A] p-2.5 shadow-2xl">
          {/* Экран */}
          <div className="relative overflow-hidden rounded-[2rem] bg-[#FFFBF5] text-[#0F0F1A]">
            {/* Статус-бар + нотч */}
            <div className="relative flex items-center justify-between px-5 pt-2.5 pb-1 text-[10px] font-medium text-[#0F0F1A]/60">
              <span>9:41</span>
              <span className="absolute left-1/2 top-1.5 h-4 w-16 -translate-x-1/2 rounded-full bg-[#1A1A2A]" />
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-3 rounded-[2px] border border-current" />
              </span>
            </div>

            {/* Прогресс-бар */}
            <div className="px-5 pt-2">
              <div className="flex items-center justify-between pb-1.5 text-[10px] font-medium text-[#0F0F1A]/50">
                <span>{tr("Какой ты персонаж?", "Сен қай кейіпкерсің?", "Which character are you?")}</span>
                <span>
                  {isResult
                    ? tr("Готово", "Дайын", "Done")
                    : `${step + 1}/${questions.length}`}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#0F0F1A]/10">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  initial={false}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                />
              </div>
            </div>

            {/* Контент */}
            <div className="min-h-[248px] px-5 py-4">
              <AnimatePresence mode="wait">
                {!isResult ? (
                  <motion.div
                    key={`q-${step}`}
                    initial={{ opacity: 0, x: 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -28 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">
                      {tr("Вопрос", "Сұрақ", "Question")} {step + 1}
                    </p>
                    <h3 className="mt-1 text-[17px] font-bold leading-snug">
                      {tr(...questions[step].q)}
                    </h3>

                    <div className="mt-4 flex flex-col gap-2.5">
                      {questions[step].options.map((opt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => pick(opt.char)}
                          className="w-full rounded-2xl border border-[#0F0F1A]/10 bg-white px-4 py-3 text-left text-[14px] font-medium text-[#0F0F1A] shadow-sm transition-all duration-150 active:scale-[0.97] hover:border-accent hover:bg-accent/5"
                        >
                          {tr(...opt.label)}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className="flex h-full flex-col items-center justify-center text-center"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.05 }}
                      className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-accent/15 to-[#FFB088]/25 text-[52px]"
                    >
                      {results[winner].emoji}
                    </motion.div>

                    <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-accent">
                      {tr("Ты —", "Сен —", "You are —")}
                    </p>
                    <h3 className="mt-0.5 text-[22px] font-extrabold">
                      {tr(...results[winner].name)}
                    </h3>
                    <p className="mt-1 text-[13px] text-[#0F0F1A]/60">
                      {tr(...results[winner].desc)}
                    </p>

                    <button
                      type="button"
                      onClick={restart}
                      className="mt-5 w-full rounded-2xl bg-accent px-4 py-3 text-[14px] font-bold text-white shadow-md transition-all duration-150 hover:bg-accent-hover active:scale-[0.97]"
                    >
                      {tr("Пройти заново", "Қайта өту", "Take it again")}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
