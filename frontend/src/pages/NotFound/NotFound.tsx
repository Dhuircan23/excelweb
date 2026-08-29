import { Link } from "react-router-dom";
import { useDocumentMeta } from "../../lib/useDocumentMeta";
import { UtilityHeader } from "../../components/UtilityHeader";
import { MinimalFooter } from "../../components/MinimalFooter";
import styles from "./NotFound.module.css";

export default function NotFound() {
  useDocumentMeta({
    title: "Página no encontrada",
    description: "La página que buscas no existe o cambió de dirección.",
    path: "/404",
  });

  return (
    <>
      <UtilityHeader kicker="404" cta={{ label: "Volver al inicio", to: "/", variant: "ghost" }} />
      <main className={styles.wrap}>
        <span className={styles.kicker}>ERROR 404</span>
        <h1 className={styles.title}>Esta página no existe.</h1>
        <p className={styles.body}>
          Puede que el enlace esté roto o que la página haya cambiado de dirección. Vuelve al inicio o prueba la demo
          interactiva.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link to="/" className="btn btn-primary" style={{ padding: "14px 20px" }}>
            Volver al inicio
          </Link>
          <Link to="/demo" className="btn btn-secondary" style={{ padding: "12px 18px", border: "2px solid var(--color-text)" }}>
            Probar la demo
          </Link>
        </div>
      </main>
      <MinimalFooter note="ExcelWeb" links={[{ label: "Diagnóstico", to: "/diagnostico" }]} />
    </>
  );
}
