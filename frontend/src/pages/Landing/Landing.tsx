import { Link } from "react-router-dom";
import { useDocumentMeta } from "../../lib/useDocumentMeta";
import { track } from "../../lib/analytics";
import { cx } from "../../lib/cx";
import { LandingHeader } from "./LandingHeader";
import { FaqAccordion } from "./FaqAccordion";
import styles from "./Landing.module.css";
import {
  excelCells,
  heroMetrics,
  heroBars,
  heroRows,
  problems,
  chain,
  catalog,
  steps,
  cases,
  demoSteps,
  pricing,
  faqs,
} from "./content";

const heroRowTone: Record<string, string> = {
  accent: "var(--color-accent)",
  neutral: "var(--color-neutral-300)",
  ink: "var(--color-text)",
};
const heroRowFg: Record<string, string> = {
  accent: "var(--color-bg)",
  neutral: "var(--color-neutral-800)",
  ink: "var(--color-bg)",
};

export default function Landing() {
  useDocumentMeta({
    title: "Convierte tu Excel en una aplicación web",
    description:
      "Transformamos procesos manuales basados en Excel en herramientas web profesionales, automatizadas y fáciles de usar.",
    path: "/",
  });

  return (
    <div id="top">
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      <LandingHeader />

      <main id="main-content">
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroEyebrow}>
            <span className={styles.heroEyebrowDot} aria-hidden="true" />
            <span className={styles.heroEyebrowText}>Procesos manuales → software</span>
          </div>
          <h1 className={styles.h1}>Convierte tu Excel en una aplicación web.</h1>
          <p className={styles.heroSub}>
            Transformamos procesos manuales basados en Excel en herramientas web profesionales, automatizadas y
            fáciles de usar.
          </p>
          <div className={styles.heroCtas}>
            <Link to="/diagnostico" className={cx("btn", styles.ctaPrimary)} onClick={() => track("cta_click", { location: "hero" })}>
              Quiero transformar mi Excel
            </Link>
            <a href="#como-funciona" className={cx("btn", styles.ctaSecondary)}>
              Ver cómo funciona
            </a>
          </div>

          <div className={styles.compare}>
            <div className={styles.excelCard}>
              <div className={styles.excelCardHead}>
                <span className={styles.excelFileName}>Control de inventario_v7_FINAL.xlsx</span>
                <span className={styles.excelBadge}>ANTES</span>
              </div>
              <div className={styles.excelTabs}>
                {["Productos", "Stock", "Movim.", "Proveed.", "Hoja3"].map((t, i) => (
                  <span key={t} className={cx(styles.excelTab, i === 0 && styles.excelTabActive)}>
                    {t}
                  </span>
                ))}
              </div>
              <div className={styles.excelFormula}>fx =SI(BUSCARV(A4;Stock!$A:$D;3;0)&lt;C4;"PEDIR";"OK")</div>
              <div className={styles.excelGrid}>
                {excelCells.map((c, i) => (
                  <div key={i} className={styles.excelCell}>
                    {c}
                  </div>
                ))}
              </div>
              <div className={styles.excelTags}>
                <span className={styles.excelTag}>copiar y pegar</span>
                <span className={styles.excelTag}>enviar por WhatsApp</span>
                <span className={styles.excelTag}>7 versiones del archivo</span>
              </div>
            </div>

            <div className={styles.transform} aria-hidden="true">
              <span className={styles.transformLabel}>TRANSFORMACIÓN</span>
              <span className={styles.transformArrow}>→</span>
            </div>

            <div className={styles.appCard}>
              <div className={styles.appCardHead}>
                <span className={styles.appCardHeadLabel}>
                  <span className={styles.appCardHeadDot} aria-hidden="true" />
                  Inventario · ExcelWeb
                </span>
                <span className={styles.excelBadge} style={{ color: "var(--color-neutral-400)" }}>
                  DESPUÉS
                </span>
              </div>
              <div className={styles.heroMetrics}>
                {heroMetrics.map((m) => (
                  <div key={m.label} className={styles.heroMetric}>
                    <div className={styles.heroMetricLabel}>{m.label}</div>
                    <div className={styles.heroMetricValue}>{m.value}</div>
                  </div>
                ))}
              </div>
              <div className={styles.heroChart}>
                <div className={styles.heroChartLabel}>Salidas por semana</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 74 }}>
                  {heroBars.map((h, i) => (
                    <div key={i} style={{ flex: "1 1 0", minWidth: 0, background: "var(--color-accent)", height: `${h}%` }} />
                  ))}
                </div>
              </div>
              <div className={styles.heroRows}>
                {heroRows.map((r) => (
                  <div key={r.name} className={styles.heroRow}>
                    <span className={styles.heroRowName}>{r.name}</span>
                    <span className={styles.heroRowQty}>{r.qty}</span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: "0.06em",
                        padding: "4px 7px",
                        flex: "0 0 auto",
                        background: heroRowTone[r.tone],
                        color: heroRowFg[r.tone],
                      }}
                    >
                      {r.state}
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.heroFooter}>
                <span className={styles.heroFooterDot} aria-hidden="true" />
                <span className={styles.heroFooterText}>Automatización activa: aviso de stock bajo enviado por correo</span>
              </div>
            </div>
          </div>
        </section>

        {/* 01 — Problema */}
        <div className={styles.divider} />
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.kicker}>01</span>
            <h2 className={styles.h2} style={{ maxWidth: "22ch" }}>
              Probablemente esto te suena.
            </h2>
          </div>
          <div className={styles.problemsGrid}>
            {problems.map((p, i) => (
              <div key={p} className={styles.problemCell}>
                <div className={styles.problemN}>{String(i + 1).padStart(2, "0")}</div>
                <p className={styles.problemText}>{p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 02 — Solución */}
        <div className={styles.divider} />
        <section className={styles.sectionSurface}>
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.kicker}>02</span>
              <h2 className={styles.h2} style={{ maxWidth: "24ch" }}>
                De archivo suelto a proceso bajo control.
              </h2>
            </div>
            <div className={styles.chainGrid}>
              {chain.map((s) => (
                <div key={s.step} className={styles.chainCell}>
                  <div className={styles.chainHead}>
                    <span className={styles.chainStep}>{s.step}</span>
                    <span className={styles.chainArrow}>{s.arrow}</span>
                  </div>
                  <h3 className={styles.chainTitle}>{s.title}</h3>
                  <p className={styles.chainBody}>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 03 — Servicios */}
        <div className={styles.divider} />
        <section id="servicios" className={styles.section} style={{ scrollMarginTop: 80 }}>
          <div className={cx(styles.sectionHead, styles.sectionHeadTight)}>
            <span className={styles.kicker}>03</span>
            <h2 className={styles.h2}>Qué podemos transformar</h2>
          </div>
          <p className={styles.lede}>No vendemos funciones sueltas. Tomamos un proceso completo y lo dejamos funcionando en la web.</p>
          <div className={styles.catalogGrid}>
            {catalog.map((c) => (
              <div key={c.title} className={styles.catalogCard}>
                <div className={styles.catalogCardHead}>
                  <div className={styles.catalogKicker}>{c.kicker}</div>
                  <h3 className={styles.catalogTitle}>{c.title}</h3>
                </div>
                <ul className={styles.catalogList}>
                  {c.items.map((it) => (
                    <li key={it} className={styles.catalogItem}>
                      <span className={styles.catalogDot} aria-hidden="true" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 04 — Cómo funciona */}
        <div className={styles.divider} />
        <section id="como-funciona" className={styles.section} style={{ scrollMarginTop: 80 }}>
          <div className={styles.sectionHead}>
            <span className={styles.kicker}>04</span>
            <h2 className={styles.h2}>Cómo funciona</h2>
          </div>
          <div className={styles.stepsFlow}>
            {steps.map((s) => (
              <div key={s.n} className={styles.stepRow}>
                <div className={styles.stepHead}>
                  <span className={styles.stepN}>{s.n}</span>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                </div>
                <p className={styles.stepBody}>{s.body}</p>
                <div className={styles.stepTags}>
                  {s.tags.map((t) => (
                    <span key={t} className={styles.stepTag}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "clamp(24px,3vw,36px)" }}>
            <Link
              to="/diagnostico"
              className={cx("btn", styles.ctaPrimary)}
              style={{ display: "inline-block" }}
              onClick={() => track("cta_click", { location: "como-funciona" })}
            >
              Quiero analizar mi proceso
            </Link>
          </div>
        </section>

        {/* 05 — Casos */}
        <div className={styles.divider} />
        <section id="ejemplos" className={styles.sectionSurface} style={{ scrollMarginTop: 80 }}>
          <div className={styles.section}>
            <div className={cx(styles.sectionHead, styles.sectionHeadTight)}>
              <span className={styles.kicker}>05</span>
              <h2 className={styles.h2}>Casos de ejemplo</h2>
            </div>
            <p className={styles.lede} style={{ fontSize: 15, color: "var(--color-neutral-700)" }}>
              Ejemplos ilustrativos construidos con datos ficticios, basados en procesos que se repiten en casi cualquier negocio.
            </p>
            <div className={styles.casesList}>
              {cases.map((c) => (
                <article key={c.n} className={styles.caseCard}>
                  <div className={styles.caseHead}>
                    <span className={styles.caseN}>{c.n}</span>
                    <h3 className={styles.caseTitle}>{c.title}</h3>
                    <span className={styles.caseResult}>{c.result}</span>
                  </div>
                  <div className={styles.caseGrid}>
                    <div className={styles.caseCol}>
                      <div className={styles.caseColLabel} style={{ color: "var(--color-neutral-600)" }}>
                        ANTES
                      </div>
                      <ul className={styles.caseBefore}>
                        {c.before.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </div>
                    <div className={cx(styles.caseCol, styles.caseColMid)}>
                      <div className={styles.caseColLabel} style={{ color: "var(--color-accent)" }}>
                        TRANSFORMACIÓN
                      </div>
                      <p className={styles.caseChange}>{c.change}</p>
                    </div>
                    <div className={styles.caseColLast}>
                      <div className={styles.caseColLabel} style={{ color: "var(--color-text)" }}>
                        DESPUÉS
                      </div>
                      <p className={styles.caseAfter}>{c.after}</p>
                      <div className={styles.caseFeatures}>
                        {c.features.map((f) => (
                          <span key={f} className={styles.caseFeature}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 06 — Demo teaser */}
        <div className={styles.divider} />
        <section className={styles.section}>
          <div className={styles.teaserGrid}>
            <div>
              <div className={styles.sectionHead}>
                <span className={styles.kicker}>06</span>
                <h2 className={styles.h2} style={{ maxWidth: "20ch" }}>
                  Míralo funcionando antes de hablar con nosotros.
                </h2>
              </div>
              <p className={styles.lede}>
                Abre un Excel de inventario ficticio, pulsa convertir y navega la aplicación resultante. Toma menos de un minuto.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <Link to="/demo" className={cx("btn", styles.ctaPrimary)} onClick={() => track("cta_click", { location: "demo-teaser" })}>
                  Probar la demo
                </Link>
                <Link to="/dashboard-ejemplo" className={cx("btn", styles.ctaSecondary)}>
                  Ver dashboard conceptual
                </Link>
              </div>
            </div>
            <div className={styles.teaserPanel}>
              <div className={styles.teaserPanelHead}>
                <span className={styles.teaserPanelDot} aria-hidden="true" />
                <span className={styles.teaserPanelLabel}>DEMO INTERACTIVA</span>
              </div>
              {demoSteps.map((d, i) => (
                <div key={d} className={styles.teaserStep}>
                  <span className={styles.teaserStepN}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.teaserStepText}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 07 — Precios */}
        <div className={styles.divider} />
        <section id="precios" className={styles.sectionSurface} style={{ scrollMarginTop: 80 }}>
          <div className={styles.section}>
            <div className={cx(styles.sectionHead, styles.sectionHeadTight)}>
              <span className={styles.kicker}>07</span>
              <h2 className={styles.h2}>Cada proceso es diferente</h2>
            </div>
            <p className={styles.lede}>
              Por eso no publicamos una tarifa fija. Trabajamos en tres etapas y el alcance se define después del diagnóstico.
            </p>
            <div className={styles.pricingGrid}>
              {pricing.map((p) => (
                <div key={p.step} className={styles.pricingCell}>
                  <div className={styles.pricingStep}>{p.step}</div>
                  <h3 className={styles.pricingTitle}>{p.title}</h3>
                  <p className={styles.pricingBody}>{p.body}</p>
                  <div className={styles.pricingNote}>{p.note}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "clamp(24px,3vw,36px)" }}>
              <Link
                to="/diagnostico"
                className={cx("btn", styles.ctaPrimary)}
                style={{ display: "inline-block" }}
                onClick={() => track("cta_click", { location: "precios" })}
              >
                Solicitar diagnóstico
              </Link>
            </div>
          </div>
        </section>

        {/* 08 — FAQ */}
        <div className={styles.divider} />
        <section id="faq" className={styles.section} style={{ scrollMarginTop: 80 }}>
          <div className={styles.faqGrid}>
            <div>
              <div className={styles.sectionHead}>
                <span className={styles.kicker}>08</span>
                <h2 className={styles.h2}>Preguntas frecuentes</h2>
              </div>
              <p className={styles.faqIntro}>Si falta la tuya, escríbela en el formulario de diagnóstico y la respondemos ahí.</p>
            </div>
            <FaqAccordion faqs={faqs} />
          </div>
        </section>

        {/* CTA banner */}
        <section className={styles.ctaBanner}>
          <div className={styles.ctaBannerInner}>
            <h2 className={styles.ctaBannerTitle}>Tu Excel puede ser mucho más que un archivo.</h2>
            <p className={styles.ctaBannerSub}>Convierte procesos manuales en herramientas digitales diseñadas para tu negocio.</p>
            <div className={styles.ctaBannerActions}>
              <Link to="/diagnostico" className={styles.ctaBannerPrimary} onClick={() => track("cta_click", { location: "closing-banner" })}>
                Quiero transformar mi proceso
              </Link>
              <Link to="/demo" className={styles.ctaBannerGhost}>
                Probar la demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerGrid}>
            <div>
              <div className={styles.footerBrand}>
                <span className={styles.footerBrandMark} aria-hidden="true" />
                <span className={styles.footerBrandText}>ExcelWeb</span>
              </div>
              <p className={styles.footerLede}>
                Transformamos procesos manuales basados en Excel en aplicaciones web profesionales y automatizadas.
              </p>
            </div>
            <div>
              <div className={styles.footerColTitle}>SERVICIOS</div>
              <div className={styles.footerColLinks}>
                <a href="#servicios" className={styles.footerLink}>
                  Excel de gestión
                </a>
                <a href="#servicios" className={styles.footerLink}>
                  Procesos administrativos
                </a>
                <a href="#servicios" className={styles.footerLink}>
                  Herramientas internas
                </a>
                <a href="#servicios" className={styles.footerLink}>
                  Automatizaciones
                </a>
              </div>
            </div>
            <div>
              <div className={styles.footerColTitle}>EXPLORAR</div>
              <div className={styles.footerColLinks}>
                <Link to="/demo" className={styles.footerLink}>
                  Demo interactiva
                </Link>
                <Link to="/dashboard-ejemplo" className={styles.footerLink}>
                  Dashboard conceptual
                </Link>
                <Link to="/diagnostico" className={styles.footerLink}>
                  Diagnóstico
                </Link>
              </div>
            </div>
            <div>
              <div className={styles.footerColTitle}>CONTACTO</div>
              <div className={styles.footerColLinks}>
                <a href="mailto:hola@excelweb.app" className={styles.footerLink}>
                  hola@excelweb.app
                </a>
                <span style={{ fontSize: 14 }}>WhatsApp comercial</span>
                <span style={{ fontSize: 14 }}>Lun–Vie, 9:00–18:00</span>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span className={styles.footerCopy}>© 2026 ExcelWeb. Todos los derechos reservados.</span>
            <div className={styles.footerLegal}>
              <Link to="/privacidad" className={styles.footerLegalLink}>
                Privacidad
              </Link>
              <Link to="/terminos" className={styles.footerLegalLink}>
                Términos
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
