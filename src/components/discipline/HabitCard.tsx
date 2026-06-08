"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Check, Flame, Pencil, Trash2 } from "lucide-react";
import { AreaTag } from "@/components/ui/AreaTag";
import { AREA_BORDER } from "@/lib/constants";
import type { Habit } from "@/lib/mock";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/motion";

const SWIPE_THRESHOLD = 72;
const LONG_PRESS_MS = 500;

export function HabitCard({
  habit,
  index,
  onToggle,
  onEdit,
  onDelete,
}: {
  habit: Habit;
  index: number;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const x = useMotionValue(0);
  const actionsOpacity = useTransform(x, [-SWIPE_THRESHOLD, -20], [1, 0]);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggered = useRef(false);
  const [open, setOpen] = useState(false);

  const clearPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const snapTo = (target: number) => {
    animate(x, target, { type: "spring", stiffness: 420, damping: 32 });
    setOpen(target < 0);
  };

  const onPointerDown = () => {
    longPressTriggered.current = false;
    clearPress();
    pressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      snapTo(0);
      onEdit();
    }, LONG_PRESS_MS);
  };

  const onPointerUp = () => clearPress();
  const onPointerLeave = () => clearPress();

  return (
    <FadeIn index={index}>
      <div className="relative overflow-hidden rounded-xl">
        {/* Swipe actions */}
        <motion.div
          style={{ opacity: actionsOpacity }}
          className="absolute inset-y-0 right-0 flex items-stretch"
        >
          <button
            type="button"
            onClick={() => {
              snapTo(0);
              onEdit();
            }}
            className="flex w-14 items-center justify-center bg-bg-hover text-text-secondary hover:text-accent"
            aria-label="Editar hábito"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              snapTo(0);
              onDelete();
            }}
            className="flex w-14 items-center justify-center bg-destructive/20 text-destructive hover:bg-destructive/30"
            aria-label="Eliminar hábito"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </motion.div>

        <motion.div
          drag="x"
          dragConstraints={{ left: -SWIPE_THRESHOLD * 2, right: 0 }}
          dragElastic={0.08}
          onDragEnd={(_, info) => {
            if (info.offset.x < -SWIPE_THRESHOLD / 2) snapTo(-SWIPE_THRESHOLD * 2);
            else snapTo(0);
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerLeave}
          onPointerCancel={clearPress}
          className="card card-hover relative flex min-h-[68px] touch-pan-y items-center gap-4 p-5"
          style={{
            borderLeft: `3px solid ${AREA_BORDER[habit.area]}`,
            x,
          }}
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
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              if (longPressTriggered.current) return;
              if (open) snapTo(0);
              onToggle();
            }}
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
        </motion.div>
      </div>
    </FadeIn>
  );
}
