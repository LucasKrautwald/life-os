import { UtensilsCrossed } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

const meals = ["Desayuno", "Almuerzo", "Cena", "Snacks"];

export default function FoodPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Comida"
        subtitle="Fase 2 — log diario simple con rating rápido."
      />

      <Card className="flex flex-col items-center gap-3 py-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-dim text-accent">
          <UtensilsCrossed className="h-6 w-6" />
        </span>
        <p className="text-sm text-text-secondary">
          Este módulo llega en la Fase 2.
        </p>
        <span className="rounded-full border border-border bg-bg-hover px-2 py-0.5 text-[10px] uppercase tracking-wide text-text-muted">
          soon
        </span>
      </Card>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {meals.map((meal, i) => (
          <Card key={meal} index={i} className="opacity-60">
            <p className="text-sm font-medium">{meal}</p>
            <p className="mt-2 text-xs text-text-muted">Texto libre…</p>
            <div className="mt-4 flex gap-2 text-lg">
              <span>🟢</span>
              <span>🟡</span>
              <span>🔴</span>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
