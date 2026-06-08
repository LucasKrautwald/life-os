import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardLabel } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { Tabs } from "@/components/ui/Tabs";
import { PortfolioTab } from "@/components/finances/PortfolioTab";
import { formatCOP, formatUSD } from "@/lib/format";
import { REAL_AGENCY_CLIENTS } from "@/lib/mock";
import { cn } from "@/lib/utils";

const USD_COP = 4000;

function AgencyTab() {
  const clients = REAL_AGENCY_CLIENTS;
  const mrrUsd = clients
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
            <CountUp value={clients.filter((c) => c.status === "activo").length} />
            <span className="text-text-muted">/{clients.length}</span>
          </p>
          <p className="mt-1 text-xs text-text-muted">activos / totales</p>
        </Card>
      </div>

      <Card index={2} className="p-0">
        {clients.map((c) => (
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
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card index={0}>
          <CardLabel>Ingresos</CardLabel>
          <p className="mono mt-3 text-2xl font-medium text-text-muted">--</p>
        </Card>
        <Card index={1}>
          <CardLabel>Gastos</CardLabel>
          <p className="mono mt-3 text-2xl font-medium text-text-muted">--</p>
        </Card>
        <Card index={2}>
          <CardLabel>Balance</CardLabel>
          <p className="mono mt-3 text-2xl font-medium text-text-muted">--</p>
        </Card>
      </div>

      <div className="card px-6 py-14 text-center">
        <p className="text-sm font-medium text-text-secondary">
          Sin finanzas personales registradas
        </p>
        <p className="mt-1 text-sm text-text-muted">
          Añade ingresos y gastos para ver tu balance y budget del mes.
        </p>
        <button
          type="button"
          className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-[#333] px-4 py-1.5 text-sm text-[#888] transition-colors hover:border-[#e8ff47] hover:text-[#e8ff47]"
        >
          <Plus className="h-3.5 w-3.5" />
          Añadir gasto
        </button>
      </div>
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
