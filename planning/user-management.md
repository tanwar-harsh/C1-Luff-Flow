# User Management Design (M9)

## Overview

Admin-only user CRUD with paginated listing, role management, and self-service profile updates. Includes frontend auth (login, signup, session context) and admin UI.

> **Auth screens & landing page:** See [`auth-ui.md`](./auth-ui.md) (M9b).

## API Endpoints

Base: `/api/users`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | `authenticate` + `authorize('ADMIN')` | Paginated user list |
| GET | `/:id` | `authenticate` + `authorize('ADMIN')` | User by ID |
| POST | `/` | `authenticate` + `authorize('ADMIN')` | Create user (any role) |
| PATCH | `/:id` | `authenticate` + `authorize('ADMIN')` | Update user (name, email, role, password) |
| DELETE | `/:id` | `authenticate` + `authorize('ADMIN')` | Delete user (blocked if tickets/comments exist) |
| PATCH | `/me` | `authenticate` | Update own name/email (no role change) |
| GET | `/assignees` | `authenticate` + `authorize('ADMIN', 'AGENT')` | Full list for ticket assignment dropdowns |

### Pagination query

`GET /users?page=1&limit=10` (max limit: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [{ "id", "name", "email", "role", "createdAt", "updatedAt" }],
    "pagination": { "page": 1, "limit": 10, "total": 25, "totalPages": 3 }
  }
}
```

### Admin create body

```json
{ "name": "...", "email": "...", "password": "...", "role": "AGENT" }
```

### Admin update body

Partial: `name`, `email`, `role`, `password` (optional — omit to keep current)

### Update me body

Partial: `name`, `email` only

## Frontend

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Sign in (Stitch design) |
| `/signup` | Public | Self-registration (Stitch design) |
| `/` | Public / Auth | Landing when logged out; ticket list when logged in |
| `/admin/users` | ADMIN | User table, create/edit forms, pagination |

### Components

- `RoleBadge` — role chip with dot indicator (matches status badge pattern)
- `UserTable` — name, email, role, edit/delete actions
- `CreateUserForm` / `EditUserForm` — RHF + Zod
- `UserManagement` — page orchestration
- `AuthProvider` + `useAuth` — session from `GET /auth/me`

### Axios

`withCredentials: true` on all API calls for cookie auth.

## Delete Rules

User cannot be deleted if they have:
- Created tickets
- Assigned tickets
- Comments

Returns `400 VALIDATION_ERROR` with field message.

## Tests

`src/tests/users.integration.test.ts` — 10 tests  
**Total backend tests: 54**

## Seed Login (admin)

- Email: `admin@example.com`
- Password: `Password123!`
