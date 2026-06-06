"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    if (isSupabaseConfigured) {
      await createClient().auth.signOut();
    }
    router.push("/login");
  };

  return (
    <button
      onClick={logout}
      className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:border-destructive/30 hover:text-destructive"
    >
      <LogOut className="h-4 w-4" /> Cerrar sesión
    </button>
  );
}
