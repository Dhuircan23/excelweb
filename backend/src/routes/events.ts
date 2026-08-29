import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { eventsRateLimit } from "../middleware/rateLimit.js";

export const eventsRouter = Router();

// The funnel we care about for the MVP (see especificacion.html §10 "Medición"):
// cta_click, demo_started, demo_completed, diagnostico_started, diagnostico_submitted, page_view.
const ALLOWED_EVENTS = new Set([
  "page_view",
  "cta_click",
  "demo_started",
  "demo_completed",
  "diagnostico_started",
  "diagnostico_submitted",
]);

eventsRouter.post("/", eventsRateLimit, async (req, res) => {
  const { name, payload, path } = req.body ?? {};

  if (typeof name !== "string" || !ALLOWED_EVENTS.has(name)) {
    return res.status(400).json({ error: "VALIDATION_ERROR", message: "Unknown event name." });
  }

  await prisma.analyticsEvent.create({
    data: {
      name,
      path: typeof path === "string" ? path.slice(0, 200) : null,
      payload: payload ? JSON.stringify(payload).slice(0, 2000) : null,
    },
  });

  res.status(202).end();
});
