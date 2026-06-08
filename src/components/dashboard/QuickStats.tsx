"use client";

import { Wallet, TrendingUp, Moon, CheckCircle2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardLabel } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { formatPct } from "@/lib/format";
import type { QuickStats as Stats } from "@/lib/mock";
import { cn } from "@/lib/utils";

const COLORS = {
  finances: "#e8ff47",
  portfolio: "#44ff88",
  sleep: "#6ee7f7",
  habits: "#ff9944",
};

const leftBorder = (color: string) => ({
  borderLeft: `3px solid ${color}`,
});

function StatValue({
  value,
  formatStyle,
  decimals,
  suffix,
  fallback = "--",
}: {
  value: number | null;
  formatStyle?: "cop" | "usd";
  decimals?: number;
  suffix?: string;
  fallback?: string;
}) {
  if (value == null) {
    return (
      <span className="mono text-4xl font-medium tracking-tight text-text-muted">
        {fallback}
      </span>
    );
  }
  return (
    <span className="mono text-4xl font-medium tracking-tight">
      <CountUp
        value={value}
        formatStyle={formatStyle}
        decimals={decimals}
        suffix={suffix}
      />
    </span>
  );
}

export function QuickStats({ stats }: { stats: Stats }) {
  const positive = (stats.portfolioChangePct ?? 0) >= 0;
  const Arrow = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Card hover index={0} style={leftBorder(COLORS.finances)}>
        <div className="flex items-center justify-between">
          <CardLabel className="text-[10px]">Balance mes</CardLabel>
          <Wallet className="h-4 w-4 text-text-muted" />
        </div>
        <p className="mt-2">
          <StatValue value={stats.monthlyBalanceCop} formatStyle="cop" />
        </p>
        <p className="mt-2 text-xs text-text-muted">ingresos − gastos</p>
      </Card>

      <Card hover index={1} style={leftBorder(COLORS.portfolio)}>
        <div className="flex items-center justify-between">
          <CardLabel className="text-[10px]">Portafolio</CardLabel>
          <TrendingUp className="h-4 w-4 text-text-muted" />
        </div>
        <p className="mt-2">
          <StatValue value={stats.portfolioValueCop} formatStyle="cop" />
        </p>
        <div className="mt-2">
          {stats.portfolioChangePct != null ? (
            <span
              className={cn(
                "mono flex items-center gap-0.5 text-xs",
                positive ? "text-success" : "text-destructive"
              )}
            >
              <Arrow className="h-3 w-3" />
              {formatPct(stats.portfolioChangePct)}
            </span>
          ) : (
            <span className="text-xs text-text-muted">Sin datos de Sheets</span>
          )}
        </div>
      </Card>

      <Card hover index={2} style={leftBorder(COLORS.sleep)}>
        <div className="flex items-center justify-between">
          <CardLabel className="text-[10px]">Sueño</CardLabel>
          <Moon className="h-4 w-4 text-text-muted" />
        </div>
        <p className="mt-2">
          <StatValue
            value={stats.sleepHours}
            decimals={1}
            suffix="h"
            fallback="--"
          />
        </p>
        <p className="mt-2 text-xs text-text-muted">anoche · Garmin</p>
      </Card>

      <Card hover index={3} style={leftBorder(COLORS.habits)}>
        <div className="flex items-center justify-between">
          <CardLabel className="text-[10px]">Hábitos</CardLabel>
          <CheckCircle2 className="h-4 w-4 text-text-muted" />
        </div>
        <p className="mono mt-2 text-4xl font-medium tracking-tight">
          <CountUp value={stats.habitsDone} />
          <span className="text-text-muted">/{stats.habitsTotal}</span>
        </p>
        <p className="mt-2 text-xs text-text-muted">completados hoy</p>
      </Card>
    </section>
  );
}
