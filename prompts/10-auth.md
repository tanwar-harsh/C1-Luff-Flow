# Prompt 10 — Backend Authentication

## Prompt
> Also add authentication. Add a role enum (ADMIN, AGENT, USER) to the User model, plus passwordHash and a RefreshToken model. Migrate. Build POST /auth/register, /auth/login, /auth/refresh, /auth/logout. Hash passwords with bcrypt. Access token as a short-lived (15 min) httpOnly cookie, refresh token (7 days) stored hashed and revocable. Add authenticate and authorize(...roles) middleware.

## Reason
Secure the API; enable session-based identity and role-based access for upcoming route protection.

## AI Response Summary
- Prisma: `passwordHash`, `RefreshToken` model, migration `20260714061742_add_auth`
- `AuthService` with register, login, refresh (rotation), logout (revoke)
- bcrypt passwords, JWT access cookie, SHA-256 hashed refresh tokens
- `authenticate` + `authorize(...roles)` middleware
- `cookie-parser` in app; `JWT_SECRET` env validation
- 10 new tests (44 total passing)
- Spec: `planning/auth-design.md`

## Milestone
**M8 — Backend Authentication** ✅

## Next
- ~~M9: Frontend login/register UI~~ → M9b done
- M10: Protect ticket routes; `createdBy` from session
