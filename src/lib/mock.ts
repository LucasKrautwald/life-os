/**
 * Sample data used to make every module explorable before Supabase + the
 * external APIs are wired up. Mirrors the shape of the planned DB tables.
 */

export type Area = "school" | "health" | "agency" | "finance" | "discipline";

export interface Todo {
  id: string;
  text: string;
  area: Area;
  completed: boolean;
  aiGenerated: boolean;
}

export interface QuickStats {
  monthlyBalanceCop: number;
  portfolioValueCop: number;
  portfolioChangePct: number;
  sleepHours: number;
  habitsDone: number;
  habitsTotal: number;
}

export interface AgendaItem {
  id: string;
  title: string;
  subject: string;
  due: string; // e.g. "Hoy", "Mañana"
  urgent: boolean;
}

export const mockTodos: Todo[] = [
  {
    id: "1",
    text: "Terminar el IA de Math AA (sección de análisis)",
    area: "school",
    completed: false,
    aiGenerated: true,
  },
  {
    id: "2",
    text: "Entrenar 45 min — corrida de recuperación",
    area: "health",
    completed: false,
    aiGenerated: true,
  },
  {
    id: "3",
    text: "Enviar reporte semanal a Krautisana",
    area: "agency",
    completed: true,
    aiGenerated: true,
  },
];

export const mockStats: QuickStats = {
  monthlyBalanceCop: 280_000,
  portfolioValueCop: 18_450_000,
  portfolioChangePct: 0.34,
  sleepHours: 7.4,
  habitsDone: 3,
  habitsTotal: 5,
};

export const mockAgenda: AgendaItem[] = [
  {
    id: "a1",
    title: "Entregar ensayo de Spanish Lang & Lit",
    subject: "Spanish A",
    due: "Hoy",
    urgent: true,
  },
  {
    id: "a2",
    title: "Quiz de Chemistry HL — temas 3 y 4",
    subject: "Chemistry HL",
    due: "Mañana",
    urgent: true,
  },
  {
    id: "a3",
    title: "Problem set 6 de Math AA",
    subject: "Math AA HL",
    due: "En 2 días",
    urgent: false,
  },
];

export const mockSummary =
  "Tienes 2 tareas del colegio para hoy, dormiste 7.4h (buena recuperación), y tu portafolio subió 0.34% ayer.";

/* ----------------------------- Finances ----------------------------- */

export interface PortfolioPosition {
  ticker: string;
  shares: number;
  price: number; // in COP
  changePct: number;
}

export const mockPortfolio: PortfolioPosition[] = [
  { ticker: "ECOPETROL", shares: 1200, price: 2150, changePct: 0.8 },
  { ticker: "BCOLOMBIA", shares: 90, price: 38500, changePct: -0.4 },
  { ticker: "NU", shares: 150, price: 52000, changePct: 1.2 },
  { ticker: "AAPL", shares: 8, price: 920000, changePct: 0.3 },
  { ticker: "VOO", shares: 4, price: 2280000, changePct: 0.5 },
];

export interface AgencyClient {
  name: string;
  monthlyUsd: number;
  status: "activo" | "pendiente" | "pipeline";
  notes: string;
}

export const mockClients: AgencyClient[] = [
  { name: "Krautisana", monthlyUsd: 100, status: "activo", notes: "Retainer mensual" },
  { name: "LatinLeap", monthlyUsd: 100, status: "activo", notes: "Retainer mensual" },
  {
    name: "Bitpoint",
    monthlyUsd: 200,
    status: "pendiente",
    notes: "Setup $1.100 + $200/mes (pendiente arranque)",
  },
];

export interface PersonalIncome {
  source: string;
  amountCop: number;
}

export const mockIncome: PersonalIncome[] = [
  { source: "Taschengeld papá", amountCop: 200_000 },
  { source: "Abuela", amountCop: 350_000 },
];

export interface PersonalExpense {
  date: string;
  category: string;
  amountCop: number;
  note: string;
}

export const mockExpenses: PersonalExpense[] = [
  { date: "2026-06-01", category: "Comida", amountCop: 45_000, note: "Almuerzo con amigos" },
  { date: "2026-06-02", category: "Transporte", amountCop: 18_000, note: "Uber" },
  { date: "2026-06-03", category: "Suscripciones", amountCop: 32_000, note: "Spotify + ChatGPT" },
  { date: "2026-06-04", category: "Salidas", amountCop: 80_000, note: "Cine + cena" },
  { date: "2026-06-05", category: "Comida", amountCop: 25_000, note: "Café" },
];

export const BUDGET_LIMIT_COP = 400_000;

/* ----------------------------- Discipline ----------------------------- */

export interface Habit {
  id: string;
  name: string;
  area: Area;
  done: boolean;
  streak: number;
}

export const mockHabits: Habit[] = [
  { id: "h1", name: "Ejercicio", area: "health", done: true, streak: 12 },
  { id: "h2", name: "Estudio 2h", area: "school", done: true, streak: 5 },
  { id: "h3", name: "Sueño ≥ 7h", area: "health", done: true, streak: 8 },
  { id: "h4", name: "Sin junk food", area: "health", done: false, streak: 0 },
  { id: "h5", name: "Lectura", area: "discipline", done: false, streak: 3 },
];

/* ----------------------------- School ----------------------------- */

export interface Subject {
  id: string;
  name: string;
  average: number; // out of 7 (IB)
  gradeCount: number;
}

export const mockSubjects: Subject[] = [
  { id: "s1", name: "Math AA HL", average: 6.2, gradeCount: 8 },
  { id: "s2", name: "Chemistry HL", average: 5.6, gradeCount: 6 },
  { id: "s3", name: "Physics HL", average: 6.0, gradeCount: 7 },
  { id: "s4", name: "Spanish A Lang & Lit", average: 6.5, gradeCount: 5 },
  { id: "s5", name: "English B", average: 6.8, gradeCount: 6 },
  { id: "s6", name: "History SL", average: 5.9, gradeCount: 4 },
];

/* ----------------------------- Health ----------------------------- */

export interface HealthSnapshot {
  sleepHours: number;
  hrv: number;
  steps: number;
  restingHr: number;
}

export const mockHealth: HealthSnapshot = {
  sleepHours: 7.4,
  hrv: 68,
  steps: 9240,
  restingHr: 52,
};

export interface Activity {
  date: string;
  type: string;
  detail: string;
}

export const mockActivities: Activity[] = [
  { date: "Ayer", type: "Run", detail: "8.2 km · 4:55/km · 40 min" },
  { date: "Hace 2 días", type: "Gym", detail: "Push day · 55 min" },
  { date: "Hace 3 días", type: "Tenis", detail: "1h 20min" },
  { date: "Hace 4 días", type: "Run", detail: "5.0 km · 5:10/km · 26 min" },
];

/** Build a 14-point series (e.g. sleep / HRV) with light variation. */
export function buildSeries(base: number, variance: number, points = 14) {
  return Array.from({ length: points }, (_, i) => ({
    day: i,
    value: +(base + Math.sin(i / 2) * variance + (i % 3) * (variance / 4)).toFixed(1),
  }));
}

/* ----------------------------- Progress ----------------------------- */

export interface AreaScore {
  key: Area;
  label: string;
  emoji: string;
  score: number;
  delta: number;
}

export const mockScores: AreaScore[] = [
  { key: "health", label: "Salud", emoji: "💚", score: 82, delta: 4 },
  { key: "discipline", label: "Disciplina", emoji: "🎯", score: 74, delta: -3 },
  { key: "school", label: "Colegio", emoji: "📚", score: 88, delta: 6 },
  { key: "finance", label: "Finanzas", emoji: "💰", score: 79, delta: 2 },
  { key: "agency", label: "Agencia", emoji: "🚀", score: 65, delta: 8 },
];

export const mockGlobalScore = Math.round(
  mockScores.reduce((acc, s) => acc + s.score, 0) / mockScores.length
);

/** Deterministic 90-day contribution map for the GitHub-style graph. */
export function buildContributions(days = 90): number[] {
  return Array.from({ length: days }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const rnd = seed / 233280;
    if (rnd > 0.78) return 4;
    if (rnd > 0.55) return 3;
    if (rnd > 0.35) return 2;
    if (rnd > 0.18) return 1;
    return 0;
  });
}
