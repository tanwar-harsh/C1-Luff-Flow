# Upcoming Milestones

Planned work in priority order. Full roadmap: [`planning/milestones.md`](../planning/milestones.md).

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

## M11 — Production Auth Config 🔄

**Goal:** Auth works on Vercel production with latest M9b frontend.

| Task | Details |
|------|---------|
| Vercel env | `JWT_SECRET` on backend (done); verify `CORS_ORIGIN` |
| Redeploy | Backend + frontend with login/signup/landing |
| Verify | Register, login, landing page on production URL |

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
