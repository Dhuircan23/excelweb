import type { ChangeEvent, CSSProperties } from "react";
import styles from "./Field.module.css";
import { cx } from "../lib/cx";

interface BaseProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  error?: string;
  help?: string;
}

function controlStyle(hasError: boolean): CSSProperties {
  return { borderColor: hasError ? "var(--color-accent)" : "color-mix(in srgb, var(--color-text) 35%, transparent)" };
}

export function TextField({ id, label, value, onChange, placeholder, error, help, type = "text" }: BaseProps & { type?: string }) {
  return (
    <label className={styles.field} htmlFor={id}>
      <span className={styles.label}>{label}</span>
      <input
        id={id}
        type={type}
        className={styles.control}
        style={controlStyle(!!error)}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <span className={styles.error} id={`${id}-error`}>
          {error}
        </span>
      )}
      {!error && help && <span className={styles.help}>{help}</span>}
    </label>
  );
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  help,
  rows = 3,
}: BaseProps & { rows?: number }) {
  return (
    <label className={styles.field} htmlFor={id}>
      <span className={styles.label}>{label}</span>
      <textarea
        id={id}
        rows={rows}
        className={styles.control}
        style={controlStyle(!!error)}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <span className={styles.error} id={`${id}-error`}>
          {error}
        </span>
      )}
      {!error && help && <span className={styles.help}>{help}</span>}
    </label>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: Omit<BaseProps, "placeholder" | "error" | "help"> & { options: string[] }) {
  return (
    <label className={styles.field} htmlFor={id}>
      <span className={styles.label}>{label}</span>
      <select id={id} className={cx(styles.control)} style={controlStyle(false)} value={value} onChange={onChange}>
        {options.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
    </label>
  );
}
