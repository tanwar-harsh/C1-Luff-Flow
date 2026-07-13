# Database Design

## ERD

```
┌──────────────┐       ┌──────────────────────────────┐       ┌──────────────┐
│    User      │       │           Ticket             │       │   Comment    │
├──────────────┤       ├──────────────────────────────┤       ├──────────────┤
│ id (PK)      │──┐    │ id (PK)                      │──┐    │ id (PK)      │
│ name         │  │    │ title                        │  │    │ ticketId(FK) │
│ email (UQ)   │  ├───>│ description                  │  └───>│ message      │
│ role         │  │    │ priority (enum)              │       │ createdBy(FK)│
│ createdAt    │  │    │ status (enum)                │       │ createdAt    │
│ updatedAt    │  │    │ assignedTo (FK, nullable)────┘       └──────────────┘
└──────────────┘  │    │ createdBy (FK)───────────────┘
                  │    │ createdAt                    │
                  └───>│ updatedAt                    │
                       └──────────────────────────────┘
```

## Tables

### User
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID / CUID | PK | Prisma `@default(cuid())` |
| name | VARCHAR | NOT NULL | Display name |
| email | VARCHAR | NOT NULL, UNIQUE | |
| role | ENUM | NOT NULL | `ADMIN`, `AGENT`, `USER` |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT now() | |
| updatedAt | TIMESTAMP | NOT NULL | Auto-updated |

### Ticket
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | CUID | PK | |
| title | VARCHAR(200) | NOT NULL | Validated in Zod |
| description | TEXT | NOT NULL | |
| priority | ENUM | NOT NULL | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |
| status | ENUM | NOT NULL, DEFAULT `OPEN` | See state machine |
| assignedToId | CUID | FK → User, NULLABLE | Nullable = unassigned |
| createdById | CUID | FK → User, NOT NULL | |
| createdAt | TIMESTAMP | NOT NULL | |
| updatedAt | TIMESTAMP | NOT NULL | |

### Comment
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | CUID | PK | |
| ticketId | CUID | FK → Ticket, NOT NULL, ON DELETE CASCADE | |
| message | TEXT | NOT NULL | |
| createdById | CUID | FK → User, NOT NULL | |
| createdAt | TIMESTAMP | NOT NULL | |

## Enums

```prisma
enum Role {
  ADMIN
  AGENT
  USER
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum TicketStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  CLOSED
  CANCELLED
}
```

## Indexes

| Table | Index | Purpose |
|-------|-------|---------|
| Ticket | `status` | Filter by status (`?status=OPEN`) |
| Ticket | `title`, `description` (GIN/trigram or ILIKE) | Keyword search — start with simple `ILIKE` for v1 |
| Ticket | `assignedToId` | List tickets by assignee (future) |
| Ticket | `createdById` | List tickets by creator (future) |
| Comment | `ticketId` | Fetch comments for a ticket |
| User | `email` | Unique lookup |

## Referential Integrity
- `Ticket.createdById` → `User.id` (RESTRICT on delete — cannot delete user who created tickets)
- `Ticket.assignedToId` → `User.id` (SET NULL on delete — assignment cleared if user removed)
- `Comment.ticketId` → `Ticket.id` (CASCADE — comments removed with ticket)
- `Comment.createdById` → `User.id` (RESTRICT)

## Seed Data (Planned)
- 3 users: 1 admin, 1 agent, 1 regular user
- 5 tickets across different statuses and priorities
- 2–3 comments on select tickets

## Migration Strategy
1. `prisma migrate dev --name init` — initial schema
2. Seed via `prisma db seed`
3. Test DB: separate `DATABASE_URL` in `.env.test`
