"use client";

import { useState } from "react";
import { Check, Flame } from "lucide-react";
import { CardLabel } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { AreaTag } from "@/components/ui/AreaTag";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ContributionGraph } from "./ContributionGraph";
import { AREA_BORDER } from "@/lib/constants";
import type { Habit } from "@/lib/mock";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/motion";

function HabitCard({
  habit,
  onToggle,
  index,
}: {
  habit: Habit;
  onToggle: () => void;
  index: number;
}) {
  return (
    <FadeIn index={index}>
      <div
        className="card card-hover flex min-h-[68px] items-center gap-4 p-5"
        style={{ borderLeft: `3px solid ${AREA_BORDER[habit.area]}` }}
      >
        <span
          className={cn(
            "flex-1 text-sm font-medium",
            habit.done ? "text-text-secondary" : "text-text-primary"
          )}
        >
          {habit.name}
        </span>

        <AreaTag area={habit.area} />

        <span
          className={cn(
            "mono flex w-12 items-center justify-end gap-1 text-xs",
            habit.streak > 0 ? "text-text-secondary" : "text-text-muted"
          )}
        >
          <Flame
            className={cn(
              "h-3.5 w-3.5",
              habit.streak > 0 ? "text-accent" : "text-text-muted"
            )}
          />
          {habit.streak}
        </span>

        <button
          onClick={onToggle}
          aria-label="Marcar completado"
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors",
            habit.done
              ? "border-accent bg-accent text-bg-primary"
              : "border-border hover:border-accent"
          )}
        >
          {habit.done && <Check className="h-4 w-4" strokeWidth={3} />}
        </button>
      </div>
    </FadeIn>
  );
}

export function DisciplineView({
  initial,
  contributions,
}: {
  initial: Habit[];
  contributions: number[];
}) {
  const [habits, setHabits] = useState(initial);
  const done = habits.filter((h) => h.done).length;
  const score = Math.round((done / habits.length) * 100);
  const topStreaks = [...habits].sort((a, b) => b.streak - a.streak).slice(0, 3);

  const toggle = (id: string) =>
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              done: !h.done,
              streak: h.done ? Math.max(0, h.streak - 1) : h.streak + 1,
            }
          : h
      )
    );

  return (
    <div className="grid items-start gap-5 lg:grid-cols-3">
      {/* Left column: habits + contribution graph */}
      <div className="space-y-5 lg:col-span-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-text-secondary">
              Checklist de hoy
            </h2>
            <span className="mono text-xs text-text-muted">
              {done}/{habits.length}
            </span>
          </div>
          <div className="space-y-3">
            {habits.map((h, i) => (
              <HabitCard
                key={h.id}
                habit={h}
                index={i}
                onToggle={() => toggle(h.id)}
              />
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <CardLabel>Consistencia · últimos 90 días</CardLabel>
          </div>
          <div className="mt-5 overflow-x-auto">
            <ContributionGraph levels={contributions} />
          </div>
        </div>
      </div>

      {/* Right column: score + streaks, sticky */}
      <div className="space-y-5 lg:sticky lg:top-8">
        <div className="card flex flex-col items-center p-6 text-center">
          <CardLabel>Score de disciplina hoy</CardLabel>
          <p className="mono mt-3 text-6xl font-semibold text-accent">
            <CountUp value={score} suffix="%" />
          </p>
          <div className="mt-5 w-full">
            <ProgressBar value={done} max={habits.length} />
            <p className="mt-2 text-xs text-text-muted">
              {done} de {habits.length} hábitos completados
            </p>
          </div>
        </div>

        <div className="card p-5">
          <CardLabel>Mejores rachas</CardLabel>
          <div className="mt-4 space-y-3">
            {topStreaks.map((h) => (
              <div key={h.id} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent-dim">
                  <Flame className="h-3.5 w-3.5 text-accent" />
                </span>
                <span className="flex-1 truncate text-sm text-text-secondary">
                  {h.name}
                </span>
                <span className="mono text-sm font-medium">
                  {h.streak}
                  <span className="text-text-muted"> d</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
