// Ported verbatim from design/demo.html — fictitious inventory data used to
// power both the "Excel" view and the "converted app" view of the demo.
import type { TagTone } from "../../components/Tag";
import type { DataTableCell } from "../../components/DataTable";

export interface Sheet {
  formula: string;
  columns: string[];
  rows: string[][];
}

export const sheets: Record<string, Sheet> = {
  Productos: {
    formula: '=CONCATENAR(A2;"-";B2)',
    columns: ["SKU", "Producto", "Categoría", "Precio"],
    rows: [
      ["SKU-1042", "Filtro HP", "Filtros", "$12,40"],
      ["SKU-1043", "Correa 8mm", "Transmisión", "$8,90"],
      ["SKU-1044", "Bujía std", "Encendido", "$3,20"],
      ["SKU-1045", "Aceite 5L", "Lubricantes", "$21,00"],
      ["SKU-1046", "Manguera 1/2", "Fluidos", "$6,75"],
      ["SKU-1047", "Sensor T2", "Electrónica", "$44,10"],
    ],
  },
  Stock: {
    formula: '=SI(BUSCARV(A2;Productos!$A:$D;1;0)<>"";C2-D2;"#N/D")',
    columns: ["SKU", "Stock", "Mínimo", "Estado"],
    rows: [
      ["SKU-1042", "18", "40", "PEDIR"],
      ["SKU-1043", "142", "60", "OK"],
      ["SKU-1044", "6", "50", "PEDIR"],
      ["SKU-1045", "#¡REF!", "20", "—"],
      ["SKU-1046", "77", "30", "OK"],
      ["SKU-1047", "0", "10", "PEDIR"],
    ],
  },
  Movimientos: {
    formula: "=SUMAR.SI(Movimientos!B:B;A2;Movimientos!D:D)",
    columns: ["Fecha", "SKU", "Tipo", "Cantidad"],
    rows: [
      ["12/08", "SKU-1042", "Salida", "-24"],
      ["12/08", "SKU-1043", "Entrada", "+80"],
      ["13/08", "SKU-1047", "Salida", "-10"],
      ["14/08", "SKU-1044", "Salida", "-18"],
      ["14/08", "SKU-1045", "Entrada", "+40"],
      ["15/08", "SKU-1042", "Salida", "-6"],
    ],
  },
  Proveedores: {
    formula: "=BUSCARV(A2;Proveedores!$A:$C;3;FALSO)",
    columns: ["Proveedor", "Contacto", "Plazo", "SKU"],
    rows: [
      ["Repuestos Sur", "ventas@sur.cl", "5 días", "SKU-1042"],
      ["Distrib. Andes", "WhatsApp", "12 días", "SKU-1043"],
      ["ImportaTec", "compras@it.mx", "20 días", "SKU-1047"],
      ["Lubrimax", "—", "7 días", "SKU-1045"],
      ["Repuestos Sur", "ventas@sur.cl", "5 días", "SKU-1044"],
      ["Sin asignar", "—", "—", "SKU-1046"],
    ],
  },
  Reportes: {
    formula: '=SUMAPRODUCTO((Movimientos!A:A>=$B$1)*(Movimientos!C:C="Salida")*Movimientos!D:D)',
    columns: ["Mes", "Salidas", "Entradas", "Valor stock"],
    rows: [
      ["Mayo", "412", "380", "$79.100"],
      ["Junio", "455", "402", "$81.640"],
      ["Julio", "398", "441", "$83.900"],
      ["Agosto", "#¡VALOR!", "312", "$84.200"],
      ["Total", "1.265+", "1.535", "—"],
      ["", "", "", "revisar fórmula"],
    ],
  },
};

export function excelCellColor(v: string): string {
  return v.startsWith("#") || v === "PEDIR" || v === "revisar fórmula" ? "var(--color-accent-700)" : "var(--color-neutral-800)";
}

export const transformLogs = [
  "5 pestañas leídas · 1.248 filas",
  "12 fórmulas convertidas en reglas de negocio",
  "2 errores de referencia corregidos",
  "Aplicación generada: 4 pantallas, 4 automatizaciones",
];

export interface AppPage {
  title: string;
  kind: "metrics" | "table" | "list";
  columns?: string[];
  rows?: DataTableCell[][];
  items?: { title: string; meta: string; state: string; tone: TagTone; dot: string }[];
  note: string;
}

export const appPages: Record<string, AppPage> = {
  Resumen: {
    title: "Resumen de inventario",
    kind: "metrics",
    note: "Automatización activa: aviso de stock bajo cada mañana a las 8:00",
  },
  Productos: {
    title: "Productos",
    kind: "table",
    columns: ["SKU", "Producto", "Stock", "Estado"],
    rows: [
      ["SKU-1042", "Filtro HP", "18 u.", { tag: "PEDIR", tone: "accent-solid" }],
      ["SKU-1043", "Correa 8mm", "142 u.", { tag: "OK", tone: "neutral-solid" }],
      ["SKU-1044", "Bujía std", "6 u.", { tag: "PEDIR", tone: "accent-solid" }],
      ["SKU-1045", "Aceite 5L", "34 u.", { tag: "OK", tone: "neutral-solid" }],
      ["SKU-1046", "Manguera 1/2", "77 u.", { tag: "OK", tone: "neutral-solid" }],
      ["SKU-1047", "Sensor T2", "0 u.", { tag: "AGOTADO", tone: "ink-solid" }],
    ],
    note: "El stock se recalcula solo con cada movimiento registrado",
  },
  Movimientos: {
    title: "Movimientos",
    kind: "table",
    columns: ["Fecha", "Producto", "Tipo", "Cantidad", "Usuario"],
    rows: [
      ["15/08 09:12", "Filtro HP", { tag: "SALIDA", tone: "accent-soft" }, "-6", "Marta"],
      ["14/08 17:40", "Aceite 5L", { tag: "ENTRADA", tone: "neutral-solid" }, "+40", "Diego"],
      ["14/08 11:05", "Bujía std", { tag: "SALIDA", tone: "accent-soft" }, "-18", "Marta"],
      ["13/08 15:22", "Sensor T2", { tag: "SALIDA", tone: "accent-soft" }, "-10", "Ana"],
      ["12/08 10:03", "Correa 8mm", { tag: "ENTRADA", tone: "neutral-solid" }, "+80", "Diego"],
      ["12/08 08:55", "Filtro HP", { tag: "SALIDA", tone: "accent-soft" }, "-24", "Marta"],
    ],
    note: "Cada movimiento queda registrado con fecha, cantidad y responsable",
  },
  Alertas: {
    title: "Alertas de stock",
    kind: "list",
    items: [
      { title: "Sensor T2 sin stock", meta: "Plazo del proveedor: 20 días · ImportaTec", state: "CRÍTICO", tone: "ink-solid", dot: "var(--color-accent)" },
      { title: "Bujía std bajo el mínimo", meta: "6 u. de 50 · Repuestos Sur", state: "PEDIR", tone: "accent-solid", dot: "var(--color-accent)" },
      { title: "Filtro HP bajo el mínimo", meta: "18 u. de 40 · Repuestos Sur", state: "PEDIR", tone: "accent-solid", dot: "var(--color-accent)" },
      { title: "Manguera 1/2 sin proveedor asignado", meta: "77 u. · falta contacto de compra", state: "REVISAR", tone: "neutral-solid", dot: "var(--color-neutral-500)" },
    ],
    note: "Las alertas se envían por correo al responsable de compras",
  },
  Automatizaciones: {
    title: "Automatizaciones",
    kind: "list",
    items: [
      { title: "Aviso de stock bajo", meta: "Cada día a las 8:00 · correo a compras", state: "ACTIVA", tone: "accent-solid", dot: "var(--color-accent)" },
      { title: "Orden de compra en PDF", meta: "Al marcar un producto como PEDIR", state: "ACTIVA", tone: "accent-solid", dot: "var(--color-accent)" },
      { title: "Reporte mensual de inventario", meta: "Día 1 de cada mes · Excel + PDF", state: "ACTIVA", tone: "accent-solid", dot: "var(--color-accent)" },
      { title: "Recordatorio de conteo físico", meta: "Cada 90 días · aviso al equipo", state: "PAUSADA", tone: "neutral-solid", dot: "var(--color-neutral-500)" },
    ],
    note: "Cuatro tareas que antes dependían de que alguien se acordara",
  },
};

export const barVals = [38, 62, 48, 80, 55, 94, 70, 44, 66, 52, 88, 41, 73, 59];

export const demoMetrics = [
  { label: "SKU activos", value: "1.248", sub: "+12 este mes" },
  { label: "Stock bajo", value: "17", sub: "3 críticos" },
  { label: "Valor stock", value: "$84,2K", sub: "+0,4% vs julio" },
  { label: "Salidas hoy", value: "38", sub: "6 pendientes" },
];
