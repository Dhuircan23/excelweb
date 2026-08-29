import styles from "./SegmentedControl.module.css";
import { cx } from "../lib/cx";

export function SegmentedControl({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <span style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-neutral-800)" }}>
        {label}
      </span>
      <div className={styles.wrap} role="group" aria-label={label}>
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={cx(styles.opt, value === opt && styles.optActive)}
            aria-pressed={value === opt}
            onClick={() => onChange(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
