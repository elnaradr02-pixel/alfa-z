import type { CSSProperties } from "react";

/**
 * Заставка при первом заходе на главную — обращение к маме:
 * «Мама, уайымдамаңыз — біз сіздің балаңызбен біргеміз!» (идея владельца).
 * Главная строка — на выбранном языке сайта, под ней — перевод (kz ↔ ru).
 * Слова проявляются по одному из размытия, затем «диафрагма» раскрывает сайт.
 *
 * Работает чистым CSS (globals.css, блок «Заставка»): не ждёт гидрации и не задерживает
 * отрисовку страницы под ней. INTRO_SCRIPT стоит в <head> (layout.tsx) и до отрисовки <body>:
 *  • выбирает язык заставки по сохранённому языку сайта (localStorage «alfaz-lang», по умолчанию kz);
 *  • не главная (/) или есть #якорь → заставки нет (лендинги из рекламы её не видят);
 *  • уже показывали в этой сессии / prefers-reduced-motion → заставки нет;
 *  • иначе показываем и запоминаем. Клик по заставке — сразу на сайт.
 * --intro-delay сдвигает анимации героя, пока заставка играет.
 */
export const INTRO_SCRIPT = `(function(){var d=document.documentElement;try{
var l=null;try{l=localStorage.getItem('alfaz-lang')}catch(e){}
d.setAttribute('data-intro-lang',(l==='ru'||l==='en')?l:'kz');
var s=sessionStorage;
var skip=location.pathname!=='/'||location.hash||s.getItem('alfaz-intro')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches;
if(skip){d.setAttribute('data-intro','seen');return;}
s.setItem('alfaz-intro','1');d.style.setProperty('--intro-delay','3.7s');
document.addEventListener('click',function h(e){if(e.target.closest&&e.target.closest('.intro')){d.setAttribute('data-intro','seen');d.style.setProperty('--intro-delay','0s');document.removeEventListener('click',h);}});
}catch(e){d.setAttribute('data-intro','seen');}})();`;

type Msg = { lang: "kz" | "ru" | "en"; line1: string[]; line2: string[]; sub: string; skip: string };

// line1 — первое слово «Мама,» выделяется коралловым; слова разбиты для поочерёдного появления
const MESSAGES: Msg[] = [
  {
    lang: "kz",
    line1: ["Мама,", "уайымдамаңыз —"],
    line2: ["біз", "сіздің", "балаңызбен", "біргеміз!"],
    sub: "Мама, не волнуйтесь — мы рядом с вашим ребёнком!",
    skip: "сайтқа өту үшін басыңыз",
  },
  {
    lang: "ru",
    line1: ["Мама,", "не волнуйтесь —"],
    line2: ["мы", "рядом", "с вашим", "ребёнком!"],
    sub: "Мама, уайымдамаңыз — біз сіздің балаңызбен біргеміз!",
    skip: "нажмите, чтобы перейти на сайт",
  },
  {
    lang: "en",
    line1: ["Mom,", "don't worry —"],
    line2: ["we're", "right there", "with your", "child!"],
    sub: "Мама, уайымдамаңыз — біз сіздің балаңызбен біргеміз!",
    skip: "tap to continue to the site",
  },
];

const w = (i: number) => ({ "--i": i }) as CSSProperties;

export default function IntroCurtain() {
  return (
    <div className="intro" aria-hidden>
      <div className="intro-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="intro-logo" src="/logos/logo-icon.svg" alt="" width={56} height={56} />

        {MESSAGES.map((m) => (
          <div key={m.lang} className="intro-msg" data-lang={m.lang}>
            <p className="intro-main">
              <span className="intro-row">
                <span className="iw intro-mama" style={w(0)}>{m.line1[0]}</span>{" "}
                <span className="iw" style={w(1)}>{m.line1[1]}</span>
              </span>
              <span className="intro-row">
                {m.line2.map((word, i) => (
                  <span key={i}>
                    <span className="iw" style={w(2 + i)}>{word}</span>{i < m.line2.length - 1 ? " " : ""}
                  </span>
                ))}
              </span>
            </p>
            <span className="intro-rule" />
            <p className="intro-sub">{m.sub}</p>
            <p className="intro-sign">
              — Alfa Z
              <svg className="intro-heart" viewBox="0 0 24 24" width="18" height="18" fill="#FF6B47"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.9 4.5 6.6 4.1c2.1-.2 3.9.9 5.4 2.8 1.5-1.9 3.3-3 5.4-2.8 3.7.4 5.7 4.3 4.2 7.7C19.5 16.4 12 21 12 21z" /></svg>
            </p>
          </div>
        ))}
      </div>

      {MESSAGES.map((m) => (
        <p key={m.lang} className="intro-skip" data-lang={m.lang}>{m.skip}</p>
      ))}
    </div>
  );
}
