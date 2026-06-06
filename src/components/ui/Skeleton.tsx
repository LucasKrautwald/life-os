import { cn } from "@/lib/utils";

/** Pulsing-gradient placeholder used while data is being fetched. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

/** A card-shaped skeleton block. */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("card space-y-3 p-5", className)}>
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-full" />
    </div>
  );
}
