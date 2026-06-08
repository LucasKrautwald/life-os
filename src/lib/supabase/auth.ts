import { createClient } from "./server";
import { isSupabaseConfigured } from "./config";
import type { SupabaseClient, User } from "@supabase/supabase-js";

/** Returns the authenticated user's id, or null when there is no session. */
export async function getCurrentUserId(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

/** Authenticated user from the cookie-backed SSR client (createServerClient). */
export async function requireAuthUser(label: string): Promise<{
  supabase: SupabaseClient;
  user: User | null;
}> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  console.log(`[${label}] auth.getUser():`, {
    userId: data.user?.id ?? null,
    email: data.user?.email ?? null,
    authError: error?.message ?? null,
  });

  if (error) {
    console.error(`[${label}] auth.getUser() error:`, error);
  }

  if (!data.user) {
    console.error(
      `[${label}] NO AUTHENTICATED USER — RLS will block reads/writes`
    );
    return { supabase, user: null };
  }

  return { supabase, user: data.user };
}
