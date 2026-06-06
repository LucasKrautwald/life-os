"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Bottom tab bar shown on small screens (sidebar is hidden there). */
export function MobileNav() {
  const pathname = usePathname();
  const items = NAV_ITEMS.slice(0, 6);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-bg-secondary/90 px-2 py-2 backdrop-blur md:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-[10px] transition-colors",
              active ? "text-accent" : "text-text-muted"
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
          </Link>
        );
      })}
    </nav>
  );
}
