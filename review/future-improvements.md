# Future Improvements

Prioritized enhancements beyond core scope. See [`pulse/upcoming.md`](../pulse/upcoming.md) for milestone-tracked work.

## Completed Since v1

| Item | Milestone | Notes |
|------|-----------|-------|
| Authentication (backend) | M8 | JWT cookies, refresh tokens, middleware |
| Dark mode | M7 | Theme toggle, CSS variables |
| Vercel deployment | M6 | Backend + frontend live |

## High Priority (scheduled as milestones)

| # | Improvement | Milestone | Why |
|---|-------------|-----------|-----|
| 1 | **Frontend auth UI** | M9 | Login/register pages, session context |
| 2 | **Route protection & RBAC** | M10 | `createdBy` from session; protect ticket routes |
| 3 | **Production auth config** | M11 | `JWT_SECRET` on Vercel |
| 4 | **Separate test database** | M14 | Neon branch — stop wiping dev data |
| 5 | **Pagination** | M12 | Ticket list will not scale without `?page=` |
| 6 | **Frontend E2E tests** | M13 | Playwright for auth + ticket flows |

## Medium Priority

| # | Improvement | Milestone | Why |
|---|-------------|-----------|-----|
| 7 | **React Query / SWR** | Backlog | Replace `useEffect` fetching with cache |
| 8 | **Ticket update form on detail page** | Backlog | Title/description edit UI missing |
| 9 | **Audit log** | M15 | Track status changes with actor |
| 10 | **Email notifications** | Backlog | Notify assignee on changes |
| 11 | **Rate limiting** | Backlog | Protect API from abuse |
| 12 | **OpenAPI / Swagger** | M16 | Auto-generated API docs |

## Low Priority

| # | Improvement | Why |
|---|-------------|-----|
| 13 | **Kanban board view** | Stitch design references Board/List/Timeline |
| 14 | **File attachments** | On tickets and comments |
| 15 | **Soft delete** | Archive tickets |
| 16 | **Prisma config migration** | `package.json#prisma` → `prisma.config.ts` |
| 17 | **Docker Compose** | One-command local dev |
| 18 | **CI/CD pipeline** | M17 — GitHub Actions on PR |

## Technical Debt

- Integration test suites each call `resetDatabase()` independently — could share setup
- Ticket routes still accept `createdBy` in body (fix in M10)
- `express.d.ts` uses `unknown` for validated request — could use generics
- No request logging correlation IDs
- Frontend `TicketDetailView` uses dynamic import for refresh — could use callback prop
- Production Vercel needs `JWT_SECRET` and redeploy after M8
