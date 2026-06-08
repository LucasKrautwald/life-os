"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { requireAuthUser } from "@/lib/supabase/auth";
import { lastNDates } from "@/lib/date";
import { AREA_META } from "@/lib/constants";
import type { Area, AreaScore } from "@/lib/mock";

const AREA_KEYS: Area[] = [
  "health",
  "discipline",
  "school",
  "finance",
  "agency",
];

const AREA_EMOJI: Record<Area, string> = {
  health: "💚",
  discipline: "🎯",
  school: "📚",
  finance: "💰",
  agency: "🚀",
};

const SCORE_COLUMNS: Record<Area, string> = {
  health: "score_health",
  discipline: "score_discipline",
  school: "score_school",
  finance: "score_finance",
  agency: "score_agency",
};

type ScoreRow = {
  date: string;
  score_health: number | null;
  score_discipline: number | null;
  score_school: number | null;
  score_finance: number | null;
  score_agency: number | null;
  score_global: number | null;
};

export interface ProgressData {
  globalScore: number | null;
  areas: AreaScore[];
  history: Record<string, number | string>[];
}

function rowScore(row: ScoreRow, area: Area): number | null {
  const v = row[SCORE_COLUMNS[area] as keyof ScoreRow];
  return v != null ? Number(v) : null;
}

/** Scores from daily_scores — latest values, deltas, and 30-day history. */
export async function getProgressData(): Promise<ProgressData> {
  const empty: ProgressData = { globalScore: null, areas: [], history: [] };
  if (!isSupabaseConfigured) return empty;

  try {
    const { supabase, user } = await requireAuthUser("getProgressData");
    if (!user) return empty;

    const dates = lastNDates(30);
    const firstDate = dates[0];

    const { data, error } = await supabase
      .from("daily_scores")
      .select(
        "date, score_health, score_discipline, score_school, score_finance, score_agency, score_global"
      )
      .eq("user_id", user.id)
      .gte("date", firstDate)
      .order("date", { ascending: true });

    if (error) {
      console.error("[getProgressData] select failed:", error);
      return empty;
    }

    const rows = (data as ScoreRow[]) ?? [];
    if (rows.length === 0) return empty;

    const latest = rows[rows.length - 1];
    const weekAgo = rows.find((r) => r.date <= dates[Math.max(0, dates.length - 8)]) ?? rows[0];

    const areas: AreaScore[] = AREA_KEYS.flatMap((key) => {
      const score = rowScore(latest, key);
      if (score == null) return [];
      const prev = rowScore(weekAgo, key) ?? score;
      return [
        {
          key,
          label: AREA_META[key].label,
          emoji: AREA_EMOJI[key],
          score: Math.round(score),
          delta: Math.round(score - prev),
        },
      ];
    });

    const globalScore =
      latest.score_global != null
        ? Math.round(Number(latest.score_global))
        : areas.length > 0
          ? Math.round(areas.reduce((a, s) => a + s.score, 0) / areas.length)
          : null;

    const history = rows.map((row, i) => {
      const point: Record<string, number | string> = { label: i + 1 };
      for (const key of AREA_KEYS) {
        const v = rowScore(row, key);
        if (v != null) point[key] = Math.round(v);
      }
      return point;
    });

    return { globalScore, areas, history };
  } catch (err) {
    console.error("[getProgressData] unexpected error:", err);
    return empty;
  }
}
