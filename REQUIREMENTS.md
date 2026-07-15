# Requirements — As Implemented

Acceptance criteria derived from the **current codebase**: `backend/prisma/schema.prisma`, API routes, validators, services, and RBAC middleware. Items marked **🔶 INFERRED** are not explicit in code comments or specs — please confirm or correct.

> **Related:** Original planning docs at [`planning/requirements.md`](./planning/requirements.md) · API reference at [`docs/api.md`](./docs/api.md)

---

## 1. Data model (Prisma)

| Entity | Fields / rules | Acceptance criteria |
|--------|----------------|---------------------|
| **User** | `id`, `name`, `email` (unique), `passwordHash`, `role` (`ADMIN` \| `AGENT` \| `USER`, default `USER`), timestamps | User records persist with hashed passwords; email uniqueness enforced at DB level |
| **RefreshToken** | `tokenHash` (unique), `userId`, `expiresAt`, optional `revokedAt` | Refresh tokens stored hashed; revoked on logout and on rotation |
| **Ticket** | `title` (max 200), `description`, `priority`, `status` (default `OPEN`), optional `assignedToId`, required `createdById`, timestamps | New tickets start `OPEN`; assignee nullable |
| **Comment** | `ticketId`, `message`, `createdById`, `createdAt` | Comments belong to one ticket; no `updatedAt` |

**Referential integrity (as in schema):**

| Relation | On delete |
|----------|-----------|
| Ticket → `createdBy` (User) | `Restrict` — cannot delete user who created tickets |
| Ticket → `assignedTo` (User) | `SetNull` — assignee removal nulls assignment |
| Comment → Ticket | `Cascade` |
| Comment → `createdBy` (User) | `Restrict` |
| RefreshToken → User | `Cascade` |

**Not implemented:** ticket delete, comment edit/delete, soft delete, audit/history tables.

---

## 2. Authentication & session

| ID | Endpoint | Access | Acceptance criteria |
|----|----------|--------|---------------------|
| AC-AUTH-1 | `POST /api/auth/register` | Public | Creates user with role `USER`; returns user summary + sets httpOnly cookies |
| AC-AUTH-2 | `POST /api/auth/login` | Public | Valid credentials → cookies; invalid → `401` with generic message |
| AC-AUTH-3 | `POST /api/auth/refresh` | Cookie | Rotates refresh token (old revoked); issues new access + refresh cookies |
| AC-AUTH-4 | `POST /api/auth/logout` | Cookie | Revokes refresh token; clears auth cookies |
| AC-AUTH-5 | `GET /api/auth/me` | Authenticated | Returns current user from access token |

| Rule | Implementation |
|------|----------------|
| Password storage | bcrypt hash |
| Access token | JWT in httpOnly cookie (default **15 min** — config via `JWT_ACCESS_EXPIRES_IN`) |
| Refresh token | Random token, SHA-256 hash in DB, httpOnly cookie (default **7 days** — `JWT_REFRESH_EXPIRES_DAYS`) |
| Unauthenticated API access | `401` via `authenticate` middleware |

---

## 3. Role-based access control (RBAC)

| Action | USER | AGENT | ADMIN |
|--------|:----:|:-----:|:-----:|
| View tickets (list, detail, search) | ✅ | ✅ | ✅ |
| Create / update / assign ticket | ❌ | ✅ | ✅ |
| Change ticket status | ❌ | ✅ | ✅ |
| Add comment | ❌ | ✅ | ✅ |
| `GET /api/users` (paginated admin list) | ❌ | ❌ | ✅ |
| `POST/PATCH/DELETE /api/users/:id` | ❌ | ❌ | ✅ |
| `PATCH /api/users/me` | ✅ (own profile) | ✅ | ✅ |
| `GET /api/users/assignees` | ❌ | ✅ | ✅ |

**Session identity:** `createdBy` for tickets and comments is taken from **`req.user.id`**, not the request body.

**Frontend (implemented):** Permission-gated UI elements are **hidden** (not disabled) when the user lacks access.

---

## 4. Ticket API

Base path: `/api/tickets`. All routes require **`authenticate`** unless noted.

| ID | Method | Path | Roles | Acceptance criteria |
|----|--------|------|-------|---------------------|
| AC-TKT-1 | `GET` | `/` | All authenticated | Returns all tickets, newest first (**no pagination** — see M11 planned) |
| AC-TKT-2 | `POST` | `/` | AGENT, ADMIN | Creates ticket; `status` = `OPEN`; `createdById` = session user |
| AC-TKT-3 | `GET` | `/:id` | All authenticated | Returns ticket with `assignedTo`, `createdBy`, comments (ascending) |
| AC-TKT-4 | `PUT` | `/:id` | AGENT, ADMIN | Updates `title`, `description`, `priority`, `assignedTo` only — **not** `status` |
| AC-TKT-5 | `PATCH` | `/:id/status` | AGENT, ADMIN | Body: `{ "status": "<enum>" }`; state machine enforced in service layer |
| AC-TKT-6 | `POST` | `/:id/comments` | AGENT, ADMIN | Body: `{ "message" }`; `createdById` = session user |
| AC-TKT-7 | `GET` | `/search` | All authenticated | Query: optional `?q=`, `?status=`; combinable |

**Route ordering:** `GET /search` is registered **before** `GET /:id` to avoid path collision.

### Create ticket validation (`POST /`)

| Field | Required | Rules |
|-------|----------|-------|
| `title` | Yes | 3–200 characters |
| `description` | Yes | Min 10 characters |
| `priority` | Yes | `LOW` \| `MEDIUM` \| `HIGH` \| `CRITICAL` |
| `assignedTo` | No | User id if present; omitted or `null` = unassigned |
| `createdBy` | **Not accepted** | Set server-side from session |

### Update ticket validation (`PUT /:id`)

| Rule | Detail |
|------|--------|
| At least one field | `title`, `description`, `priority`, or `assignedTo` must be present |
| `assignedTo: null` | Unassigns ticket |
| Assignee exists | Validated via `ensureUserExists` when `assignedTo` is truthy |

### Search (`GET /search`)

| Parameter | Behavior |
|-----------|----------|
| `q` | Case-insensitive `contains` on **title** and **description** (Prisma `mode: 'insensitive'`) |
| `status` | Exact enum match |
| Both omitted | **🔶 INFERRED:** Returns all tickets (empty `where` clause) — confirm if this should 400 instead |

---

## 5. Status state machine

Enforced in `ticketStatusMachine.ts` (service layer only). Invalid transitions → **HTTP 409** `INVALID_STATUS_TRANSITION`.

| From | Allowed transitions |
|------|---------------------|
| `OPEN` | → `IN_PROGRESS`, `CANCELLED` |
| `IN_PROGRESS` | → `RESOLVED`, `CANCELLED` |
| `RESOLVED` | → `CLOSED` |
| `CLOSED` | *(none — terminal)* |
| `CANCELLED` | *(none — terminal)* |

| Case | Result |
|------|--------|
| Valid transition (5 spec cases) | `200`, status updated |
| Invalid jump (e.g. `OPEN` → `RESOLVED`) | `409` |
| Same status (no-op, e.g. `OPEN` → `OPEN`) | `409` |
| `PUT /tickets/:id` with status in body | **Ignored** — status not in `updateTicketSchema` |

**Mandatory test coverage:** 8 state-machine cases (5 pass, 3 fail) covered in unit + integration tests.

---

## 6. User management API

Base path: `/api/users`.

| ID | Method | Path | Roles | Acceptance criteria |
|----|--------|------|-------|---------------------|
| AC-USR-1 | `GET` | `/` | ADMIN | Paginated: `?page=` (default 1), `?limit=` (default 10, max 100) |
| AC-USR-2 | `POST` | `/` | ADMIN | Create user with `name`, `email`, `password`, `role` |
| AC-USR-3 | `GET` | `/:id` | ADMIN | Single user by id |
| AC-USR-4 | `PATCH` | `/:id` | ADMIN | Partial update; at least one field required |
| AC-USR-5 | `DELETE` | `/:id` | ADMIN | Fails with `400` if user has related tickets or comments |
| AC-USR-6 | `PATCH` | `/me` | Authenticated | Update own `name` / `email` only |
| AC-USR-7 | `GET` | `/assignees` | AGENT, ADMIN | User list for assignment dropdowns |

**Not implemented:** Public `GET /users` listing all users without pagination (replaced by admin paginated list + `/assignees`).

---

## 7. Health & API envelope

| ID | Requirement |
|----|-------------|
| AC-API-1 | `GET /api/health` returns `{ success: true, data: { status, timestamp } }` |
| AC-API-2 | Success: `{ success: true, data: T }` |
| AC-API-3 | Error: `{ success: false, error: { message, code, details? } }` |
| AC-API-4 | Validation errors → `400` `VALIDATION_ERROR` with field `details[]` |
| AC-API-5 | Not found → `404` `NOT_FOUND` |
| AC-API-6 | Forbidden role → `403` `FORBIDDEN` |
| AC-API-7 | Unauthenticated → `401` `UNAUTHORIZED` |

---

## 8. Frontend (as shipped)

| Route | Access | Acceptance criteria |
|-------|--------|---------------------|
| `/` | Public / Auth | Landing when logged out; ticket list when logged in |
| `/login`, `/signup` | Public | Stitch-aligned auth; register → `USER` role |
| `/tickets/new` | AGENT, ADMIN | Create ticket form |
| `/tickets/[id]` | Authenticated | Detail, comments; mutate UI only for AGENT/ADMIN |
| `/search` | Authenticated | Keyword + status filter |
| `/admin/users` | ADMIN | User CRUD table |

---

## 9. Testing & deployment

| ID | Requirement |
|----|-------------|
| AC-TEST-1 | Backend: Vitest + Supertest; **58 tests** passing (unit + integration) |
| AC-TEST-2 | Integration tests use **`.env.test` only** (no production DB fallback) |
| AC-TEST-3 | `npm run db:seed` — full reset seed; `npm run db:seed:demo` — upsert demo accounts only |
| AC-DEPLOY-1 | Two Vercel projects (API + web); Neon PostgreSQL; CORS configured for frontend origin |

---

## 10. Explicitly out of scope (not implemented)

- Ticket or comment **delete**
- Comment **edit**
- Ticket list / search **pagination** (planned M11)
- **Optimistic locking** / version fields for concurrent edits
- File attachments, email notifications, WebSockets, audit log
- Rate limiting, API keys (cookie JWT only)

---

## Confirmation checklist

Please confirm or correct these **🔶 INFERRED** items:

1. `GET /tickets/search` with no query params returns **all** tickets.
2. Same-status transition (e.g. `OPEN` → `OPEN`) is intentionally **rejected** with 409.
3. Concurrent `PUT` / `PATCH` on the same ticket uses **last-write-wins** (no locking).
4. `USER` role can view **all** tickets, not only tickets they created or are assigned to.
