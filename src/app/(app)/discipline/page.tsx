import { PageHeader } from "@/components/ui/PageHeader";
import { DisciplineView } from "@/components/discipline/DisciplineView";
import { getHabitsData } from "@/app/actions/habits";
import { getTodayHighlight } from "@/app/actions/highlights";
import { getTodaySleepHours } from "@/app/actions/health";

export default async function DisciplinePage() {
  const [{ habits, contributions, score }, highlight, sleepHours] =
    await Promise.all([
      getHabitsData(),
      getTodayHighlight(),
      getTodaySleepHours(),
    ]);

  return (
    <div>
      <PageHeader
        title="Disciplina & Hábitos"
        subtitle="Checklist diario, rachas y consistencia de los últimos 90 días."
      />

      <DisciplineView
        initial={habits}
        contributions={contributions}
        initialScore={score}
        highlight={highlight}
        sleepHours={sleepHours}
      />
    </div>
  );
}
