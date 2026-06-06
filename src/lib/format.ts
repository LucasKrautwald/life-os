const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** Format a COP amount, e.g. 1234567 -> "$ 1.234.567". */
export function formatCOP(value: number): string {
  return copFormatter.format(value);
}

/** Format a USD amount, e.g. 100 -> "$100". */
export function formatUSD(value: number): string {
  return usdFormatter.format(value);
}

/** Format a compact number, e.g. 1234567 -> "1.2M". */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Format a percentage with sign, e.g. 0.34 -> "+0.34%". */
export function formatPct(value: number, digits = 2): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

/** Capitalized, human-readable date in Spanish. */
export function formatDateLong(date: Date): string {
  const formatted = new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/** Time-of-day greeting in Spanish. */
export function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}
