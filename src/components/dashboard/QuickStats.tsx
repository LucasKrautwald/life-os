"use client";

import { Wallet, TrendingUp, Moon, CheckCircle2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardLabel } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { Sparkline } from "@/components/ui/Sparkline";
import { formatPct } from "@/lib/format";
import type { QuickStats as Stats } from "@/lib/mock";
import { cn } from "@/lib/utils";

// Small illustrative trends (mock) for the sparklines.
const SPARKS = {
  balance: [120, 90, 160, 140, 210, 180, 280],
  portfolio: [17.9, 18.0, 17.8, 18.1, 18.2, 18.3, 18.45],
  sleep: [6.8, 7.2, 6.5, 7.6, 7.1, 7.0, 7.4],
  habits: [2, 4, 3, 5, 3, 4, 3],
};

const COLORS = {
  finances: "#e8ff47",
  portfolio: "#44ff88",
  sleep: "#6ee7f7",
  habits: "#ff9944",
};

const leftBorder = (color: string) => ({
  borderLeft: `3px solid ${color}`,
});

export function QuickStats({ stats }: { stats: Stats }) {
  const positive = stats.portfolioChangePct >= 0;
  const Arrow = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Card hover index={0} style={leftBorder(COLORS.finances)}>
        <div className="flex items-center justify-between">
          <CardLabel className="text-[10px]">Balance mes</CardLabel>
          <Wallet className="h-4 w-4 text-text-muted" />
        </div>
        <p className="mono mt-2 text-4xl font-medium tracking-tight">
          <CountUp value={stats.monthlyBalanceCop} formatStyle="cop" />
        </p>
        <div className="mt-2 flex items-end justify-between">
          <span className="text-xs text-text-muted">ingresos − gastos</span>
          <Sparkline data={SPARKS.balance} stroke={COLORS.finances} />
        </div>
      </Card>

      <Card hover index={1} style={leftBorder(COLORS.portfolio)}>
        <div className="flex items-center justify-between">
          <CardLabel className="text-[10px]">Portafolio</CardLabel>
          <TrendingUp className="h-4 w-4 text-text-muted" />
        </div>
        <p className="mono mt-2 text-4xl font-medium tracking-tight">
          <CountUp value={stats.portfolioValueCop} formatStyle="cop" />
        </p>
        <div className="mt-2 flex items-end justify-between">
          <span
            className={cn(
              "mono flex items-center gap-0.5 text-xs",
              positive ? "text-success" : "text-destructive"
            )}
          >
            <Arrow className="h-3 w-3" />
            {formatPct(stats.portfolioChangePct)}
          </span>
          <Sparkline
            data={SPARKS.portfolio}
            stroke={positive ? COLORS.portfolio : "var(--destructive)"}
          />
        </div>
      </Card>

      <Card hover index={2} style={leftBorder(COLORS.sleep)}>
        <div className="flex items-center justify-between">
          <CardLabel className="text-[10px]">Sueño</CardLabel>
          <Moon className="h-4 w-4 text-text-muted" />
        </div>
        <p className="mono mt-2 text-4xl font-medium tracking-tight">
          <CountUp value={stats.sleepHours} decimals={1} suffix="h" />
        </p>
        <div className="mt-2 flex items-end justify-between">
          <span className="text-xs text-text-muted">anoche · Garmin</span>
          <Sparkline data={SPARKS.sleep} stroke={COLORS.sleep} />
        </div>
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
        <div className="mt-2 flex items-end justify-between">
          <span className="text-xs text-text-muted">completados hoy</span>
          <Sparkline data={SPARKS.habits} stroke={COLORS.habits} />
        </div>
      </Card>
    </section>
  );
}
