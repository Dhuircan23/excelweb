# ExcelWeb — MVP comercial

Plataforma comercial de ExcelWeb: transformamos procesos manuales basados en
Excel en aplicaciones web y automatizaciones. Este repositorio contiene el
**MVP comercial** — el sitio con el que un visitante entiende el servicio,
prueba una demo, y solicita un diagnóstico — no el producto final que
reciben los clientes.

El diseño de referencia (deliverable de Claude Design) vive en [`design/`](./design)
y sigue siendo la fuente de verdad visual y de contenido; este repo lo
convierte en una aplicación real: React + TypeScript en el frontend,
Express + Prisma en el backend.

## Qué incluye

| Ruta | Página |
| --- | --- |
| `/` | Landing |
| `/demo` | Demo interactiva Excel → app (100% cliente, sin backend) |
| `/diagnostico` | Formulario de diagnóstico (3 pasos, con adjuntos) |
| `/diagnostico/gracias` | Confirmación de envío |
| `/dashboard-ejemplo` | Dashboard conceptual con datos ficticios |
| `/privacidad`, `/terminos` | Legales |

## Estructura del repositorio

```
excelweb/
├── design/          # Deliverable original de Claude Design (referencia, no se ejecuta)
├── frontend/         # React + TypeScript + Vite (SPA)
├── backend/          # Express + TypeScript + Prisma (API REST)
└── README.md          # este archivo
```

Ver [`ARCHITECTURE.md`](./ARCHITECTURE.md) para el detalle técnico y
[`ROADMAP.md`](./ROADMAP.md) para qué queda fuera del MVP a propósito.

## Instalación

Requisitos: Node.js 20+, npm, y una instancia de **Postgres** (local o remota).

**Postgres local** — la forma más simple, con el Postgres del sistema:

```bash
sudo service postgresql start   # o: pg_ctlcluster <versión> main start
sudo -u postgres psql -c "CREATE USER excelweb WITH PASSWORD 'excelweb' SUPERUSER;"
sudo -u postgres psql -c "CREATE DATABASE excelweb_dev OWNER excelweb;"
sudo -u postgres psql -c "CREATE DATABASE excelweb_test OWNER excelweb;"   # para los tests
```

(Docker también sirve: `docker run -d -p 5432:5432 -e POSTGRES_USER=excelweb -e POSTGRES_PASSWORD=excelweb -e POSTGRES_DB=excelweb_dev postgres:16`.)

```bash
# Backend
cd backend
npm install                # también genera el cliente de Prisma (postinstall)
cp .env.example .env       # ya trae el DATABASE_URL de arriba por defecto
npx prisma migrate dev     # aplica las migraciones a excelweb_dev
npm run dev                 # http://localhost:4000

# Frontend (en otra terminal)
cd frontend
npm install
cp .env.example .env.local
npm run dev               # http://localhost:5173
```

Con ambos servidores corriendo, `http://localhost:5173` sirve el sitio
completo y el formulario de diagnóstico envía a la API local.

## Comandos

**Backend** (`backend/`)

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Aplica migraciones pendientes (`prisma migrate deploy`) y sirve el build compilado |
| `npm test` | Tests unitarios e integración (Vitest + Supertest, contra `excelweb_test`) |
| `npm run prisma:migrate` | Crea/aplica una migración de base de datos en desarrollo |

**Frontend** (`frontend/`)

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo Vite |
| `npm run build` | Type-check + build de producción a `dist/` |
| `npm run preview` | Sirve el build de producción localmente |
| `npm test` | Tests unitarios/integración (Vitest + Testing Library) |
| `npm run test:e2e` | Flujo crítico end-to-end (Playwright) — levanta ambos servidores solo |
| `npm run lint` | Lint (oxlint) |

## Testing

- **Unitarias**: validación de formularios y de archivos (`backend/src/lib/validation.ts`,
  `frontend/src/lib/fileValidation.ts`, `frontend/src/pages/Diagnostico/validation.ts`).
- **Integración**: `POST /api/leads` contra una base Postgres de test real —
  `excelweb_test`, ver "Instalación" (`backend/src/__tests__/leads.test.ts`);
  el formulario de diagnóstico completo con `fetch` mockeado
  (`frontend/src/pages/Diagnostico/Diagnostico.test.tsx`).
- **E2E**: `frontend/e2e/critical-flow.spec.ts` cubre landing → demo → diagnóstico
  → envío → confirmación, contra el backend real, más una comprobación de que
  ninguna página produce scroll horizontal en móvil (375px).

Para correr el E2E necesitas Playwright con un navegador instalado
(`npx playwright install chromium` si no lo tienes ya).

## Configuración

Cada app tiene su propio `.env.example` documentado:

- [`backend/.env.example`](./backend/.env.example) — puerto, base de datos,
  CORS, límites de archivos, SMTP opcional para notificar al equipo comercial.
- [`frontend/.env.example`](./frontend/.env.example) — URL de la API.

Nunca se commitea un `.env` real.

## Deployment

Repo monorepo — **el backend y el frontend son dos servicios separados**,
cada uno con su propio `package.json`. Cualquier plataforma que despliegue
"desde la raíz del repo" (Railway, Render, etc.) necesita que le indiques
el subdirectorio de cada servicio; si no, no encuentra un solo `package.json`
en la raíz y falla.

1. `cd backend && npm run build` — verifica que compila sin errores.
2. `cd frontend && npm run build` — verifica el build de producción.
3. Backend: desplegar como servicio Node (Render, Railway, Fly.io, un VPS
   con PM2, etc.) con **el directorio raíz del servicio apuntando a `backend/`**,
   `DATABASE_URL` apuntando a una base Postgres gestionada, y `CORS_ORIGIN`
   con el dominio real del frontend. `npm start` aplica las migraciones
   pendientes automáticamente antes de arrancar.
4. Frontend: build estático (`frontend/dist`) servible desde cualquier CDN
   o hosting estático (Vercel, Netlify, Cloudflare Pages) con **el directorio
   raíz del proyecto apuntando a `frontend/`**, y `VITE_API_URL` apuntando al
   backend desplegado.
5. Configurar `SMTP_*` y `LEADS_NOTIFICATION_EMAIL` si se quiere que el
   equipo comercial reciba un correo por cada solicitud.

### Desplegar en Render + Vercel (recomendado — $0/mes)

Backend + base de datos en **Render** (tier free), frontend en **Vercel**
(tier free, sin cold start). Ambos tienen plan gratuito real, a diferencia
de Railway.

**Backend + Postgres (Render, con un solo clic vía Blueprint)**

1. En Render: *New → Blueprint* → conecta este repositorio. Render lee
   [`render.yaml`](./render.yaml) automáticamente y propone crear el
   servicio web (`excelweb-backend`, root directory `backend`, build/start
   commands, health check en `/api/health`) y la base de datos
   (`excelweb-db`) juntos, con `DATABASE_URL` ya enlazada entre ambos.
2. Render te va a pedir los valores de las variables marcadas como
   secretas en el blueprint (`CORS_ORIGIN`, `SMTP_*`, `LEADS_NOTIFICATION_EMAIL`).
   Puedes dejar `CORS_ORIGIN=http://localhost:5173` por ahora y actualizarla
   cuando tengas la URL del frontend; las de `SMTP_*` puedes dejarlas vacías
   si no quieres notificación por correo todavía.
3. Aplica el blueprint. Render instala, corre `prisma generate`
   (vía `postinstall`), compila, aplica migraciones (`prisma migrate deploy`,
   parte de `npm start`) y arranca — sin tocar ninguna configuración a mano.
4. Nota: el filesystem del plan free no es persistente entre despliegues —
   los adjuntos de los leads no sobreviven un redeploy. No es un problema
   para el MVP; ver `ROADMAP.md` para cuándo pasar a almacenamiento externo.

**Frontend (Vercel)**

1. En Vercel: *Add New → Project* → importa este repositorio.
2. En *Root Directory* selecciona `frontend` (Vercel detecta Vite
   automáticamente: build command `npm run build`, output `dist`).
3. Agrega la variable de entorno `VITE_API_URL` con la URL pública del
   backend de Render (ej. `https://excelweb-backend.onrender.com`).
4. Deploy. [`frontend/vercel.json`](./frontend/vercel.json) ya incluye la
   reescritura necesaria para que las rutas de React Router (`/demo`,
   `/diagnostico`, etc.) funcionen al refrescar o entrar por link directo,
   en vez de dar 404.
5. Vuelve al servicio del backend en Render y actualiza `CORS_ORIGIN` con
   la URL real que te dio Vercel.

### Alternativa: Railway

También funciona en Railway con el mismo `backend/` y `frontend/` como
servicios separados (fija *Root Directory* en cada uno), pero su plan
gratuito es limitado — normalmente requiere el plan Hobby de pago para uso
sostenido, por eso no es la opción por defecto aquí.

## Estado del proyecto

Ver [`ROADMAP.md`](./ROADMAP.md) para qué está terminado, qué quedó
deliberadamente fuera del MVP, y qué prepara el camino hacia un futuro
Micro-SaaS.
