import { apiUrl } from "./api";

export type AnalyticsEvent =
  | "page_view"
  | "cta_click"
  | "demo_started"
  | "demo_completed"
  | "diagnostico_started"
  | "diagnostico_submitted";

/**
 * Minimal, non-invasive product analytics: fires a small JSON payload at
 * the backend for the handful of funnel events the business actually
 * needs (see especificacion.html §10 "Medición"). No cookies, no session
 * replay, no third-party script. Failures are swallowed — analytics must
 * never break the page.
 */
export function track(name: AnalyticsEvent, payload?: Record<string, unknown>) {
  try {
    const body = JSON.stringify({ name, payload, path: window.location.pathname });

    // Deliberately not using navigator.sendBeacon here: cross-origin beacon
    // requests are always sent with credentials included, which the API's
    // CORS policy (no cookies, no session — nothing to send) correctly
    // rejects. `fetch(..., { keepalive: true })` gives the same "survive
    // page unload" behavior without forcing credentialed requests, and
    // defaults to the same-origin credentials mode we actually want.
    void fetch(apiUrl("/api/events"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      /* analytics must never surface an error to the user */
    });
  } catch {
    /* ignore */
  }
}
