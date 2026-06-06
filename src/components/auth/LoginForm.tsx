"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      // Demo mode: no backend yet, go straight in.
      router.push("/");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-bg-primary">
          <Zap className="h-5 w-5" fill="currentColor" />
        </span>
        <span className="text-lg font-semibold tracking-tight">LIFE OS</span>
      </div>

      <div>
        <h1 className="text-xl font-semibold">Bienvenido de vuelta</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {isSupabaseConfigured
            ? "Inicia sesión para continuar."
            : "Supabase no está configurado — entra en modo demo."}
        </p>
      </div>

      <div className="space-y-3">
        <input
          type="email"
          required={isSupabaseConfigured}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@ejemplo.com"
          className="w-full rounded-lg border border-border bg-bg-card px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-text-muted focus:border-accent/50"
        />
        <input
          type="password"
          required={isSupabaseConfigured}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-lg border border-border bg-bg-card px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-text-muted focus:border-accent/50"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-medium text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isSupabaseConfigured ? "Entrar" : "Entrar en modo demo"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
