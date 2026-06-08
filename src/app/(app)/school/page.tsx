import { FileUp, CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SchoolView } from "@/components/school/SchoolView";
import type { Subject } from "@/lib/mock";

export default function SchoolPage() {
  const subjects: Subject[] = [];

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

      <SchoolView subjects={subjects} />

      <section>
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-sm font-medium text-text-secondary">
            Tareas pendientes
          </h2>
        </div>

        <div className="card flex flex-col items-center justify-center px-6 py-12 text-center">
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-bg-hover text-text-muted">
            <CalendarClock className="h-5 w-5" />
          </span>
          <p className="text-sm text-text-muted">
            No hay tareas pendientes registradas.
          </p>
        </div>
      </section>
    </div>
  );
}
