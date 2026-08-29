// Client-side mirror of backend/src/lib/validation.ts's file rules. This is
// a UX convenience only — the server re-validates everything and is the
// actual source of truth, since client-side checks can always be bypassed.

export const ALLOWED_EXTENSIONS = [".xlsx", ".xls", ".csv", ".pdf", ".png", ".jpg", ".jpeg"];
export const MAX_FILE_SIZE_MB = 25;
export const MAX_FILES = 5;

export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function extensionOf(filename: string): string {
  const idx = filename.lastIndexOf(".");
  return idx === -1 ? "" : filename.slice(idx).toLowerCase();
}

export interface FileValidationResult {
  accepted: File[];
  errors: string[];
}

export function validateNewFiles(existing: File[], incoming: File[]): FileValidationResult {
  const accepted: File[] = [];
  const errors: string[] = [];
  const existingKeys = new Set(existing.map((f) => `${f.name}:${f.size}`));

  for (const file of incoming) {
    const key = `${file.name}:${file.size}`;
    if (existingKeys.has(key)) continue; // silently skip exact duplicates

    if (!ALLOWED_EXTENSIONS.includes(extensionOf(file.name))) {
      errors.push(`${file.name}: tipo de archivo no permitido. Usa .xlsx, .xls, .csv, .pdf, .png o .jpg.`);
      continue;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      errors.push(`${file.name}: pesa más de ${MAX_FILE_SIZE_MB} MB.`);
      continue;
    }
    if (existing.length + accepted.length >= MAX_FILES) {
      errors.push(`Puedes adjuntar hasta ${MAX_FILES} archivos.`);
      break;
    }
    existingKeys.add(key);
    accepted.push(file);
  }

  return { accepted, errors };
}
