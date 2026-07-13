# Self-Review

**Author:** Developer (with AI assistance)  
**Date:** 2026-07-13

## What Went Well

1. **Milestone-driven delivery** — Never dumped the full project; each milestone had clear scope and gate approval
2. **Design traceability** — Every endpoint maps to a user story maps to a requirement
3. **State machine** — Highest-risk business rule tested at two levels (unit + integration)
4. **DESIGN.md** — Single source of truth prevented frontend style drift
5. **Neon PostgreSQL** — Cloud DB worked with `sslmode=require` and Prisma migrate deploy

## What Could Be Better

1. **Test DB isolation** — Integration tests share Neon dev DB; should use a branch
2. **No auth** — Acceptable for v1 but `createdBy` in request body is not production-safe
3. **Frontend data fetching** — `useEffect` + `useState` is fine for v1 but doesn't scale
4. **Missing automated E2E** — Browser verification was manual only
5. **API docs duplication** — `docs/api.md` and `planning/api-design.md` overlap (acceptable for assignment)

## Manual Fixes Made

| Fix | Why |
|-----|-----|
| Restart backend after `.env` change | Server cached old localhost DATABASE_URL |
| Test setup Neon fallback | `.env.test` still pointed to localhost |
| Re-seed after integration tests | Tests call `resetDatabase()` |
| Route order `/search` before `/:id` | Express route collision |

## Code Quality Checklist

- [x] TypeScript strict mode (backend)
- [x] No `any` types in critical paths
- [x] Consistent naming conventions
- [x] No duplicated business logic across layers
- [x] Error handling centralized
- [x] Environment variables not committed
- [x] README covers setup, run, test
- [x] All deliverable folders populated

## Would I Ship This?

**As an assignment:** Yes — meets all spec requirements.  
**To production:** No — needs auth, test DB isolation, monitoring, and E2E tests first.
