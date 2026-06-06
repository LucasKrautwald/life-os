import { AlertTriangle, Wallet, TrendingUp, Coins, Layers } from "lucide-react";
import { Card, CardLabel } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { Tabs } from "@/components/ui/Tabs";
import { RefreshButton } from "@/components/finances/RefreshButton";
import { formatCOP, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  getPortfolio,
  type PortfolioData,
  type Position,
  type SoldPosition,
  type Dividend,
} from "@/app/actions/portfolio";

const sharesFmt = (n: number) =>
  n.toLocaleString("es-CO", { maximumFractionDigits: 4 });

function plClass(value: number) {
  return value >= 0 ? "text-success" : "text-destructive";
}

/* ----------------------------- Tables ----------------------------- */

function PositionsTable({ positions }: { positions: Position[] }) {
  if (positions.length === 0) {
    return <EmptyRow label="Sin posiciones activas." />;
  }
  return (
    <Card className="overflow-x-auto p-0">
      <div className="min-w-[760px]">
        <div className="grid grid-cols-[1.6fr_0.8fr_1fr_1fr_1.2fr_1.1fr_0.7fr] gap-2 border-b border-border-subtle px-5 py-3 text-[11px] uppercase tracking-wider text-text-muted">
          <span>Nombre</span>
          <span className="text-right">Acciones</span>
          <span className="text-right">Costo prom.</span>
          <span className="text-right">Precio actual</span>
          <span className="text-right">Valor COP</span>
          <span className="text-right">P&amp;L COP</span>
          <span className="text-right">P&amp;L %</span>
        </div>
        {positions.map((p) => (
          <div
            key={p.name}
            className="grid grid-cols-[1.6fr_0.8fr_1fr_1fr_1.2fr_1.1fr_0.7fr] items-center gap-2 border-b border-border-subtle px-5 py-3 text-sm transition-colors last:border-0 hover:bg-bg-hover"
          >
            <span className="truncate font-medium">{p.name}</span>
            <span className="mono text-right text-text-secondary">
              {sharesFmt(p.shares)}
            </span>
            <span className="mono text-right text-text-secondary">
              {formatCOP(p.avgCost)}
            </span>
            <span className="mono text-right text-text-secondary">
              {formatCOP(p.currentPrice)}
            </span>
            <span className="mono text-right">{formatCOP(p.currentValue)}</span>
            <span className={cn("mono text-right", plClass(p.plAbs))}>
              {formatCOP(p.plAbs)}
            </span>
            <span className={cn("mono text-right", plClass(p.plPct))}>
              {formatPct(p.plPct, 1)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SoldTable({ sold }: { sold: SoldPosition[] }) {
  if (sold.length === 0) {
    return <EmptyRow label="Sin ventas registradas." />;
  }
  return (
    <Card className="overflow-x-auto p-0">
      <div className="min-w-[680px]">
        <div className="grid grid-cols-[1.6fr_1fr_0.8fr_1.2fr_1.1fr_0.7fr] gap-2 border-b border-border-subtle px-5 py-3 text-[11px] uppercase tracking-wider text-text-muted">
          <span>Nombre</span>
          <span>Fecha</span>
          <span className="text-right">Acciones</span>
          <span className="text-right">Valor venta</span>
          <span className="text-right">P&amp;L COP</span>
          <span className="text-right">P&amp;L %</span>
        </div>
        {sold.map((s, i) => (
          <div
            key={`${s.name}-${i}`}
            className="grid grid-cols-[1.6fr_1fr_0.8fr_1.2fr_1.1fr_0.7fr] items-center gap-2 border-b border-border-subtle px-5 py-3 text-sm transition-colors last:border-0 hover:bg-bg-hover"
          >
            <span className="truncate font-medium">{s.name}</span>
            <span className="mono text-text-secondary">{s.date || "—"}</span>
            <span className="mono text-right text-text-secondary">
              {sharesFmt(s.shares)}
            </span>
            <span className="mono text-right">{formatCOP(s.saleValue)}</span>
            <span className={cn("mono text-right", plClass(s.plAbs))}>
              {formatCOP(s.plAbs)}
            </span>
            <span className={cn("mono text-right", plClass(s.plPct))}>
              {formatPct(s.plPct, 1)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DividendsTable({ dividends }: { dividends: Dividend[] }) {
  if (dividends.length === 0) {
    return <EmptyRow label="Sin dividendos registrados." />;
  }
  return (
    <Card className="p-0">
      <div className="grid grid-cols-[2fr_1fr] gap-2 border-b border-border-subtle px-5 py-3 text-[11px] uppercase tracking-wider text-text-muted">
        <span>Nombre</span>
        <span className="text-right">Dividendos recibidos</span>
      </div>
      {dividends.map((d, i) => (
        <div
          key={`${d.name}-${i}`}
          className="grid grid-cols-[2fr_1fr] items-center gap-2 border-b border-border-subtle px-5 py-3 text-sm transition-colors last:border-0 hover:bg-bg-hover"
        >
          <span className="truncate font-medium">{d.name}</span>
          <span className="mono text-right text-success">
            {formatCOP(d.received)}
          </span>
        </div>
      ))}
    </Card>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <Card className="p-6 text-center text-sm text-text-muted">{label}</Card>
  );
}

/* ----------------------------- Stat cards ----------------------------- */

function StatCards({ data }: { data: PortfolioData }) {
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Card hover index={0}>
        <div className="flex items-center justify-between">
          <CardLabel>Valor total</CardLabel>
          <Wallet className="h-4 w-4 text-text-muted" />
        </div>
        <p className="mono mt-3 text-2xl font-medium">
          <CountUp value={data.totalValue} formatStyle="cop" />
        </p>
        <p className="mt-1 text-xs text-text-muted">portafolio en COP</p>
      </Card>

      <Card hover index={1}>
        <div className="flex items-center justify-between">
          <CardLabel>P&amp;L total</CardLabel>
          <TrendingUp className="h-4 w-4 text-text-muted" />
        </div>
        <p className={cn("mono mt-3 text-2xl font-medium", plClass(data.totalPL))}>
          <CountUp value={data.totalPL} formatStyle="cop" />
        </p>
        <p className={cn("mono mt-1 text-xs", plClass(data.totalPLPct))}>
          {formatPct(data.totalPLPct, 1)}
        </p>
      </Card>

      <Card hover index={2}>
        <div className="flex items-center justify-between">
          <CardLabel>Dividendos</CardLabel>
          <Coins className="h-4 w-4 text-text-muted" />
        </div>
        <p className="mono mt-3 text-2xl font-medium text-success">
          <CountUp value={data.totalDividends} formatStyle="cop" />
        </p>
        <p className="mt-1 text-xs text-text-muted">recibidos en total</p>
      </Card>

      <Card hover index={3}>
        <div className="flex items-center justify-between">
          <CardLabel>Posiciones</CardLabel>
          <Layers className="h-4 w-4 text-text-muted" />
        </div>
        <p className="mono mt-3 text-2xl font-medium">
          <CountUp value={data.positionCount} />
        </p>
        <p className="mt-1 text-xs text-text-muted">acciones activas</p>
      </Card>
    </section>
  );
}

/* ----------------------------- Error state ----------------------------- */

function ErrorState({ error }: { error: string }) {
  return (
    <Card className="flex flex-col items-center gap-3 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </span>
      <div>
        <p className="text-sm font-medium">No se pudo cargar el portafolio</p>
        <p className="mx-auto mt-1 max-w-md text-xs text-text-muted">{error}</p>
      </div>
      <RefreshButton />
    </Card>
  );
}

/* ----------------------------- Main ----------------------------- */

export async function PortfolioTab() {
  const result = await getPortfolio();

  if (!result.ok) {
    return <ErrorState error={result.error} />;
  }

  const { data } = result;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-end">
        <RefreshButton fetchedAt={result.fetchedAt} />
      </div>

      <StatCards data={data} />

      <Tabs
        layoutId="portfolio-subtab"
        items={[
          {
            id: "positions",
            label: `Posiciones (${data.positions.length})`,
            content: <PositionsTable positions={data.positions} />,
          },
          {
            id: "sold",
            label: `Vendidas (${data.sold.length})`,
            content: <SoldTable sold={data.sold} />,
          },
          {
            id: "dividends",
            label: `Dividendos (${data.dividends.length})`,
            content: <DividendsTable dividends={data.dividends} />,
          },
        ]}
      />
    </div>
  );
}
