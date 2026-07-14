# Prompt 14 — Route Protection & RBAC

## Prompt
> New user (default/regular user): Can view tickets only. No access to create tickets. Admin: Full access. Agent: Can create and view tickets. Conditionally render UI elements based on role — not rendered at all, not just disabled.

## Milestone
**M10 — Route Protection & RBAC** ✅

## Delivered
- Backend: `authenticate` on all ticket routes; `authorize('AGENT','ADMIN')` on mutations
- `createdBy` from session; removed from request bodies and forms
- Frontend: `permissions.ts`, `RequireAuth`, conditional UI across header, list, detail, create
- 58 backend tests passing
- **Spec:** [`planning/rbac-design.md`](../planning/rbac-design.md)
