import { ArrowUpRight, ArrowDownRight, Trophy, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardLabel } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { ScoreHistory } from "@/components/progress/ScoreHistory";
import { getProgressData } from "@/app/actions/progress";
import { cn } from "@/lib/utils";

export default async function ProgressPage() {
  const { globalScore, areas, history } = await getProgressData();

  const best = areas.length
    ? [...areas].sort((a, b) => b.delta - a.delta)[0]
    : null;
  const worst = areas.length
    ? [...areas].sort((a, b) => a.score - b.score)[0]
    : null;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Progreso"
        subtitle="Score por área, calculado automáticamente cada día."
      />

      <Card className="flex flex-col items-center py-10 text-center">
        <CardLabel>Score global</CardLabel>
        {globalScore != null ? (
          <p className="mono mt-2 text-7xl font-medium text-accent">
            <CountUp value={globalScore} />
          </p>
        ) : (
          <p className="mono mt-2 text-7xl font-medium text-text-muted">--</p>
        )}
        <p className="mt-2 text-sm text-text-muted">
          {areas.length > 0
            ? "promedio de las áreas con datos"
            : "Sin scores calculados todavía"}
        </p>
      </Card>

      {areas.length === 0 ? (
        <div className="card px-6 py-14 text-center">
          <p className="text-sm font-medium text-text-secondary">
            No hay scores registrados
          </p>
          <p className="mt-1 text-sm text-text-muted">
            Los scores se calculan automáticamente desde tus hábitos, colegio y
            finanzas conforme conectes cada módulo.
          </p>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            {areas.map((s, i) => {
              const up = s.delta >= 0;
              return (
                <Card key={s.key} hover index={i}>
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{s.emoji}</span>
                    <span
                      className={cn(
                        "mono flex items-center gap-0.5 text-xs",
                        up ? "text-success" : "text-destructive"
                      )}
                    >
                      {up ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {Math.abs(s.delta)}
                    </span>
                  </div>
                  <p className="mono mt-3 text-3xl font-medium">
                    <CountUp value={s.score} />
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">{s.label}</p>
                </Card>
              );
            })}
          </section>

          <Card>
            <CardLabel>Histórico · últimos 30 días</CardLabel>
            <div className="mt-4">
              {history.length > 0 ? (
                <ScoreHistory scores={areas} history={history} />
              ) : (
                <div className="flex h-[280px] items-center justify-center text-sm text-text-muted">
                  Sin historial todavía
                </div>
              )}
            </div>
          </Card>

          {best && worst && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Card index={0} className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-dim text-accent">
                  <Trophy className="h-5 w-5" />
                </span>
                <div>
                  <CardLabel>Mejor racha</CardLabel>
                  <p className="mt-1 text-sm">
                    {best.emoji} {best.label} ·{" "}
                    <span className="text-success">+{best.delta}</span> esta semana
                  </p>
                </div>
              </Card>
              <Card index={1} className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div>
                  <CardLabel>Peor área</CardLabel>
                  <p className="mt-1 text-sm">
                    {worst.emoji} {worst.label} ·{" "}
                    <span className="text-text-muted">{worst.score}/100</span>
                  </p>
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
