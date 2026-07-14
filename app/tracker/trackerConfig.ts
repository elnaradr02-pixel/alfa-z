// ═══════════════════════════════════════════════════════════════
//  КОНФИГ ТРЕКЕРА CJM ALFA Z — курс, уроки, светофор
//  Путь клиента и шаблоны сообщений вынесены в journeyConfig.ts
// ═══════════════════════════════════════════════════════════════

export type Role = "student" | "parent";

// Кто выходит на связь / отвечает за касание
export type Owner = "МЗК" | "Team Lead менторов" | "Ментор" | "Руководитель";

// Канал касания
export type Channel = "message" | "call" | "both";

export interface Lesson {
  n: number;
  module: string;
  topic: string;
  hw1: string;
  hw2: string;
  parentResult: string;
  hasProject: boolean;
}

export interface CourseConfig {
  id: string;
  name: string;
  lessonsCount: number; // 48..52
  lessonsPerWeek: number; // 2
  modules: string[];
}

const SIX_MODULES = [
  "Основы и среда",
  "Базовые конструкции",
  "Работа с данными",
  "Логика и архитектура",
  "Командный проект",
  "Финальный продукт",
];

export const COURSES: CourseConfig[] = [
  { id: "web", name: "Веб-разработка", lessonsCount: 48, lessonsPerWeek: 2, modules: SIX_MODULES },
  { id: "backend", name: "Бэкенд-разработка", lessonsCount: 48, lessonsPerWeek: 2, modules: SIX_MODULES },
  { id: "mobile", name: "Мобильная разработка", lessonsCount: 48, lessonsPerWeek: 2, modules: SIX_MODULES },
  { id: "game", name: "Геймдев", lessonsCount: 48, lessonsPerWeek: 2, modules: SIX_MODULES },
];

export function buildLessons(course: CourseConfig): Lesson[] {
  const { lessonsCount, modules } = course;
  const perModule = Math.ceil(lessonsCount / modules.length);
  const lessons: Lesson[] = [];

  for (let n = 1; n <= lessonsCount; n++) {
    const moduleIndex = Math.min(Math.floor((n - 1) / perModule), modules.length - 1);
    const module = modules[moduleIndex];
    const isLastInModule =
      n === lessonsCount || Math.floor(n / perModule) !== Math.floor((n - 1) / perModule);

    lessons.push({
      n,
      module,
      topic: `Урок ${n}`,
      hw1: `Базовое задание к уроку ${n}`,
      hw2: `Продвинутое задание к уроку ${n}`,
      parentResult: `Ребёнок закрепил материал урока ${n}`,
      hasProject: isLastInModule,
    });
  }
  return lessons;
}

// ─────────────────────────────────────────────────────────────
//  ОТМЕТКИ УЧЕНИКА (по каждому уроку)
// ─────────────────────────────────────────────────────────────

export const STUDENT_CHECKS = [
  { id: "attended", label: "Был на занятии" },
  { id: "hw1", label: "Сдал ДЗ (Уровень 1)" },
  { id: "hw2", label: "Сдал ДЗ (Уровень 2)" },
  { id: "project", label: "Сделал проект этапа", projectOnly: true },
] as const;

export type StudentCheckId = (typeof STUDENT_CHECKS)[number]["id"];

// ─────────────────────────────────────────────────────────────
//  СВЕТОФОР УСПЕВАЕМОСТИ — РЕДАКТИРУЕМЫЕ ФАКТОРЫ
//  Чтобы добавить фактор: допишите объект сюда. `source` — какая
//  отметка урока считается, `critical` — ключевой фактор (если он
//  красный, общий итог сразу красный). `perProject` — считать только
//  по урокам с проектом.
// ─────────────────────────────────────────────────────────────

export interface TrafficFactorConfig {
  id: string;
  label: string;
  source: StudentCheckId;
  critical?: boolean;
  perProject?: boolean;
}

export const TRAFFIC_FACTORS: TrafficFactorConfig[] = [
  { id: "attendance", label: "Посещаемость", source: "attended", critical: true },
  { id: "homework", label: "Домашние задания", source: "hw1" },
  { id: "project", label: "Проект этапа", source: "project", perProject: true },
  { id: "activity", label: "Активность (ДЗ ур. 2)", source: "hw2", critical: true },
];

export const TRAFFIC_THRESHOLDS = {
  green: 0.85, // 🟢 ≥85%
  yellow: 0.6, // 🟡 60–84%, ниже — 🔴
};

// ─────────────────────────────────────────────────────────────
//  ЦВЕТА РОЛЕЙ (для бейджей «кто отвечает»)
// ─────────────────────────────────────────────────────────────

export const OWNER_COLORS: Record<Owner, string> = {
  "МЗК": "#FF6B47",
  "Ментор": "#39d6c0",
  "Team Lead менторов": "#c8f23a",
  "Руководитель": "#FFB088",
};
