# User Stories

## Epic: Ticket Management

### US-1: Create a Ticket
**As a** support user,
**I want to** create a ticket with a title, description, priority, and creator,
**So that** issues are tracked in the system.

**Acceptance Criteria:**
- Form validates title (required, 3–200 chars), description (required, min 10 chars), priority (enum), createdBy (required).
- On success, ticket is created with status `OPEN`.
- On validation failure, field-specific errors are shown.

---

### US-2: List Tickets
**As a** support agent,
**I want to** see all tickets in a list,
**So that** I can prioritize my work.

**Acceptance Criteria:**
- List shows title, status, priority, assignee, created date.
- Tickets sorted by newest first.
- Clicking a ticket navigates to details.

---

### US-3: View Ticket Details
**As a** support agent,
**I want to** view full ticket details and comments,
**So that** I have full context before acting.

**Acceptance Criteria:**
- Shows all ticket fields, creator, assignee.
- Shows comment thread chronologically.
- Shows current status prominently.

---

### US-4: Update a Ticket
**As a** support agent,
**I want to** update a ticket's title, description, priority, or assignee,
**So that** ticket information stays accurate.

**Acceptance Criteria:**
- `PUT /tickets/:id` updates allowed fields.
- Status is NOT changed via this endpoint.
- Assignee dropdown populated from `GET /users`.

---

### US-5: Assign a Ticket
**As a** support lead,
**I want to** assign a ticket to an agent,
**So that** ownership is clear.

**Acceptance Criteria:**
- Assignment via update form (`assignedTo` field).
- Can clear assignment (set to unassigned).
- Assigned agent name shown on list and detail views.

---

### US-6: Change Ticket Status
**As a** support agent,
**I want to** move a ticket through its lifecycle,
**So that** progress is tracked correctly.

**Acceptance Criteria:**
- Only valid transitions succeed.
- Invalid transitions show backend error message (e.g., "Invalid status transition from OPEN to RESOLVED").
- UI offers valid next statuses where possible.

---

### US-7: Add a Comment
**As a** support agent,
**I want to** add comments to a ticket,
**So that** my notes and customer interactions are recorded.

**Acceptance Criteria:**
- Comment requires non-empty message and createdBy.
- New comment appears immediately on detail page after submit.

---

### US-8: Search Tickets
**As a** support agent,
**I want to** search tickets by keyword,
**So that** I can find related issues quickly.

**Acceptance Criteria:**
- Search `?q=payment` matches tickets where title or description contains "payment".
- Results displayed in same format as ticket list.

---

### US-9: Filter Tickets by Status
**As a** support agent,
**I want to** filter tickets by status,
**So that** I can focus on open or in-progress work.

**Acceptance Criteria:**
- Filter `?status=OPEN` returns only open tickets.
- Can combine with keyword search.

---

## Epic: Authentication (M8–M10)

### US-10: Register an Account (M8 backend ✅, M9 frontend 📋)
**As a** new user,
**I want to** create an account with email and password,
**So that** I can access the ticket system securely.

**Acceptance Criteria:**
- `POST /auth/register` creates user with role `USER`
- Password stored as bcrypt hash
- Auth cookies set on success
- Frontend register form (M9)

---

### US-11: Login and Logout (M8 backend ✅, M9 frontend 📋)
**As a** registered user,
**I want to** log in and out,
**So that** my session is managed securely.

**Acceptance Criteria:**
- Login validates credentials, sets cookies
- Logout revokes refresh token and clears cookies
- Session refresh via `POST /auth/refresh`
- Frontend login/logout UI (M9)

---

### US-12: Role-Based Access (M8 middleware ✅, M10 routes 📋)
**As an** admin,
**I want** actions restricted by role,
**So that** users cannot perform unauthorized operations.

**Acceptance Criteria:**
- `authorize('ADMIN')` blocks non-admins with 403
- Ticket routes require authentication (M10)
- `createdBy` derived from session, not request body (M10)

---

## Story → API Mapping

| Story | Endpoint(s) |
|-------|-------------|
| US-1 | `POST /tickets` |
| US-2 | `GET /tickets` |
| US-3 | `GET /tickets/:id` |
| US-4, US-5 | `PUT /tickets/:id`, `GET /users` |
| US-6 | `PATCH /tickets/:id/status` |
| US-7 | `POST /tickets/:id/comments` |
| US-8, US-9 | `GET /tickets/search` |
| US-10 | `POST /auth/register` |
| US-11 | `POST /auth/login`, `/logout`, `/refresh`, `GET /auth/me` |
| US-12 | `authenticate`, `authorize(...roles)` on protected routes |

## Priority for Implementation Order
1. US-1, US-2, US-3 (core CRUD) ✅
2. US-6 (state machine) ✅
3. US-4, US-5 (update + assign) ✅
4. US-7 (comments) ✅
5. US-8, US-9 (search/filter) ✅
6. US-10, US-11 (auth backend) ✅ — frontend in M9
7. US-12 (route protection) 📋 M10
