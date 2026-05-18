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
    {
      name: "WhatsApp",
      href: "https://wa.me/77001234567",
      bg: "bg-[#25D366]",
      pulse: true,
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
      ),
    },
    {
      name: "Telegram",
      href: "https://t.me/alfaz_school",
      bg: "bg-[#229ED9]",
      pulse: false,
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com/alfaz.school",
      bg: "bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5]",
      pulse: false,
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
      ),
    },
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
        >
          {buttons.map((btn) => (
            <a key={btn.name} href={btn.href} target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-end" aria-label={`Написать в ${btn.name}`}>
              <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-foreground text-surface text-xs font-semibold whitespace-nowrap shadow-lg opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
                Написать в {btn.name}
              </span>
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

const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } };
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } } };
const staggerItem = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };
const scrollViewport = { once: true, amount: 0.15 };

export default function Home() {
  // 🎬 Hero parallax
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const videoY = useTransform(heroProgress, [0, 1], ["0%", "30%"]);
  const videoScale = useTransform(heroProgress, [0, 1], [1, 1.15]);
  const heroContentY = useTransform(heroProgress, [0, 1], ["0%", "-20%"]);
  const heroContentOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen bg-background">
      {/* 📈 Scroll progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] bg-accent origin-left z-[60]" style={{ scaleX: scrollYProgress }} />

      {/* 💬 Плавающие мессенджеры */}
      <FloatingMessengers />

      {/* ШАПКА */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <nav className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white font-display font-bold text-lg shadow-lg shadow-accent/30">Az</div>
            <span className="font-display font-bold text-xl tracking-tight">Alfa Z</span>
          </a>
          <ul className="hidden lg:flex items-center gap-8 text-sm font-medium text-foreground/70">
            <li><a href="#courses" className="hover:text-foreground transition-colors">Курсы</a></li>
            <li><a href="#about" className="hover:text-foreground transition-colors">О школе</a></li>
            <li><a href="#teachers" className="hover:text-foreground transition-colors">Преподаватели</a></li>
            <li><a href="#reviews" className="hover:text-foreground transition-colors">Отзывы</a></li>
            <li><a href="#blog" className="hover:text-foreground transition-colors">Блог</a></li>
          </ul>
          <div className="flex items-center gap-3">
            <button className="hidden sm:inline-flex text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">Войти</button>
            <button className="px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-all hover:scale-[1.03] shadow-md shadow-accent/20">Пробный урок</button>
          </div>
        </nav>
      </header>

      {/* 🎬 HERO с PARALLAX */}
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
              <span className="text-sm font-semibold text-white tracking-wide">Набор на 2026 / 27 учебный год открыт</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6 animate-fade-in-up delay-100">
              Школа программирования <span className="text-accent">для подростков 12 – 17 лет</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/85 leading-relaxed mb-9 max-w-xl animate-fade-in-up delay-200">
              Учим IT с нуля до уровня junior. Живые уроки с практикующими разработчиками. 4 направления: мобильная разработка, геймдев, фронтенд, бэкенд.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-10 animate-fade-in-up delay-300">
              <a href="https://wa.me/77001234567" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-4 bg-accent hover:bg-accent-hover text-white rounded-full font-semibold hover:scale-[1.02] transition-all duration-300 shadow-2xl shadow-accent/40">
                Записаться на пробный урок <span aria-hidden>→</span>
              </a>
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

      {/* 📊 АНИМИРОВАННЫЕ СЧЁТЧИКИ */}
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

      {/* ПОЧЕМУ ALFA Z */}
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

      {/* 4 КУРСА */}
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
              { emoji: "📱", title: "Мобильная разработка", tagline: "FlutterFlow → Flutter → Firebase", desc: "Создаём приложения для Android и iOS. От квиза «Какой ты персонаж» до мини-Instagram для класса.", result: "Финал в Google Play + AdMob + профиль на Upwork", lessons: "48 уроков · 24 недели", age: "14–17 лет", certs: "14+ сертификатов", stack: ["Flutter", "Dart", "Firebase", "Flame", "Codemagic"], bgClass: "bg-gradient-to-br from-accent/15 via-accent-soft/10 to-transparent" },
              { emoji: "🎮", title: "Геймдев на Unity", tagline: "Unity 6 + C# + 2D", desc: "Делаем игры жанров Mario, Hollow Knight, Celeste. Финальная игра на 3 платформах.", result: "Игра на itch.io + Google Play + App Store", lessons: "50 уроков · 25 недель", age: "13–18 лет", certs: "5–8 игр в портфолио", stack: ["Unity 6", "C#", "Piskel", "Git"], bgClass: "bg-gradient-to-br from-accent-soft/20 via-muted/30 to-transparent" },
              { emoji: "🌐", title: "Веб-разработка", tagline: "HTML → CSS → JavaScript → React", desc: "Учимся делать современные сайты как профессионалы. От первого Hello, World до React-приложения.", result: "React-приложение в интернете + GitHub-портфолио", lessons: "48 уроков · 24 недели", age: "12–17 лет", certs: "6 сертификатов", stack: ["React", "TypeScript", "Tailwind", "Git"], bgClass: "bg-gradient-to-br from-foreground/[0.04] via-muted/40 to-transparent" },
              { emoji: "⚙️", title: "Бэкенд на Python", tagline: "Python → SQL → Flask → Docker", desc: "«Мозги» сайтов и приложений. Создаём Telegram-бот, который работает 24/7, и боевой REST API.", result: "Telegram-бот 24/7 + REST API на Docker в интернете", lessons: "52 урока · 26 недель", age: "13–18 лет", certs: "5–7 проектов в портфолио", stack: ["Python", "Flask", "FastAPI", "SQL", "Docker"], bgClass: "bg-gradient-to-br from-muted/30 via-accent-soft/10 to-transparent" },
            ].map((course, i) => (
              <motion.a key={i} href="#" variants={staggerItem} whileHover={{ y: -8, transition: { duration: 0.2 } }} className={`group relative p-7 lg:p-8 rounded-2xl ${course.bgClass} border border-border hover:border-accent/40 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col`}>
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
                <div className="flex flex-wrap gap-1.5 mb-12">
                  {course.stack.map((tech, idx) => (<span key={idx} className="px-2.5 py-1 rounded-md bg-foreground/5 text-xs font-medium text-foreground/70">{tech}</span>))}
                </div>
                <div className="absolute bottom-7 right-7 w-10 h-10 rounded-full bg-foreground/5 group-hover:bg-accent group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:rotate-[-45deg]">→</div>
              </motion.a>
            ))}
          </div>
          <motion.div variants={fadeInUp} className="mt-12 sm:mt-16 text-center">
            <p className="text-foreground/60 text-sm mb-2">Не уверены, какой курс подходит ребёнку?</p>
            <a href="#" className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-semibold transition-colors">Записаться на бесплатный пробный урок и определиться вместе <span>→</span></a>
          </motion.div>
        </div>
      </motion.section>

      {/* КАК МЫ УЧИМ — обычная зебра, без sticky */}
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

      {/* ПРЕПОДАВАТЕЛИ */}
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

      {/* ОТЗЫВЫ */}
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

      {/* FAQ */}
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
              { q: "Сколько стоит обучение?", a: "Цена зависит от курса и формата. У нас есть рассрочка через Kaspi на 6–12 месяцев без удорожания. Точную стоимость скажем на бесплатном пробном уроке." },
              { q: "С какого возраста можно учиться?", a: "Веб-разработка — с 12 лет, остальные курсы — с 13. Верхняя граница — 17–18 лет." },
              { q: "Что нужно для старта? Какой нужен компьютер?", a: "Любой компьютер не старше 5–7 лет — Windows, Mac или мощный Chromebook. Для геймдева на Unity нужно 8 ГБ RAM минимум." },
              { q: "Как проходят занятия? Это записи или живые?", a: "Живые групповые уроки 2 раза в неделю по 90 минут в Zoom. Группы маленькие — до 8 человек." },
              { q: "Безопасно ли это для ребёнка?", a: "Все преподаватели проходят отбор и подписывают договор о работе с детьми. На уроках всегда включена камера у всех." },
              { q: "А если ребёнок передумает?", a: "Первый месяц — пробный. Если в течение 14 дней решит, что не его — вернём деньги полностью, без вопросов." },
              { q: "Чем вы отличаетесь от Kodland и других школ?", a: "Главное: мы открыто учим работать с AI, а не делаем вид, что его нет. Второе: облегчённые задания через 48 часов. Третье: конкретный результат после каждого урока." },
              { q: "Получит ли ребёнок сертификат?", a: "Да, сертификаты выдаём каждые 3 недели — 6 за веб-курс, 5–6 за остальные. Главное — рабочие проекты на GitHub." },
              { q: "Реально ли подросток сможет заработать на этом?", a: "Честно: не за 6 месяцев. После полного курса 1–2 года практики — да, фриланс на Upwork, маленькие заказы от знакомых." },
              { q: "Как записаться на пробный урок?", a: "Нажмите кнопку «Пробный урок» вверху — менеджер свяжется в течение часа. Пробный урок бесплатный, 60 минут, без обязательств." },
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

      {/* FOOTER */}
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
                <li><a href="#courses" className="text-surface/60 hover:text-accent transition-colors">Мобильная разработка</a></li>
                <li><a href="#courses" className="text-surface/60 hover:text-accent transition-colors">Геймдев на Unity</a></li>
                <li><a href="#courses" className="text-surface/60 hover:text-accent transition-colors">Веб-разработка</a></li>
                <li><a href="#courses" className="text-surface/60 hover:text-accent transition-colors">Бэкенд на Python</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold mb-4 text-surface">Школа</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#about" className="text-surface/60 hover:text-accent transition-colors">О нас</a></li>
                <li><a href="#teachers" className="text-surface/60 hover:text-accent transition-colors">Преподаватели</a></li>
                <li><a href="#reviews" className="text-surface/60 hover:text-accent transition-colors">Отзывы</a></li>
                <li><a href="#faq" className="text-surface/60 hover:text-accent transition-colors">Частые вопросы</a></li>
                <li><a href="#" className="text-surface/60 hover:text-accent transition-colors">Блог</a></li>
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
