import { Link } from "react-router-dom";
import styles from "./MinimalFooter.module.css";

export function MinimalFooter({ note, links }: { note: string; links: { label: string; to: string }[] }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.bar}>
        <span className={styles.note}>{note}</span>
        <div className={styles.links}>
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={styles.link}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
