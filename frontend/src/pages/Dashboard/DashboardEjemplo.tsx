import { useState } from "react";
import { Link } from "react-router-dom";
import { useDocumentMeta } from "../../lib/useDocumentMeta";
import { UtilityHeader } from "../../components/UtilityHeader";
import { MinimalFooter } from "../../components/MinimalFooter";
import { SidebarNav } from "../../components/SidebarNav";
import { DataTable } from "../../components/DataTable";
import { MetricGrid } from "../../components/MetricCell";
import { BarChart } from "../../components/BarChart";
import { EmptyState } from "../../components/EmptyState";
import { Tag } from "../../components/Tag";
import styles from "./Dashboard.module.css";
import { pages, barVals, metrics, alerts, activity, tasks } from "./content";

export default function DashboardEjemplo() {
  useDocumentMeta({
    title: "Dashboard conceptual",
    description: "Ejemplo de cómo puede verse un sistema entregado: métricas, alertas, procesos y automatizaciones con datos ficticios.",
    path: "/dashboard-ejemplo",
  });

  const [page, setPage] = useState<keyof typeof pages>("Inicio");
  const cur = pages[page];

  return (
    <div className={styles.page}>
      <UtilityHeader kicker="DASHBOARD CONCEPTUAL" cta={{ label: "Quiero uno así", to: "/diagnostico" }} />

      <div className={styles.wrap}>
        <p className={styles.intro}>
          Ejemplo de cómo puede verse un sistema entregado. Los datos son ficticios; la estructura y los estados son
          los que usamos en proyectos reales.
        </p>

        <div className={styles.shell}>
          <SidebarNav
            brandLabel="Panel operativo"
            items={Object.entries(pages).map(([name, p]) => ({
              name,
              active: name === page,
              count: p.count,
              onSelect: () => setPage(name as keyof typeof pages),
            }))}
            footer={
              <>
                <span className={styles.avatar} aria-hidden="true">
                  MR
                </span>
                <span style={{ minWidth: 0 }}>
                  <span className={styles.avatarName}>Marta Ríos</span>
                  <span className={styles.avatarRole}>Administración</span>
                </span>
              </>
            }
          />

          <main className={styles.content}>
            <div className={styles.contentHead}>
              <h1 className={styles.contentTitle}>{cur.title}</h1>
              <Tag tone="accent-soft">datos ficticios</Tag>
              <span className={styles.updated}>actualizado hace 2 min</span>
            </div>

            {cur.kind === "home" && (
              <div>
                <MetricGrid metrics={metrics} />
                <div className={styles.homeGrid}>
                  <div className={styles.homeCol}>
                    <div className={styles.chartPad}>
                      <div className={styles.chartHead}>
                        <span className={styles.chartTitle}>Procesos ejecutados por semana</span>
                        <span className={styles.chartSpan}>12 semanas</span>
                      </div>
                      <BarChart values={barVals} height={130} highlightAbove={90} />
                      <div className={styles.chartAxis}>
                        <span>S23</span>
                        <span>S29</span>
                        <span>S34</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.homeColLast}>
                    <div className={styles.blockTitle}>Alertas</div>
                    {alerts.map((a) => (
                      <div className={styles.alertRow} key={a.title}>
                        <span className={styles.alertDot} style={{ background: a.dot }} aria-hidden="true" />
                        <span className={styles.alertBody}>
                          <span className={styles.alertTitle}>{a.title}</span>
                          <span className={styles.alertMeta}>{a.meta}</span>
                        </span>
                        <Tag tone={a.tone}>{a.level}</Tag>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.homeGrid}>
                  <div className={styles.homeCol}>
                    <div className={styles.blockTitle}>Actividad reciente</div>
                    {activity.map((a) => (
                      <div className={styles.activityRow} key={a.text}>
                        <span className={styles.activityTime}>{a.time}</span>
                        <span className={styles.activityText}>{a.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.homeColLast}>
                    <div className={styles.blockTitle}>Tareas pendientes</div>
                    {tasks.map((t) => (
                      <div className={styles.taskRow} key={t.text}>
                        <span className={styles.taskBox} style={{ background: t.done ? "var(--color-accent)" : "transparent" }} aria-hidden="true" />
                        <span
                          className={styles.taskText}
                          style={{ textDecoration: t.done ? "line-through" : "none", color: t.done ? "var(--color-neutral-500)" : "var(--color-text)" }}
                        >
                          {t.text}
                        </span>
                        <span className={styles.taskDue}>{t.due}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {cur.kind === "table" && <DataTable columns={cur.columns ?? []} rows={cur.rows ?? []} />}

            {cur.kind === "empty" && (
              <EmptyState title={cur.emptyTitle ?? ""} body={cur.emptyBody ?? ""} cta={cur.emptyCta ?? ""} />
            )}

            <div className={styles.footerNote}>
              <span className={styles.footerNoteDot} aria-hidden="true" />
              <span className={styles.footerNoteText}>{cur.note}</span>
              <Tag tone="outline">Exportar a Excel</Tag>
            </div>
          </main>
        </div>

        <div className={styles.followUp}>
          <div style={{ flex: "1 1 320px" }}>
            <h2 className={styles.followUpTitle}>Tu sistema tendría tus procesos, no estos.</h2>
            <p className={styles.followUpBody}>Las pantallas se definen a partir de tu Excel y de cómo trabaja tu equipo hoy.</p>
          </div>
          <Link to="/diagnostico" className="btn btn-primary" style={{ padding: "18px 26px", fontSize: 16, flex: "0 0 auto" }}>
            Solicitar diagnóstico
          </Link>
        </div>
      </div>

      <MinimalFooter
        note="Dashboard conceptual · ExcelWeb"
        links={[
          { label: "Volver al inicio", to: "/" },
          { label: "Demo interactiva", to: "/demo" },
        ]}
      />
    </div>
  );
}
