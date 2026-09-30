"use client";

import { useRef, useState } from "react";
import { useLang } from "../i18n/lang";

/**
 * «Твоя первая программа» прямо на первом экране: посетитель вписывает имя в строку кода,
 * жмёт ▶ — программа «выполняется» и здоровается с ним. Смысл: за 5 секунд человек не
 * читает про программирование, а уже программирует. После запуска — мягкий переход к записи.
 *
 * variant="float" — стеклянная карточка справа в герое (только ≥ lg, парит; CSS `.hero-card`);
 * variant="inline" — та же карточка в потоке под кнопками (телефон/планшет).
 */
export default function HeroCodeCard({ variant = "float", onCta }: { variant?: "float" | "inline"; onCta?: () => void }) {
  const { tr } = useLang();
  const [name, setName] = useState("");
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [out, setOut] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const hello = tr("Привет", "Сәлем", "Hello");
  const shown = name.trim() || tr("Айдар", "Айдар", "Aidar");

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const text = `${hello}, ${shown}!`;
    setState("running");
    setOut("");
    // «компиляция» 0.45с, затем вывод печатается по символу
    timers.current.push(
      setTimeout(() => {
        [...text].forEach((_, i) => {
          timers.current.push(setTimeout(() => setOut(text.slice(0, i + 1)), i * 38));
        });
        timers.current.push(setTimeout(() => setState("done"), text.length * 38 + 120));
      }, 450),
    );
  };

  const shell =
    variant === "float"
      ? "hero-card absolute bottom-44 right-8 z-20 hidden w-[340px] lg:block xl:right-16"
      : "relative mt-8 w-full max-w-md animate-fade-in-up delay-500 lg:hidden";

  return (
    <div className={shell}>
      <div
        className={`rounded-2xl border bg-[#0F0F1A]/55 p-4 shadow-2xl backdrop-blur-xl transition-[border-color,box-shadow] duration-500 ${
          state === "done" ? "border-accent/60 shadow-accent/30" : "border-white/20 shadow-black/40"
        }`}
      >
        <div className="mb-3 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B47]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FFB088]" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
          <span className="ml-2 font-mono text-[11px] text-white/45">first_program.py</span>
          <span className="ml-auto rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold text-accent-soft">
            {tr("Попробуй", "Байқап көр", "Try it")}
          </span>
        </div>

        <div className="font-mono text-[13px] leading-7 text-white/85">
          <label className="flex items-center whitespace-nowrap">
            <span className="text-white/85">name</span>
            <span className="px-1.5 text-white/45">=</span>
            <span className="text-accent">&quot;</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 14))}
              onKeyDown={(e) => e.key === "Enter" && run()}
              placeholder={tr("твоё имя", "атың", "your name")}
              aria-label={tr("Впиши своё имя", "Атыңды жаз", "Type your name")}
              className="w-[8.5rem] min-w-0 border-b border-dashed border-accent/60 bg-transparent px-0.5 text-accent caret-accent-soft placeholder:text-accent/45 focus:border-accent focus:outline-none focus-visible:outline-none"
            />
            <span className="text-accent">&quot;</span>
          </label>
          <p className="whitespace-nowrap">
            <span className="text-accent-soft">print</span>(<span className="text-accent-soft">f</span>
            <span className="text-accent">&quot;{hello}, {"{name}"}!&quot;</span>)
          </p>
        </div>

        <div className="mt-3 min-h-[3.25rem] rounded-lg bg-black/35 px-3 py-2 font-mono text-[13px] leading-6" aria-live="polite">
          {state === "idle" && <span className="text-white/35">{tr("# впиши имя и нажми ▶", "# атыңды жаз да ▶ бас", "# type your name and press ▶")}</span>}
          {state === "running" && !out && (
            <span className="inline-flex items-center gap-2 text-white/45">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-accent/30 border-t-accent" /> python first_program.py
            </span>
          )}
          {out && (
            <span className="text-white">
              <span className="text-white/40">&gt; </span>
              {out}
              {state === "running" && <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-blink bg-accent-soft" />}
            </span>
          )}
          {state === "done" && (
            <span className="block text-xs text-accent-soft">✓ {tr("это твоя первая программа на Python", "бұл сенің Python-дағы алғашқы бағдарламаң", "that's your first Python program")}</span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={run}
            disabled={state === "running"}
            className="shine inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M6 4l14 8-14 8z" /></svg>
            {state === "done" ? tr("Ещё раз", "Тағы", "Again") : tr("Запустить", "Іске қосу", "Run")}
          </button>
          {state === "done" && onCta && (
            <button onClick={onCta} className="btn-arrow text-sm font-semibold text-accent-soft transition-colors hover:text-white">
              {tr("Хочу дальше", "Әрі қарай", "I want more")} <span className="arrow" aria-hidden>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
