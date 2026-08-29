import type { ReactNode } from "react";
import { UtilityHeader } from "../../components/UtilityHeader";
import { MinimalFooter } from "../../components/MinimalFooter";
import styles from "./Legal.module.css";

export function LegalLayout({
  kicker,
  title,
  updated,
  children,
}: {
  kicker: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <UtilityHeader kicker={kicker} cta={{ label: "Volver al inicio", to: "/", variant: "ghost" }} />
      <main className={styles.main}>
        <div className={styles.kicker}>{kicker}</div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.updated}>Última actualización: {updated}</p>
        {children}
      </main>
      <MinimalFooter note="ExcelWeb" links={[{ label: "Diagnóstico", to: "/diagnostico" }]} />
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
