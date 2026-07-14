// ═══════════════════════════════════════════════════════════════
//  CJM ALFA Z — ПУТЬ КЛИЕНТА ОТ ПЕРВОЙ ОПЛАТЫ ДО 12-ГО МЕСЯЦА
//
//  Здесь — каждый этап пути отдельной записью. Для этапа явно задано:
//   • contact      — кто выходит на связь
//   • responsible  — кто ответственный за результат
//   • channel      — сообщение / звонок / и то и другое
//   • template     — готовый текст сообщения с плейсхолдерами (копируется)
//
//  Всё редактируется здесь: тексты, ответственные, каналы, новые этапы.
//  Плейсхолдеры в шаблонах: {{студент}} {{родитель}} {{курс}} {{ментор}}
//  {{мзк}} {{discord}} {{месяц}}. Заполняются автоматически при копировании.
// ═══════════════════════════════════════════════════════════════

import { Channel, Owner } from "./trackerConfig";

export const PHASES = {
  onboarding: "Оплата и онбординг",
  start: "Старт занятий",
  firstWeeks: "Первые недели",
  monthly: "Помесячное сопровождение",
} as const;

export type Phase = (typeof PHASES)[keyof typeof PHASES];

export interface JourneyStage {
  id: string; // уникальный id экземпляра
  phase: Phase;
  period: string; // человекочитаемый период
  title: string;
  contact: Owner; // кто выходит на связь
  responsible: Owner; // кто ответственный
  channel: Channel;
  template?: string; // шаблон сообщения (для message/both)
  mandatory: boolean; // влияет ли на готовность к продлению
  dueMonth: number; // 0 = старт (онбординг/первые недели), иначе 1..12
}

// ─────────────────────────────────────────────────────────────
//  ШАБЛОНЫ СООБЩЕНИЙ (черновики — замените на ваши готовые тексты)
// ─────────────────────────────────────────────────────────────

const T = {
  welcome:
    "Здравствуйте, {{родитель}}! 🎉 Спасибо, что выбрали Alfa Z. Оплата по курсу «{{курс}}» получена. " +
    "В ближайшее время с вами свяжется наш менеджер, а пока добавляйтесь в наш Discord: {{discord}}. " +
    "Рады видеть {{студент}} в команде!",
  startInfo:
    "{{родитель}}, занятия по курсу «{{курс}}» стартуют по расписанию. Все материалы и созвоны — в Discord: {{discord}}. " +
    "Если возникнут вопросы по организации — пишите, я на связи. — {{мзк}}",
  assignMentor:
    "Здравствуйте! Меня зовут {{ментор}}, я буду ментором {{студент}} на курсе «{{курс}}». " +
    "Буду регулярно делиться, как идут дела, и отвечать на ваши вопросы.",
  syllabus:
    "{{родитель}}, прикладываю план курса «{{курс}}»: что и в каком порядке изучаем, какие проекты соберёт {{студент}}. " +
    "Сохраните, чтобы сверяться с прогрессом.",
  mentorIntro:
    "{{студент}}, привет! Я {{ментор}}, твой ментор. Если что-то непонятно на уроке или в ДЗ — сразу пиши мне, разберёмся вместе 🚀",
  feedbackParentFirst:
    "{{родитель}}, прошли первые два занятия. {{студент}} включается в работу, вот первые впечатления: … " +
    "Дальше буду присылать обратную связь регулярно.",
  feedbackChildFirst:
    "{{студент}}, отличный старт! Что получилось хорошо: … На что обратим внимание дальше: … Так держать 💪",
  monthlyReport:
    "{{родитель}}, отчёт за {{месяц}} по курсу «{{курс}}»: посещаемость …, домашние задания …, проект …. " +
    "Общий итог месяца: 🟢/🟡/🔴. Подробности — в Discord.",
  meetingInvite:
    "{{родитель}}, приглашаем на ежемесячное родительское собрание ({{месяц}}). Обсудим итоги месяца и планы. " +
    "Ссылка и время — в Discord: {{discord}}.",
  renewalOffer:
    "{{родитель}}, {{студент}} проходит курс «{{курс}}» уже почти год — отличный результат! " +
    "Подготовили условия по продлению на следующий уровень. Давайте созвонимся и обсудим, что дальше.",
} as const;

// ─────────────────────────────────────────────────────────────
//  ЭТАПЫ ДО ПОМЕСЯЧНОГО СОПРОВОЖДЕНИЯ
// ─────────────────────────────────────────────────────────────

const FRONT_STAGES: JourneyStage[] = [
  {
    id: "welcome",
    phase: PHASES.onboarding,
    period: "Сразу после оплаты",
    title: "Приветственное сообщение после оплаты",
    contact: "МЗК",
    responsible: "МЗК",
    channel: "message",
    template: T.welcome,
    mandatory: true,
    dueMonth: 0,
  },
  {
    id: "welcomeCall",
    phase: PHASES.onboarding,
    period: "Сразу после оплаты",
    title: "Приветственный звонок (знакомство)",
    contact: "МЗК",
    responsible: "МЗК",
    channel: "call",
    mandatory: true,
    dueMonth: 0,
  },
  {
    id: "assignMentor",
    phase: PHASES.start,
    period: "Старт занятий",
    title: "Назначен ментор, ментор представился родителю",
    contact: "Team Lead менторов",
    responsible: "Team Lead менторов",
    channel: "message",
    template: T.assignMentor,
    mandatory: true,
    dueMonth: 0,
  },
  {
    id: "startInfo",
    phase: PHASES.start,
    period: "Старт занятий",
    title: "Орг-сообщение: расписание, Discord, ссылки",
    contact: "МЗК",
    responsible: "Team Lead менторов",
    channel: "message",
    template: T.startInfo,
    mandatory: true,
    dueMonth: 0,
  },
  {
    id: "syllabus",
    phase: PHASES.start,
    period: "Старт занятий",
    title: "Родитель получил план курса / силлабус",
    contact: "Ментор",
    responsible: "Ментор",
    channel: "message",
    template: T.syllabus,
    mandatory: true,
    dueMonth: 0,
  },
  {
    id: "mentorIntro",
    phase: PHASES.start,
    period: "Старт занятий",
    title: "Ментор познакомился с ребёнком",
    contact: "Ментор",
    responsible: "Ментор",
    channel: "message",
    template: T.mentorIntro,
    mandatory: true,
    dueMonth: 0,
  },
  {
    id: "feedbackParentFirst",
    phase: PHASES.firstWeeks,
    period: "После 2 занятий",
    title: "Первая обратная связь родителю",
    contact: "Ментор",
    responsible: "Ментор",
    channel: "message",
    template: T.feedbackParentFirst,
    mandatory: true,
    dueMonth: 0,
  },
  {
    id: "feedbackChildFirst",
    phase: PHASES.firstWeeks,
    period: "После 2 занятий",
    title: "Первая обратная связь ребёнку",
    contact: "Ментор",
    responsible: "Ментор",
    channel: "message",
    template: T.feedbackChildFirst,
    mandatory: true,
    dueMonth: 0,
  },
];

// ─────────────────────────────────────────────────────────────
//  ПОМЕСЯЧНОЕ СОПРОВОЖДЕНИЕ (месяцы 1..12)
// ─────────────────────────────────────────────────────────────

export const JOURNEY_MONTHS = 12;
const QUARTERLY_MONTHS = [1, 4, 7, 10]; // сверка ожиданий: 1-й месяц + раз в квартал

function monthStages(m: number): JourneyStage[] {
  const period = `Месяц ${m}`;
  const stages: JourneyStage[] = [
    {
      id: `report:m${m}`,
      phase: PHASES.monthly,
      period,
      title: "Отчёт по успеваемости за месяц",
      contact: "Ментор",
      responsible: "Ментор",
      channel: "message",
      template: T.monthlyReport,
      mandatory: true,
      dueMonth: m,
    },
    {
      id: `meeting:m${m}`,
      phase: PHASES.monthly,
      period,
      title: "Ежемесячное собрание с родителями",
      contact: "Team Lead менторов",
      responsible: "Team Lead менторов",
      channel: "both",
      template: T.meetingInvite,
      mandatory: true,
      dueMonth: m,
    },
  ];

  if (QUARTERLY_MONTHS.includes(m)) {
    stages.push({
      id: `expect:m${m}`,
      phase: PHASES.monthly,
      period,
      title: m === 1 ? "Сверка ожиданий (1-й месяц)" : "Сверка ожиданий (квартал)",
      contact: "МЗК",
      responsible: "МЗК",
      channel: "call",
      mandatory: true,
      dueMonth: m,
    });
  }

  if (m === 11) {
    stages.push({
      id: "renewalOffer",
      phase: PHASES.monthly,
      period,
      title: "Предложение о продлении",
      contact: "МЗК",
      responsible: "Руководитель",
      channel: "message",
      template: T.renewalOffer,
      mandatory: true,
      dueMonth: 11,
    });
  }
  if (m === 12) {
    stages.push({
      id: "renewalDecision",
      phase: PHASES.monthly,
      period,
      title: "Итоговая встреча и решение о продлении",
      contact: "Руководитель",
      responsible: "Руководитель",
      channel: "call",
      mandatory: true,
      dueMonth: 12,
    });
  }
  return stages;
}

// Полный путь — фиксированный список экземпляров этапов по порядку
export function buildJourney(): JourneyStage[] {
  const monthly: JourneyStage[] = [];
  for (let m = 1; m <= JOURNEY_MONTHS; m++) monthly.push(...monthStages(m));
  return [...FRONT_STAGES, ...monthly];
}

// Порядок фаз для группировки в UI
export const PHASE_ORDER: Phase[] = [
  PHASES.onboarding,
  PHASES.start,
  PHASES.firstWeeks,
  PHASES.monthly,
];

// ─────────────────────────────────────────────────────────────
//  КОНТРОЛЬНЫЕ ТОЧКИ — где проверяем, всё ли школа дала клиенту
// ─────────────────────────────────────────────────────────────

export interface ControlPoint {
  id: string;
  label: string;
  kind: "lesson" | "month";
  at: number; // номер урока или месяца
}

export const CONTROL_POINTS: ControlPoint[] = [
  { id: "l7", label: "7-е занятие", kind: "lesson", at: 7 },
  ...Array.from({ length: JOURNEY_MONTHS }, (_, i) => ({
    id: `m${i + 1}`,
    label: `Конец месяца ${i + 1}`,
    kind: "month" as const,
    at: i + 1,
  })),
];

// ─────────────────────────────────────────────────────────────
//  РЕГУЛЯРНЫЕ ПРОЦЕССЫ В ТРЁХ РОЛЯХ: проводит / исполняет / контролирует
// ─────────────────────────────────────────────────────────────

export interface RegularProcess {
  id: string;
  title: string;
  cadence: string;
  conducts: Owner; // проводит
  executes: Owner; // исполняет
  controls: Owner; // контролирует
  channel: Channel;
  template?: string;
}

export const REGULAR_PROCESSES: RegularProcess[] = [
  {
    id: "weeklyFeedback",
    title: "Еженедельная обратная связь по курсу и успеваемости",
    cadence: "Еженедельно (после занятий недели)",
    conducts: "Ментор",
    executes: "Ментор",
    controls: "Team Lead менторов",
    channel: "message",
    template: T.monthlyReport,
  },
  {
    id: "monthlyMeeting",
    title: "Ежемесячное собрание с родителями",
    cadence: "Ежемесячно",
    conducts: "Team Lead менторов",
    executes: "Ментор",
    controls: "Руководитель",
    channel: "both",
    template: T.meetingInvite,
  },
];

// ─────────────────────────────────────────────────────────────
//  ЗАПОЛНЕНИЕ ШАБЛОНА ПЛЕЙСХОЛДЕРАМИ
// ─────────────────────────────────────────────────────────────

export interface TemplateContext {
  студент: string;
  родитель: string;
  курс: string;
  ментор: string;
  мзк: string;
  discord: string;
  месяц: string;
}

export const DEFAULT_CONTEXT: Omit<TemplateContext, "студент" | "курс" | "месяц"> = {
  родитель: "родитель",
  ментор: "ваш ментор",
  мзк: "менеджер Alfa Z",
  discord: "https://discord.gg/alfa-z",
};

export function fillTemplate(template: string, ctx: Partial<TemplateContext>): string {
  return template.replace(/\{\{([^{}]+)\}\}/g, (_, key: string) => {
    const v = (ctx as Record<string, string>)[key.trim()];
    return v ?? `{{${key}}}`;
  });
}

export const CHANNEL_LABEL: Record<Channel, string> = {
  message: "Сообщение",
  call: "Звонок",
  both: "Сообщение + встреча",
};
