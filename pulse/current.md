# Current Status

**Last updated:** 2026-07-14  
**Active milestone:** M9 — Frontend Auth UI (planned)  
**Latest completed:** M8 — Backend Authentication

---

## Health Check

| Area | Status | Notes |
|------|--------|-------|
| Backend build | ✅ | `tsc` passes |
| Backend tests | ✅ | 44/44 passing |
| Frontend build | ✅ | `next build` passes |
| Production (Vercel) | ✅ | Frontend + backend deployed |
| Database (Neon) | ✅ | 2 migrations applied |
| Auth (backend) | ✅ | Register, login, refresh, logout, middleware |
| Auth (frontend) | ⏳ | Not wired — tickets still use `createdBy` in body |
| Dark mode | ✅ | Toggle in header |

---

## Production URLs

| App | URL |
|-----|-----|
| Frontend | https://frontend-alpha-murex-89.vercel.app |
| Backend API | https://backend-sigma-eight-96.vercel.app/api |

---

## Recent Changes (M8)

- `User.passwordHash` + `RefreshToken` model
- `POST /api/auth/register`, `/login`, `/refresh`, `/logout`
- `GET /api/auth/me` with `authenticate` middleware
- `authenticate` + `authorize(...roles)` middleware
- bcrypt passwords, JWT access cookie (15 min), hashed refresh tokens (7 days)
- Migration `20260714061742_add_auth`

---

## Blockers

| Blocker | Impact | Action |
|---------|--------|--------|
| `JWT_SECRET` not on Vercel | Auth fails in production after redeploy | Add env var + redeploy backend (M11) |
| Frontend not redeployed since M7/M8 | Production missing theme + auth backend | Redeploy both projects |

---

## Next Up

See [`upcoming.md`](./upcoming.md) — **M9: Frontend Auth UI** is the immediate priority.
