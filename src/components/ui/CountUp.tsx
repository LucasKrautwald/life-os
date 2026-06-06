"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { formatCOP, formatUSD } from "@/lib/format";

/** Serializable format style (safe to pass from Server Components). */
type FormatStyle = "cop" | "usd";

interface CountUpProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Currency formatter applied to the animated value. */
  formatStyle?: FormatStyle;
  className?: string;
}

/** Animated count-up that triggers when scrolled into view. */
export function CountUp({
  value,
  duration = 0.9,
  decimals = 0,
  prefix = "",
  suffix = "",
  formatStyle,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  let rendered: string;
  if (formatStyle === "cop") {
    rendered = formatCOP(display);
  } else if (formatStyle === "usd") {
    rendered = formatUSD(display);
  } else {
    rendered = `${prefix}${display.toLocaleString("es-CO", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;
  }

  return (
    <span ref={ref} className={className}>
      {rendered}
    </span>
  );
}
