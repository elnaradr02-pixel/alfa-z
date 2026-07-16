"use client";

import { useMemo, useState } from "react";
import Icon from "@/app/components/Icon";
import { useLang } from "@/app/i18n/lang";

/**
 * Интерактивный симулятор шифра Цезаря — культовый пример из гарвардского CS50.
 * Пользователь вводит текст, двигает ключ (сдвиг 1–25) слайдером или +/- кнопками,
 * и мгновенно видит шифротекст. Оформлено как терминал/редактор с файлом caesar.c.
 * Работает и мышью, и на тач-устройствах; не падает на пустом вводе и не-буквах.
 */

const A_UPPER = 65;
const A_LOWER = 97;

/** Сдвигает одну букву A–Z / a–z на key позиций; остальные символы без изменений. */
function shiftChar(ch: string, key: number): string {
  const code = ch.charCodeAt(0);
  if (code >= A_UPPER && code <= A_UPPER + 25) {
    return String.fromCharCode(((code - A_UPPER + key) % 26) + A_UPPER);
  }
  if (code >= A_LOWER && code <= A_LOWER + 25) {
    return String.fromCharCode(((code - A_LOWER + key) % 26) + A_LOWER);
  }
  return ch;
}

function caesar(text: string, key: number): string {
  let out = "";
  for (const ch of text) out += shiftChar(ch, key);
  return out;
}

const ALPHABET = Array.from({ length: 26 }, (_, i) => String.fromCharCode(A_UPPER + i));

const C_CODE = `#include <cs50.h>
#include <ctype.h>
#include <stdio.h>

int main(int argc, string argv[])
{
    int key = atoi(argv[1]);
    string plaintext = get_string("plaintext:  ");
    printf("ciphertext: ");
    for (int i = 0; i < strlen(plaintext); i++)
    {
        char c = plaintext[i];
        if (isupper(c))
            printf("%c", (c - 'A' + key) % 26 + 'A');
        else if (islower(c))
            printf("%c", (c - 'a' + key) % 26 + 'a');
        else
            printf("%c", c);
    }
    printf("\\n");
}`;

export default function CaesarCipherSim() {
  const { tr } = useLang();
  const [text, setText] = useState("HELLO");
  const [key, setKey] = useState(3);
  const [showCode, setShowCode] = useState(false);

  const cipher = useMemo(() => caesar(text, key), [text, key]);
  const clampKey = (v: number) => Math.max(1, Math.min(25, v));

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0F0F1A] shadow-xl">
      {/* Заголовок окна */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white/[0.04] border-b border-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B47]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFB088]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFB088]" />
        <span className="ml-2.5 font-mono text-[11px] text-white/45">caesar.c</span>
      </div>

      <div className="p-4 sm:p-5 min-h-[360px]">
        {/* Строка запуска в терминале */}
        <div className="mb-4 font-mono text-[12px] sm:text-[13px]">
          <span className="text-white/45">$ </span>
          <span className="text-white/80">./caesar </span>
          <span className="text-accent font-semibold">{key}</span>
        </div>

        {/* Ввод текста */}
        <label className="block mb-4">
          <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-white/45">
            {tr("Твой текст", "Мәтінің", "Your text")}
          </span>
          <div className="flex items-baseline gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 focus-within:border-accent/60">
            <span className="shrink-0 font-mono text-[13px] text-white/45">plaintext:</span>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              spellCheck={false}
              autoComplete="off"
              placeholder="HELLO"
              className="w-full bg-transparent font-mono text-[15px] text-white/80 outline-none placeholder:text-white/20"
            />
          </div>
        </label>

        {/* Слайдер ключа + кнопки */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wide text-white/45">
              {tr("Сдвиг (ключ)", "Ығысу (кілт)", "Shift (key)")}
            </span>
            <span className="font-mono text-[13px] font-semibold text-accent">{key}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={tr("Уменьшить ключ", "Кілтті азайту", "Decrease key")}
              onClick={() => setKey((k) => clampKey(k - 1))}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] font-mono text-lg text-white/80 active:scale-95 hover:border-accent/60"
            >
              −
            </button>
            <input
              type="range"
              min={1}
              max={25}
              step={1}
              value={key}
              onChange={(e) => setKey(clampKey(Number(e.target.value)))}
              aria-label={tr("Сдвиг (ключ)", "Ығысу (кілт)", "Shift (key)")}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#FF6B47]"
            />
            <button
              type="button"
              aria-label={tr("Увеличить ключ", "Кілтті арттыру", "Increase key")}
              onClick={() => setKey((k) => clampKey(k + 1))}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] font-mono text-lg text-white/80 active:scale-95 hover:border-accent/60"
            >
              +
            </button>
          </div>
        </div>

        {/* Визуальная A→сдвиг полоса */}
        <div className="mb-4 overflow-x-auto">
          <div className="flex min-w-max flex-col gap-1 font-mono text-[11px] leading-none">
            <div className="flex gap-[3px]">
              {ALPHABET.map((c) => (
                <span
                  key={c}
                  className="grid h-5 w-5 place-items-center rounded bg-white/[0.04] text-white/45"
                >
                  {c}
                </span>
              ))}
            </div>
            <div className="flex gap-[3px] text-accent/70">
              {ALPHABET.map((c, i) => (
                <span key={c} className="grid h-3 w-5 place-items-center">
                  {i % 2 === 0 ? "↓" : ""}
                </span>
              ))}
            </div>
            <div className="flex gap-[3px]">
              {ALPHABET.map((c) => (
                <span
                  key={c}
                  className="grid h-5 w-5 place-items-center rounded bg-[#FF6B47]/10 font-semibold text-[#FFB088]"
                >
                  {shiftChar(c, key)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Вывод: шифротекст */}
        <div className="mb-4">
          <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-white/45">
            {tr("Зашифровано", "Шифрланды", "Encrypted")}
          </span>
          <div className="flex items-baseline gap-2 rounded-lg border border-[#FF6B47]/20 bg-[#FF6B47]/[0.06] px-3 py-2.5">
            <span className="shrink-0 font-mono text-[13px] text-white/45">ciphertext:</span>
            <span className="break-all font-mono text-[15px] font-semibold text-[#FFB088]">
              {cipher || " "}
            </span>
          </div>
        </div>

        {/* Тоггл кода */}
        <button
          type="button"
          onClick={() => setShowCode((s) => !s)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[12px] text-white/80 active:scale-95 hover:border-accent/60"
        >
          <Icon name="code" className="h-3.5 w-3.5" />
          {showCode
            ? tr("Скрыть код", "Кодты жасыру", "Hide code")
            : tr("Показать код", "Кодты көрсету", "Show code")}
        </button>

        {showCode && (
          <div className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3">
            <pre className="font-mono text-[11.5px] leading-relaxed text-white/70">
              <code>{C_CODE}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
