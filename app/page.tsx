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
import JsonLd from "./components/JsonLd";
import SectionHead from "./components/SectionHead";
import StatsLedger from "./components/StatsLedger";
import WhyBento from "./components/WhyBento";
import PartnersSection from "./components/PartnersSection";
import PricingSection from "./components/PricingSection";
import ScheduleSection from "./components/ScheduleSection";
import FaqSection from "./components/FaqSection";
import { WhatsAppIcon, TelegramIcon, InstagramIcon } from "./components/SocialIcons";
import Aurora from "./components/Aurora";
import Magnetic from "./components/Magnetic";
import HeroCodeCard from "./components/HeroCodeCard";
import Manifesto from "./components/Manifesto";
import ScrollTilt from "./components/ScrollTilt";
import StackedCards from "./components/StackedCards";
import { spot } from "./components/spotlight";
import { useDeviceCapabilities } from "./components/useDeviceCapabilities";
import { fadeInUp, staggerContainer, staggerItem, scrollViewport } from "./components/motion";
import { faqLd } from "./lib/structured-data";
import { useLang } from "./i18n/lang";

// three.js для hero едет отдельным чанком и только на клиенте (ssr:false).

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
    { name: "WhatsApp", tooltip: "Написать в WhatsApp", href: "https://wa.me/77007240353", bg: "bg-[#25D366]", pulse: true,
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
    window.open(`https://wa.me/77007240353?text=${message}`, "_blank");
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
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent text-white shadow-xl shadow-accent/30"><Icon name="check" className="h-10 w-10" /></motion.div>
                <h3 className="font-display text-2xl font-bold mb-2">{tr("Заявка отправлена!", "Өтінім жіберілді!", "Request sent!")}</h3>
                <p className="text-foreground/65 text-sm">{tr("Сейчас откроется WhatsApp с вашим сообщением. Менеджер ответит в течение часа.", "Қазір хабарламаңызбен WhatsApp ашылады. Менеджер бір сағат ішінде жауап береді.", "WhatsApp will open with your message now. A manager will reply within an hour.")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold mb-2 leading-tight">
                    {tr("Запись на ", "", "Sign up for a ")}<span className="text-accent">{tr("пробный урок", "Сынақ сабаққа жазылу", "trial lesson")}</span>
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
                      <option value="Гарвардский курс CS50">{tr("Гарвардский курс CS50", "Гарвардтың CS50 курсы", "Harvard CS50")}</option>
                      <option value="Мобильная разработка">{tr("Мобильная разработка", "Мобильді әзірлеу", "Mobile development")}</option>
                      <option value="Геймдев на Unity">{tr("Геймдев на Unity", "Unity-де геймдев", "Game dev on Unity")}</option>
                      <option value="Веб-разработка">{tr("Веб-разработка", "Веб-әзірлеу", "Web development")}</option>
                      <option value="Бэкенд на Python">{tr("Бэкенд на Python", "Python-дағы бэкенд", "Backend on Python")}</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full px-6 py-4 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold transition-all shadow-lg shadow-accent/30 hover:scale-[1.01] flex items-center justify-center gap-2">
                  <WhatsAppIcon className="h-5 w-5" /> {tr("Отправить заявку в WhatsApp", "WhatsApp арқылы өтінім жіберу", "Send request via WhatsApp")}
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
  const heroBlur = useTransform(heroProgress, [0, 0.7], ["blur(0px)", "blur(12px)"]);
  const { canRender3D } = useDeviceCapabilities();

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={faqLd} />
      <ApplyModal open={applyOpen} onClose={() => setApplyOpen(false)} defaultCourse={defaultCourse} />
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-accent origin-left z-[60]" style={{ scaleX: scrollYProgress }} />
      <FloatingMessengers />

      {/* 🏛 Плашка резидентства Astana Hub — самое начало сайта */}
      <a href="/astana-hub-cert.pdf" target="_blank" rel="noopener noreferrer" className="group block bg-foreground text-surface transition-colors hover:bg-foreground/90">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-[13px] sm:text-sm">
          <Icon name="award" className="h-4 w-4 flex-none text-accent" />
          <span className="font-medium whitespace-nowrap">{tr("Резидент ", "", "Resident of ")}<span className="font-bold">Astana Hub</span>{tr("", " резиденті", "")}<span className="hidden text-surface/55 sm:inline"> · официально, рег. №3882</span></span>
          <span className="font-semibold text-accent whitespace-nowrap">{tr("Свидетельство →", "Куәлік →", "Certificate →")}</span>
        </div>
      </a>

      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <nav className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/logos/logo-icon.svg" alt="Alfa Z logo" width="40" height="40" className="w-10 h-10 rounded-xl shadow-lg shadow-accent/30" />
            <span className="font-display font-bold text-xl tracking-tight whitespace-nowrap">
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
            <button onClick={() => openApply()} className="px-4 sm:px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold transition-all hover:scale-[1.03] shadow-md shadow-accent/20 whitespace-nowrap">{tr("Пробный урок", "Сынақ сабақ", "Trial lesson")}</button>
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
                  <span className="font-display font-bold text-xl tracking-tight whitespace-nowrap">
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
                  <a href="https://wa.me/77007240353" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-3 px-4 rounded-2xl hover:bg-muted transition-colors">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Icon name="phone" className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium">+7 (700) 724-03-53</span>
                  </a>
                  <a href="mailto:info@alfa-z.kz" className="flex items-center gap-3 py-3 px-4 rounded-2xl hover:bg-muted transition-colors">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Icon name="message" className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium">info@alfa-z.kz</span>
                  </a>
                </div>
              </nav>

              {/* CTA внизу */}
              <div className="sticky bottom-0 px-6 py-5 bg-background/95 backdrop-blur-md border-t border-border">
                <button
                  onClick={() => { setMobileMenuOpen(false); openApply(); }}
                  className="w-full py-4 bg-accent hover:bg-accent-hover text-white rounded-full font-display font-bold text-base shadow-lg shadow-accent/30 transition-all"
                >
                  {tr("Записаться на пробный урок", "Сынақ сабаққа жазылу", "Book a trial lesson")} →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section ref={heroRef} onPointerMove={spot} className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-24 sm:pt-24 sm:pb-20 lg:pt-24 lg:pb-52">
        <motion.video autoPlay loop muted playsInline poster="/hero-poster.jpg" style={{ y: videoY, scale: videoScale }} className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="/hero-video.mp4" type="video/mp4" />
        </motion.video>
        {/* Графит поверх видео: слева плотнее (читаемость текста), справа видно человека */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0F0F1A]/92 via-[#0F0F1A]/62 to-[#0F0F1A]/20" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0F0F1A]/80 via-transparent to-[#0F0F1A]/40" />
        {/* Аврора и «фонарик» под курсором — коралловое свечение поверх видео */}
        <Aurora className="z-10 opacity-60 mix-blend-screen" />
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10 hidden mix-blend-screen md:block" style={{ background: "radial-gradient(560px circle at var(--mx, 72%) var(--my, 38%), rgba(255,107,71,0.22), transparent 62%)" }} />
        <motion.div style={{ y: heroContentY, opacity: heroContentOpacity, filter: canRender3D ? heroBlur : undefined }} className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-accent/15 border border-accent/40 mb-7 animate-fade-in-up">
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
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-9 animate-fade-in-up delay-300">
              <Magnetic strength={0.2}>
                <button onClick={() => openApply()} className="btn-arrow shine glow-hover inline-flex items-center gap-2 px-7 py-4 bg-accent hover:bg-accent-hover text-white rounded-full font-semibold transition-colors duration-300 shadow-2xl shadow-accent/40">
                  {tr("Записаться на пробный урок", "Сынақ сабаққа жазылу", "Book a trial lesson")} <span className="arrow" aria-hidden>→</span>
                </button>
              </Magnetic>
              <a href="#courses" className="inline-flex items-center gap-2 px-7 py-4 border border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-colors duration-300">{tr("Программа курсов", "Курстар бағдарламасы", "Course catalog")}</a>
            </div>
            <ul className="flex flex-wrap gap-2 animate-fade-in-up delay-400">
              <li>
                <a href="#partners" aria-label={tr("Смотреть фото с наших хакатонов", "Хакатондарымыздан түсірілген суреттерді көру", "See photos from our hackathons")} className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 font-mono text-xs text-white transition-colors hover:bg-accent/20">
                  <Icon name="award" className="h-3.5 w-3.5 flex-none text-accent" />
                  {tr("Республиканские хакатоны 2024–2025", "Республикалық хакатондар 2024–2025", "National hackathons 2024–2025")}
                  <span aria-hidden>↓</span>
                </a>
              </li>
              {[
                tr("Программа Гарварда CS50", "Гарвардтың CS50 бағдарламасы", "Harvard CS50 curriculum"),
                tr("Малые группы с ментором", "Ментормен шағын топтар", "Small groups with a mentor"),
                tr("Резидент Astana Hub", "Astana Hub резиденті", "Astana Hub resident"),
              ].map((t) => (
                <li key={t} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 font-mono text-xs text-white/80">
                  <Icon name="check" className="h-3.5 w-3.5 flex-none text-accent" />{t}
                </li>
              ))}
            </ul>
            <HeroCodeCard variant="inline" onCta={() => openApply()} />
          </div>
        </motion.div>

        <HeroCodeCard variant="float" onCta={() => openApply()} />

        {/* Полоса «крючков» — без цены: цена появляется ниже, после ценности */}
        <div className="absolute inset-x-0 bottom-10 z-20 hidden border-t border-white/15 bg-[#0F0F1A]/60 backdrop-blur-md md:block animate-fade-in-up delay-500">
          <dl className="mx-auto grid max-w-7xl grid-cols-4 divide-x divide-white/10 px-8">
            {[
              { big: tr("1-й урок", "1-сабақ", "Lesson 1"), small: tr("и уже пишет свой код", "және өз кодын жазады", "and already writing real code") },
              { big: "24/7", small: tr("ментор на связи с ребёнком", "ментор балаңызбен байланыста", "a mentor always in touch") },
              { big: tr("до 8", "8-ге дейін", "up to 8"), small: tr("учеников — видим каждого", "оқушы — әрқайсысын көреміз", "students — we see each one") },
              { big: tr("3 недели", "3 апта", "3 weeks"), small: tr("и подробный отчёт родителю", "және ата-анаға толық есеп", "and a detailed report to parents") },
            ].map((f, i) => (
              <div key={i} className="group px-6 py-5 first:pl-0 last:pr-0">
                <dt className="font-display text-2xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-accent lg:text-3xl">{f.big}</dt>
                <dd className="mt-1 font-mono text-xs text-white/55">{f.small}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Manifesto />

      <StatsLedger />

      <WhyBento />

      <PartnersSection openApply={() => openApply()} />

      <motion.section id="courses" className="sheet relative pb-20 pt-24 sm:pb-28 sm:pt-32 overflow-hidden bg-midnight text-ink-fg" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <CodeBackdrop />
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
          <SectionHead
            index="04"
            eyebrow={tr("5 направлений", "5 бағыт", "5 tracks")}
            title={<>{tr("Серьёзные программы. ", "Салмақты бағдарламалар. ", "Serious programs. ")}<span className="text-accent">{tr("Реальные результаты.", "Нақты нәтижелер.", "Real results.")}</span></>}
            lead={tr("От первого проекта с помощью AI до фундамента Computer Science уровня Гарварда. Живые занятия, защита проекта, сертификаты каждые 3 недели.", "AI көмегімен алғашқы жобадан Гарвард деңгейіндегі Computer Science іргетасына дейін. Тікелей сабақтар, жоба қорғау, әр 3 апта сайын сертификат.", "From your first AI-assisted project to Harvard-level Computer Science fundamentals. Live classes, project defense, certificates every 3 weeks.")}
          />

          <StackedCards>
            {[
              { emoji: "🎓", title: tr("Гарвардский курс CS50", "Гарвардтың CS50 курсы", "Harvard CS50"), tagline: "Scratch → C → Python → SQL → Flask", desc: tr("Легендарный вводный курс информатики Гарварда на русском. Настоящий фундамент Computer Science — от устройства памяти компьютера до веб-приложения на Flask.", "Гарвардтың информатика бойынша аңызға айналған кіріспе курсы. Computer Science-тің нағыз іргетасы — компьютер жадының құрылымынан бастап Flask-тегі веб-қосымшаға дейін.", "Harvard's legendary intro to computer science. A real Computer Science foundation — from how memory works to a web app on Flask."), result: tr("Портфолио уровня CS50 + фундамент, с которым легко даётся любой язык", "CS50 деңгейіндегі портфолио + кез келген тіл оңай меңгерілетін іргетас", "A CS50-level portfolio + a foundation that makes any language easy"), lessons: tr("49 уроков · 11 модулей", "49 сабақ · 11 модуль", "49 lessons · 11 modules"), age: tr("14–18 лет", "14–18 жас", "ages 14–18"), certs: tr("7 Problem Sets + сертификаты", "7 Problem Sets + сертификаттар", "7 Problem Sets + certificates"), stack: ["Scratch", "C", "Python", "SQL", "Flask", "JavaScript"], bgClass: "bg-gradient-to-br from-accent/15 via-accent-soft/10 to-transparent", coursePage: "", kind: "cs50" as const, glow: "#FF6B47", file: "hello.c", code: `#include <cs50.h>
#include <stdio.h>

int main(void)
{
    string name = get_string("Как тебя зовут? ");
    printf("Привет, %s!\\n", name);
}` },
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
              <article
                key={i}
                className="glow-hover group bg-midnight relative grid items-center gap-6 overflow-hidden rounded-3xl border border-white/15 p-5 shadow-2xl shadow-black/40 sm:p-7 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-10 lg:p-9"
              >
                {/* 🖥 Окно редактора со сниппетом направления */}
                <div className="min-w-0">
                  <CodeWindow title={course.file} code={course.code} stack={course.stack} interactive />
                </div>

                <div className="min-w-0">
                  <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">0{i + 1} <span className="text-white/35">/ 05</span></p>
                  <h3 className="mb-1.5 font-display text-2xl font-bold leading-tight tracking-tight lg:text-3xl">{course.title}</h3>
                  <p className="mb-4 text-sm font-medium text-accent">{course.tagline}</p>
                  <p className="mb-5 leading-relaxed text-ink-fg/70">{course.desc}</p>
                  <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <Icon name="award" className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                    <div><p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-ink-fg/50">{tr("В конце курса", "Курс соңында", "By the end")}</p><p className="text-sm font-semibold leading-snug text-ink-fg">{course.result}</p></div>
                  </div>
                  <ul className="mb-6 flex flex-wrap gap-2 text-xs text-ink-fg/75">
                    <li className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-3 py-1.5"><Icon name="book" className="h-3.5 w-3.5 text-accent" />{course.lessons}</li>
                    <li className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-3 py-1.5"><Icon name="users" className="h-3.5 w-3.5 text-accent" />{course.age}</li>
                    <li className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-3 py-1.5"><Icon name="graduation" className="h-3.5 w-3.5 text-accent" />{course.certs}</li>
                  </ul>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    {course.coursePage ? (
                      <a href={course.coursePage} className="btn-arrow inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-ink-fg transition-colors hover:bg-white/15">
                        {tr("Подробнее", "Толығырақ", "Learn more")} <span className="arrow" aria-hidden>→</span>
                      </a>
                    ) : (
                      <span className="inline-flex flex-1 cursor-default items-center justify-center gap-2 rounded-xl bg-white/5 px-5 py-3 text-sm font-medium text-ink-fg/45">
                        {tr("Страница — скоро", "Бет — жақында", "Page — soon")}
                      </span>
                    )}
                    <button onClick={() => openApply(course.title)} className="btn-arrow shine inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-semibold text-white shadow-md shadow-accent/20 transition-colors hover:bg-accent-hover">
                      {tr("Записаться", "Жазылу", "Enroll")} <span className="arrow" aria-hidden>→</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </StackedCards>
          <motion.div variants={fadeInUp} className="mt-12 sm:mt-16 text-center">
            <p className="text-ink-fg/60 text-sm mb-2">{tr("Не уверены, какой курс подходит ребёнку?", "Балаңызға қай курс лайық екенін білмейсіз бе?", "Not sure which course fits your child?")}</p>
            <button onClick={() => openApply()} className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-semibold transition-colors">
              {tr("Записаться на пробный урок и определиться вместе", "Сынақ сабаққа жазылып, бірге шешейік", "Book a trial lesson and decide together")} <span>→</span>
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* 🖥 ПРИМЕРЫ РАБОТ — реальные интерактивные демо из уроков */}
      <motion.section id="examples" className="sheet relative bg-background pb-20 pt-24 shadow-[0_-24px_60px_-30px_rgba(15,15,26,0.25)] sm:pb-28 sm:pt-32" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <SectionHead
            index="05"
            eyebrow={tr("примеры_работ", "жұмыс_мысалдары", "student_work")}
            title={<>{tr("Что ты делаешь ", "Алғашқы сабақтарда ", "What you build ")}<span className="text-accent">{tr("уже на первых уроках", "не істейсің", "from the very first lessons")}</span></>}
            lead={tr("Не теория в тетради — интерактив с первого занятия. Ниже — живые симуляторы из наших уроков: выбери курс, жми кнопки, играй, вводи данные. Это не видео и не скриншоты — работает прямо здесь.", "Дәптердегі теория емес — бірінші сабақтан интерактив. Төменде — сабақтарымыздан тірі симуляторлар: курсты таңда, батырмаларды бас, ойна, дерек енгіз. Бұл видео да, скриншот та емес — дәл осы жерде жұмыс істейді.", "Not theory in a notebook — hands-on from the first class. Below are live simulators from our lessons: pick a course, press buttons, play, enter data. Not a video, not screenshots — it works right here.")}
          />

          <motion.div variants={fadeInUp}>
            <ScrollTilt>
              <LiveDemos />
            </ScrollTilt>
          </motion.div>
        </div>
      </motion.section>

      <PricingSection openApply={() => openApply()} />

      <ScheduleSection openApply={openApply} />

      <section className="sheet relative bg-[#0F0F1A] pb-20 pt-24 text-[#FFFBF5] sm:pb-28 sm:pt-32">
        {/* Клип свечения — сиблинг, не предок sticky-элемента (иначе sticky ломается) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
            <SectionHead
              index="08"
              eyebrow={tr("Как мы учим", "Қалай оқытамыз", "How we teach")}
              title={<>{tr("Три принципа, которые ", "Alfa Z-ті ", "Three principles that ")}<span className="text-accent">{tr("отличают Alfa Z", "ерекшелейтін үш ұстаным", "set Alfa Z apart")}</span></>}
              className="sm:mb-20"
            />
          </motion.div>
          <HowWeTeach />
        </div>
      </section>

      {/* 🎮 ГЕЙМИФИКАЦИЯ — прогресс, уровни, ачивки (ассеты из Canva + SVG) */}
      <motion.section className="sheet relative overflow-hidden bg-background pb-20 pt-24 shadow-[0_-24px_60px_-30px_rgba(15,15,26,0.25)] sm:pb-28 sm:pt-32" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <SectionHead
            index="09"
            eyebrow={tr("прогресс_и_достижения", "прогресс_пен_жетістіктер", "progress_and_achievements")}
            title={<>{tr("Учёба, в которой ", "Оқу — мұнда ", "Learning where ")}<span className="text-accent">{tr("виден каждый шаг", "әр қадам көрінеді", "every step is visible")}</span><span className="text-accent font-mono animate-blink">_</span></>}
            lead={tr("Уровни мастерства, ачивки за реальные достижения и сертификаты каждые 3 недели — ребёнок видит прогресс, а не «всё в конце».", "Шеберлік деңгейлері, нақты жетістіктер үшін ачивкалар және әр 3 апта сайын сертификат — бала прогресті көреді, «бәрі соңында» емес.", "Skill levels, achievements for real milestones, and certificates every 3 weeks — the child sees progress, not 'everything at the end'.")}
          />

          {/* 🖥 Terminal-окно прогресса */}
          <motion.div variants={fadeInUp} className="relative">
            <div aria-hidden className="pointer-events-none absolute -inset-x-6 -inset-y-4 rounded-[3rem] bg-accent/25 blur-[48px] md:blur-[90px]" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0F0F1A] shadow-2xl shadow-[#0F0F1A]/40">
            {/* Плашка окна */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.04] border-b border-white/10">
              <span className="h-3 w-3 rounded-full bg-[#FF6B47]" />
              <span className="h-3 w-3 rounded-full bg-[#FFB088]" />
              <span className="h-3 w-3 rounded-full bg-[#FFB088]" />
              <span className="ml-3 font-mono text-[11px] sm:text-xs text-white/45 truncate">alfaz@student: ~/progress.log</span>
            </div>

            {/* Тело окна */}
            <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-2 lg:gap-0 lg:p-0">
              {/* Уровни */}
              <div className="lg:p-10">
                <p className="font-mono text-xs sm:text-sm text-accent-soft">$ progress --levels</p>
                <p className="font-mono text-[11px] sm:text-xs text-white/40 mb-6"># {tr("5 уровней мастерства: от новичка до защиты проекта", "5 шеберлік деңгейі: жаңадан бастаушыдан жоба қорғауға дейін", "5 skill levels: from beginner to project defense")}</p>
                <LevelBadges />
              </div>

              <div aria-hidden className="h-px bg-white/10 lg:hidden" />

              {/* Ачивки */}
              <div className="lg:border-l lg:border-white/10 lg:p-10">
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
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section id="teachers" className="sheet relative bg-muted pb-20 pt-24 shadow-[0_-24px_60px_-30px_rgba(15,15,26,0.25)] sm:pb-28 sm:pt-32" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <SectionHead
            index="10"
            eyebrow={tr("Преподаватели", "Ұстаздар", "Instructors")}
            title={<>{tr("Не теоретики. ", "Теоретиктер емес. ", "Not theorists. ")}<span className="text-accent">{tr("Действующие разработчики.", "Нағыз әзірлеушілер.", "Working developers.")}</span></>}
            lead={tr("Каждый преподаватель работает в IT-компании прямо сейчас. Не «выпускник универа», а человек, который пишет код каждый день за зарплату.", "Әр ұстаз қазір IT-компанияда жұмыс істейді. «Университет түлегі» емес, күнде жалақыға код жазатын адам.", "Every instructor works at an IT company right now. Not a 'uni graduate', but someone who writes code every day for a living.")}
          />
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
                    {teacher.secret ? <Icon name="lock" className="h-14 w-14 text-accent" /> : <span className="font-display text-5xl font-bold text-white drop-shadow-lg">{teacher.initials}</span>}
                    <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-lg bg-surface/95 backdrop-blur-sm text-xs font-semibold text-foreground text-center">{teacher.tag}</div>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-1">{teacher.name}</h3>
                  <p className="text-sm text-accent font-semibold mb-3">{teacher.role}</p>
                  <div className="space-y-1.5 text-sm text-foreground/60">
                    <p className="flex items-center gap-2"><Icon name="book" className="h-4 w-4 flex-none text-accent/70" />{teacher.courses}</p>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
          <motion.p variants={fadeInUp} className="mt-12 flex max-w-xl items-start gap-2.5 text-sm text-foreground/50"><Icon name="lock" className="mt-0.5 h-4 w-4 flex-none" /><span>{tr("Двух ведущих сениор-разработчиков мы раскроем при старте вашей группы — они ведут продвинутые модули Гарвардского курса CS50.", "Екі жетекші сениор-әзірлеушіні тобыңыз басталғанда ашамыз — олар Гарвардтың CS50 курсының озық модульдерін жүргізеді.", "We'll reveal two lead senior developers when your group starts — they teach the advanced modules of Harvard's CS50.")}</span></motion.p>
        </div>
      </motion.section>

      <motion.section id="reviews" className="sheet relative bg-background pb-20 pt-24 shadow-[0_-24px_60px_-30px_rgba(15,15,26,0.25)] sm:pb-28 sm:pt-32" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <SectionHead
            index="11"
            eyebrow={tr("Отзывы", "Пікірлер", "Reviews")}
            title={<>{tr("Что говорят ", "Alfa Z туралы ", "What ")}<span className="text-accent">{tr("родители и ученики", "ата-аналар мен оқушылар", "parents and students say")}</span>{tr("", " не дейді?", "")}</>}
          />
          <motion.div variants={fadeInUp} className="rounded-[2rem] bg-midnight p-8 text-ink-fg sm:p-12 lg:p-14">
            <p className="max-w-3xl font-display text-2xl font-semibold leading-snug tracking-tight text-ink-fg sm:text-3xl">
              {tr("Alfa Z — новый бренд команды с опытом ", "Alfa Z — тәжірибесі ", "Alfa Z is a new brand from a team with ")}<span className="font-bold text-accent">{tr("5000+ учеников", "5000+ оқушы", "5000+ students")}</span>{tr(". Мы принципиально не публикуем придуманные цитаты: настоящие отзывы именно об Alfa Z появятся здесь после первых защит проектов.", " командасының жаңа бренді. Біз ойдан шығарылған цитаталарды жарияламаймыз: нақ Alfa Z туралы шынайы пікірлер алғашқы жоба қорғаулардан кейін осы жерде пайда болады.", " of experience. We don't publish made-up quotes: real reviews specifically about Alfa Z will appear here after the first project defenses.")}
            </p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-fg/65">
              {tr("Хотите пообщаться с командой до старта? Напишите нам в WhatsApp — расскажем о программе и ответим на вопросы.", "Бастау алдында командамен сөйлескіңіз келе ме? WhatsApp-қа жазыңыз — бағдарлама туралы айтып, сұрақтарға жауап береміз.", "Want to talk to the team before starting? Message us on WhatsApp — we'll tell you about the program and answer your questions.")}
            </p>
          </motion.div>
        </div>
      </motion.section>

      <FaqSection />

      <footer className="sheet relative bg-foreground text-surface">
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
                <a href="https://wa.me/77007240353" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface/10 hover:bg-accent flex items-center justify-center transition-colors" aria-label="WhatsApp"><WhatsAppIcon className="h-[18px] w-[18px]" /></a>
                <a href="https://t.me/alfaz_school" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface/10 hover:bg-accent flex items-center justify-center transition-colors" aria-label="Telegram"><TelegramIcon className="h-[18px] w-[18px]" /></a>
                <a href="https://instagram.com/alfaz.school" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface/10 hover:bg-accent flex items-center justify-center transition-colors" aria-label="Instagram"><InstagramIcon className="h-[18px] w-[18px]" /></a>
              </div>
            </div>
            <div>
              <h4 className="font-display font-bold mb-4 text-surface">{tr("Курсы", "Курстар", "Courses")}</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="/#courses" className="text-surface/60 hover:text-accent transition-colors">{tr("Гарвардский курс CS50", "Гарвардтың CS50 курсы", "Harvard CS50")}</a></li>
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
                <li className="flex items-center gap-2.5 text-surface/60"><Icon name="phone" className="h-4 w-4 flex-none text-accent" /><a href="tel:+77007240353" className="hover:text-accent transition-colors">+7 (700) 724-03-53</a></li>
                <li className="flex items-center gap-2.5 text-surface/60"><Icon name="message" className="h-4 w-4 flex-none text-accent" /><a href="mailto:info@alfa-z.kz" className="hover:text-accent transition-colors">info@alfa-z.kz</a></li>
                <li className="flex items-start gap-2.5 text-surface/60 leading-relaxed"><Icon name="globe" className="mt-1 h-4 w-4 flex-none text-accent" /><span>{tr("Астана, Казахстан", "Астана, Қазақстан", "Astana, Kazakhstan")}<br /><span className="text-surface/40 text-xs">{tr("Онлайн-обучение по всей стране", "Ел бойынша онлайн оқыту", "Online learning nationwide")}</span></span></li>
                <li className="flex items-center gap-2.5 text-surface/60"><Icon name="clock" className="h-4 w-4 flex-none text-accent" />{tr("Пн–Сб, 10:00–19:00 (UTC+5)", "Дс–Сб, 10:00–19:00 (UTC+5)", "Mon–Sat, 10:00–19:00 (UTC+5)")}</li>
              </ul>
            </div>
          </div>
          <a href="/astana-hub-cert.pdf" target="_blank" rel="noopener noreferrer" className="mb-8 flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-surface/15 bg-surface/[0.04] p-4 transition-colors hover:border-accent/40 sm:flex-row">
            <img src="/astana-hub-cert.png" alt={tr("Свидетельство участника Astana Hub", "Astana Hub қатысушысының куәлігі", "Astana Hub participant certificate")} width={480} height={340} loading="lazy" decoding="async" className="w-32 flex-none rounded-lg border border-surface/10" />
            <div className="text-center sm:text-left">
              <p className="font-display text-base font-bold text-surface">{tr("Официальный резидент Astana Hub", "Astana Hub-тың ресми резиденті", "Official Astana Hub resident")}</p>
              <p className="mt-0.5 text-sm text-surface/55">{tr("Рег. №3882 · с 24.09.2026. Нажмите, чтобы открыть свидетельство.", "Тіркеу №3882 · 24.09.2026-дан. Куәлікті ашу үшін басыңыз.", "Reg. No. 3882 · since 24.09.2026. Click to open the certificate.")}</p>
            </div>
          </a>
          <div className="h-px bg-surface/10 mb-8" />
          <p className="text-surface/40 text-xs leading-relaxed mb-6 max-w-3xl">ТОО «Alfa Z», БИН 260740008042. Казахстан, г. Астана, район Есиль, ул. Алматы, здание 1, индекс 010000.</p>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-surface/50 text-sm">© 2026 Alfa Z. {tr("Все права защищены.", "Барлық құқықтар қорғалған.", "All rights reserved.")}<span className="hidden sm:inline"> · {tr("Сделано с 🧡 в Астане", "Астанада 🧡-пен жасалған", "Made with 🧡 in Astana")}</span></p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <a href="/oferta" className="text-surface/50 hover:text-accent transition-colors">{tr("Публичная оферта", "Жария оферта", "Public offer")}</a>
              <a href="/policy" className="text-surface/50 hover:text-accent transition-colors">{tr("Политика конфиденциальности", "Құпиялылық саясаты", "Privacy policy")}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
