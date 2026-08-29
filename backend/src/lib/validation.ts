import { z } from "zod";

// Server-side source of truth for what a diagnostic request may contain.
// Mirrors the fields defined in frontend/src/features/diagnostico, but this
// copy is what actually gets enforced — never trust client-side validation.

const trimmedString = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .transform((v) => v);

export const IMPROVEMENT_CATEGORIES = [
  "Gestión",
  "Inventario",
  "Ventas",
  "Clientes",
  "Reportes",
  "Cálculos",
  "Documentos",
  "Automatizaciones",
  "Otro",
] as const;

export const leadSchema = z.object({
  name: trimmedString(120),
  company: trimmedString(120),
  email: z.string().trim().toLowerCase().email().max(180),
  whatsapp: z.string().trim().max(40).optional().or(z.literal("")),
  industry: z.string().trim().max(80).optional().or(z.literal("")),

  currentProcess: trimmedString(2000),
  fileCount: z.string().trim().max(20).optional().or(z.literal("")),
  peopleCount: z.string().trim().max(20).optional().or(z.literal("")),
  manualParts: z.string().trim().max(2000).optional().or(z.literal("")),
  problems: z.string().trim().max(2000).optional().or(z.literal("")),
  automationGoal: z.string().trim().max(2000).optional().or(z.literal("")),

  improvementCategories: z
    .array(z.enum(IMPROVEMENT_CATEGORIES))
    .max(IMPROVEMENT_CATEGORIES.length)
    .optional()
    .default([]),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const ALLOWED_FILE_TYPES: Record<string, string[]> = {
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "application/vnd.ms-excel": [".xls"],
  "text/csv": [".csv"],
  "application/csv": [".csv"],
  "application/pdf": [".pdf"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
};

export function isAllowedFile(mimeType: string, filename: string): boolean {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf("."));
  const allowedExts = ALLOWED_FILE_TYPES[mimeType];
  if (allowedExts) return allowedExts.includes(ext);
  // Some browsers send a generic octet-stream for .xls/.csv — fall back to
  // extension whitelist only in that specific case, never for unknown mimes.
  if (mimeType === "application/octet-stream") {
    return Object.values(ALLOWED_FILE_TYPES).flat().includes(ext);
  }
  return false;
}
