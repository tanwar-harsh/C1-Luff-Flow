# Prompt 22 — API Contract

## Prompt
> Generate a minimal OpenAPI spec (or a markdown API contract table if that's faster) covering all Express routes: method, path, request body shape, response shape, and error codes. Cross-check against actual route files so nothing's invented.

## Delivered
- [`docs/api-contract.md`](../docs/api-contract.md) — 20 endpoints, shared types, error codes
- Route inventory cross-checked against `backend/src/routes/*.ts`
- `docs/api.md` updated with pointer to authoritative contract

## Corrections vs legacy `api.md`
- `createdBy` not in ticket/comment bodies (session-derived)
- `GET /users` is admin paginated, not public list
- Auth + RBAC + 401/403 documented
