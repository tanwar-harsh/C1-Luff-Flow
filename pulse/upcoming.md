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

## M11 — Pagination 📋

- `?page=` and `?limit=` on `GET /tickets` and search
- Frontend table pagination controls

---

## M12 — Frontend E2E Tests 📋

- Playwright: register → create ticket → change status → search

---

## M13 — Separate Test Database 📋

- Neon branch for integration tests (stop wiping dev data)

---

## M14 — Audit Log 📋

- `TicketStatusHistory` model: from, to, actor, timestamp

---

## M15 — OpenAPI / Swagger 📋

- Generate from Zod schemas or manual spec

---

## M16 — CI/CD Pipeline 📋

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
