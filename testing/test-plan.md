# Test Plan

## Scope
Milestone 3 backend: all API endpoints, validation, state machine, and error handling.

## Test Environment
- **Runner:** Vitest + Supertest
- **Database:** PostgreSQL test DB (`support_tickets_test` via `.env.test`)
- **Isolation:** `resetDatabase()` before each integration suite; `fileParallelism: false`

## Test Categories

### 1. Unit Tests (no database)
| File | Coverage |
|------|----------|
| `ticketStatusMachine.test.ts` | Transition map, all 8 mandatory state-machine cases at pure logic level |
| `health.test.ts` | Health check, 404 handler |

### 2. Integration Tests (require PostgreSQL)
| File | Coverage |
|------|----------|
| `stateMachine.integration.test.ts` | 8 mandatory API-level state machine cases |
| `tickets.integration.test.ts` | CRUD, validation, 404, update without status change |
| `api.integration.test.ts` | Users list, comments, search/filter |

## Mandatory State Machine Cases

| # | Transition | Expected | Test File |
|---|------------|----------|-----------|
| 1 | Open → In Progress | PASS (200) | stateMachine.integration |
| 2 | In Progress → Resolved | PASS (200) | stateMachine.integration |
| 3 | Resolved → Closed | PASS (200) | stateMachine.integration |
| 4 | Open → Cancelled | PASS (200) | stateMachine.integration |
| 5 | In Progress → Cancelled | PASS (200) | stateMachine.integration |
| 6 | Open → Resolved | FAIL (409) | stateMachine.integration |
| 7 | Resolved → Open | FAIL (409) | stateMachine.integration |
| 8 | Closed → Open | FAIL (409) | stateMachine.integration |

## API Endpoint Coverage

| Endpoint | Tests |
|----------|-------|
| `GET /api/users` | List returns 3 users |
| `POST /api/tickets` | Create, validation errors, invalid createdBy |
| `GET /api/tickets` | List tickets |
| `GET /api/tickets/:id` | Detail with relations, 404 |
| `PUT /api/tickets/:id` | Update fields, status unchanged |
| `PATCH /api/tickets/:id/status` | State machine (8 cases) |
| `POST /api/tickets/:id/comments` | Add comment, 404 |
| `GET /api/tickets/search` | Keyword, status filter, combined |

## Validation Tests
- Title min 3 / max 200 chars
- Description min 10 chars
- Required: title, description, priority, createdBy
- Field-specific error messages in `error.details`

## Running Tests

```bash
cd backend
cp .env.test.example .env.test   # configure test DATABASE_URL
createdb support_tickets_test
npm run db:migrate
npm test
```

Integration tests auto-skip if PostgreSQL is unavailable. When `.env.test` points to localhost but `.env` has a cloud URL (e.g. Neon), test setup automatically falls back to `.env`.
