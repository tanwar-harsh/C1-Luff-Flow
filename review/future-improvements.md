# Future Improvements

Prioritized enhancements beyond v1 scope.

## High Priority

| # | Improvement | Why |
|---|-------------|-----|
| 1 | **Authentication & authorization** | `createdBy` should come from session, not request body; enforce role-based access |
| 2 | **Separate test database** | Neon branch for integration tests to avoid wiping dev data |
| 3 | **Pagination** | Ticket list will not scale without `?page=` or cursor-based pagination |
| 4 | **Frontend E2E tests** | Playwright tests for create ticket, status change, search flows |

## Medium Priority

| # | Improvement | Why |
|---|-------------|-----|
| 5 | **React Query / SWR** | Replace `useEffect` fetching with cache, refetch, optimistic updates |
| 6 | **Ticket update form on detail page** | Currently only assignee is editable; title/description update UI missing |
| 7 | **Audit log** | Track status changes with timestamp and actor |
| 8 | **Email notifications** | Notify assignee on new ticket or status change |
| 9 | **Rate limiting** | Protect API from abuse |
| 10 | **OpenAPI / Swagger** | Auto-generated API docs from Zod schemas |

## Low Priority

| # | Improvement | Why |
|---|-------------|-----|
| 11 | **Dark mode** | DESIGN.md is light-only; would need token extension |
| 12 | **Kanban board view** | Stitch design references Board/List/Timeline views |
| 13 | **File attachments** | On tickets and comments |
| 14 | **Soft delete** | Archive tickets instead of terminal states only |
| 15 | **Prisma config migration** | Move from `package.json#prisma` to `prisma.config.ts` |
| 16 | **Docker Compose** | One-command local dev with PostgreSQL |
| 17 | **CI/CD pipeline** | GitHub Actions: lint, test, build on PR |

## Technical Debt

- Integration test suites each call `resetDatabase()` independently — could share setup
- `express.d.ts` uses `unknown` for validated request — could use generics
- No request logging correlation IDs
- Frontend `TicketDetailView` uses dynamic import for refresh — could use callback prop
