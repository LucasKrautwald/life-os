import { AREA_META } from "@/lib/constants";
import type { Area } from "@/lib/mock";
import { cn } from "@/lib/utils";

export function AreaTag({ area, className }: { area: Area; className?: string }) {
  const meta = AREA_META[area];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        meta.className,
        className
      )}
    >
      {meta.label}
    </span>
  );
}
