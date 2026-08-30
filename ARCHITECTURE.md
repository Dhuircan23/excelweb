# Arquitectura

## Resumen

Dos aplicaciones independientes que se comunican por HTTP:

```
┌─────────────────────┐        HTTPS/JSON          ┌──────────────────────┐
│  frontend/           │  ───────────────────────▶  │  backend/             │
│  React 19 + TS       │   POST /api/leads (multi-  │  Express + TS          │
│  Vite (SPA, CSR)      │   part con adjuntos)        │  Prisma ORM            │
│  react-router-dom     │   POST /api/events (json)   │  Postgres              │
│                       │  ◀───────────────────────  │                        │
└─────────────────────┘        201 / 4xx JSON        └──────────────────────┘
```

No hay área autenticada en el MVP: todo el sitio es público. El dashboard en
`/dashboard-ejemplo` es una página de ejemplo con datos ficticios, no un
producto con login.

## Frontend (`frontend/`)

- **React 19 + TypeScript + Vite**, sin framework de SSR — un SPA client-side
  es suficiente para un sitio de cinco rutas con una demo interactiva que no
  necesita datos del servidor.
- **react-router-dom** para las rutas (`src/router/AppRouter.tsx`), con
  `React.lazy` por página para que cada ruta cargue solo su propio código.
- **CSS Modules** + un único archivo de tokens (`src/styles/tokens.css`,
  copiado del sistema de diseño "Modernist" en `design/_ds/`) — sin librería
  de UI ni Tailwind. Cada componente/página tiene su `.module.css` junto al
  `.tsx`.
- **Sin librería de gráficos**: las barras son `<div>` con `height` en
  porcentaje, tal como especifica el diseño de referencia.
- **Estructura por página** (`src/pages/<Página>/`): `Página.tsx`,
  `Página.module.css`, `content.ts` (copy y datos ficticios, separados de la
  UI) y, si aplica, `validation.ts`.
- **Componentes reutilizables** (`src/components/`): `Tag`, `DataTable`,
  `MetricCell`/`MetricGrid`, `BarChart`, `SidebarNav`, `Field`
  (texto/textarea/select), `SegmentedControl`, `ChipGroup`, `FileDropzone`,
  `EmptyState`, `UtilityHeader`, `MinimalFooter` — nombrados 1:1 con la lista
  de componentes de `design/especificacion.html` §04.
- **`src/lib/`**: `api.ts` (cliente HTTP para `/api/leads`), `analytics.ts`
  (`track()` minimalista hacia `/api/events`), `fileValidation.ts`
  (espejo cliente de las reglas de archivo del backend, solo para UX — el
  servidor es quien realmente valida), `useDocumentMeta.ts` (SEO por ruta,
  sin `react-helmet`).

## Backend (`backend/`)

- **Express + TypeScript**, un único proceso HTTP. `src/app.ts` construye la
  app (testeable con Supertest sin levantar un puerto real); `src/index.ts`
  la sirve.
- **Prisma ORM** sobre **Postgres**, tanto en desarrollo como en producción
  (`prisma/schema.prisma`) — mismo motor en ambos lados para no tener
  sorpresas de compatibilidad al desplegar. Ver README.md para levantar un
  Postgres local.
- **Rutas**:
  - `POST /api/leads` — recibe el formulario de diagnóstico (`multipart/form-data`
    vía Multer), valida con Zod (`src/lib/validation.ts`), persiste el `Lead`
    y sus `LeadFile` en una transacción de Prisma, y dispara (sin esperar) una
    notificación por correo al equipo comercial si hay SMTP configurado.
  - `POST /api/events` — analítica mínima (nombre de evento + payload corto),
    para medir el embudo landing → demo → diagnóstico.
  - `GET /api/health` — chequeo de salud.
- **Seguridad**: `helmet` para cabeceras, CORS restringido a un origen
  configurado por env, `express-rate-limit` en ambos endpoints POST,
  validación server-side siempre (nunca se confía en la del cliente),
  lista blanca de tipo/extensión de archivo + límite de tamaño en Multer,
  nombres de archivo aleatorios en disco (el nombre original solo se guarda
  como metadato), manejador de errores central que nunca expone stack
  traces al cliente.

## Base de datos

Tres modelos (`backend/prisma/schema.prisma`):

- **`Lead`** — la solicitud de diagnóstico completa (contacto + proceso +
  categorías de interés).
- **`LeadFile`** — un archivo adjunto a un `Lead` (relación 1:N, borrado en
  cascada).
- **`AnalyticsEvent`** — un evento de producto (nombre + payload JSON corto).

No hay tabla `projects` todavía: la especificación original la marca como
"si es necesario", y en el MVP no lo es — se agrega cuando exista un caso de
uso real (por ejemplo, al pasar del diagnóstico a un proyecto activo).

### Migraciones

`backend/prisma/migrations/` guarda el historial de migraciones versionado.
En local, `npm run prisma:migrate` (alias de `prisma migrate dev`) crea una
nueva migración cuando cambia el esquema. En producción, `npm start` corre
`prisma migrate deploy` antes de arrancar el servidor — aplica cualquier
migración pendiente automáticamente en cada despliegue, sin paso manual.

## Flujo de datos: envío del diagnóstico

1. El usuario completa el formulario de 3 pasos (`Diagnostico.tsx`). La
   validación de campos obligatorios se dispara al intentar avanzar de paso,
   no al escribir, replicando el comportamiento del diseño original.
2. Los archivos adjuntos se validan en el cliente (`FileDropzone` +
   `fileValidation.ts`) solo para dar feedback inmediato — nunca son la
   fuente de verdad.
3. Al enviar, `lib/api.ts#submitLead` arma un `FormData` y hace
   `POST /api/leads`. Estado de UI: `idle → submitting → (success | error)`.
4. El backend vuelve a validar todo con Zod, guarda el `Lead` + `LeadFile[]`
   en una transacción, y responde `201` con el `id`.
5. El frontend navega a `/diagnostico/gracias` pasando `{ name, email }` por
   `location.state` para personalizar el mensaje de confirmación.
6. En paralelo (sin bloquear la respuesta), el backend intenta notificar por
   correo al equipo comercial. Si falla o no hay SMTP configurado, el lead
   ya está guardado igual — la notificación es un best-effort, nunca una
   condición para el éxito del envío.

## Decisiones importantes

- **CSR, no SSR**: para un MVP de 8 rutas sin necesidad de SEO dinámico por
  usuario ni de datos personalizados en el primer render, un SPA es más
  simple de operar (un solo build estático) sin perder nada relevante. El
  SEO estático (title, meta, OG) se resuelve por ruta con un hook liviano.
- **Postgres en dev y prod, no SQLite**: al principio el MVP usaba SQLite en
  desarrollo por cero configuración, pero eso hace que el primer despliegue
  real sea la primera vez que el esquema corre contra Postgres — justo el
  peor momento para descubrir una diferencia de tipos o de migraciones. Un
  solo motor en todos lados evita esa sorpresa a cambio de necesitar
  Postgres instalado localmente (ver README.md).
- **Sin autenticación ni multiempresa en el MVP**: el dashboard es una
  página pública de ejemplo, no un producto. Ver `ROADMAP.md` para cómo la
  forma de los datos ya está preparada para no bloquear esa evolución.
- **Analítica propia mínima en vez de un SDK de terceros**: cuatro-seis
  eventos con nombre fijo, sin cookies ni terceros, evita tanto la
  sobreingeniería como el "tracking invasivo" que pide la especificación.
