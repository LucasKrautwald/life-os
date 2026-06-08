"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
import { saveTodayHighlight } from "@/app/actions/highlights";
import type { DailyHighlight } from "@/app/actions/highlights";
import { HighlightHistoryModal } from "./HighlightHistoryModal";

const MAX_LENGTH = 280;

export function DailyHighlightSection({
  initial,
}: {
  initial: DailyHighlight | null;
}) {
  const [text, setText] = useState(initial?.text ?? "");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setText(initial?.text ?? "");
  }, [initial?.text]);

  const persist = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    startTransition(() => {
      void saveTodayHighlight(trimmed);
    });
  };

  const onChange = (value: string) => {
    setText(value.slice(0, MAX_LENGTH));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim()) persist(value);
    }, 800);
  };

  const onBlur = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (text.trim()) persist(text);
  };

  return (
    <>
      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-medium text-text-secondary">
              Momento memorable del día
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            className="text-xs text-text-muted transition-colors hover:text-accent"
          >
            Ver historial
          </button>
        </div>
        <input
          type="text"
          value={text}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          maxLength={MAX_LENGTH}
          placeholder="¿Qué fue lo más memorable de hoy?"
          className="w-full border-0 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
        />
      </div>

      <HighlightHistoryModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </>
  );
}
