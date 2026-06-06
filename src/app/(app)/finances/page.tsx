import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardLabel } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { Tabs } from "@/components/ui/Tabs";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PortfolioTab } from "@/components/finances/PortfolioTab";
import { formatCOP, formatUSD } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  mockClients,
  mockIncome,
  mockExpenses,
  BUDGET_LIMIT_COP,
} from "@/lib/mock";

const USD_COP = 4000; // rough display rate for the agency MRR conversion

function AgencyTab() {
  const mrrUsd = mockClients
    .filter((c) => c.status === "activo")
    .reduce((acc, c) => acc + c.monthlyUsd, 0);

  const statusStyle: Record<string, string> = {
    activo: "border-success/30 bg-success/10 text-success",
    pendiente: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    pipeline: "border-border bg-bg-hover text-text-secondary",
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card index={0}>
          <CardLabel>MRR activo</CardLabel>
          <p className="mono mt-3 text-3xl font-medium">
            <CountUp value={mrrUsd} formatStyle="usd" />
          </p>
          <p className="mono mt-1 text-xs text-text-muted">
            ≈ {formatCOP(mrrUsd * USD_COP)} / mes
          </p>
        </Card>
        <Card index={1}>
          <CardLabel>Clientes</CardLabel>
          <p className="mono mt-3 text-3xl font-medium">
            <CountUp value={mockClients.filter((c) => c.status === "activo").length} />
            <span className="text-text-muted">/{mockClients.length}</span>
          </p>
          <p className="mt-1 text-xs text-text-muted">activos / totales</p>
        </Card>
      </div>

      <Card index={2} className="p-0">
        {mockClients.map((c) => (
          <div
            key={c.name}
            className="flex items-center gap-4 border-b border-border-subtle px-5 py-4 last:border-0"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium">{c.name}</p>
              <p className="truncate text-xs text-text-muted">{c.notes}</p>
            </div>
            <span className="mono text-sm">{formatUSD(c.monthlyUsd)}/mes</span>
            <span
              className={cn(
                "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                statusStyle[c.status]
              )}
            >
              {c.status}
            </span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function PersonalTab() {
  const totalIncome = mockIncome.reduce((acc, i) => acc + i.amountCop, 0);
  const totalExpenses = mockExpenses.reduce((acc, e) => acc + e.amountCop, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card index={0}>
          <CardLabel>Ingresos</CardLabel>
          <p className="mono mt-3 text-2xl font-medium text-success">
            <CountUp value={totalIncome} formatStyle="cop" />
          </p>
        </Card>
        <Card index={1}>
          <CardLabel>Gastos</CardLabel>
          <p className="mono mt-3 text-2xl font-medium text-destructive">
            <CountUp value={totalExpenses} formatStyle="cop" />
          </p>
        </Card>
        <Card index={2}>
          <CardLabel>Balance</CardLabel>
          <p className="mono mt-3 text-2xl font-medium">
            <CountUp value={balance} formatStyle="cop" />
          </p>
        </Card>
      </div>

      <Card index={3}>
        <div className="mb-3 flex items-center justify-between">
          <CardLabel>Budget del mes</CardLabel>
          <span className="mono text-xs text-text-secondary">
            {formatCOP(totalExpenses)} / {formatCOP(BUDGET_LIMIT_COP)}
          </span>
        </div>
        <ProgressBar value={totalExpenses} max={BUDGET_LIMIT_COP} />
        <p className="mt-2 text-xs text-text-muted">
          Quedan {formatCOP(Math.max(0, BUDGET_LIMIT_COP - totalExpenses))} de tu
          límite.
        </p>
      </Card>

      <Card index={4} className="p-0">
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3">
          <CardLabel>Gastos recientes</CardLabel>
          <button className="flex items-center gap-1 text-xs text-text-secondary hover:text-accent">
            <Plus className="h-3.5 w-3.5" /> Añadir
          </button>
        </div>
        {mockExpenses
          .slice()
          .reverse()
          .map((e, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-border-subtle px-5 py-3 text-sm last:border-0"
            >
              <span className="mono w-20 shrink-0 text-xs text-text-muted">
                {e.date.slice(5)}
              </span>
              <span className="w-28 shrink-0 text-text-secondary">{e.category}</span>
              <span className="min-w-0 flex-1 truncate text-text-muted">{e.note}</span>
              <span className="mono">{formatCOP(e.amountCop)}</span>
            </div>
          ))}
      </Card>
    </div>
  );
}

export default function FinancesPage() {
  return (
    <div>
      <PageHeader
        title="Finanzas"
        subtitle="Portafolio, agencia y finanzas personales."
      />
      <Tabs
        items={[
          { id: "portfolio", label: "Portafolio", content: <PortfolioTab /> },
          { id: "agency", label: "Agencia", content: <AgencyTab /> },
          { id: "personal", label: "Personal", content: <PersonalTab /> },
        ]}
      />
    </div>
  );
}
