export interface DiagnosticoFields {
  name: string;
  company: string;
  email: string;
  whatsapp: string;
  industry: string;
  currentProcess: string;
  fileCount: string;
  peopleCount: string;
  manualParts: string;
  problems: string;
  automationGoal: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type RequiredField = "name" | "company" | "email" | "currentProcess";

export function isFieldInvalid(fields: DiagnosticoFields, key: RequiredField): boolean {
  const value = fields[key].trim();
  if (key === "email") return !EMAIL_RE.test(value);
  return value.length === 0;
}

export const STEP_REQUIRED_FIELDS: Record<1 | 2, RequiredField[]> = {
  1: ["name", "company", "email"],
  2: ["currentProcess"],
};

export function fieldErrorMessage(key: RequiredField): string {
  switch (key) {
    case "name":
      return "Necesitamos tu nombre para responderte.";
    case "company":
      return "Indica la empresa o el nombre de tu negocio.";
    case "email":
      return "Revisa el correo: falta el formato nombre@dominio.";
    case "currentProcess":
      return "Cuéntanos brevemente para qué usas el archivo.";
  }
}
