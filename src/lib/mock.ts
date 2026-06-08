/**
 * Shared domain types. No sample data — modules use Supabase / external APIs.
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
  monthlyBalanceCop: number | null;
  portfolioValueCop: number | null;
  portfolioChangePct: number | null;
  sleepHours: number | null;
  habitsDone: number;
  habitsTotal: number;
}

export interface AgendaItem {
  id: string;
  title: string;
  subject: string;
  due: string;
  urgent: boolean;
}

export interface AgencyClient {
  name: string;
  monthlyUsd: number;
  status: "activo" | "pendiente" | "pipeline";
  notes: string;
}

/** Real agency clients (not mock — actual business). */
export const REAL_AGENCY_CLIENTS: AgencyClient[] = [
  { name: "Krautisana", monthlyUsd: 100, status: "activo", notes: "Retainer mensual" },
  { name: "LatinLeap", monthlyUsd: 100, status: "activo", notes: "Retainer mensual" },
];

export interface Habit {
  id: string;
  name: string;
  area: Area;
  done: boolean;
  streak: number;
}

export interface Subject {
  id: string;
  name: string;
  average: number;
  gradeCount: number;
}

export interface AreaScore {
  key: Area;
  label: string;
  emoji: string;
  score: number;
  delta: number;
}
