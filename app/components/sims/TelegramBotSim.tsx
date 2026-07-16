"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/app/components/Icon";
import { useLang } from "@/app/i18n/lang";

/**
 * Интерактивный симулятор Telegram-бота для курса «Backend на Python».
 * Пользователь нажимает команды (/start, /joke, /help, /about), бот отвечает
 * простой if/else-логикой — та же логика показана в блоке «показать код».
 * Всё офлайн, без сети и внешних ассетов.
 */

type Msg = { id: number; from: "user" | "bot"; text: string };
type Command = "/start" | "/joke" | "/help" | "/about";

export default function TelegramBotSim() {
  const { tr } = useLang();

  const greeting = () =>
    tr(
      "Привет! Я бот курса Alfa Z. Напиши команду ниже 👇",
      "Сәлем! Мен Alfa Z курсының ботымын. Төмендегі команданы бас 👇",
      "Hi! I'm the Alfa Z course bot. Tap a command below 👇",
    );

  const jokes = () => [
    tr(
      "Почему программисты путают Хэллоуин и Рождество? Oct 31 == Dec 25.",
      "Неге программистер Хэллоуин мен Рождествоны шатастырады? Oct 31 == Dec 25.",
      "Why do programmers confuse Halloween and Christmas? Oct 31 == Dec 25.",
    ),
    tr(
      "Сколько программистов нужно, чтобы вкрутить лампочку? Ни одного — это аппаратная проблема.",
      "Шамды бұрау үшін неше программист керек? Бірде-бір — бұл hardware мәселесі.",
      "How many programmers to change a lightbulb? None — that's a hardware problem.",
    ),
    tr(
      "У программиста спросили про рост. Он ответил: 178 см и ни одного бага.",
      "Программистен бойын сұрады. Ол: 178 см және бірде-бір баг жоқ деді.",
      "Asked about his height, the programmer said: 178cm and zero bugs.",
    ),
    tr(
      "— Как дела? — 200 OK.",
      "— Қалайсың? — 200 OK.",
      "— How are you? — 200 OK.",
    ),
    tr(
      "Существует 10 типов людей: те, кто знает бинарный код, и те, кто нет.",
      "Адамдардың 10 түрі бар: екілік санды білетіндер және білмейтіндер.",
      "There are 10 kinds of people: those who know binary and those who don't.",
    ),
  ];

  const helpText = () =>
    tr(
      "Команды:\n/start — начать\n/joke — шутка\n/help — помощь\n/about — обо мне",
      "Командалар:\n/start — бастау\n/joke — әзіл\n/help — көмек\n/about — мен туралы",
      "Commands:\n/start — start\n/joke — a joke\n/help — help\n/about — about me",
    );

  const startText = () =>
    tr(
      "Погнали! 🚀 Жми /joke для шутки или /help для списка команд.",
      "Кеттік! 🚀 Әзіл үшін /joke, командалар үшін /help бас.",
      "Let's go! 🚀 Hit /joke for a laugh or /help for the command list.",
    );

  const aboutText = () =>
    tr(
      "Я бот, собранный на 3-м уроке курса Backend от Alfa Z. Всего ~10 строк Python 🐍",
      "Мен Alfa Z Backend курсының 3-ші сабағында жиналған ботпын. Небәрі ~10 жол Python 🐍",
      "I'm a bot built in lesson 3 of the Alfa Z backend course. Just ~10 lines of Python 🐍",
    );

  const initial = (): Msg[] => [{ id: 0, from: "bot", text: greeting() }];

  const [messages, setMessages] = useState<Msg[]>(initial);
  const [jokeIdx, setJokeIdx] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const idRef = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Отслеживаем таймеры «печатает…», чтобы почистить их при размонтировании.
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Автопрокрутка к последнему сообщению.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Очистка всех отложенных ответов бота при размонтировании.
  useEffect(() => {
    return () => {
      timers.current.forEach((t) => clearTimeout(t));
      timers.current = [];
    };
  }, []);

  function botReply(cmd: Command): string {
    // Та же if/else-логика, что и в блоке «показать код».
    if (cmd === "/start") return startText();
    else if (cmd === "/joke") {
      const list = jokes();
      // Чередуем шутки счётчиком + лёгкая примесь случайности в рантайме.
      const next = (jokeIdx + 1 + Math.floor(Math.random() * (list.length - 1))) % list.length;
      setJokeIdx(next);
      return list[next];
    } else if (cmd === "/help") return helpText();
    else if (cmd === "/about") return aboutText();
    return helpText();
  }

  function send(cmd: Command) {
    const userMsg: Msg = { id: idRef.current++, from: "user", text: cmd };
    const reply = botReply(cmd);
    setMessages((prev) => [...prev, userMsg]);
    // Небольшая задержка «печатает…» для живости.
    const t = setTimeout(() => {
      setMessages((prev) => [...prev, { id: idRef.current++, from: "bot", text: reply }]);
    }, 320);
    timers.current.push(t);
  }

  function reset() {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
    idRef.current = 1;
    setJokeIdx(0);
    setMessages(initial());
  }

  const commands: Command[] = ["/start", "/joke", "/help", "/about"];

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0F0F1A] shadow-xl">
      {/* Заголовок окна редактора */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white/[0.04] border-b border-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B47]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFB088]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFB088]" />
        <span className="ml-2.5 font-mono text-[11px] text-white/45">bot.py</span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex min-h-[360px] flex-col">
          {/* Шапка чата */}
          <div className="mb-3 flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Icon name="bot" className="h-4.5 w-4.5" width={18} height={18} />
            </span>
            <div className="leading-tight">
              <div className="font-mono text-[13px] text-white/80">Alfa Z Bot</div>
              <div className="font-mono text-[10px] text-[#FFB088]">
                {tr("онлайн", "онлайн", "online")}
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              className="ml-auto flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1 font-mono text-[11px] text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white/80 active:bg-white/10"
            >
              <Icon name="zap" width={12} height={12} />
              {tr("Сбросить", "Тазарту", "Reset")}
            </button>
          </div>

          {/* Область чата */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-2.5 overflow-y-auto rounded-lg bg-black/20 p-3"
            style={{ maxHeight: 260 }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.from === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    "max-w-[82%] whitespace-pre-line rounded-2xl px-3 py-2 text-[13px] leading-snug " +
                    (m.from === "user"
                      ? "rounded-br-sm bg-accent font-mono text-white"
                      : "rounded-bl-sm bg-white/[0.06] text-white/80")
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Кнопки команд */}
          <div className="mt-3 flex flex-wrap gap-2">
            {commands.map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => send(cmd)}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[12px] text-white/80 transition-colors hover:border-accent hover:bg-accent/10 hover:text-white active:bg-accent/20"
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Раскрывающийся код */}
          <button
            type="button"
            onClick={() => setShowCode((v) => !v)}
            className="mt-3 flex items-center gap-1.5 self-start font-mono text-[11px] text-white/45 transition-colors hover:text-white/80"
          >
            <Icon name="code" width={13} height={13} />
            {showCode
              ? tr("скрыть код", "кодты жасыру", "hide code")
              : tr("показать код", "кодты көрсету", "show code")}
          </button>

          {showCode && (
            <pre className="mt-2 overflow-x-auto rounded-lg border border-white/10 bg-black/30 p-3 font-mono text-[11px] leading-relaxed text-white/70">
{`def handle(cmd):
    if cmd == "/start":
        return "Погнали! 🚀"
    elif cmd == "/joke":
        return random.choice(JOKES)
    elif cmd == "/help":
        return "/start /joke /help /about"
    elif cmd == "/about":
        return "Бот с урока 3 Alfa Z 🐍"
    return "Не понял команду"`}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
