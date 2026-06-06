"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ModuleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </span>
      <div>
        <h2 className="text-lg font-semibold">Algo salió mal</h2>
        <p className="mt-1 max-w-sm text-sm text-text-secondary">
          {error.message || "Ocurrió un error inesperado en este módulo."}
        </p>
      </div>
      <button
        onClick={reset}
        className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:border-accent/30 hover:text-accent"
      >
        <RotateCcw className="h-4 w-4" /> Reintentar
      </button>
    </div>
  );
}
