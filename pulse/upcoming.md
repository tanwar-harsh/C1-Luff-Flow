# Upcoming Milestones

Planned work in priority order. Full roadmap: [`planning/milestones.md`](../planning/milestones.md).

---

## M9 — Frontend Auth UI 📋

**Goal:** Login and register pages; session-aware app shell.

| Task | Details |
|------|---------|
| Login page | `/login` — email + password form |
| Register page | `/register` — name, email, password |
| Axios config | `withCredentials: true` for cookie auth |
| Auth context | `useAuth()`, load user via `GET /api/auth/me` |
| Auto-refresh | Call `POST /api/auth/refresh` on 401 before redirect |
| Header | Show user name + logout button |

**Acceptance criteria:**
- User can register, login, logout in browser
- Session persists across page reload
- Unauthenticated users redirected from protected routes (prep for M10)

---

## M10 — Route Protection & RBAC 📋

**Goal:** Secure ticket API; derive identity from session.

| Task | Details |
|------|---------|
| Protect routes | `authenticate` on ticket/user endpoints |
| Remove `createdBy` from body | Use `req.user.id` in services |
| Role gates | e.g. only AGENT/ADMIN can change status or assign |
| Update frontend | Remove manual user ID fields from forms |
| Update tests | Authenticated supertest helpers |

**Acceptance criteria:**
- Unauthenticated API calls return 401
- Wrong role returns 403
- Tickets created with session user as `createdBy`

---

## M11 — Production Auth Config 📋

**Goal:** Auth works on Vercel production.

| Task | Details |
|------|---------|
| Vercel env | Add `JWT_SECRET` to backend project |
| Redeploy | Backend + frontend with latest code |
| Verify | Login on production URL end-to-end |

---

## M12 — Pagination 📋

- `?page=` and `?limit=` on `GET /tickets` and search
- Frontend table pagination controls

---

## M13 — Frontend E2E Tests 📋

- Playwright: register → create ticket → change status → search

---

## M14 — Separate Test Database 📋

- Neon branch for integration tests (stop wiping dev data)

---

## M15 — Audit Log 📋

- `TicketStatusHistory` model: from, to, actor, timestamp

---

## M16 — OpenAPI / Swagger 📋

- Generate from Zod schemas or manual spec

---

## M17 — CI/CD Pipeline 📋

- GitHub Actions: lint, `npm test`, `next build` on PR

---

## Backlog (unscheduled)

| Item | Source |
|------|--------|
| React Query / SWR | `review/future-improvements.md` |
| Ticket edit form on detail page | future-improvements |
| Email notifications | future-improvements |
| Rate limiting | future-improvements |
| Kanban board view | future-improvements |
| File attachments | future-improvements |
| Docker Compose | future-improvements |
