import { DashboardView } from "@/components/dashboard/DashboardView";
import { mockAgenda, mockStats, mockSummary, mockTodos } from "@/lib/mock";

export default function DashboardPage() {
  return (
    <DashboardView
      summary={mockSummary}
      todos={mockTodos}
      stats={mockStats}
      agenda={mockAgenda}
    />
  );
}
