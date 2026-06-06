"use client";

import { motion } from "framer-motion";

const LEVEL_COLORS = [
  "var(--bg-hover)",
  "rgba(232,255,71,0.25)",
  "rgba(232,255,71,0.45)",
  "rgba(232,255,71,0.7)",
  "var(--accent)",
];

/** GitHub-style contribution heatmap. `levels` is a flat array (oldest → newest). */
export function ContributionGraph({ levels }: { levels: number[] }) {
  // Group into columns of 7 (weeks).
  const weeks: number[][] = [];
  for (let i = 0; i < levels.length; i += 7) {
    weeks.push(levels.slice(i, i + 7));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1 overflow-x-auto">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((level, di) => (
              <motion.div
                key={di}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (wi * 7 + di) * 0.004, duration: 0.2 }}
                className="contrib-cell"
                style={{ background: LEVEL_COLORS[level] }}
                title={`${level} de 5 hábitos`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
        <span>Menos</span>
        {LEVEL_COLORS.map((c, i) => (
          <span
            key={i}
            className="contrib-cell"
            style={{ background: c, width: 10, height: 10 }}
          />
        ))}
        <span>Más</span>
      </div>
    </div>
  );
}
