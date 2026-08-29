export const INDUSTRIAS = [
  "Selecciona una industria",
  "Comercio y retail",
  "Distribución y logística",
  "Servicios profesionales",
  "Salud",
  "Manufactura",
  "Construcción",
  "Educación",
  "Otra",
];

export const ARCHIVOS_OPTS = ["1", "2–5", "6–15", "Más de 15"];
export const PERSONAS_OPTS = ["Solo yo", "2–5", "6–20", "Más de 20"];

// Must match backend/src/lib/validation.ts's IMPROVEMENT_CATEGORIES exactly.
export const MEJORAS_OPTS = [
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

export const STEP_LABELS: [string, string][] = [
  ["01", "Información"],
  ["02", "Proceso"],
  ["03", "Objetivo"],
];

export const NEXT_STEPS = [
  { n: "PASO 01", title: "Revisamos tu proceso", body: "Leemos lo que nos contaste y el material que adjuntaste." },
  { n: "PASO 02", title: "Sesión de 45 minutos", body: "Te proponemos horarios para resolver dudas sobre el proceso." },
  { n: "PASO 03", title: "Propuesta concreta", body: "Recibes la solución propuesta, el alcance, el plazo y el precio." },
];
