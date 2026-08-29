const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

export interface DiagnosticoPayload {
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
  improvementCategories: string[];
  files: File[];
}

export interface ApiValidationError {
  error: string;
  message: string;
  issues?: { path: string; message: string }[];
}

export class LeadSubmissionError extends Error {
  status: number;
  body?: ApiValidationError;

  constructor(message: string, status: number, body?: ApiValidationError) {
    super(message);
    this.name = "LeadSubmissionError";
    this.status = status;
    this.body = body;
  }
}

export async function submitLead(payload: DiagnosticoPayload): Promise<{ id: string }> {
  const form = new FormData();
  form.set("name", payload.name);
  form.set("company", payload.company);
  form.set("email", payload.email);
  if (payload.whatsapp) form.set("whatsapp", payload.whatsapp);
  if (payload.industry) form.set("industry", payload.industry);
  form.set("currentProcess", payload.currentProcess);
  if (payload.fileCount) form.set("fileCount", payload.fileCount);
  if (payload.peopleCount) form.set("peopleCount", payload.peopleCount);
  if (payload.manualParts) form.set("manualParts", payload.manualParts);
  if (payload.problems) form.set("problems", payload.problems);
  if (payload.automationGoal) form.set("automationGoal", payload.automationGoal);
  form.set("improvementCategories", JSON.stringify(payload.improvementCategories));
  for (const file of payload.files) form.append("files", file);

  let res: Response;
  try {
    res = await fetch(apiUrl("/api/leads"), { method: "POST", body: form });
  } catch {
    throw new LeadSubmissionError("No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.", 0);
  }

  if (!res.ok) {
    let body: ApiValidationError | undefined;
    try {
      body = await res.json();
    } catch {
      /* non-JSON error body */
    }
    const message =
      body?.message ?? (res.status === 429 ? "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." : "No se pudo enviar tu solicitud. Inténtalo de nuevo.");
    throw new LeadSubmissionError(message, res.status, body);
  }

  return res.json();
}
