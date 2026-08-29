import { Link, useLocation } from "react-router-dom";
import { useDocumentMeta } from "../../lib/useDocumentMeta";
import { UtilityHeader } from "../../components/UtilityHeader";
import { MinimalFooter } from "../../components/MinimalFooter";
import styles from "./Diagnostico.module.css";
import { NEXT_STEPS } from "./content";

interface ConfirmationState {
  name?: string;
  email?: string;
}

export default function DiagnosticoGracias() {
  useDocumentMeta({
    title: "Solicitud recibida",
    description: "Tu diagnóstico fue recibido. Te contactaremos en un plazo de 48 horas hábiles.",
    path: "/diagnostico/gracias",
  });

  const location = useLocation();
  const state = (location.state as ConfirmationState | null) ?? {};
  const firstName = state.name?.trim().split(" ")[0] || "gracias por escribir";
  const email = state.email?.trim() || "tu correo";

  return (
    <div className={styles.page}>
      <UtilityHeader kicker="DIAGNÓSTICO" cta={{ label: "Ver la demo", to: "/demo", variant: "ghost" }} />

      <main className={styles.main}>
        <div className={styles.successPanel}>
          <div className={styles.successBanner}>
            <div className={styles.successKicker}>SOLICITUD RECIBIDA</div>
            <h1 className={styles.successTitle}>Listo. Ya tenemos tu proceso.</h1>
          </div>
          <div className={styles.successBody}>
            <p className={styles.successLede}>
              Gracias, {firstName}. Revisaremos lo que nos contaste y te escribiremos a <strong>{email}</strong> en un
              plazo de 48 horas hábiles.
            </p>
            <div className={styles.nextGrid}>
              {NEXT_STEPS.map((ns) => (
                <div className={styles.nextCell} key={ns.n}>
                  <div className={styles.nextN}>{ns.n}</div>
                  <h3 className={styles.nextTitle}>{ns.title}</h3>
                  <p className={styles.nextBody}>{ns.body}</p>
                </div>
              ))}
            </div>
            <div className={styles.successActions}>
              <Link to="/demo" className="btn btn-primary" style={{ background: "var(--color-text)", padding: "17px 24px", fontSize: 15 }}>
                Mientras esperas, prueba la demo
              </Link>
              <Link to="/" className="btn btn-secondary" style={{ border: "2px solid var(--color-text)", padding: "15px 22px", fontSize: 15 }}>
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </main>

      <MinimalFooter note="Solicitud registrada · ExcelWeb" links={[{ label: "ExcelWeb", to: "/" }]} />
    </div>
  );
}
