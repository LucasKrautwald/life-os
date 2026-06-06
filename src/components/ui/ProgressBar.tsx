"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  max = 100,
  className,
  barClassName,
}: {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const over = value > max;

  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-bg-hover", className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={cn(
          "h-full rounded-full",
          over ? "bg-destructive" : "bg-accent",
          barClassName
        )}
      />
    </div>
  );
}
