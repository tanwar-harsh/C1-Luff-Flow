# Authentication Design (M8)

## Overview

Cookie-based JWT authentication with revocable refresh tokens. Auth logic follows Clean Architecture: `AuthService` orchestrates `UserRepository` and `RefreshTokenRepository`; HTTP concerns in controllers and middleware.

## Data Model

### User (extended)

| Column | Type | Notes |
|--------|------|-------|
| passwordHash | TEXT | bcrypt, 12 rounds |
| role | Role | `ADMIN`, `AGENT`, `USER` — default `USER` on register |

### RefreshToken

| Column | Type | Notes |
|--------|------|-------|
| id | CUID | PK |
| tokenHash | TEXT | SHA-256 of raw refresh token (unique) |
| userId | FK → User | CASCADE on delete |
| expiresAt | TIMESTAMP | 7 days from issue |
| revokedAt | TIMESTAMP | NULL = active; set on logout/rotation |
| createdAt | TIMESTAMP | |

**Migration:** `20260714061742_add_auth`

## Token Strategy

| Token | Storage | Lifetime | Format |
|-------|---------|----------|--------|
| Access | `access_token` httpOnly cookie | 15 min | JWT (`sub`, `email`, `role`) |
| Refresh | `refresh_token` httpOnly cookie | 7 days | Random 32-byte hex; hash stored in DB |

### Cookie options

- `httpOnly: true`
- `secure: true` in production
- `sameSite: 'none'` in production (cross-origin Vercel), `'lax'` in dev
- `path: '/'`

### Refresh rotation

On `POST /auth/refresh`: validate stored hash → revoke old token → issue new access + refresh pair.

## API Endpoints

Base: `/api/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | No | Create user (role `USER`), set cookies |
| POST | `/login` | No | Validate credentials, set cookies |
| POST | `/refresh` | Refresh cookie | Rotate tokens |
| POST | `/logout` | Refresh cookie | Revoke refresh token, clear cookies |
| GET | `/me` | Access cookie | Current user profile |

### Register body

```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "securepass1" }
```

### Login body

```json
{ "email": "jane@example.com", "password": "securepass1" }
```

### Success response (register/login)

```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "...", "email": "...", "role": "USER" }
  }
}
```

Tokens are **not** returned in JSON — only via Set-Cookie headers.

## Error Codes

| Code | HTTP | When |
|------|------|------|
| `UNAUTHORIZED` | 401 | Invalid credentials, missing/expired token |
| `FORBIDDEN` | 403 | Authenticated but wrong role |
| `VALIDATION_ERROR` | 400 | Duplicate email, weak password |

## Middleware

### `authenticate`

- Reads `access_token` cookie
- Verifies JWT signature and expiry
- Sets `req.user = { id, email, role }`

### `authorize(...roles)`

- Requires `authenticate` first
- Returns 403 if `req.user.role` not in allowed roles

```typescript
router.get('/admin', authenticate, authorize('ADMIN'), handler);
router.get('/staff', authenticate, authorize('ADMIN', 'AGENT'), handler);
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `JWT_SECRET` | Yes | — | Min 32 characters |
| `JWT_ACCESS_EXPIRES_IN` | No | `15m` | Access token TTL |
| `JWT_REFRESH_EXPIRES_DAYS` | No | `7` | Refresh token TTL |

## Seed Credentials

All seed users share password: **`Password123!`**

| Email | Role |
|-------|------|
| admin@example.com | ADMIN |
| agent@example.com | AGENT |
| user@example.com | USER |

## Security Notes

- Passwords never returned in API responses
- Refresh tokens stored hashed (SHA-256), not plaintext
- Logout revokes refresh token server-side
- CORS already uses `credentials: true` for cookie support

## Out of Scope (M8)

- Frontend login/register UI (M9)
- Protecting existing ticket routes (M10)
- Password reset / email verification
- OAuth / SSO

## Tests

`src/tests/auth.integration.test.ts` — 8 tests  
`src/tests/authorize.integration.test.ts` — 2 tests  
**Total backend tests: 44**
