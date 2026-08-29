import type { ReactNode } from "react";
import styles from "./SidebarNav.module.css";
import { cx } from "../lib/cx";

export interface SidebarNavItem {
  name: string;
  active: boolean;
  count?: number;
  onSelect: () => void;
}

export function SidebarNav({
  brandLabel,
  items,
  footer,
}: {
  brandLabel: string;
  items: SidebarNavItem[];
  footer?: ReactNode;
}) {
  return (
    <nav className={styles.nav} aria-label="Navegación">
      <div className={styles.brand}>
        <span className={styles.brandDot} aria-hidden="true" />
        <span className={styles.brandLabel}>{brandLabel}</span>
      </div>
      {items.map((item) => (
        <button
          key={item.name}
          type="button"
          onClick={item.onSelect}
          className={cx(styles.item, item.active && styles.itemActive)}
          aria-current={item.active ? "page" : undefined}
        >
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.name}>{item.name}</span>
          {typeof item.count === "number" && <span className={styles.count}>{item.count}</span>}
        </button>
      ))}
      {footer && <div className={styles.footer}>{footer}</div>}
    </nav>
  );
}
