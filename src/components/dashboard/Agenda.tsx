import { CalendarClock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { AgendaItem } from "@/lib/mock";

export function Agenda({ items }: { items: AgendaItem[] }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-medium text-text-secondary">
        Agenda · próximos 2 días
      </h2>
      {items.length === 0 ? (
        <div className="card px-5 py-8 text-center text-sm text-text-muted">
          No hay tareas próximas del colegio.
        </div>
      ) : (
        <Card index={4} className="divide-y divide-border-subtle p-0">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-5 py-3.5">
              <CalendarClock className="h-4 w-4 shrink-0 text-text-muted" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-text-primary">{item.title}</p>
                <p className="text-xs text-text-muted">{item.subject}</p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                  item.urgent
                    ? "border-destructive/30 bg-destructive/10 text-destructive"
                    : "border-border bg-bg-hover text-text-secondary"
                )}
              >
                {item.due}
              </span>
            </div>
          ))}
        </Card>
      )}
    </section>
  );
}
