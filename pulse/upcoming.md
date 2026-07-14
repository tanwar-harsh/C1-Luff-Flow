# Upcoming Milestones

Planned work in priority order. Full roadmap: [`planning/milestones.md`](../planning/milestones.md).

---

## M11 — Pagination 📋

- `?page=` and `?limit=` on `GET /tickets` and search
- Frontend table pagination controls

---

## M12 — Frontend E2E Tests 📋

- Playwright: register → create ticket → change status → search

---

## M13 — Separate Test Database 📋

- Neon branch for integration tests (`.env.test` no longer falls back to `.env`)

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
