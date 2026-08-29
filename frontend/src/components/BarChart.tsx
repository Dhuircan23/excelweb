import styles from "./BarChart.module.css";
import { cx } from "../lib/cx";

export function BarChart({
  values,
  height = 100,
  highlightAbove = 101,
}: {
  values: number[];
  height?: number;
  /** Bars whose value exceeds this render in ink instead of accent, to flag outliers. */
  highlightAbove?: number;
}) {
  return (
    <div className={styles.chart} style={{ height }}>
      {values.map((v, i) => (
        <div className={styles.col} key={i}>
          <div className={cx(styles.bar, v > highlightAbove && styles.barHigh)} style={{ height: `${v}%` }} />
        </div>
      ))}
    </div>
  );
}
