import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";
import {
  parseWorkbookFile,
  findNumericColumn,
  scaleToPercent,
  WorkbookParseError,
  MAX_ROWS,
  MAX_FILE_SIZE_MB,
} from "./xlsxParser";

function makeXlsxFile(sheetsData: Record<string, unknown[][]>, fileName = "prueba.xlsx"): File {
  const workbook = XLSX.utils.book_new();
  for (const [name, rows] of Object.entries(sheetsData)) {
    const sheet = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, sheet, name);
  }
  const buffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
  return new File([buffer], fileName, { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}

describe("parseWorkbookFile", () => {
  it("parses a simple sheet into columns and rows", async () => {
    const file = makeXlsxFile({
      Productos: [
        ["SKU", "Nombre", "Stock"],
        ["A1", "Filtro", 10],
        ["A2", "Correa", 25],
      ],
    });

    const result = await parseWorkbookFile(file);

    expect(result.fileName).toBe("prueba.xlsx");
    expect(result.sheetOrder).toEqual(["Productos"]);
    expect(result.sheets.Productos?.columns).toEqual(["SKU", "Nombre", "Stock"]);
    expect(result.sheets.Productos?.rows).toEqual([
      ["A1", "Filtro", "10"],
      ["A2", "Correa", "25"],
    ]);
  });

  it("keeps sheets in their original order", async () => {
    const file = makeXlsxFile({
      Ventas: [["Mes"], ["Enero"]],
      Costos: [["Mes"], ["Enero"]],
    });

    const result = await parseWorkbookFile(file);
    expect(result.sheetOrder).toEqual(["Ventas", "Costos"]);
  });

  it("rejects a disallowed extension", async () => {
    const file = new File(["contenido"], "archivo.exe", { type: "application/octet-stream" });
    await expect(parseWorkbookFile(file)).rejects.toThrow(WorkbookParseError);
  });

  it("rejects a file over the size limit", async () => {
    const big = new File([new Uint8Array((MAX_FILE_SIZE_MB + 1) * 1024 * 1024)], "grande.xlsx");
    await expect(parseWorkbookFile(big)).rejects.toThrow(/pesa más de/);
  });

  it("rejects an empty file", async () => {
    const file = new File([], "vacio.xlsx");
    await expect(parseWorkbookFile(file)).rejects.toThrow(/vacío/);
  });

  it("rejects a file with no readable rows", async () => {
    const file = makeXlsxFile({ Hoja1: [] });
    await expect(parseWorkbookFile(file)).rejects.toThrow(WorkbookParseError);
  });

  it("truncates rows beyond the cap and flags it", async () => {
    const header = ["N"];
    const rows = Array.from({ length: MAX_ROWS + 10 }, (_, i) => [i]);
    const file = makeXlsxFile({ Datos: [header, ...rows] });

    const result = await parseWorkbookFile(file);
    expect(result.sheets.Datos?.rows).toHaveLength(MAX_ROWS);
    expect(result.sheets.Datos?.truncatedRows).toBe(true);
  });

  it("fills a blank header cell with a generic column label", async () => {
    const file = makeXlsxFile({ Hoja1: [["SKU", ""], ["A1", "x"]] });
    const result = await parseWorkbookFile(file);
    expect(result.sheets.Hoja1?.columns[1]).toBe("Columna 2");
  });
});

describe("findNumericColumn", () => {
  it("finds the first fully-numeric column", () => {
    const sheet = {
      columns: ["Nombre", "Stock"],
      rows: [
        ["Filtro", "10"],
        ["Correa", "25"],
      ],
      truncatedRows: false,
      truncatedCols: false,
    };
    const result = findNumericColumn(sheet);
    expect(result).toEqual({ label: "Stock", values: [10, 25] });
  });

  it("returns null when no column is fully numeric", () => {
    const sheet = {
      columns: ["Nombre"],
      rows: [["Filtro"], ["Correa"]],
      truncatedRows: false,
      truncatedCols: false,
    };
    expect(findNumericColumn(sheet)).toBeNull();
  });

  it("returns null for an empty sheet", () => {
    expect(findNumericColumn({ columns: [], rows: [], truncatedRows: false, truncatedCols: false })).toBeNull();
  });
});

describe("scaleToPercent", () => {
  it("scales values relative to the largest magnitude", () => {
    expect(scaleToPercent([10, 20, 40])).toEqual([25, 50, 100]);
  });

  it("handles all-zero input without dividing by zero", () => {
    expect(scaleToPercent([0, 0])).toEqual([0, 0]);
  });
});
