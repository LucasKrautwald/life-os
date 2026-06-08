"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { requireAuthUser } from "@/lib/supabase/auth";
import { todayISO, lastNDates } from "@/lib/date";
import type { Area, Habit } from "@/lib/mock";

const CONTRIB_DAYS = 91;

interface HabitRow {
  id: string;
  name: string;
  area: string;
}

type HabitLogRow = { habit_id: string; date: string; completed: boolean };

export interface ContributionDay {
  level: number;
  completed: number;
  total: number;
}

export interface HabitsData {
  habits: Habit[];
  contributions: ContributionDay[];
  score: number;
}

/** Fetch habits for the user (no auto-seeding). */
async function ensureHabits(
  supabase: SupabaseClient,
  userId: string
): Promise<HabitRow[]> {
  const { data, error } = await supabase
    .from("habits")
    .select("id, name, area")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[ensureHabits] select failed:", error);
    return [];
  }

  return (data as HabitRow[]) ?? [];
}

/** Consecutive completed days ending today (or yesterday if today is open). */
function computeStreak(completed: Set<string>, orderedDesc: string[]): number {
  let start = 0;
  if (orderedDesc[0] && !completed.has(orderedDesc[0])) start = 1;

  let streak = 0;
  for (let i = start; i < orderedDesc.length; i++) {
    if (completed.has(orderedDesc[i])) streak++;
    else break;
  }
  return streak;
}

/** Map completed count → heatmap level 0–4 from completion ratio. */
function ratioToLevel(completed: number, total: number): number {
  if (total === 0 || completed === 0) return 0;
  return Math.min(4, Math.round((completed / total) * 4));
}

/** Persist today's discipline score to daily_scores. */
async function saveDisciplineScore(
  supabase: SupabaseClient,
  userId: string,
  done: number,
  total: number
): Promise<number> {
  if (total === 0) return 0;

  const score = Math.round((done / total) * 100);
  const date = todayISO();

  const { error } = await supabase.from("daily_scores").upsert(
    {
      user_id: userId,
      date,
      score_discipline: score,
    },
    { onConflict: "user_id,date" }
  );

  if (error) {
    console.error("[saveDisciplineScore] upsert failed:", error);
  } else {
    console.log(`[saveDisciplineScore] ${date} score_discipline=${score}%`);
  }

  return score;
}

/** Count today's completed habits for a user. */
async function countTodayCompleted(
  supabase: SupabaseClient,
  habitIds: string[]
): Promise<number> {
  if (habitIds.length === 0) return 0;

  const { data, error } = await supabase
    .from("habit_logs")
    .select("habit_id")
    .in("habit_id", habitIds)
    .eq("date", todayISO())
    .eq("completed", true);

  if (error) {
    console.error("[countTodayCompleted] select failed:", error);
    return 0;
  }

  return data?.length ?? 0;
}

/** Gray empty graph (91 days, no completions). */
function emptyContributions(): ContributionDay[] {
  return lastNDates(CONTRIB_DAYS).map(() => ({
    level: 0,
    completed: 0,
    total: 0,
  }));
}

/** All habits with today's state, streaks, 90-day graph, and saved score. */
export async function getHabitsData(): Promise<HabitsData> {
  const empty: HabitsData = {
    habits: [],
    contributions: emptyContributions(),
    score: 0,
  };
  if (!isSupabaseConfigured) return empty;

  try {
    const { supabase, user } = await requireAuthUser("getHabitsData");
    if (!user) return empty;

    const habitRows = await ensureHabits(supabase, user.id);
    if (habitRows.length === 0) return empty;

    const habitIds = habitRows.map((h) => h.id);
    const dates = lastNDates(CONTRIB_DAYS);
    const firstDate = dates[0];
    const today = todayISO();

    const { data: logs, error: logsError } = await supabase
      .from("habit_logs")
      .select("habit_id, date, completed")
      .in("habit_id", habitIds)
      .gte("date", firstDate);

    if (logsError) {
      console.error("[getHabitsData] habit_logs select failed:", logsError);
    }

    const logRows = (logs as HabitLogRow[]) ?? [];
    const byHabit = new Map<string, Set<string>>();
    const perDate = new Map<string, number>();

    for (const l of logRows) {
      if (!l.completed) continue;
      if (!byHabit.has(l.habit_id)) byHabit.set(l.habit_id, new Set());
      byHabit.get(l.habit_id)!.add(l.date);
      perDate.set(l.date, (perDate.get(l.date) ?? 0) + 1);
    }

    const orderedDesc = [...dates].reverse();
    const total = habitRows.length;

    const habits: Habit[] = habitRows.map((h) => {
      const set = byHabit.get(h.id) ?? new Set<string>();
      return {
        id: h.id,
        name: h.name,
        area: h.area as Area,
        done: set.has(today),
        streak: computeStreak(set, orderedDesc),
      };
    });

    const contributions: ContributionDay[] = dates.map((d) => {
      const completed = perDate.get(d) ?? 0;
      return {
        level: ratioToLevel(completed, total),
        completed,
        total,
      };
    });

    const done = habits.filter((h) => h.done).length;
    const score = await saveDisciplineScore(supabase, user.id, done, total);

    return { habits, contributions, score };
  } catch (err) {
    console.error("[getHabitsData] unexpected error:", err);
    return empty;
  }
}

/** Lightweight today summary for the dashboard stat card. */
export async function getTodayHabitSummary(): Promise<{
  done: number;
  total: number;
}> {
  if (!isSupabaseConfigured) return { done: 0, total: 0 };

  try {
    const { supabase, user } = await requireAuthUser("getTodayHabitSummary");
    if (!user) return { done: 0, total: 0 };

    const habitRows = await ensureHabits(supabase, user.id);
    const total = habitRows.length;
    if (total === 0) return { done: 0, total: 0 };

    const done = await countTodayCompleted(
      supabase,
      habitRows.map((h) => h.id)
    );

    return { done, total };
  } catch (err) {
    console.error("[getTodayHabitSummary] unexpected error:", err);
    return { done: 0, total: 0 };
  }
}

/** Check / uncheck a habit for today (upsert into habit_logs). */
export async function toggleHabit(
  habitId: string,
  done: boolean
): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    const { supabase, user } = await requireAuthUser("toggleHabit");
    if (!user) return;

    const { error } = await supabase
      .from("habit_logs")
      .upsert(
        { habit_id: habitId, date: todayISO(), completed: done },
        { onConflict: "habit_id,date" }
      );

    if (error) {
      console.error("[toggleHabit] upsert failed:", error);
      return;
    }

    const habitRows = await ensureHabits(supabase, user.id);
    const total = habitRows.length;
    const completed = await countTodayCompleted(
      supabase,
      habitRows.map((h) => h.id)
    );
    await saveDisciplineScore(supabase, user.id, completed, total);

    revalidatePath("/discipline");
    revalidatePath("/");
  } catch (err) {
    console.error("[toggleHabit] unexpected error:", err);
  }
}

/** Create a new habit for the authenticated user. */
export async function createHabit(
  name: string,
  area: Area
): Promise<Habit | null> {
  if (!isSupabaseConfigured) return null;

  const trimmed = name.trim();
  if (!trimmed) return null;

  try {
    const { supabase, user } = await requireAuthUser("createHabit");
    if (!user) return null;

    const { data, error } = await supabase
      .from("habits")
      .insert({ user_id: user.id, name: trimmed, area })
      .select("id, name, area")
      .single();

    if (error || !data) {
      console.error("[createHabit] insert failed:", error);
      return null;
    }

    revalidatePath("/discipline");
    revalidatePath("/");

    return {
      id: data.id,
      name: data.name,
      area: data.area as Area,
      done: false,
      streak: 0,
    };
  } catch (err) {
    console.error("[createHabit] unexpected error:", err);
    return null;
  }
}

/** Update habit name and area. */
export async function updateHabit(
  id: string,
  name: string,
  area: Area
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const trimmed = name.trim();
  if (!trimmed) return false;

  try {
    const { supabase, user } = await requireAuthUser("updateHabit");
    if (!user) return false;

    const { error } = await supabase
      .from("habits")
      .update({ name: trimmed, area })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("[updateHabit] update failed:", error);
      return false;
    }

    revalidatePath("/discipline");
    revalidatePath("/");
    return true;
  } catch (err) {
    console.error("[updateHabit] unexpected error:", err);
    return false;
  }
}

/** Delete a habit (habit_logs cascade via FK). */
export async function deleteHabit(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { supabase, user } = await requireAuthUser("deleteHabit");
    if (!user) return false;

    const { error } = await supabase
      .from("habits")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("[deleteHabit] delete failed:", error);
      return false;
    }

    revalidatePath("/discipline");
    revalidatePath("/");
    return true;
  } catch (err) {
    console.error("[deleteHabit] unexpected error:", err);
    return false;
  }
}
