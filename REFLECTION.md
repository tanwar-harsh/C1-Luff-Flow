# Reflection — Support Ticket Management System

A concise reflection on design trade-offs, a real debugging session, and what I would do differently on a second pass.

---

## 1. Design trade-offs

### Why Prisma over raw SQL?

**Type safety across the TypeScript backend** — Prisma generates types directly from the schema, so a change to the `Ticket` model surfaces as a compile error anywhere it's used, rather than a runtime failure.

The trade-off is less control over query shape and some overhead on complex joins, where raw SQL or a thinner query builder like Knex would be faster to write and more transparent about the generated query plan. For a project this size, with a small number of well-defined relations (users, tickets, comments), the safety net was worth more than the flexibility.

### Why enforce the state machine on the backend, not just the frontend?

**Frontend validation can be bypassed** via direct API calls or a buggy client. Enforcing transitions server-side in `ticketStatusMachine.ts` makes invalid jumps (e.g. `CLOSED` → `IN_PROGRESS`) impossible regardless of client behavior. Invalid transitions return **HTTP 409** with a clear message; the frontend mirrors valid next states for UX only.

The trade-off is more upfront design work (transition table, validation logic, dedicated `PATCH /tickets/:id/status` endpoint) versus a plain status enum with no transition rules.

### What was the trickiest schema decision?

**Whether comments belonged in a separate table vs. embedded JSON on the ticket** — I chose a separate `comments` table for queryability, referential integrity (`createdBy` → `users`), and independent indexing by `ticketId`. Embedded JSON would have simplified reads but made search, FK constraints, and future comment features harder.

Other schema choices that followed from that:

| Decision | Choice | Why |
|----------|--------|-----|
| `assignedTo` on tickets | Nullable FK with `onDelete: SetNull` | Tickets can exist unassigned; deleting an assignee does not delete the ticket |
| `createdBy` on tickets/comments | Required FK with `onDelete: Restrict` | Prevents orphaning authorship; blocks user delete if they have created content |
| Auth (M8) | `passwordHash` + `refresh_tokens` table | Hashed refresh tokens support revocation and rotation |

---

## 2. Debugging story — Stitch MCP auth (Milestone 3)

### What was the bug?

Stitch MCP auth kept failing during Milestone 3 design extraction. The AI could not list projects or fetch Luff-Flow screens, which blocked `DESIGN.md` and the path to the frontend milestone.

### Root cause

**Two stacked issues that looked like one bug:**

1. **Misconfigured gcloud CLI credentials** — application-default credentials were not set up for the Stitch MCP proxy (`STITCH_USE_SYSTEM_GCLOUD=1`).
2. **A bad API key reference in MCP config** — the CLI fallback also failed when MCP was not connected in Cursor.

Either alone would block access; together they made it seem like a single opaque authentication failure.

### How I found the root cause

**Tested each layer in isolation** — gcloud auth first, then MCP server config — instead of assuming a single failure point. Verified with a minimal prompt (“List my Stitch projects”) after connecting `user-stitch` in Cursor.

### The fix

1. Reconfigured gcloud: `gcloud auth application-default login` (and enable Stitch API on the GCP project).
2. Corrected the MCP server config in Cursor Settings separately (Stitch proxy with system gcloud, not a broken standalone API key reference).
3. Restarted Cursor and confirmed MCP could list projects and fetch Luff-Flow screens.

**Result:** `DESIGN.md` extracted from real Stitch design-system metadata; Milestone 3 unblocked.

*See also:* [`docs/ai-workflow/iteration-cycles.md`](./docs/ai-workflow/iteration-cycles.md) · [`docs/ai-workflow/prompt-log.md`](./docs/ai-workflow/prompt-log.md) (P-003–P-006)

### Secondary debugging note — production login

A separate production issue (`Invalid email or password` on Vercel) had a different root cause: integration tests had wiped shared Neon data. Fixed with isolated `.env.test` and `npm run db:seed:demo`. Documented in [`ASSUMPTIONS.md`](./ASSUMPTIONS.md).

---

## 3. What I would do differently

### Planning

**Write assumptions and edge cases down before coding**, not after a review flagged that they were missing. The project now has [`ASSUMPTIONS.md`](./ASSUMPTIONS.md) and [`REQUIREMENTS.md`](./REQUIREMENTS.md) as implemented — those should have existed alongside M1 planning, especially for concurrent updates, terminal-status edits, and who can see which tickets.

### Testing

**Add unit tests for the service layer alongside integration tests**, not rely on integration coverage alone. Integration tests prove the HTTP stack end-to-end but are slower, need a database, and initially encouraged a risky `.env` fallback. Service-layer unit tests with mocked repositories (e.g. `TicketService.test.ts`) catch business logic bugs faster and without DB isolation concerns.

### AI workflow

**Keep a running prompt log during development** instead of reconstructing it afterward. The full chronology in [`docs/ai-workflow/prompt-log.md`](./docs/ai-workflow/prompt-log.md) and [`prompts/prompt-history.md`](./prompts/prompt-history.md) was rebuilt from chat history — logging prompts at the end of each session would have been cheaper and more accurate.

**Other habits that would have helped:**

- Connect Stitch MCP and gcloud **before** the design milestone.
- Specify doc deliverable scope up front (e.g. “three README images only”).
- Provision an isolated test database branch on day one.

---

## Related documentation

| Document | Purpose |
|----------|---------|
| [`ASSUMPTIONS.md`](./ASSUMPTIONS.md) | Edge-case assumptions (verified vs inferred) |
| [`REQUIREMENTS.md`](./REQUIREMENTS.md) | Acceptance criteria as implemented |
| [`docs/ai-workflow/iteration-cycles.md`](./docs/ai-workflow/iteration-cycles.md) | Where AI output was corrected |
| [`docs/ai-workflow/prompt-log.md`](./docs/ai-workflow/prompt-log.md) | Full prompt chronology |
| [`prompts/18-reflection-draft.md`](./prompts/18-reflection-draft.md) | Prompt that started this reflection |
| [`reflection/reflection.md`](./reflection/reflection.md) | Earlier AI-assisted workflow reflection (M5) |
