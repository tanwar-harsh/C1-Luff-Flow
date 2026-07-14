# Requirements

## Project Name
Support Ticket Management System

## Business Context
A small internal application for managing customer or internal support tickets. Users can create, update, assign, comment on, search, and filter tickets. Tickets move through a **strict status state machine** — invalid transitions must be rejected by the backend and surfaced to the user on the frontend.

## Functional Requirements

### FR-1: User Management
| ID | Requirement |
|----|-------------|
| FR-1.1 | List all users via `GET /users` |
| FR-1.2 | Users have: `id`, `name`, `email`, `role` |
| FR-1.3 | Users are referenced as `createdBy` and `assignedTo` on tickets |

### FR-2: Ticket CRUD
| ID | Requirement |
|----|-------------|
| FR-2.1 | Create a ticket via `POST /tickets` |
| FR-2.2 | List all tickets via `GET /tickets` |
| FR-2.3 | View ticket details via `GET /tickets/:id` |
| FR-2.4 | Update ticket fields via `PUT /tickets/:id` |
| FR-2.5 | Tickets have: `id`, `title`, `description`, `priority`, `status`, `assignedTo`, `createdBy`, `createdAt`, `updatedAt` |

### FR-3: Ticket Assignment
| ID | Requirement |
|----|-------------|
| FR-3.1 | Assign a ticket to a user via ticket update (`assignedTo`) |
| FR-3.2 | `assignedTo` may be nullable (unassigned tickets) |

### FR-4: Status State Machine
| ID | Requirement |
|----|-------------|
| FR-4.1 | Change status via `PATCH /tickets/:id/status` |
| FR-4.2 | State machine logic lives in the **service layer only** |
| FR-4.3 | Valid transitions: Open→In Progress, In Progress→Resolved, Resolved→Closed, Open→Cancelled, In Progress→Cancelled |
| FR-4.4 | All other transitions are rejected with a clear, user-facing error message |

### FR-5: Comments
| ID | Requirement |
|----|-------------|
| FR-5.1 | Add a comment via `POST /tickets/:id/comments` |
| FR-5.2 | Comments have: `id`, `ticketId`, `message`, `createdBy`, `createdAt` |
| FR-5.3 | Comments are visible on the ticket details view |

### FR-6: Search & Filter
| ID | Requirement |
|----|-------------|
| FR-6.1 | Search tickets via `GET /tickets/search` |
| FR-6.2 | Keyword search: `?q=payment` (matches title and/or description) |
| FR-6.3 | Status filter: `?status=OPEN` |
| FR-6.4 | Filters may be combined |

### FR-7: Validation
| ID | Requirement |
|----|-------------|
| FR-7.1 | Validate at minimum: `title`, `description`, `priority`, `createdBy` |
| FR-7.2 | Use Zod on both backend and frontend |
| FR-7.3 | Return field-specific, meaningful error messages |

### FR-8: Frontend Pages
| ID | Requirement |
|----|-------------|
| FR-8.1 | Ticket List |
| FR-8.2 | Create Ticket |
| FR-8.3 | Ticket Details (with comments) |
| FR-8.4 | Search & Filter |

### FR-9: Authentication (M8+)
| ID | Requirement |
|----|-------------|
| FR-9.1 | Register via `POST /auth/register` (role defaults to `USER`) |
| FR-9.2 | Login via `POST /auth/login` |
| FR-9.3 | Refresh session via `POST /auth/refresh` |
| FR-9.4 | Logout via `POST /auth/logout` (revoke refresh token) |
| FR-9.5 | Access token: short-lived JWT in httpOnly cookie (15 min) |
| FR-9.6 | Refresh token: 7-day httpOnly cookie, hashed and revocable in DB |
| FR-9.7 | `authenticate` middleware validates access token |
| FR-9.8 | `authorize(...roles)` middleware enforces RBAC |
| FR-9.9 | Passwords hashed with bcrypt |
| FR-9.10 | Frontend login/register UI and session management (M9 — planned) |
| FR-9.11 | Protect ticket routes; `createdBy` from session (M10 — planned) |

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | Clean Architecture with clear layer separation |
| NFR-2 | TypeScript throughout |
| NFR-3 | PostgreSQL persistence via Prisma |
| NFR-4 | Centralized error handling with consistent API response shape |
| NFR-5 | Integration tests with Vitest + Supertest |
| NFR-6 | Prisma transactions where multi-step writes require atomicity |
| NFR-7 | Simple, functional UI — no over-investment in styling |
| NFR-8 | README and supporting documentation |

## Out of Scope (v1 core — M1–M5)
- ~~Authentication / authorization~~ → **M8 backend done; M9–M10 frontend + route protection planned**
- Real-time updates (WebSockets)
- File attachments on tickets or comments
- Pagination (M12 — planned)
- Email notifications
- Audit log / history trail (M15 — planned)

## Acceptance Criteria Summary
1. All API endpoints work and return consistent response shapes.
2. State machine rejects all 3 mandatory failure cases and passes all 5 mandatory success cases.
3. Frontend surfaces backend validation and state-machine errors to the user.
4. Integration tests pass.
5. Documentation is complete per deliverables list.
