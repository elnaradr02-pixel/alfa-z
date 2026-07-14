"use client";

import { useCallback, useEffect, useState } from "react";
import {
  COURSES,
  CourseConfig,
  Lesson,
  StudentCheckId,
  TRAFFIC_FACTORS,
  TRAFFIC_THRESHOLDS,
} from "./trackerConfig";
import {
  buildJourney,
  CONTROL_POINTS,
  ControlPoint,
  JourneyStage,
  PHASE_ORDER,
  Phase,
} from "./journeyConfig";

// ═══════════════════════════════════════════════════════════════
//  СОСТОЯНИЕ (localStorage, на устройстве)
// ═══════════════════════════════════════════════════════════════

export interface LessonMarks {
  attended?: boolean;
  hw1?: boolean;
  hw2?: boolean;
  project?: boolean;
}

export interface StudentState {
  courseId: string;
  lessons: Record<number, LessonMarks>;
  parentFeedback: Record<number, boolean>; // обратная связь по уроку (роль «Родитель» в «Уроках»)
  journey: Record<string, boolean>; // выполненные этапы CJM-пути (по id)
}

export interface TrackerState {
  students: Record<string, StudentState>;
  activeStudent: string;
  role: "student" | "parent";
}

const STORAGE_KEY = "alfaz-tracker-v2";

function newStudent(courseId: string): StudentState {
  return { courseId, lessons: {}, parentFeedback: {}, journey: {} };
}

function defaultState(): TrackerState {
  return {
    students: { "Ученик": newStudent(COURSES[0].id) },
    activeStudent: "Ученик",
    role: "parent",
  };
}

export function useTrackerStore() {
  const [state, setState] = useState<TrackerState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as TrackerState;
        if (parsed?.students && Object.keys(parsed.students).length) setState(parsed);
      }
    } catch {
      /* битый стор — стартуем с дефолта */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* приватный режим / нет места */
    }
  }, [state, hydrated]);

  const student = state.students[state.activeStudent] ?? newStudent(COURSES[0].id);
  const course = COURSES.find((c) => c.id === student.courseId) ?? COURSES[0];

  const setRole = useCallback((role: "student" | "parent") => setState((s) => ({ ...s, role })), []);
  const setActiveStudent = useCallback(
    (name: string) => setState((s) => ({ ...s, activeStudent: name })),
    [],
  );

  const addStudent = useCallback((name: string, courseId: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((s) => ({
      ...s,
      students: s.students[trimmed] ? s.students : { ...s.students, [trimmed]: newStudent(courseId) },
      activeStudent: trimmed,
    }));
  }, []);

  const patchStudent = useCallback(
    (updater: (st: StudentState) => StudentState) =>
      setState((s) => {
        const cur = s.students[s.activeStudent];
        if (!cur) return s;
        return { ...s, students: { ...s.students, [s.activeStudent]: updater(cur) } };
      }),
    [],
  );

  const setCourse = useCallback(
    (courseId: string) => patchStudent((st) => ({ ...st, courseId })),
    [patchStudent],
  );

  const toggleLesson = useCallback(
    (n: number, key: StudentCheckId) =>
      patchStudent((st) => {
        const prev = st.lessons[n] ?? {};
        return { ...st, lessons: { ...st.lessons, [n]: { ...prev, [key]: !prev[key] } } };
      }),
    [patchStudent],
  );

  const toggleFeedback = useCallback(
    (n: number) =>
      patchStudent((st) => ({
        ...st,
        parentFeedback: { ...st.parentFeedback, [n]: !st.parentFeedback[n] },
      })),
    [patchStudent],
  );

  const toggleJourney = useCallback(
    (id: string) =>
      patchStudent((st) => ({ ...st, journey: { ...st.journey, [id]: !st.journey[id] } })),
    [patchStudent],
  );

  return {
    hydrated,
    state,
    student,
    course,
    setRole,
    setActiveStudent,
    addStudent,
    setCourse,
    toggleLesson,
    toggleFeedback,
    toggleJourney,
  };
}

// ═══════════════════════════════════════════════════════════════
//  ПЕРИОДЫ КУРСА
// ═══════════════════════════════════════════════════════════════

export const LESSONS_PER_MONTH = 8;

export function weeksCount(course: CourseConfig) {
  return Math.ceil(course.lessonsCount / course.lessonsPerWeek);
}
export function monthsCount(course: CourseConfig) {
  return Math.ceil(course.lessonsCount / LESSONS_PER_MONTH);
}
export function monthOfLesson(n: number) {
  return Math.ceil(n / LESSONS_PER_MONTH);
}

// ═══════════════════════════════════════════════════════════════
//  РАСЧЁТЫ — УЧЁБА
// ═══════════════════════════════════════════════════════════════

function pct(done: number, total: number) {
  return total > 0 ? done / total : 0;
}

export function lessonsAttended(st: StudentState) {
  return Object.values(st.lessons).filter((m) => m.attended).length;
}

export function progressLesson(st: StudentState) {
  let max = 0;
  for (const [k, m] of Object.entries(st.lessons)) {
    if (m.attended || m.hw1 || m.hw2 || m.project) max = Math.max(max, Number(k));
  }
  return max;
}

export function studentTrackPct(st: StudentState, lessons: Lesson[]) {
  let done = 0;
  let total = 0;
  for (const l of lessons) {
    const m = st.lessons[l.n] ?? {};
    total += 3;
    done += (m.attended ? 1 : 0) + (m.hw1 ? 1 : 0) + (m.hw2 ? 1 : 0);
    if (l.hasProject) {
      total += 1;
      done += m.project ? 1 : 0;
    }
  }
  return pct(done, total);
}

export function moduleProgress(st: StudentState, lessons: Lesson[], modules: string[]) {
  return modules.map((module) => {
    const inModule = lessons.filter((l) => l.module === module);
    let done = 0;
    let total = 0;
    for (const l of inModule) {
      const m = st.lessons[l.n] ?? {};
      total += 3;
      done += (m.attended ? 1 : 0) + (m.hw1 ? 1 : 0) + (m.hw2 ? 1 : 0);
      if (l.hasProject) {
        total += 1;
        done += m.project ? 1 : 0;
      }
    }
    return { module, pct: pct(done, total), lessons: inModule };
  });
}

// ─────────────────────────────────────────────────────────────
//  СВЕТОФОР (на редактируемых факторах TRAFFIC_FACTORS)
// ─────────────────────────────────────────────────────────────

export type Level = "green" | "yellow" | "red";

export function levelOf(value: number): Level {
  if (value >= TRAFFIC_THRESHOLDS.green) return "green";
  if (value >= TRAFFIC_THRESHOLDS.yellow) return "yellow";
  return "red";
}

export interface TrafficFactor {
  id: string;
  label: string;
  value: number | null; // null = неприменимо (нет проекта в месяце)
  level: Level | null;
  critical: boolean;
}

export interface TrafficResult {
  month: number;
  factors: TrafficFactor[];
  overall: Level;
  hasData: boolean;
}

export function trafficForMonth(st: StudentState, lessons: Lesson[], month: number): TrafficResult {
  const monthLessons = lessons.filter((l) => monthOfLesson(l.n) === month);

  const factors: TrafficFactor[] = TRAFFIC_FACTORS.map((f) => {
    const pool = f.perProject ? monthLessons.filter((l) => l.hasProject) : monthLessons;
    let done = 0;
    for (const l of pool) {
      const m = st.lessons[l.n] ?? {};
      if (m[f.source]) done++;
    }
    const value = pool.length ? pct(done, pool.length) : null;
    return {
      id: f.id,
      label: f.label,
      value,
      level: value === null ? null : levelOf(value),
      critical: !!f.critical,
    };
  });

  const reds = factors.filter((f) => f.level === "red").length;
  const yellows = factors.filter((f) => f.level === "yellow").length;
  const criticalRed = factors.some((f) => f.critical && f.level === "red");

  let overall: Level;
  if (criticalRed || reds >= 2) overall = "red";
  else if (reds === 1 || yellows >= 2) overall = "yellow";
  else overall = "green";

  const hasData = monthLessons.some((l) => {
    const m = st.lessons[l.n] ?? {};
    return m.attended || m.hw1 || m.hw2 || m.project;
  });

  return { month, factors, overall, hasData };
}

// ═══════════════════════════════════════════════════════════════
//  РАСЧЁТЫ — CJM-ПУТЬ
// ═══════════════════════════════════════════════════════════════

const JOURNEY = buildJourney();

export function getJourney(): JourneyStage[] {
  return JOURNEY;
}

// «Где мы сейчас» — самый дальний достигнутый месяц.
// Учёба двигает прогресс до 6-го месяца; дальше прогресс двигают
// отмеченные помесячные этапы (звонки/собрания идут и без уроков).
export function reachedMonth(st: StudentState): number {
  const fromLessons = monthOfLesson(progressLesson(st)); // 0, если ничего
  let fromJourney = 0;
  for (const stage of JOURNEY) {
    if (st.journey[stage.id] && stage.dueMonth > fromJourney) fromJourney = stage.dueMonth;
  }
  return Math.max(fromLessons, fromJourney);
}

// Сколько месяцев ПОЛНОСТЬЮ пройдено: по урокам (8 уроков = 1 месяц)
// либо по отмеченным помесячным этапам (для месяцев 7–12 без уроков).
export function monthsCompleted(st: StudentState): number {
  const fromLessons = Math.floor(progressLesson(st) / LESSONS_PER_MONTH);
  let fromJourney = 0;
  for (const stage of JOURNEY) {
    if (st.journey[stage.id] && stage.dueMonth > fromJourney) fromJourney = stage.dueMonth;
  }
  return Math.max(fromLessons, fromJourney);
}

export interface PhaseProgress {
  phase: Phase;
  stages: JourneyStage[];
  done: number;
  total: number;
  pct: number;
}

// % по каждой фазе (по всем этапам фазы, без привязки к «наступил»)
export function phaseProgress(st: StudentState): PhaseProgress[] {
  return PHASE_ORDER.map((phase) => {
    const stages = JOURNEY.filter((s) => s.phase === phase);
    const done = stages.filter((s) => st.journey[s.id]).length;
    return { phase, stages, done, total: stages.length, pct: pct(done, stages.length) };
  });
}

// % по всему пути
export function pathProgress(st: StudentState) {
  const done = JOURNEY.filter((s) => st.journey[s.id]).length;
  return { done, total: JOURNEY.length, pct: pct(done, JOURNEY.length) };
}

export interface PendingStage {
  title: string;
  contact: string;
  responsible: string;
}

export interface ControlStatus {
  point: ControlPoint;
  ready: boolean;
  done: number;
  required: number;
  pending: PendingStage[];
}

// Какие обязательные этапы должны быть закрыты к контрольной точке
function requiredFor(point: ControlPoint): JourneyStage[] {
  const dueMonthLimit =
    point.kind === "month" ? point.at : monthOfLesson(point.at) - 1; // на 7-м занятии месяц 1 ещё не закрыт
  return JOURNEY.filter(
    (s) => s.mandatory && (s.dueMonth === 0 || s.dueMonth <= dueMonthLimit),
  );
}

function pointReached(point: ControlPoint, st: StudentState): boolean {
  if (point.kind === "lesson") return progressLesson(st) >= point.at;
  return monthsCompleted(st) >= point.at; // месяц засчитан только когда полностью пройден
}

export function controlStatusFor(point: ControlPoint, st: StudentState): ControlStatus {
  const required = requiredFor(point);
  const pending: PendingStage[] = [];
  let done = 0;
  for (const s of required) {
    if (st.journey[s.id]) done++;
    else pending.push({ title: s.title, contact: s.contact, responsible: s.responsible });
  }
  return { point, ready: pending.length === 0, done, required: required.length, pending };
}

// Самая поздняя достигнутая контрольная точка — её и показываем как «текущую»
export function currentControlPoint(st: StudentState): ControlStatus | null {
  let latest: ControlPoint | null = null;
  for (const p of CONTROL_POINTS) {
    if (pointReached(p, st)) latest = p;
  }
  if (!latest) return null;
  return controlStatusFor(latest, st);
}

export interface ReadinessResult {
  control: ControlStatus | null;
  successRed: boolean;
  ready: boolean; // всё закрыто И успеваемость не в красной зоне
}

export function readiness(st: StudentState, lessons: Lesson[]): ReadinessResult {
  const control = currentControlPoint(st);
  const reached = reachedMonth(st);
  const lessonMonths = Math.ceil(lessons.length / LESSONS_PER_MONTH);

  let successRed = false;
  for (let mo = Math.min(reached, lessonMonths); mo >= 1; mo--) {
    const t = trafficForMonth(st, lessons, mo);
    if (t.hasData) {
      successRed = t.overall === "red";
      break;
    }
  }

  const ready = !!control && control.ready && !successRed;
  return { control, successRed, ready };
}
