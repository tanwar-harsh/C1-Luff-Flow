# Prompt 02 — Backend Scaffolding

## Prompt
> Confirmed, assumptions and architecture decisions look good. Please proceed with Milestone 2.

## Reason
Milestone 1 planning was approved. Time to scaffold the backend infrastructure: Prisma schema, migrations, seed data, repository layer, error handling, and health check — without business API endpoints yet.

## AI Response Summary
- Created `backend/` with Express + TypeScript project configuration
- Implemented Prisma schema matching `planning/database-design.md` (User, Ticket, Comment + enums)
- Built repository interfaces and Prisma implementations with `createRepositories()` factory for DI
- Added Zod-validated env config, centralized error handler, consistent API response envelope
- Wired Express app with CORS, morgan logging, health check route (`GET /api/health`)
- Created seed script: 3 users, 5 tickets (all statuses), 3 comments
- Added Vitest + Supertest with health check smoke tests
- Wrote README with backend setup instructions

## Lessons Learned
- **Factory pattern (`createApp(repositories?)`)** enables testability without a DI framework — inject mock repos in tests later.
- **Repository interfaces before services** — services in M3 will depend on contracts, not Prisma directly.
- **Seed data covering all statuses** — invaluable for manual QA and state machine tests in M3.
- **Incremental verification** — health check test confirms HTTP layer works before adding DB-dependent endpoints.
