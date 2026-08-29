// Ported verbatim from design/dashboard.html — fictitious operational data
// for the "conceptual dashboard" that illustrates what a delivered system
// looks like.
import type { DataTableCell } from "../../components/DataTable";

export interface DashPage {
  kind: "home" | "table" | "empty";
  title: string;
  note: string;
  count?: number;
  columns?: string[];
  rows?: DataTableCell[][];
  emptyTitle?: string;
  emptyBody?: string;
  emptyCta?: string;
}

export const pages: Record<string, DashPage> = {
  Inicio: { kind: "home", title: "Inicio", note: "6 automatizaciones activas · última ejecución hace 12 minutos" },
  Clientes: {
    kind: "table",
    title: "Clientes",
    count: 4,
    note: "Los recordatorios de seguimiento se envían solos según el estado",
    columns: ["Cliente", "Contacto", "Estado", "Último contacto", "Responsable"],
    rows: [
      ["Ferretería Andes", "compras@andes.cl", { tag: "ACTIVO", tone: "neutral-solid" }, "18/08", "Marta"],
      ["Taller Nova", "nova@correo.com", { tag: "SEGUIMIENTO", tone: "accent-solid" }, "12/08", "Diego"],
      ["Distribuidora Sur", "WhatsApp", { tag: "PROPUESTA", tone: "accent-soft" }, "20/08", "Marta"],
      ["Servicios Lima", "info@slima.pe", { tag: "ACTIVO", tone: "neutral-solid" }, "22/08", "Ana"],
      ["Constructora Ríos", "—", { tag: "SIN CONTACTO", tone: "ink-solid" }, "02/07", "Sin asignar"],
      ["Import. Bravo", "bravo@ib.mx", { tag: "ACTIVO", tone: "neutral-solid" }, "21/08", "Diego"],
    ],
  },
  Procesos: {
    kind: "table",
    title: "Procesos",
    count: 3,
    note: "Cada proceso reemplazó un archivo de Excel y sus pasos manuales",
    columns: ["Proceso", "Origen", "Ejecuciones/mes", "Ahorro estimado", "Estado"],
    rows: [
      ["Control de inventario", "inventario_v7.xlsx", "1.240", "16 h", { tag: "EN USO", tone: "neutral-solid" }],
      ["Generador de cotizaciones", "cotizador.xlsx + Word", "312", "22 h", { tag: "EN USO", tone: "neutral-solid" }],
      ["Seguimiento de clientes", "contactos.xlsx + WhatsApp", "480", "9 h", { tag: "EN USO", tone: "neutral-solid" }],
      ["Cierre mensual de costos", "costos_2026.xlsx", "12", "11 h", { tag: "EN PRUEBAS", tone: "accent-soft" }],
      ["Control de horas", "planilla_horas.xlsx", "0", "—", { tag: "EN DISEÑO", tone: "ink-solid" }],
      ["Registro de incidencias", "por definir", "0", "—", { tag: "PROPUESTO", tone: "ink-solid" }],
    ],
  },
  Automatizaciones: {
    kind: "table",
    title: "Automatizaciones",
    count: 2,
    note: "Dos automatizaciones requieren revisión antes de reactivarse",
    columns: ["Automatización", "Disparador", "Última ejecución", "Estado"],
    rows: [
      ["Aviso de stock bajo", "Diario 08:00", "hoy 08:00", { tag: "ACTIVA", tone: "accent-solid" }],
      ["Cotización en PDF", "Al aprobar cotización", "hoy 11:42", { tag: "ACTIVA", tone: "accent-solid" }],
      ["Reporte mensual", "Día 1 de cada mes", "01/08 06:00", { tag: "ACTIVA", tone: "accent-solid" }],
      ["Recordatorio de seguimiento", "7 días sin contacto", "ayer 09:15", { tag: "ACTIVA", tone: "accent-solid" }],
      ["Aviso de pago pendiente", "Vencimiento +3 días", "12/08 09:00", { tag: "PAUSADA", tone: "neutral-solid" }],
      ["Sincronización contable", "Diario 23:00", "falló 20/08", { tag: "ERROR", tone: "ink-solid" }],
    ],
  },
  Reportes: {
    kind: "empty",
    title: "Reportes",
    note: "Los reportes programados llegan por correo en Excel y PDF",
    emptyTitle: "Aún no has creado un reporte propio.",
    emptyBody: "Los cuatro reportes automáticos siguen funcionando. Aquí puedes armar uno a medida eligiendo campos, filtros y periodicidad.",
    emptyCta: "Crear reporte",
  },
  Configuración: {
    kind: "empty",
    title: "Configuración",
    note: "Los cambios de configuración quedan registrados con fecha y usuario",
    emptyTitle: "Todo está configurado.",
    emptyBody: "Usuarios, permisos, stock mínimo y plantillas de documento están definidos. Cuando cambie algo del proceso, se ajusta desde aquí.",
    emptyCta: "Revisar usuarios y permisos",
  },
};

export const barVals = [42, 58, 51, 74, 66, 88, 79, 61, 92, 70, 84, 96];

export const metrics = [
  { label: "Procesos activos", value: "6", sub: "+1 este mes", subColor: "var(--color-accent-700)" },
  { label: "Horas ahorradas", value: "58", sub: "por mes, estimado", subColor: "var(--color-neutral-600)" },
  { label: "Automatizaciones", value: "4", sub: "1 pausada, 1 con error", subColor: "var(--color-accent-700)" },
  { label: "Clientes activos", value: "128", sub: "+6 vs julio", subColor: "var(--color-neutral-600)" },
];

export const alerts: { title: string; meta: string; level: string; tone: "ink-solid" | "accent-solid" | "neutral-solid"; dot: string }[] = [
  { title: "Sincronización contable falló", meta: "20/08 23:00 · credenciales vencidas", level: "ERROR", tone: "ink-solid", dot: "var(--color-accent)" },
  { title: "3 productos bajo el stock mínimo", meta: "Aviso enviado a compras", level: "ATENCIÓN", tone: "accent-solid", dot: "var(--color-accent)" },
  { title: "Constructora Ríos sin contacto en 52 días", meta: "Sin responsable asignado", level: "REVISAR", tone: "neutral-solid", dot: "var(--color-neutral-500)" },
];

export const activity = [
  { time: "11:42", text: "Cotización #2841 generada y enviada a Taller Nova" },
  { time: "10:15", text: "Diego registró una entrada de 80 u. de Correa 8mm" },
  { time: "09:03", text: "Recordatorio de seguimiento enviado a 4 clientes" },
  { time: "08:00", text: "Aviso de stock bajo enviado a compras (3 productos)" },
  { time: "ayer", text: "Marta actualizó el stock mínimo de 12 productos" },
];

export const tasks: { text: string; due: string; done: boolean }[] = [
  { text: "Revisar credenciales de la sincronización contable", due: "hoy", done: false },
  { text: "Aprobar orden de compra a Repuestos Sur", due: "hoy", done: false },
  { text: "Asignar responsable a Constructora Ríos", due: "27/08", done: false },
  { text: "Validar cierre de costos de julio", due: "hecho", done: true },
];
