import { Link } from "react-router-dom";
import styles from "./UtilityHeader.module.css";

export function UtilityHeader({
  kicker,
  cta,
}: {
  kicker: string;
  cta?: { label: string; to: string; variant?: "solid" | "ghost" };
}) {
  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true" />
          <span>ExcelWeb</span>
        </Link>
        <span className={styles.kicker}>{kicker}</span>
        {cta && (
          <Link to={cta.to} className={cta.variant === "ghost" ? styles.ctaGhost : styles.cta}>
            {cta.label}
          </Link>
        )}
      </div>
    </header>
  );
}
