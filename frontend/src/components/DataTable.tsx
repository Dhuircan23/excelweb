import styles from "./DataTable.module.css";
import { Tag, type TagTone } from "./Tag";

export type DataTableCell = string | { tag: string; tone: TagTone };

export function DataTable({ columns, rows }: { columns: string[]; rows: DataTableCell[][] }) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className={ci === 0 ? styles.cellFirst : styles.cellRest}>
                  {typeof cell === "string" ? cell : <Tag tone={cell.tone}>{cell.tag}</Tag>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
