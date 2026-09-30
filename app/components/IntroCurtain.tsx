/**
 * Заставка при первом заходе на главную: графит + свечение, логотип, печатающаяся
 * строка терминала и «диафрагма», раскрывающая героя из центра.
 *
 * Работает чистым CSS (см. globals.css, блок «Заставка»), поэтому не ждёт гидрации и
 * не задерживает отрисовку страницы под ней. INTRO_SCRIPT стоит в <head> (layout.tsx) и
 * до отрисовки <body> решает:
 *  • не главная (/) или есть #якорь → заставки нет (лендинги из рекламы её не видят);
 *  • уже показывали в этой сессии / prefers-reduced-motion → заставки нет;
 *  • иначе показываем и запоминаем. Клик по заставке — пропустить.
 * Переменная --intro-delay сдвигает анимации героя, пока заставка играет.
 */
export const INTRO_SCRIPT = `(function(){var d=document.documentElement;try{
var s=sessionStorage;
var skip=location.pathname!=='/'||location.hash||s.getItem('alfaz-intro')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches;
if(skip){d.setAttribute('data-intro','seen');return;}
s.setItem('alfaz-intro','1');d.style.setProperty('--intro-delay','1.55s');
document.addEventListener('click',function h(e){if(e.target.closest&&e.target.closest('.intro')){d.setAttribute('data-intro','seen');d.style.setProperty('--intro-delay','0s');document.removeEventListener('click',h);}});
}catch(e){d.setAttribute('data-intro','seen');}})();`;

export default function IntroCurtain() {
  return (
    <>
      <div className="intro" aria-hidden>
        <div className="intro-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="intro-logo" src="/logos/logo-icon.svg" alt="" width={88} height={88} />
          <div className="intro-word">
            <span className="text-accent">α</span>lfa <span className="text-accent">Z</span>
          </div>
          <div className="intro-line">alfa-z:~$ ./start-coding</div>
          <div className="intro-bar"><span /></div>
        </div>
      </div>
    </>
  );
}
