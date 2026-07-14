# Prompt 11 — User CRUD & Role Management

## Prompt
> Lets start with the new milestone. Lets add User CRUD & Role Management. GET /users (paginated), GET /users/:id, POST /users, PATCH /users/:id, DELETE /users/:id behind authorize('ADMIN'). PATCH /users/me behind authenticate only. Frontend: admin-only user management page, table with role badges, edit/delete actions, forms with React Hook Form + Zod matching existing patterns.

## Milestone
**M9 — User CRUD & Role Management** ✅

## Delivered
- Backend: paginated user list, full admin CRUD, PATCH /me, GET /assignees
- Frontend: `/login`, `/admin/users`, AuthProvider, RoleBadge, UserTable, forms
- 54 backend tests passing

## Follow-up (M9b)
- Stitch login/signup UI, `/signup` route, public landing page — see [12-auth-ui.md](./12-auth-ui.md), [13-landing-page.md](./13-landing-page.md)
