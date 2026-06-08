"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Flame, Moon } from "lucide-react";
import { CardLabel } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ContributionGraph } from "./ContributionGraph";
import { HabitCard } from "./HabitCard";
import { HabitFormModal } from "./HabitFormModal";
import { DailyHighlightSection } from "./DailyHighlightSection";
import {
  createHabit,
  deleteHabit,
  toggleHabit,
  updateHabit,
} from "@/app/actions/habits";
import type { ContributionDay } from "@/app/actions/habits";
import type { DailyHighlight } from "@/app/actions/highlights";
import type { Area, Habit } from "@/lib/mock";

type FormState =
  | { open: false }
  | { open: true; mode: "add" }
  | { open: true; mode: "edit"; habit: Habit };

export function DisciplineView({
  initial,
  contributions,
  initialScore,
  highlight,
  sleepHours,
}: {
  initial: Habit[];
  contributions: ContributionDay[];
  initialScore: number;
  highlight: DailyHighlight | null;
  sleepHours: number | null;
}) {
  const [habits, setHabits] = useState(initial);
  const [form, setForm] = useState<FormState>({ open: false });
  const [, startTransition] = useTransition();
  const router = useRouter();

  const done = habits.filter((h) => h.done).length;
  const score = habits.length
    ? Math.round((done / habits.length) * 100)
    : initialScore;
  const topStreaks = [...habits].sort((a, b) => b.streak - a.streak).slice(0, 3);

  const toggle = (id: string) => {
    const current = habits.find((h) => h.id === id);
    if (!current) return;
    const next = !current.done;
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              done: next,
              streak: next ? h.streak + 1 : Math.max(0, h.streak - 1),
            }
          : h
      )
    );
    startTransition(() => {
      void toggleHabit(id, next);
    });
  };

  const handleCreate = async (name: string, area: Area) => {
    const created = await createHabit(name, area);
    if (created) {
      setHabits((prev) => [...prev, created]);
      router.refresh();
    }
  };

  const handleUpdate = async (name: string, area: Area) => {
    if (!form.open || form.mode !== "edit") return;
    const id = form.habit.id;
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, name, area } : h))
    );
    startTransition(async () => {
      await updateHabit(id, name, area);
      router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar este hábito?")) return;
    setHabits((prev) => prev.filter((h) => h.id !== id));
    startTransition(async () => {
      await deleteHabit(id);
      router.refresh();
    });
  };

  const sleepLabel =
    sleepHours != null ? `${sleepHours.toFixed(1)} h` : "--";

  return (
    <div className="space-y-5">
      <DailyHighlightSection initial={highlight} />

      <div className="grid items-start gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-medium text-text-secondary">
                  Checklist de hoy
                </h2>
                <button
                  type="button"
                  onClick={() => setForm({ open: true, mode: "add" })}
                  className="rounded-full border border-[#333] px-3 py-1 text-sm text-[#888] transition-colors hover:border-[#e8ff47] hover:text-[#e8ff47]"
                >
                  Añadir hábito
                </button>
              </div>
              <span className="mono text-xs text-text-muted">
                {done}/{habits.length}
              </span>
            </div>
            <div className="space-y-3">
              {habits.length === 0 ? (
                <div className="card p-6 text-center text-sm text-text-muted">
                  No hay hábitos. Pulsa «Añadir hábito» para crear el primero.
                </div>
              ) : (
                habits.map((h, i) => (
                  <HabitCard
                    key={h.id}
                    habit={h}
                    index={i}
                    onToggle={() => toggle(h.id)}
                    onEdit={() => setForm({ open: true, mode: "edit", habit: h })}
                    onDelete={() => handleDelete(h.id)}
                  />
                ))
              )}
            </div>
          </div>

          <div className="card p-5">
            <CardLabel>Consistencia · últimos 90 días</CardLabel>
            <div className="mt-5 overflow-x-auto">
              <ContributionGraph days={contributions} />
            </div>
          </div>
        </div>

        <div className="space-y-5 lg:sticky lg:top-8">
          <div className="card flex flex-col items-center p-6 text-center">
            <CardLabel>Score de disciplina hoy</CardLabel>
            <p className="mono mt-3 text-6xl font-semibold text-accent">
              <CountUp value={score} suffix="%" />
            </p>
            <div className="mt-5 w-full">
              <ProgressBar value={done} max={habits.length || 1} />
              <p className="mt-2 text-xs text-text-muted">
                {done} de {habits.length} hábitos completados
              </p>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-sky-300" />
              <CardLabel>Horas de sueño</CardLabel>
            </div>
            <p className="mono mt-3 text-3xl font-medium text-text-primary">
              {sleepLabel}
            </p>
            <p className="mt-1 text-xs text-text-muted">
              {sleepHours != null
                ? "Sincronizado desde Garmin"
                : "Sin datos de Garmin todavía"}
            </p>
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

      <HabitFormModal
        open={form.open}
        mode={form.open ? form.mode : "add"}
        initialName={form.open && form.mode === "edit" ? form.habit.name : ""}
        initialArea={
          form.open && form.mode === "edit" ? form.habit.area : "discipline"
        }
        onClose={() => setForm({ open: false })}
        onSave={form.open && form.mode === "edit" ? handleUpdate : handleCreate}
      />
    </div>
  );
}
