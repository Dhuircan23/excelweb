import { useState } from "react";
import styles from "./FaqAccordion.module.css";
import type { faqs as FaqList } from "./content";

export function FaqAccordion({ faqs }: { faqs: typeof FaqList }) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <div className={styles.list}>
      {faqs.map((f, i) => {
        const open = openIndex === i;
        return (
          <div className={styles.item} key={f.q}>
            <button
              type="button"
              className={styles.trigger}
              aria-expanded={open}
              aria-controls={`faq-answer-${i}`}
              onClick={() => setOpenIndex(open ? -1 : i)}
            >
              <span className={styles.question}>{f.q}</span>
              <span className={styles.sign} aria-hidden="true">
                {open ? "–" : "+"}
              </span>
            </button>
            {open && (
              <p className={styles.answer} id={`faq-answer-${i}`}>
                {f.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
