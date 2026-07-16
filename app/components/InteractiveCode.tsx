"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Живой терминал: код рендерится посимвольно, символы рядом с курсором
 * расступаются (волнообразное «отталкивание»), а в покое всё едва заметно
 * струится сверху вниз — эффект стекающего текста / водопада.
 *
 * Всё считается в rAF с прямой записью transform в DOM (без React-стейта на
 * кадр). На тач-устройствах и при prefers-reduced-motion эффект выключается —
 * рендерится статичный подсвеченный код (те же цвета, что в CodeWindow).
 */

const KEYWORDS = new Set([
  "import", "from", "export", "default", "function", "const", "let", "var",
  "return", "if", "elif", "else", "for", "while", "async", "await", "def",
  "class", "public", "private", "void", "new", "using", "final", "int",
  "float", "double", "char", "bool", "string", "extends", "override",
  "package", "include", "define", "true", "false", "None", "null",
]);

type Cls = "" | "kw" | "str" | "num" | "com";

const CLASS_NAME: Record<Cls, string> = {
  "": "",
  kw: "text-accent",
  str: "text-[#FFB088]",
  num: "text-[#FFB088]",
  com: "text-white/35",
};

// Разбивает строку на токены с классом подсветки.
function tokenize(line: string): { text: string; cls: Cls }[] {
  const out: { text: string; cls: Cls }[] = [];
  const re =
    /(\/\/.*$|#\s[^\n]*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|([A-Za-z_]\w*)|(\d+\.?\d*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) out.push({ text: line.slice(last, m.index), cls: "" });
    const [full, comment, str, word, num] = m;
    if (comment) out.push({ text: full, cls: "com" });
    else if (str) out.push({ text: full, cls: "str" });
    else if (word && KEYWORDS.has(word)) out.push({ text: full, cls: "kw" });
    else if (word) out.push({ text: word, cls: "" });
    else if (num) out.push({ text: full, cls: "num" });
    else out.push({ text: full, cls: "" });
    last = m.index + full.length;
  }
  if (last < line.length) out.push({ text: line.slice(last), cls: "" });
  return out;
}

const RADIUS = 105;   // радиус влияния курсора, px
const MAX_PUSH = 20;  // макс. смещение символа, px
const LERP = 0.18;    // сглаживание возврата
const MAX_CHARS = 1400; // выше — эффект выключаем ради производительности

export default function InteractiveCode({
  code,
  className = "",
}: {
  code: string;
  className?: string;
}) {
  const preRef = useRef<HTMLPreElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // enabled — тяжёлая per-char анимация (отталкивание от курсора). ТОЛЬКО десктоп:
  // на тач-устройствах сотни анимируемых спанов рвут GPU-память телефона (белый экран).
  const [enabled, setEnabled] = useState(false);
  // mobileDrift — лёгкая CSS-анимация всего блока (1 элемент) для «жизни» на мобилке.
  const [mobileDrift, setMobileDrift] = useState(false);

  // Модель символов (плоский список для рефов + построчная разметка).
  const { lines, total } = useMemo(() => {
    const rows = code.split("\n").map(tokenize);
    let count = 0;
    for (const row of rows) for (const t of row) count += t.text.length;
    return { lines: rows, total: count };
  }, [code]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const canHover = window.matchMedia("(hover: hover)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Десктоп (есть курсор) — богатая per-char анимация. Мобилка — только лёгкий CSS-дрейф.
    setEnabled(canHover && !reduced && total <= MAX_CHARS);
    setMobileDrift(!canHover && !reduced && total <= MAX_CHARS);
  }, [total]);

  useEffect(() => {
    if (!enabled) return;
    const pre = preRef.current;
    if (!pre) return;

    const nodes = charRefs.current;
    const n = nodes.length;
    const baseX = new Float32Array(n);
    const baseY = new Float32Array(n);
    const curX = new Float32Array(n);
    const curY = new Float32Array(n);

    // Базовые центры символов относительно контейнера (transform слой не влияет).
    function measure() {
      const box = pre.getBoundingClientRect();
      for (let i = 0; i < n; i++) {
        const el = nodes[i];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        baseX[i] = r.left - box.left + r.width / 2;
        baseY[i] = r.top - box.top + r.height / 2;
      }
    }
    measure();

    let px = -9999;
    let py = -9999;
    let active = false;

    const onMove = (e: PointerEvent) => {
      const box = pre.getBoundingClientRect();
      px = e.clientX - box.left;
      py = e.clientY - box.top;
      active = true;
    };
    const onLeave = () => {
      active = false;
      px = -9999;
      py = -9999;
    };

    pre.addEventListener("pointermove", onMove);
    pre.addEventListener("pointerleave", onLeave);
    // Палец подняли/жест прервали — сбрасываем «толчок», иначе символы залипнут смещёнными.
    pre.addEventListener("pointerup", onLeave);
    pre.addEventListener("pointercancel", onLeave);

    const ro = new ResizeObserver(() => measure());
    ro.observe(pre);

    let raf = 0;
    let running = false;
    const start = performance.now();
    const tick = (now: number) => {
      const t = now - start;
      for (let i = 0; i < n; i++) {
        const el = nodes[i];
        if (!el) continue;
        // Постоянная волна вниз — «струящийся» дрейф (виден и без курсора, в т.ч. на тач).
        let tx = Math.cos(t * 0.0012 + baseY[i] * 0.045) * 1.1;
        let ty = Math.sin(baseY[i] * 0.05 - t * 0.0042 + baseX[i] * 0.012) * 2.6;
        // Отталкивание от курсора/пальца.
        if (active) {
          const dx = baseX[i] - px;
          const dy = baseY[i] - py;
          const dist = Math.hypot(dx, dy);
          if (dist < RADIUS) {
            const f = 1 - dist / RADIUS;
            const push = f * f * MAX_PUSH;
            const inv = dist > 0.01 ? 1 / dist : 0;
            tx += dx * inv * push;
            ty += dy * inv * push;
          }
        }
        curX[i] += (tx - curX[i]) * LERP;
        curY[i] += (ty - curY[i]) * LERP;
        el.style.transform = `translate3d(${curX[i].toFixed(2)}px,${curY[i].toFixed(2)}px,0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    // Крутим кадры только когда терминал виден — экономит батарею и держит FPS
    // при нескольких терминалах на странице (особенно на телефоне).
    const start_loop = () => { if (!running) { running = true; measure(); raf = requestAnimationFrame(tick); } };
    const stop_loop = () => { if (running) { running = false; cancelAnimationFrame(raf); raf = 0; } };
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) start_loop(); else stop_loop(); },
      { threshold: 0 },
    );
    io.observe(pre);

    return () => {
      stop_loop();
      pre.removeEventListener("pointermove", onMove);
      pre.removeEventListener("pointerleave", onLeave);
      pre.removeEventListener("pointerup", onLeave);
      pre.removeEventListener("pointercancel", onLeave);
      ro.disconnect();
      io.disconnect();
    };
  }, [enabled, lines]);

  // Плоский индекс символа для рефов.
  let idx = -1;
  charRefs.current = [];

  return (
    <pre
      ref={preRef}
      className={`m-0 overflow-hidden px-4 py-4 font-mono text-[11px] sm:text-xs leading-relaxed text-white/80 ${enabled ? "cursor-crosshair" : ""} ${className}`}
    >
      <code className={mobileDrift ? "code-drift block" : undefined}>
        {lines.map((row, li) => (
          <span key={li} className="block whitespace-pre">
            {row.length === 0 ? (
              " "
            ) : (
              row.map((tok, ti) =>
                Array.from(tok.text).map((ch) => {
                  idx++;
                  const at = idx;
                  return (
                    <span
                      key={`${li}-${ti}-${at}`}
                      ref={enabled ? (el) => { charRefs.current[at] = el; } : undefined}
                      className={`inline-block whitespace-pre ${CLASS_NAME[tok.cls]}`}
                    >
                      {ch}
                    </span>
                  );
                })
              )
            )}
          </span>
        ))}
      </code>
    </pre>
  );
}
