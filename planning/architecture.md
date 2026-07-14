# Architecture

## Pattern: Clean Architecture (Pragmatic)

We adopt Clean Architecture with **four logical layers**, adapted for an Express + Prisma stack. The goal is testability and replaceability — e.g., swapping Prisma for raw SQL should only touch the repository layer.

```
┌─────────────────────────────────────────────────────────┐
│  Presentation (Routes + Controllers + Middlewares)      │
│  - HTTP concerns only                                   │
│  - No business logic                                    │
└──────────────────────┬──────────────────────────────────┘
                       │ DTOs / validated input
┌──────────────────────▼──────────────────────────────────┐
│  Application (Services)                                 │
│  - Business rules (state machine lives here)            │
│  - Orchestrates repositories                            │
│  - Throws domain errors                                 │
└──────────────────────┬──────────────────────────────────┘
                       │ Domain models / interfaces
┌──────────────────────▼──────────────────────────────────┐
│  Domain (Types + Interfaces + Errors)                   │
│  - Pure TypeScript types and contracts                    │
│  - No framework imports                                 │
└──────────────────────┬──────────────────────────────────┘
                       │ Interface implementations
┌──────────────────────▼──────────────────────────────────┐
│  Infrastructure (Repositories + Prisma + Config)          │
│  - Database access                                      │
│  - External service adapters                            │
└─────────────────────────────────────────────────────────┘
```

## Backend Layer Responsibilities

| Layer | Folder | Responsibility |
|-------|--------|----------------|
| Routes | `routes/` | Wire HTTP verbs/paths to controllers |
| Controllers | `controllers/` | Parse request, call service, format response |
| Validators | `validators/` | Zod schemas + middleware to validate body/query/params |
| Services | `services/` | Business logic, state machine, orchestration |
| Repositories | `repositories/` | Prisma queries; no business rules |
| Middlewares | `middlewares/` | Error handler, **authenticate**, **authorize**, validation runner |
| Types | `types/` | Shared TS types, DTOs, API response shapes |
| Config | `config/` | Env vars, Prisma client singleton |
| Utils | `utils/` | Small pure helpers (e.g., ApiError class) |

### Dependency Rule
Dependencies point **inward**: Controllers → Services → Repository Interfaces → Prisma Implementations.

## Frontend Architecture

| Layer | Folder | Responsibility |
|-------|--------|----------------|
| Pages | `app/` | Next.js App Router pages (route segments) |
| Components | `components/` | Reusable UI (forms, lists, status badge) |
| Hooks | `hooks/` | Data fetching, form state wrappers |
| Services | `services/` | Axios API client, typed endpoint functions |
| Types | `types/` | Mirror backend DTOs |
| Utils | `utils/` | Formatters, status label maps, error parsers |

### Data Flow (Frontend)
```
Page → Hook/Component → Service (Axios) → Backend API
                     ← typed response ←
```

## Key Design Decisions

### 1. State Machine in Service Layer
**Decision:** `TicketStatusService` (or method on `TicketService`) owns transition validation.
**Why:** Controllers must not contain business rules. Keeps unit/integration tests focused on one layer.
**Alternative considered:** DB-level CHECK constraint — rejected because error messages would be opaque.

### 2. Dedicated Status Endpoint
**Decision:** `PATCH /tickets/:id/status` separate from `PUT /tickets/:id`.
**Why:** Status changes have distinct rules (state machine). Prevents accidental status updates via general PUT.
**Tradeoff:** Two endpoints to maintain vs. clearer API contract.

### 3. Repository Pattern over Direct Prisma in Services
**Decision:** Services depend on repository interfaces; repositories wrap Prisma.
**Why:** Services become testable with mocks; Prisma is swappable.
**Tradeoff:** More boilerplate for a small app — justified by assignment requirements (DI, testability).

### 4. Zod Validation at API Boundary
**Decision:** Validators run in middleware before controller logic.
**Why:** Controllers receive already-typed, validated data. Same schemas can inform frontend forms.
**Alternative:** Validate inside services — rejected; HTTP-layer concerns belong at the boundary.

### 5. Centralized Error Handler
**Decision:** Single Express error middleware maps `AppError` subclasses to HTTP status + response envelope.
**Why:** No try/catch duplication in every controller.

### 6. Authentication (M8+)
**Decision:** Cookie-based JWT access tokens + hashed refresh tokens in DB.
**Why:** httpOnly cookies reduce XSS token theft; refresh rotation enables revocation.
**M8:** Auth endpoints and middleware implemented. Ticket routes still open (M10).
**See:** [`auth-design.md`](./auth-design.md)

### 7. No Route Protection Yet (M8 → M10)
**Decision:** Ticket endpoints remain public until M10; `createdBy` still in request body.
**Why:** Incremental delivery — auth infrastructure first, then wire existing flows.

## Cross-Cutting Concerns

| Concern | Approach |
|---------|----------|
| Logging | `morgan` or lightweight custom logger in dev |
| CORS | `cors` middleware, frontend origin whitelisted, `credentials: true` |
| Auth | JWT in httpOnly cookies; `cookie-parser`; bcrypt + refresh token store |
| Env config | `dotenv` + Zod-validated env schema in `config/` (incl. `JWT_SECRET`) |
| DB migrations | Prisma Migrate |
| API docs | Markdown in `docs/api.md` (deliverable) |

## Scalability Notes (Future)
- Add pagination at repository layer (`cursor` or `offset`)
- Add Redis cache for ticket list if read-heavy
- Extract status machine to a standalone module if rules grow
- Event bus for notifications on status change
