# Integration Test Results

**Last updated:** 2026-07-14 (M10 — RBAC)  
**Environment:** PostgreSQL via `.env.test` (local) or skipped if unavailable

## Summary

| Category | Files | Tests | Passed | Failed |
|----------|-------|-------|--------|--------|
| Unit | 2 | 12 | 12 | 0 |
| Integration | 6 | 46 | 46 | 0 |
| **Total** | **8** | **58** | **58** | **0** |

**Result: ✅ ALL TESTS PASSING**

> Includes M8 auth, M9 users, M10 RBAC (401/403 cases). Integration tests use `.env.test` only — no fallback to production `.env`.

## Unit Test Results

### `ticketStatusMachine.test.ts` — 10/10 PASS
- Transition map matches spec
- 5 valid transitions accepted
- 3 invalid transitions rejected with correct error message
- No-op transitions rejected

### `health.test.ts` — 2/2 PASS
- `GET /api/health` returns 200
- Unknown routes return 404

## Integration Test Results

### `stateMachine.integration.test.ts` — 8/8 PASS

| # | Test | Result |
|---|------|--------|
| 1 | Open → In Progress | ✅ PASS |
| 2 | In Progress → Resolved | ✅ PASS |
| 3 | Resolved → Closed | ✅ PASS |
| 4 | Open → Cancelled | ✅ PASS |
| 5 | In Progress → Cancelled | ✅ PASS |
| 6 | Open → Resolved (409) | ✅ FAIL as expected |
| 7 | Resolved → Open (409) | ✅ FAIL as expected |
| 8 | Closed → Open (409) | ✅ FAIL as expected |

### `tickets.integration.test.ts` — 8/8 PASS
- Create ticket with OPEN status
- Validation: invalid title, missing createdBy, invalid user
- List tickets (newest first)
- Get ticket with relations
- 404 for unknown ticket
- Update fields without status change

### `api.integration.test.ts` — 6/6 PASS
- `GET /api/users` — returns users
- `POST /api/tickets/:id/comments` — add comment
- Comment 404 for missing ticket
- Search by keyword (`?q=payment`)
- Filter by status (`?status=OPEN`)
- Combined search (`?q=payment&status=OPEN`)

## Notes

- Integration tests use **only** `.env.test` (no `.env` fallback) to protect shared Neon DB
- Authenticated tests use `loginAsAgent` / `loginAsUser` helpers with cookies
- Production demo accounts: `npm run db:seed:demo` (safe upsert, no wipe)
- Run `npm run db:seed` or `db:seed:demo` after tests if local dev data needed

## How to Reproduce

```bash
cd backend
# Configure .env.test with local PostgreSQL test DB
npx prisma migrate deploy
npm test
npm run db:seed:demo   # restore demo login accounts
```
