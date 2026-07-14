# API Design

## Base URL
`http://localhost:3001/api`

## Response Envelope

### Success
```json
{
  "success": true,
  "data": { }
}
```

### Error
```json
{
  "success": false,
  "error": {
    "message": "Human-readable summary",
    "code": "VALIDATION_ERROR",
    "details": [
      { "field": "title", "message": "Title is required" }
    ]
  }
}
```

## Endpoints

### Auth (M8)

See [`auth-design.md`](./auth-design.md) for full specification.

#### `POST /auth/register`
Create account. Role defaults to `USER`. Sets `access_token` and `refresh_token` httpOnly cookies.

**Body:** `{ "name", "email", "password" }`  
**Response 201:** `{ user }` in `data` (no tokens in JSON body).

#### `POST /auth/login`
Authenticate. Sets cookies.

**Body:** `{ "email", "password" }`  
**Response 200:** `{ user }` in `data`.

#### `POST /auth/refresh`
Rotate refresh token. Requires `refresh_token` cookie.  
**Response 200:** New cookies issued.

#### `POST /auth/logout`
Revoke refresh token and clear cookies.  
**Response 200:** `{ message: "Logged out" }`.

#### `GET /auth/me`
Current user. Requires `access_token` cookie (`authenticate` middleware).  
**Response 200:** `{ user }` in `data`.

---

### Users

#### `GET /users`
List all users (for assignment dropdowns).

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "id": "clx...", "name": "Jane Agent", "email": "jane@example.com", "role": "AGENT" }
  ]
}
```

---

### Tickets

#### `POST /tickets`
Create a new ticket. Status defaults to `OPEN`.

**Body:**
```json
{
  "title": "Payment failed",
  "description": "Customer charged twice for order #1234",
  "priority": "HIGH",
  "createdBy": "clx_user_id",
  "assignedTo": "clx_agent_id"
}
```

| Field | Required | Notes |
|-------|----------|-------|
| title | Yes | Min 3, max 200 chars |
| description | Yes | Min 10 chars |
| priority | Yes | Enum |
| createdBy | Yes | Must reference existing user |
| assignedTo | No | Must reference existing user if provided |

**Response 201:** Ticket object in `data`.

**Response 400:** Validation errors in `error.details`.

---

#### `GET /tickets`
List all tickets (newest first).

**Response 200:** Array of ticket summaries in `data`.

---

#### `GET /tickets/:id`
Ticket details including comments and related user info.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "title": "...",
    "description": "...",
    "priority": "HIGH",
    "status": "OPEN",
    "assignedTo": { "id": "...", "name": "..." },
    "createdBy": { "id": "...", "name": "..." },
    "comments": [
      { "id": "...", "message": "...", "createdBy": { "id": "...", "name": "..." }, "createdAt": "..." }
    ],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Response 404:** Ticket not found.

---

#### `PUT /tickets/:id`
Update ticket fields (title, description, priority, assignedTo). **Does not change status.**

**Body:** Partial update — any subset of updatable fields.

**Response 200:** Updated ticket in `data`.

---

#### `PATCH /tickets/:id/status`
Change ticket status. State machine enforced in service layer.

**Body:**
```json
{ "status": "IN_PROGRESS" }
```

**Response 200:** Updated ticket in `data`.

**Response 409:**
```json
{
  "success": false,
  "error": {
    "message": "Invalid status transition from OPEN to RESOLVED",
    "code": "INVALID_STATUS_TRANSITION"
  }
}
```

---

#### `POST /tickets/:id/comments`
Add a comment to a ticket.

**Body:**
```json
{
  "message": "Contacted customer, awaiting response",
  "createdBy": "clx_user_id"
}
```

**Response 201:** Comment object in `data`.

---

#### `GET /tickets/search`
Search and filter tickets.

**Query params:**

| Param | Example | Description |
|-------|---------|-------------|
| q | `payment` | Keyword search in title + description |
| status | `OPEN` | Filter by status enum |

**Examples:**
- `/tickets/search?q=payment`
- `/tickets/search?status=OPEN`
- `/tickets/search?q=payment&status=OPEN`

**Response 200:** Array of matching tickets in `data`.

---

## HTTP Status Code Map

| Code | When |
|------|------|
| 200 | Successful GET, PUT, PATCH |
| 201 | Successful POST (create) |
| 400 | Validation failure (Zod) |
| 404 | Resource not found |
| 409 | Invalid status transition |
| 401 | Missing or invalid auth token |
| 403 | Authenticated but insufficient role |
| 500 | Unexpected server error |

## Error Codes (Application-Level)

| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 400 | Zod / input validation |
| `NOT_FOUND` | 404 | Ticket, user, or comment parent not found |
| `INVALID_STATUS_TRANSITION` | 409 | State machine rejection |
| `UNAUTHORIZED` | 401 | Invalid credentials or expired token |
| `FORBIDDEN` | 403 | Role not permitted |
| `INTERNAL_ERROR` | 500 | Unhandled exception |
