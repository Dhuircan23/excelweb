import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentMeta } from "../../lib/useDocumentMeta";
import { track } from "../../lib/analytics";
import { submitLead, LeadSubmissionError } from "../../lib/api";
import { UtilityHeader } from "../../components/UtilityHeader";
import { MinimalFooter } from "../../components/MinimalFooter";
import { TextField, TextAreaField, SelectField } from "../../components/Field";
import { SegmentedControl } from "../../components/SegmentedControl";
import { ChipGroup } from "../../components/ChipGroup";
import { FileDropzone } from "../../components/FileDropzone";
import styles from "./Diagnostico.module.css";
import { INDUSTRIAS, ARCHIVOS_OPTS, PERSONAS_OPTS, MEJORAS_OPTS, STEP_LABELS } from "./content";
import { isFieldInvalid, fieldErrorMessage, STEP_REQUIRED_FIELDS, type DiagnosticoFields } from "./validation";

const EMPTY_FIELDS: DiagnosticoFields = {
  name: "",
  company: "",
  email: "",
  whatsapp: "",
  industry: INDUSTRIAS[0]!,
  currentProcess: "",
  fileCount: "",
  peopleCount: "",
  manualParts: "",
  problems: "",
  automationGoal: "",
};

type Status = "idle" | "submitting" | "error";

export default function Diagnostico() {
  useDocumentMeta({
    title: "Diagnóstico de automatización",
    description: "Cuéntanos cómo trabajas hoy con Excel. Preparamos una propuesta concreta, sin costo y sin compromiso.",
    path: "/diagnostico",
  });

  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fields, setFields] = useState<DiagnosticoFields>(EMPTY_FIELDS);
  const [touched, setTouched] = useState<Partial<Record<string, boolean>>>({});
  const [mejoras, setMejoras] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const startedTracked = useRef(false);

  const setField = (key: keyof DiagnosticoFields) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
  };

  const toggleMejora = (label: string) => {
    setMejoras((m) => (m.includes(label) ? m.filter((x) => x !== label) : [...m, label]));
  };

  const next = () => {
    const required = STEP_REQUIRED_FIELDS[step as 1 | 2];
    const bad = required.filter((k) => isFieldInvalid(fields, k));
    if (bad.length > 0) {
      setTouched((t) => ({ ...t, ...Object.fromEntries(bad.map((k) => [k, true])) }));
      return;
    }
    if (step === 1 && !startedTracked.current) {
      startedTracked.current = true;
      track("diagnostico_started");
    }
    setStep((s) => (s < 3 ? ((s + 1) as 2 | 3) : s));
  };

  const back = () => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2) : s));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setErrorMessage(null);
    try {
      await submitLead({ ...fields, improvementCategories: mejoras, files });
      track("diagnostico_submitted");
      navigate("/diagnostico/gracias", { state: { name: fields.name, email: fields.email } });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof LeadSubmissionError ? err.message : "No se pudo enviar tu solicitud. Inténtalo de nuevo.");
    }
  };

  return (
    <div className={styles.page}>
      <UtilityHeader kicker="DIAGNÓSTICO" cta={{ label: "Ver la demo", to: "/demo", variant: "ghost" }} />

      <main className={styles.main}>
        <h1 className={styles.title}>Diagnóstico de automatización</h1>
        <p className={styles.lede}>
          Cuéntanos cómo trabajas hoy. Con eso preparamos una propuesta concreta: qué aplicación construir, qué se
          automatiza y cuánto toma. Sin costo y sin compromiso.
        </p>

        <div className={styles.stepTabs}>
          {STEP_LABELS.map(([n, label], i) => {
            const idx = i + 1;
            const active = step === idx;
            const done = step > idx;
            return (
              <div
                key={n}
                className={styles.stepTab}
                style={{ background: active ? "var(--color-accent)" : done ? "var(--color-text)" : "var(--color-bg)" }}
              >
                <div className={styles.stepTabN} style={{ color: step >= idx ? "var(--color-accent-300)" : "var(--color-neutral-500)" }}>
                  {n}
                </div>
                <div className={styles.stepTabLabel} style={{ color: step >= idx ? "var(--color-bg)" : "var(--color-neutral-700)" }}>
                  {label}
                </div>
              </div>
            );
          })}
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {errorMessage && (
            <div className={styles.formError} role="alert" style={{ margin: "clamp(20px,3vw,34px) clamp(20px,3vw,34px) 0" }}>
              {errorMessage}
            </div>
          )}

          {step === 1 && (
            <div className={styles.stepGrid}>
              <TextField
                id="nombre"
                label="Nombre *"
                value={fields.name}
                onChange={setField("name")}
                placeholder="Tu nombre y apellido"
                error={touched.name && isFieldInvalid(fields, "name") ? fieldErrorMessage("name") : undefined}
              />
              <TextField
                id="empresa"
                label="Empresa *"
                value={fields.company}
                onChange={setField("company")}
                placeholder="Nombre de la empresa"
                error={touched.company && isFieldInvalid(fields, "company") ? fieldErrorMessage("company") : undefined}
              />
              <TextField
                id="email"
                type="email"
                label="Email *"
                value={fields.email}
                onChange={setField("email")}
                placeholder="nombre@empresa.com"
                error={touched.email && isFieldInvalid(fields, "email") ? fieldErrorMessage("email") : undefined}
              />
              <TextField
                id="whatsapp"
                type="tel"
                label="WhatsApp"
                value={fields.whatsapp}
                onChange={setField("whatsapp")}
                placeholder="+00 000 000 000"
                help="Opcional. Solo si prefieres que te escribamos ahí."
              />
              <SelectField id="industria" label="Industria" value={fields.industry} onChange={setField("industry")} options={INDUSTRIAS} />
            </div>
          )}

          {step === 2 && (
            <div className={styles.stepStack}>
              <TextAreaField
                id="queHaces"
                label="¿Qué haces actualmente con Excel? *"
                rows={3}
                value={fields.currentProcess}
                onChange={setField("currentProcess")}
                placeholder="Por ejemplo: controlo el inventario y calculo los precios de venta."
                error={touched.currentProcess && isFieldInvalid(fields, "currentProcess") ? fieldErrorMessage("currentProcess") : undefined}
              />
              <div className={styles.segRow}>
                <SegmentedControl label="¿Cuántos archivos utilizas?" options={ARCHIVOS_OPTS} value={fields.fileCount} onChange={(v) => setFields((f) => ({ ...f, fileCount: v }))} />
                <SegmentedControl label="¿Cuántas personas usan el proceso?" options={PERSONAS_OPTS} value={fields.peopleCount} onChange={(v) => setFields((f) => ({ ...f, peopleCount: v }))} />
              </div>
              <TextAreaField
                id="manual"
                label="¿Qué partes son manuales?"
                rows={2}
                value={fields.manualParts}
                onChange={setField("manualParts")}
                placeholder="Copiar y pegar entre pestañas, armar el reporte, enviar avisos…"
              />
              <TextAreaField
                id="problemas"
                label="¿Qué problemas tienes actualmente?"
                rows={2}
                value={fields.problems}
                onChange={setField("problems")}
                placeholder="Errores, duplicados, demoras, información que no coincide…"
              />
              <TextAreaField
                id="automatizar"
                label="¿Qué te gustaría automatizar?"
                rows={2}
                value={fields.automationGoal}
                onChange={setField("automationGoal")}
                placeholder="Avisos de stock, envío de cotizaciones, reporte mensual…"
              />
            </div>
          )}

          {step === 3 && (
            <div className={styles.stepStackWide}>
              <ChipGroup label="¿Qué quieres mejorar?" options={MEJORAS_OPTS} selected={mejoras} onToggle={toggleMejora} />

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <span style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-neutral-800)" }}>
                  Adjuntar material (opcional)
                </span>
                <FileDropzone files={files} onChange={setFiles} />
              </div>

              <div className={styles.confidential}>
                <p>
                  Tratamos tu archivo como información confidencial y lo usamos solo para preparar el diagnóstico.
                  Puedes pedir que lo eliminemos en cualquier momento.
                </p>
              </div>
            </div>
          )}

          <div className={styles.actions}>
            {step > 1 && (
              <button type="button" className={styles.backBtn} onClick={back}>
                Atrás
              </button>
            )}
            {step < 3 && (
              <button type="button" className={styles.nextBtn} onClick={next}>
                Continuar
              </button>
            )}
            {step === 3 && (
              <button type="submit" className={styles.submitBtn} disabled={status === "submitting"}>
                {status === "submitting" ? "Enviando…" : "Solicitar diagnóstico"}
              </button>
            )}
            <span className={styles.stepCounter}>Paso {step} de 3</span>
          </div>
        </form>
      </main>

      <MinimalFooter note="Tu información se trata de forma confidencial" links={[{ label: "ExcelWeb", to: "/" }]} />
    </div>
  );
}
