"use server";

import { google } from "googleapis";
import { unstable_cache, revalidateTag } from "next/cache";

/* ----------------------------- Types ----------------------------- */

export interface Position {
  name: string;
  shares: number;
  avgCost: number;
  totalCost: number;
  currentPrice: number;
  currentValue: number;
  plAbs: number;
  plPct: number;
}

export interface SoldPosition {
  name: string;
  date: string;
  shares: number;
  saleValue: number;
  plAbs: number;
  plPct: number;
}

export interface Dividend {
  name: string;
  received: number;
}

export interface PortfolioData {
  totalValue: number;
  totalPL: number;
  totalPLPct: number;
  totalDividends: number;
  positionCount: number;
  positions: Position[];
  sold: SoldPosition[];
  dividends: Dividend[];
}

export type PortfolioResult =
  | { ok: true; data: PortfolioData; fetchedAt: string }
  | { ok: false; error: string };

const PORTFOLIO_TAG = "portfolio";

/* ----------------------------- Helpers ----------------------------- */

type Cell = string | number | boolean | null | undefined;
type Row = Cell[];

/** Coerce a sheet cell into a number, tolerating Colombian-formatted strings. */
function num(cell: Cell): number {
  if (typeof cell === "number") return cell;
  if (typeof cell !== "string") return 0;

  let s = cell.trim();
  if (!s) return 0;

  const negative = /^\(.*\)$/.test(s) || s.includes("-");
  s = s.replace(/[^\d.,]/g, "");
  if (!s) return 0;

  const hasDot = s.includes(".");
  const hasComma = s.includes(",");

  if (hasDot && hasComma) {
    // "1.234.567,89" → dot = thousands, comma = decimal
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    // "1234,89" → comma decimal
    s = s.replace(",", ".");
  }

  const value = parseFloat(s);
  if (Number.isNaN(value)) return 0;
  return negative && value > 0 ? -value : value;
}

/** Normalize a percentage cell: fractions (0.052) become 5.2. */
function pct(cell: Cell): number {
  const n = num(cell);
  return Math.abs(n) > 0 && Math.abs(n) < 1 ? n * 100 : n;
}

function str(cell: Cell): string {
  return cell == null ? "" : String(cell).trim();
}

function getSpreadsheetId(): string {
  return (
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID ??
    "1_lIcwT-9Npo7g_wZ0DEyP1wLW2-yqIzE8NJLfSl9CCQ"
  );
}

function getSheetsClient() {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n"
  );

  if (!clientEmail || !privateKey) {
    throw new Error(
      "Faltan credenciales: GOOGLE_SHEETS_CLIENT_EMAIL y GOOGLE_SHEETS_PRIVATE_KEY."
    );
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  return google.sheets({ version: "v4", auth });
}

/** Reads + parses the spreadsheet. Throws on failure (caller handles). */
async function fetchPortfolio(): Promise<PortfolioData> {
  const sheets = getSheetsClient();

  const ranges = [
    "'Acciones Compra'!B13:I28",
    "'Acciones vendidas'!B2:I20",
    "'Dividendos'!B2:C17",
    "'Depositos/retiros portfolio'!F6",
  ];

  const res = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: getSpreadsheetId(),
    ranges,
    valueRenderOption: "UNFORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
  });

  const valueRanges = res.data.valueRanges ?? [];
  const buy = (valueRanges[0]?.values ?? []) as Row[];
  const soldRows = (valueRanges[1]?.values ?? []) as Row[];
  const divRows = (valueRanges[2]?.values ?? []) as Row[];
  const totalCell = valueRanges[3]?.values?.[0]?.[0] as Cell;

  const positions: Position[] = buy
    .filter((r) => str(r[0]))
    .map((r) => ({
      name: str(r[0]),
      shares: num(r[1]),
      avgCost: num(r[2]),
      totalCost: num(r[3]),
      currentPrice: num(r[4]),
      currentValue: num(r[5]),
      plAbs: num(r[6]),
      plPct: pct(r[7]),
    }));

  const sold: SoldPosition[] = soldRows
    .filter((r) => str(r[0]))
    .map((r) => ({
      name: str(r[0]),
      date: str(r[1]),
      shares: num(r[2]),
      saleValue: num(r[3]),
      plAbs: num(r[6]),
      plPct: pct(r[7]),
    }));

  const dividends: Dividend[] = divRows
    .filter((r) => str(r[0]))
    .map((r) => ({
      name: str(r[0]),
      received: num(r[1]),
    }));

  const totalCost = positions.reduce((acc, p) => acc + p.totalCost, 0);
  const totalPL = positions.reduce((acc, p) => acc + p.plAbs, 0);
  const totalDividends = dividends.reduce((acc, d) => acc + d.received, 0);
  const sheetTotal = num(totalCell);
  const totalValue =
    sheetTotal > 0
      ? sheetTotal
      : positions.reduce((acc, p) => acc + p.currentValue, 0);

  return {
    totalValue,
    totalPL,
    totalPLPct: totalCost > 0 ? (totalPL / totalCost) * 100 : 0,
    totalDividends,
    positionCount: positions.length,
    positions,
    sold,
    dividends,
  };
}

/** Cached for 1 hour; bust with `revalidateTag('portfolio')`. */
const getCachedPortfolio = unstable_cache(fetchPortfolio, ["portfolio-data"], {
  revalidate: 3600,
  tags: [PORTFOLIO_TAG],
});

/* ----------------------------- Public API ----------------------------- */

/** Server action: returns portfolio data or a graceful error result. */
export async function getPortfolio(): Promise<PortfolioResult> {
  try {
    const data = await getCachedPortfolio();
    return { ok: true, data, fetchedAt: new Date().toISOString() };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error desconocido al leer la hoja.";
    return { ok: false, error: message };
  }
}

/** Server action: invalidate the cache so the next read is fresh. */
export async function refreshPortfolio(): Promise<void> {
  revalidateTag(PORTFOLIO_TAG);
}
