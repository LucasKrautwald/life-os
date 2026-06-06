"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import type { AreaScore } from "@/lib/mock";

const COLORS: Record<string, string> = {
  health: "#44ff88",
  discipline: "#ff6b9d",
  school: "#5eb3ff",
  finance: "#ffc857",
  agency: "#b388ff",
};

export function ScoreHistory({ scores }: { scores: AreaScore[] }) {
  const data = Array.from({ length: 30 }, (_, i) => {
    const point: Record<string, number | string> = { label: i + 1 };
    scores.forEach((s) => {
      point[s.key] = Math.round(
        Math.min(100, Math.max(40, s.score - s.delta + (i / 30) * s.delta + Math.sin(i / 3) * 4))
      );
    });
    return point;
  });

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid stroke="var(--border-subtle)" vertical={false} />
        <XAxis
          dataKey="label"
          stroke="var(--text-muted)"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          minTickGap={24}
        />
        <YAxis
          domain={[40, 100]}
          stroke="var(--text-muted)"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={36}
        />
        <Tooltip
          contentStyle={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {scores.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={COLORS[s.key]}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
