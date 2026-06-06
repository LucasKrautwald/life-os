import { Moon, Activity, Footprints, HeartPulse } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardLabel } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { TrendChart, type TrendPoint } from "@/components/ui/TrendChart";
import { mockHealth, mockActivities, buildSeries } from "@/lib/mock";

const toPoints = (
  series: { day: number; value: number }[]
): TrendPoint[] => series.map((s) => ({ label: s.day + 1, value: s.value }));

export default function HealthPage() {
  const sleepSeries = toPoints(buildSeries(7.2, 0.9));
  const hrvSeries = toPoints(buildSeries(64, 8));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Health"
        subtitle="Datos de Garmin y Apple Health — sueño, HRV, actividad."
      />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card hover index={0}>
          <div className="flex items-center justify-between">
            <CardLabel>Sueño</CardLabel>
            <Moon className="h-4 w-4 text-text-muted" />
          </div>
          <p className="mono mt-3 text-2xl font-medium">
            <CountUp value={mockHealth.sleepHours} decimals={1} suffix="h" />
          </p>
          <p className="mt-1 text-xs text-success">buena recuperación</p>
        </Card>
        <Card hover index={1}>
          <div className="flex items-center justify-between">
            <CardLabel>HRV</CardLabel>
            <Activity className="h-4 w-4 text-text-muted" />
          </div>
          <p className="mono mt-3 text-2xl font-medium">
            <CountUp value={mockHealth.hrv} suffix=" ms" />
          </p>
          <p className="mt-1 text-xs text-text-muted">media nocturna</p>
        </Card>
        <Card hover index={2}>
          <div className="flex items-center justify-between">
            <CardLabel>Pasos ayer</CardLabel>
            <Footprints className="h-4 w-4 text-text-muted" />
          </div>
          <p className="mono mt-3 text-2xl font-medium">
            <CountUp value={mockHealth.steps} />
          </p>
          <p className="mt-1 text-xs text-success">meta 8.000 ✓</p>
        </Card>
        <Card hover index={3}>
          <div className="flex items-center justify-between">
            <CardLabel>FC reposo</CardLabel>
            <HeartPulse className="h-4 w-4 text-text-muted" />
          </div>
          <p className="mono mt-3 text-2xl font-medium">
            <CountUp value={mockHealth.restingHr} suffix=" bpm" />
          </p>
          <p className="mt-1 text-xs text-text-muted">en reposo</p>
        </Card>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card index={0}>
          <CardLabel>Sueño · últimas 2 semanas</CardLabel>
          <div className="mt-4">
            <TrendChart data={sleepSeries} suffix="h" />
          </div>
        </Card>
        <Card index={1}>
          <CardLabel>HRV · últimas 2 semanas</CardLabel>
          <div className="mt-4">
            <TrendChart data={hrvSeries} color="#44ff88" suffix=" ms" />
          </div>
        </Card>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-medium text-text-secondary">
          Actividades recientes
        </h2>
        <Card className="divide-y divide-border-subtle p-0">
          {mockActivities.map((a, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5">
              <span className="w-16 shrink-0 text-sm font-medium">{a.type}</span>
              <span className="min-w-0 flex-1 truncate text-sm text-text-secondary">
                {a.detail}
              </span>
              <span className="shrink-0 text-xs text-text-muted">{a.date}</span>
            </div>
          ))}
        </Card>
      </section>
    </div>
  );
}
