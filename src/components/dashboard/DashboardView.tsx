"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Focus, X } from "lucide-react";
import { DayHeader } from "./DayHeader";
import { TodosWidget } from "./TodosWidget";
import { QuickStats } from "./QuickStats";
import { Agenda } from "./Agenda";
import type { AgendaItem, QuickStats as Stats, Todo } from "@/lib/mock";
import { cn } from "@/lib/utils";

function Dimmable({
  focused,
  children,
}: {
  focused: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      animate={{
        opacity: focused ? 0.12 : 1,
        filter: focused ? "blur(2px)" : "blur(0px)",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(focused && "pointer-events-none select-none")}
    >
      {children}
    </motion.div>
  );
}

export function DashboardView({
  summary,
  todos,
  stats,
  agenda,
}: {
  summary: string;
  todos: Todo[];
  stats: Stats;
  agenda: AgendaItem[];
}) {
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocus(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative">
      {/* Focus toggle — top right */}
      <button
        onClick={() => setFocus((f) => !f)}
        className={cn(
          "absolute -top-1 right-0 z-30 flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors",
          focus
            ? "border-accent bg-accent text-bg-primary"
            : "border-border bg-bg-card text-text-secondary hover:border-accent/30 hover:text-accent"
        )}
      >
        {focus ? <X className="h-4 w-4" /> : <Focus className="h-4 w-4" />}
        {focus ? "Salir" : "Focus"}
      </button>

      <div className="space-y-10">
        <Dimmable focused={focus}>
          <DayHeader summary={summary} />
        </Dimmable>

        <motion.div
          animate={{ scale: focus ? 1.01 : 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn("relative z-20", focus && "pt-6")}
        >
          <TodosWidget initial={todos} />
        </motion.div>

        <Dimmable focused={focus}>
          <QuickStats stats={stats} />
        </Dimmable>

        <Dimmable focused={focus}>
          <Agenda items={agenda} />
        </Dimmable>
      </div>
    </div>
  );
}
