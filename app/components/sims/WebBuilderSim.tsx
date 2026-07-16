"use client";

import { useState } from "react";
import Icon from "@/app/components/Icon";
import { useLang } from "@/app/i18n/lang";

/**
 * Интерактивный конструктор лендинга для курса «Веб-разработка / Frontend».
 * Пользователь меняет заголовок, текст кнопки, акцентный цвет (только бренд-палитра),
 * скругление и тему карточки — превью и сгенерированный JSX обновляются мгновенно.
 * Всё офлайн, без сети и внешних ассетов; текст рендерится как обычные children.
 */

type Swatch = { name: string; value: string };

// Только бренд-палитра — никаких произвольных/lime/teal цветов.
const SWATCHES: Swatch[] = [
  { name: "coral", value: "#FF6B47" },
  { name: "peach", value: "#FFB088" },
  { name: "graphite", value: "#0F0F1A" },
  { name: "cream", value: "#FFFBF5" },
];

export default function WebBuilderSim() {
  const { tr } = useLang();

  const [headline, setHeadline] = useState(
    tr("Моя первая страница", "Менің алғашқы бетім", "My first page"),
  );
  const [label, setLabel] = useState(tr("Кнопка", "Түйме", "Button"));
  const [accent, setAccent] = useState("#FF6B47");
  const [rounded, setRounded] = useState(true);
  const [dark, setDark] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [showCode, setShowCode] = useState(false);

  // Читаемый цвет текста на кнопке: тёмный акцент → белый текст, светлый → тёмный.
  const lightAccents = new Set(["#FFB088", "#FFFBF5"]);
  const btnText = lightAccents.has(accent) ? "#0F0F1A" : "#FFFFFF";

  // Тема карточки превью (светлая cream/белая — на бренде для превью сайта).
  const cardBg = dark ? "#0F0F1A" : "#FFFBF5";
  const cardText = dark ? "#FFFBF5" : "#0F0F1A";
  const cardMuted = dark ? "rgba(255,251,245,0.55)" : "rgba(15,15,26,0.55)";
  const cardBorder = dark ? "rgba(255,255,255,0.10)" : "rgba(15,15,26,0.10)";
  const radius = rounded ? 16 : 0;

  const iconJsx = showIcon ? `\n      <span className="badge">✨</span>` : "";
  const generatedCode = `export default function Hero() {
  return (
    <section className="hero"${dark ? ' data-theme="dark"' : ""}>${iconJsx}
      <h1>${headline || "..."}</h1>
      <button style={{ background: "${accent}", borderRadius: ${radius} }}>
        ${label || "..."}
      </button>
    </section>
  );
}`;

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0F0F1A] shadow-xl">
      {/* Заголовок окна редактора */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white/[0.04] border-b border-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B47]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFB088]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFB088]" />
        <span className="ml-2.5 font-mono text-[11px] text-white/45">App.jsx</span>
      </div>

      <div className="p-4 sm:p-5 min-h-[360px]">
        <div className="flex flex-col gap-5 sm:flex-row">
          {/* ── Панель управления ── */}
          <div className="flex flex-col gap-4 sm:w-1/2">
            {/* Заголовок */}
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wide text-white/45">
                {tr("Заголовок", "Тақырып", "Headline")}
              </span>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-[13px] text-white/90 outline-none transition-colors focus:border-accent"
              />
            </label>

            {/* Текст кнопки */}
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wide text-white/45">
                {tr("Текст кнопки", "Түйме мәтіні", "Button label")}
              </span>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-[13px] text-white/90 outline-none transition-colors focus:border-accent"
              />
            </label>

            {/* Акцентный цвет */}
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wide text-white/45">
                {tr("Цвет", "Түс", "Color")}
              </span>
              <div className="flex gap-2">
                {SWATCHES.map((s) => {
                  const active = accent === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      aria-label={s.name}
                      onClick={() => setAccent(s.value)}
                      className={
                        "h-8 w-8 rounded-full border-2 transition-transform active:scale-90 " +
                        (active ? "scale-110 border-white" : "border-white/20")
                      }
                      style={{ backgroundColor: s.value }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Тумблеры */}
            <div className="flex flex-col gap-2.5">
              <Toggle
                label={tr("Скругление", "Дөңгелектеу", "Rounded")}
                on={rounded}
                onClick={() => setRounded((v) => !v)}
              />
              <Toggle
                label={tr("Тёмная тема", "Қараңғы тема", "Dark theme")}
                on={dark}
                onClick={() => setDark((v) => !v)}
              />
              <Toggle
                label={tr("Иконка", "Белгіше", "Icon")}
                on={showIcon}
                onClick={() => setShowIcon((v) => !v)}
              />
            </div>
          </div>

          {/* ── Живое превью ── */}
          <div className="flex flex-col gap-2 sm:w-1/2">
            <span className="font-mono text-[11px] uppercase tracking-wide text-white/45">
              {tr("Превью", "Превью", "Preview")}
            </span>
            <div
              className="flex flex-1 flex-col items-center justify-center gap-4 border p-6 text-center transition-all"
              style={{
                backgroundColor: cardBg,
                color: cardText,
                borderColor: cardBorder,
                borderRadius: radius,
                minHeight: 220,
              }}
            >
              {showIcon && (
                <span
                  className="flex h-11 w-11 items-center justify-center text-xl"
                  style={{
                    backgroundColor: accent + "26",
                    color: accent === "#FFFBF5" ? "#FF6B47" : accent,
                    borderRadius: rounded ? 12 : 0,
                  }}
                >
                  ✨
                </span>
              )}
              <h1 className="text-xl font-bold leading-tight sm:text-2xl">
                {headline || tr("Заголовок…", "Тақырып…", "Headline…")}
              </h1>
              <p className="text-[12px]" style={{ color: cardMuted }}>
                {tr(
                  "Собрано в браузере за пару минут",
                  "Браузерде бірер минутта жиналды",
                  "Built in the browser in minutes",
                )}
              </p>
              <button
                type="button"
                className="px-5 py-2.5 text-[14px] font-semibold transition-transform active:scale-95"
                style={{
                  backgroundColor: accent,
                  color: btnText,
                  borderRadius: rounded ? 10 : 0,
                }}
              >
                {label || tr("Кнопка", "Түйме", "Button")}
              </button>
            </div>
          </div>
        </div>

        {/* Раскрывающийся код */}
        <button
          type="button"
          onClick={() => setShowCode((v) => !v)}
          className="mt-4 flex items-center gap-1.5 font-mono text-[11px] text-white/45 transition-colors hover:text-white/80"
        >
          <Icon name="code" width={13} height={13} />
          {showCode
            ? tr("скрыть код", "кодты жасыру", "hide code")
            : tr("показать код", "кодты көрсету", "show code")}
        </button>

        {showCode && (
          <pre className="mt-2 overflow-x-auto rounded-lg border border-white/10 bg-black/30 p-3 font-mono text-[11px] leading-relaxed text-white/70">
            <code>{generatedCode}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

function Toggle({
  label,
  on,
  onClick,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-left transition-colors hover:bg-white/[0.06] active:bg-white/10"
    >
      <span className="font-mono text-[12px] text-white/80">{label}</span>
      <span
        className={
          "relative h-5 w-9 shrink-0 rounded-full transition-colors " +
          (on ? "bg-accent" : "bg-white/15")
        }
      >
        <span
          className={
            "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all " +
            (on ? "left-[18px]" : "left-0.5")
          }
        />
      </span>
    </button>
  );
}
