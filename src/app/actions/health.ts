"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { requireAuthUser } from "@/lib/supabase/auth";
import { todayISO, lastNDates } from "@/lib/date";
import type { Area } from "@/lib/mock";

export interface HealthSnapshot {
  sleepHours: number | null;
  hrv: number | null;
  steps: number | null;
  restingHr: number | null;
}

export interface HealthTrendPoint {
  label: number;
  value: number;
}

export interface HealthData {
  today: HealthSnapshot;
  sleepSeries: HealthTrendPoint[];
  hrvSeries: HealthTrendPoint[];
}

const TREND_DAYS = 14;

/** Today's health metrics + recent trend series from health_logs. */
export async function getHealthData(): Promise<HealthData> {
  const empty: HealthData = {
    today: { sleepHours: null, hrv: null, steps: null, restingHr: null },
    sleepSeries: [],
    hrvSeries: [],
  };

  if (!isSupabaseConfigured) return empty;

  try {
    const { supabase, user } = await requireAuthUser("getHealthData");
    if (!user) return empty;

    const dates = lastNDates(TREND_DAYS);
    const firstDate = dates[0];
    const today = todayISO();

    const { data, error } = await supabase
      .from("health_logs")
      .select("date, sleep_hours, hrv, steps, resting_hr")
      .eq("user_id", user.id)
      .gte("date", firstDate)
      .order("date", { ascending: true });

    if (error) {
      console.error("[getHealthData] select failed:", error);
      return empty;
    }

    const rows = data ?? [];
    const byDate = new Map(rows.map((r) => [r.date as string, r]));
    const todayRow = byDate.get(today);

    const todaySnapshot: HealthSnapshot = {
      sleepHours: todayRow?.sleep_hours != null ? Number(todayRow.sleep_hours) : null,
      hrv: todayRow?.hrv != null ? Number(todayRow.hrv) : null,
      steps: todayRow?.steps != null ? Number(todayRow.steps) : null,
      restingHr: todayRow?.resting_hr != null ? Number(todayRow.resting_hr) : null,
    };

    const sleepSeries: HealthTrendPoint[] = [];
    const hrvSeries: HealthTrendPoint[] = [];

    dates.forEach((d, i) => {
      const row = byDate.get(d);
      if (row?.sleep_hours != null) {
        sleepSeries.push({ label: i + 1, value: Number(row.sleep_hours) });
      }
      if (row?.hrv != null) {
        hrvSeries.push({ label: i + 1, value: Number(row.hrv) });
      }
    });

    return { today: todaySnapshot, sleepSeries, hrvSeries };
  } catch (err) {
    console.error("[getHealthData] unexpected error:", err);
    return empty;
  }
}

/** Today's sleep hours only (used by dashboard + discipline). */
export async function getTodaySleepHours(): Promise<number | null> {
  const { today } = await getHealthData();
  return today.sleepHours;
}
