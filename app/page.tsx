"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView, animate, useMotionValue, AnimatePresence, useReducedMotion } from "framer-motion";
import HeroHeadline from "./components/HeroHeadline";
import TiltCard from "./components/TiltCard";
import CodeWindow from "./components/CodeWindow";
import CodeBackdrop from "./components/CodeBackdrop";
import Icon, { type IconName } from "./components/Icon";
import HowWeTeach from "./components/HowWeTeach";
import LevelBadges from "./components/LevelBadges";
import LangSwitcher from "./components/LangSwitcher";
import LiveDemos from "./components/LiveDemos";
import { useLang } from "./i18n/lang";

// three.js для hero едет отдельным чанком и только на клиенте (ssr:false).

// 🔢 Анимированный счётчик 0 → N.
// Устойчив к «залипанию на 0»: порог входа низкий, при prefers-reduced-motion
// или если анимация не отработала за N мс — показываем итоговое число.
function AnimatedCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  // amount пониже + margin — чтобы счётчик срабатывал даже на невысоких экранах.
  const isInView = useInView(ref, { once: true, amount: 0.2, margin: "0px 0px -10% 0px" });
  // Initial = целевое значение: до срабатывания JS первый рендер сразу
  // показывает финальную цифру, а не «0» / «0+».
  const count = useMotionValue(to);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    // reduced-motion → остаёмся на конечном значении, без анимации.
    if (reduce) {
      count.set(to);
      return;
    }
    if (isInView) {
      // Короткий «доскок» от близкого к цели числа, а не от нуля.
      count.set(Math.max(0, Math.round(to * 0.7)));
      const controls = animate(count, to, { duration: 1.4, ease: [0.16, 1, 0.3, 1] });
      return () => controls.stop();
    }
  }, [isInView, reduce, count, to]);

  // Fallback: как только счётчик во вьюпорте — гарантируем достижение цели за 2.2с,
  // даже если animate() не запустился (медленный JS / сбой анимации).
  useEffect(() => {
    if (!isInView && !reduce) return;
    const t = setTimeout(() => {
      if (count.get() < to) count.set(to);
    }, 2200);
    return () => clearTimeout(t);
  }, [isInView, reduce, count, to]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
}

// 💬 Плавающие кнопки мессенджеров
function FloatingMessengers() {
  const { tr } = useLang();
  const [show, setShow] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [jivoOpen, setJivoOpen] = useState(false);
  const { scrollY } = useScroll();

  // На мобиле — стартуем со свёрнутыми кнопками
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) {
      setCollapsed(true);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (value) => {
      setShow(value > 300);
    });
    return unsubscribe;
  }, [scrollY]);

  // Синхронизация с состоянием чата Jivo
  useEffect(() => {
    if (typeof window === "undefined") return;
    (window as any).jivo_onOpen = () => setJivoOpen(true);
    (window as any).jivo_onClose = () => setJivoOpen(false);
    return () => {
      (window as any).jivo_onOpen = undefined;
      (window as any).jivo_onClose = undefined;
    };
  }, []);

  // Управление CSS-классом body для показа/скрытия окна Jivo
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (jivoOpen) {
      document.body.classList.add("jivo-open");
    } else {
      document.body.classList.remove("jivo-open");
    }
    return () => {
      document.body.classList.remove("jivo-open");
    };
  }, [jivoOpen]);

  // Открыть/закрыть чат Jivo
  const toggleJivo = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window === "undefined") return;
    const api = (window as any).jivo_api;
    if (!api) return;
    if (jivoOpen) {
      api.close();
      setJivoOpen(false);
    } else {
      setJivoOpen(true);
      // Сразу добавляем класс синхронно — чтобы CSS отработал до открытия окна
      document.body.classList.add("jivo-open");
      requestAnimationFrame(() => api.open());
    }
  };

  const chatIcon = (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);
  const closeIcon = (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>);

  const buttons: Array<{
    name: string;
    tooltip: string;
    href: string;
    onClick?: (e: React.MouseEvent) => void;
    bg: string;
    pulse: boolean;
    icon: React.ReactNode;
  }> = [
    { name: "WhatsApp", tooltip: "Написать в WhatsApp", href: "https://wa.me/77001234567", bg: "bg-[#25D366]", pulse: true,
      icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>) },
    { name: "Telegram", tooltip: "Написать в Telegram", href: "https://t.me/alfaz_school", bg: "bg-[#229ED9]", pulse: false,
      icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>) },
    { name: "Instagram", tooltip: "Написать в Instagram", href: "https://instagram.com/alfaz.school", bg: "bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5]", pulse: false,
      icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>) },
    { name: "Чат", tooltip: jivoOpen ? "Закрыть чат" : "Открыть чат с менеджером", href: "#", onClick: toggleJivo, bg: "bg-[#FF6B47]", pulse: false,
      icon: jivoOpen ? closeIcon : chatIcon },
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 20 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2.5 sm:gap-3 items-end">
          <AnimatePresence>
            {!collapsed && buttons.map((btn, i) => (
              <motion.a
                key={btn.name}
                href={btn.href}
                onClick={btn.onClick}
                target={btn.onClick ? undefined : "_blank"}
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.3, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.3, x: 20 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className="group relative flex items-center justify-end"
                aria-label={btn.tooltip}
              >
                <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-foreground text-surface text-xs font-semibold whitespace-nowrap shadow-lg opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">{btn.tooltip}</span>
                <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full ${btn.bg} text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300`}>
                  {btn.pulse && <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40" />}
                  <span className="relative">{btn.icon}</span>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>

          <motion.button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Связаться с нами" : "Свернуть"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full ${collapsed ? "bg-[#FF6B47]" : "bg-foreground"} text-white flex items-center justify-center shadow-xl transition-colors duration-300`}
          >
            {collapsed && (
              <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-foreground text-surface text-xs font-semibold whitespace-nowrap shadow-lg opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">{tr("Связаться с нами", "Бізбен байланысу", "Contact us")}</span>
            )}
            <AnimatePresence mode="wait" initial={false}>
              {collapsed ? (
                <motion.svg
                  key="chat"
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </motion.svg>
              ) : (
                <motion.svg
                  key="close"
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12"/>
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ✉️ МОДАЛКА ЗАПИСИ НА ПРОБНЫЙ УРОК
function ApplyModal({ open, onClose, defaultCourse = "" }) {
  const { tr } = useLang();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open && defaultCourse) setCourse(defaultCourse);
  }, [open, defaultCourse]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) return;
    const lines = ["Здравствуйте! Хочу записать ребёнка на пробный урок.", "", `Имя ребёнка: ${name}`];
    if (age) lines.push(`Возраст: ${age}`);
    lines.push(`Телефон: ${phone}`);
    if (course) lines.push(`Курс: ${course}`);
    const message = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/77001234567?text=${message}`, "_blank");
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setName(""); setAge(""); setPhone(""); setCourse("");
    }, 3500);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 30, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="relative bg-surface rounded-3xl p-7 sm:p-9 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={onClose} aria-label={tr("Закрыть", "Жабу", "Close")} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors z-10">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" /></svg>
            </button>
            {submitted ? (
              <div className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="text-7xl mb-5">✅</motion.div>
                <h3 className="font-display text-2xl font-bold mb-2">{tr("Заявка отправлена!", "Өтінім жіберілді!", "Request sent!")}</h3>
                <p className="text-foreground/65 text-sm">{tr("Сейчас откроется WhatsApp с вашим сообщением. Менеджер ответит в течение часа.", "Қазір хабарламаңызбен WhatsApp ашылады. Менеджер бір сағат ішінде жауап береді.", "WhatsApp will open with your message now. A manager will reply within an hour.")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-soft-pulse" />
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">{tr("Бесплатно", "Тегін", "Free")}</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold mb-2 leading-tight">
                    {tr("Запись на ", "", "Sign up for a ")}<span className="text-accent">{tr("пробный урок", "Сынақ сабаққа жазылу", "free trial")}</span>
                  </h3>
                  <p className="text-foreground/65 text-sm">{tr("60 минут, без обязательств. Менеджер свяжется в течение часа.", "60 минут, міндеттемесіз. Менеджер бір сағат ішінде хабарласады.", "60 minutes, no obligations. A manager will contact you within an hour.")}</p>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">{tr("Имя ребёнка", "Баланың аты", "Child's name")} <span className="text-accent">*</span></label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder={tr("Айдар", "Айдар", "Aidar")} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">{tr("Возраст", "Жасы", "Age")}</label>
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="14" min="12" max="18" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">{tr("Телефон родителя", "Ата-ана телефоны", "Parent's phone")} <span className="text-accent">*</span></label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+7 (___) ___-__-__" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">{tr("Какой курс интересует?", "Қай курс қызықтырады?", "Which course are you interested in?")}</label>
                    <select value={course} onChange={(e) => setCourse(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all">
                      <option value="">{tr("Выбрать на пробном уроке", "Сынақ сабақта таңдаймын", "Decide at the trial")}</option>
                      <option value="Гарвардский курс CS50">🎓 {tr("Гарвардский курс CS50", "Гарвардтың CS50 курсы", "Harvard CS50")}</option>
                      <option value="Мобильная разработка">📱 {tr("Мобильная разработка", "Мобильді әзірлеу", "Mobile development")}</option>
                      <option value="Геймдев на Unity">🎮 {tr("Геймдев на Unity", "Unity-де геймдев", "Game dev on Unity")}</option>
                      <option value="Веб-разработка">🌐 {tr("Веб-разработка", "Веб-әзірлеу", "Web development")}</option>
                      <option value="Бэкенд на Python">⚙️ {tr("Бэкенд на Python", "Python-дағы бэкенд", "Backend on Python")}</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full px-6 py-4 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold transition-all shadow-lg shadow-accent/30 hover:scale-[1.01] flex items-center justify-center gap-2">
                  <span>💬</span> {tr("Отправить заявку в WhatsApp", "WhatsApp арқылы өтінім жіберу", "Send request via WhatsApp")}
                </button>
                <p className="text-xs text-foreground/45 text-center mt-4 leading-relaxed">{tr("Нажимая на кнопку, вы соглашаетесь с обработкой персональных данных", "Батырманы басу арқылы дербес деректерді өңдеуге келісесіз", "By clicking, you consent to the processing of personal data")}</p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } };
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } } };
const staggerItem = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };
const scrollViewport = { once: true, amount: 0.15 };

export default function Home() {
  const [applyOpen, setApplyOpen] = useState(false);
  const [defaultCourse, setDefaultCourse] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { tr } = useLang();
  const openApply = (course = "") => {
    setDefaultCourse(course);
    setApplyOpen(true);
  };

  // Закрывать меню при клике на пункт + блокировать скролл когда меню открыто
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const videoY = useTransform(heroProgress, [0, 1], ["0%", "30%"]);
  const videoScale = useTransform(heroProgress, [0, 1], [1, 1.15]);
  const heroContentY = useTransform(heroProgress, [0, 1], ["0%", "-20%"]);
  const heroContentOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen bg-background">
      <ApplyModal open={applyOpen} onClose={() => setApplyOpen(false)} defaultCourse={defaultCourse} />
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-accent origin-left z-[60]" style={{ scaleX: scrollYProgress }} />
      <FloatingMessengers />

      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <nav className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/logos/logo-icon.svg" alt="Alfa Z logo" width="40" height="40" className="w-10 h-10 rounded-xl shadow-lg shadow-accent/30" />
            <span className="font-display font-bold text-xl tracking-tight">
              <span className="text-accent">α</span>lfa <span className="text-accent">Z</span>
            </span>
          </a>
          <ul className="hidden lg:flex items-center gap-8 text-sm font-medium text-foreground/70">
            <li><a href="#courses" className="hover:text-foreground transition-colors">{tr("Курсы", "Курстар", "Courses")}</a></li>
            <li><a href="#about" className="hover:text-foreground transition-colors">{tr("О школе", "Мектеп туралы", "About")}</a></li>
            <li><a href="#pricing" className="hover:text-foreground transition-colors">{tr("Цены", "Бағалар", "Pricing")}</a></li>
            <li><a href="#schedule" className="hover:text-foreground transition-colors">{tr("Расписание", "Кесте", "Schedule")}</a></li>
            <li><a href="#reviews" className="hover:text-foreground transition-colors">{tr("Отзывы", "Пікірлер", "Reviews")}</a></li>
          </ul>
          <div className="flex items-center gap-2 sm:gap-3">
            <LangSwitcher className="hidden sm:inline-flex" />
            <button className="hidden lg:inline-flex text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">{tr("Войти", "Кіру", "Log in")}</button>
            <button onClick={() => openApply()} className="px-4 sm:px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold transition-all hover:scale-[1.03] shadow-md shadow-accent/20 whitespace-nowrap">{tr("Пробный урок", "Сынақ сабақ", "Free trial")}</button>
            {/* 🍔 Бургер-кнопка — только на мобиле и планшете */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label={tr("Открыть меню", "Мәзірді ашу", "Open menu")}
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M3 12h18M3 18h18"/>
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* 📱 МОБИЛЬНОЕ МЕНЮ — fullscreen overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-background overflow-y-auto lg:hidden"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="min-h-full flex flex-col"
            >
              {/* Header меню */}
              <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border z-10 flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-2.5">
                  <img src="/logos/logo-icon.svg" alt="Alfa Z logo" width="40" height="40" className="w-10 h-10 rounded-xl" />
                  <span className="font-display font-bold text-xl tracking-tight">
                    <span className="text-accent">α</span>lfa <span className="text-accent">Z</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label={tr("Закрыть меню", "Мәзірді жабу", "Close menu")}
                  className="w-10 h-10 rounded-full bg-muted hover:bg-border flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              {/* Навигация */}
              <nav className="flex-1 px-6 py-6">
                <ul className="space-y-1">
                  {([
                    { href: "#courses", label: tr("Курсы", "Курстар", "Courses"), icon: "book" },
                    { href: "#about", label: tr("О школе", "Мектеп туралы", "About"), icon: "graduation" },
                    { href: "#pricing", label: tr("Цены", "Бағалар", "Pricing"), icon: "wallet" },
                    { href: "#schedule", label: tr("Расписание", "Кесте", "Schedule"), icon: "calendar" },
                    { href: "#reviews", label: tr("Отзывы", "Пікірлер", "Reviews"), icon: "message" },
                    { href: "#faq", label: tr("Частые вопросы", "Жиі сұрақтар", "FAQ"), icon: "help" },
                  ] as { href: string; label: string; icon: IconName }[]).map((item, i) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04 }}
                    >
                      <a
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between gap-3 py-4 px-4 rounded-2xl hover:bg-muted active:bg-border transition-colors group"
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                            <Icon name={item.icon} className="h-5 w-5" />
                          </span>
                          <span className="font-display text-lg font-semibold">{item.label}</span>
                        </span>
                        <span className="text-accent text-xl group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                    </motion.li>
                  ))}
                </ul>

                {/* Язык */}
                <div className="mt-6 flex justify-center">
                  <LangSwitcher />
                </div>

                {/* Контакты */}
                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  <a href="https://wa.me/77001234567" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-3 px-4 rounded-2xl hover:bg-muted transition-colors">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Icon name="phone" className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium">+7 (700) 123-45-67</span>
                  </a>
                  <a href="mailto:hello@alfa-z.kz" className="flex items-center gap-3 py-3 px-4 rounded-2xl hover:bg-muted transition-colors">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Icon name="message" className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium">hello@alfa-z.kz</span>
                  </a>
                </div>
              </nav>

              {/* CTA внизу */}
              <div className="sticky bottom-0 px-6 py-5 bg-background/95 backdrop-blur-md border-t border-border">
                <button
                  onClick={() => { setMobileMenuOpen(false); openApply(); }}
                  className="w-full py-4 bg-accent hover:bg-accent-hover text-white rounded-full font-display font-bold text-base shadow-lg shadow-accent/30 transition-all"
                >
                  {tr("Записаться на пробный урок", "Сынақ сабаққа жазылу", "Book a free trial")} →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section ref={heroRef} className="relative h-screen min-h-[640px] max-h-[900px] flex items-center overflow-hidden">
        <motion.video autoPlay loop muted playsInline poster="/hero-poster.jpg" style={{ y: videoY, scale: videoScale }} className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="/hero-video.mp4" type="video/mp4" />
        </motion.video>
        {/* Индиго → сумерки → тёплый закат поверх видео («Полночный закат») */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0F0F1A]/92 via-[#0F0F1A]/62 to-[#0F0F1A]/25" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0F0F1A]/75 via-transparent to-[#0F0F1A]/40" />
        <motion.div style={{ y: heroContentY, opacity: heroContentOpacity }} className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-accent/15 backdrop-blur-md border border-accent/40 mb-7 animate-fade-in-up">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-accent animate-soft-pulse" />
                <span className="relative w-2 h-2 rounded-full bg-accent" />
              </span>
              <span className="text-sm font-semibold text-white tracking-wide">{tr("Приём в группы открыт", "Топтарға қабылдау ашық", "Enrollment is open")}</span>
            </div>
            <HeroHeadline />
            <p className="text-lg sm:text-xl text-white/85 leading-relaxed mb-9 max-w-xl animate-fade-in-up delay-200">
              {tr(
                "Учим IT с нуля до уровня junior. Живые уроки с практикующими разработчиками. 5 направлений: Гарвардский курс CS50, мобильная разработка, геймдев, фронтенд, бэкенд.",
                "IT-ді нөлден junior деңгейіне дейін үйретеміз. Тәжірибелі әзірлеушілермен тікелей сабақтар. 5 бағыт: Гарвардтың CS50 курсы, мобильді әзірлеу, геймдев, фронтенд, бэкенд.",
                "We teach IT from zero to junior level. Live lessons with working developers. 5 tracks: Harvard's CS50, mobile development, game dev, frontend, and backend.",
              )}
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-10 animate-fade-in-up delay-300">
              <button onClick={() => openApply()} className="glow-hover inline-flex items-center gap-2 px-7 py-4 bg-accent hover:bg-accent-hover text-white rounded-full font-semibold hover:scale-[1.02] transition-all duration-300 shadow-2xl shadow-accent/40">
                {tr("Записаться на пробный урок", "Сынақ сабаққа жазылу", "Book a free trial")} <span aria-hidden>→</span>
              </button>
              <a href="#courses" className="inline-flex items-center gap-2 px-7 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300">{tr("Программа курсов", "Курстар бағдарламасы", "Course catalog")}</a>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-3 animate-fade-in-up delay-400">
              {[
                { icon: "graduation" as IconName, text: tr("Программа Гарварда CS50", "Гарвардтың CS50 бағдарламасы", "Harvard CS50 curriculum") },
                { icon: "code" as IconName, text: tr("Преподаватели-практики", "Тәжірибелі ұстаздар", "Practicing instructors") },
                { icon: "award" as IconName, text: tr("Вернём деньги за 14 дней", "14 күнде ақшаны қайтарамыз", "14-day money-back") },
              ].map((t) => (
                <div key={t.text} className="flex items-center gap-2.5">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 border border-white/15 text-accent"><Icon name={t.icon} className="h-4 w-4" /></span>
                  <span className="text-sm font-medium text-white/85">{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl animate-fade-in-up delay-500">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <div><p className="text-white font-semibold text-xs sm:text-sm leading-tight">{tr("Идёт набор в группы", "Топтарға қабылдау жүріп жатыр", "Enrolling now")}</p><p className="text-white/70 text-[10px] sm:text-xs mt-0.5">{tr("группы до 8 человек · места ограничены", "топтар 8 адамға дейін · орын шектеулі", "groups up to 8 · limited seats")}</p></div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2 animate-fade-in-up delay-500">
          <span className="text-white/60 text-xs uppercase tracking-widest">{tr("Прокрутите вниз", "Төмен айналдырыңыз", "Scroll down")}</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-white/80 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      <motion.section className="relative py-20 sm:py-24 bg-gradient-to-b from-background to-muted/20 border-t border-border" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
            <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("Почему это серьёзно", "Неге бұл маңызды", "Why it's serious")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {tr("Не хобби-кружок, а ", "Үйірме емес, ", "Not a hobby club, but ")}<span className="text-accent">{tr("настоящая IT-программа", "нағыз IT-бағдарлама", "a real IT program")}</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {[
              { value: 5, suffix: "", label: tr("направлений — от Гарвардского CS50 до геймдева", "бағыт — Гарвард CS50-ден геймдевке дейін", "tracks — from Harvard CS50 to game dev"), icon: "target" as IconName },
              { value: 49, suffix: "", label: tr("занятий в курсе CS50: C, Python, SQL, веб", "CS50 курсындағы сабақ: C, Python, SQL, веб", "lessons in CS50: C, Python, SQL, web"), icon: "graduation" as IconName },
              { value: 8, suffix: "", label: tr("человек максимум в группе, не поток из 100", "топтағы оқушылар саны, 100 адамдық ағын емес", "students max per group, not a class of 100"), icon: "users" as IconName },
              { value: 14, suffix: "", label: tr("дней на возврат денег — без вопросов", "күнде ақшаны қайтару — сұрақсыз", "days money-back — no questions asked"), icon: "award" as IconName },
            ].map((stat, i) => (
              <motion.div key={i} variants={staggerItem} whileHover={{ y: -6, transition: { duration: 0.2 } }} className="p-6 sm:p-7 lg:p-8 rounded-2xl bg-surface border border-border text-center hover:border-accent/40 hover:shadow-xl transition-all duration-300">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name={stat.icon} className="h-6 w-6" /></div>
                <p className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-accent mb-2 leading-none tabular-nums">
                  <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-foreground/60 leading-snug">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section id="about" className="relative py-20 sm:py-28 overflow-hidden bg-[#0F0F1A] text-[#FFFBF5]" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <CodeBackdrop />
        <div className="pointer-events-none absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="max-w-2xl mb-14 sm:mb-20">
            <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("Почему Alfa Z", "Неге Alfa Z", "Why Alfa Z")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {tr("Не курсы по видео,", "Видеокурс емес,", "Not video courses,")}<br />{tr("а ", "", "but ")}<span className="text-accent">{tr("настоящая школа", "нағыз мектеп", "a real school")}</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "video" as IconName, title: tr("Живые уроки", "Тікелей сабақтар", "Live lessons"), desc: tr("Никаких бесконечных записей. Преподаватель видит каждого, отвечает на вопросы прямо на занятии.", "Шексіз жазбалар жоқ. Ұстаз әр оқушыны көреді, сұрақтарға сабақ үстінде жауап береді.", "No endless recordings. The teacher sees everyone and answers questions right in class.") },
              { icon: "code" as IconName, title: tr("Преподаватели-практики", "Тәжірибелі ұстаздар", "Practicing instructors"), desc: tr("Не теоретики из университета — все работают в IT-компаниях прямо сейчас.", "Университет теоретиктері емес — бәрі қазір IT-компанияларда жұмыс істейді.", "Not university theorists — they all work at IT companies right now.") },
              { icon: "rocket" as IconName, title: tr("Реальные проекты", "Нақты жобалар", "Real projects"), desc: tr("К концу обучения у ученика портфолио на GitHub, которое можно показать работодателю.", "Оқу соңында оқушыда GitHub-та портфолио болады, оны жұмыс берушіге көрсетуге болады.", "By the end, the student has a GitHub portfolio to show an employer.") },
              { icon: "graduation" as IconName, title: tr("Помощь после", "Оқудан кейінгі қолдау", "Support afterwards"), desc: tr("Сертификат, помощь с резюме и подготовка к первым стажировкам в IT.", "Сертификат, резюме дайындауға көмек және алғашқы IT-тәжірибеге дайындық.", "A certificate, resume help, and prep for your first IT internships.") },
            ].map((card, i) => (
              <TiltCard key={i} className="h-full" max={8} lift={8}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.06 }}
                  className="group h-full p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-accent/40 hover:bg-white/[0.07] transition-colors duration-300"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent transition-transform duration-300 group-hover:scale-110"><Icon name={card.icon} className="h-6 w-6" /></div>
                  <h3 className="font-display text-xl font-bold mb-2">{card.title}</h3>
                  <p className="text-sm text-[#FFFBF5]/60 leading-relaxed">{card.desc}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section id="courses" className="relative py-20 sm:py-28 overflow-hidden bg-midnight text-ink-fg" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <CodeBackdrop />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="max-w-2xl mb-14 sm:mb-20">
            <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("5 направлений", "5 бағыт", "5 tracks")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {tr("Серьёзные программы. ", "Салмақты бағдарламалар. ", "Serious programs. ")}<span className="text-accent">{tr("Реальные результаты.", "Нақты нәтижелер.", "Real results.")}</span>
            </h2>
            <p className="text-lg text-ink-fg/70 mt-4 max-w-xl">{tr("От первого проекта с помощью AI до фундамента Computer Science уровня Гарварда. Живые занятия, защита проекта, сертификаты каждые 3 недели.", "AI көмегімен алғашқы жобадан Гарвард деңгейіндегі Computer Science іргетасына дейін. Тікелей сабақтар, жоба қорғау, әр 3 апта сайын сертификат.", "From your first AI-assisted project to Harvard-level Computer Science fundamentals. Live classes, project defense, certificates every 3 weeks.")}</p>
          </motion.div>

          {/* 🎓 ФЛАГМАН — Гарвардский курс CS50 (тёмная премиум-панель) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-6 lg:mb-8 overflow-hidden rounded-3xl border border-white/12 bg-[#0F0F1A]/55 text-ink-fg shadow-2xl backdrop-blur-sm"
          >
            {/* Свечения фона */}
            <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-accent-soft/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-accent-3/25 blur-3xl" />
            <div className="relative grid lg:grid-cols-2 gap-6 lg:gap-4 items-center p-7 sm:p-9 lg:p-10">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 mb-5">
                  <span className="text-sm">🎓</span>
                  <span className="text-xs font-bold text-accent uppercase tracking-widest">{tr("Флагман · Программа Гарварда", "Флагман · Гарвард бағдарламасы", "Flagship · Harvard program")}</span>
                </div>
                <h3 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.05] mb-3">
                  {tr("Гарвардский курс ", "Гарвардтың ", "Harvard ")}<span className="text-accent">CS50</span>{tr("", " курсы", " course")}
                </h3>
                <p className="text-sm font-semibold text-accent/90 mb-4">Scratch → C → Python → SQL → {tr("веб", "веб", "web")} → Flask</p>
                <p className="text-[#FFFBF5]/75 leading-relaxed mb-6 max-w-lg">
                  {tr("Легендарный вводный курс информатики Гарварда, адаптированный на русский. Настоящий фундамент Computer Science — от того, как устроена память компьютера, до полноценного веб-приложения на Flask.", "Гарвардтың информатика бойынша аңызға айналған кіріспе курсы. Computer Science-тің нағыз іргетасы — компьютер жады қалай жұмыс істейтінінен бастап Flask-тегі толыққанды веб-қосымшаға дейін.", "Harvard's legendary intro to computer science. A real Computer Science foundation — from how computer memory works to a full web app on Flask.")}
                </p>
                <div className="grid grid-cols-3 gap-3 mb-6 max-w-md">
                  {[
                    { n: "49", l: tr("занятий", "сабақ", "lessons") },
                    { n: "11", l: tr("модулей", "модуль", "modules") },
                    { n: "7", l: "Problem Sets" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-2xl bg-white/5 border border-white/10 px-3 py-3 text-center">
                      <p className="font-display text-2xl sm:text-3xl font-bold text-accent leading-none tabular-nums">{s.n}</p>
                      <p className="text-[11px] text-[#FFFBF5]/55 mt-1">{s.l}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-2.5 rounded-xl bg-white/5 border border-white/10 px-4 py-3 mb-6 max-w-lg">
                  <Icon name="award" className="h-5 w-5 flex-shrink-0 text-accent mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold text-[#FFFBF5]/45 uppercase tracking-wider mb-0.5">{tr("В конце курса", "Курс соңында", "By the end")}</p>
                    <p className="text-sm font-semibold leading-snug">{tr("Портфолио уровня CS50 + фундамент, с которым легко даётся любой язык", "CS50 деңгейіндегі портфолио + кез келген тіл оңай меңгерілетін іргетас", "A CS50-level portfolio + a foundation that makes any language easy")}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button onClick={() => openApply("Гарвардский курс CS50")} className="cursor-target inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-accent/30">
                    {tr("Записаться на CS50", "CS50-ге жазылу", "Enroll in CS50")} <span>→</span>
                  </button>
                  <a href="#pricing" className="cursor-target inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/15 border border-white/15 text-[#FFFBF5] rounded-xl font-semibold transition-all">
                    {tr("Условия и цена", "Шарттар мен баға", "Terms & price")}
                  </a>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <CodeWindow
                  title="hello.c"
                  interactive
                  stack={["Scratch", "C", "Python", "SQL", "Flask", "JavaScript"]}
                  code={`#include <cs50.h>
#include <stdio.h>

int main(void)
{
    string name = get_string("Как тебя зовут? ");
    printf("Привет, %s!\\n", name);
}`}
                />
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
            {[
              { emoji: "📱", title: tr("Мобильная разработка", "Мобильді әзірлеу", "Mobile development"), tagline: "FlutterFlow → Flutter → Firebase", desc: tr("Создаём приложения для Android и iOS. От квиза «Какой ты персонаж» до мини-Instagram для класса.", "Android және iOS үшін қосымшалар жасаймыз. «Сен қай кейіпкерсің» квизінен сынып үшін мини-Instagram-ға дейін.", "We build apps for Android and iOS. From a 'Which character are you' quiz to a mini-Instagram for the class."), result: tr("Финал в Google Play + AdMob + профиль на Upwork", "Финал Google Play-де + AdMob + Upwork профилі", "Final on Google Play + AdMob + an Upwork profile"), lessons: tr("48 уроков · 24 недели", "48 сабақ · 24 апта", "48 lessons · 24 weeks"), age: tr("14–17 лет", "14–17 жас", "ages 14–17"), certs: tr("14+ сертификатов", "14+ сертификат", "14+ certificates"), stack: ["Flutter", "Dart", "Firebase", "Flame", "Codemagic"], bgClass: "bg-gradient-to-br from-accent/15 via-accent-soft/10 to-transparent", coursePage: "/courses/mobdev", kind: "mobdev" as const, glow: "#FF6B47", file: "quiz_app.dart", code: `import 'package:flutter/material.dart';

void main() => runApp(const QuizApp());

class QuizApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const MaterialApp(home: QuizScreen());
  }
}` },
              { emoji: "🎮", title: tr("Геймдев на Unity", "Unity-де геймдев", "Game dev on Unity"), tagline: "Unity 6 + C# + 2D", desc: tr("Делаем игры жанров Mario, Hollow Knight, Celeste. Финальная игра на 3 платформах.", "Mario, Hollow Knight, Celeste жанрындағы ойындар жасаймыз. Финалдық ойын 3 платформада.", "We make games in the style of Mario, Hollow Knight, Celeste. A final game on 3 platforms."), result: tr("Игра на itch.io + Google Play + App Store", "Ойын itch.io + Google Play + App Store-да", "A game on itch.io + Google Play + App Store"), lessons: tr("50 уроков · 25 недель", "50 сабақ · 25 апта", "50 lessons · 25 weeks"), age: tr("13–18 лет", "13–18 жас", "ages 13–18"), certs: tr("5–8 игр в портфолио", "портфолиода 5–8 ойын", "5–8 games in a portfolio"), stack: ["Unity 6", "C#", "Piskel", "Git"], bgClass: "bg-gradient-to-br from-accent-soft/20 via-muted/30 to-transparent", coursePage: "/courses/gamedev", kind: "gamedev" as const, glow: "#FFB088", file: "Player.cs", code: `using UnityEngine;

public class Player : MonoBehaviour {
    public float speed = 8f;

    void Update() {
        float x = Input.GetAxis("Horizontal");
        transform.Translate(x * speed * Time.deltaTime, 0, 0);
    }
}` },
              { emoji: "🌐", title: tr("Веб-разработка", "Веб-әзірлеу", "Web development"), tagline: "HTML → CSS → JavaScript → React", desc: tr("Учимся делать современные сайты как профессионалы. От первого Hello, World до React-приложения.", "Заманауи сайттарды кәсіби деңгейде жасауды үйренеміз. Алғашқы Hello, World-тан React-қосымшаға дейін.", "We learn to build modern sites like pros. From your first Hello, World to a React app."), result: tr("React-приложение в интернете + GitHub-портфолио", "Интернеттегі React-қосымша + GitHub-портфолио", "A React app online + a GitHub portfolio"), lessons: tr("48 уроков · 24 недели", "48 сабақ · 24 апта", "48 lessons · 24 weeks"), age: tr("12–17 лет", "12–17 жас", "ages 12–17"), certs: tr("6 сертификатов", "6 сертификат", "6 certificates"), stack: ["React", "TypeScript", "Tailwind", "Git"], bgClass: "bg-gradient-to-br from-foreground/[0.04] via-muted/40 to-transparent", coursePage: "/courses/web", kind: "web" as const, glow: "#FF6B47", file: "App.jsx", code: `import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Кликнули {count}
    </button>
  );
}` },
              { emoji: "⚙️", title: tr("Бэкенд на Python", "Python-дағы бэкенд", "Backend on Python"), tagline: "Python → SQL → Flask → Docker", desc: tr("«Мозги» сайтов и приложений. Создаём Telegram-бот, который работает 24/7, и боевой REST API.", "Сайттар мен қосымшалардың «миы». 24/7 жұмыс істейтін Telegram-бот пен нақты REST API жасаймыз.", "The 'brains' of sites and apps. We build a Telegram bot that runs 24/7 and a real REST API."), result: tr("Telegram-бот 24/7 + REST API на Docker в интернете", "Telegram-бот 24/7 + интернеттегі Docker-дегі REST API", "A 24/7 Telegram bot + a REST API on Docker online"), lessons: tr("52 урока · 26 недель", "52 сабақ · 26 апта", "52 lessons · 26 weeks"), age: tr("13–18 лет", "13–18 жас", "ages 13–18"), certs: tr("5–7 проектов в портфолио", "портфолиода 5–7 жоба", "5–7 projects in a portfolio"), stack: ["Python", "Flask", "FastAPI", "SQL", "Docker"], bgClass: "bg-gradient-to-br from-muted/30 via-accent-soft/10 to-transparent", coursePage: "/courses/backend", kind: "backend" as const, glow: "#FF6B47", file: "guess_game_bot.py", code: `import random

secret = random.randint(1, 100)

async def check(update, ctx):
    guess = int(update.message.text)
    if guess < secret:
        await update.message.reply_text("Больше!")
    elif guess > secret:
        await update.message.reply_text("Меньше!")
    else:
        await update.message.reply_text("Угадал!")` },
            ].map((course, i) => (
              <TiltCard key={i} className="h-full" max={7} lift={10}>
                <motion.div
                  initial={{ opacity: 0, y: 34 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (i % 2) * 0.08 }}
                  className="glow-hover group relative h-full p-6 lg:p-7 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-accent/40 hover:bg-white/[0.07] duration-300 overflow-hidden flex flex-col"
                >
                  {/* 🖥 Окно редактора со сниппетом направления */}
                  <div className="mb-5">
                    <CodeWindow title={course.file} code={course.code} stack={course.stack} interactive />
                  </div>
                  <h3 className="font-display text-2xl lg:text-3xl font-bold mb-1.5 leading-tight">{course.title}</h3>
                  <p className="text-sm font-medium text-accent mb-4">{course.tagline}</p>
                  <p className="text-ink-fg/70 leading-relaxed mb-5">{course.desc}</p>
                  <div className="inline-flex items-start gap-2.5 px-4 py-3 rounded-xl bg-white/5 border border-white/10 mb-5">
                    <Icon name="award" className="h-5 w-5 flex-shrink-0 text-accent mt-0.5" />
                    <div><p className="text-xs font-semibold text-ink-fg/50 uppercase tracking-wider mb-0.5">{tr("В конце курса", "Курс соңында", "By the end")}</p><p className="text-sm font-semibold text-ink-fg leading-snug">{course.result}</p></div>
                  </div>
                  <div className="space-y-2 text-sm text-ink-fg/70 mb-5">
                    <div className="flex items-center gap-2.5"><Icon name="book" className="h-4 w-4 flex-shrink-0 text-accent/70" /><span>{course.lessons}</span></div>
                    <div className="flex items-center gap-2.5"><Icon name="users" className="h-4 w-4 flex-shrink-0 text-accent/70" /><span>{course.age}</span></div>
                    <div className="flex items-center gap-2.5"><Icon name="graduation" className="h-4 w-4 flex-shrink-0 text-accent/70" /><span>{course.certs}</span></div>
                  </div>
                  <div className="mt-auto flex flex-col sm:flex-row gap-2">
                    {course.coursePage ? (
                      <a href={course.coursePage} className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/15 text-ink-fg rounded-xl font-semibold transition-all hover:scale-[1.01]">
                        {tr("Подробнее", "Толығырақ", "Learn more")} <span>→</span>
                      </a>
                    ) : (
                      <span className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/5 text-ink-fg/45 rounded-xl font-medium text-sm cursor-default">
                        {tr("Страница — скоро", "Бет — жақында", "Page — soon")}
                      </span>
                    )}
                    <button onClick={() => openApply(course.title)} className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold transition-all hover:scale-[1.01] shadow-md shadow-accent/20">
                      {tr("Записаться", "Жазылу", "Enroll")} <span>→</span>
                    </button>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
          <motion.div variants={fadeInUp} className="mt-12 sm:mt-16 text-center">
            <p className="text-ink-fg/60 text-sm mb-2">{tr("Не уверены, какой курс подходит ребёнку?", "Балаңызға қай курс лайық екенін білмейсіз бе?", "Not sure which course fits your child?")}</p>
            <button onClick={() => openApply()} className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-semibold transition-colors">
              {tr("Записаться на бесплатный пробный урок и определиться вместе", "Тегін сынақ сабаққа жазылып, бірге шешейік", "Book a free trial and decide together")} <span>→</span>
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* 🖥 ПРИМЕРЫ РАБОТ — реальные интерактивные демо из уроков */}
      <motion.section id="examples" className="relative py-20 sm:py-28 border-t border-border bg-background" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="max-w-2xl mb-12 sm:mb-16">
            <p className="font-mono text-xs sm:text-sm text-accent tracking-wider mb-3">// {tr("примеры_работ", "жұмыс_мысалдары", "student_work")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {tr("Что ты делаешь ", "Алғашқы сабақтарда ", "What you build ")}<span className="text-accent">{tr("уже на первых уроках", "не істейсің", "from the very first lessons")}</span>
            </h2>
            <p className="text-lg text-foreground/70 mt-4">
              {tr("Не теория в тетради — интерактив с первого занятия. Ниже — живые симуляторы из наших уроков: выбери курс, жми кнопки, играй, вводи данные. Это не видео и не скриншоты — работает прямо здесь.", "Дәптердегі теория емес — бірінші сабақтан интерактив. Төменде — сабақтарымыздан тірі симуляторлар: курсты таңда, батырмаларды бас, ойна, дерек енгіз. Бұл видео да, скриншот та емес — дәл осы жерде жұмыс істейді.", "Not theory in a notebook — hands-on from the first class. Below are live simulators from our lessons: pick a course, press buttons, play, enter data. Not a video, not screenshots — it works right here.")}
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <LiveDemos />
          </motion.div>
        </div>
      </motion.section>

      <motion.section id="pricing" className="relative py-20 sm:py-28 border-t border-border bg-gradient-to-b from-background via-muted/10 to-background" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">

          {/* Заголовок секции */}
          <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("Цены и оплата", "Бағалар мен төлем", "Pricing & payment")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              {tr("Доступно. ", "Қолжетімді. ", "Affordable. ")}<span className="text-accent">{tr("Прозрачно. Честно.", "Ашық. Адал.", "Transparent. Honest.")}</span>
            </h2>
            <p className="text-lg text-foreground/70">
              {tr("Одна понятная цена — ", "Барлығына бір түсінікті баға — ", "One clear price — ")}<span className="font-bold text-foreground">75 000 ₸ {tr("в месяц", "айына", "per month")}</span>{tr(" за всё: живые уроки, куратор 24/7, проверка ДЗ и защита проекта. Для льготных категорий — ", ": тікелей сабақтар, 24/7 куратор, ҮЖ тексеру және жоба қорғау. Жеңілдік санаттарына — ", " for everything: live lessons, a 24/7 mentor, homework review, and project defense. For eligible categories — ")}<span className="font-bold text-accent">60 000 ₸</span>{tr(" (−20%). Доступна Kaspi-рассрочка 0%.", " (−20%). Kaspi 0% бөліп төлеу қолжетімді.", " (−20%). Kaspi 0% installments available.")}
            </p>
          </motion.div>

          {/* 🎯 ОДНА ЦЕНА — ВСЁ ВКЛЮЧЕНО */}
          <motion.div variants={fadeInUp} className="max-w-4xl mx-auto mb-12 p-8 sm:p-10 lg:p-12 rounded-3xl bg-gradient-to-br from-accent/10 via-accent-soft/10 to-transparent border-2 border-accent/30">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">{tr("Честная цена", "Адал баға", "Fair price")}</p>
              <h3 className="font-display text-2xl sm:text-3xl font-bold leading-tight">
                {tr("Одна цена. ", "Бір баға. ", "One price. ")}<span className="text-accent">{tr("Всё включено.", "Бәрі кіреді.", "Everything included.")}</span>
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 items-stretch">
              {/* Стандарт */}
              <div className="text-center rounded-2xl bg-surface/60 border border-border p-6">
                <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3">{tr("Стандарт", "Стандарт", "Standard")}</p>
                <p className="font-display text-5xl lg:text-6xl font-bold text-foreground leading-none mb-2 tabular-nums">75 000 <span className="text-2xl text-foreground/60">₸</span></p>
                <p className="text-sm text-foreground/65 mt-2">{tr("в месяц, весь период обучения", "айына, бүкіл оқу кезеңінде", "per month, the whole course")}</p>
                <p className="text-xs text-foreground/50 mt-1">{tr("8 уроков по 90 минут", "90 минуттан 8 сабақ", "8 lessons of 90 minutes")}</p>
              </div>

              {/* Льготникам */}
              <div className="relative text-center rounded-2xl bg-gradient-to-br from-accent/15 to-accent-soft/10 border-2 border-accent/40 p-6">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-white text-[11px] font-bold uppercase tracking-wider whitespace-nowrap shadow-lg">{tr("Льготная −20%", "Жеңілдік −20%", "Discount −20%")}</div>
                <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-3 mt-1">{tr("Льготным категориям", "Жеңілдік санаттарына", "For eligible categories")}</p>
                <p className="font-display text-5xl lg:text-6xl font-bold text-accent leading-none mb-2 tabular-nums">60 000 <span className="text-2xl text-accent/60">₸</span></p>
                <p className="text-sm text-foreground/65 mt-2">{tr("многодетным, при инвалидности и др.", "көп балалы, мүгедектік және т.б.", "large families, disability, etc.")}</p>
                <p className="text-xs text-foreground/50 mt-1">{tr("по подтверждающему документу", "растайтын құжат бойынша", "with a supporting document")}</p>
              </div>
            </div>

            <div className="mt-7 pt-6 border-t border-accent/20 grid sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-accent text-base flex-shrink-0">✓</span>
                <span className="text-foreground/75 leading-snug">{tr("Без скрытых платежей — цена фиксирована на весь курс", "Жасырын төлемсіз — баға бүкіл курсқа бекітілген", "No hidden fees — the price is fixed for the whole course")}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-accent text-base flex-shrink-0">💳</span>
                <span className="text-foreground/75 leading-snug">{tr("Kaspi-рассрочка 0% на 3 или 6 месяцев", "Kaspi 0% бөліп төлеу 3 не 6 айға", "Kaspi 0% installments over 3 or 6 months")}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-accent text-base flex-shrink-0">🔓</span>
                <span className="text-foreground/75 leading-snug">{tr("Можно прекратить в любой момент, без штрафов", "Кез келген уақытта тоқтатуға болады, айыппұлсыз", "Cancel anytime, no penalties")}</span>
              </div>
            </div>
          </motion.div>

          {/* 🎁 3 ФОРМАТА ОПЛАТЫ */}
          <motion.div variants={fadeInUp} className="text-center mb-8">
            <h3 className="font-display text-xl sm:text-2xl font-bold mb-2">{tr("3 формата оплаты", "3 төлем форматы", "3 payment formats")}</h3>
            <p className="text-sm text-foreground/65">{tr("Выберите удобный для вас", "Өзіңізге ыңғайлысын таңдаңыз", "Choose the one that suits you")}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 lg:gap-6 mb-14">
            {[
              { emoji: "📅", badge: null, title: tr("Стандарт", "Стандарт", "Standard"), subtitle: tr("Базовая цена", "Негізгі баға", "Base price"), price: "75 000", priceUnit: tr("₸ / месяц", "₸ / ай", "₸ / month"), priceFooter: tr("одинаково весь период обучения", "бүкіл оқу кезеңінде бірдей", "the same for the whole course"), description: tr("Прозрачная фиксированная цена за всё: живые уроки, куратор, проверка ДЗ, защита проекта.", "Барлығына ашық бекітілген баға: тікелей сабақтар, куратор, ҮЖ тексеру, жоба қорғау.", "A transparent fixed price for everything: live lessons, a mentor, homework review, project defense."), features: [tr("Без обязательств на год", "Жылдық міндеттемесіз", "No year-long commitment"), tr("Оплата картой или Kaspi", "Картамен не Kaspi-мен төлеу", "Pay by card or Kaspi"), tr("Можно прекратить в любой момент", "Кез келген уақытта тоқтатуға болады", "Cancel anytime")], ctaText: tr("Подходит для большинства", "Көпшілікке қолайлы", "Fits most people"), bgClass: "bg-surface border-border", highlight: false },
              { emoji: "💛", badge: tr("Льготная цена −20%", "Жеңілдік бағасы −20%", "Discount −20%"), title: tr("Льготникам", "Жеңілдік санатына", "Discounted"), subtitle: tr("Многодетным, инвалидам и др.", "Көп балалы, мүгедектік және т.б.", "Large families, disability, etc."), price: "60 000", priceUnit: tr("₸ / месяц", "₸ / ай", "₸ / month"), priceFooter: tr("весь период обучения", "бүкіл оқу кезеңінде", "the whole course"), description: tr("Скидка 20% для семей с особым статусом — по подтверждающему документу, на весь период обучения.", "Ерекше мәртебелі отбасыларға 20% жеңілдік — растайтын құжат бойынша, бүкіл оқу кезеңіне.", "A 20% discount for families with special status — with a supporting document, for the whole course."), features: [tr("Удостоверение многодетной", "Көп балалы отбасы куәлігі", "Large-family certificate"), tr("Справка из ЦОН / Акимат", "ЦОН / Әкімдіктен анықтама", "Certificate from PSC / Akimat"), tr("Справка об инвалидности", "Мүгедектік туралы анықтама", "Disability certificate")], ctaText: tr("Социальная скидка", "Әлеуметтік жеңілдік", "Social discount"), bgClass: "bg-gradient-to-br from-accent/10 via-accent-soft/10 to-transparent border-accent/40", highlight: true },
              { emoji: "🔥", badge: tr("Популярно", "Танымал", "Popular"), title: tr("Kaspi-рассрочка", "Kaspi бөліп төлеу", "Kaspi installments"), subtitle: tr("На 3 или 6 месяцев", "3 не 6 айға", "Over 3 or 6 months"), price: "0%", priceUnit: tr("переплаты", "артық төлем", "overpayment"), priceFooter: tr("делим 75 000 / 60 000 ₸ на месяцы", "75 000 / 60 000 ₸-ні айларға бөлеміз", "we split 75,000 / 60,000 ₸ across months"), description: tr("Любой тариф можно оформить через Kaspi-рассрочку 0% на 3 или 6 месяцев. Без справок, без поручителей.", "Кез келген тарифті Kaspi 0% бөліп төлеумен 3 не 6 айға рәсімдеуге болады. Анықтамасыз, кепілгерсіз.", "Any plan can be arranged via Kaspi 0% installments over 3 or 6 months. No certificates, no guarantors."), features: [tr("Решение за 5 минут", "5 минутта шешім", "A decision in 5 minutes"), tr("Без процентов", "Пайызсыз", "No interest"), tr("Удобный график списаний", "Ыңғайлы есептен шығару кестесі", "A convenient payment schedule")], ctaText: tr("Удобный способ", "Ыңғайлы тәсіл", "A convenient option"), bgClass: "bg-surface border-border", highlight: false },
            ].map((plan, i) => (
              <motion.div key={i} variants={staggerItem} whileHover={{ y: -8, transition: { duration: 0.2 } }} className={`relative p-6 lg:p-8 rounded-2xl border-2 ${plan.bgClass} transition-all duration-300 hover:shadow-xl flex flex-col`}>
                {plan.badge && (<div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg whitespace-nowrap ${plan.highlight ? 'bg-accent text-white' : 'bg-accent-soft text-foreground'}`}>{plan.badge}</div>)}
                <div className="text-4xl mb-4">{plan.emoji}</div>
                <h3 className="font-display text-2xl font-bold mb-1">{plan.title}</h3>
                <p className="text-sm text-foreground/60 mb-5">{plan.subtitle}</p>
                <div className="mb-4 pb-5 border-b border-border">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-4xl lg:text-5xl font-bold text-foreground tabular-nums">{plan.price}</span>
                  </div>
                  <p className="text-sm text-foreground/60 mt-1">{plan.priceUnit}</p>
                  <p className="text-xs text-accent font-semibold mt-2">{plan.priceFooter}</p>
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed mb-5 min-h-[60px]">{plan.description}</p>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <svg className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <p className={`text-xs font-semibold uppercase tracking-wider mt-auto ${plan.highlight ? 'text-accent' : 'text-foreground/40'}`}>{plan.ctaText}</p>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="bg-surface border border-border rounded-3xl p-8 sm:p-10 lg:p-12 mb-12">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">{tr("Что входит в стоимость", "Бағаға не кіреді", "What's included")}</p>
              <h3 className="font-display text-2xl sm:text-3xl font-bold">{tr("Никаких ", "Ешқандай ", "No ")}<span className="text-accent">{tr("скрытых платежей", "жасырын төлемдер жоқ", "hidden fees")}</span></h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: "users" as IconName, title: tr("Живые групповые уроки", "Тікелей топтық сабақтар", "Live group lessons"), desc: tr("48–52 урока в Discord, по 90 минут, 2 раза в неделю. Группы до 8 человек.", "Discord-та 48–52 сабақ, 90 минуттан, аптасына 2 рет. Топтар 8 адамға дейін.", "48–52 lessons on Discord, 90 minutes each, twice a week. Groups of up to 8.") },
                { icon: "clipboard" as IconName, title: tr("Домашние задания", "Үй тапсырмалары", "Homework"), desc: tr("С проверкой от преподавателя. Облегчённый уровень — если основной не получается.", "Ұстаз тексеруімен. Жеңілдетілген деңгей — негізгісі шықпаса.", "Reviewed by the instructor. An easier level if the main one doesn't work out.") },
                { icon: "message" as IconName, title: tr("Куратор между уроками", "Сабақ аралығында куратор", "A mentor between lessons"), desc: tr("Личный куратор отвечает в чате 24/7 на вопросы по ДЗ и проектам.", "Жеке куратор чатта 24/7 ҮЖ мен жобалар бойынша сұрақтарға жауап береді.", "A personal mentor answers homework and project questions in chat 24/7.") },
                { icon: "award" as IconName, title: tr("Сертификаты каждые 3 недели", "Әр 3 апта сайын сертификат", "Certificates every 3 weeks"), desc: tr("За каждый пройденный блок. 6–14 сертификатов за весь курс.", "Әр өткен блокқа. Бүкіл курсқа 6–14 сертификат.", "For every block completed. 6–14 certificates over the whole course.") },
                { icon: "presentation" as IconName, title: tr("Защита проекта", "Жоба қорғау", "Project defense"), desc: tr("В конце курса — реальный проект (приложение/игра/сайт/бот) в портфолио.", "Курс соңында — портфолиода нақты жоба (қосымша/ойын/сайт/бот).", "At the end of the course — a real project (app/game/site/bot) in a portfolio.") },
                { icon: "file" as IconName, title: tr("Помощь с резюме", "Резюмеге көмек", "Resume help"), desc: tr("Помогаем составить первое CV, GitHub-профиль и подготовиться к стажировкам.", "Алғашқы CV, GitHub-профиль құрастыруға және тәжірибеге дайындалуға көмектесеміз.", "We help build a first CV, a GitHub profile, and prepare for internships.") },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name={item.icon} className="h-5 w-5" /></div>
                  <div>
                    <h4 className="font-display font-bold text-base mb-1">{item.title}</h4>
                    <p className="text-sm text-foreground/65 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-accent/15 via-accent-soft/15 to-muted/30 border-2 border-accent/20">
            <div className="text-5xl mb-4">🎁</div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold mb-3">
              {tr("Первый урок — ", "Алғашқы сабақ — ", "The first lesson — ")}<span className="text-accent">{tr("бесплатно", "тегін", "free")}</span>
            </h3>
            <p className="text-foreground/70 mb-6 max-w-md mx-auto">{tr("Ребёнок попробует, познакомится с преподавателем. Если не понравится — никаких обязательств.", "Бала байқап көреді, ұстазбен танысады. Ұнамаса — ешқандай міндеттеме жоқ.", "Your child will try it and meet the instructor. If they don't like it — no obligations.")}</p>
            <button onClick={() => openApply()} className="inline-flex items-center gap-2 px-7 py-4 bg-accent hover:bg-accent-hover text-white rounded-full font-semibold hover:scale-[1.02] transition-all shadow-lg shadow-accent/30">
              {tr("Записаться на пробный урок", "Сынақ сабаққа жазылу", "Book a free trial")} <span>→</span>
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* 📅 РАСПИСАНИЕ — вечерние группы, набор идёт постоянно */}
      <motion.section id="schedule" className="relative py-20 sm:py-28 border-t border-border bg-muted/20" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">

          {/* Заголовок секции */}
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-10">
            <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("Расписание", "Кесте", "Schedule")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              {tr("Подберём ", "", "We'll find ")}<span className="text-accent">{tr("удобное расписание", "ыңғайлы кесте таңдаймыз", "a schedule that suits you")}</span>
            </h2>
            <p className="text-lg text-foreground/70">
              {tr("Набор в группы идёт постоянно. Занятия 2 раза в неделю по 90 минут — а дни и время подберём под вашего ребёнка: утром, днём или вечером, чтобы не мешало школе и секциям.", "Топтарға қабылдау үнемі жүреді. Сабақтар аптасына 2 рет, 90 минуттан — ал күндер мен уақытты балаңызға қарай таңдаймыз: таңертең, күндіз не кешке, мектеп пен үйірмелерге кедергі болмас үшін.", "Enrollment runs continuously. Classes are twice a week for 90 minutes — and we'll pick days and times to fit your child: morning, afternoon, or evening, so it doesn't clash with school and activities.")}
            </p>
          </motion.div>

          {/* Большая дата-карточка */}
          <motion.div variants={fadeInUp} className="max-w-3xl mx-auto mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-accent/10 via-accent-soft/10 to-transparent border-2 border-accent/30">
            <div className="grid sm:grid-cols-3 gap-5 sm:gap-6 text-center">
              <div>
                <span className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name="calendar" className="h-6 w-6" /></span>
                <p className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight">{tr("Набор открыт", "Қабылдау ашық", "Enrollment open")}</p>
                <p className="text-sm text-foreground/60 mt-1">{tr("старт по мере набора", "топ жиналған сайын басталады", "starts as groups fill")}</p>
              </div>
              <div className="sm:border-x sm:border-accent/20">
                <span className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name="clock" className="h-6 w-6" /></span>
                <p className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight">{tr("2 раза", "2 рет", "2×")}</p>
                <p className="text-sm text-foreground/60 mt-1">{tr("в неделю, по 90 минут", "аптасына, 90 минуттан", "a week, 90 minutes each")}</p>
              </div>
              <div>
                <span className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name="calendar" className="h-6 w-6" /></span>
                <p className="font-display text-xl sm:text-2xl font-bold text-foreground leading-tight">{tr("Гибкий график", "Икемді кесте", "Flexible schedule")}</p>
                <p className="text-xs text-foreground/55 mt-1">{tr("подберём удобные дни и время", "ыңғайлы күн мен уақыт таңдаймыз", "we'll pick convenient days and times")}</p>
              </div>
            </div>
          </motion.div>

          {/* Карточки курсов */}
          <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
            {[
              { course: tr("Гарвардский курс CS50", "Гарвардтың CS50 курсы", "Harvard CS50"), icon: "graduation" as IconName, color: "from-accent/10", age: tr("14–18 лет", "14–18 жас", "ages 14–18"), seatsLeft: 4, totalSeats: 8 },
              { course: tr("Веб-разработка", "Веб-әзірлеу", "Web development"), icon: "globe" as IconName, color: "from-foreground/5", age: tr("12–17 лет", "12–17 жас", "ages 12–17"), seatsLeft: 3, totalSeats: 8 },
              { course: tr("Мобильная разработка", "Мобильді әзірлеу", "Mobile development"), icon: "smartphone" as IconName, color: "from-accent/10", age: tr("14–17 лет", "14–17 жас", "ages 14–17"), seatsLeft: 5, totalSeats: 8 },
              { course: tr("Геймдев на Unity", "Unity-де геймдев", "Game dev on Unity"), icon: "gamepad" as IconName, color: "from-accent-soft/15", age: tr("13–18 лет", "13–18 жас", "ages 13–18"), seatsLeft: 2, totalSeats: 8 },
              { course: tr("Бэкенд на Python", "Python-дағы бэкенд", "Backend on Python"), icon: "settings" as IconName, color: "from-muted/30", age: tr("13–18 лет", "13–18 жас", "ages 13–18"), seatsLeft: 6, totalSeats: 8 },
            ].map((stream, i) => {
              const filledPct = ((stream.totalSeats - stream.seatsLeft) / stream.totalSeats) * 100;
              const isAlmostFull = stream.seatsLeft <= 3;
              return (
                <motion.div key={i} variants={staggerItem} whileHover={{ y: -6, transition: { duration: 0.2 } }} className={`relative p-6 lg:p-7 rounded-2xl bg-gradient-to-br ${stream.color} to-transparent bg-surface border border-border hover:border-accent/40 hover:shadow-xl transition-all duration-300`}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name={stream.icon} className="h-6 w-6" /></span>
                      <div>
                        <h3 className="font-display text-xl font-bold leading-tight">{stream.course}</h3>
                        <p className="text-xs text-foreground/55 mt-0.5">{stream.age}</p>
                      </div>
                    </div>
                    {isAlmostFull && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30">
                        <Icon name="flame" className="h-3 w-3 text-accent" />
                        <span className="text-[10px] font-bold text-accent uppercase tracking-wider whitespace-nowrap">{tr("Почти набрано", "Толуға жақын", "Almost full")}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-foreground/75 mb-5">
                    <div className="flex items-center gap-2">
                      <Icon name="calendar" className="h-4 w-4 flex-shrink-0 text-accent/70" />
                      <span className="font-semibold">{tr("Гибкий график · 2 раза в неделю", "Икемді кесте · аптасына 2 рет", "Flexible schedule · 2× a week")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="rocket" className="h-4 w-4 flex-shrink-0 text-accent/70" />
                      <span>{tr("Старт: по мере набора группы", "Басталуы: топ жиналған сайын", "Start: as the group fills")}</span>
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-foreground">{tr("Места в группе", "Топтағы орындар", "Seats in the group")}</span>
                      <span className="font-bold text-accent">{tr("Осталось: ", "Қалды: ", "Left: ")}{stream.seatsLeft}{tr(" из ", " / ", " of ")}{stream.totalSeats}</span>
                    </div>
                    <div className="h-2 rounded-full bg-foreground/10 overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${filledPct}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} className="h-full bg-gradient-to-r from-accent to-accent-soft rounded-full" />
                    </div>
                  </div>

                  <button onClick={() => openApply(stream.course)} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold transition-all hover:scale-[1.01] shadow-md shadow-accent/20">
                    {tr("Записаться в эту группу", "Осы топқа жазылу", "Join this group")} <span>→</span>
                  </button>
                </motion.div>
              );
            })}
          </div>

          <motion.div variants={fadeInUp} className="mt-12 text-center">
            <p className="text-foreground/60 text-sm mb-3">{tr("Расскажите про учёбу и секции ребёнка — встроим занятия в удобное окно, на любой график.", "Балаңыздың оқуы мен үйірмелері туралы айтыңыз — сабақтарды кез келген графикке, ыңғайлы уақытқа енгіземіз.", "Tell us about your child's school and activities — we'll fit the lessons into a convenient window, any schedule.")}</p>
            <button onClick={() => openApply()} className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-semibold transition-colors">
              {tr("Подобрать удобное время", "Ыңғайлы уақыт таңдау", "Find a convenient time")} <span>→</span>
            </button>
          </motion.div>
        </div>
      </motion.section>

      <section className="relative py-20 sm:py-28 bg-[#0F0F1A] text-[#FFFBF5]">
        {/* Клип свечения — сиблинг, не предок sticky-элемента (иначе sticky ломается) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={scrollViewport} variants={fadeInUp} className="max-w-2xl mb-16 sm:mb-24">
            <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("Как мы учим", "Қалай оқытамыз", "How we teach")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {tr("Три принципа, которые ", "Alfa Z-ті ", "Three principles that ")}<span className="text-accent">{tr("отличают Alfa Z", "ерекшелейтін үш ұстаным", "set Alfa Z apart")}</span>
            </h2>
          </motion.div>
          <HowWeTeach />
        </div>
      </section>

      {/* 🎮 ГЕЙМИФИКАЦИЯ — прогресс, уровни, ачивки (ассеты из Canva + SVG) */}
      <motion.section className="relative py-20 sm:py-28 bg-background border-t border-border" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
            <p className="font-mono text-xs sm:text-sm text-accent tracking-wider mb-3">// {tr("прогресс_и_достижения", "прогресс_пен_жетістіктер", "progress_and_achievements")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              {tr("Учёба, в которой ", "Оқу — мұнда ", "Learning where ")}<span className="text-accent">{tr("виден каждый шаг", "әр қадам көрінеді", "every step is visible")}</span><span className="text-accent font-mono animate-blink">_</span>
            </h2>
            <p className="text-lg text-foreground/70">
              {tr("Уровни мастерства, ачивки за реальные достижения и сертификаты каждые 3 недели — ребёнок видит прогресс, а не «всё в конце».", "Шеберлік деңгейлері, нақты жетістіктер үшін ачивкалар және әр 3 апта сайын сертификат — бала прогресті көреді, «бәрі соңында» емес.", "Skill levels, achievements for real milestones, and certificates every 3 weeks — the child sees progress, not 'everything at the end'.")}
            </p>
          </motion.div>

          {/* 🖥 Terminal-окно прогресса */}
          <motion.div variants={fadeInUp} className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-white/10 bg-[#0F0F1A] shadow-2xl shadow-[#0F0F1A]/40">
            {/* Плашка окна */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.04] border-b border-white/10">
              <span className="h-3 w-3 rounded-full bg-[#FF6B47]" />
              <span className="h-3 w-3 rounded-full bg-[#FFB088]" />
              <span className="h-3 w-3 rounded-full bg-[#FFB088]" />
              <span className="ml-3 font-mono text-[11px] sm:text-xs text-white/45 truncate">alfaz@student: ~/progress.log</span>
            </div>

            {/* Тело окна */}
            <div className="p-5 sm:p-8 lg:p-10 space-y-8">
              {/* Уровни */}
              <div>
                <p className="font-mono text-xs sm:text-sm text-accent-soft">$ progress --levels</p>
                <p className="font-mono text-[11px] sm:text-xs text-white/40 mb-6"># {tr("5 уровней мастерства: от новичка до защиты проекта", "5 шеберлік деңгейі: жаңадан бастаушыдан жоба қорғауға дейін", "5 skill levels: from beginner to project defense")}</p>
                <LevelBadges />
              </div>

              <div className="h-px bg-white/10" />

              {/* Ачивки */}
              <div>
                <p className="font-mono text-xs sm:text-sm text-accent-soft mb-4">$ achievements --unlocked</p>
                <ul className="space-y-2.5 font-mono text-xs sm:text-sm leading-relaxed">
                  {[
                    { key: "first_project", label: tr("Первый проект", "Алғашқы жоба", "First project") },
                    { key: "project_defense", label: tr("Защита проекта", "Жоба қорғау", "Project defense") },
                    { key: "week_streak", label: tr("Стрик недели", "Апталық стрик", "Weekly streak") },
                  ].map((a) => (
                    <li key={a.key} className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                      <span className="text-[#FFB088]">[✓]</span>
                      <span className="text-white/85">achievement_unlocked</span>
                      <span className="text-accent">{a.key}</span>
                      <span className="text-white/40">// {a.label}</span>
                    </li>
                  ))}
                  <li className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                    <span className="text-accent-soft">[»]</span>
                    <span className="text-white/85">certificate</span>
                    <span className="text-accent">every_3_weeks</span>
                    <span className="text-white/40">// {tr("6–14 сертификатов за курс", "курсқа 6–14 сертификат", "6–14 certificates per course")}</span>
                  </li>
                </ul>
                <p className="mt-5 font-mono text-xs sm:text-sm flex items-center gap-1">
                  <span className="text-accent-soft">$</span>
                  <span className="inline-block w-2 h-4 bg-accent-soft animate-blink" aria-hidden />
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section id="teachers" className="relative py-20 sm:py-28 bg-muted/30 border-t border-border" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="max-w-2xl mb-14 sm:mb-20">
            <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("Преподаватели", "Ұстаздар", "Instructors")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {tr("Не теоретики. ", "Теоретиктер емес. ", "Not theorists. ")}<span className="text-accent">{tr("Действующие разработчики.", "Нағыз әзірлеушілер.", "Working developers.")}</span>
            </h2>
            <p className="text-lg text-foreground/70 mt-4 max-w-xl">{tr("Каждый преподаватель работает в IT-компании прямо сейчас. Не «выпускник универа», а человек, который пишет код каждый день за зарплату.", "Әр ұстаз қазір IT-компанияда жұмыс істейді. «Университет түлегі» емес, күнде жалақыға код жазатын адам.", "Every instructor works at an IT company right now. Not a 'uni graduate', but someone who writes code every day for a living.")}</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {[
              { initials: "МБ", name: "Молдаханов Бектас", role: tr("Frontend-разработчик", "Frontend-әзірлеуші", "Frontend developer"), courses: tr("Веб-разработка", "Веб-әзірлеу", "Web development"), tag: tr("Практикующий", "Тәжірибелі", "Practicing"), secret: false },
              { initials: "МА", name: "Мадениетова Арайлым", role: "Unity Game Developer", courses: tr("Геймдев на Unity", "Unity-де геймдев", "Game dev on Unity"), tag: tr("Практикующий", "Тәжірибелі", "Practicing"), secret: false },
              { initials: "ЭМ", name: "Эльнара М.", role: "AI assisted developer", courses: tr("Мобильная разработка · AI", "Мобильді әзірлеу · AI", "Mobile development · AI"), tag: tr("Практикующий", "Тәжірибелі", "Practicing"), secret: false },
              { initials: "АК", name: "Айбат К.", role: tr("Backend-разработчик", "Backend-әзірлеуші", "Backend developer"), courses: tr("Бэкенд на Python", "Python-дағы бэкенд", "Backend on Python"), tag: tr("Практикующий", "Тәжірибелі", "Practicing"), secret: false },
              { initials: "🔒", name: tr("Секретный сениор", "Құпия сениор", "Secret senior"), role: "Senior Developer", courses: tr("Ведёт CS50 · раскроем позже", "CS50 жүргізеді · кейінірек ашамыз", "Teaches CS50 · revealed later"), tag: tr("Скоро", "Жақында", "Soon"), secret: true },
              { initials: "🔒", name: tr("Секретный сениор", "Құпия сениор", "Secret senior"), role: "Senior Developer", courses: tr("Ведёт CS50 · раскроем позже", "CS50 жүргізеді · кейінірек ашамыз", "Teaches CS50 · revealed later"), tag: tr("Скоро", "Жақында", "Soon"), secret: true },
            ].map((teacher, i) => (
              <TiltCard key={i} className="h-full" max={6} lift={8}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.06 }}
                  className="group h-full p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 hover:shadow-xl transition-colors duration-300"
                >
                  <div className={`relative w-full aspect-square rounded-xl mb-5 overflow-hidden flex items-center justify-center ${teacher.secret ? "bg-gradient-to-br from-[#0F0F1A] to-[#0F0F1A]" : "bg-gradient-to-br from-accent via-accent-soft to-muted"}`}>
                    <span className={`font-display font-bold drop-shadow-lg ${teacher.secret ? "text-6xl" : "text-5xl text-white"}`}>{teacher.initials}</span>
                    <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-lg bg-surface/95 backdrop-blur-sm text-xs font-semibold text-foreground text-center">{teacher.tag}</div>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-1">{teacher.name}</h3>
                  <p className="text-sm text-accent font-semibold mb-3">{teacher.role}</p>
                  <div className="space-y-1.5 text-sm text-foreground/60">
                    <p>📚 {teacher.courses}</p>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
          <motion.p variants={fadeInUp} className="text-sm text-foreground/50 mt-12 max-w-xl">🔒 {tr("Двух ведущих сениор-разработчиков мы раскроем при старте вашей группы — они ведут продвинутые модули Гарвардского курса CS50.", "Екі жетекші сениор-әзірлеушіні тобыңыз басталғанда ашамыз — олар Гарвардтың CS50 курсының озық модульдерін жүргізеді.", "We'll reveal two lead senior developers when your group starts — they teach the advanced modules of Harvard's CS50.")}</motion.p>
        </div>
      </motion.section>

      <motion.section id="reviews" className="relative py-20 sm:py-28 border-t border-border" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="max-w-2xl mx-auto text-center mb-14 sm:mb-16">
            <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("Отзывы", "Пікірлер", "Reviews")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {tr("Что говорят ", "Alfa Z туралы ", "What ")}<span className="text-accent">{tr("родители и ученики", "ата-аналар мен оқушылар", "parents and students say")}</span>{tr("", " не дейді?", "")}
            </h2>
          </motion.div>
          <motion.div variants={fadeInUp} className="max-w-2xl mx-auto p-8 sm:p-10 rounded-3xl bg-surface border border-border">
            <p className="text-lg sm:text-xl text-foreground/85 leading-relaxed">
              {tr("Alfa Z — новый бренд команды с опытом ", "Alfa Z — тәжірибесі ", "Alfa Z is a new brand from a team with ")}<span className="font-bold text-accent">{tr("5000+ учеников", "5000+ оқушы", "5000+ students")}</span>{tr(". Мы принципиально не публикуем придуманные цитаты: настоящие отзывы именно об Alfa Z появятся здесь после первых защит проектов.", " командасының жаңа бренді. Біз ойдан шығарылған цитаталарды жарияламаймыз: нақ Alfa Z туралы шынайы пікірлер алғашқы жоба қорғаулардан кейін осы жерде пайда болады.", " of experience. We don't publish made-up quotes: real reviews specifically about Alfa Z will appear here after the first project defenses.")}
            </p>
            <p className="text-base text-foreground/60 leading-relaxed mt-4">
              {tr("Хотите пообщаться с командой до старта? Напишите нам в WhatsApp — расскажем о программе и ответим на вопросы.", "Бастау алдында командамен сөйлескіңіз келе ме? WhatsApp-қа жазыңыз — бағдарлама туралы айтып, сұрақтарға жауап береміз.", "Want to talk to the team before starting? Message us on WhatsApp — we'll tell you about the program and answer your questions.")}
            </p>
          </motion.div>
        </div>
      </motion.section>

      <motion.section id="faq" className="relative py-20 sm:py-28 bg-muted/30 border-t border-border" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-14 sm:mb-20">
            <p className="font-mono text-xs font-bold text-accent uppercase tracking-widest mb-3">{tr("Частые вопросы", "Жиі қойылатын сұрақтар", "FAQ")}</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              {tr("Если что-то ещё ", "Егер әлі де бірдеңе ", "If something's still ")}<span className="text-accent">{tr("не понятно", "түсініксіз болса", "unclear")}</span>
            </h2>
            <p className="text-lg text-foreground/70">{tr("Самые частые вопросы родителей. Если не нашли ответ — напишите в WhatsApp.", "Ата-аналардың жиі қоятын сұрақтары. Жауабын таппасаңыз — WhatsApp-қа жазыңыз.", "The questions parents ask most. Didn't find an answer? Message us on WhatsApp.")}</p>
          </motion.div>
          <div className="space-y-3">
            {[
              { q: tr("Когда стартует обучение и какое расписание?", "Оқу қашан басталады және кесте қандай?", "When does training start and what's the schedule?"), a: tr("Набор в группы идёт постоянно, занятия начинаются по мере комплектации группы (обычно занята за 1–2 недели). Все 5 направлений доступны. Занятия 2 раза в неделю по 90 минут — а дни и время подберём под вашего ребёнка (утро, день или вечер), чтобы не мешало школе и секциям. Актуальные свободные окна уточняйте в WhatsApp.", "Топтарға қабылдау үнемі жүреді, сабақтар топ жиналған сайын басталады (әдетте 1–2 аптада толады). 5 бағыттың бәрі қолжетімді. Сабақтар аптасына 2 рет, 90 минуттан — ал күндер мен уақытты балаңызға қарай таңдаймыз (таңертең, күндіз не кешке), мектеп пен үйірмелерге кедергі болмас үшін. Бос орындарды WhatsApp-тан нақтылаңыз.", "Enrollment runs continuously; classes start as each group fills (usually within 1–2 weeks). All 5 tracks are available. Classes are twice a week for 90 minutes — and we'll pick days and times to fit your child (morning, afternoon, or evening) so it doesn't clash with school and activities. Ask about open slots on WhatsApp.") },
              { q: tr("Сколько стоит обучение?", "Оқу қанша тұрады?", "How much does it cost?"), a: tr("75 000 ₸ в месяц (8 уроков по 90 минут) — одинаково весь период обучения, без скрытых доплат. В цену входит всё: живые уроки, куратор 24/7, проверка ДЗ и защита проекта. Для многодетных семей, родителей с инвалидностью и других льготных категорий — 60 000 ₸ в месяц (−20%). Также доступна Kaspi-рассрочка 0% на 3 или 6 месяцев.", "Айына 75 000 ₸ (90 минуттан 8 сабақ) — бүкіл оқу кезеңінде бірдей, жасырын қосымша төлемсіз. Бағаға бәрі кіреді: тікелей сабақтар, 24/7 куратор, ҮЖ тексеру және жоба қорғау. Көп балалы отбасыларға, мүгедектігі бар ата-аналарға және басқа жеңілдік санаттарына — айына 60 000 ₸ (−20%). Сондай-ақ Kaspi 0% бөліп төлеу 3 не 6 айға қолжетімді.", "75,000 ₸ per month (8 lessons of 90 minutes) — the same for the whole course, with no hidden fees. Everything is included: live lessons, a 24/7 mentor, homework review, and project defense. For large families, parents with a disability, and other eligible categories — 60,000 ₸ per month (−20%). Kaspi 0% installments over 3 or 6 months are also available.") },
              { q: tr("Что за Гарвардский курс CS50?", "Гарвардтың CS50 курсы деген не?", "What is Harvard's CS50 course?"), a: tr("Это легендарный вводный курс информатики Гарвардского университета (CS50), адаптированный на русский язык: 49 занятий, 11 модулей, 7 Problem Sets. Программа ведёт от Scratch и языка C через алгоритмы, структуры данных и работу с памятью к Python, SQL и полноценному веб-приложению на Flask. Даёт настоящий фундамент Computer Science, с которым потом легко даётся любой язык и направление.", "Бұл — Гарвард университетінің информатика бойынша аңызға айналған кіріспе курсы (CS50): 49 сабақ, 11 модуль, 7 Problem Sets. Бағдарлама Scratch пен C тілінен алгоритмдер, деректер құрылымы және жадпен жұмыс арқылы Python, SQL және Flask-тегі толыққанды веб-қосымшаға жетелейді. Computer Science-тің нағыз іргетасын береді, онымен кейін кез келген тіл мен бағыт оңай меңгеріледі.", "It's the University's legendary intro to computer science (CS50): 49 lessons, 11 modules, 7 Problem Sets. The program goes from Scratch and the C language through algorithms, data structures, and memory to Python, SQL, and a full web app on Flask. It builds a real Computer Science foundation that makes any language or track easy afterward.") },
              { q: tr("Что если ребёнок заболел или пропустил урок?", "Бала ауырса не сабақты жіберіп алса ше?", "What if my child gets sick or misses a lesson?"), a: tr("Все занятия проходят вживую в маленьких группах, но каждый урок доступен в записи — ребёнок сможет наверстать пропущенное. Куратор поможет догнать материал в чате, а домашнее задание можно сдать позже. Болезнь со справкой мы всегда идём навстречу.", "Барлық сабақтар шағын топтарда тікелей өтеді, бірақ әр сабақтың жазбасы болады — бала жіберіп алғанын толықтыра алады. Куратор чатта материалды қууға көмектеседі, үй тапсырмасын кейінірек тапсыруға болады. Анықтамамен ауырғанда әрқашан жағдай жасаймыз.", "All classes are live in small groups, but every lesson is recorded — your child can catch up. The mentor helps recover the material in chat, and homework can be submitted later. With a doctor's note for illness, we always accommodate.") },
              { q: tr("Какие документы нужны для льготной цены?", "Жеңілдік бағасына қандай құжаттар керек?", "What documents are needed for the discounted price?"), a: tr("Любой из документов: удостоверение многодетной семьи, справка из ЦОН или Акимата о льготном статусе, справка об инвалидности (своей или ребёнка). Документ один раз показываете при оформлении — и получаете цену 60 000 ₸ в месяц (вместо 75 000 ₸) на весь период обучения.", "Кез келген құжат: көп балалы отбасы куәлігі, ЦОН не Әкімдіктен жеңілдік мәртебесі туралы анықтама, мүгедектік туралы анықтама (өзіңіздің не баланың). Құжатты рәсімдеу кезінде бір рет көрсетесіз — және бүкіл оқу кезеңіне айына 60 000 ₸ (75 000 ₸ орнына) бағасын аласыз.", "Any of these: a large-family certificate, a discount-status certificate from the PSC (TsON) or Akimat, or a disability certificate (yours or the child's). You show the document once at signup — and get 60,000 ₸ per month (instead of 75,000 ₸) for the whole course.") },
              { q: tr("С какого возраста можно учиться?", "Қай жастан бастап оқуға болады?", "From what age can kids start?"), a: tr("Веб-разработка — с 12 лет, остальные курсы — с 13. Верхняя граница — 17–18 лет.", "Веб-әзірлеу — 12 жастан, қалған курстар — 13 жастан. Жоғарғы шек — 17–18 жас.", "Web development from age 12, the other courses from 13. The upper limit is 17–18.") },
              { q: tr("Что нужно для старта? Какой нужен компьютер?", "Бастау үшін не керек? Қандай компьютер қажет?", "What do you need to start? What computer is required?"), a: tr("Любой компьютер не старше 5–7 лет — Windows, Mac или мощный Chromebook. Для геймдева на Unity нужно 8 ГБ RAM минимум.", "5–7 жастан аспаған кез келген компьютер — Windows, Mac не қуатты Chromebook. Unity-дегі геймдев үшін кемінде 8 ГБ RAM қажет.", "Any computer no older than 5–7 years — Windows, Mac, or a powerful Chromebook. For game dev on Unity you need at least 8 GB of RAM.") },
              { q: tr("Как проходят занятия? Это записи или живые?", "Сабақтар қалай өтеді? Жазба ма, тірі ме?", "How are classes run? Recorded or live?"), a: tr("Живые групповые уроки 2 раза в неделю по 90 минут в Discord. Группы маленькие — до 8 человек.", "Discord-та аптасына 2 рет, 90 минуттан тікелей топтық сабақтар. Топтар шағын — 8 адамға дейін.", "Live group lessons twice a week for 90 minutes on Discord. Groups are small — up to 8 students.") },
              { q: tr("Безопасно ли это для ребёнка?", "Бұл бала үшін қауіпсіз бе?", "Is it safe for my child?"), a: tr("Все преподаватели проходят отбор и подписывают договор о работе с детьми. На уроках всегда включена камера у всех.", "Барлық ұстаздар іріктеуден өтеді және балалармен жұмыс туралы келісімге қол қояды. Сабақтарда әрқашан бәрінің камерасы қосулы.", "All teachers are vetted and sign an agreement about working with children. Cameras are always on for everyone during lessons.") },
              { q: tr("А если ребёнок передумает?", "Ал бала ойын өзгертсе ше?", "What if my child changes their mind?"), a: tr("Первый месяц — пробный. Если в течение 14 дней решит, что не его — вернём деньги полностью, без вопросов.", "Бірінші ай — сынақ. 14 күн ішінде «бұл менікі емес» деп шешсе — ақшаны толық қайтарамыз, сұрақсыз.", "The first month is a trial. If within 14 days they decide it's not for them — we refund in full, no questions asked.") },
              { q: tr("Чем вы отличаетесь от Kodland и других школ?", "Kodland пен басқа мектептерден несімен ерекшеленесіздер?", "How are you different from Kodland and other schools?"), a: tr("Главное: мы открыто учим работать с AI, а не делаем вид, что его нет. Второе: облегчённые задания через 48 часов. Третье: конкретный результат после каждого урока.", "Ең бастысы: біз AI-мен жұмыс істеуді ашық үйретеміз, оны жоқтай сыңай танытпаймыз. Екіншіден: 48 сағаттан кейін жеңілдетілген тапсырмалар. Үшіншіден: әр сабақтан кейін нақты нәтиже.", "Most importantly: we openly teach working with AI instead of pretending it doesn't exist. Second: easier assignments unlock after 48 hours. Third: a concrete result after every lesson.") },
              { q: tr("Получит ли ребёнок сертификат?", "Бала сертификат ала ма?", "Will my child get a certificate?"), a: tr("Да, сертификаты выдаём каждые 3 недели — 6 за веб-курс, 5–6 за остальные. Главное — рабочие проекты на GitHub.", "Иә, сертификаттарды әр 3 апта сайын береміз — веб-курсқа 6, қалғандарына 5–6. Ең бастысы — GitHub-тағы жұмыс істейтін жобалар.", "Yes, we issue certificates every 3 weeks — 6 for the web course, 5–6 for the others. Most important: working projects on GitHub.") },
              { q: tr("Как записаться на пробный урок?", "Сынақ сабаққа қалай жазылуға болады?", "How do I sign up for a free trial?"), a: tr("Нажмите кнопку «Пробный урок» вверху — откроется короткая форма. После заполнения мы свяжемся с вами в WhatsApp в течение часа. Пробный урок бесплатный, 60 минут, без обязательств.", "Жоғарыдағы «Сынақ сабақ» батырмасын басыңыз — қысқа форма ашылады. Толтырғаннан кейін бір сағат ішінде WhatsApp арқылы хабарласамыз. Сынақ сабақ тегін, 60 минут, міндеттемесіз.", "Click the 'Free trial' button at the top — a short form opens. After you fill it in, we'll contact you on WhatsApp within an hour. The trial is free, 60 minutes, no obligations.") },
            ].map((item, i) => (
              <motion.details key={i} variants={staggerItem} className="group rounded-2xl bg-surface border border-border hover:border-accent/30 transition-colors overflow-hidden">
                <summary className="flex items-center justify-between gap-4 p-5 lg:p-6 cursor-pointer list-none">
                  <span className="font-display text-lg lg:text-xl font-semibold text-foreground pr-4">{item.q}</span>
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-accent/10 group-open:bg-accent flex items-center justify-center transition-all duration-300 group-open:rotate-45">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-accent group-open:text-white transition-colors">
                      <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <div className="px-5 lg:px-6 pb-5 lg:pb-6 text-foreground/70 leading-relaxed">{item.a}</div>
              </motion.details>
            ))}
          </div>
          <motion.div variants={fadeInUp} className="mt-14 p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-accent/10 via-accent-soft/15 to-muted/30 border border-accent/20 text-center">
            <h3 className="font-display text-2xl sm:text-3xl font-bold mb-3">{tr("Не нашли ответ?", "Жауабын таппадыңыз ба?", "Didn't find your answer?")}</h3>
            <p className="text-foreground/70 mb-6 max-w-xl mx-auto">{tr("Напишите нам в WhatsApp — отвечаем в течение 30 минут в рабочее время. Без обязательств.", "WhatsApp-қа жазыңыз — жұмыс уақытында 30 минут ішінде жауап береміз. Міндеттемесіз.", "Message us on WhatsApp — we reply within 30 minutes during business hours. No obligations.")}</p>
            <a href="https://wa.me/77001234567" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3.5 bg-accent hover:bg-accent-hover text-white rounded-full font-semibold hover:scale-[1.02] transition-all shadow-lg shadow-accent/30">💬 {tr("Написать в WhatsApp", "WhatsApp-қа жазу", "Message on WhatsApp")}</a>
          </motion.div>
        </div>
      </motion.section>

      <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={scrollViewport} transition={{ duration: 0.8 }} className="relative bg-foreground text-surface mt-0">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <img src="/logos/logo-icon.svg" alt="Alfa Z logo" width="44" height="44" className="w-11 h-11 rounded-xl shadow-lg shadow-accent/30" />
                <span className="font-display text-2xl font-bold">
                  <span className="text-accent">α</span>lfa <span className="text-accent">Z</span>
                </span>
              </div>
              <p className="text-surface/65 text-sm leading-relaxed mb-6">{tr("Школа программирования для подростков 12–17 лет. Живые уроки с практикующими разработчиками, реальные проекты и программа на базе Гарвардского курса CS50.", "12–17 жастағы жасөспірімдерге арналған бағдарламалау мектебі. Тәжірибелі әзірлеушілермен тікелей сабақтар, нақты жобалар және Гарвардтың CS50 курсы негізіндегі бағдарлама.", "A coding school for teens aged 12–17. Live lessons with working developers, real projects, and a program based on Harvard's CS50.")}</p>
              <div className="flex gap-2">
                <a href="https://wa.me/77001234567" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface/10 hover:bg-accent flex items-center justify-center transition-colors" aria-label="WhatsApp"><span className="text-lg">💬</span></a>
                <a href="https://t.me/alfaz_school" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface/10 hover:bg-accent flex items-center justify-center transition-colors" aria-label="Telegram"><span className="text-lg">✈️</span></a>
                <a href="https://instagram.com/alfaz.school" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface/10 hover:bg-accent flex items-center justify-center transition-colors" aria-label="Instagram"><span className="text-lg">📷</span></a>
              </div>
            </div>
            <div>
              <h4 className="font-display font-bold mb-4 text-surface">{tr("Курсы", "Курстар", "Courses")}</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="/#courses" className="text-surface/60 hover:text-accent transition-colors">🎓 {tr("Гарвардский курс CS50", "Гарвардтың CS50 курсы", "Harvard CS50")}</a></li>
                <li><a href="/courses/mobdev" className="text-surface/60 hover:text-accent transition-colors">{tr("Мобильная разработка", "Мобильді әзірлеу", "Mobile development")}</a></li>
                <li><a href="/courses/gamedev" className="text-surface/60 hover:text-accent transition-colors">{tr("Геймдев на Unity", "Unity-де геймдев", "Game dev on Unity")}</a></li>
                <li><a href="/courses/web" className="text-surface/60 hover:text-accent transition-colors">{tr("Веб-разработка", "Веб-әзірлеу", "Web development")}</a></li>
                <li><a href="/courses/backend" className="text-surface/60 hover:text-accent transition-colors">{tr("Бэкенд на Python", "Python-дағы бэкенд", "Backend on Python")}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold mb-4 text-surface">{tr("Школа", "Мектеп", "School")}</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#about" className="text-surface/60 hover:text-accent transition-colors">{tr("О нас", "Біз туралы", "About us")}</a></li>
                <li><a href="#pricing" className="text-surface/60 hover:text-accent transition-colors">{tr("Цены и оплата", "Бағалар мен төлем", "Pricing & payment")}</a></li>
                <li><a href="#schedule" className="text-surface/60 hover:text-accent transition-colors">{tr("Расписание", "Кесте", "Schedule")}</a></li>
                <li><a href="#teachers" className="text-surface/60 hover:text-accent transition-colors">{tr("Преподаватели", "Ұстаздар", "Instructors")}</a></li>
                <li><a href="#reviews" className="text-surface/60 hover:text-accent transition-colors">{tr("Отзывы", "Пікірлер", "Reviews")}</a></li>
                <li><a href="#faq" className="text-surface/60 hover:text-accent transition-colors">{tr("Частые вопросы", "Жиі сұрақтар", "FAQ")}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold mb-4 text-surface">{tr("Контакты", "Байланыс", "Contacts")}</h4>
              <ul className="space-y-2.5 text-sm">
                <li className="text-surface/60">📞 <a href="tel:+77001234567" className="hover:text-accent transition-colors">+7 (700) 123-45-67</a></li>
                <li className="text-surface/60">✉️ <a href="mailto:hello@alfaz.kz" className="hover:text-accent transition-colors">hello@alfaz.kz</a></li>
                <li className="text-surface/60 leading-relaxed">📍 {tr("Астана, Казахстан", "Астана, Қазақстан", "Astana, Kazakhstan")}<br /><span className="text-surface/40 text-xs">{tr("Онлайн-обучение по всей стране", "Ел бойынша онлайн оқыту", "Online learning nationwide")}</span></li>
                <li className="text-surface/60">🕐 {tr("Пн–Сб, 10:00–19:00 (UTC+5)", "Дс–Сб, 10:00–19:00 (UTC+5)", "Mon–Sat, 10:00–19:00 (UTC+5)")}</li>
              </ul>
            </div>
          </div>
          <div className="h-px bg-surface/10 mb-8" />
          <p className="text-surface/40 text-xs leading-relaxed mb-6 max-w-3xl">ТОО «Alfa Z», БИН 260740008042. Казахстан, г. Астана, район Есиль, ул. Алматы, здание 1, индекс 010000.</p>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-surface/50 text-sm">© 2026 Alfa Z. {tr("Все права защищены.", "Барлық құқықтар қорғалған.", "All rights reserved.")}<span className="hidden sm:inline"> · {tr("Сделано с 🧡 в Астане", "Астанада 🧡-пен жасалған", "Made with 🧡 in Astana")}</span></p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <a href="#" className="text-surface/50 hover:text-accent transition-colors">{tr("Публичная оферта", "Жария оферта", "Public offer")}</a>
              <a href="#" className="text-surface/50 hover:text-accent transition-colors">{tr("Политика конфиденциальности", "Құпиялылық саясаты", "Privacy policy")}</a>
              <a href="#" className="text-surface/50 hover:text-accent transition-colors">{tr("Условия использования", "Пайдалану шарттары", "Terms of use")}</a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
