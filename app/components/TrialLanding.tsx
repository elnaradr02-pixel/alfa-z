"use client";

import { useState } from "react";
import Image from "next/image";
import Icon, { type IconName } from "./Icon";
import aituCard from "@/public/assets/hackathons/aitu-2025-card.jpg";

/**
 * Продающий лендинг под таргет (Instagram) на профориентационный пробный урок.
 * Структура: боль → интерес → польза → и только потом цена (у формы).
 * Одна вёрстка, язык задаётся словарём (см. trial-ru / trial-kz). Скрыт из
 * навигации и индексации; заявка уходит в WhatsApp на номер школы.
 */

const WA_NUMBER = "77007240353";

export type TrialDict = {
  lang: "ru" | "kk";
  eyebrow: string;
  h1a: string;
  h1accent: string;
  h1b: string;
  sub: string;
  ctaPrimary: string;
  heroNote: string;
  trust: string[];
  // боль
  painEyebrow: string;
  painTitle: string;
  painItems: string[];
  painTurn: string;
  // что произойдёт
  whatEyebrow: string;
  whatTitle: string;
  whatAccent: string;
  whatItems: { icon: IconName; title: string; desc: string }[];
  // направления
  dirTitle: string;
  dirAccent: string;
  dirSub: string;
  directions: { icon: IconName; name: string }[];
  // Доказательство: фото с хакатона перед ценой
  proofEyebrow: string;
  proofText: string;
  proofAlt: string;
  // цена + форма
  priceEyebrow: string;
  priceValue: string;
  priceFraming: string;
  formTitle: string;
  formAccent: string;
  formSub: string;
  fName: string;
  fNamePh: string;
  fAge: string;
  fAgePh: string;
  fPhone: string;
  fPhonePh: string;
  formCta: string;
  formNote: string;
  successTitle: string;
  successText: string;
  // whatsapp
  waIntro: string;
  waName: string;
  waAge: string;
  waPhone: string;
  // faq
  faqTitle: string;
  faq: { q: string; a: string }[];
  // footer
  footerNote: string;
  stickyCta: string;
};

export default function TrialLanding({ t }: { t: TrialDict }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    const lines = [t.waIntro, "", `${t.waName}: ${name}`];
    if (age.trim()) lines.push(`${t.waAge}: ${age}`);
    lines.push(`${t.waPhone}: ${phone}`);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
    setSent(true);
  };

  const scrollToForm = () =>
    document.getElementById("trial-form")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="min-h-screen bg-background text-foreground" lang={t.lang}>
      {/* ── HERO: боль-крючок, без цены ── */}
      <section className="relative overflow-hidden bg-midnight text-ink-fg">
        <div className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-80 w-80 rounded-full bg-accent-soft/20 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-5 pt-14 pb-16 sm:pt-20 sm:pb-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/15 px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-accent animate-soft-pulse" />
              <span className="relative h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">{t.eyebrow}</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-balance">
            {t.h1a} <span className="text-accent">{t.h1accent}</span> {t.h1b}
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-ink-fg/75 leading-relaxed">{t.sub}</p>

          <div className="mt-8">
            <button
              onClick={scrollToForm}
              className="glow-hover inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-semibold text-white shadow-2xl shadow-accent/40 transition-all hover:scale-[1.02] hover:bg-accent-hover"
            >
              {t.ctaPrimary} <span aria-hidden>→</span>
            </button>
            <p className="mt-3 text-sm text-ink-fg/55">{t.heroNote}</p>
          </div>

          <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-ink-fg/70">
            {t.trust.map((chip) => (
              <li key={chip} className="inline-flex items-center gap-1.5">
                <Icon name="check" className="h-4 w-4 text-accent" /> {chip}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── БОЛЬ ── */}
      <section className="border-b border-border bg-muted/25 py-14 sm:py-16">
        <div className="mx-auto max-w-2xl px-5">
          <div className="mb-8 text-center">
            <p className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">{t.painEyebrow}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-balance">{t.painTitle}</h2>
          </div>
          <ul className="space-y-3">
            {t.painItems.map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-2xl border border-border bg-surface px-5 py-4">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent/12 text-accent">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </span>
                <span className="text-[15px] leading-snug text-foreground/80">{p}</span>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-9 max-w-xl text-center font-display text-xl sm:text-2xl font-bold leading-snug text-balance">
            {t.painTurn}
          </p>
        </div>
      </section>

      {/* ── ЧТО ПРОИЗОЙДЁТ ЗА УРОК ── */}
      <section className="border-b border-border py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-5">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-accent">{t.whatEyebrow}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-balance">
              {t.whatTitle} <span className="text-accent">{t.whatAccent}</span>
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {t.whatItems.map((it) => (
              <div key={it.title} className="flex gap-4 rounded-2xl border border-border bg-surface p-5">
                <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon name={it.icon} className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold leading-tight">{it.title}</h3>
                  <p className="mt-1 text-sm text-foreground/65 leading-relaxed">{it.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── НАПРАВЛЕНИЯ ── */}
      <section className="border-b border-border bg-muted/20 py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-balance">
            {t.dirTitle} <span className="text-accent">{t.dirAccent}</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-foreground/65">{t.dirSub}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {t.directions.map((d) => (
              <span key={d.name} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-semibold">
                <Icon name={d.icon} className="h-4 w-4 text-accent" /> {d.name}
              </span>
            ))}
          </div>

          {/* Реальное событие — последнее, что видят перед ценой */}
          <figure className="mx-auto mt-10 max-w-lg overflow-hidden rounded-3xl border border-border bg-surface text-left">
            <Image
              src={aituCard}
              alt={t.proofAlt}
              placeholder="blur"
              sizes="(min-width: 640px) 512px, calc(100vw - 40px)"
              className="aspect-[4/3] h-auto w-full object-cover"
            />
            <figcaption className="px-5 py-4">
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-accent">{t.proofEyebrow}</p>
              <p className="mt-1 text-[15px] leading-snug text-foreground/80">{t.proofText}</p>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── ЦЕНА (первое упоминание) + ФОРМА ── */}
      <section id="trial-form" className="scroll-mt-4 bg-gradient-to-b from-background via-muted/10 to-background py-14 sm:py-16">
        <div className="mx-auto max-w-lg px-5">
          <div className="rounded-3xl border-2 border-accent/25 bg-surface p-6 sm:p-9 shadow-2xl shadow-accent/10">
            {sent ? (
              <div className="py-8 text-center">
                <div className="mb-4 text-6xl">✅</div>
                <h3 className="font-display text-2xl font-bold">{t.successTitle}</h3>
                <p className="mt-2 text-foreground/65">{t.successText}</p>
                <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white transition-all hover:bg-accent-hover">
                  <Icon name="message" className="h-5 w-5" /> WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={submit}>
                {/* цена — только здесь */}
                <div className="mb-6 rounded-2xl bg-accent/8 px-5 py-4 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-accent">{t.priceEyebrow}</p>
                  <p className="mt-1 font-display text-4xl font-extrabold leading-none text-foreground">{t.priceValue}</p>
                  <p className="mt-2 text-sm text-foreground/65 leading-snug">{t.priceFraming}</p>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight text-balance">
                  {t.formTitle} <span className="text-accent">{t.formAccent}</span>
                </h2>
                <p className="mt-2 text-sm text-foreground/65">{t.formSub}</p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold">{t.fName} <span className="text-accent">*</span></label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder={t.fNamePh}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold">{t.fAge}</label>
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} min="10" max="18" placeholder={t.fAgePh}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold">{t.fPhone} <span className="text-accent">*</span></label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder={t.fPhonePh}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20" />
                  </div>
                </div>

                <button type="submit" className="glow-hover mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 text-lg font-bold text-white shadow-lg shadow-accent/30 transition-all hover:scale-[1.01] hover:bg-accent-hover">
                  <Icon name="message" className="h-5 w-5" /> {t.formCta}
                </button>
                <p className="mt-4 text-center text-xs leading-relaxed text-foreground/45">{t.formNote}</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t border-border py-14 sm:py-16">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="mb-8 text-center font-display text-2xl sm:text-3xl font-bold tracking-tight">{t.faqTitle}</h2>
          <div className="space-y-3">
            {t.faq.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-border bg-surface p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {f.q}
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-accent/10 text-accent transition-transform group-open:rotate-45">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-foreground/70 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-foreground py-10 text-surface">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <div className="mb-3 inline-flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent font-display text-sm font-bold text-white">aZ</span>
            <span className="font-display text-lg font-bold">Alfa Z</span>
          </div>
          <p className="mx-auto max-w-md text-xs leading-relaxed text-surface/55">{t.footerNote}</p>
          <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold text-accent">
            +7 700 724 03 53
          </a>
        </div>
      </footer>

      {/* ── STICKY MOBILE CTA ── */}
      {!sent && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur-md sm:hidden">
          <button onClick={scrollToForm} className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-bold text-white shadow-lg shadow-accent/30">
            {t.stickyCta}
          </button>
        </div>
      )}
      <div className="h-16 sm:hidden" aria-hidden />
    </div>
  );
}
