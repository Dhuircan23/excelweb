import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./lib/env.js";
import { leadsRouter } from "./routes/leads.js";
import { eventsRouter } from "./routes/events.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigin.split(",").map((o) => o.trim()),
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.get("/", (_req, res) => {
  res.json({ message: "ExcelWeb Backend API en línea 🚀" });
});

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/leads", leadsRouter);
  app.use("/api/events", eventsRouter);

  // Centralized error handler — never leak stack traces or internal
  // details to the client, always log server-side for debugging.
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("[unhandled error]", err);
    res.status(500).json({ error: "INTERNAL_ERROR", message: "Ocurrió un error inesperado. Inténtalo de nuevo." });
  });

  return app;
}
