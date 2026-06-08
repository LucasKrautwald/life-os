"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, ChevronDown, Plus } from "lucide-react";
import { Card, CardLabel } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { Sparkline } from "@/components/ui/Sparkline";
import { TrendChart, type TrendPoint } from "@/components/ui/TrendChart";
import type { Subject } from "@/lib/mock";
import { cn } from "@/lib/utils";

interface Grade {
  date: string;
  description: string;
  grade: number;
  max: number;
}

function gradeColor(value: number): string {
  if (value >= 6) return "text-success";
  if (value >= 5) return "text-accent";
  return "text-destructive";
}

function SubjectDetail({ grades }: { grades: Grade[] }) {
  const chart: TrendPoint[] = grades.map((g, i) => ({
    label: `N${i + 1}`,
    value: g.grade,
  }));

  return (
    <div className="grid gap-6 border-t border-border-subtle p-5 lg:grid-cols-[1fr_1.1fr]">
      <div className="min-w-0">
        <CardLabel>Notas</CardLabel>
        {grades.length === 0 ? (
          <p className="mt-3 text-sm text-text-muted">Sin notas registradas.</p>
        ) : (
          <div className="mt-3 overflow-hidden rounded-lg border border-border-subtle">
            <div className="grid grid-cols-[1fr_auto_auto] gap-3 bg-bg-secondary/60 px-3 py-2 text-[10px] uppercase tracking-wider text-text-muted">
              <span>Descripción</span>
              <span className="text-right">Fecha</span>
              <span className="text-right">Nota</span>
            </div>
            {grades.map((g, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-t border-border-subtle px-3 py-2 text-sm"
              >
                <span className="truncate text-text-secondary">{g.description}</span>
                <span className="mono text-right text-xs text-text-muted">{g.date}</span>
                <span className={cn("mono text-right font-medium", gradeColor(g.grade))}>
                  {g.grade.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <CardLabel>Evolución</CardLabel>
        <div className="mt-3">
          {chart.length > 0 ? (
            <TrendChart data={chart} height={232} />
          ) : (
            <div className="flex h-[232px] items-center justify-center rounded-lg border border-border-subtle text-sm text-text-muted">
              Sin historial de notas
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SubjectCard({
  subject,
  open,
  onToggle,
  index,
}: {
  subject: Subject;
  open: boolean;
  onToggle: () => void;
  index: number;
}) {
  const spark: number[] = [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      className={cn(
        "card self-start overflow-hidden",
        open ? "border-accent/40" : "card-hover"
      )}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 p-5 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{subject.name}</p>
          <p className="mt-0.5 text-xs text-text-muted">
            {subject.gradeCount} notas
          </p>
        </div>

        {spark.length > 0 && (
          <Sparkline data={spark} width={64} height={28} fill={false} />
        )}

        <div className="flex items-baseline gap-1">
          <span className={cn("mono text-3xl font-medium", gradeColor(subject.average))}>
            {subject.average.toFixed(1)}
          </span>
          <span className="mono text-xs text-text-muted">/7</span>
        </div>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-text-muted"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <SubjectDetail grades={[]} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function SchoolView({ subjects }: { subjects: Subject[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (subjects.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-hover text-text-muted">
          <GraduationCap className="h-6 w-6" />
        </span>
        <p className="text-sm font-medium text-text-secondary">
          No hay materias todavía
        </p>
        <p className="mt-1 max-w-sm text-sm text-text-muted">
          Añade tus materias IB para registrar notas y ver tu promedio.
        </p>
        <button
          type="button"
          className="mt-5 rounded-full border border-[#333] px-4 py-1.5 text-sm text-[#888] transition-colors hover:border-[#e8ff47] hover:text-[#e8ff47]"
        >
          <span className="flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Añadir materia
          </span>
        </button>
      </div>
    );
  }

  const overall =
    subjects.reduce((acc, s) => acc + s.average, 0) / subjects.length;
  const totalGrades = subjects.reduce((acc, s) => acc + s.gradeCount, 0);
  const best = [...subjects].sort((a, b) => b.average - a.average)[0];

  return (
    <div className="space-y-6">
      <Card hover className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-dim text-accent">
            <GraduationCap className="h-6 w-6" />
          </span>
          <div>
            <CardLabel>Promedio IB general</CardLabel>
            <p className={cn("mono mt-1 text-4xl font-semibold", gradeColor(overall))}>
              <CountUp value={overall} decimals={2} />
              <span className="text-lg text-text-muted"> / 7</span>
            </p>
          </div>
        </div>
        <div className="flex gap-8 sm:gap-10">
          <div>
            <CardLabel>Materias</CardLabel>
            <p className="mono mt-1 text-2xl font-medium">{subjects.length}</p>
          </div>
          <div>
            <CardLabel>Notas</CardLabel>
            <p className="mono mt-1 text-2xl font-medium">{totalGrades}</p>
          </div>
          <div>
            <CardLabel>Mejor</CardLabel>
            <p className="mono mt-1 text-2xl font-medium text-success">
              {best?.average.toFixed(1)}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {subjects.map((s, i) => (
          <SubjectCard
            key={s.id}
            subject={s}
            index={i}
            open={openId === s.id}
            onToggle={() => setOpenId((prev) => (prev === s.id ? null : s.id))}
          />
        ))}
      </div>
    </div>
  );
}
