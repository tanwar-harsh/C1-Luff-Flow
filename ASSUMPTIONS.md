# Assumptions — As Implemented

Edge cases and judgment calls implied by the current schema, routes, and services. Each entry is tagged:

- **✅ Verified** — directly observable in code
- **🔶 Inferred** — reasonable reading of behavior; **please confirm or correct**

> **Related:** [`REQUIREMENTS.md`](./REQUIREMENTS.md) · [`planning/assumptions.md`](./planning/assumptions.md) (original M1 assumptions)

---

## 1. State machine & ticket lifecycle

| # | Assumption | Tag | Rationale / implementation |
|---|------------|-----|---------------------------|
| A-SM-1 | New tickets always start as `OPEN` | ✅ Verified | `Ticket.status @default(OPEN)` in Prisma; create path does not accept status |
| A-SM-2 | `CLOSED` and `CANCELLED` are terminal — no further transitions | ✅ Verified | `VALID_TRANSITIONS` maps both to `[]` |
| A-SM-3 | Transitioning to the **same** status is invalid | ✅ Verified | `validateStatusTransition` throws if `current === requested` |
| A-SM-4 | Status cannot be changed via `PUT /tickets/:id` | ✅ Verified | `updateTicketSchema` excludes `status`; only `PATCH /:id/status` |
| A-SM-5 | Invalid transitions return **409**, not 400 | ✅ Verified | `InvalidStatusTransitionError` → `INVALID_STATUS_TRANSITION` |
| A-SM-6 | Frontend only **offers** valid next statuses; backend is source of truth | ✅ Verified | `getNextStatuses()` mirrors `VALID_TRANSITIONS`; API still enforces |
| A-SM-7 | Comments can be added in **any** ticket status, including `CLOSED` | 🔶 Inferred | `CommentService` checks ticket exists only — no status guard |
| A-SM-8 | Tickets in `CLOSED` / `CANCELLED` can still be **edited** (title, assignee) | 🔶 Inferred | `updateTicket` does not check status — only AGENT/ADMIN role |

---

## 2. Invalid transitions & error shape

| # | Assumption | Tag | Detail |
|---|------------|-----|--------|
| A-ERR-1 | Error message format: `Invalid status transition from X to Y` | ✅ Verified | `ticketStatusMachine.ts` |
| A-ERR-2 | Missing required body fields → `400` with per-field `details` | ✅ Verified | Zod via `validate()` middleware |
| A-ERR-3 | Empty `PUT` body (no fields) → `400` "At least one field must be provided" | ✅ Verified | `updateTicketSchema.refine()` |
| A-ERR-4 | Unknown ticket id → `404` "Ticket not found" | ✅ Verified | Service layer before update |
| A-ERR-5 | Invalid `assignedTo` / `createdBy` user id → `400` field error, not `404` | ✅ Verified | `ensureUserExists` → `ValidationError` |

---

## 3. Concurrent updates & consistency

| # | Assumption | Tag | Detail |
|---|------------|-----|--------|
| A-CON-1 | **No optimistic locking** — no `version` column on `Ticket` | ✅ Verified | Schema has no version field |
| A-CON-2 | Concurrent updates are **last-write-wins** | 🔶 Inferred | Two `PUT`s or a `PUT` + `PATCH /status` race: later Prisma `update` wins |
| A-CON-3 | Status transition does not use a DB transaction with row lock | 🔶 Inferred | `findById` then `updateStatus` — TOCTOU possible between read and write |
| A-CON-4 | **🔶 Inferred:** Acceptable for this assignment scale; production might add `updatedAt` check or `SELECT FOR UPDATE` | | Please confirm |

**Example race (🔶 Inferred):** Agent A reads ticket `OPEN`, Agent B moves to `IN_PROGRESS`, Agent A submits `OPEN` → `CANCELLED` based on stale read → second write may succeed if A's transition is still valid from stale `OPEN` state, or fail if B's write already committed and A's client had old state.

---

## 4. Missing fields & validation boundaries

| # | Assumption | Tag | Detail |
|---|------------|-----|--------|
| A-VAL-1 | `createdBy` in ticket/comment body is **rejected/ignored** — server uses session | ✅ Verified | Not in Zod schemas; controller sets `req.user.id` |
| A-VAL-2 | `POST /tickets` without `priority` → `400` | ✅ Verified | `priority` required in `createTicketSchema` |
| A-VAL-3 | `assignedTo: ""` (empty string) fails validation | ✅ Verified | `z.string().min(1)` when provided |
| A-VAL-4 | `assignedTo` omitted vs `null` — both mean unassigned on create | ✅ Verified | Service: `assignedToId: input.assignedTo ?? null` |
| A-VAL-5 | Comment `message` whitespace-only (`"   "`) passes Zod (`min(1)`) | 🔶 Inferred | No `.trim()` on schema — only length check |
| A-VAL-6 | Search `?status=INVALID` → `400` validation error | ✅ Verified | `ticketStatusSchema` on query |
| A-VAL-7 | Search `?q=` empty string | 🔶 Inferred | Empty string is truthy enough to add `OR` filter — may return no matches vs all tickets; confirm desired behavior |

---

## 5. Search & listing

| # | Assumption | Tag | Detail |
|---|------------|-----|--------|
| A-SRCH-1 | Keyword search is **case-insensitive** | ✅ Verified | Prisma `mode: 'insensitive'` |
| A-SRCH-2 | Search matches **title OR description** (not comments, not assignee name) | ✅ Verified | `TicketRepository.search` |
| A-SRCH-3 | `GET /tickets` returns **entire** table, sorted `createdAt desc` | ✅ Verified | No `take`/`skip` |
| A-SRCH-4 | No auth filter — any authenticated user sees **all** tickets | 🔶 Inferred | No `where` on `listTickets` / search by role or ownership |
| A-SRCH-5 | Pagination deferred to M11 | ✅ Verified | `planning/milestones.md` |

---

## 6. Users, roles & deletion

| # | Assumption | Tag | Detail |
|---|------------|-----|--------|
| A-USR-1 | Self-registration always creates `USER` role | ✅ Verified | `AuthService.register` hardcodes `role: 'USER'` |
| A-USR-2 | Only ADMIN can promote users to `AGENT` / `ADMIN` | ✅ Verified | Admin user CRUD routes |
| A-USR-3 | Cannot delete user with tickets or comments | ✅ Verified | `countRelatedRecords` check |
| A-USR-4 | Deleting assignee user **nulls** `assignedToId` on tickets | ✅ Verified | `onDelete: SetNull` |
| A-USR-5 | Cannot delete user who **created** tickets | ✅ Verified | `onDelete: Restrict` on `createdBy` |
| A-USR-6 | Login failure message is generic ("Invalid email or password") | ✅ Verified | No user enumeration |
| A-USR-7 | **🔶 Inferred:** `USER` role cannot hit mutation endpoints even via direct API call | ✅ Verified | `authorize` middleware returns 403 |

---

## 7. Auth & security

| # | Assumption | Tag | Detail |
|---|------------|-----|--------|
| A-SEC-1 | Tokens in **httpOnly** cookies, not `Authorization` header | ✅ Verified | Auth controller cookie helpers |
| A-SEC-2 | Refresh token rotation revokes previous token on refresh | ✅ Verified | `AuthService.refresh` |
| A-SEC-3 | Password min length **8** on register/admin create | ✅ Verified | Zod schemas |
| A-SEC-4 | No password complexity rules (uppercase, symbol, etc.) | 🔶 Inferred | Only `.min(8)` |
| A-SEC-5 | CORS limited to configured origin(s) | ✅ Verified | `CORS_ORIGIN` env |
| A-SEC-6 | Stack traces hidden in production 500 responses | ✅ Verified | `errorHandler` checks `NODE_ENV` |

---

## 8. Comments & tickets — deletion

| # | Assumption | Tag | Detail |
|---|------------|-----|--------|
| A-DEL-1 | Tickets are never deleted via API | ✅ Verified | No `DELETE /tickets` route |
| A-DEL-2 | Comments are never edited or deleted via API | ✅ Verified | Only `POST` comment route |
| A-DEL-3 | **🔶 Inferred:** If ticket delete were added, comments cascade (`onDelete: Cascade`) | ✅ Verified | Schema only — no API |

---

## 9. Testing & data

| # | Assumption | Tag | Detail |
|---|------------|-----|--------|
| A-TST-1 | Integration tests **wipe** DB tables they touch | ✅ Verified | `resetDatabase()` in test helpers |
| A-TST-2 | Test DB must be separate from dev/prod Neon | ✅ Verified | `setup.ts` loads `.env.test` only |
| A-TST-3 | `db:seed:demo` is safe on production (upsert users only) | ✅ Verified | `seedDemoUsers.ts` |
| A-TST-4 | `db:seed` full reset is **destructive** | ✅ Verified | Deletes all users, tickets, comments |

---

## 10. Items needing your confirmation

Priority questions — reply to correct any **🔶 Inferred** row:

| # | Question | Default in docs |
|---|----------|-----------------|
| 1 | Should `USER` see **all** tickets or only their own / assigned? | All tickets (current code) |
| 2 | Should comments be blocked on `CLOSED` / `CANCELLED` tickets? | Allowed (current code) |
| 3 | Should ticket field edits be blocked on terminal statuses? | Allowed (current code) |
| 4 | Is `GET /search` with no params returning **all** tickets intentional? | Yes (current code) |
| 5 | Is last-write-wins without locking acceptable for v1? | Assumed yes |
| 6 | Should comment/message strings be `.trim()`'d before validation? | Not implemented |

---

## Change log

| Date | Change |
|------|--------|
| 2026-07-15 | Initial draft from Prisma schema + routes (post M10 RBAC) |
