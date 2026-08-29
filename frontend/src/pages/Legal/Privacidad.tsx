import { useDocumentMeta } from "../../lib/useDocumentMeta";
import { LegalLayout, LegalSection } from "./LegalLayout";

export default function Privacidad() {
  useDocumentMeta({
    title: "Política de privacidad",
    description: "Qué datos recogemos en ExcelWeb, para qué los usamos y cómo puedes pedir que los eliminemos.",
    path: "/privacidad",
  });

  return (
    <LegalLayout kicker="PRIVACIDAD" title="Política de privacidad" updated="agosto de 2026">
      <LegalSection title="Qué datos recogemos">
        <p>
          Cuando completas el formulario de diagnóstico recogemos tu nombre, empresa, correo electrónico y,
          opcionalmente, tu WhatsApp, industria y la descripción de tu proceso actual. Si adjuntas un archivo
          (Excel, CSV, PDF o una imagen), lo almacenamos junto con tu solicitud.
        </p>
        <p>
          Además registramos un pequeño conjunto de eventos de uso del sitio (por ejemplo, que se inició la demo o
          que se envió el formulario) sin datos personales asociados, para entender en qué parte del recorrido se
          pierden los visitantes.
        </p>
      </LegalSection>
      <LegalSection title="Para qué los usamos">
        <ul>
          <li>Preparar el diagnóstico y la propuesta que solicitaste.</li>
          <li>Contactarte por correo o WhatsApp sobre tu solicitud.</li>
          <li>Mejorar el sitio a partir de los eventos de uso agregados.</li>
        </ul>
        <p>No vendemos ni compartimos tu información con terceros con fines comerciales.</p>
      </LegalSection>
      <LegalSection title="Cuánto tiempo la conservamos">
        <p>
          Conservamos tu solicitud y los archivos adjuntos mientras evaluamos y desarrollamos tu proyecto. Puedes
          pedir que eliminemos tu información en cualquier momento escribiendo a{" "}
          <a href="mailto:hola@excelweb.app">hola@excelweb.app</a>.
        </p>
      </LegalSection>
      <LegalSection title="Tus derechos">
        <p>
          Puedes solicitar acceso, corrección o eliminación de tus datos en cualquier momento. Responderemos en un
          plazo razonable desde el mismo correo de contacto.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
