import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./ScrollToTop";
import { RouteAnalytics } from "./RouteAnalytics";

const Landing = lazy(() => import("../pages/Landing/Landing"));
const Demo = lazy(() => import("../pages/Demo/Demo"));
const Diagnostico = lazy(() => import("../pages/Diagnostico/Diagnostico"));
const DiagnosticoGracias = lazy(() => import("../pages/Diagnostico/DiagnosticoGracias"));
const DashboardEjemplo = lazy(() => import("../pages/Dashboard/DashboardEjemplo"));
const Privacidad = lazy(() => import("../pages/Legal/Privacidad"));
const Terminos = lazy(() => import("../pages/Legal/Terminos"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

function LoadingFallback() {
  return (
    <div role="status" aria-live="polite" style={{ padding: "80px 24px", textAlign: "center", color: "var(--color-neutral-600)" }}>
      Cargando…
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <RouteAnalytics />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/diagnostico" element={<Diagnostico />} />
          <Route path="/diagnostico/gracias" element={<DiagnosticoGracias />} />
          <Route path="/dashboard-ejemplo" element={<DashboardEjemplo />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
