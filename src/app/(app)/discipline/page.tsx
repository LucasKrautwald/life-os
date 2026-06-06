import { PageHeader } from "@/components/ui/PageHeader";
import { DisciplineView } from "@/components/discipline/DisciplineView";
import { mockHabits, buildContributions } from "@/lib/mock";

export default function DisciplinePage() {
  return (
    <div>
      <PageHeader
        title="Disciplina & Hábitos"
        subtitle="Checklist diario, rachas y consistencia de los últimos 90 días."
      />

      <DisciplineView initial={mockHabits} contributions={buildContributions(91)} />
    </div>
  );
}
