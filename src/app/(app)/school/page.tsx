import { FileUp, CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { SchoolView } from "@/components/school/SchoolView";
import { mockSubjects, mockAgenda } from "@/lib/mock";
import { cn } from "@/lib/utils";

/** Color-code a deadline badge by urgency. */
function dueStyle(due: string): string {
  const d = due.toLowerCase();
  if (d.includes("hoy"))
    return "border-destructive/30 bg-destructive/10 text-destructive";
  if (d.includes("mañana"))
    return "border-amber-500/30 bg-amber-500/10 text-amber-300";
  return "border-success/30 bg-success/10 text-success";
}

export default function SchoolPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Colegio"
        subtitle="Materias IB, notas y tareas pendientes."
        action={
          <button className="flex items-center gap-2 rounded-lg border border-border bg-bg-card px-3 py-2 text-sm text-text-secondary transition-colors hover:border-accent/30 hover:text-accent">
            <FileUp className="h-4 w-4" /> Subir PDF de notas
          </button>
        }
      />

      <SchoolView subjects={mockSubjects} />

      {/* Tareas pendientes — clearly separated section */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-sm font-medium text-text-secondary">
            Tareas pendientes
          </h2>
          <span className="mono rounded-full bg-bg-hover px-2 py-0.5 text-[10px] text-text-muted">
            {mockAgenda.length}
          </span>
        </div>

        <div className="space-y-2.5">
          {mockAgenda.map((item, i) => (
            <Card key={item.id} index={i} hover className="flex items-center gap-4 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-hover text-text-muted">
                <CalendarClock className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.title}</p>
                <p className="mt-0.5 truncate text-xs text-text-muted">
                  {item.subject}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide",
                  dueStyle(item.due)
                )}
              >
                {item.due}
              </span>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
