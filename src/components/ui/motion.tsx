"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

/** Subtle fade + slide-up entrance. Pass `index` for a staggered feel. */
export function FadeIn({
  index = 0,
  className,
  children,
  ...props
}: HTMLMotionProps<"div"> & { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.05,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Page-level wrapper: fade + slide up (200ms ease-out). */
export function PageTransition({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
