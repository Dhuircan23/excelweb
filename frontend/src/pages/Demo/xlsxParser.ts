// Parses a real spreadsheet the visitor uploads, entirely in the browser —
// the file is never sent anywhere. Used only by the opt-in "sube tu propio
// Excel" flow in the demo; the curated fictional inventory demo in
// content.ts is untouched by this.
//
// Security note: this uses `xlsx` (SheetJS) 0.18.5 from npm, which has two
// known unpatched advisories (prototype pollution, ReDoS — SheetJS moved
// patched builds to their own CDN, which isn't reachable from this
// environment). The blast radius here is narrow: parsing happens
// client-side only, on a file the visitor themselves chooses, and results
// are extracted into plain string arrays rather than spread into any
// shared object — there's no path from a malicious file to our server or
// to another visitor's session. Revisit if SheetJS's CDN becomes reachable
// or a vetted alternative appears.

export const MAX_FILE_SIZE_MB = 8;
export const MAX_SHEETS = 8;
export const MAX_ROWS = 60;
export const MAX_COLS = 12;
export const ALLOWED_EXTENSIONS = [".xlsx", ".xls", ".csv"];

export interface ParsedSheet {
  columns: string[];
  rows: string[][];
  truncatedRows: boolean;
  truncatedCols: boolean;
}

export interface ParsedWorkbook {
  fileName: string;
  sheetOrder: string[];
  sheets: Record<string, ParsedSheet>;
  truncatedSheets: boolean;
}

export class WorkbookParseError extends Error {}

function extensionOf(filename: string): string {
  const idx = filename.lastIndexOf(".");
  return idx === -1 ? "" : filename.slice(idx).toLowerCase();
}

function cellToText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toLocaleDateString("es");
  return String(value);
}

export async function parseWorkbookFile(file: File): Promise<ParsedWorkbook> {
  if (!ALLOWED_EXTENSIONS.includes(extensionOf(file.name))) {
    throw new WorkbookParseError("Usa un archivo .xlsx, .xls o .csv.");
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new WorkbookParseError(`El archivo pesa más de ${MAX_FILE_SIZE_MB} MB.`);
  }
  if (file.size === 0) {
    throw new WorkbookParseError("El archivo está vacío.");
  }

  const buffer = await file.arrayBuffer();

  // Dynamically imported so the ~1MB parser only loads when someone
  // actually uses this feature, not on every /demo page load.
  const XLSX = await import("xlsx");

  let workbook: ReturnType<typeof XLSX.read>;
  try {
    workbook = XLSX.read(buffer, { type: "array", cellDates: true });
  } catch {
    throw new WorkbookParseError("No pudimos leer ese archivo. ¿Seguro que es un Excel o CSV válido?");
  }

  const allSheetNames = workbook.SheetNames.filter((name) => workbook.Sheets[name]);
  if (allSheetNames.length === 0) {
    throw new WorkbookParseError("Ese archivo no tiene hojas con datos.");
  }

  const sheetOrder = allSheetNames.slice(0, MAX_SHEETS);
  const sheets: Record<string, ParsedSheet> = {};

  for (const name of sheetOrder) {
    const worksheet = workbook.Sheets[name];
    const grid = XLSX.utils.sheet_to_json<unknown[]>(worksheet, { header: 1, blankrows: false, defval: "" });
    if (grid.length === 0) continue;

    const [headerRow, ...dataRows] = grid;
    const truncatedCols = headerRow.length > MAX_COLS;
    const columns = headerRow.slice(0, MAX_COLS).map((c, i) => (cellToText(c).trim() || `Columna ${i + 1}`));

    const truncatedRows = dataRows.length > MAX_ROWS;
    const rows = dataRows.slice(0, MAX_ROWS).map((row) => columns.map((_, i) => cellToText(row[i])));

    sheets[name] = { columns, rows, truncatedRows, truncatedCols };
  }

  const nonEmptySheetNames = sheetOrder.filter((name) => sheets[name]);
  if (nonEmptySheetNames.length === 0) {
    throw new WorkbookParseError("Ese archivo no tiene filas con datos.");
  }

  return {
    fileName: file.name,
    sheetOrder: nonEmptySheetNames,
    sheets,
    truncatedSheets: allSheetNames.length > MAX_SHEETS,
  };
}

/** A column is chargeable if every value in it parses as a finite number. */
export function findNumericColumn(sheet: ParsedSheet): { label: string; values: number[] } | null {
  for (let colIndex = 0; colIndex < sheet.columns.length; colIndex++) {
    const raw = sheet.rows.map((row) => row[colIndex]);
    if (raw.length === 0) continue;
    const values = raw.map((v) => Number(String(v).replace(/,/g, "")));
    if (values.every((v) => Number.isFinite(v))) {
      return { label: sheet.columns[colIndex] ?? `Columna ${colIndex + 1}`, values };
    }
  }
  return null;
}

/** Scales arbitrary numbers into 0-100 bar heights for the BarChart component. */
export function scaleToPercent(values: number[]): number[] {
  const max = Math.max(...values.map((v) => Math.abs(v)), 1);
  return values.map((v) => Math.round((Math.abs(v) / max) * 100));
}
