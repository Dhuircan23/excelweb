import rateLimit from "express-rate-limit";

// Lead submissions are infrequent by nature — cap abuse without punishing a
// legitimate visitor who fixes a validation error and resubmits.
export const leadsRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "TOO_MANY_REQUESTS", message: "Demasiadas solicitudes. Inténtalo de nuevo en unos minutos." },
});

export const eventsRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "TOO_MANY_REQUESTS", message: "Too many events." },
});
