import type { ReactNode } from "react";
import styles from "./Tag.module.css";
import { cx } from "../lib/cx";

export type TagTone = "accent-solid" | "neutral-solid" | "ink-solid" | "accent-soft" | "outline";

const toneClass: Record<TagTone, string> = {
  "accent-solid": styles.accentSolid,
  "neutral-solid": styles.neutralSolid,
  "ink-solid": styles.inkSolid,
  "accent-soft": styles.accentSoft,
  outline: styles.outline,
};

export function Tag({ tone, children }: { tone: TagTone; children: ReactNode }) {
  return <span className={cx(styles.tag, toneClass[tone])}>{children}</span>;
}
