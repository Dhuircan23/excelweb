import { useDocumentMeta } from "../../lib/useDocumentMeta";
import { LegalLayout, LegalSection } from "./LegalLayout";

export default function Terminos() {
  useDocumentMeta({
    title: "Términos de uso",
    description: "Condiciones de uso del sitio ExcelWeb, la demo interactiva y el proceso de diagnóstico comercial.",
    path: "/terminos",
  });

  return (
    <LegalLayout kicker="TÉRMINOS" title="Términos de uso" updated="agosto de 2026">
      <LegalSection title="Qué es este sitio">
        <p>
          ExcelWeb es la plataforma comercial de un servicio que transforma procesos manuales basados en Excel en
          aplicaciones web y automatizaciones. Este sitio explica el servicio, muestra una demo y casos ilustrativos,
          y recibe solicitudes de diagnóstico. No es todavía el sistema que recibirán los clientes.
        </p>
      </LegalSection>
      <LegalSection title="La demo interactiva">
        <p>
          La demo en <code>/demo</code> y el dashboard conceptual en <code>/dashboard-ejemplo</code> usan datos
          ficticios con fines ilustrativos. Se ejecutan íntegramente en tu navegador: no se envía ni almacena
          ninguna información al interactuar con ellas.
        </p>
      </LegalSection>
      <LegalSection title="El diagnóstico">
        <p>
          Enviar el formulario de diagnóstico no genera ningún compromiso de pago. Es el punto de partida para una
          sesión de análisis; después de ella recibirás una propuesta con alcance, plazo y precio antes de que
          comience cualquier desarrollo.
        </p>
      </LegalSection>
      <LegalSection title="Propiedad de lo que se construye">
        <p>
          El sistema, el código y los datos migrados que se entregan al final de un proyecto son propiedad del
          cliente que lo contrató, salvo acuerdo distinto por escrito.
        </p>
      </LegalSection>
      <LegalSection title="Contacto">
        <p>
          Preguntas sobre estos términos: <a href="mailto:hola@excelweb.app">hola@excelweb.app</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
