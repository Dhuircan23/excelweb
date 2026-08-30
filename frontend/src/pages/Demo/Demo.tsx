import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useDocumentMeta } from "../../lib/useDocumentMeta";
import { track } from "../../lib/analytics";
import { cx } from "../../lib/cx";
import { UtilityHeader } from "../../components/UtilityHeader";
import { MinimalFooter } from "../../components/MinimalFooter";
import { SidebarNav } from "../../components/SidebarNav";
import { DataTable } from "../../components/DataTable";
import { MetricGrid, type Metric } from "../../components/MetricCell";
import { BarChart } from "../../components/BarChart";
import { Tag } from "../../components/Tag";
import styles from "./Demo.module.css";
import { sheets, excelCellColor, transformLogs, appPages, barVals, demoMetrics } from "./content";
import {
  parseWorkbookFile,
  findNumericColumn,
  scaleToPercent,
  WorkbookParseError,
  ALLOWED_EXTENSIONS,
  type ParsedWorkbook,
} from "./xlsxParser";

type View = "excel" | "converting" | "app";

const STAGES = [
  { n: "01", label: "Excel actual" },
  { n: "02", label: "Convertir" },
  { n: "03", label: "Transformación" },
  { n: "04", label: "Aplicación web" },
];

function buildLogLines(real: ParsedWorkbook | null): string[] {
  if (!real) return transformLogs;
  const totalRows = real.sheetOrder.reduce((sum, name) => sum + real.sheets[name].rows.length, 0);
  const plural = real.sheetOrder.length === 1 ? "" : "s";
  return [
    `${real.sheetOrder.length} pestaña${plural} leída${plural} · ${totalRows} filas`,
    "Detectando columnas y tipos de datos",
    "Preparando una vista de tabla para cada hoja",
    `Aplicación generada: ${real.sheetOrder.length + 1} pantallas`,
  ];
}

export default function Demo() {
  useDocumentMeta({
    title: "Demo interactiva",
    description: "Convierte un Excel de inventario ficticio (o el tuyo propio) en una aplicación web, directo en tu navegador.",
    path: "/demo",
  });

  const fileInputId = useId();
  const [view, setView] = useState<View>("excel");
  const [tab, setTab] = useState<string>("Productos");
  const [page, setPage] = useState<string>("Resumen");
  const [logStep, setLogStep] = useState(0);
  const [realWorkbook, setRealWorkbook] = useState<ParsedWorkbook | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const isReal = realWorkbook !== null;

  const convert = () => {
    track("demo_started", { source: isReal ? "real_file" : "sample" });
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
        track("demo_completed", { source: isReal ? "real_file" : "sample" });
      }, 2500),
    );
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    setView("excel");
    setLogStep(0);
  };

  const onFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadError(null);
    setParsing(true);
    try {
      const workbook = await parseWorkbookFile(file);
      setRealWorkbook(workbook);
      setTab(workbook.sheetOrder[0]);
      setView("excel");
    } catch (err) {
      setUploadError(err instanceof WorkbookParseError ? err.message : "No pudimos leer ese archivo. Inténtalo de nuevo.");
    } finally {
      setParsing(false);
    }
  };

  const clearRealFile = () => {
    setRealWorkbook(null);
    setUploadError(null);
    setTab("Productos");
  };

  const activeStageIndex = view === "excel" ? 0 : view === "converting" ? 2 : 3;
  const logLines = buildLogLines(isReal ? realWorkbook : null);

  const excelSheetNames = isReal ? realWorkbook.sheetOrder : Object.keys(sheets);
  const currentExcelSheet = isReal ? realWorkbook.sheets[tab] : sheets[tab];

  const appPageNames = isReal ? ["Resumen", ...realWorkbook.sheetOrder] : Object.keys(appPages);
  const realFirstSheet = isReal ? realWorkbook.sheets[realWorkbook.sheetOrder[0]] : null;
  const realNumericColumn = realFirstSheet ? findNumericColumn(realFirstSheet) : null;

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
            <h1 className={styles.title}>{isReal ? "Este es tu Excel. Pulsa convertir." : "Este es el Excel. Pulsa convertir."}</h1>
            <p className={styles.subtitle}>
              {isReal
                ? "Esto es exactamente lo que subiste. Pulsa convertir para ver cómo se vería como aplicación web."
                : "Cinco pestañas, fórmulas cruzadas y un error de referencia. Un archivo cualquiera de cualquier empresa."}
            </p>

            <div className={styles.uploadRow}>
              <label htmlFor={fileInputId} className={styles.uploadLabel}>
                {parsing ? "Leyendo archivo…" : "Sube tu propio Excel"}
                <input
                  id={fileInputId}
                  type="file"
                  accept={ALLOWED_EXTENSIONS.join(",")}
                  className={styles.uploadInput}
                  onChange={onFileSelected}
                  disabled={parsing}
                />
              </label>
              <span className={styles.uploadHint}>.xlsx, .xls o .csv · no se sube a ningún servidor</span>
              {isReal && (
                <button type="button" className={styles.clearFileLink} onClick={clearRealFile}>
                  Volver al ejemplo
                </button>
              )}
              {uploadError && <span className={styles.uploadError}>{uploadError}</span>}
            </div>

            <div className={styles.excelPanel}>
              <div className={styles.excelHead}>
                <span className={styles.excelFilename}>{isReal ? realWorkbook.fileName : "Control de inventario_v7_FINAL.xlsx"}</span>
                {isReal ? (
                  <span className={styles.realBadge}>tu archivo</span>
                ) : (
                  <>
                    <span className={styles.excelReadonly}>Solo lectura</span>
                    <span className={styles.excelEdited}>últ. edición: hace 2 días · Marta</span>
                  </>
                )}
              </div>
              <div className={styles.excelTabs}>
                {excelSheetNames.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className={cx(styles.excelTab, name === tab && styles.excelTabActive)}
                    onClick={() => setTab(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
              {!isReal && "formula" in sheets[tab] && <div className={styles.excelFormula}>fx {sheets[tab].formula}</div>}
              <div className={styles.excelTableWrap}>
                <table className={styles.excelTable}>
                  <thead>
                    <tr>
                      {currentExcelSheet?.columns.map((c) => <th key={c}>{c}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {currentExcelSheet?.rows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => (
                          <td key={ci} style={isReal ? undefined : { color: excelCellColor(cell) }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {realWorkbook && (realWorkbook.truncatedSheets || realWorkbook.sheets[tab]?.truncatedRows || realWorkbook.sheets[tab]?.truncatedCols) && (
                <div className={styles.truncationNote}>
                  Vista recortada para la demo — mostramos solo una parte de tu archivo.
                </div>
              )}
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
              {logLines.slice(0, logStep).map((line) => (
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
                brandLabel={isReal ? realWorkbook.fileName.replace(/\.(xlsx|xls|csv)$/i, "") : "Inventario"}
                items={appPageNames.map((name) => ({
                  name,
                  active: name === page,
                  onSelect: () => setPage(name),
                }))}
              />

              <section className={styles.appContent}>
                <div className={styles.appContentHead}>
                  <h2 className={styles.appContentTitle}>{isReal ? (page === "Resumen" ? "Resumen" : page) : appPages[page].title}</h2>
                  <Tag tone="accent-soft">{isReal ? "tu archivo" : "datos ficticios"}</Tag>
                </div>

                {isReal ? (
                  page === "Resumen" ? (
                    <>
                      <MetricGrid
                        metrics={
                          [
                            { label: "Hojas leídas", value: String(realWorkbook.sheetOrder.length) },
                            {
                              label: "Filas visibles",
                              value: String(realWorkbook.sheetOrder.reduce((sum, n) => sum + realWorkbook.sheets[n].rows.length, 0)),
                            },
                            { label: "Columnas (1ª hoja)", value: String(realFirstSheet?.columns.length ?? 0) },
                          ] satisfies Metric[]
                        }
                      />
                      {realNumericColumn && (
                        <div className={styles.chartBlock}>
                          <div className={styles.chartLabel}>{realNumericColumn.label} · primera hoja</div>
                          <BarChart values={scaleToPercent(realNumericColumn.values)} height={100} />
                        </div>
                      )}
                    </>
                  ) : (
                    <DataTable columns={realWorkbook.sheets[page]?.columns ?? []} rows={realWorkbook.sheets[page]?.rows ?? []} />
                  )
                ) : (
                  <>
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
                  </>
                )}

                <div className={styles.appFooter}>
                  <span className={styles.appFooterDot} aria-hidden="true" />
                  <span className={styles.appFooterNote}>
                    {isReal
                      ? "Esto es una vista genérica de tu archivo. Con tu proceso real diseñamos pantallas, cálculos y automatizaciones a la medida."
                      : appPages[page].note}
                  </span>
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
        note="Demo conceptual · ExcelWeb"
        links={[
          { label: "Volver al inicio", to: "/" },
          { label: "Dashboard conceptual", to: "/dashboard-ejemplo" },
        ]}
      />
    </div>
  );
}
