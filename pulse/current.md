# Current Status

**Last updated:** 2026-07-14  
**Active milestone:** M10 — Route Protection & RBAC (planned)  
**Latest completed:** M9b — Auth UI & Public Landing

---

## Health Check

| Area | Status | Notes |
|------|--------|-------|
| Backend build | ✅ | `tsc` passes |
| Backend tests | ✅ | 54/54 passing |
| Frontend build | ✅ | `next build` passes |
| Production (Vercel) | ⚠️ | Needs redeploy with M9b frontend |
| Database (Neon) | ✅ | 2 migrations applied |
| Auth (backend) | ✅ | Register, login, refresh, logout, middleware |
| User CRUD (backend) | ✅ | Paginated admin API + PATCH /me |
| Auth (frontend) | ✅ | Login, signup, landing, AuthProvider, conditional nav |
| Dark mode | ✅ | Toggle in header |

---

## Recent Changes (M9b)

- Stitch-aligned `/login` and `/signup` pages with `AuthLayout`, `PasswordInput`
- Signup flow wired to `POST /api/auth/register` via `AuthContext.register()`
- Public landing page at `/` for unauthenticated visitors (Stitch screen)
- Header hides Tickets / Create / Search tabs when logged out
- Logout redirects to landing page (`/`)
- `DESIGN.md` updated with Login, Sign Up, and Landing screen references

---

## Previous (M9)

- Admin user CRUD API with pagination
- `PATCH /api/users/me` for profile updates
- `GET /api/users/assignees` for ticket dropdowns (ADMIN/AGENT)
- Frontend: `/admin/users`, RoleBadge, UserTable, forms
- `withCredentials` on Axios client

---

## Next Up

**M10:** Protect ticket routes, derive `createdBy` from session, role-based ticket actions.

**M11:** Redeploy frontend + backend to Vercel with latest auth UI.

See [`upcoming.md`](./upcoming.md).
