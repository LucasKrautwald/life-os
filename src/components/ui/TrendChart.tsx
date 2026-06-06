"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export interface TrendPoint {
  label: string | number;
  value: number;
}

export function TrendChart({
  data,
  color = "var(--accent)",
  height = 220,
  suffix = "",
}: {
  data: TrendPoint[];
  color?: string;
  height?: number;
  suffix?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
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
          stroke="var(--text-muted)"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={48}
        />
        <Tooltip
          cursor={{ stroke: "var(--border)" }}
          contentStyle={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: "var(--text-secondary)" }}
          formatter={(v) => [`${v}${suffix}`, ""] as [string, string]}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: color }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
