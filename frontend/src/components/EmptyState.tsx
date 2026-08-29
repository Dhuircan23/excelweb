import styles from "./EmptyState.module.css";

export function EmptyState({ title, body, cta }: { title: string; body: string; cta: string }) {
  return (
    <div className={styles.empty}>
      <span className={styles.icon} aria-hidden="true" />
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.body}>{body}</p>
      <button type="button" className={styles.cta}>
        {cta}
      </button>
    </div>
  );
}
