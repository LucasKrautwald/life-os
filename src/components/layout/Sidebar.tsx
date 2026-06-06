"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen, Zap } from "lucide-react";
import { NAV_ITEMS, SETTINGS_ITEM, type NavItem } from "@/lib/constants";
import { cn } from "@/lib/utils";

function NavLink({
  item,
  expanded,
  active,
}: {
  item: NavItem;
  expanded: boolean;
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      title={item.label}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
        active
          ? "bg-accent-dim text-accent"
          : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
      )}
    >
      {active && (
        <motion.span
          layoutId="active-nav"
          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent"
        />
      )}
      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={active ? 2.4 : 2} />
      {expanded && (
        <span className="relative flex-1 truncate font-medium">
          {item.label}
          {!active && <span className="nav-underline" />}
        </span>
      )}
      {expanded && item.badge && (
        <span className="rounded-full border border-border bg-bg-hover px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-text-muted">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-expanded");
    if (stored !== null) setExpanded(stored === "true");
  }, []);

  const toggle = () => {
    setExpanded((prev) => {
      localStorage.setItem("sidebar-expanded", String(!prev));
      return !prev;
    });
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <motion.aside
      initial={false}
      animate={{ width: expanded ? 220 : 64 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-border bg-bg-secondary md:flex"
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-bg-primary">
          <Zap className="h-[18px] w-[18px]" fill="currentColor" />
        </span>
        {expanded && (
          <span className="text-sm font-semibold tracking-tight">
            LIFE OS
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-2 py-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            expanded={expanded}
            active={isActive(item.href)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="flex flex-col gap-1 border-t border-border-subtle px-2 py-3">
        {/* Lucas avatar */}
        <div
          className={cn(
            "mb-1 flex items-center gap-3 rounded-lg px-2 py-1.5",
            expanded && "bg-bg-hover/40"
          )}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold tracking-tight text-bg-primary">
            LK
          </span>
          {expanded && (
            <div className="min-w-0 leading-tight">
              <p className="truncate text-xs font-medium text-text-primary">
                Lucas
              </p>
              <p className="truncate text-[11px] text-text-muted">
                11° IB · Medellín
              </p>
            </div>
          )}
        </div>

        <NavLink
          item={SETTINGS_ITEM}
          expanded={expanded}
          active={isActive(SETTINGS_ITEM.href)}
        />
        <button
          onClick={toggle}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-muted transition-colors hover:bg-bg-hover hover:text-text-primary"
        >
          {expanded ? (
            <PanelLeftClose className="h-[18px] w-[18px] shrink-0" />
          ) : (
            <PanelLeftOpen className="h-[18px] w-[18px] shrink-0" />
          )}
          {expanded && <span className="font-medium">Colapsar</span>}
        </button>
      </div>
    </motion.aside>
  );
}
