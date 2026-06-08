/** Date helpers anchored to Lucas's timezone (Medellín / America/Bogota). */

const TZ = "America/Bogota";
const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ });

/** Today's date in Bogota as YYYY-MM-DD. */
export function todayISO(): string {
  return fmt.format(new Date());
}

/** The last `n` dates (YYYY-MM-DD), oldest first, ending today. */
export function lastNDates(n: number): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    out.push(fmt.format(d));
  }
  return out;
}
