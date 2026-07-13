# Assumptions

## Business & Domain
| # | Assumption | Rationale |
|---|------------|-----------|
| A-1 | No authentication in v1 | Spec lists users and roles but no auth endpoints; we treat `createdBy` as a user ID passed in the request body |
| A-2 | `role` is informational only in v1 | No RBAC enforcement unless explicitly added later |
| A-3 | New tickets default to `OPEN` status | Standard support workflow; not explicitly stated but implied by state machine |
| A-4 | `assignedTo` is optional at creation | Tickets can be created unassigned and assigned later |
| A-5 | Keyword search is case-insensitive | Better UX; standard for search features |
| A-6 | Search matches `title` and `description` | Spec example `?q=payment` implies text search on ticket content |

## Technical
| # | Assumption | Rationale |
|---|------------|-----------|
| A-7 | Backend runs on port `3001`, frontend on `3000` | Conventional Next.js + Express split |
| A-8 | API base path is `/api` on backend root | Keeps routes clean; frontend proxies or calls directly |
| A-9 | Status values stored as enum in DB: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, `CANCELLED` | Matches filter example `?status=OPEN` |
| A-10 | Priority values: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` | Standard priority scale; not specified in spec |
| A-11 | User `role` values: `ADMIN`, `AGENT`, `USER` | Reasonable defaults for a support system |
| A-12 | Timestamps are UTC, stored as `DateTime` in Prisma | Standard practice |
| A-13 | Soft delete is NOT used | Spec does not mention deletion; tickets are terminal at `CLOSED` or `CANCELLED` |
| A-14 | Comments cannot be edited or deleted in v1 | Not in spec |

## API & Error Handling
| # | Assumption | Rationale |
|---|------------|-----------|
| A-15 | Consistent response envelope: `{ success, data?, error? }` | Clean Architecture + NFR-4 |
| A-16 | HTTP 400 for validation errors, 404 for not found, 409 for invalid state transition, 500 for unexpected errors | RESTful conventions |
| A-17 | `PATCH /tickets/:id/status` body: `{ "status": "IN_PROGRESS" }` | Dedicated status endpoint implies status-only payload |

## Testing
| # | Assumption | Rationale |
|---|------------|-----------|
| A-18 | Integration tests run against a separate test database | Avoid polluting dev data |
| A-19 | Seed script provides sample users and tickets | Enables manual QA and test fixtures |

## Risks if Assumptions Are Wrong
- **A-1 (no auth):** If auth is required, we add middleware + session/JWT in a later milestone without restructuring layers.
- **A-9 (enum casing):** Frontend display labels can differ from API values via a mapping layer.
- **A-10 (priority values):** Easy to adjust in Prisma enum + Zod schema.
