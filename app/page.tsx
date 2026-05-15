export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* ═══════════════════════════════════════
          ШАПКА
          ═══════════════════════════════════════ */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <nav className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white font-display font-bold text-lg shadow-lg shadow-accent/30">
              Az
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Alfa Z
            </span>
          </a>

          <ul className="hidden lg:flex items-center gap-8 text-sm font-medium text-foreground/70">
            <li><a href="#courses" className="hover:text-foreground transition-colors">Курсы</a></li>
            <li><a href="#about" className="hover:text-foreground transition-colors">О школе</a></li>
            <li><a href="#teachers" className="hover:text-foreground transition-colors">Преподаватели</a></li>
            <li><a href="#reviews" className="hover:text-foreground transition-colors">Отзывы</a></li>
            <li><a href="#blog" className="hover:text-foreground transition-colors">Блог</a></li>
          </ul>

          <div className="flex items-center gap-3">
            <button className="hidden sm:inline-flex text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              Войти
            </button>
            <button className="px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold transition-all hover:scale-[1.03] shadow-md shadow-accent/20">
              Пробный урок
            </button>
          </div>
        </nav>
      </header>

      {/* ═══════════════════════════════════════
          HERO
          ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/25 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-soft/30 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface text-sm font-medium text-foreground/70 mb-6">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Набор на 2026 / 27 учебный год открыт
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
                Школа программирования для подростков{" "}
                <span className="text-accent">12 – 17 лет</span>
              </h1>

              <p className="text-lg text-foreground/70 leading-relaxed mb-8 max-w-xl">
                Учим IT с нуля до уровня junior. Живые уроки с практикующими
                разработчиками. 4 направления: мобильная разработка, геймдев,
                фронтенд, бэкенд.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button className="px-7 py-4 rounded-full bg-accent hover:bg-accent-hover text-white font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-accent/30 inline-flex items-center justify-center gap-2">
                  Записаться на пробный урок
                  <span>→</span>
                </button>
                <button className="px-7 py-4 rounded-full border border-border hover:border-foreground/30 text-foreground font-semibold transition-colors bg-surface/50 backdrop-blur-sm">
                  Программа курсов
                </button>
              </div>

              <div className="flex items-center gap-5">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-background bg-gradient-to-br from-accent to-accent-soft" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 mb-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="w-4 h-4 fill-accent" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.169c.969 0 1.371 1.24.588 1.81l-3.371 2.45a1 1 0 00-.364 1.118l1.286 3.967c.3.921-.755 1.688-1.539 1.118l-3.37-2.45a1 1 0 00-1.176 0l-3.37 2.45c-.784.57-1.838-.197-1.539-1.118l1.286-3.967a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.168a1 1 0 00.951-.69l1.286-3.967z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-foreground/60">
                    <span className="font-semibold text-foreground">4.9 / 5</span>
                    {" · "}500+ учеников
                  </p>
                </div>
              </div>
            </div>

            <div className="relative aspect-square max-w-lg mx-auto w-full">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent via-accent-soft to-muted shadow-2xl shadow-accent/30 rotate-3 transition-transform duration-500 hover:rotate-0" />
              <div className="absolute inset-0 rounded-3xl bg-surface border border-border shadow-xl flex items-center justify-center -rotate-3 transition-transform duration-500 hover:rotate-0">
                <div className="text-center p-8">
                  <div className="text-7xl mb-4">🚀</div>
                  <p className="font-display text-2xl font-bold mb-2">Здесь будет иллюстрация</p>
                  <p className="text-sm text-foreground/60 max-w-xs mx-auto">
                    3D-картинка в стиле Kodland —<br />добавим, когда будут готовы
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ПОЧЕМУ ALFA Z
          ═══════════════════════════════════════ */}
      <section id="about" className="relative py-20 sm:py-28 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-2xl mb-14 sm:mb-20">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
              Почему Alfa Z
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Не курсы по видео,
              <br />
              а <span className="text-accent">настоящая школа</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                emoji: "🎯",
                title: "Живые уроки",
                desc: "Никаких бесконечных записей. Преподаватель видит каждого, отвечает на вопросы прямо на занятии.",
              },
              {
                emoji: "👨‍💻",
                title: "Преподаватели-практики",
                desc: "Не теоретики из университета — все работают в IT-компаниях прямо сейчас.",
              },
              {
                emoji: "🛠",
                title: "Реальные проекты",
                desc: "К концу обучения у ученика портфолио на GitHub, которое можно показать работодателю.",
              },
              {
                emoji: "🎓",
                title: "Помощь после",
                desc: "Сертификат, помощь с резюме и подготовка к первым стажировкам в IT.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {card.emoji}
                </div>
                <h3 className="font-display text-xl font-bold mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4 КУРСА (обновлено под реальные КТП)
          ═══════════════════════════════════════ */}
      <section id="courses" className="relative py-20 sm:py-28 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-2xl mb-14 sm:mb-20">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
              4 направления
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Серьёзные программы.{" "}
              <span className="text-accent">Реальные результаты.</span>
            </h2>
            <p className="text-lg text-foreground/70 mt-4 max-w-xl">
              48–52 урока. Живые занятия. Защита проекта в конце. Каждые 3 недели — новый сертификат.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
            {[
              {
                emoji: "📱",
                title: "Мобильная разработка",
                tagline: "FlutterFlow → Flutter → Firebase",
                desc: "Создаём приложения для Android и iOS. От квиза «Какой ты персонаж» до мини-Instagram для класса.",
                result: "Финал в Google Play + AdMob + профиль на Upwork",
                lessons: "48 уроков · 24 недели",
                age: "14–17 лет",
                certs: "14+ сертификатов",
                stack: ["Flutter", "Dart", "Firebase", "Flame", "Codemagic"],
                bgClass: "bg-gradient-to-br from-accent/15 via-accent-soft/10 to-transparent",
              },
              {
                emoji: "🎮",
                title: "Геймдев на Unity",
                tagline: "Unity 6 + C# + 2D",
                desc: "Делаем игры жанров Mario, Hollow Knight, Celeste. Финальная игра на 3 платформах.",
                result: "Игра на itch.io + Google Play + App Store",
                lessons: "50 уроков · 25 недель",
                age: "13–18 лет",
                certs: "5–8 игр в портфолио",
                stack: ["Unity 6", "C#", "Piskel", "Git"],
                bgClass: "bg-gradient-to-br from-accent-soft/20 via-muted/30 to-transparent",
              },
              {
                emoji: "🌐",
                title: "Веб-разработка",
                tagline: "HTML → CSS → JavaScript → React",
                desc: "Учимся делать современные сайты как профессионалы. От первого Hello, World до React-приложения.",
                result: "React-приложение в интернете + GitHub-портфолио",
                lessons: "48 уроков · 24 недели",
                age: "12–17 лет",
                certs: "6 сертификатов",
                stack: ["React", "TypeScript", "Tailwind", "Git"],
                bgClass: "bg-gradient-to-br from-foreground/[0.04] via-muted/40 to-transparent",
              },
              {
                emoji: "⚙️",
                title: "Бэкенд на Python",
                tagline: "Python → SQL → Flask → Docker",
                desc: "«Мозги» сайтов и приложений. Создаём Telegram-бот, который работает 24/7, и боевой REST API.",
                result: "Telegram-бот 24/7 + REST API на Docker в интернете",
                lessons: "52 урока · 26 недель",
                age: "13–18 лет",
                certs: "5–7 проектов в портфолио",
                stack: ["Python", "Flask", "FastAPI", "SQL", "Docker"],
                bgClass: "bg-gradient-to-br from-muted/30 via-accent-soft/10 to-transparent",
              },
            ].map((course, i) => (
              <a
                key={i}
                href="#"
                className={`group relative p-7 lg:p-8 rounded-2xl ${course.bgClass} border border-border hover:border-accent/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col`}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {course.emoji}
                </div>

                <h3 className="font-display text-2xl lg:text-3xl font-bold mb-1.5 leading-tight">
                  {course.title}
                </h3>

                <p className="text-sm font-medium text-accent mb-4">
                  {course.tagline}
                </p>

                <p className="text-foreground/70 leading-relaxed mb-5">
                  {course.desc}
                </p>

                <div className="inline-flex items-start gap-2 px-4 py-3 rounded-xl bg-surface border border-border mb-5">
                  <span className="text-base flex-shrink-0">🏆</span>
                  <div>
                    <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-0.5">
                      В конце курса
                    </p>
                    <p className="text-sm font-semibold text-foreground leading-snug">
                      {course.result}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-foreground/70 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 flex-shrink-0">📅</span>
                    <span>{course.lessons}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 flex-shrink-0">👤</span>
                    <span>{course.age}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 flex-shrink-0">🏅</span>
                    <span>{course.certs}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-12">
                  {course.stack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-foreground/5 text-xs font-medium text-foreground/70"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="absolute bottom-7 right-7 w-10 h-10 rounded-full bg-foreground/5 group-hover:bg-accent group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:rotate-[-45deg]">
                  →
                </div>
              </a>
            ))}
          </div>

          {/* Финальная нотка под карточками */}
          <div className="mt-12 sm:mt-16 text-center">
            <p className="text-foreground/60 text-sm mb-2">
              Не уверены, какой курс подходит ребёнку?
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-semibold transition-colors">
              Записаться на бесплатный пробный урок и определиться вместе
              <span>→</span>
            </a>
          </div>
        </div>
      </section>
{/* ═══════════════════════════════════════
          КАК МЫ УЧИМ — 3 принципа из КТП
          ═══════════════════════════════════════ */}
      <section className="relative py-20 sm:py-28 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Заголовок секции */}
          <div className="max-w-2xl mb-16 sm:mb-24">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
              Как мы учим
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Три принципа, которые{" "}
              <span className="text-accent">отличают Alfa Z</span>
            </h2>
          </div>

          {/* 3 принципа — крупными блоками */}
          <div className="space-y-20 sm:space-y-28">
            {[
              {
                number: "01",
                emoji: "🤖",
                title: "AI как инструмент. Не как замена",
                lead: "Мы не делаем вид, что ChatGPT не существует. Учим работать с ним правильно.",
                points: [
                  {
                    label: "Этап 1 — vibe-coding",
                    text: "Ученик за 3 недели получает рабочий результат с помощью AI. Видит вау-эффект, влюбляется в IT.",
                  },
                  {
                    label: "Этап 2 — отбираем AI",
                    text: "Учим читать чужой код, объяснять ошибки, рефакторить. AI помогает понять, а не пишет за ученика.",
                  },
                  {
                    label: "Защита — без AI",
                    text: "На итоговой защите ученик работает один. Всё, что показывает — его. Так же на реальных собеседованиях.",
                  },
                ],
              },
              {
                number: "02",
                emoji: "🪜",
                title: "Никто не застревает на уроке",
                lead: "У каждого домашнего задания — два уровня. Если основной не получается, открывается облегчённый.",
                points: [
                  {
                    label: "Уровень 1 — основной",
                    text: "Полноценное задание без подсказок. Если ученик справился — двигаемся дальше.",
                  },
                  {
                    label: "Уровень 2 — облегчённый",
                    text: "Открывается через 48 часов или по запросу. Готовый шаблон кода (60-70%), подсказки с таймкодами видео.",
                  },
                  {
                    label: "Главное — движение",
                    text: "Ученик не сидит неделю на одной задаче. Освоил облегчённый — идёт дальше. Уровень 2 — не стыдно.",
                  },
                ],
              },
              {
                number: "03",
                emoji: "📱",
                title: "Результат для родителей — после каждого урока",
                lead: "Не «через полгода покажем сертификат». А уже сегодня — конкретный артефакт со ссылкой.",
                points: [
                  {
                    label: "После урока про Telegram-бота",
                    text: "Родитель пишет /start своему боту в Telegram и получает ответ. Бот реально работает 24/7.",
                  },
                  {
                    label: "После урока про мобильное",
                    text: "Родитель устанавливает APK на свой телефон и пользуется приложением, которое сделал ребёнок.",
                  },
                  {
                    label: "Сертификат — каждые 3 недели",
                    text: "За весь курс ученик получает 6–14 сертификатов (по одному за каждый блок). Виден прогресс, а не «всё в конце».",
                  },
                ],
              },
            ].map((principle, i) => {
              const isReversed = i % 2 === 1;
              return (
                <div
                  key={i}
                  className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center`}
                >
                  {/* Текстовая часть */}
                  <div className={isReversed ? "lg:order-2" : ""}>
                    <div className="flex items-center gap-4 mb-5">
                      <span className="font-display text-5xl font-bold text-accent/30">
                        {principle.number}
                      </span>
                      <span className="text-4xl">{principle.emoji}</span>
                    </div>

                    <h3 className="font-display text-3xl sm:text-4xl font-bold leading-tight mb-4">
                      {principle.title}
                    </h3>

                    <p className="text-lg text-foreground/70 leading-relaxed mb-8">
                      {principle.lead}
                    </p>

                    <div className="space-y-5">
                      {principle.points.map((p, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent mt-2.5" />
                          <div>
                            <p className="font-semibold text-foreground mb-1">
                              {p.label}
                            </p>
                            <p className="text-sm text-foreground/70 leading-relaxed">
                              {p.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Декоративная карточка */}
                  <div className={`relative aspect-square max-w-md mx-auto w-full ${isReversed ? "lg:order-1" : ""}`}>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/40 via-accent-soft/30 to-muted/50 shadow-xl shadow-accent/20 rotate-3" />
                    <div className="absolute inset-0 rounded-3xl bg-surface border border-border shadow-lg flex items-center justify-center -rotate-3">
                      <div className="text-center p-8">
                        <div className="text-8xl mb-3">{principle.emoji}</div>
                        <p className="font-display text-7xl font-bold text-accent/20">
                          {principle.number}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ПРЕПОДАВАТЕЛИ (placeholder — заменим на реальных)
          ═══════════════════════════════════════ */}
      <section id="teachers" className="relative py-20 sm:py-28 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Заголовок секции */}
          <div className="max-w-2xl mb-14 sm:mb-20">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
              Преподаватели
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Не теоретики.{" "}
              <span className="text-accent">Действующие разработчики.</span>
            </h2>
            <p className="text-lg text-foreground/70 mt-4 max-w-xl">
              Каждый преподаватель работает в IT-компании прямо сейчас. Не «выпускник универа», а человек, который пишет код каждый день за зарплату.
            </p>
          </div>

          {/* Сетка преподавателей */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                initials: "АК",
                name: "Алмас К.",
                role: "Mobile Developer",
                company: "Kaspi.kz",
                courses: "Мобильная разработка",
                experience: "5 лет в IT",
              },
              {
                initials: "ДС",
                name: "Дина С.",
                role: "Senior Game Developer",
                company: "Playrix (Алматы)",
                courses: "Геймдев на Unity",
                experience: "7 лет в IT",
              },
              {
                initials: "ТМ",
                name: "Тимур М.",
                role: "Frontend Engineer",
                company: "inDriver",
                courses: "Веб-разработка",
                experience: "4 года в IT",
              },
              {
                initials: "АО",
                name: "Айгерим О.",
                role: "Backend Developer",
                company: "Halyk Bank Digital",
                courses: "Бэкенд на Python",
                experience: "6 лет в IT",
              },
            ].map((teacher, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Аватар-плейсхолдер */}
                <div className="relative w-full aspect-square rounded-xl mb-5 overflow-hidden bg-gradient-to-br from-accent via-accent-soft to-muted flex items-center justify-center">
                  <span className="font-display text-5xl font-bold text-white drop-shadow-lg">
                    {teacher.initials}
                  </span>
                  {/* Маленький бейдж — место работы */}
                  <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-lg bg-surface/95 backdrop-blur-sm text-xs font-semibold text-foreground text-center">
                    {teacher.company}
                  </div>
                </div>

                {/* Информация */}
                <h3 className="font-display text-xl font-bold mb-1">
                  {teacher.name}
                </h3>
                <p className="text-sm text-accent font-semibold mb-3">
                  {teacher.role}
                </p>
                <div className="space-y-1.5 text-sm text-foreground/60">
                  <p>📚 {teacher.courses}</p>
                  <p>⭐ {teacher.experience}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Подсказка снизу */}
          <p className="text-sm text-foreground/50 mt-12 max-w-xl">
            ⚠️ Имена и компании в карточках — пример. Когда будут реальные фото и данные преподавателей, заменим за 2 минуты.
          </p>
        </div>
      </section>
      {/* ═══════════════════════════════════════
          ОТЗЫВЫ — родители и ученики
          ═══════════════════════════════════════ */}
      <section id="reviews" className="relative py-20 sm:py-28 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Заголовок секции */}
          <div className="max-w-2xl mb-14 sm:mb-20">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
              Отзывы
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Что говорят{" "}
              <span className="text-accent">родители и ученики</span>
            </h2>
          </div>

          {/* Сетка отзывов */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                quote:
                  "Сыну 13, был замкнутый, в школе сложно с математикой. За 4 месяца на курсе геймдева сделал свою игру в Steam-стиле, показывает всему классу. Поведение тоже изменилось — появилось «я могу».",
                author: "Гульнара Т.",
                role: "мама Айдара, 13 лет",
                course: "Геймдев",
                rating: 5,
                initials: "ГТ",
              },
              {
                quote:
                  "Я учусь на веб-разработке. До Alfa Z пробовал YouTube — забросил через неделю. Тут другое: преподаватель видит, что я делаю, исправляет ошибки сразу. Уже сверстал портфолио для себя.",
                author: "Данияр К.",
                role: "ученик, 16 лет",
                course: "Веб-разработка",
                rating: 5,
                initials: "ДК",
              },
              {
                quote:
                  "Долго выбирали школу. Решила Alfa Z — потому что подкупила честность: «мы не обещаем работу в Google». Дочери 15, делает мобильное приложение, скачали ей АРК — мы в семье им пользуемся.",
                author: "Айгуль М.",
                role: "мама Алии, 15 лет",
                course: "Мобильная разработка",
                rating: 5,
                initials: "АМ",
              },
              {
                quote:
                  "Сначала переживала про «зум-уроки» — думала будет как школьная дистанционка. Совсем другое: маленькая группа, преподаватель помнит, что мой сын делал на прошлом уроке. Чувствуется внимание.",
                author: "Жанна С.",
                role: "мама Тимура, 14 лет",
                course: "Бэкенд",
                rating: 5,
                initials: "ЖС",
              },
              {
                quote:
                  "Делаю Telegram-бота, который проверяет расписание автобусов. Реально полезная штука, и одноклассники просят добавить их школу. Препод не подсказывает в лоб — задаёт вопросы, чтобы я сам нашёл.",
                author: "Арман Ж.",
                role: "ученик, 15 лет",
                course: "Бэкенд",
                rating: 5,
                initials: "АЖ",
              },
              {
                quote:
                  "Понравилось, что после каждого урока — ссылка на работающий результат. Не «через год покажем». Дочка горда, когда я открываю на своём телефоне её приложение. Раньше такого не было.",
                author: "Бахытжан Р.",
                role: "папа Камилы, 14 лет",
                course: "Мобильная разработка",
                rating: 5,
                initials: "БР",
              },
            ].map((review, i) => (
              <div
                key={i}
                className="p-6 lg:p-7 rounded-2xl bg-surface border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* Звёзды */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: review.rating }).map((_, idx) => (
                    <span key={idx} className="text-accent text-lg">★</span>
                  ))}
                </div>

                {/* Текст отзыва */}
                <p className="text-foreground/80 leading-relaxed mb-6 flex-grow">
                  «{review.quote}»
                </p>

                {/* Подпись */}
                <div className="flex items-center gap-3 pt-5 border-t border-border">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-accent-soft flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {review.initials}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-foreground text-sm">
                      {review.author}
                    </p>
                    <p className="text-xs text-foreground/55">
                      {review.role}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-accent px-2.5 py-1 rounded-full bg-accent/10 whitespace-nowrap">
                    {review.course}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Подсказка снизу */}
          <p className="text-sm text-foreground/50 mt-10 max-w-xl">
            ⚠️ Отзывы выше — пример. Когда соберём реальные у выпускников первого потока, заменим.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FAQ — ответы на сомнения родителей
          ═══════════════════════════════════════ */}
      <section id="faq" className="relative py-20 sm:py-28 bg-muted/30 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          {/* Заголовок секции */}
          <div className="text-center mb-14 sm:mb-20">
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
              Частые вопросы
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              Если что-то ещё{" "}
              <span className="text-accent">не понятно</span>
            </h2>
            <p className="text-lg text-foreground/70">
              Самые частые вопросы родителей. Если не нашли ответ — напишите в WhatsApp.
            </p>
          </div>

          {/* Список вопросов */}
          <div className="space-y-3">
            {[
              {
                q: "Сколько стоит обучение?",
                a: "Цена зависит от курса и формата. У нас есть рассрочка через Kaspi на 6–12 месяцев без удорожания. Точную стоимость скажем на бесплатном пробном уроке — после того, как поймём, какой курс подходит вашему ребёнку.",
              },
              {
                q: "С какого возраста можно учиться?",
                a: "Веб-разработка — с 12 лет, остальные курсы — с 13. Верхняя граница — 17–18 лет. Если ребёнку 11 — скажем честно, не возьмём, ему ещё рано (предложим вернуться через год). Если 18+ — посоветуем другую школу для взрослых, наши группы подростковые.",
              },
              {
                q: "Что нужно для старта? Какой нужен компьютер?",
                a: "Любой компьютер не старше 5–7 лет — Windows, Mac или даже мощный Chromebook. Для геймдева на Unity нужно чуть мощнее (8 ГБ RAM минимум). Стабильный интернет для видеоуроков. Программирующего опыта НЕ требуется — начинаем с нуля.",
              },
              {
                q: "Как проходят занятия? Это записи или живые?",
                a: "Живые групповые уроки 2 раза в неделю по 90 минут в Zoom. Группы маленькие — до 8 человек. Преподаватель видит каждого. Если ребёнок пропустил урок — есть запись + куратор поможет догнать. Между уроками — домашние задания на платформе.",
              },
              {
                q: "Безопасно ли это для ребёнка? С кем он общается?",
                a: "Все преподаватели проходят отбор и подписывают договор о работе с детьми. На уроках всегда включена камера у всех — никаких анонимов. Чаты курса модерируются. Родителям приходят отчёты о посещаемости и прогрессе раз в неделю.",
              },
              {
                q: "А если ребёнок передумает или ему не понравится?",
                a: "Первый месяц — пробный. Если в течение 14 дней с первого урока ребёнок решит, что не его — вернём деньги полностью, без вопросов. Дальше — пропорционально пройденным урокам. Мы не держим силой.",
              },
              {
                q: "Чем вы отличаетесь от Kodland и других школ?",
                a: "Главное: мы открыто учим работать с AI (ChatGPT и т.п.), а не делаем вид, что его нет. Второе: у нас облегчённые задания через 48 часов — никто не застревает. Третье: после каждого урока есть конкретный артефакт со ссылкой, который вы можете открыть на своём телефоне.",
              },
              {
                q: "Получит ли ребёнок сертификат? Поможет ли это с поступлением?",
                a: "Да, сертификаты выдаём каждые 3 недели (по итогу блока) — 6 за веб-курс, 5–6 за остальные. Они не государственные, но реально полезны для портфолио. Главное — ребёнок получает работающие проекты на GitHub, которые показывают в университете при поступлении на IT.",
              },
              {
                q: "Реально ли подросток сможет заработать на этом?",
                a: "Честно: не за 6 месяцев. После полного курса 1–2 года с практикой — да, такие случаи у нас будут (фриланс на Upwork, маленькие заказы от знакомых). Главная цель курса — не «работа в 14 лет», а сильное портфолио, понимание индустрии и поступление в хороший IT-вуз.",
              },
              {
                q: "Как записаться на пробный урок?",
                a: "Нажмите кнопку «Пробный урок» вверху сайта, оставьте контакты — наш менеджер свяжется в течение часа в рабочее время. Пробный урок бесплатный, идёт 60 минут, без обязательств. Ребёнок попробует — решите вместе.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group rounded-2xl bg-surface border border-border hover:border-accent/30 transition-colors overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 p-5 lg:p-6 cursor-pointer list-none">
                  <span className="font-display text-lg lg:text-xl font-semibold text-foreground pr-4">
                    {item.q}
                  </span>
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-accent/10 group-open:bg-accent flex items-center justify-center transition-all duration-300 group-open:rotate-45">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className="text-accent group-open:text-white transition-colors"
                    >
                      <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <div className="px-5 lg:px-6 pb-5 lg:pb-6 text-foreground/70 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>

          {/* CTA снизу */}
          <div className="mt-14 p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-accent/10 via-accent-soft/15 to-muted/30 border border-accent/20 text-center">
            <h3 className="font-display text-2xl sm:text-3xl font-bold mb-3">
              Не нашли ответ?
            </h3>
            <p className="text-foreground/70 mb-6 max-w-xl mx-auto">
              Напишите нам в WhatsApp — отвечаем в течение 30 минут в рабочее время. Без обязательств.
            </p>
            <a
              href="https://wa.me/77001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-accent text-white rounded-full font-semibold hover:bg-accent/90 hover:scale-[1.02] transition-all shadow-lg shadow-accent/30"
            >
              💬 Написать в WhatsApp
            </a>
          </div>
        </div>
      </section>
      {/* ═══════════════════════════════════════
          FOOTER — контакты, ссылки, юр. инфо
          ═══════════════════════════════════════ */}
      <footer className="relative bg-foreground text-surface mt-0">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
          {/* Верхний блок: 4 колонки */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">

            {/* Колонка 1 — Логотип + описание + соцсети */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center font-bold text-lg shadow-lg shadow-accent/30">
                  Az
                </div>
                <span className="font-display text-2xl font-bold">Alfa Z</span>
              </div>
              <p className="text-surface/65 text-sm leading-relaxed mb-6">
                Школа программирования для подростков 12–17 лет. Живые уроки, реальные проекты, преподаватели из Kaspi, Halyk, inDriver.
              </p>

              {/* Соцсети */}
              <div className="flex gap-2">
                <a href="https://wa.me/77001234567" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-surface/10 hover:bg-accent flex items-center justify-center transition-colors"
                  aria-label="WhatsApp">
                  <span className="text-lg">💬</span>
                </a>
                <a href="https://t.me/alfaz_school" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-surface/10 hover:bg-accent flex items-center justify-center transition-colors"
                  aria-label="Telegram">
                  <span className="text-lg">✈️</span>
                </a>
                <a href="https://instagram.com/alfaz.school" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-surface/10 hover:bg-accent flex items-center justify-center transition-colors"
                  aria-label="Instagram">
                  <span className="text-lg">📷</span>
                </a>
              </div>
            </div>

            {/* Колонка 2 — Курсы */}
            <div>
              <h4 className="font-display font-bold mb-4 text-surface">Курсы</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#courses" className="text-surface/60 hover:text-accent transition-colors">Мобильная разработка</a></li>
                <li><a href="#courses" className="text-surface/60 hover:text-accent transition-colors">Геймдев на Unity</a></li>
                <li><a href="#courses" className="text-surface/60 hover:text-accent transition-colors">Веб-разработка</a></li>
                <li><a href="#courses" className="text-surface/60 hover:text-accent transition-colors">Бэкенд на Python</a></li>
              </ul>
            </div>

            {/* Колонка 3 — Школа */}
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

            {/* Колонка 4 — Контакты */}
            <div>
              <h4 className="font-display font-bold mb-4 text-surface">Контакты</h4>
              <ul className="space-y-2.5 text-sm">
                <li className="text-surface/60">
                  📞{" "}
                  <a href="tel:+77001234567" className="hover:text-accent transition-colors">
                    +7 (700) 123-45-67
                  </a>
                </li>
                <li className="text-surface/60">
                  ✉️{" "}
                  <a href="mailto:hello@alfaz.kz" className="hover:text-accent transition-colors">
                    hello@alfaz.kz
                  </a>
                </li>
                <li className="text-surface/60 leading-relaxed">
                  📍 Алматы, Казахстан<br />
                  <span className="text-surface/40 text-xs">Онлайн-обучение по всей стране</span>
                </li>
                <li className="text-surface/60">
                  🕐 Пн–Сб, 10:00–19:00 *(UTC+5)*
                </li>
              </ul>
            </div>
          </div>

          {/* Разделитель */}
          <div className="h-px bg-surface/10 mb-8" />

          {/* Нижний блок: копирайт + юридическое */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-surface/50 text-sm">
              © 2026 Alfa Z. Все права защищены.
              <span className="hidden sm:inline"> · Сделано с 🧡 в Алматы</span>
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <a href="#" className="text-surface/50 hover:text-accent transition-colors">
                Публичная оферта
              </a>
              <a href="#" className="text-surface/50 hover:text-accent transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#" className="text-surface/50 hover:text-accent transition-colors">
                Условия использования
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}