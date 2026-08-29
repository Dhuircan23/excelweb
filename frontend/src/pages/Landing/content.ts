// Copy and data ported verbatim from design/index.html (the Claude Design
// deliverable) — see especificacion.html §02 for the section order this
// content is meant to fill.

export const excelCells = [
  "SKU-1042", "Filtro HP", "18", "PEDIR",
  "SKU-1043", "Correa 8mm", "142", "OK",
  "SKU-1044", "Bujía std", "6", "PEDIR",
  "SKU-1045", "Aceite 5L", "#¡REF!", "—",
  "SKU-1046", "Manguera", "77", "OK",
  "SKU-1047", "Sensor T2", "0", "PEDIR",
];

export const heroMetrics = [
  { label: "SKU activos", value: "1.248" },
  { label: "Stock bajo", value: "17" },
  { label: "Valor stock", value: "$84,2K" },
];

export const heroBars = [38, 62, 48, 80, 55, 94, 70, 44, 66];

export const heroRows: { name: string; qty: string; state: string; tone: "accent" | "neutral" | "ink" }[] = [
  { name: "Filtro HP", qty: "18 u.", state: "PEDIR", tone: "accent" },
  { name: "Correa 8mm", qty: "142 u.", state: "OK", tone: "neutral" },
  { name: "Sensor T2", qty: "0 u.", state: "AGOTADO", tone: "ink" },
];

export const problems = [
  "Tu negocio depende de varios Excel que solo una persona entiende del todo.",
  "Hay que copiar y pegar información entre archivos, correos y WhatsApp.",
  "Los cálculos viven en fórmulas largas que nadie se atreve a tocar.",
  "Armar el reporte del mes toma horas que podrían ser minutos.",
  "Los archivos se duplican: v2, v3, final, final_ok.",
  "La información está dispersa y nunca coincide del todo.",
  "Si esa persona no está, el proceso se detiene.",
];

export const chain = [
  { step: "PASO 1", arrow: "→", title: "Proceso manual", body: "Tu Excel actual, con sus pestañas, sus fórmulas y sus pasos a mano." },
  { step: "PASO 2", arrow: "→", title: "Digitalización", body: "Los datos pasan a un sistema web con formularios, validaciones y permisos." },
  { step: "PASO 3", arrow: "→", title: "Automatización", body: "Cálculos, avisos, documentos y correos ocurren solos, sin que nadie los recuerde." },
  { step: "PASO 4", arrow: "■", title: "Control", body: "Dashboards y reportes al día, con una sola versión de la verdad." },
];

export const catalog = [
  { kicker: "CATEGORÍA 01", title: "Excel de gestión", items: ["Ventas", "Inventarios", "Clientes", "Presupuestos", "Costos", "Operaciones"] },
  { kicker: "CATEGORÍA 02", title: "Procesos administrativos", items: ["Formularios", "Registros", "Seguimiento", "Documentos", "Reportes"] },
  { kicker: "CATEGORÍA 03", title: "Herramientas internas", items: ["Dashboards", "Calculadoras", "Sistemas de seguimiento", "Paneles de control"] },
  { kicker: "CATEGORÍA 04", title: "Automatizaciones", items: ["Correos automáticos", "Generación de documentos", "Notificaciones", "Recordatorios", "Integraciones"] },
];

export const steps = [
  { n: "01", title: "Analizamos", body: "Nos muestras tu Excel o nos explicas el proceso. Identificamos qué se repite, qué se calcula y dónde se pierde tiempo.", tags: ["Sesión de 45 min", "Revisión del archivo"] },
  { n: "02", title: "Diseñamos", body: "Convertimos esa lógica en una experiencia web: pantallas, formularios, reglas y reportes, revisados contigo antes de programar.", tags: ["Wireframes", "Flujo de usuario"] },
  { n: "03", title: "Construimos", body: "Programamos la aplicación y las automatizaciones, migrando tus datos actuales y validando los cálculos contra tu Excel.", tags: ["Desarrollo", "Migración de datos"] },
  { n: "04", title: "Entregamos", body: "Recibes el sistema funcionando, con capacitación para tu equipo y soporte durante las primeras semanas de uso.", tags: ["Capacitación", "Soporte inicial"] },
];

export const cases = [
  {
    n: "CASO 01", title: "Inventario", result: "Reporte de 4 h → 2 min",
    before: ["Excel con productos, stock y movimientos en pestañas distintas.", "El stock real se calcula a mano al cierre del día.", "Los faltantes se descubren cuando ya faltan."],
    change: "Un único registro de productos y movimientos, con reglas de stock mínimo y avisos automáticos por correo.",
    after: "Dashboard de inventario",
    features: ["Stock en vivo", "Productos", "Alertas", "Movimientos", "Reportes"],
  },
  {
    n: "CASO 02", title: "Gestión de clientes", result: "Cero seguimientos perdidos",
    before: ["Excel de contactos, conversaciones en WhatsApp y documentos en carpetas.", "Nadie sabe en qué quedó cada cliente.", "El seguimiento depende de la memoria."],
    change: "Un CRM simple con estados, historial por cliente y recordatorios que se generan solos.",
    after: "CRM simple",
    features: ["Clientes", "Estado", "Seguimiento", "Historial", "Recordatorios"],
  },
  {
    n: "CASO 03", title: "Cotizaciones", result: "20 min → 90 segundos",
    before: ["Excel para calcular, Word para el documento y copiar y pegar entre ambos.", "Precios desactualizados según quién cotiza.", "No hay registro de lo enviado."],
    change: "Un generador web que toma cliente y productos, calcula el total y produce el PDF listo para enviar.",
    after: "Generador de cotizaciones",
    features: ["Cliente", "Productos", "Cálculo", "PDF", "Envío"],
  },
];

export const demoSteps = [
  "Abres “Control de inventario.xlsx”",
  "Pulsas “Convertir en aplicación”",
  "Ves la transformación en pantalla",
  "Navegas la aplicación resultante",
];

export const pricing = [
  { step: "ETAPA 01", title: "Diagnóstico", body: "Revisamos tu proceso y tu archivo, y te entregamos un documento con la solución propuesta, el alcance y el plazo.", note: "Punto de partida de todo proyecto" },
  { step: "ETAPA 02", title: "Desarrollo", body: "Diseñamos y construimos la aplicación y sus automatizaciones, con entregas parciales que puedes revisar.", note: "Precio cerrado según alcance" },
  { step: "ETAPA 03", title: "Evolución", body: "Mantenemos el sistema, corregimos lo que aparece con el uso real y añadimos módulos cuando el negocio lo pide.", note: "Acompañamiento mensual opcional" },
];

export const faqs: { q: string; a: string }[] = [
  { q: "¿Tengo que cambiar mi Excel?", a: "No. Partimos de lo que ya usas. Tu Excel es la mejor documentación de tu proceso, así que lo tomamos como punto de partida en lugar de pedirte que lo rehagas." },
  { q: "¿Pueden trabajar con mi Excel actual?", a: "Sí. Nos lo envías tal como está, con sus pestañas y sus fórmulas, y de ahí sacamos la lógica del sistema." },
  { q: "¿Pueden mantener mis cálculos?", a: "Sí. Replicamos las fórmulas dentro de la aplicación y las validamos contigo comparando resultados con tu archivo original." },
  { q: "¿Pueden automatizar tareas?", a: "Sí: envío de correos, generación de documentos, avisos, recordatorios y cálculos que hoy haces a mano." },
  { q: "¿Puedo seguir exportando a Excel?", a: "Sí. Toda tabla y todo reporte se puede descargar en Excel o CSV cuando lo necesites." },
  { q: "¿Puedo descargar reportes?", a: "Sí, en Excel o PDF, y también se pueden programar para que lleguen por correo cada semana o cada mes." },
  { q: "¿Cuánto demora un proyecto?", a: "Un proceso acotado suele estar listo entre 3 y 6 semanas. Después del diagnóstico te damos un plazo concreto." },
  { q: "¿Cuánto cuesta?", a: "Depende del proceso. El diagnóstico define el alcance y con eso te entregamos una propuesta cerrada, sin sorpresas." },
  { q: "¿Qué tipo de empresas pueden utilizar el servicio?", a: "Cualquier empresa que dependa de Excel para operar: comercio, servicios, distribución, consultoría, salud, manufactura." },
  { q: "¿Necesito conocimientos técnicos?", a: "No. Tú conoces tu proceso, nosotros la parte técnica. La aplicación se entrega con una sesión de uso para tu equipo." },
];
