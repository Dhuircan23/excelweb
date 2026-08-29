# Roadmap

Este documento separa explícitamente tres niveles, como pide el brief del
producto: **Nivel 1 (Servicio)** es lo que este repositorio construye ahora;
**Nivel 2 (Micro-SaaS)** y **Nivel 3 (Ecosistema)** son evoluciones futuras
que el MVP no bloquea, pero tampoco intenta anticipar.

## MVP (este repositorio, terminado)

- [x] Landing completa: navbar, hero con comparación Excel→app, problema,
      solución, catálogo de servicios, cómo funciona, casos de ejemplo, demo
      teaser, precios (por etapas, sin tarifa fija), FAQ, CTA final, footer.
- [x] Demo interactiva 100% client-side: Excel ficticio con 5 pestañas →
      animación de conversión → aplicación resultante navegable, con
      exportación de UI (sin backend, sin datos reales).
- [x] Formulario de diagnóstico de 3 pasos con validación real (cliente +
      servidor), adjuntos con lista blanca de tipo/tamaño, estados
      idle/submitting/success/error, página de confirmación con su propia
      ruta (`/diagnostico/gracias`).
- [x] Persistencia real: `POST /api/leads` guarda cada solicitud y sus
      archivos en base de datos (Prisma + SQLite en dev / Postgres en prod).
- [x] Notificación por correo al equipo comercial (opcional vía SMTP,
      nunca bloquea el guardado del lead).
- [x] Dashboard conceptual con datos ficticios: 6 secciones, métricas,
      gráfico de barras, alertas, actividad, tareas, tablas con estados,
      empty states.
- [x] Analítica mínima del embudo (page_view, cta_click, demo_started,
      demo_completed, diagnostico_started, diagnostico_submitted).
- [x] Responsive completo (móvil, tablet, desktop) sin scroll horizontal
      accidental — verificado con Playwright en 375px en las 4 páginas
      principales.
- [x] Accesibilidad base: HTML semántico, labels asociados, navegación por
      teclado, foco visible, `aria-expanded`/`aria-pressed` donde
      corresponde, skip link.
- [x] SEO: title/description/OG por ruta, favicon, canonical.
- [x] Seguridad: validación server-side, sanitización, rate limiting,
      lista blanca de archivos, sin secretos en el frontend, manejo de
      errores que nunca expone detalles internos.
- [x] Tests: unitarios (validación de formulario y de archivos),
      integración (API de leads contra una base de test real, formulario
      completo con Testing Library), E2E (flujo crítico completo con
      Playwright + chequeo de overflow móvil).
- [x] Documentación: este archivo, `README.md`, `ARCHITECTURE.md`,
      `.env.example` en cada app.

## Explícitamente fuera del MVP

Por diseño, no en este repositorio todavía:

- Marketplace de plantillas o de automatizaciones.
- Sistema multiempresa / organizaciones con roles y permisos.
- Autenticación y área de cliente logueada (el dashboard es un ejemplo
  público, no un producto).
- IA avanzada o chatbot.
- CRM empresarial completo (más allá del caso de ejemplo ilustrado en la
  landing).
- Facturación o cobro dentro del producto.
- Aplicación móvil nativa.
- Arquitectura distribuida (colas, microservicios, múltiples bases de
  datos) — un monolito Express es más que suficiente para el tráfico y la
  complejidad actuales.

## V2 (siguiente, una vez validado el Nivel 1)

Candidatos naturales una vez que el negocio de servicio esté funcionando:

- Panel interno simple para que el equipo comercial gestione los leads
  recibidos (cambiar `status`, ver adjuntos, anotar seguimiento) en vez de
  consultarlos solo por correo o directamente en la base de datos.
- Analítica con más profundidad (embudo por fuente de tráfico, tasas de
  conversión por sección) sobre los eventos que el MVP ya está guardando.
- Editor de casos de ejemplo y FAQ sin tocar código (hoy viven en
  `frontend/src/pages/Landing/content.ts`, a propósito simples de editar a
  mano mientras el volumen de contenido es bajo).
- Subida de archivos a almacenamiento en la nube (S3/GCS) en vez de disco
  local, cuando el volumen de adjuntos lo justifique.

## Micro-SaaS (Nivel 2)

Cuando un mismo tipo de proceso (ej. "control de inventario") se repita lo
suficiente entre clientes de servicio, ese patrón se convierte en un
producto propio. La arquitectura actual ya no bloquea esto:

- El modelo `Lead` es independiente de cualquier modelo de proyecto o
  cliente futuro — se puede agregar `Project`/`Organization`/`User` sin
  reescribir lo existente.
- Prisma + una base relacional real (Postgres) soportan directamente
  añadir autenticación, roles y tablas multiempresa cuando se necesiten.
- El frontend ya está separado en una app propia con su propio build; un
  Micro-SaaS puede vivir como una segunda app en este mismo backend o como
  un servicio nuevo que reutiliza el design system de `frontend/src/styles`.

Ninguna de estas piezas se construye ahora — la instrucción explícita del
producto es demostrar primero que alguien paga por el Nivel 1.

## Ecosistema (Nivel 3)

Fuera de alcance para cualquier planificación concreta hasta que existan
varios Micro-SaaS validados. No se diseña ni se menciona en el código.
