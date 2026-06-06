"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatDateLong, greeting } from "@/lib/format";

const ease = [0.16, 1, 0.3, 1] as const;

export function DayHeader({ summary }: { summary: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  return (
    <div className="relative">
      <div className="greeting-glow" aria-hidden />

      <motion.p
        suppressHydrationWarning
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.05 }}
        className="text-sm font-medium uppercase tracking-[0.18em] text-text-muted"
      >
        {now ? formatDateLong(now) : "\u00A0"}
      </motion.p>

      <motion.h1
        suppressHydrationWarning
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.12 }}
        className="mt-2 font-semibold tracking-tight"
      >
        <span className="block text-4xl text-text-secondary">
          {now ? `${greeting(now)},` : "Hola,"}
        </span>
        <span className="name-glow mt-1 block text-6xl text-accent sm:text-7xl">
          Lucas
        </span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.22 }}
        className="mt-5 border-l-2 border-accent pl-4"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted">
          Briefing del día
        </p>
        <p className="mt-1.5 max-w-2xl text-[15px] italic leading-relaxed text-text-secondary">
          {summary}
        </p>
      </motion.div>
    </div>
  );
}
