import {
  LayoutDashboard,
  Wallet,
  Target,
  GraduationCap,
  HeartPulse,
  TrendingUp,
  UtensilsCrossed,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { Area } from "./mock";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Finanzas", href: "/finances", icon: Wallet },
  { label: "Disciplina", href: "/discipline", icon: Target },
  { label: "Colegio", href: "/school", icon: GraduationCap },
  { label: "Health", href: "/health", icon: HeartPulse },
  { label: "Progreso", href: "/progress", icon: TrendingUp },
  { label: "Comida", href: "/food", icon: UtensilsCrossed, badge: "soon" },
];

export const SETTINGS_ITEM: NavItem = {
  label: "Settings",
  href: "/settings",
  icon: Settings,
};

/** Per-area accent styling for tags/badges. */
export const AREA_META: Record<Area, { label: string; className: string }> = {
  school: { label: "Colegio", className: "text-sky-300 bg-sky-500/10 border-sky-500/20" },
  health: { label: "Salud", className: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20" },
  agency: { label: "Agencia", className: "text-violet-300 bg-violet-500/10 border-violet-500/20" },
  finance: { label: "Finanzas", className: "text-amber-300 bg-amber-500/10 border-amber-500/20" },
  discipline: { label: "Disciplina", className: "text-rose-300 bg-rose-500/10 border-rose-500/20" },
};

/** Per-area solid accent color (used for colored left borders). */
export const AREA_BORDER: Record<Area, string> = {
  school: "#6ee7f7",
  health: "#44ff88",
  agency: "#e8ff47",
  finance: "#ff9944",
  discipline: "#ff6b9d",
};
