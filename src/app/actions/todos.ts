"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { requireAuthUser } from "@/lib/supabase/auth";
import { todayISO } from "@/lib/date";
import { generateDailyTodos } from "@/lib/ai/generateTodos";
import type { Area, Todo } from "@/lib/mock";

interface TodoRow {
  id: string;
  text: string;
  area: Area | null;
  completed: boolean;
  ai_generated: boolean;
}

function mapRow(row: TodoRow): Todo {
  return {
    id: row.id,
    text: row.text,
    area: (row.area ?? "discipline") as Area,
    completed: row.completed,
    aiGenerated: row.ai_generated,
  };
}

/** Read today's todos for the signed-in user. Empty list on any failure. */
export async function getTodos(): Promise<Todo[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { supabase, user } = await requireAuthUser("getTodos");
    if (!user) return [];

    const { data, error } = await supabase
      .from("daily_todos")
      .select("id, text, area, completed, ai_generated, order")
      .eq("user_id", user.id)
      .eq("date", todayISO())
      .order("order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data) {
      console.error("[getTodos] select failed:", error);
      return [];
    }
    return (data as TodoRow[]).map(mapRow);
  } catch (err) {
    console.error("[getTodos] unexpected error:", err);
    return [];
  }
}

/** Create a new todo for today. Returns the created row or null. */
export async function addTodo(
  text: string,
  area: Area = "discipline"
): Promise<Todo | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("daily_todos")
      .insert({
        user_id: user.id,
        date: todayISO(),
        text,
        area,
        ai_generated: false,
        order: Math.floor(Date.now() / 1000),
      })
      .select("id, text, area, completed, ai_generated, order")
      .single();

    if (error || !data) {
      console.error("[addTodo] insert failed:", error);
      return null;
    }
    revalidatePath("/");
    return mapRow(data as TodoRow);
  } catch (err) {
    console.error("[addTodo] unexpected error:", err);
    return null;
  }
}

/** Update a todo's text. */
export async function updateTodoText(id: string, text: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const supabase = createClient();
    await supabase.from("daily_todos").update({ text }).eq("id", id);
    revalidatePath("/");
  } catch {
    /* swallow — UI keeps optimistic state */
  }
}

/** Toggle a todo's completed flag. */
export async function setTodoCompleted(
  id: string,
  completed: boolean
): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const supabase = createClient();
    await supabase.from("daily_todos").update({ completed }).eq("id", id);
    revalidatePath("/");
  } catch {
    /* swallow */
  }
}

/** Delete a todo. */
export async function deleteTodo(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    const supabase = createClient();
    await supabase.from("daily_todos").delete().eq("id", id);
    revalidatePath("/");
  } catch {
    /* swallow */
  }
}

/**
 * Regenerate today's 3 todos with the AI generator, persisting the result.
 * Replaces all of today's todos. Returns the new list (may be empty on error).
 */
export async function regenerateTodos(): Promise<Todo[]> {
  const generated = await generateDailyTodos();

  if (!isSupabaseConfigured) {
    // No DB — return ephemeral todos so the UI still works.
    return generated.map((t, i) => ({
      id: `tmp-${Date.now()}-${i}`,
      text: t.text,
      area: t.area,
      completed: false,
      aiGenerated: true,
    }));
  }

  try {
    const { supabase, user } = await requireAuthUser("regenerateTodos");
    if (!user) {
      console.error("[regenerateTodos] aborting — no authenticated user");
      return [];
    }

    const date = todayISO();

    // Clear today's todos, then insert the freshly generated set.
    const { error: deleteError } = await supabase
      .from("daily_todos")
      .delete()
      .eq("user_id", user.id)
      .eq("date", date);

    if (deleteError) {
      console.error("[regenerateTodos] delete failed:", deleteError);
    }

    const rows = generated.map((t, i) => ({
      user_id: user.id,
      date,
      text: t.text,
      area: t.area,
      ai_generated: true,
      order: i,
    }));

    const { data, error } = await supabase
      .from("daily_todos")
      .insert(rows)
      .select("id, text, area, completed, ai_generated, order");

    if (error || !data) {
      console.error("[regenerateTodos] insert failed:", error);
      return [];
    }
    revalidatePath("/");
    return (data as TodoRow[]).map(mapRow);
  } catch (err) {
    console.error("[regenerateTodos] unexpected error:", err);
    return [];
  }
}
