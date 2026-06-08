"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { requireAuthUser } from "@/lib/supabase/auth";
import { todayISO } from "@/lib/date";

export interface DailyHighlight {
  id: string;
  date: string;
  text: string;
  createdAt: string;
}

const MAX_LENGTH = 280;

/** Today's highlight for the signed-in user, or null. */
export async function getTodayHighlight(): Promise<DailyHighlight | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { supabase, user } = await requireAuthUser("getTodayHighlight");
    if (!user) return null;

    const { data, error } = await supabase
      .from("daily_highlights")
      .select("id, date, text, created_at")
      .eq("user_id", user.id)
      .eq("date", todayISO())
      .maybeSingle();

    if (error) {
      console.error("[getTodayHighlight] select failed:", error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      date: data.date,
      text: data.text,
      createdAt: data.created_at,
    };
  } catch (err) {
    console.error("[getTodayHighlight] unexpected error:", err);
    return null;
  }
}

/** Save or update today's highlight (one per day). */
export async function saveTodayHighlight(
  text: string
): Promise<DailyHighlight | null> {
  if (!isSupabaseConfigured) return null;

  const trimmed = text.trim().slice(0, MAX_LENGTH);
  if (!trimmed) return null;

  try {
    const { supabase, user } = await requireAuthUser("saveTodayHighlight");
    if (!user) return null;

    const date = todayISO();

    const { data, error } = await supabase
      .from("daily_highlights")
      .upsert(
        { user_id: user.id, date, text: trimmed },
        { onConflict: "user_id,date" }
      )
      .select("id, date, text, created_at")
      .single();

    if (error) {
      console.error("[saveTodayHighlight] upsert failed:", error);
      return null;
    }

    revalidatePath("/discipline");
    return {
      id: data.id,
      date: data.date,
      text: data.text,
      createdAt: data.created_at,
    };
  } catch (err) {
    console.error("[saveTodayHighlight] unexpected error:", err);
    return null;
  }
}

/** All past highlights, newest first. */
export async function getHighlightHistory(): Promise<DailyHighlight[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { supabase, user } = await requireAuthUser("getHighlightHistory");
    if (!user) return [];

    const { data, error } = await supabase
      .from("daily_highlights")
      .select("id, date, text, created_at")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (error) {
      console.error("[getHighlightHistory] select failed:", error);
      return [];
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      date: row.date,
      text: row.text,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error("[getHighlightHistory] unexpected error:", err);
    return [];
  }
}
