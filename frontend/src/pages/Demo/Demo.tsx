import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDocumentMeta } from "../../lib/useDocumentMeta";
import { track } from "../../lib/analytics";
import { cx } from "../../lib/cx";
import { UtilityHeader } from "../../components/UtilityHeader";
import { MinimalFooter } from "../../components/MinimalFooter";
import { SidebarNav } from "../../components/SidebarNav";
import { DataTable } from "../../components/DataTable";
import { MetricGrid } from "../../components/MetricCell";
import { BarChart } from "../../components/BarChart";
import { Tag } from "../../components/Tag";
import styles from "./Demo.module.css";
import { sheets, excelCellColor, transformLogs, appPages, barVals, demoMetrics } from "./content";

type View = "excel" | "converting" | "app";

const STAGES = [
  { n: "01", label: "Excel actual" },
  { n: "02", label: "Convertir" },
  { n: "03", label: "Transformación" },
  { n: "04", label: "Aplicación web" },
];

export default function Demo() {
  useDocumentMeta({
    title: "Demo interactiva",
    description: "Convierte un Excel de inventario ficticio en una aplicación web, en menos de un minuto, directo en tu navegador.",
    path: "/demo",
  });

  const [view, setView] = useState<View>("excel");
  const [tab, setTab] = useState<keyof typeof sheets>("Productos");
  const [page, setPage] = useState<keyof typeof appPages>("Resumen");
  const [logStep, setLogStep] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const convert = () => {
    track("demo_started");
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setView("converting");
    setLogStep(1);
    [2, 3, 4].forEach((n, i) => {
      timers.current.push(setTimeout(() => setLogStep(n), 600 * (i + 1)));
    });
    timers.current.push(
      setTimeout(() => {
        setView("app");
        setPage("Resumen");
        track("demo_completed");
      }, 2500),
    );
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    setView("excel");
    setLogStep(0);
  };

  const sheet = sheets[tab];
  const activeStageIndex = view === "excel" ? 0 : view === "converting" ? 2 : 3;

  return (
    <div className={styles.page}>
      <UtilityHeader kicker="DEMO INTERACTIVA" cta={{ label: "Transformar mi Excel", to: "/diagnostico" }} />

      <div className={styles.progressBar}>
        <div className={styles.progressInner}>
          {STAGES.map((s, i) => {
            const active = i === activeStageIndex;
            return (
              <div
                key={s.n}
                className={styles.progressStep}
                style={{ background: active ? "var(--color-accent)" : "transparent", color: active ? "var(--color-bg)" : "var(--color-neutral-700)" }}
              >
                <span className={styles.progressN}>{s.n}</span>
                <span className={styles.progressLabel}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <main className={styles.main}>
        {view === "excel" && (
          <div>
            <h1 className={styles.title}>Este es el Excel. Pulsa convertir.</h1>
            <p className={styles.subtitle}>
              Cinco pestañas, fórmulas cruzadas y un error de referencia. Un archivo cualquiera de cualquier empresa.
            </p>

            <div className={styles.excelPanel}>
              <div className={styles.excelHead}>
                <span className={styles.excelFilename}>Control de inventario_v7_FINAL.xlsx</span>
                <span className={styles.excelReadonly}>Solo lectura</span>
                <span className={styles.excelEdited}>últ. edición: hace 2 días · Marta</span>
              </div>
              <div className={styles.excelTabs}>
                {Object.keys(sheets).map((name) => (
                  <button
                    key={name}
                    type="button"
                    className={cx(styles.excelTab, name === tab && styles.excelTabActive)}
                    onClick={() => setTab(name as keyof typeof sheets)}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <div className={styles.excelFormula}>fx {sheet.formula}</div>
              <div className={styles.excelTableWrap}>
                <table className={styles.excelTable}>
                  <thead>
                    <tr>
                      {sheet.columns.map((c) => (
                        <th key={c}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sheet.rows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => (
                          <td key={ci} style={{ color: excelCellColor(cell) }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.excelFooter}>
                <button type="button" onClick={convert} className={cx("btn", "btn-primary")} style={{ padding: "18px 26px", fontSize: 16 }}>
                  Convertir en aplicación
                </button>
                <span className={styles.excelFooterNote}>Simulación en tu navegador. No se envía ningún dato.</span>
              </div>
            </div>
          </div>
        )}

        {view === "converting" && (
          <div className={styles.convertingPanel}>
            <div className={styles.convertingEyebrow}>
              <span className={styles.convertingDot} aria-hidden="true" />
              <span className={styles.convertingLabel}>TRANSFORMANDO</span>
            </div>
            <h2 className={styles.convertingTitle}>Leyendo el archivo y construyendo la aplicación.</h2>
            <div className={styles.logLines} role="status" aria-live="polite">
              {transformLogs.slice(0, logStep).map((line) => (
                <div className={styles.logLine} key={line}>
                  <span className={styles.logMark} aria-hidden="true">
                    ✓
                  </span>
                  <span className={styles.logText}>{line}</span>
                </div>
              ))}
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${(logStep / 4) * 100}%` }} />
            </div>
          </div>
        )}

        {view === "app" && (
          <div>
            <div className={styles.appHead}>
              <div>
                <div className={styles.appHeadResult}>RESULTADO</div>
                <h1 className={styles.title} style={{ margin: 0 }}>
                  Esta es la misma información, hecha aplicación.
                </h1>
              </div>
              <button type="button" className={styles.resetBtn} onClick={reset}>
                Volver al Excel
              </button>
            </div>

            <div className={styles.appShell}>
              <SidebarNav
                brandLabel="Inventario"
                items={Object.keys(appPages).map((name) => ({
                  name,
                  active: name === page,
                  onSelect: () => setPage(name as keyof typeof appPages),
                }))}
              />

              <section className={styles.appContent}>
                <div className={styles.appContentHead}>
                  <h2 className={styles.appContentTitle}>{appPages[page].title}</h2>
                  <Tag tone="accent-soft">datos ficticios</Tag>
                </div>

                {appPages[page].kind === "metrics" && (
                  <>
                    <MetricGrid metrics={demoMetrics} />
                    <div className={styles.chartBlock}>
                      <div className={styles.chartLabel}>Movimientos por día · últimos 14 días</div>
                      <BarChart values={barVals} height={100} highlightAbove={85} />
                    </div>
                  </>
                )}

                {appPages[page].kind === "table" && (
                  <DataTable columns={appPages[page].columns ?? []} rows={appPages[page].rows ?? []} />
                )}

                {appPages[page].kind === "list" && (
                  <div>
                    {(appPages[page].items ?? []).map((it) => (
                      <div className={styles.listItem} key={it.title}>
                        <span className={styles.listDot} style={{ background: it.dot }} aria-hidden="true" />
                        <div className={styles.listBody}>
                          <div className={styles.listTitle}>{it.title}</div>
                          <div className={styles.listMeta}>{it.meta}</div>
                        </div>
                        <Tag tone={it.tone}>{it.state}</Tag>
                      </div>
                    ))}
                  </div>
                )}

                <div className={styles.appFooter}>
                  <span className={styles.appFooterDot} aria-hidden="true" />
                  <span className={styles.appFooterNote}>{appPages[page].note}</span>
                  <Tag tone="outline">Exportar a Excel</Tag>
                </div>
              </section>
            </div>

            <div className={styles.followUp}>
              <div style={{ flex: "1 1 320px" }}>
                <h3 className={styles.followUpTitle}>Esto es lo que podemos hacer con tu proceso.</h3>
                <p className={styles.followUpBody}>
                  Cuéntanos cómo trabajas hoy y te devolvemos un diagnóstico con la aplicación propuesta, el alcance y el plazo.
                </p>
              </div>
              <Link
                to="/diagnostico"
                className="btn btn-primary"
                style={{ padding: "18px 26px", fontSize: 16, flex: "0 0 auto" }}
                onClick={() => track("cta_click", { location: "demo-result" })}
              >
                Solicitar diagnóstico
              </Link>
            </div>
          </div>
        )}
      </main>

      <MinimalFooter
        note="Demo conceptual con datos ficticios · ExcelWeb"
        links={[
          { label: "Volver al inicio", to: "/" },
          { label: "Dashboard conceptual", to: "/dashboard-ejemplo" },
        ]}
      />
    </div>
  );
}
