import { useId, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import styles from "./FileDropzone.module.css";
import { cx } from "../lib/cx";
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE_MB, formatFileSize, validateNewFiles } from "../lib/fileValidation";

export function FileDropzone({ files, onChange }: { files: File[]; onChange: (files: File[]) => void }) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;
    const { accepted, errors: newErrors } = validateNewFiles(files, Array.from(incoming));
    if (accepted.length > 0) onChange([...files, ...accepted]);
    setErrors(newErrors);
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label
        htmlFor={inputId}
        className={cx(styles.dropzone, dragActive && styles.dropzoneActive)}
        onDragOver={(e: DragEvent) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e: DragEvent) => {
          e.preventDefault();
          setDragActive(false);
          addFiles(e.dataTransfer.files);
        }}
      >
        <span className={styles.icon} aria-hidden="true" />
        <span className={styles.copy}>
          <span className={styles.copyTitle}>Excel, PDF, capturas o documentación</span>
          <span className={styles.copyBody}>
            Arrastra los archivos aquí o haz clic para elegirlos. Hasta {MAX_FILE_SIZE_MB} MB por archivo.
          </span>
        </span>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          multiple
          accept={ALLOWED_EXTENSIONS.join(",")}
          className={styles.input}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <span className={styles.chooseBtn}>Elegir archivos</span>
      </label>

      {errors.length > 0 && (
        <ul className={styles.errors} role="alert">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <div className={styles.list}>
          {files.map((f, i) => (
            <div className={styles.item} key={`${f.name}-${f.size}`}>
              <span className={styles.itemDot} aria-hidden="true" />
              <span className={styles.itemName}>{f.name}</span>
              <span className={styles.itemSize}>{formatFileSize(f.size)}</span>
              <button type="button" className={styles.itemRemove} onClick={() => removeFile(i)} aria-label={`Quitar ${f.name}`}>
                Quitar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
