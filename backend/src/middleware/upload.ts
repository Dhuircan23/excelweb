import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import multer from "multer";
import { env } from "../lib/env.js";
import { isAllowedFile } from "../lib/validation.js";

const uploadsDir = path.resolve(env.uploadsDir);
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    // Never trust the client-provided filename for the path on disk —
    // generate a random name and keep the original only as metadata.
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: env.maxFileSizeMb * 1024 * 1024,
    files: env.maxFilesPerLead,
  },
  fileFilter: (_req, file, cb) => {
    if (!isAllowedFile(file.mimetype, file.originalname)) {
      cb(new Error("UNSUPPORTED_FILE_TYPE"));
      return;
    }
    cb(null, true);
  },
});

export { uploadsDir };
