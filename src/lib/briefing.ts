import { formatPct } from "@/lib/format";
import type { QuickStats } from "@/lib/mock";

interface BriefingInput {
  todosPending: number;
  habitsDone: number;
  habitsTotal: number;
  portfolioOk: boolean;
  portfolioChangePct: number | null;
  sleepHours: number | null;
}

/** Build a briefing from real data only; generic copy when nothing is available. */
export function buildBriefing(input: BriefingInput): string {
  const parts: string[] = [];

  if (input.todosPending > 0) {
    parts.push(
      `${input.todosPending} todo${input.todosPending === 1 ? "" : "s"} pendiente${input.todosPending === 1 ? "" : "s"}`
    );
  }

  if (input.habitsTotal > 0) {
    parts.push(`${input.habitsDone}/${input.habitsTotal} hábitos completados hoy`);
  }

  if (input.portfolioOk && input.portfolioChangePct != null) {
    parts.push(`portafolio ${formatPct(input.portfolioChangePct)}`);
  }

  if (input.sleepHours != null) {
    parts.push(`${input.sleepHours.toFixed(1)}h de sueño anoche`);
  }

  if (parts.length === 0) {
    return "Sin datos todavía. Añade todos y hábitos, o conecta Garmin y finanzas para un briefing personalizado.";
  }

  return parts.join(" · ") + ".";
}

export const EMPTY_QUICK_STATS: QuickStats = {
  monthlyBalanceCop: null,
  portfolioValueCop: null,
  portfolioChangePct: null,
  sleepHours: null,
  habitsDone: 0,
  habitsTotal: 0,
};
