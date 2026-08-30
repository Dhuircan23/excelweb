import "dotenv/config";

function optional(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

function requiredInProd(name: string, fallback: string): string {
  if (process.env.NODE_ENV === "production" && !process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return process.env[name] ?? fallback;
}

// DATABASE_URL itself isn't read here — Prisma reads it directly via
// env("DATABASE_URL") in schema.prisma — but this still enforces it's set
// before the server starts in production, rather than failing on first query.
requiredInProd("DATABASE_URL", "");

export const env = {
  nodeEnv: optional("NODE_ENV", "development"),
  port: Number(optional("PORT", "4000")),
  corsOrigin: optional("CORS_ORIGIN", "http://localhost:5173"),
  uploadsDir: optional("UPLOADS_DIR", "./uploads"),
  maxFileSizeMb: Number(optional("MAX_FILE_SIZE_MB", "25")),
  maxFilesPerLead: Number(optional("MAX_FILES_PER_LEAD", "5")),

  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(optional("SMTP_PORT", "587")),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: optional("SMTP_FROM", "ExcelWeb <hola@excelweb.app>"),
  },
  leadsNotificationEmail: process.env.LEADS_NOTIFICATION_EMAIL,
} as const;

export const isProduction = env.nodeEnv === "production";
