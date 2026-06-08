"use client";

import { useState } from "react";
import { Check, Flame } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { AreaTag } from "@/components/ui/AreaTag";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Habit } from "@/lib/mock";
import { cn } from "@/lib/utils";

export function HabitChecklist({ initial }: { initial: Habit[] }) {
  const [habits, setHabits] = useState(initial);
  const done = habits.filter((h) => h.done).length;
  const score = Math.round((done / habits.length) * 100);

  const toggle = (id: string) =>
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, done: !h.done, streak: h.done ? Math.max(0, h.streak - 1) : h.streak + 1 }
          : h
      )
    );

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-2.5">
        {habits.map((h, i) => (
          <Card key={h.id} index={i} hover className="flex items-center gap-3 p-4">
            <button
              onClick={() => toggle(h.id)}
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                h.done
                  ? "border-accent bg-accent text-bg-primary"
                  : "border-border hover:border-accent"
              )}
            >
              {h.done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            </button>
            <span
              className={cn(
                "flex-1 text-sm",
                h.done ? "text-text-secondary" : "text-text-primary"
              )}
            >
              {h.name}
            </span>
            {h.streak > 0 && (
              <span className="mono flex items-center gap-1 text-xs text-text-muted">
                <Flame className="h-3.5 w-3.5 text-accent" />
                {h.streak}
              </span>
            )}
            <AreaTag area={h.area} />
          </Card>
        ))}
      </div>

      <Card index={0} className="flex flex-col justify-center">
        <p className="text-xs uppercase tracking-wider text-text-secondary">
          Score de disciplina hoy
        </p>
        <p className="mono mt-2 text-5xl font-medium text-accent">
          <CountUp value={score} suffix="%" />
        </p>
        <div className="mt-4">
          <ProgressBar value={done} max={habits.length} />
          <p className="mt-2 text-xs text-text-muted">
            {done} de {habits.length} hábitos completados
          </p>
        </div>
      </Card>
    </div>
  );
}
