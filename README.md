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

Requisitos: Node.js 20+ y npm.

```bash
# Backend
cd backend
npm install
cp .env.example .env
npx prisma migrate dev   # crea la base SQLite local (dev.db)
npm run dev               # http://localhost:4000

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
| `npm start` | Sirve el build compilado |
| `npm test` | Tests unitarios e integración (Vitest + Supertest) |
| `npm run prisma:migrate` | Crea/aplica una migración de base de datos |

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
- **Integración**: `POST /api/leads` contra una base SQLite de test real
  (`backend/src/__tests__/leads.test.ts`); el formulario de diagnóstico completo
  con `fetch` mockeado (`frontend/src/pages/Diagnostico/Diagnostico.test.tsx`).
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

Nunca se commitea un `.env` real. La base de datos por defecto es SQLite
(cero configuración); para producción, ver `ARCHITECTURE.md` para cambiar a
Postgres.

## Deployment

1. `cd backend && npm run build` — verifica que compila sin errores.
2. `cd frontend && npm run build` — verifica el build de producción.
3. Backend: desplegar como servicio Node (Render, Railway, Fly.io, un VPS
   con PM2, etc.), con `DATABASE_URL` apuntando a una base Postgres gestionada
   y `CORS_ORIGIN` con el dominio real del frontend.
4. Frontend: build estático (`frontend/dist`) servible desde cualquier CDN
   o hosting estático (Vercel, Netlify, Cloudflare Pages), con `VITE_API_URL`
   apuntando al backend desplegado.
5. Configurar `SMTP_*` y `LEADS_NOTIFICATION_EMAIL` si se quiere que el
   equipo comercial reciba un correo por cada solicitud.

## Estado del proyecto

Ver [`ROADMAP.md`](./ROADMAP.md) para qué está terminado, qué quedó
deliberadamente fuera del MVP, y qué prepara el camino hacia un futuro
Micro-SaaS.
