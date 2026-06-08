"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { AREA_META } from "@/lib/constants";
import type { Area } from "@/lib/mock";
import { cn } from "@/lib/utils";

const AREAS = Object.keys(AREA_META) as Area[];

export function HabitFormModal({
  open,
  mode,
  initialName = "",
  initialArea = "discipline",
  onClose,
  onSave,
}: {
  open: boolean;
  mode: "add" | "edit";
  initialName?: string;
  initialArea?: Area;
  onClose: () => void;
  onSave: (name: string, area: Area) => void | Promise<void>;
}) {
  const [name, setName] = useState(initialName);
  const [area, setArea] = useState<Area>(initialArea);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setArea(initialArea);
    }
  }, [open, initialName, initialArea]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave(name.trim(), area);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <form
              onSubmit={submit}
              className="card border-border p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-text-primary">
                  {mode === "add" ? "Nuevo hábito" : "Editar hábito"}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar"
                  className="text-text-muted hover:text-text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <label className="block text-xs text-text-muted">Nombre</label>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Meditar 10 min"
                className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary px-3 py-2.5 text-sm outline-none focus:border-accent/50"
              />

              <label className="mt-4 block text-xs text-text-muted">Área</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value as Area)}
                className="mt-1.5 w-full rounded-lg border border-border bg-bg-primary px-3 py-2.5 text-sm outline-none focus:border-accent/50"
              >
                {AREAS.map((a) => (
                  <option key={a} value={a}>
                    {AREA_META[a].label}
                  </option>
                ))}
              </select>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-border px-3 py-2 text-xs text-text-secondary hover:border-accent/30"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || saving}
                  className={cn(
                    "rounded-lg bg-accent px-4 py-2 text-xs font-medium text-bg-primary",
                    "hover:opacity-90 disabled:opacity-50"
                  )}
                >
                  {saving ? "Guardando…" : mode === "add" ? "Añadir" : "Guardar"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
