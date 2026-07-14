# Milestone Roadmap

Master index for all project milestones. Status is mirrored in [`pulse/current.md`](../pulse/current.md).

## Legend

| Status | Meaning |
|--------|---------|
| ✅ Done | Shipped and tested |
| 🔄 In progress | Active work |
| 📋 Planned | Scoped, not started |
| ⏸ Deferred | Out of current scope |

---

## Phase 1 — Core Assignment (M1–M5)

| ID | Milestone | Status | Key deliverables |
|----|-----------|--------|------------------|
| **M1** | Requirements & Planning | ✅ Done | `planning/*`, assumptions, architecture |
| **M2** | Backend Infrastructure | ✅ Done | Prisma schema, repositories, health check |
| **M2b** | Design Extraction | ✅ Done | `DESIGN.md` via Stitch MCP |
| **M3** | Backend API | ✅ Done | 8 ticket/user endpoints, state machine, Zod |
| **M4** | Frontend | ✅ Done | Next.js pages, forms, DESIGN.md styling |
| **M5** | Testing & Documentation | ✅ Done | 34 tests, review/, reflection/, `docs/api.md` |

---

## Phase 2 — Production & UX (M6–M7)

| ID | Milestone | Status | Key deliverables |
|----|-----------|--------|------------------|
| **M6** | Vercel Deployment | ✅ Done | `backend/vercel.json`, `api/index.ts`, `docs/deployment-vercel.md` |
| **M7** | Dark / Light Theme | ✅ Done | CSS variables, `ThemeProvider`, header toggle |

**Deployed URLs (M6):**
- Frontend: https://frontend-alpha-murex-89.vercel.app
- Backend: https://backend-sigma-eight-96.vercel.app/api

---

## Phase 3 — Security (M8–M10)

| ID | Milestone | Status | Key deliverables |
|----|-----------|--------|------------------|
| **M8** | Backend Authentication | ✅ Done | `passwordHash`, `RefreshToken`, `/auth/*`, middleware — see [`auth-design.md`](./auth-design.md) |
| **M9** | User CRUD & Role Management | ✅ Done | Admin user API, `/admin/users` page, login — see [`user-management.md`](./user-management.md) |
| **M9b** | Auth UI & Public Landing | ✅ Done | Stitch login/signup, `/signup`, landing page, conditional nav — see [`auth-ui.md`](./auth-ui.md) |
| **M10** | Route Protection & RBAC | ✅ Done | Protected ticket routes, role UI gates, session `createdBy` — see [`rbac-design.md`](./rbac-design.md) |

---

## Phase 4 — Scale & Quality (M11+)

| ID | Milestone | Status | Key deliverables |
|----|-----------|--------|------------------|
| **M11** | Pagination | 📋 Planned | `?page=` or cursor on ticket list/search |
| **M12** | Frontend E2E Tests | 📋 Planned | Playwright: login, create ticket, status change |
| **M13** | Separate Test Database | 📋 Planned | Neon branch for integration tests |
| **M14** | Audit Log | 📋 Planned | Status change history with actor + timestamp |
| **M15** | OpenAPI / Swagger | 📋 Planned | Auto-generated docs from Zod schemas |
| **M16** | CI/CD Pipeline | 📋 Planned | GitHub Actions: lint, test, build on PR |

---

## Milestone → Folder Mapping

| Folder | Purpose |
|--------|---------|
| [`planning/`](../planning/) | Design specs, requirements, milestone plans |
| [`pulse/`](../pulse/) | Live status, milestone log, upcoming work |
| [`prompts/`](../prompts/) | AI prompt history per milestone |
| [`docs/`](../docs/) | API reference, deployment guides |
| [`testing/`](../testing/) | Test plans and results |
| [`review/`](../review/) | Reviews and future improvements |

---

## Changelog

| Date | Milestone | Notes |
|------|-----------|-------|
| 2026-07-13 | M1–M5 | Core assignment complete |
| 2026-07-13 | M6 | Deployed to Vercel (backend + frontend) |
| 2026-07-13 | M7 | Dark/light theme toggle |
| 2026-07-14 | M8 | Backend auth: bcrypt, JWT cookies, refresh tokens, middleware |
| 2026-07-14 | M9 | User CRUD & role management (admin API + frontend) |
| 2026-07-14 | M9b | Stitch auth UI (login/signup), public landing page, conditional nav |
| 2026-07-14 | M10 | RBAC: protected routes, role-based UI, session createdBy |
| 2026-07-14 | Deploy | RBAC + centered navbar; demo seed fix; test DB isolation |
