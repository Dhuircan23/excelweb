import styles from "./ChipGroup.module.css";
import { cx } from "../lib/cx";

export function ChipGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const count = selected.length === 0 ? "Puedes elegir varios." : `${selected.length} seleccionado${selected.length > 1 ? "s" : ""}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <span style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-neutral-800)" }}>
        {label}
      </span>
      <div className={styles.chips}>
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              className={cx(styles.chip, active && styles.chipActive)}
              aria-pressed={active}
              onClick={() => onToggle(opt)}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <span className={styles.count}>{count}</span>
    </div>
  );
}
