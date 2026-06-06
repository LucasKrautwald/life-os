"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { refreshPortfolio } from "@/app/actions/portfolio";
import { cn } from "@/lib/utils";

export function RefreshButton({ fetchedAt }: { fetchedAt?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onRefresh = () => {
    startTransition(async () => {
      await refreshPortfolio();
      router.refresh();
    });
  };

  const time = fetchedAt
    ? new Date(fetchedAt).toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="flex items-center gap-2">
      {time && (
        <span className="text-xs text-text-muted">Actualizado {time}</span>
      )}
      <button
        onClick={onRefresh}
        disabled={pending}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-bg-card px-3 py-2 text-sm text-text-secondary transition-colors hover:border-accent/30 hover:text-accent disabled:opacity-50"
      >
        <RefreshCw className={cn("h-4 w-4", pending && "animate-spin")} />
        Actualizar
      </button>
    </div>
  );
}
