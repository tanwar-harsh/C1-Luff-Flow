# Current Status

**Last updated:** 2026-07-14  
**Active milestone:** M11 — Pagination (planned)  
**Latest completed:** M10 — Route Protection & RBAC

---

## Health Check

| Area | Status | Notes |
|------|--------|-------|
| Backend build | ✅ | `tsc` passes |
| Backend tests | ✅ | 58/58 passing |
| Frontend build | ✅ | `next build` passes |
| Production (Vercel) | ✅ | Deployed 2026-07-14 (RBAC + centered navbar) |
| Database (Neon) | ✅ | 2 migrations; demo users via `db:seed:demo` |
| Auth (backend) | ✅ | Register, login, refresh, logout, middleware |
| RBAC | ✅ | Ticket routes protected; USER view-only |
| User CRUD (backend) | ✅ | Paginated admin API + PATCH /me |
| Auth (frontend) | ✅ | Login, signup, landing, permissions, RequireAuth |
| Dark mode | ✅ | Toggle in header |

**Production URLs:**
- Frontend: https://frontend-alpha-murex-89.vercel.app
- Backend: https://backend-sigma-eight-96.vercel.app/api

---

## Recent Changes (M10 + deploy)

- Ticket API requires auth; mutations require AGENT or ADMIN
- `createdBy` derived from session (removed from forms)
- `permissions.ts` + conditional UI (hide, not disable)
- Centered CRUD nav tabs in header (Tickets, Create, Search, Users)
- `db:seed:demo` for production demo accounts
- Test setup isolated from production `.env`

---

## Next Up

**M11:** Pagination on ticket list and search.

See [`upcoming.md`](./upcoming.md).
