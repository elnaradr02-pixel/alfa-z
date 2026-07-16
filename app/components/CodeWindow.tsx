"use client";

import type { ReactNode } from "react";
import InteractiveCode from "./InteractiveCode";

/**
 * Переиспользуемое окно редактора/терминала (macOS-style): тёмная плашка с
 * тремя точками + имя файла, тело — либо скриншот проекта (image), либо
 * сниппет кода с лёгкой подсветкой (code), либо placeholder. Снизу —
 * статус-строка со стеком технологий (моно). Чистый CSS/SVG, без внешних
 * ассетов. Пивот на terminal-эстетику — см. память visual-3d-upgrade.
 */

type CodeWindowProps = {
  /** Имя файла в заголовке окна (моно). */
  title: string;
  /** Сниппет кода (строки через \n). Игнорируется, если задан image. */
  code?: string;
  /** URL скриншота проекта — приоритетнее code. */
  image?: string;
  imageAlt?: string;
  /** "cover" — обрезать под 4:3 (карточки курсов); "contain" — показать скрин целиком (галерея). */
  imageFit?: "cover" | "contain";
  /** Теги стека — статус-строка снизу. */
  stack?: string[];
  /** Оживить код: символы расступаются от курсора + «струящаяся» волна. */
  interactive?: boolean;
  className?: string;
};

const KEYWORDS = new Set([
  "import", "from", "export", "default", "function", "const", "let", "var",
  "return", "if", "elif", "else", "for", "while", "async", "await", "def",
  "class", "public", "private", "void", "new", "using", "final", "int",
  "float", "double", "char", "bool", "string", "extends", "override",
  "package", "include", "define", "true", "false", "None", "null",
]);

// Токенайзер одной строки: комментарии, строки, ключевые слова, числа.
function highlight(line: string, key: number): ReactNode {
  const tokens: ReactNode[] = [];
  const re =
    /(\/\/.*$|#\s[^\n]*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|([A-Za-z_]\w*)|(\d+\.?\d*)/g;
  let last = 0;
  let idx = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) tokens.push(line.slice(last, m.index));
    const [full, comment, str, word, num] = m;
    if (comment) tokens.push(<span key={idx} className="text-white/35">{full}</span>);
    else if (str) tokens.push(<span key={idx} className="text-[#FFB088]">{full}</span>);
    else if (word && KEYWORDS.has(word)) tokens.push(<span key={idx} className="text-accent">{full}</span>);
    else if (word) tokens.push(word);
    else if (num) tokens.push(<span key={idx} className="text-[#FFB088]">{full}</span>);
    else tokens.push(full);
    last = m.index + full.length;
    idx++;
  }
  if (last < line.length) tokens.push(line.slice(last));
  return (
    <span key={key} className="block whitespace-pre">
      {tokens.length ? tokens : " "}
    </span>
  );
}

export default function CodeWindow({
  title,
  code,
  image,
  imageAlt,
  imageFit = "cover",
  stack,
  interactive = false,
  className = "",
}: CodeWindowProps) {
  return (
    <div className={`overflow-hidden rounded-xl border border-white/10 bg-[#0F0F1A] shadow-xl ${className}`}>
      {/* Плашка окна */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white/[0.04] border-b border-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B47]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFB088]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFB088]" />
        <span className="ml-2.5 font-mono text-[11px] text-white/45 truncate">{title}</span>
      </div>

      {/* Тело */}
      {image ? (
        imageFit === "contain" ? (
          // Единый размер: фикс. рамка 3:2, скрин целиком по центру (letterbox на графите).
          <div className="aspect-[3/2] bg-[#0F0F1A] flex items-center justify-center overflow-hidden">
            <img
              src={image}
              alt={imageAlt ?? title}
              loading="lazy"
              decoding="async"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ) : (
          <img
            src={image}
            alt={imageAlt ?? title}
            loading="lazy"
            decoding="async"
            className="block w-full aspect-[4/3] object-cover"
          />
        )
      ) : code ? (
        interactive ? (
          <InteractiveCode code={code} />
        ) : (
          <pre className="m-0 overflow-hidden px-4 py-4 font-mono text-[11px] sm:text-xs leading-relaxed text-white/80">
            <code>{code.split("\n").map((l, i) => highlight(l, i))}</code>
          </pre>
        )
      ) : (
        <div className="flex min-h-[180px] items-center justify-center px-4 py-10">
          <span className="font-mono text-xs text-white/30">// screenshot placeholder</span>
        </div>
      )}

      {/* Статус-строка со стеком */}
      {stack && stack.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/10 px-4 py-2 font-mono text-[10px] text-white/40">
          {stack.map((t) => (
            <span key={t} className="whitespace-nowrap">{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}
