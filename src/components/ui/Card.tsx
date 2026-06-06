import { cn } from "@/lib/utils";
import { FadeIn } from "./motion";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  index?: number;
}

/** Base surface card with optional hover lift + staggered entrance. */
export function Card({
  className,
  hover = false,
  index = 0,
  children,
  ...props
}: CardProps) {
  return (
    <FadeIn index={index} className="h-full">
      <div
        className={cn("card h-full p-5", hover && "card-hover", className)}
        {...props}
      >
        {children}
      </div>
    </FadeIn>
  );
}

export function CardLabel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "text-xs font-medium uppercase tracking-wider text-text-secondary",
        className
      )}
    >
      {children}
    </p>
  );
}
