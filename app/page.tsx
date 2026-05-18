"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView, animate, useMotionValue, AnimatePresence } from "framer-motion";

// 🔢 Компонент анимированного счётчика
function AnimatedCounter({ to, suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, { duration: 2.5, ease: [0.16, 1, 0.3, 1] });
      return () => controls.stop();
    }
  }, [isInView, count, to]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
}

// 💬 Плавающие кнопки мессенджеров
function FloatingMessengers() {
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (value) => {
      setShow(value > 300);
    });
    return unsubscribe;
  }, [scrollY]);

  const buttons = [
    { name: "WhatsApp", href: "https://wa.me/77001234567", bg: "bg-[#25D366]", pulse: true,
      icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>) },
    { name: "Telegram", href: "https://t.me/alfaz_school", bg: "bg-[#229ED9]", pulse: false,
      icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>) },
    { name: "Instagram", href: "https://instagram.com/alfaz.school", bg: "bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5]", pulse: false,
      icon: (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>) },
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 20 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          {buttons.map((btn) => (
            <a key={btn.name} href={btn.href} target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-end" aria-label={`Написать в ${btn.name}`}>
              <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-foreground text-surface text-xs font-semibold whitespace-nowrap shadow-lg opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">Написать в {btn.name}</span>
              <div className={`relative w-14 h-14 rounded-full ${btn.bg} text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300`}>
                {btn.pulse && <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40" />}
                <span className="relative">{btn.icon}</span>
              </div>
            </a>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ✉️ МОДАЛКА ЗАПИСИ НА ПРОБНЫЙ УРОК
function ApplyModal({ open, onClose, defaultCourse = "" }) {
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
            <button onClick={onClose} aria-label="Закрыть" className="absolute top-4 right-4 w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors z-10">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" /></svg>
            </button>
            {submitted ? (
              <div className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="text-7xl mb-5">✅</motion.div>
                <h3 className="font-display text-2xl font-bold mb-2">Заявка отправлена!</h3>
                <p className="text-foreground/65 text-sm">Сейчас откроется WhatsApp с вашим сообщением.<br />Менеджер ответит в течение часа.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-soft-pulse" />
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">Бесплатно</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold mb-2 leading-tight">
                    Запись на <span className="text-accent">пробный урок</span>
                  </h3>
                  <p className="text-foreground/65 text-sm">60 минут, без обязательств. Менеджер свяжется в течение часа.</p>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Имя ребёнка <span className="text-accent">*</span></label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Айдар" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Возраст</label>
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="14" min="12" max="18" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Телефон родителя <span className="text-accent">*</span></label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+7 (___) ___-__-__" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Какой курс интересует?</label>
                    <select value={course} onChange={(e) => setCourse(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all">
                      <option value="">Выбрать на пробном уроке</option>
                      <option value="Мобильная разработка">📱 Мобильная разработка</option>
                      <option value="Геймдев на Unity">🎮 Геймдев на Unity</option>
                      <option value="Веб-разработка">🌐 Веб-разработка</option>
                      <option value="Бэкенд на Python">⚙️ Бэкенд на Python</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full px-6 py-4 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold transition-all shadow-lg shadow-accent/30 hover:scale-[1.01] flex items-center justify-center gap-2">
                  <span>💬</span> Отправить заявку в WhatsApp
                </button>
                <p className="text-xs text-foreground/45 text-center mt-4 leading-relaxed">Нажимая на кнопку, вы соглашаетесь с обработкой персональных данных</p>
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
  const openApply = (course = "") => {
    setDefaultCourse(course);
    setApplyOpen(true);
  };

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
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white font-display font-bold text-lg shadow-lg shadow-accent/30">Az</div>
            <span className="font-display font-bold text-xl tracking-tight">Alfa Z</span>
          </a>
          <ul className="hidden lg:flex items-center gap-8 text-sm font-medium text-foreground/70">
            <li><a href="#courses" className="hover:text-foreground transition-colors">Курсы</a></li>
            <li><a href="#about" className="hover:text-foreground transition-colors">О школе</a></li>
            <li><a href="#pricing" className="hover:text-foreground transition-colors">Цены</a></li>
            <li><a href="#schedule" className="hover:text-foreground transition-colors">Расписание</a></li>
            <li><a href="#reviews" className="hover:text-foreground transition-colors">Отзывы</a></li>
          </ul>
          <div className="flex items-center gap-3">
            <button className="hidden sm:inline-flex text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Войти</button>
            <button onClick={() => openApply()} className="px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-all hover:scale-[1.03] shadow-md shadow-accent/20">Пробный урок</button>
          </div>
        </nav>
      </header>

      <section ref={heroRef} className="relative h-screen min-h-[640px] max-h-[900px] flex items-center overflow-hidden">
        <motion.video autoPlay loop muted playsInline poster="/hero-poster.jpg" style={{ y: videoY, scale: videoScale }} className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="/hero-video.mp4" type="video/mp4" />
        </motion.video>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        <motion.div style={{ y: heroContentY, opacity: heroContentOpacity }} className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-accent/15 backdrop-blur-md border border-accent/40 mb-7 animate-fade-in-up">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-accent animate-soft-pulse" />
                <span className="relative w-2 h-2 rounded-full bg-accent" />
              </span>
              <span className="text-sm font-semibold text-white tracking-wide">Старт первого потока — 1 июля 2026</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6 animate-fade-in-up delay-100">
              Школа программирования <span className="text-accent">для подростков 12 – 17 лет</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/85 leading-relaxed mb-9 max-w-xl animate-fade-in-up delay-200">
              Учим IT с нуля до уровня junior. Живые уроки с практикующими разработчиками. 4 направления: мобильная разработка, геймдев, фронтенд, бэкенд.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-10 animate-fade-in-up delay-300">
              <button onClick={() => openApply()} className="inline-flex items-center gap-2 px-7 py-4 bg-accent hover:bg-accent-hover text-white rounded-full font-semibold hover:scale-[1.02] transition-all duration-300 shadow-2xl shadow-accent/40">
                Записаться на пробный урок <span aria-hidden>→</span>
              </button>
              <a href="#courses" className="inline-flex items-center gap-2 px-7 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300">Программа курсов</a>
            </div>
            <div className="flex items-center gap-4 animate-fade-in-up delay-400">
              <div className="flex -space-x-2">
                {["А", "М", "Д", "К", "Т"].map((letter, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-soft border-2 border-white/90 flex items-center justify-center text-white font-bold text-sm shadow-lg">{letter}</div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1.5"><div className="flex text-yellow-400 text-base">★★★★★</div><span className="text-white font-bold ml-1">4.9</span></div>
                <p className="text-sm text-white/70 mt-0.5">500+ родителей рекомендуют</p>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl animate-fade-in-up delay-500">
          <div className="flex flex-col items-center"><span className="text-yellow-400 text-base leading-none">★</span><span className="text-white font-bold text-base sm:text-lg leading-tight mt-0.5">4.9</span></div>
          <div className="w-px h-9 bg-white/30" />
          <div><p className="text-white font-semibold text-xs sm:text-sm leading-tight">500+ учеников</p><p className="text-white/70 text-[10px] sm:text-xs mt-0.5">в Казахстане</p></div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2 animate-fade-in-up delay-500">
          <span className="text-white/60 text-xs uppercase tracking-widest">Прокрутите вниз</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-white/80 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      <motion.section className="relative py-20 sm:py-24 bg-gradient-to-b from-background to-muted/20 border-t border-border" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">В цифрах</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Школа, в которой <span className="text-accent">учатся уже сегодня</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {[
              { value: 500, suffix: "+", label: "учеников в Казахстане", emoji: "👨‍🎓" },
              { value: 4, suffix: "", label: "направления обучения", emoji: "🎯" },
              { value: 48, suffix: "+", label: "уроков в каждом курсе", emoji: "📚" },
              { value: 95, suffix: "%", label: "продолжают на 2-й курс", emoji: "🚀" },
            ].map((stat, i) => (
              <motion.div key={i} variants={staggerItem} whileHover={{ y: -6, transition: { duration: 0.2 } }} className="p-6 sm:p-7 lg:p-8 rounded-2xl bg-surface border border-border text-center hover:border-accent/40 hover:shadow-xl transition-all duration-300">
                <div className="text-3xl sm:text-4xl mb-3">{stat.emoji}</div>
                <p className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-accent mb-2 leading-none tabular-nums">
                  <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-foreground/60 leading-snug">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section id="about" className="relative py-20 sm:py-28 border-t border-border" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="max-w-2xl mb-14 sm:mb-20">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Почему Alfa Z</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Не курсы по видео,<br />а <span className="text-accent">настоящая школа</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { emoji: "🎯", title: "Живые уроки", desc: "Никаких бесконечных записей. Преподаватель видит каждого, отвечает на вопросы прямо на занятии." },
              { emoji: "👨‍💻", title: "Преподаватели-практики", desc: "Не теоретики из университета — все работают в IT-компаниях прямо сейчас." },
              { emoji: "🛠", title: "Реальные проекты", desc: "К концу обучения у ученика портфолио на GitHub, которое можно показать работодателю." },
              { emoji: "🎓", title: "Помощь после", desc: "Сертификат, помощь с резюме и подготовка к первым стажировкам в IT." },
            ].map((card, i) => (
              <motion.div key={i} variants={staggerItem} whileHover={{ y: -8, transition: { duration: 0.2 } }} className="group p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{card.emoji}</div>
                <h3 className="font-display text-xl font-bold mb-2">{card.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section id="courses" className="relative py-20 sm:py-28 bg-muted/30 border-t border-border" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="max-w-2xl mb-14 sm:mb-20">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">4 направления</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Серьёзные программы. <span className="text-accent">Реальные результаты.</span>
            </h2>
            <p className="text-lg text-foreground/70 mt-4 max-w-xl">48–52 урока. Живые занятия. Защита проекта в конце. Каждые 3 недели — новый сертификат.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
            {[
              { emoji: "📱", title: "Мобильная разработка", tagline: "FlutterFlow → Flutter → Firebase", desc: "Создаём приложения для Android и iOS. От квиза «Какой ты персонаж» до мини-Instagram для класса.", result: "Финал в Google Play + AdMob + профиль на Upwork", lessons: "48 уроков · 24 недели", age: "14–17 лет", certs: "14+ сертификатов", stack: ["Flutter", "Dart", "Firebase", "Flame", "Codemagic"], bgClass: "bg-gradient-to-br from-accent/15 via-accent-soft/10 to-transparent", coursePage: "/courses/mobdev" },
              { emoji: "🎮", title: "Геймдев на Unity", tagline: "Unity 6 + C# + 2D", desc: "Делаем игры жанров Mario, Hollow Knight, Celeste. Финальная игра на 3 платформах.", result: "Игра на itch.io + Google Play + App Store", lessons: "50 уроков · 25 недель", age: "13–18 лет", certs: "5–8 игр в портфолио", stack: ["Unity 6", "C#", "Piskel", "Git"], bgClass: "bg-gradient-to-br from-accent-soft/20 via-muted/30 to-transparent", coursePage: "/courses/gamedev" },
              { emoji: "🌐", title: "Веб-разработка", tagline: "HTML → CSS → JavaScript → React", desc: "Учимся делать современные сайты как профессионалы. От первого Hello, World до React-приложения.", result: "React-приложение в интернете + GitHub-портфолио", lessons: "48 уроков · 24 недели", age: "12–17 лет", certs: "6 сертификатов", stack: ["React", "TypeScript", "Tailwind", "Git"], bgClass: "bg-gradient-to-br from-foreground/[0.04] via-muted/40 to-transparent", coursePage: "/courses/web" },
              { emoji: "⚙️", title: "Бэкенд на Python", tagline: "Python → SQL → Flask → Docker", desc: "«Мозги» сайтов и приложений. Создаём Telegram-бот, который работает 24/7, и боевой REST API.", result: "Telegram-бот 24/7 + REST API на Docker в интернете", lessons: "52 урока · 26 недель", age: "13–18 лет", certs: "5–7 проектов в портфолио", stack: ["Python", "Flask", "FastAPI", "SQL", "Docker"], bgClass: "bg-gradient-to-br from-muted/30 via-accent-soft/10 to-transparent", coursePage: "/courses/backend" },
            ].map((course, i) => (
              <motion.div key={i} variants={staggerItem} whileHover={{ y: -8, transition: { duration: 0.2 } }} className={`group relative p-7 lg:p-8 rounded-2xl ${course.bgClass} border border-border hover:border-accent/40 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col`}>
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{course.emoji}</div>
                <h3 className="font-display text-2xl lg:text-3xl font-bold mb-1.5 leading-tight">{course.title}</h3>
                <p className="text-sm font-medium text-accent mb-4">{course.tagline}</p>
                <p className="text-foreground/70 leading-relaxed mb-5">{course.desc}</p>
                <div className="inline-flex items-start gap-2 px-4 py-3 rounded-xl bg-surface border border-border mb-5">
                  <span className="text-base flex-shrink-0">🏆</span>
                  <div><p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-0.5">В конце курса</p><p className="text-sm font-semibold text-foreground leading-snug">{course.result}</p></div>
                </div>
                <div className="space-y-2 text-sm text-foreground/70 mb-5">
                  <div className="flex items-center gap-2"><span className="w-5 flex-shrink-0">📅</span><span>{course.lessons}</span></div>
                  <div className="flex items-center gap-2"><span className="w-5 flex-shrink-0">👤</span><span>{course.age}</span></div>
                  <div className="flex items-center gap-2"><span className="w-5 flex-shrink-0">🏅</span><span>{course.certs}</span></div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {course.stack.map((tech, idx) => (<span key={idx} className="px-2.5 py-1 rounded-md bg-foreground/5 text-xs font-medium text-foreground/70">{tech}</span>))}
                </div>
                <div className="mt-auto flex flex-col sm:flex-row gap-2">
                  {course.coursePage ? (
                    <a href={course.coursePage} className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-foreground hover:bg-foreground/85 text-surface rounded-xl font-semibold transition-all hover:scale-[1.01]">
                      Подробнее <span>→</span>
                    </a>
                  ) : (
                    <span className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-foreground/5 text-foreground/45 rounded-xl font-medium text-sm cursor-default">
                      Страница — скоро
                    </span>
                  )}
                  <button onClick={() => openApply(course.title)} className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold transition-all hover:scale-[1.01] shadow-md shadow-accent/20">
                    Записаться <span>→</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeInUp} className="mt-12 sm:mt-16 text-center">
            <p className="text-foreground/60 text-sm mb-2">Не уверены, какой курс подходит ребёнку?</p>
            <button onClick={() => openApply()} className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-semibold transition-colors">
              Записаться на бесплатный пробный урок и определиться вместе <span>→</span>
            </button>
          </motion.div>
        </div>
      </motion.section>

      <motion.section id="pricing" className="relative py-20 sm:py-28 border-t border-border bg-gradient-to-b from-background via-muted/10 to-background" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Цены и оплата</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              Доступно. <span className="text-accent">Прозрачно. Без переплат.</span>
            </h2>
            <p className="text-lg text-foreground/70">
              Месячный абонемент <span className="font-bold text-foreground">47 500 ₸</span>. Платишь только за те месяцы, когда ребёнок учится.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5 lg:gap-6 mb-14">
            {[
              { emoji: "📅", badge: null, title: "Помесячно", subtitle: "Стандартный формат", price: "47 500", priceUnit: "₸ / месяц", description: "Платите только за те месяцы, когда ребёнок ходит. Можно прекратить в любой момент.", features: ["Без обязательств на год", "Удобно для пробы", "Оплата картой или Kaspi"], ctaText: "Подходит для начала", bgClass: "bg-surface border-border", highlight: false },
              { emoji: "🔥", badge: "Популярно", title: "Kaspi-рассрочка", subtitle: "На 6 месяцев", price: "47 500", priceUnit: "₸ / месяц × 6", description: "Оформляете рассрочку 285 000 ₸ на полугодие. 0% переплаты, без справок, без поручителей.", features: ["0% переплаты", "Решение за 5 минут в Kaspi", "Удобный график списаний"], ctaText: "Самый удобный способ", bgClass: "bg-gradient-to-br from-accent/10 via-accent-soft/10 to-transparent border-accent/40", highlight: true },
              { emoji: "🎁", badge: "Экономия 28 500 ₸", title: "Полугодие со скидкой", subtitle: "Оплата 6 мес сразу", price: "42 750", priceUnit: "₸ / месяц", description: "Платите 256 500 ₸ за 6 месяцев сразу — получаете скидку 10% на каждый месяц.", features: ["Скидка 10% на каждый месяц", "Экономия 28 500 ₸", "Стоимость зафиксирована"], ctaText: "Самая выгодная цена", bgClass: "bg-surface border-border", highlight: false },
            ].map((plan, i) => (
              <motion.div key={i} variants={staggerItem} whileHover={{ y: -8, transition: { duration: 0.2 } }} className={`relative p-6 lg:p-8 rounded-2xl border-2 ${plan.bgClass} transition-all duration-300 hover:shadow-xl flex flex-col`}>
                {plan.badge && (<div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${plan.highlight ? 'bg-accent text-white' : 'bg-accent-soft text-foreground'}`}>{plan.badge}</div>)}
                <div className="text-4xl mb-4">{plan.emoji}</div>
                <h3 className="font-display text-2xl font-bold mb-1">{plan.title}</h3>
                <p className="text-sm text-foreground/60 mb-5">{plan.subtitle}</p>
                <div className="mb-5 pb-5 border-b border-border">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-4xl lg:text-5xl font-bold text-foreground tabular-nums">{plan.price}</span>
                  </div>
                  <p className="text-sm text-foreground/60 mt-1">{plan.priceUnit}</p>
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
              <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">Что входит в стоимость</p>
              <h3 className="font-display text-2xl sm:text-3xl font-bold">Никаких <span className="text-accent">скрытых платежей</span></h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { emoji: "🎓", title: "Живые групповые уроки", desc: "48–52 урока в Zoom, по 90 минут, 2 раза в неделю. Группы до 8 человек." },
                { emoji: "📝", title: "Домашние задания", desc: "С проверкой от преподавателя. Облегчённый уровень — если основной не получается." },
                { emoji: "👩‍💻", title: "Куратор между уроками", desc: "Личный куратор отвечает в чате 24/7 на вопросы по ДЗ и проектам." },
                { emoji: "🏅", title: "Сертификаты каждые 3 недели", desc: "За каждый пройденный блок. 6–14 сертификатов за весь курс." },
                { emoji: "🚀", title: "Защита проекта", desc: "В конце курса — реальный проект (приложение/игра/сайт/бот) в портфолио." },
                { emoji: "💼", title: "Помощь с резюме", desc: "Помогаем составить первое CV, GitHub-профиль и подготовиться к стажировкам." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-3xl flex-shrink-0">{item.emoji}</div>
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
              Первый урок — <span className="text-accent">бесплатно</span>
            </h3>
            <p className="text-foreground/70 mb-6 max-w-md mx-auto">Ребёнок попробует, познакомится с преподавателем. Если не понравится — никаких обязательств.</p>
            <button onClick={() => openApply()} className="inline-flex items-center gap-2 px-7 py-4 bg-accent hover:bg-accent-hover text-white rounded-full font-semibold hover:scale-[1.02] transition-all shadow-lg shadow-accent/30">
              Записаться на пробный урок <span>→</span>
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* 📅 РАСПИСАНИЕ — 1 июля 2026 в 20:00 */}
      <motion.section id="schedule" className="relative py-20 sm:py-28 border-t border-border bg-muted/20" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">

          {/* Заголовок секции */}
          <motion.div variants={fadeInUp} className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Расписание</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              1 июля 2026 — <span className="text-accent">старт первого потока</span>
            </h2>
            <p className="text-lg text-foreground/70">
              Все 4 направления стартуют одновременно. Занятия 2 раза в неделю в 20:00 — выбираете удобный график.
            </p>
          </motion.div>

          {/* Большая дата-карточка */}
          <motion.div variants={fadeInUp} className="max-w-3xl mx-auto mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-accent/10 via-accent-soft/10 to-transparent border-2 border-accent/30">
            <div className="grid sm:grid-cols-3 gap-5 sm:gap-6 text-center">
              <div>
                <div className="text-4xl mb-2">📅</div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight">1 июля</p>
                <p className="text-sm text-foreground/60 mt-1">2026 года</p>
              </div>
              <div className="sm:border-x sm:border-accent/20">
                <div className="text-4xl mb-2">🕐</div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight">20:00</p>
                <p className="text-sm text-foreground/60 mt-1">время по Алматы</p>
              </div>
              <div>
                <div className="text-4xl mb-2">📆</div>
                <p className="font-display text-xl sm:text-2xl font-bold text-foreground leading-tight">Вт + Чт</p>
                <p className="text-xs text-foreground/55 mt-1">или Ср + Пт</p>
              </div>
            </div>
          </motion.div>

          {/* Карточки курсов */}
          <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
            {[
              { course: "Веб-разработка", emoji: "🌐", color: "from-foreground/5", days: "Вт + Чт", age: "12–17 лет", seatsLeft: 3, totalSeats: 8 },
              { course: "Мобильная разработка", emoji: "📱", color: "from-accent/10", days: "Ср + Пт", age: "14–17 лет", seatsLeft: 5, totalSeats: 8 },
              { course: "Геймдев на Unity", emoji: "🎮", color: "from-accent-soft/15", days: "Вт + Чт", age: "13–18 лет", seatsLeft: 2, totalSeats: 8 },
              { course: "Бэкенд на Python", emoji: "⚙️", color: "from-muted/30", days: "Ср + Пт", age: "13–18 лет", seatsLeft: 6, totalSeats: 8 },
            ].map((stream, i) => {
              const filledPct = ((stream.totalSeats - stream.seatsLeft) / stream.totalSeats) * 100;
              const isAlmostFull = stream.seatsLeft <= 3;
              return (
                <motion.div key={i} variants={staggerItem} whileHover={{ y: -6, transition: { duration: 0.2 } }} className={`relative p-6 lg:p-7 rounded-2xl bg-gradient-to-br ${stream.color} to-transparent bg-surface border border-border hover:border-accent/40 hover:shadow-xl transition-all duration-300`}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{stream.emoji}</div>
                      <div>
                        <h3 className="font-display text-xl font-bold leading-tight">{stream.course}</h3>
                        <p className="text-xs text-foreground/55 mt-0.5">{stream.age}</p>
                      </div>
                    </div>
                    {isAlmostFull && (
                      <div className="px-3 py-1 rounded-full bg-accent/15 border border-accent/30">
                        <span className="text-[10px] font-bold text-accent uppercase tracking-wider whitespace-nowrap">🔥 Почти набрано</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-foreground/75 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📆</span>
                      <span className="font-semibold">{stream.days} · 20:00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">🚀</span>
                      <span>Старт: 1 июля 2026</span>
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-foreground">Места в группе</span>
                      <span className="font-bold text-accent">Осталось: {stream.seatsLeft} из {stream.totalSeats}</span>
                    </div>
                    <div className="h-2 rounded-full bg-foreground/10 overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${filledPct}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} className="h-full bg-gradient-to-r from-accent to-accent-soft rounded-full" />
                    </div>
                  </div>

                  <button onClick={() => openApply(stream.course)} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold transition-all hover:scale-[1.01] shadow-md shadow-accent/20">
                    Записаться в эту группу <span>→</span>
                  </button>
                </motion.div>
              );
            })}
          </div>

          <motion.div variants={fadeInUp} className="mt-12 text-center">
            <p className="text-foreground/60 text-sm mb-3">⚠️ Если время или дни не подходят — напишите, подберём удобный график именно для вашего ребёнка.</p>
            <button onClick={() => openApply()} className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-semibold transition-colors">
              Подобрать удобное время <span>→</span>
            </button>
          </motion.div>
        </div>
      </motion.section>

      <section className="relative py-20 sm:py-28 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={scrollViewport} variants={fadeInUp} className="max-w-2xl mb-16 sm:mb-24">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Как мы учим</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Три принципа, которые <span className="text-accent">отличают Alfa Z</span>
            </h2>
          </motion.div>
          <div className="space-y-20 sm:space-y-28">
            {[
              { number: "01", emoji: "🤖", title: "AI как инструмент. Не как замена", lead: "Мы не делаем вид, что ChatGPT не существует. Учим работать с ним правильно.", points: [
                { label: "Этап 1 — vibe-coding", text: "Ученик за 3 недели получает рабочий результат с помощью AI. Видит вау-эффект, влюбляется в IT." },
                { label: "Этап 2 — отбираем AI", text: "Учим читать чужой код, объяснять ошибки, рефакторить. AI помогает понять, а не пишет за ученика." },
                { label: "Защита — без AI", text: "На итоговой защите ученик работает один. Всё, что показывает — его. Так же на реальных собеседованиях." },
              ]},
              { number: "02", emoji: "🪜", title: "Никто не застревает на уроке", lead: "У каждого домашнего задания — два уровня. Если основной не получается, открывается облегчённый.", points: [
                { label: "Уровень 1 — основной", text: "Полноценное задание без подсказок. Если ученик справился — двигаемся дальше." },
                { label: "Уровень 2 — облегчённый", text: "Открывается через 48 часов или по запросу. Готовый шаблон кода (60-70%), подсказки с таймкодами видео." },
                { label: "Главное — движение", text: "Ученик не сидит неделю на одной задаче. Освоил облегчённый — идёт дальше. Уровень 2 — не стыдно." },
              ]},
              { number: "03", emoji: "📱", title: "Результат для родителей — после каждого урока", lead: "Не «через полгода покажем сертификат». А уже сегодня — конкретный артефакт со ссылкой.", points: [
                { label: "После урока про Telegram-бота", text: "Родитель пишет /start своему боту в Telegram и получает ответ. Бот реально работает 24/7." },
                { label: "После урока про мобильное", text: "Родитель устанавливает APK на свой телефон и пользуется приложением, которое сделал ребёнок." },
                { label: "Сертификат — каждые 3 недели", text: "За весь курс ученик получает 6–14 сертификатов (по одному за каждый блок). Виден прогресс, а не «всё в конце»." },
              ]},
            ].map((principle, i) => {
              const isReversed = i % 2 === 1;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={scrollViewport} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                  <div className={isReversed ? "lg:order-2" : ""}>
                    <div className="flex items-center gap-4 mb-5">
                      <span className="font-display text-5xl font-bold text-accent/30">{principle.number}</span>
                      <span className="text-4xl">{principle.emoji}</span>
                    </div>
                    <h3 className="font-display text-3xl sm:text-4xl font-bold leading-tight mb-4">{principle.title}</h3>
                    <p className="text-lg text-foreground/70 leading-relaxed mb-8">{principle.lead}</p>
                    <div className="space-y-5">
                      {principle.points.map((p, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent mt-2.5" />
                          <div>
                            <p className="font-semibold text-foreground mb-1">{p.label}</p>
                            <p className="text-sm text-foreground/70 leading-relaxed">{p.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={`relative aspect-square max-w-md mx-auto w-full ${isReversed ? "lg:order-1" : ""}`}>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/40 via-accent-soft/30 to-muted/50 shadow-xl shadow-accent/20 rotate-3" />
                    <div className="absolute inset-0 rounded-3xl bg-surface border border-border shadow-lg flex items-center justify-center -rotate-3">
                      <div className="text-center p-8">
                        <div className="text-8xl mb-3">{principle.emoji}</div>
                        <p className="font-display text-7xl font-bold text-accent/20">{principle.number}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <motion.section id="teachers" className="relative py-20 sm:py-28 bg-muted/30 border-t border-border" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="max-w-2xl mb-14 sm:mb-20">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Преподаватели</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Не теоретики. <span className="text-accent">Действующие разработчики.</span>
            </h2>
            <p className="text-lg text-foreground/70 mt-4 max-w-xl">Каждый преподаватель работает в IT-компании прямо сейчас. Не «выпускник универа», а человек, который пишет код каждый день за зарплату.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { initials: "АК", name: "Алмас К.", role: "Mobile Developer", company: "Kaspi.kz", courses: "Мобильная разработка", experience: "5 лет в IT" },
              { initials: "ДС", name: "Дина С.", role: "Senior Game Developer", company: "Playrix (Алматы)", courses: "Геймдев на Unity", experience: "7 лет в IT" },
              { initials: "ТМ", name: "Тимур М.", role: "Frontend Engineer", company: "inDriver", courses: "Веб-разработка", experience: "4 года в IT" },
              { initials: "АО", name: "Айгерим О.", role: "Backend Developer", company: "Halyk Bank Digital", courses: "Бэкенд на Python", experience: "6 лет в IT" },
            ].map((teacher, i) => (
              <motion.div key={i} variants={staggerItem} whileHover={{ y: -8, transition: { duration: 0.2 } }} className="group p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 hover:shadow-xl transition-all duration-300">
                <div className="relative w-full aspect-square rounded-xl mb-5 overflow-hidden bg-gradient-to-br from-accent via-accent-soft to-muted flex items-center justify-center">
                  <span className="font-display text-5xl font-bold text-white drop-shadow-lg">{teacher.initials}</span>
                  <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-lg bg-surface/95 backdrop-blur-sm text-xs font-semibold text-foreground text-center">{teacher.company}</div>
                </div>
                <h3 className="font-display text-xl font-bold mb-1">{teacher.name}</h3>
                <p className="text-sm text-accent font-semibold mb-3">{teacher.role}</p>
                <div className="space-y-1.5 text-sm text-foreground/60">
                  <p>📚 {teacher.courses}</p>
                  <p>⭐ {teacher.experience}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.p variants={fadeInUp} className="text-sm text-foreground/50 mt-12 max-w-xl">⚠️ Имена и компании в карточках — пример. Когда будут реальные фото и данные преподавателей, заменим за 2 минуты.</motion.p>
        </div>
      </motion.section>

      <motion.section id="reviews" className="relative py-20 sm:py-28 border-t border-border" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="max-w-2xl mb-14 sm:mb-20">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Отзывы</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Что говорят <span className="text-accent">родители и ученики</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { quote: "Сыну 13, был замкнутый, в школе сложно с математикой. За 4 месяца на курсе геймдева сделал свою игру в Steam-стиле, показывает всему классу. Поведение тоже изменилось — появилось «я могу».", author: "Гульнара Т.", role: "мама Айдара, 13 лет", course: "Геймдев", rating: 5, initials: "ГТ" },
              { quote: "Я учусь на веб-разработке. До Alfa Z пробовал YouTube — забросил через неделю. Тут другое: преподаватель видит, что я делаю, исправляет ошибки сразу. Уже сверстал портфолио для себя.", author: "Данияр К.", role: "ученик, 16 лет", course: "Веб-разработка", rating: 5, initials: "ДК" },
              { quote: "Долго выбирали школу. Решила Alfa Z — потому что подкупила честность: «мы не обещаем работу в Google». Дочери 15, делает мобильное приложение, скачали ей АРК — мы в семье им пользуемся.", author: "Айгуль М.", role: "мама Алии, 15 лет", course: "Мобильная разработка", rating: 5, initials: "АМ" },
              { quote: "Сначала переживала про «зум-уроки» — думала будет как школьная дистанционка. Совсем другое: маленькая группа, преподаватель помнит, что мой сын делал на прошлом уроке. Чувствуется внимание.", author: "Жанна С.", role: "мама Тимура, 14 лет", course: "Бэкенд", rating: 5, initials: "ЖС" },
              { quote: "Делаю Telegram-бота, который проверяет расписание автобусов. Реально полезная штука, и одноклассники просят добавить их школу. Препод не подсказывает в лоб — задаёт вопросы, чтобы я сам нашёл.", author: "Арман Ж.", role: "ученик, 15 лет", course: "Бэкенд", rating: 5, initials: "АЖ" },
              { quote: "Понравилось, что после каждого урока — ссылка на работающий результат. Не «через год покажем». Дочка горда, когда я открываю на своём телефоне её приложение. Раньше такого не было.", author: "Бахытжан Р.", role: "папа Камилы, 14 лет", course: "Мобильная разработка", rating: 5, initials: "БР" },
            ].map((review, i) => (
              <motion.div key={i} variants={staggerItem} whileHover={{ y: -6, transition: { duration: 0.2 } }} className="p-6 lg:p-7 rounded-2xl bg-surface border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: review.rating }).map((_, idx) => (<span key={idx} className="text-accent text-lg">★</span>))}
                </div>
                <p className="text-foreground/80 leading-relaxed mb-6 flex-grow">«{review.quote}»</p>
                <div className="flex items-center gap-3 pt-5 border-t border-border">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-accent-soft flex items-center justify-center text-white font-bold text-sm shadow-md">{review.initials}</div>
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-foreground text-sm">{review.author}</p>
                    <p className="text-xs text-foreground/55">{review.role}</p>
                  </div>
                  <span className="text-xs font-semibold text-accent px-2.5 py-1 rounded-full bg-accent/10 whitespace-nowrap">{review.course}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.p variants={fadeInUp} className="text-sm text-foreground/50 mt-10 max-w-xl">⚠️ Отзывы выше — пример. Когда соберём реальные у выпускников первого потока, заменим.</motion.p>
        </div>
      </motion.section>

      <motion.section id="faq" className="relative py-20 sm:py-28 bg-muted/30 border-t border-border" initial="hidden" whileInView="visible" viewport={scrollViewport} variants={staggerContainer}>
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-14 sm:mb-20">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Частые вопросы</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              Если что-то ещё <span className="text-accent">не понятно</span>
            </h2>
            <p className="text-lg text-foreground/70">Самые частые вопросы родителей. Если не нашли ответ — напишите в WhatsApp.</p>
          </motion.div>
          <div className="space-y-3">
            {[
              { q: "Когда стартует обучение?", a: "Первый поток школы стартует 1 июля 2026 года. Все 4 направления одновременно. Занятия в 20:00 по будням — Вт+Чт или Ср+Пт, на выбор. Если время не подходит — напишите, подберём удобный график." },
              { q: "Сколько стоит обучение?", a: "Месячный абонемент — 47 500 ₸. Есть три способа оплаты: помесячно, Kaspi-рассрочка на полугодие (0% переплаты) или скидка 10% при оплате 6 месяцев сразу (42 750 ₸/мес). Подробности — в разделе «Цены»." },
              { q: "С какого возраста можно учиться?", a: "Веб-разработка — с 12 лет, остальные курсы — с 13. Верхняя граница — 17–18 лет." },
              { q: "Что нужно для старта? Какой нужен компьютер?", a: "Любой компьютер не старше 5–7 лет — Windows, Mac или мощный Chromebook. Для геймдева на Unity нужно 8 ГБ RAM минимум." },
              { q: "Как проходят занятия? Это записи или живые?", a: "Живые групповые уроки 2 раза в неделю по 90 минут в Zoom. Группы маленькие — до 8 человек." },
              { q: "Безопасно ли это для ребёнка?", a: "Все преподаватели проходят отбор и подписывают договор о работе с детьми. На уроках всегда включена камера у всех." },
              { q: "А если ребёнок передумает?", a: "Первый месяц — пробный. Если в течение 14 дней решит, что не его — вернём деньги полностью, без вопросов." },
              { q: "Чем вы отличаетесь от Kodland и других школ?", a: "Главное: мы открыто учим работать с AI, а не делаем вид, что его нет. Второе: облегчённые задания через 48 часов. Третье: конкретный результат после каждого урока." },
              { q: "Получит ли ребёнок сертификат?", a: "Да, сертификаты выдаём каждые 3 недели — 6 за веб-курс, 5–6 за остальные. Главное — рабочие проекты на GitHub." },
              { q: "Как записаться на пробный урок?", a: "Нажмите кнопку «Пробный урок» вверху — откроется короткая форма. После заполнения мы свяжемся с вами в WhatsApp в течение часа. Пробный урок бесплатный, 60 минут, без обязательств." },
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
            <h3 className="font-display text-2xl sm:text-3xl font-bold mb-3">Не нашли ответ?</h3>
            <p className="text-foreground/70 mb-6 max-w-xl mx-auto">Напишите нам в WhatsApp — отвечаем в течение 30 минут в рабочее время. Без обязательств.</p>
            <a href="https://wa.me/77001234567" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3.5 bg-accent hover:bg-accent-hover text-white rounded-full font-semibold hover:scale-[1.02] transition-all shadow-lg shadow-accent/30">💬 Написать в WhatsApp</a>
          </motion.div>
        </div>
      </motion.section>

      <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={scrollViewport} transition={{ duration: 0.8 }} className="relative bg-foreground text-surface mt-0">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center font-bold text-lg shadow-lg shadow-accent/30">Az</div>
                <span className="font-display text-2xl font-bold">Alfa Z</span>
              </div>
              <p className="text-surface/65 text-sm leading-relaxed mb-6">Школа программирования для подростков 12–17 лет. Живые уроки, реальные проекты, преподаватели из Kaspi, Halyk, inDriver.</p>
              <div className="flex gap-2">
                <a href="https://wa.me/77001234567" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface/10 hover:bg-accent flex items-center justify-center transition-colors" aria-label="WhatsApp"><span className="text-lg">💬</span></a>
                <a href="https://t.me/alfaz_school" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface/10 hover:bg-accent flex items-center justify-center transition-colors" aria-label="Telegram"><span className="text-lg">✈️</span></a>
                <a href="https://instagram.com/alfaz.school" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface/10 hover:bg-accent flex items-center justify-center transition-colors" aria-label="Instagram"><span className="text-lg">📷</span></a>
              </div>
            </div>
            <div>
              <h4 className="font-display font-bold mb-4 text-surface">Курсы</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="/courses/mobdev" className="text-surface/60 hover:text-accent transition-colors">Мобильная разработка</a></li>
                <li><a href="/courses/gamedev" className="text-surface/60 hover:text-accent transition-colors">Геймдев на Unity</a></li>
                <li><a href="/courses/web" className="text-surface/60 hover:text-accent transition-colors">Веб-разработка</a></li>
                <li><a href="/courses/backend" className="text-surface/60 hover:text-accent transition-colors">Бэкенд на Python</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold mb-4 text-surface">Школа</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#about" className="text-surface/60 hover:text-accent transition-colors">О нас</a></li>
                <li><a href="#pricing" className="text-surface/60 hover:text-accent transition-colors">Цены и оплата</a></li>
                <li><a href="#schedule" className="text-surface/60 hover:text-accent transition-colors">Расписание</a></li>
                <li><a href="#teachers" className="text-surface/60 hover:text-accent transition-colors">Преподаватели</a></li>
                <li><a href="#reviews" className="text-surface/60 hover:text-accent transition-colors">Отзывы</a></li>
                <li><a href="#faq" className="text-surface/60 hover:text-accent transition-colors">Частые вопросы</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold mb-4 text-surface">Контакты</h4>
              <ul className="space-y-2.5 text-sm">
                <li className="text-surface/60">📞 <a href="tel:+77001234567" className="hover:text-accent transition-colors">+7 (700) 123-45-67</a></li>
                <li className="text-surface/60">✉️ <a href="mailto:hello@alfaz.kz" className="hover:text-accent transition-colors">hello@alfaz.kz</a></li>
                <li className="text-surface/60 leading-relaxed">📍 Алматы, Казахстан<br /><span className="text-surface/40 text-xs">Онлайн-обучение по всей стране</span></li>
                <li className="text-surface/60">🕐 Пн–Сб, 10:00–19:00 (UTC+5)</li>
              </ul>
            </div>
          </div>
          <div className="h-px bg-surface/10 mb-8" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-surface/50 text-sm">© 2026 Alfa Z. Все права защищены.<span className="hidden sm:inline"> · Сделано с 🧡 в Алматы</span></p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <a href="#" className="text-surface/50 hover:text-accent transition-colors">Публичная оферта</a>
              <a href="#" className="text-surface/50 hover:text-accent transition-colors">Политика конфиденциальности</a>
              <a href="#" className="text-surface/50 hover:text-accent transition-colors">Условия использования</a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
