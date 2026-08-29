import { describe, expect, it } from "vitest";
import { leadSchema, isAllowedFile } from "../lib/validation.js";

describe("leadSchema", () => {
  const base = {
    name: "Ana Torres",
    company: "Ferretería Andes",
    email: "ana@andes.cl",
    currentProcess: "Controlamos el inventario en Excel",
  };

  it("accepts a minimal valid lead", () => {
    const result = leadSchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  it("rejects a missing required field", () => {
    const { name, ...rest } = base;
    const result = leadSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = leadSchema.safeParse({ ...base, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects an empty required string (whitespace only)", () => {
    const result = leadSchema.safeParse({ ...base, currentProcess: "   " });
    expect(result.success).toBe(false);
  });

  it("normalizes email to lowercase", () => {
    const result = leadSchema.safeParse({ ...base, email: "Ana@ANDES.CL" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe("ana@andes.cl");
  });

  it("rejects an improvement category outside the fixed list", () => {
    const result = leadSchema.safeParse({ ...base, improvementCategories: ["Marketing"] });
    expect(result.success).toBe(false);
  });

  it("accepts valid improvement categories", () => {
    const result = leadSchema.safeParse({ ...base, improvementCategories: ["Inventario", "Reportes"] });
    expect(result.success).toBe(true);
  });
});

describe("isAllowedFile", () => {
  it("accepts an .xlsx with the correct mime type", () => {
    expect(isAllowedFile("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "inventario.xlsx")).toBe(true);
  });

  it("accepts a .csv sent as octet-stream (common browser quirk)", () => {
    expect(isAllowedFile("application/octet-stream", "datos.csv")).toBe(true);
  });

  it("rejects an executable disguised with an allowed mime type", () => {
    expect(isAllowedFile("application/pdf", "virus.exe")).toBe(false);
  });

  it("rejects an unknown mime type entirely", () => {
    expect(isAllowedFile("application/x-msdownload", "virus.exe")).toBe(false);
  });
});
