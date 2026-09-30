"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "../i18n/lang";

/**
 * «Твоя первая программа» прямо на первом экране: посетитель вписывает имя в строку кода,
 * жмёт ▶ — программа «выполняется» и здоровается с ним. Смысл: за 5 секунд человек не
 * читает про программирование, а уже программирует. После запуска — мягкий переход к записи.
 *
 * Автопоказ: пока посетитель ничего не трогает, карточка сама «печатает» пару имён и
 * запускает код (как живой урок), затем приглашает попробовать самому. Любое касание
 * карточки сразу останавливает автопоказ. Стартует после заставки и только когда карточка
 * реально на экране (у скрытой копии для другого размера экрана автопоказа нет).
 * При prefers-reduced-motion автопоказа нет.
 */
export default function HeroCodeCard({ onCta, className = "", floating = false }: { onCta?: () => void; className?: string; floating?: boolean }) {
  const { tr, locale } = useLang();
  const [name, setName] = useState("");
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [out, setOut] = useState("");
  const [invite, setInvite] = useState(false);
  const [demo, setDemo] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const runTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const demoTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const touched = useRef(false);

  const hello = tr("Привет", "Сәлем", "Hello");
  const fallback = tr("Айдар", "Айдар", "Aidar");

  const run = (forName?: string) => {
    runTimers.current.forEach(clearTimeout);
    runTimers.current = [];
    const text = `${hello}, ${(forName ?? name).trim() || fallback}!`;
    setState("running");
    setOut("");
    // «компиляция» 0.45с, затем вывод печатается по символу
    runTimers.current.push(
      setTimeout(() => {
        [...text].forEach((_, i) => {
          runTimers.current.push(setTimeout(() => setOut(text.slice(0, i + 1)), i * 38));
        });
        runTimers.current.push(setTimeout(() => setState("done"), text.length * 38 + 120));
      }, 450),
    );
  };

  const stopDemo = () => {
    if (touched.current) return;
    touched.current = true;
    demoTimers.current.forEach(clearTimeout);
    demoTimers.current = [];
    setDemo(false);
    setInvite(false);
  };

  // ── Автопоказ ──
  useEffect(() => {
    const el = rootRef.current;
    if (!el || touched.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const names = locale === "en" ? ["Aruzhan", "Daniyar"] : ["Аружан", "Данияр"];
    const introDelay = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--intro-delay")) || 0) * 1000;
    const T = (fn: () => void, ms: number) => demoTimers.current.push(setTimeout(fn, ms));

    const play = () => {
      setDemo(true);
      let t = 0;
      names.forEach((n) => {
        // очистить поле → печатать имя → запустить → подержать результат
        T(() => { setName(""); setState("idle"); setOut(""); }, t);
        t += 250;
        [...n].forEach((_, i) => { T(() => setName(n.slice(0, i + 1)), t); t += 120; });
        t += 400;
        T(() => run(n), t);
        t += 450 + (hello.length + n.length + 3) * 38 + 2300;
      });
      // финал: поле пустое, приглашение попробовать самому
      T(() => { setName(""); setState("idle"); setOut(""); setDemo(false); setInvite(true); }, t);
    };

    let started = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started && !touched.current) {
        started = true;
        io.disconnect();
        T(play, introDelay + 1100);
      }
    }, { threshold: 0.6 });
    io.observe(el);

    return () => {
      io.disconnect();
      demoTimers.current.forEach(clearTimeout);
      demoTimers.current = [];
    };
    // язык меняется — перезапускать демо не нужно
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => runTimers.current.forEach(clearTimeout), []);

  return (
    <div ref={rootRef} className={className} onPointerDown={stopDemo} onFocusCapture={stopDemo}>
      <div
        className={`${floating ? "hero-card" : ""} rounded-2xl border bg-[#0F0F1A]/85 p-4 shadow-2xl transition-[border-color,box-shadow] duration-500 sm:p-5 md:bg-[#0F0F1A]/55 md:backdrop-blur-xl ${
          state === "done" ? "border-accent/60 shadow-accent/30" : "border-white/20 shadow-black/40"
        }`}
      >
        <div className="mb-3 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B47]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FFB088]" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
          <span className="ml-2 font-mono text-[11px] text-white/60">first_program.py</span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold text-accent-soft">
            {demo && <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-accent" />}
            {demo ? tr("Идёт урок", "Сабақ жүріп жатыр", "Live demo") : tr("Попробуй", "Байқап көр", "Try it")}
          </span>
        </div>

        <div className="font-mono text-[13px] leading-7 text-white/85 sm:text-sm">
          <label className="flex items-center whitespace-nowrap">
            <span className="text-white/85">name</span>
            <span className="px-1.5 text-white/45">=</span>
            <span className="text-accent">&quot;</span>
            <input
              value={name}
              onChange={(e) => { stopDemo(); setName(e.target.value.slice(0, 14)); }}
              onKeyDown={(e) => e.key === "Enter" && run()}
              placeholder={tr("твоё имя", "атың", "your name")}
              aria-label={tr("Впиши своё имя", "Атыңды жаз", "Type your name")}
              className={`w-[9.5rem] min-w-0 border-b border-dashed bg-transparent px-0.5 text-base text-accent caret-accent-soft placeholder:text-accent/45 focus:border-accent focus:outline-none focus-visible:outline-none md:w-[8.5rem] md:text-[13px] ${
                invite ? "animate-soft-pulse border-accent" : "border-accent/60"
              }`}
            />
            <span className="text-accent">&quot;</span>
          </label>
          <p className="whitespace-nowrap">
            <span className="text-accent-soft">print</span>(<span className="text-accent-soft">f</span>
            <span className="text-accent">&quot;{hello}, {"{name}"}!&quot;</span>)
          </p>
        </div>

        <div className="mt-3 min-h-[3.25rem] rounded-lg bg-black/35 px-3 py-2 font-mono text-[13px] leading-6" aria-live="polite">
          {state === "idle" && (
            <span className={invite ? "text-accent-soft" : "text-white/70"}>
              {invite
                ? tr("# теперь твоя очередь — впиши своё имя ↑", "# енді сенің кезегің — атыңды жаз ↑", "# your turn — type your name ↑")
                : tr("# впиши имя и нажми ▶", "# атыңды жаз да ▶ бас", "# type your name and press ▶")}
            </span>
          )}
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
            onClick={() => { stopDemo(); run(); }}
            disabled={state === "running" && !demo}
            className="shine inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M6 4l14 8-14 8z" /></svg>
            {state === "done" && !demo ? tr("Ещё раз", "Тағы", "Again") : tr("Запустить", "Іске қосу", "Run")}
          </button>
          {state === "done" && !demo && onCta && (
            <button onClick={onCta} className="btn-arrow inline-flex min-h-11 items-center gap-1 px-2 text-sm font-semibold text-accent-soft transition-colors hover:text-white">
              {tr("Хочу дальше", "Әрі қарай", "I want more")} <span className="arrow" aria-hidden>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
