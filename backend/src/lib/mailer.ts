import nodemailer from "nodemailer";
import { env } from "./env.js";
import type { Lead, LeadFile } from "@prisma/client";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!env.smtp.host || !env.smtp.user || !env.smtp.pass) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: { user: env.smtp.user, pass: env.smtp.pass },
    });
  }
  return transporter;
}

// Best-effort notification to the commercial team. A lead is already
// persisted in the database by the time this runs, so an email failure
// (missing SMTP config, transient network error) must never fail the
// request — we only log it.
export async function notifyNewLead(lead: Lead, files: LeadFile[]): Promise<void> {
  const t = getTransporter();
  if (!t || !env.leadsNotificationEmail) {
    console.info(`[mailer] SMTP not configured — skipping notification for lead ${lead.id}`);
    return;
  }

  const categories = JSON.parse(lead.improvementCategories || "[]") as string[];

  const text = [
    `Nueva solicitud de diagnóstico — ${lead.company}`,
    "",
    `Nombre: ${lead.name}`,
    `Empresa: ${lead.company}`,
    `Email: ${lead.email}`,
    `WhatsApp: ${lead.whatsapp || "—"}`,
    `Industria: ${lead.industry || "—"}`,
    "",
    `Qué hace actualmente: ${lead.currentProcess}`,
    `Archivos: ${lead.fileCount || "—"}`,
    `Personas: ${lead.peopleCount || "—"}`,
    `Partes manuales: ${lead.manualParts || "—"}`,
    `Problemas: ${lead.problems || "—"}`,
    `Quiere automatizar: ${lead.automationGoal || "—"}`,
    `Categorías de interés: ${categories.join(", ") || "—"}`,
    `Adjuntos: ${files.length ? files.map((f) => f.originalName).join(", ") : "ninguno"}`,
    "",
    `ID de la solicitud: ${lead.id}`,
  ].join("\n");

  try {
    await t.sendMail({
      from: env.smtp.from,
      to: env.leadsNotificationEmail,
      replyTo: lead.email,
      subject: `Nuevo diagnóstico: ${lead.company} (${lead.name})`,
      text,
    });
  } catch (err) {
    console.error(`[mailer] Failed to send notification for lead ${lead.id}:`, err);
  }
}
