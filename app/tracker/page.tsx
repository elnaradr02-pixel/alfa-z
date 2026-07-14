"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  COURSES,
  OWNER_COLORS,
  STUDENT_CHECKS,
  buildLessons,
} from "./trackerConfig";
import {
  CHANNEL_LABEL,
  DEFAULT_CONTEXT,
  JourneyStage,
  PHASE_ORDER,
  REGULAR_PROCESSES,
  RegularProcess,
  fillTemplate,
} from "./journeyConfig";
import {
  ControlStatus,
  Level,
  getJourney,
  lessonsAttended,
  moduleProgress,
  monthOfLesson,
  monthsCount,
  pathProgress,
  phaseProgress,
  progressLesson,
  readiness,
  studentTrackPct,
  trafficForMonth,
  useTrackerStore,
} from "./store";

const LEVEL_COLOR: Record<Level, string> = {
  green: "#39d6c0",
  yellow: "#FFB088",
  red: "#FF6B47",
};
const LEVEL_DOT: Record<Level, string> = { green: "🟢", yellow: "🟡", red: "🔴" };
const LEVEL_WORD: Record<Level, string> = {
  green: "Всё хорошо",
  yellow: "Стоит обратить внимание",
  red: "Нужно вмешаться",
};

const pctText = (v: number) => `${Math.round(v * 100)}%`;

type Tab = "dashboard" | "journey" | "lessons" | "processes";

type Store = ReturnType<typeof useTrackerStore>;

export default function TrackerPage() {
  const store = useTrackerStore();
  const [tab, setTab] = useState<Tab>("dashboard");

  if (!store.hydrated) {
    return (
      <main className="min-h-screen grid place-items-center bg-background text-foreground">
        <div className="animate-soft-pulse text-accent">Загрузка трекера…</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      <Header store={store} />
      <div className="max-w-2xl mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {tab === "dashboard" && <Dashboard store={store} goTo={setTab} />}
            {tab === "journey" && <Journey store={store} />}
            {tab === "lessons" && <Lessons store={store} />}
            {tab === "processes" && <Processes store={store} />}
          </motion.div>
        </AnimatePresence>
      </div>
      <TabBar tab={tab} setTab={setTab} />
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
//  ШАПКА
// ─────────────────────────────────────────────────────────────

function Header({ store }: { store: Store }) {
  const { state, course, setRole, setActiveStudent, addStudent } = store;
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const names = Object.keys(state.students);

  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-background/85 border-b border-border">
      <div className="max-w-2xl mx-auto px-4 py-3 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <span className="font-[family-name:var(--font-display)] font-extrabold text-lg tracking-tight">
            Трекер <span className="text-accent">Alfa Z</span>
          </span>
          <select
            value={state.activeStudent}
            onChange={(e) => {
              if (e.target.value === "__add") setAdding(true);
              else setActiveStudent(e.target.value);
            }}
            className="bg-surface border border-border rounded-xl px-3 py-1.5 text-sm font-medium outline-none focus:border-accent"
          >
            {names.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
            <option value="__add">+ Добавить ученика</option>
          </select>
        </div>

        {adding && (
          <div className="flex gap-2">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Имя ученика"
              className="flex-1 bg-surface border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <button
              onClick={() => {
                addStudent(name, course.id);
                setName("");
                setAdding(false);
              }}
              className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold"
            >
              Добавить
            </button>
            <button
              onClick={() => {
                setName("");
                setAdding(false);
              }}
              className="px-3 py-2 rounded-xl border border-border text-sm"
            >
              Отмена
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-muted">
          {(["student", "parent"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`py-2 rounded-xl text-sm font-semibold transition-colors ${
                state.role === r ? "bg-surface text-accent shadow-sm" : "text-foreground/60"
              }`}
            >
              {r === "student" ? "Ученик" : "Родитель"}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
//  ДАШБОРД
// ─────────────────────────────────────────────────────────────

function Dashboard({ store, goTo }: { store: Store; goTo: (t: Tab) => void }) {
  const { student, course, setCourse } = store;
  const lessons = useMemo(() => buildLessons(course), [course]);

  const attended = lessonsAttended(student);
  const reached = progressLesson(student);
  const trackPct = studentTrackPct(student, lessons);
  const totalMonths = monthsCount(course);

  const reachedMonth = reached ? monthOfLesson(reached) : 1;
  const [month, setMonth] = useState(reachedMonth);
  const safeMonth = Math.min(month, totalMonths);
  const traffic = trafficForMonth(student, lessons, safeMonth);

  const path = pathProgress(student);
  const ready = readiness(student, lessons);

  return (
    <div className="py-5 flex flex-col gap-4">
      <section className="rounded-3xl bg-surface border border-border p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <div className="text-2xl font-[family-name:var(--font-display)] font-extrabold">
              {store.state.activeStudent}
            </div>
            <select
              value={course.id}
              onChange={(e) => setCourse(e.target.value)}
              className="mt-1 bg-transparent text-accent font-semibold text-sm outline-none"
            >
              {COURSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="text-right">
            <div className="text-3xl font-extrabold">{pctText(trackPct)}</div>
            <div className="text-xs text-foreground/50">учёба</div>
          </div>
        </div>
        <ProgressBar value={attended / course.lessonsCount} />
        <div className="mt-2 text-sm text-foreground/60">
          Пройдено <b className="text-foreground">{attended}</b> из {course.lessonsCount} уроков
        </div>
      </section>

      {/* Готовность к продлению — контрольная точка */}
      <section className="rounded-3xl bg-surface border border-border p-5">
        <h2 className="font-bold mb-4">Готовность к продлению</h2>
        <RenewalBlock control={ready.control} successRed={ready.successRed} ready={ready.ready} />
        {ready.control && ready.control.pending.length > 0 && (
          <button onClick={() => goTo("journey")} className="mt-3 text-sm font-semibold text-accent">
            Открыть путь клиента →
          </button>
        )}
      </section>

      {/* Прогресс по всему пути */}
      <section className="rounded-3xl bg-surface border border-border p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold">Путь клиента</h2>
          <span className="text-sm text-foreground/50">
            {path.done} из {path.total} касаний
          </span>
        </div>
        <ProgressBar value={path.pct} />
        <div className="mt-3 grid grid-cols-2 gap-2">
          {phaseProgress(student).map((p) => (
            <div key={p.phase} className="rounded-2xl bg-muted px-3 py-2.5">
              <div className="text-xs text-foreground/60">{p.phase}</div>
              <div className="font-semibold">
                {pctText(p.pct)} <span className="text-foreground/40 text-xs">· {p.done}/{p.total}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Светофор */}
      <section className="rounded-3xl bg-surface border border-border p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold">Успеваемость за месяц</h2>
          <select
            value={safeMonth}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-muted rounded-lg px-2 py-1 text-sm outline-none"
          >
            {Array.from({ length: totalMonths }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                Месяц {m}
              </option>
            ))}
          </select>
        </div>
        {traffic.hasData ? (
          <>
            <div
              className="flex items-center gap-2 mb-4 text-lg font-bold"
              style={{ color: LEVEL_COLOR[traffic.overall] }}
            >
              <span>{LEVEL_DOT[traffic.overall]}</span>
              {LEVEL_WORD[traffic.overall]}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {traffic.factors.map((f) => (
                <div key={f.id} className="rounded-2xl bg-muted px-3 py-2.5">
                  <div className="text-xs text-foreground/60">{f.label}</div>
                  {f.level === null ? (
                    <div className="text-sm text-foreground/40">—</div>
                  ) : (
                    <div className="flex items-center gap-1.5 font-semibold">
                      <span>{LEVEL_DOT[f.level]}</span>
                      <span>{pctText(f.value ?? 0)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-foreground/50">
            За этот месяц пока нет отметок. Отмечайте уроки во вкладке «Уроки».
          </p>
        )}
      </section>
    </div>
  );
}

function RenewalBlock({
  control,
  successRed,
  ready,
}: {
  control: ControlStatus | null;
  successRed: boolean;
  ready: boolean;
}) {
  if (!control) {
    return <p className="text-sm text-foreground/50">Курс ещё не начался — отметьте первое касание или урок.</p>;
  }
  const value = control.required ? control.done / control.required : 0;
  return (
    <>
      <div className="flex items-center gap-5">
        <Ring value={value} color={ready ? LEVEL_COLOR.green : LEVEL_COLOR.yellow} />
        <div className="flex-1">
          <div className="text-xs text-foreground/50">Контрольная точка: {control.point.label}</div>
          <div className="font-semibold">
            {ready ? "Готов к продлению" : "Не готов — школа закрыла не всё"}
          </div>
          <div className="text-sm text-foreground/60 mt-1">
            Закрыто {control.done} из {control.required} обязательных касаний
            {successRed && " · успеваемость в красной зоне"}
          </div>
        </div>
      </div>
      {control.pending.length > 0 && (
        <div className="mt-4 rounded-2xl bg-muted p-4">
          <div className="text-sm font-semibold mb-2">Школа ещё не закрыла:</div>
          <ul className="flex flex-col gap-1.5">
            {control.pending.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-accent mt-0.5">•</span>
                <span className="flex-1">{p.title}</span>
                <OwnerBadge owner={p.responsible} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
//  ПУТЬ КЛИЕНТА (CJM)
// ─────────────────────────────────────────────────────────────

function Journey({ store }: { store: Store }) {
  const { student, course, toggleJourney } = store;
  const journey = useMemo(() => getJourney(), []);
  const phases = phaseProgress(student);

  const ctx = useMemo(
    () => ({ ...DEFAULT_CONTEXT, студент: store.state.activeStudent, курс: course.name }),
    [store.state.activeStudent, course.name],
  );

  // группируем этапы фазы по периоду (для помесячного — по месяцам)
  return (
    <div className="py-5 flex flex-col gap-6">
      <p className="text-sm text-foreground/60">
        Весь путь от оплаты до 12-го месяца. На каждом этапе видно: кто выходит на связь, ответственный,
        канал и готовый текст сообщения. Отмечайте выполненное — галочки копятся к продлению.
      </p>

      {PHASE_ORDER.map((phase) => {
        const pp = phases.find((p) => p.phase === phase)!;
        const stages = journey.filter((s) => s.phase === phase);
        const periods = [...new Set(stages.map((s) => s.period))];
        return (
          <section key={phase} className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-[family-name:var(--font-display)] font-bold">{phase}</h2>
              <span className="text-sm text-foreground/50">
                {pctText(pp.pct)} · {pp.done}/{pp.total}
              </span>
            </div>
            {periods.map((period) => (
              <div key={period} className="flex flex-col gap-2">
                <div className="text-xs uppercase tracking-wide text-foreground/40 px-1">{period}</div>
                {stages
                  .filter((s) => s.period === period)
                  .map((s) => (
                    <StageCard
                      key={s.id}
                      stage={s}
                      done={!!student.journey[s.id]}
                      onToggle={() => toggleJourney(s.id)}
                      ctx={{ ...ctx, месяц: s.period }}
                    />
                  ))}
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}

function StageCard({
  stage,
  done,
  onToggle,
  ctx,
}: {
  stage: JourneyStage;
  done: boolean;
  onToggle: () => void;
  ctx: Record<string, string>;
}) {
  return (
    <div className={`rounded-3xl border p-4 transition-colors ${done ? "bg-surface border-accent/40" : "bg-surface border-border"}`}>
      <button onClick={onToggle} className="w-full flex items-start gap-3 text-left">
        <Checkbox checked={done} />
        <span className="flex-1">
          <span className={`font-semibold ${done ? "text-foreground" : "text-foreground/85"}`}>
            {stage.title}
          </span>
        </span>
      </button>

      <div className="mt-3 flex flex-wrap items-center gap-2 pl-9">
        <ChannelBadge channel={stage.channel} />
        <span className="text-xs text-foreground/45">связь:</span>
        <OwnerBadge owner={stage.contact} />
        <span className="text-xs text-foreground/45">ответственный:</span>
        <OwnerBadge owner={stage.responsible} />
      </div>

      {stage.channel === "call" && !stage.template && (
        <div className="mt-3 ml-9 rounded-2xl bg-muted px-4 py-3 text-sm text-foreground/70">
          📞 Здесь нужен звонок, а не сообщение.
        </div>
      )}

      {stage.template && <TemplateBox template={stage.template} ctx={ctx} call={stage.channel === "both"} />}
    </div>
  );
}

function TemplateBox({
  template,
  ctx,
  call,
}: {
  template: string;
  ctx: Record<string, string>;
  call?: boolean;
}) {
  const text = useMemo(() => fillTemplate(template, ctx), [template, ctx]);
  return (
    <div className="mt-3 ml-9 rounded-2xl bg-muted p-3">
      {call && (
        <div className="text-xs text-foreground/60 mb-2">📞 + назначить встречу. Текст приглашения:</div>
      )}
      <p className="text-sm text-foreground/80 whitespace-pre-wrap">{text}</p>
      <CopyButton text={text} />
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard недоступен */
        }
      }}
      className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
    >
      {copied ? "✓ Скопировано" : "⧉ Копировать текст"}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
//  УРОКИ
// ─────────────────────────────────────────────────────────────

function Lessons({ store }: { store: Store }) {
  const { student, course, toggleLesson, toggleFeedback, state } = store;
  const lessons = useMemo(() => buildLessons(course), [course]);
  const mods = useMemo(() => moduleProgress(student, lessons, course.modules), [student, lessons, course]);
  const isParent = state.role === "parent";

  return (
    <div className="py-5 flex flex-col gap-5">
      <div className="text-sm text-foreground/60">
        {isParent
          ? "Отмечайте, по каким урокам вы получили обратную связь от ментора."
          : "Отмечайте свою учёбу: посещение, домашние задания и проекты."}
      </div>

      {mods.map(({ module, pct: mp, lessons: inModule }) => (
        <section key={module} className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-[family-name:var(--font-display)] font-bold">{module}</h2>
            <span className="text-sm text-foreground/50">{pctText(mp)}</span>
          </div>
          {inModule.map((l) => {
            const marks = student.lessons[l.n] ?? {};
            return (
              <div key={l.n} className="rounded-3xl bg-surface border border-border p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">{l.topic}</span>
                  {l.hasProject && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-foreground/70">
                      🛠 проект этапа
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground/55 mb-3">{l.parentResult}</p>
                {isParent ? (
                  <CheckRow
                    checked={!!student.parentFeedback[l.n]}
                    onToggle={() => toggleFeedback(l.n)}
                    label="Получил обратную связь после урока"
                    owner="Ментор"
                  />
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {STUDENT_CHECKS.map((c) => {
                      if ("projectOnly" in c && c.projectOnly && !l.hasProject) return null;
                      const hint = c.id === "hw1" ? l.hw1 : c.id === "hw2" ? l.hw2 : undefined;
                      return (
                        <CheckRow
                          key={c.id}
                          checked={!!marks[c.id as keyof typeof marks]}
                          onToggle={() => toggleLesson(l.n, c.id)}
                          label={c.label}
                          hint={hint}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  ПРОЦЕССЫ — 3 роли: проводит / исполняет / контролирует
// ─────────────────────────────────────────────────────────────

function Processes({ store }: { store: Store }) {
  const { course } = store;
  const ctx = useMemo(
    () => ({ ...DEFAULT_CONTEXT, студент: store.state.activeStudent, курс: course.name, месяц: "этого месяца" }),
    [store.state.activeStudent, course.name],
  );
  return (
    <div className="py-5 flex flex-col gap-5">
      <p className="text-sm text-foreground/60">
        Регулярные процессы школы и кто за них отвечает в трёх ролях.
      </p>
      {REGULAR_PROCESSES.map((p) => (
        <ProcessCard key={p.id} process={p} ctx={ctx} />
      ))}
    </div>
  );
}

function ProcessCard({ process, ctx }: { process: RegularProcess; ctx: Record<string, string> }) {
  return (
    <section className="rounded-3xl bg-surface border border-border p-5 flex flex-col gap-4">
      <div>
        <h2 className="font-[family-name:var(--font-display)] font-bold">{process.title}</h2>
        <div className="text-sm text-foreground/55 mt-0.5">{process.cadence}</div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <RoleCell role="Проводит" owner={process.conducts} />
        <RoleCell role="Исполняет" owner={process.executes} />
        <RoleCell role="Контролирует" owner={process.controls} />
      </div>
      {process.template && <TemplateBox template={process.template} ctx={ctx} call={process.channel === "both"} />}
    </section>
  );
}

function RoleCell({ role, owner }: { role: string; owner: string }) {
  return (
    <div className="rounded-2xl bg-muted px-3 py-2.5 flex flex-col gap-1.5">
      <span className="text-[11px] uppercase tracking-wide text-foreground/45">{role}</span>
      <OwnerBadge owner={owner} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  ОБЩИЕ ЭЛЕМЕНТЫ
// ─────────────────────────────────────────────────────────────

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`mt-0.5 shrink-0 w-6 h-6 rounded-lg border-2 grid place-items-center transition-colors ${
        checked ? "bg-accent border-accent text-white" : "border-border"
      }`}
    >
      {checked && (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </span>
  );
}

function CheckRow({
  checked,
  onToggle,
  label,
  hint,
  owner,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  hint?: string;
  owner?: string;
}) {
  return (
    <button onClick={onToggle} className="w-full flex items-start gap-3 text-left py-1.5 group">
      <span
        className={`mt-0.5 shrink-0 w-6 h-6 rounded-lg border-2 grid place-items-center transition-colors ${
          checked ? "bg-accent border-accent text-white" : "border-border group-hover:border-accent"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      <span className="flex-1">
        <span className={`font-medium ${checked ? "text-foreground" : "text-foreground/80"}`}>{label}</span>
        {hint && <span className="block text-xs text-foreground/45 mt-0.5">{hint}</span>}
      </span>
      {owner && <OwnerBadge owner={owner} />}
    </button>
  );
}

function OwnerBadge({ owner }: { owner: string }) {
  const color = OWNER_COLORS[owner as keyof typeof OWNER_COLORS] ?? "#999";
  return (
    <span
      className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full"
      style={{ color, backgroundColor: `${color}1f` }}
    >
      {owner}
    </span>
  );
}

function ChannelBadge({ channel }: { channel: "message" | "call" | "both" }) {
  const icon = channel === "call" ? "📞" : channel === "both" ? "📞💬" : "💬";
  return (
    <span className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-foreground/8 text-foreground/70">
      {icon} {CHANNEL_LABEL[channel]}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2.5 rounded-full bg-muted overflow-hidden">
      <motion.div
        className="h-full rounded-full bg-accent"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, value * 100)}%` }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

function Ring({ value, color }: { value: number; color: string }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(1, value));
  return (
    <div className="relative w-[88px] h-[88px] shrink-0">
      <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
        <circle cx="44" cy="44" r={r} fill="none" stroke="var(--muted)" strokeWidth="8" />
        <motion.circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center font-extrabold text-lg">{pctText(value)}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  НИЖНЯЯ НАВИГАЦИЯ
// ─────────────────────────────────────────────────────────────

function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Дашборд", icon: "◎" },
    { id: "journey", label: "Путь", icon: "↳" },
    { id: "lessons", label: "Уроки", icon: "☰" },
    { id: "processes", label: "Процессы", icon: "⟳" },
  ];
  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 border-t border-border bg-background/90 backdrop-blur-md">
      <div className="max-w-2xl mx-auto grid grid-cols-4">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`py-3 flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${
                active ? "text-accent" : "text-foreground/50"
              }`}
            >
              <span className="text-base leading-none">{t.icon}</span>
              {t.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
