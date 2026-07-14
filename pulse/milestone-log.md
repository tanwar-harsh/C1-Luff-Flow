# Milestone Log

Chronological record of completed work.

---

## M1 — Requirements & Planning (2026-07-13) ✅

- Parsed spec into `planning/requirements.md`, `assumptions.md`, `architecture.md`
- Database, API, state machine, user stories documented
- **Output:** `/planning/` (7 docs)

---

## M2 — Backend Infrastructure (2026-07-13) ✅

- Express + Prisma + TypeScript scaffold
- User, Ticket, Comment models + initial migration
- Repository pattern, error handler, health check
- Seed script (3 users, 5 tickets, 3 comments)

---

## M2b — Design Extraction (2026-07-13) ✅

- Stitch MCP → Luff-Flow Ticket Manager
- `DESIGN.md` as single source of truth for UI tokens

---

## M3 — Backend API (2026-07-13) ✅

- All 8 ticket/user endpoints
- State machine in service layer
- Zod validators, integration + unit tests

---

## M4 — Frontend (2026-07-13) ✅

- Next.js App Router: `/`, `/tickets/new`, `/tickets/[id]`, `/search`
- React Hook Form + Zod, Axios client, DESIGN.md styling

---

## M5 — Testing & Documentation (2026-07-13) ✅

- 34/34 tests passing on Neon PostgreSQL
- `docs/api.md`, `tool-workflow.md`, `review/*`, `reflection/reflection.md`
- README fully updated

---

## M6 — Vercel Deployment (2026-07-13) ✅

- Backend serverless (`api/index.ts`, `vercel.json`)
- Two Vercel projects (backend + frontend)
- `docs/deployment-vercel.md`
- **URLs:** frontend-alpha-murex-89.vercel.app, backend-sigma-eight-96.vercel.app

---

## M7 — Dark / Light Theme (2026-07-13) ✅

- CSS variable palettes for light and dark
- `ThemeProvider` + header toggle
- `color-scheme` + localStorage persistence
- **Files:** `context/ThemeContext.tsx`, `components/ui/ThemeToggle.tsx`, `globals.css`

---

## M8 — Backend Authentication (2026-07-14) ✅

- `passwordHash` on User, `RefreshToken` model
- `POST /api/auth/register`, `/login`, `/refresh`, `/logout`
- `GET /api/auth/me`
- bcrypt (12 rounds), JWT access cookie (15 min), SHA-256 hashed refresh tokens (7 days)
- `authenticate` + `authorize(...roles)` middleware
- Migration `20260714061742_add_auth`
- 44/44 tests passing
- **Spec:** [`planning/auth-design.md`](../planning/auth-design.md)
