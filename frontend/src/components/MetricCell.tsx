import styles from "./MetricCell.module.css";

export interface Metric {
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
}

export function MetricGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <div className={styles.grid}>
      {metrics.map((m) => (
        <div className={styles.cell} key={m.label}>
          <div className={styles.label}>{m.label}</div>
          <div className={styles.value}>{m.value}</div>
          {m.sub && (
            <div className={styles.sub} style={m.subColor ? { color: m.subColor, fontWeight: 600 } : undefined}>
              {m.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
