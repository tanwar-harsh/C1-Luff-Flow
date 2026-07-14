# Route Protection & RBAC (M10)

## Permission Matrix

| Action | USER | AGENT | ADMIN |
|--------|------|-------|-------|
| View tickets (list, detail, search) | ✅ | ✅ | ✅ |
| Create ticket | ❌ | ✅ | ✅ |
| Update ticket / assign | ❌ | ✅ | ✅ |
| Change status | ❌ | ✅ | ✅ |
| Add comment | ❌ | ✅ | ✅ |
| User management (`/admin/users`) | ❌ | ❌ | ✅ |

**UI rule:** Permission-gated elements are **not rendered** (not disabled) when the user lacks access.

## Backend

### Ticket routes (`/api/tickets`)

| Method | Path | Middleware | Roles |
|--------|------|------------|-------|
| GET | `/`, `/search`, `/:id` | `authenticate` | USER, AGENT, ADMIN |
| POST | `/` | `authenticate` + `authorize('AGENT','ADMIN')` | AGENT, ADMIN |
| PUT | `/:id` | `authenticate` + `authorize('AGENT','ADMIN')` | AGENT, ADMIN |
| PATCH | `/:id/status` | `authenticate` + `authorize('AGENT','ADMIN')` | AGENT, ADMIN |
| POST | `/:id/comments` | `authenticate` + `authorize('AGENT','ADMIN')` | AGENT, ADMIN |

### Session identity

- `createdBy` removed from request bodies for tickets and comments
- Controllers set `createdBy` from `req.user.id`

## Frontend

### Utilities

`frontend/utils/permissions.ts`:
- `canViewTickets`, `canCreateTicket`, `canMutateTicket`, `canManageUsers`

Exposed on `AuthContext` as boolean flags.

### Route guards

`RequireAuth` component wraps `/`, `/search`, `/tickets/[id]`, `/tickets/new` (with `canCreateTicket`).

### Conditional UI

| Component | Hidden for USER |
|-----------|-----------------|
| Header — Create tab | ✅ |
| `TicketListView` — Create Ticket button | ✅ |
| `TicketDetailView` — StatusActions, CommentForm, assignee editor | ✅ |
| `TicketDetailView` — Status badge, assignee name | Read-only (shown) |

### Header layout

Three-column grid: logo (left) · CRUD nav tabs centered · user actions + theme (right).

Nav tabs: Tickets, Create, Search, Users (admin only).

## Demo accounts

```bash
cd backend && npm run db:seed:demo
```

| Email | Role | Password |
|-------|------|----------|
| admin@example.com | ADMIN | Password123! |
| agent@example.com | AGENT | Password123! |
| user@example.com | USER | Password123! |

Safe upsert — does not wipe existing data.

## Tests

- **58/58** backend tests passing
- Auth helpers: `loginAsAgent`, `loginAsUser`, `loginAsAdmin`, `withCookies`
- Test setup uses **only** `.env.test` (no fallback to `.env`) to avoid wiping shared Neon DB

## Files

```
backend/src/routes/ticketRoutes.ts
backend/prisma/seedDemoUsers.ts
frontend/utils/permissions.ts
frontend/components/auth/RequireAuth.tsx
frontend/components/layout/Header.tsx
```
