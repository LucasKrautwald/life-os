import { DashboardView } from "@/components/dashboard/DashboardView";
import { getTodos } from "@/app/actions/todos";
import { getTodayHabitSummary } from "@/app/actions/habits";
import { getPortfolio } from "@/app/actions/portfolio";
import { getTodaySleepHours } from "@/app/actions/health";
import { buildBriefing, EMPTY_QUICK_STATS } from "@/lib/briefing";
import type { QuickStats } from "@/lib/mock";

export default async function DashboardPage() {
  const [todos, habitSummary, portfolio, sleepHours] = await Promise.all([
    getTodos(),
    getTodayHabitSummary(),
    getPortfolio(),
    getTodaySleepHours(),
  ]);

  const stats: QuickStats = {
    ...EMPTY_QUICK_STATS,
    portfolioValueCop: portfolio.ok ? portfolio.data.totalValue : null,
    portfolioChangePct: portfolio.ok ? portfolio.data.totalPLPct : null,
    sleepHours,
    habitsDone: habitSummary.done,
    habitsTotal: habitSummary.total,
  };

  const summary = buildBriefing({
    todosPending: todos.filter((t) => !t.completed).length,
    habitsDone: habitSummary.done,
    habitsTotal: habitSummary.total,
    portfolioOk: portfolio.ok,
    portfolioChangePct: portfolio.ok ? portfolio.data.totalPLPct : null,
    sleepHours,
  });

  return (
    <DashboardView summary={summary} todos={todos} stats={stats} agenda={[]} />
  );
}
