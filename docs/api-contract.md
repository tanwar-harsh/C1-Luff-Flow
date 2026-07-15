# API Contract

Cross-checked against `backend/src/routes/*.ts`, controllers, and `validators/schemas.ts` (2026-07-15).

**Base URL:** `/api` (e.g. `http://localhost:3001/api`)

**Auth:** JWT access token in httpOnly cookie `access_token`. Refresh token in `refresh_token`. Send `credentials: include` from browsers.

**Envelope (all routes):**

```json
// Success
{ "success": true, "data": <T> }

// Error
{
  "success": false,
  "error": {
    "message": "string",
    "code": "VALIDATION_ERROR | NOT_FOUND | INVALID_STATUS_TRANSITION | UNAUTHORIZED | FORBIDDEN | INTERNAL_ERROR",
    "details": [{ "field": "string", "message": "string" }]  // optional
  }
}
```

---

## Shared types

### User

```json
{
  "id": "cuid",
  "name": "string",
  "email": "string",
  "role": "ADMIN | AGENT | USER",
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

### UserSummary

`{ "id", "name", "email", "role" }` — no timestamps.

### Ticket

```json
{
  "id": "cuid",
  "title": "string",
  "description": "string",
  "priority": "LOW | MEDIUM | HIGH | CRITICAL",
  "status": "OPEN | IN_PROGRESS | RESOLVED | CLOSED | CANCELLED",
  "assignedToId": "cuid | null",
  "createdById": "cuid",
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

### Ticket (detail)

Ticket fields plus:

```json
{
  "assignedTo": "UserSummary | null",
  "createdBy": "UserSummary",
  "comments": [
    {
      "id": "cuid",
      "ticketId": "cuid",
      "message": "string",
      "createdById": "cuid",
      "createdAt": "ISO-8601",
      "createdBy": "UserSummary"
    }
  ]
}
```

### Comment (create response)

```json
{
  "id": "cuid",
  "ticketId": "cuid",
  "message": "string",
  "createdById": "cuid",
  "createdAt": "ISO-8601"
}
```

---

## Error codes (global)

| HTTP | `error.code` | When |
|------|--------------|------|
| 400 | `VALIDATION_ERROR` | Zod / `ValidationError` (invalid body, query, params, business validation) |
| 401 | `UNAUTHORIZED` | Missing/invalid access cookie; invalid login; invalid/expired refresh token |
| 403 | `FORBIDDEN` | Authenticated but role not allowed (`authorize` middleware) |
| 404 | `NOT_FOUND` | Resource not found; unknown route (`Route not found`) |
| 409 | `INVALID_STATUS_TRANSITION` | State machine rejection |
| 500 | `INTERNAL_ERROR` | Unhandled exception |

---

## Health

| Method | Path | Auth | Request | Success `data` | Errors |
|--------|------|------|---------|----------------|--------|
| `GET` | `/health` | — | — | `{ "status": "ok", "timestamp": "ISO-8601" }` | — |

**Source:** `healthRoutes.ts` → `healthController.ts`

---

## Auth (`/auth`)

| Method | Path | Auth | Request body | Success `data` | Status | Errors |
|--------|------|------|--------------|----------------|--------|--------|
| `POST` | `/register` | — | See below | `{ "user": User }` | 201 | 400 |
| `POST` | `/login` | — | See below | `{ "user": User }` | 200 | 400, 401 |
| `POST` | `/refresh` | Cookie: `refresh_token` | — | `{ "message": "Token refreshed" }` | 200 | 401 |
| `POST` | `/logout` | Cookie: `refresh_token` (optional) | — | `{ "message": "Logged out" }` | 200 | — |
| `GET` | `/me` | `access_token` | — | `{ "user": User \| null }` | 200 | 401 |

### `POST /auth/register` body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | Yes | 2–100 chars |
| `email` | string | Yes | Valid email |
| `password` | string | Yes | 8–128 chars |

**Side effect:** Sets `access_token` + `refresh_token` cookies. User role = `USER`.

**400:** Email already registered (`details[].field` = `email`).

### `POST /auth/login` body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | string | Yes | Valid email |
| `password` | string | Yes | Min 1 char |

**Side effect:** Sets auth cookies.

**401:** `Invalid email or password`

**Source:** `authRoutes.ts` → `authController.ts` → `validators/schemas.ts` (`registerSchema`, `loginSchema`)

---

## Users (`/users`)

| Method | Path | Auth | Roles | Request | Success `data` | Status | Errors |
|--------|------|------|-------|---------|----------------|--------|--------|
| `PATCH` | `/me` | ✅ | Any | Body below | `User` | 200 | 400, 401 |
| `GET` | `/assignees` | ✅ | AGENT, ADMIN | — | `User[]` | 200 | 401, 403 |
| `GET` | `/` | ✅ | ADMIN | Query below | Paginated users | 200 | 400, 401, 403 |
| `POST` | `/` | ✅ | ADMIN | Body below | `User` | 201 | 400, 401, 403 |
| `GET` | `/:id` | ✅ | ADMIN | Param: `id` | `User` | 200 | 401, 403, 404 |
| `PATCH` | `/:id` | ✅ | ADMIN | Param + body | `User` | 200 | 400, 401, 403, 404 |
| `DELETE` | `/:id` | ✅ | ADMIN | Param: `id` | `{ "message": "User deleted" }` | 200 | 400, 401, 403, 404 |

> **Route order:** `/me` and `/assignees` are registered before `/:id` (`userRoutes.ts`).

### `PATCH /users/me` body

At least one of:

| Field | Type | Validation |
|-------|------|------------|
| `name` | string | 2–100 chars |
| `email` | string | Valid email |

### `GET /users` query

| Param | Type | Default | Validation |
|-------|------|---------|------------|
| `page` | number | `1` | Int ≥ 1 |
| `limit` | number | `10` | Int 1–100 |

**Response `data`:**

```json
{
  "items": ["User"],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

### `POST /users` body (admin create)

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | Yes | 2–100 chars |
| `email` | string | Yes | Valid email |
| `password` | string | Yes | 8–128 chars |
| `role` | string | Yes | `ADMIN` \| `AGENT` \| `USER` |

### `PATCH /users/:id` body (admin update)

At least one of: `name`, `email`, `password` (8–128), `role`.

### `DELETE /users/:id`

**400:** User has related tickets or comments (`details[].field` = `id`).

**Source:** `userRoutes.ts` → `userController.ts`

---

## Tickets (`/tickets`)

| Method | Path | Auth | Roles | Request | Success `data` | Status | Errors |
|--------|------|------|-------|---------|----------------|--------|--------|
| `GET` | `/search` | ✅ | Any | Query below | `Ticket[]` | 200 | 400, 401 |
| `GET` | `/` | ✅ | Any | — | `Ticket[]` | 200 | 401 |
| `POST` | `/` | ✅ | AGENT, ADMIN | Body below | `Ticket` | 201 | 400, 401, 403 |
| `GET` | `/:id` | ✅ | Any | Param: `id` | Ticket detail | 200 | 401, 404 |
| `PUT` | `/:id` | ✅ | AGENT, ADMIN | Param + body | `Ticket` | 200 | 400, 401, 403, 404 |
| `PATCH` | `/:id/status` | ✅ | AGENT, ADMIN | Param + body | `Ticket` | 200 | 400, 401, 403, 404, 409 |
| `POST` | `/:id/comments` | ✅ | AGENT, ADMIN | Param + body | `Comment` | 201 | 400, 401, 403, 404 |

> **Route order:** `/search` before `/:id` (`ticketRoutes.ts`).

**Note:** `createdBy` / comment author come from **session** (`req.user.id`), not request body.

### `POST /tickets` body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `title` | string | Yes | 3–200 chars |
| `description` | string | Yes | Min 10 chars |
| `priority` | string | Yes | `LOW` \| `MEDIUM` \| `HIGH` \| `CRITICAL` |
| `assignedTo` | string \| null | No | User id if set; omitted/`null` = unassigned |

**400:** Unknown `assignedTo` user (`details[].field` = `assignedTo`).

### `PUT /tickets/:id` body

At least one of:

| Field | Type | Validation |
|-------|------|------------|
| `title` | string | 3–200 chars |
| `description` | string | Min 10 chars |
| `priority` | string | Priority enum |
| `assignedTo` | string \| null | User id; `null` unassigns |

Does **not** accept `status`.

### `PATCH /tickets/:id/status` body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `status` | string | Yes | Status enum |

**Valid transitions:**

| From | To |
|------|-----|
| `OPEN` | `IN_PROGRESS`, `CANCELLED` |
| `IN_PROGRESS` | `RESOLVED`, `CANCELLED` |
| `RESOLVED` | `CLOSED` |
| `CLOSED` | — |
| `CANCELLED` | — |

**409:** Same status or disallowed transition — `Invalid status transition from X to Y`

### `POST /tickets/:id/comments` body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `message` | string | Yes | Min 1 char |

### `GET /tickets/search` query

| Param | Type | Required | Validation |
|-------|------|----------|------------|
| `q` | string | No | Case-insensitive match on title + description |
| `status` | string | No | Status enum |

Both optional; omitted params = no filter on that dimension.

**Source:** `ticketRoutes.ts` → `ticketController.ts`, `commentController.ts`

---

## Route inventory (20 endpoints)

| # | Method | Full path | File |
|---|--------|-----------|------|
| 1 | GET | `/api/health` | `healthRoutes.ts` |
| 2 | POST | `/api/auth/register` | `authRoutes.ts` |
| 3 | POST | `/api/auth/login` | `authRoutes.ts` |
| 4 | POST | `/api/auth/refresh` | `authRoutes.ts` |
| 5 | POST | `/api/auth/logout` | `authRoutes.ts` |
| 6 | GET | `/api/auth/me` | `authRoutes.ts` |
| 7 | PATCH | `/api/users/me` | `userRoutes.ts` |
| 8 | GET | `/api/users/assignees` | `userRoutes.ts` |
| 9 | GET | `/api/users` | `userRoutes.ts` |
| 10 | POST | `/api/users` | `userRoutes.ts` |
| 11 | GET | `/api/users/:id` | `userRoutes.ts` |
| 12 | PATCH | `/api/users/:id` | `userRoutes.ts` |
| 13 | DELETE | `/api/users/:id` | `userRoutes.ts` |
| 14 | GET | `/api/tickets/search` | `ticketRoutes.ts` |
| 15 | GET | `/api/tickets` | `ticketRoutes.ts` |
| 16 | POST | `/api/tickets` | `ticketRoutes.ts` |
| 17 | GET | `/api/tickets/:id` | `ticketRoutes.ts` |
| 18 | PUT | `/api/tickets/:id` | `ticketRoutes.ts` |
| 19 | PATCH | `/api/tickets/:id/status` | `ticketRoutes.ts` |
| 20 | POST | `/api/tickets/:id/comments` | `ticketRoutes.ts` |

---

## Not exposed (no route)

- `DELETE /tickets/:id`
- `PUT/PATCH/DELETE` comments
- Public unauthenticated ticket/user listing

---

## Related docs

- [`REQUIREMENTS.md`](../REQUIREMENTS.md) — acceptance criteria
- [`ASSUMPTIONS.md`](../ASSUMPTIONS.md) — edge-case assumptions
- [`api.md`](./api.md) — legacy narrative API doc (partially outdated; prefer this contract)
