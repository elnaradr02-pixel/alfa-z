"use client";

import { useLang, LOCALES, type Locale } from "../i18n/lang";

const LABELS: Record<Locale, string> = { ru: "RU", kz: "KZ", en: "EN" };

/**
 * Переключатель языков RU/KZ/EN — сегментированный контрол в шапке.
 */
export default function LangSwitcher({ className = "inline-flex" }: { className?: string }) {
  const { locale, setLocale } = useLang();
  return (
    <div className={`items-center rounded-full border border-border bg-surface p-0.5 ${className}`}>
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`cursor-target px-2.5 py-1 rounded-full text-xs font-mono font-bold tracking-wide transition-colors ${
            locale === l ? "bg-accent text-white shadow-sm shadow-accent/30" : "text-foreground/55 hover:text-foreground"
          }`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
