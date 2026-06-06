"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export function Tabs({
  items,
  layoutId = "active-tab",
}: {
  items: TabItem[];
  layoutId?: string;
}) {
  const [active, setActive] = useState(items[0]?.id);
  const current = items.find((i) => i.id === active);

  return (
    <div>
      <div className="mb-6 inline-flex items-center gap-1 rounded-lg border border-border bg-bg-secondary p-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={cn(
              "relative rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              active === item.id
                ? "text-bg-primary"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            {active === item.id && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-md bg-accent"
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}
      </div>
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {current?.content}
      </motion.div>
    </div>
  );
}
