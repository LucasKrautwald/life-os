import { Moon, Activity, Footprints, HeartPulse } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardLabel } from "@/components/ui/Card";
import { TrendChart, type TrendPoint } from "@/components/ui/TrendChart";
import { getHealthData } from "@/app/actions/health";

function fmt(value: number | null, suffix = ""): string {
  if (value == null) return "--";
  return `${value.toLocaleString("es-CO", { maximumFractionDigits: 1 })}${suffix}`;
}

export default async function HealthPage() {
  const { today, sleepSeries, hrvSeries } = await getHealthData();

  const sleepPoints: TrendPoint[] = sleepSeries.map((p) => ({
    label: p.label,
    value: p.value,
  }));
  const hrvPoints: TrendPoint[] = hrvSeries.map((p) => ({
    label: p.label,
    value: p.value,
  }));

  const hasAnyData =
    today.sleepHours != null ||
    today.hrv != null ||
    today.steps != null ||
    today.restingHr != null;

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
          <p className="mono mt-3 text-2xl font-medium">{fmt(today.sleepHours, "h")}</p>
          <p className="mt-1 text-xs text-text-muted">anoche</p>
        </Card>
        <Card hover index={1}>
          <div className="flex items-center justify-between">
            <CardLabel>HRV</CardLabel>
            <Activity className="h-4 w-4 text-text-muted" />
          </div>
          <p className="mono mt-3 text-2xl font-medium">{fmt(today.hrv, " ms")}</p>
          <p className="mt-1 text-xs text-text-muted">media nocturna</p>
        </Card>
        <Card hover index={2}>
          <div className="flex items-center justify-between">
            <CardLabel>Pasos ayer</CardLabel>
            <Footprints className="h-4 w-4 text-text-muted" />
          </div>
          <p className="mono mt-3 text-2xl font-medium">{fmt(today.steps)}</p>
          <p className="mt-1 text-xs text-text-muted">Garmin</p>
        </Card>
        <Card hover index={3}>
          <div className="flex items-center justify-between">
            <CardLabel>FC reposo</CardLabel>
            <HeartPulse className="h-4 w-4 text-text-muted" />
          </div>
          <p className="mono mt-3 text-2xl font-medium">{fmt(today.restingHr, " bpm")}</p>
          <p className="mt-1 text-xs text-text-muted">en reposo</p>
        </Card>
      </section>

      {!hasAnyData ? (
        <div className="card px-6 py-14 text-center">
          <p className="text-sm font-medium text-text-secondary">
            Sin datos de salud todavía
          </p>
          <p className="mt-1 text-sm text-text-muted">
            Conecta Garmin para ver sueño, HRV, pasos y actividad aquí.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card index={0}>
            <CardLabel>Sueño · últimas 2 semanas</CardLabel>
            <div className="mt-4">
              {sleepPoints.length > 0 ? (
                <TrendChart data={sleepPoints} suffix="h" />
              ) : (
                <div className="flex h-[200px] items-center justify-center text-sm text-text-muted">
                  Sin historial de sueño
                </div>
              )}
            </div>
          </Card>
          <Card index={1}>
            <CardLabel>HRV · últimas 2 semanas</CardLabel>
            <div className="mt-4">
              {hrvPoints.length > 0 ? (
                <TrendChart data={hrvPoints} color="#44ff88" suffix=" ms" />
              ) : (
                <div className="flex h-[200px] items-center justify-center text-sm text-text-muted">
                  Sin historial de HRV
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      <section>
        <h2 className="mb-3 text-sm font-medium text-text-secondary">
          Actividades recientes
        </h2>
        <div className="card px-6 py-10 text-center text-sm text-text-muted">
          Sin actividades registradas. Garmin mostrará entrenamientos aquí.
        </div>
      </section>
    </div>
  );
}
