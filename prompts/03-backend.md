# Prompt 03 — Backend API & State Machine

## Prompt
> Now lets proceed with Milestone 3

## Reason
Implement all business API endpoints, service layer with state machine enforcement, Zod validation, and integration tests per the project spec.

## AI Response Summary
- Created `TicketService`, `UserService`, `CommentService` with `createServices()` factory
- Implemented state machine in `ticketStatusMachine.ts` (service layer only)
- Added Zod validators for all request bodies and query params
- Built controllers and routes for all 8 endpoints
- Route ordering: `/search` before `/:id` to prevent collision
- Wrote unit tests (10 state machine cases) + integration tests (22 API cases)
- Integration tests skip gracefully when PostgreSQL unavailable
- Created `testing/test-plan.md` and `testing/integration-results.md`

## Lessons Learned
- **Route order matters:** `GET /tickets/search` must precede `GET /tickets/:id`
- **Separate status endpoint** prevents accidental status changes via PUT
- **Pure state machine module** enables fast unit tests without DB
- **describe.skipIf(!dbAvailable)** keeps CI green when no test DB is provisioned
- **validate() middleware** keeps controllers thin — they only read `req.validated`
