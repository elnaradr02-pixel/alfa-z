"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

/**
 * Лёгкая клиентская локализация для Alfa Z (RU/KZ/EN).
 * Язык хранится в localStorage, переключается в шапке, меняет текст мгновенно.
 * Перевод — инлайн-хелпером tr(ru, kz, en): текст рядом с местом использования,
 * без тысяч ключей — практично для большого сайта из клиентских компонентов.
 */

export type Locale = "ru" | "kz" | "en";
/** Порядок в переключателе шапки: казахский первым. */
export const LOCALES: Locale[] = ["kz", "ru", "en"];
const STORAGE_KEY = "alfaz-lang";
const htmlLang = (l: Locale) => (l === "kz" ? "kk" : l);

type LangCtx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  /** Возвращает строку для текущего языка. */
  tr: (ru: string, kz: string, en: string) => string;
};

const Ctx = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Дефолт — казахский (KZ-first аудитория). SSR рендерит kz, совпадает с первым client-рендером.
  const [locale, setLocaleState] = useState<Locale>("kz");

  // Восстанавливаем выбор пользователя после гидрации; иначе оставляем дефолт kz.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    const active = saved && LOCALES.includes(saved) ? saved : "kz";
    if (active !== "kz") setLocaleState(active);
    document.documentElement.lang = htmlLang(active);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
    document.documentElement.lang = htmlLang(l);
  }, []);

  const tr = useCallback(
    (ru: string, kz: string, en: string) => (locale === "kz" ? kz : locale === "en" ? en : ru),
    [locale],
  );

  return <Ctx.Provider value={{ locale, setLocale, tr }}>{children}</Ctx.Provider>;
}

export function useLang() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLang must be used within LanguageProvider");
  return c;
}
