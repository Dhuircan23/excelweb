import { describe, expect, it } from "vitest";
import { validateNewFiles, formatFileSize, MAX_FILE_SIZE_MB, MAX_FILES } from "./fileValidation";

function makeFile(name: string, sizeBytes: number, type = "text/csv"): File {
  return new File([new Uint8Array(sizeBytes)], name, { type });
}

describe("validateNewFiles", () => {
  it("accepts a file with an allowed extension", () => {
    const { accepted, errors } = validateNewFiles([], [makeFile("inventario.xlsx", 1024)]);
    expect(accepted).toHaveLength(1);
    expect(errors).toHaveLength(0);
  });

  it("rejects a disallowed extension with a clear message", () => {
    const { accepted, errors } = validateNewFiles([], [makeFile("virus.exe", 1024)]);
    expect(accepted).toHaveLength(0);
    expect(errors[0]).toContain("no permitido");
  });

  it("rejects a file over the size limit", () => {
    const big = makeFile("grande.csv", (MAX_FILE_SIZE_MB + 1) * 1024 * 1024);
    const { accepted, errors } = validateNewFiles([], [big]);
    expect(accepted).toHaveLength(0);
    expect(errors[0]).toContain("MB");
  });

  it("caps the total number of files", () => {
    const existing = Array.from({ length: MAX_FILES }, (_, i) => makeFile(`f${i}.csv`, 100));
    const { accepted, errors } = validateNewFiles(existing, [makeFile("one-more.csv", 100)]);
    expect(accepted).toHaveLength(0);
    expect(errors[0]).toContain(`hasta ${MAX_FILES}`);
  });

  it("silently skips an exact duplicate (same name and size)", () => {
    const existing = [makeFile("inventario.xlsx", 1024)];
    const { accepted, errors } = validateNewFiles(existing, [makeFile("inventario.xlsx", 1024)]);
    expect(accepted).toHaveLength(0);
    expect(errors).toHaveLength(0);
  });

  it("accepts multiple valid files in one batch", () => {
    const { accepted } = validateNewFiles([], [makeFile("a.pdf", 100), makeFile("b.png", 100), makeFile("c.csv", 100)]);
    expect(accepted).toHaveLength(3);
  });
});

describe("formatFileSize", () => {
  it("formats bytes under 1MB as KB", () => {
    expect(formatFileSize(2048)).toBe("2 KB");
  });

  it("formats bytes at or above 1MB as MB", () => {
    expect(formatFileSize(2.5 * 1024 * 1024)).toBe("2.5 MB");
  });
});
