import { useState } from "react";
import { Link } from "react-router-dom";
import { track } from "../../lib/analytics";
import styles from "./LandingHeader.module.css";

const NAV_LINKS: { href: string; label: string }[] = [
  { href: "#servicios", label: "Servicios" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#ejemplos", label: "Ejemplos" },
  { href: "#precios", label: "Precios" },
  { href: "#faq", label: "FAQ" },
];

export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCtaClick = () => track("cta_click", { location: "navbar" });

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <a href="#top" className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true" />
          <span>ExcelWeb</span>
        </a>

        <nav className={styles.desktopNav} aria-label="Principal">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={styles.navLink}>
              {l.label}
            </a>
          ))}
          <Link to="/demo" className={styles.navLink}>
            Demo
          </Link>
          <Link to="/diagnostico" className={styles.navCta} onClick={handleCtaClick}>
            Transformar mi Excel
          </Link>
        </nav>

        <div className={styles.mobileBar}>
          <Link to="/diagnostico" className={styles.mobileCta} onClick={handleCtaClick}>
            Transformar mi Excel
          </Link>
          <button
            type="button"
            className={styles.menuBtn}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="landing-mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={styles.menuBar} />
            <span className={styles.menuBar} />
            <span className={styles.menuBar} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="landing-mobile-menu" className={styles.mobileMenu} aria-label="Menú móvil">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
          <Link to="/demo" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            Demo interactiva
          </Link>
        </nav>
      )}
    </header>
  );
}
