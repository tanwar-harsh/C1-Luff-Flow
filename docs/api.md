# API Documentation

> **Authoritative contract:** See [`api-contract.md`](./api-contract.md) — cross-checked against route files (method, path, body, response, error codes). This file is kept for narrative examples; some sections below are outdated (e.g. `createdBy` in ticket body, `GET /users` without auth).

Base URL: `http://localhost:3001/api`

All responses use the envelope: `{ success: boolean, data?: T, error?: { message, code, details? } }`

---

## Health

### `GET /api/health`

Check server status.

**Response 200:**
```json
{
  "success": true,
  "data": { "status": "ok", "timestamp": "2026-07-13T09:00:00.000Z" }
}
```

---

## Users

### `GET /api/users`

List all users (for assignment dropdowns).

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "id": "...", "name": "Jane Agent", "email": "jane@example.com", "role": "AGENT" }
  ]
}
```

---

## Tickets

### `POST /api/tickets`

Create a ticket. Status defaults to `OPEN`.

**Body:**
```json
{
  "title": "Payment failed",
  "description": "Customer charged twice for order #1234",
  "priority": "HIGH",
  "createdBy": "<user-id>",
  "assignedTo": "<user-id>"
}
```

| Field | Required | Validation |
|-------|----------|------------|
| title | Yes | 3–200 characters |
| description | Yes | Min 10 characters |
| priority | Yes | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |
| createdBy | Yes | Must reference existing user |
| assignedTo | No | Must reference existing user if provided |

**Response 201:** Ticket object in `data`.

**Response 400:** `{ error: { code: "VALIDATION_ERROR", details: [{ field, message }] } }`

---

### `GET /api/tickets`

List all tickets, newest first.

**Response 200:** Array of tickets in `data`.

---

### `GET /api/tickets/:id`

Ticket details with comments and user relations.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "...",
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

**Response 404:** `{ error: { code: "NOT_FOUND", message: "Ticket not found" } }`

---

### `PUT /api/tickets/:id`

Update ticket fields. Does **not** change status.

**Body (partial):**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "MEDIUM",
  "assignedTo": "<user-id>"
}
```

Set `assignedTo` to `null` to unassign.

**Response 200:** Updated ticket in `data`.

---

### `PATCH /api/tickets/:id/status`

Change ticket status. State machine enforced in service layer.

**Body:**
```json
{ "status": "IN_PROGRESS" }
```

**Valid transitions:**

| From | To |
|------|----|
| OPEN | IN_PROGRESS, CANCELLED |
| IN_PROGRESS | RESOLVED, CANCELLED |
| RESOLVED | CLOSED |

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

### `POST /api/tickets/:id/comments`

Add a comment to a ticket.

**Body:**
```json
{
  "message": "Contacted customer, awaiting response",
  "createdBy": "<user-id>"
}
```

**Response 201:** Comment object in `data`.

**Response 404:** Ticket not found.

---

### `GET /api/tickets/search`

Search and filter tickets.

**Query parameters:**

| Param | Example | Description |
|-------|---------|-------------|
| q | `payment` | Keyword search (title + description, case-insensitive) |
| status | `OPEN` | Filter by status |

**Examples:**
- `/api/tickets/search?q=payment`
- `/api/tickets/search?status=OPEN`
- `/api/tickets/search?q=payment&status=OPEN`

**Response 200:** Array of matching tickets in `data`.

---

## HTTP Status Codes

| Code | When |
|------|------|
| 200 | Successful GET, PUT, PATCH |
| 201 | Successful POST |
| 400 | Validation error |
| 404 | Resource not found |
| 409 | Invalid status transition |
| 500 | Unexpected server error |

## Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 400 | Zod / input validation failed |
| `NOT_FOUND` | 404 | Ticket, user, or parent not found |
| `INVALID_STATUS_TRANSITION` | 409 | State machine rejection |
| `INTERNAL_ERROR` | 500 | Unhandled exception |
