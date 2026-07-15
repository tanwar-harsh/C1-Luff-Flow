# Prompt 19 — TicketService Unit Tests

## Prompt
> Look at my service layer. Write unit tests for each service function using Vitest, mocking Prisma calls so these don't hit the real database. Start with the ticket service only, show me the tests, and wait for my confirmation before doing the next service.

## Delivered
- [`backend/src/tests/TicketService.test.ts`](../backend/src/tests/TicketService.test.ts) — 15 tests
- Mocks `ITicketRepository` + `UserService.ensureUserExists` (no DB)
- Covers: create, list, getById, update, updateStatus, search + error paths

## Status
**Waiting for user confirmation** before UserService, CommentService, AuthService tests.
