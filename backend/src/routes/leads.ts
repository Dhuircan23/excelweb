import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import { prisma } from "../lib/prisma.js";
import { leadSchema } from "../lib/validation.js";
import { upload } from "../middleware/upload.js";
import { leadsRateLimit } from "../middleware/rateLimit.js";
import { notifyNewLead } from "../lib/mailer.js";

export const leadsRouter = Router();

function handleUpload(req: Request, res: Response, next: NextFunction) {
  upload.array("files", 5)(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "FILE_TOO_LARGE", message: "Cada archivo debe pesar como máximo 25 MB." });
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({ error: "TOO_MANY_FILES", message: "Puedes adjuntar hasta 5 archivos." });
      }
      return res.status(400).json({ error: "UPLOAD_ERROR", message: "No se pudo procesar el archivo adjunto." });
    }
    if (err.message === "UNSUPPORTED_FILE_TYPE") {
      return res
        .status(400)
        .json({ error: "UNSUPPORTED_FILE_TYPE", message: "Solo se aceptan archivos .xlsx, .xls, .csv, .pdf, .png o .jpg." });
    }
    next(err);
  });
}

leadsRouter.post("/", leadsRateLimit, handleUpload, async (req: Request, res: Response) => {
  // multipart/form-data delivers every field as a string, including
  // improvementCategories which the client sends JSON-encoded.
  let improvementCategories: unknown = [];
  if (typeof req.body.improvementCategories === "string" && req.body.improvementCategories.length > 0) {
    try {
      improvementCategories = JSON.parse(req.body.improvementCategories);
    } catch {
      return res.status(400).json({ error: "VALIDATION_ERROR", message: "Formato inválido en las categorías seleccionadas." });
    }
  }

  const parsed = leadSchema.safeParse({ ...req.body, improvementCategories });
  if (!parsed.success) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Revisa los campos obligatorios del formulario.",
      issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }

  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  const data = parsed.data;

  const lead = await prisma.lead.create({
    data: {
      name: data.name,
      company: data.company,
      email: data.email,
      whatsapp: data.whatsapp || null,
      industry: data.industry || null,
      currentProcess: data.currentProcess,
      fileCount: data.fileCount || null,
      peopleCount: data.peopleCount || null,
      manualParts: data.manualParts || null,
      problems: data.problems || null,
      automationGoal: data.automationGoal || null,
      improvementCategories: JSON.stringify(data.improvementCategories ?? []),
      files: {
        create: files.map((f) => ({
          originalName: f.originalname,
          storedName: f.filename,
          mimeType: f.mimetype,
          size: f.size,
        })),
      },
    },
    include: { files: true },
  });

  // Fire-and-forget: the lead is already safely persisted, so a slow or
  // failing mail provider must never delay or fail the user's response.
  void notifyNewLead(lead, lead.files);

  res.status(201).json({ id: lead.id, createdAt: lead.createdAt });
});
