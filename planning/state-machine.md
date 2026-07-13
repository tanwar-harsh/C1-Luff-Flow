# State Machine

## Overview
Ticket status follows a **strict finite state machine**. Transition rules are enforced exclusively in the **service layer** (`TicketService` or dedicated `TicketStatusService`). Controllers delegate; repositories persist.

## States

| State | Description | Terminal? |
|-------|-------------|-----------|
| `OPEN` | Newly created, not yet worked | No |
| `IN_PROGRESS` | Actively being worked | No |
| `RESOLVED` | Fix delivered, awaiting closure | No |
| `CLOSED` | Fully completed | **Yes** |
| `CANCELLED` | Discarded / won't fix | **Yes** |

## Valid Transitions

| From | To | Allowed |
|------|----|---------|
| `OPEN` | `IN_PROGRESS` | ✅ |
| `IN_PROGRESS` | `RESOLVED` | ✅ |
| `RESOLVED` | `CLOSED` | ✅ |
| `OPEN` | `CANCELLED` | ✅ |
| `IN_PROGRESS` | `CANCELLED` | ✅ |

## Invalid Transitions (Explicit Test Cases)

| From | To | Expected |
|------|----|----------|
| `OPEN` | `RESOLVED` | ❌ FAIL |
| `RESOLVED` | `OPEN` | ❌ FAIL |
| `CLOSED` | `OPEN` | ❌ FAIL |

## Additional Implicit Invalid Transitions
| From | To | Reason |
|------|----|--------|
| `RESOLVED` | `CANCELLED` | Not in allowed list |
| `CLOSED` | *any* | Terminal state |
| `CANCELLED` | *any* | Terminal state |
| `OPEN` | `CLOSED` | Must go through IN_PROGRESS → RESOLVED |
| `IN_PROGRESS` | `CLOSED` | Must go through RESOLVED |
| *any* | same state | No-op transitions rejected (optional — recommend reject to make intent explicit) |

## State Diagram

```
                    ┌─────────────┐
                    │    OPEN     │
                    └──────┬──────┘
              ┌────────────┼────────────┐
              │            │            │
              ▼            │            ▼
     ┌────────────────┐    │    ┌──────────────┐
     │  IN_PROGRESS   │    │    │  CANCELLED   │ (terminal)
     └───────┬────────┘    │    └──────────────┘
             │             │
      ┌──────┴──────┐      │
      │             │      │
      ▼             ▼      ▼
┌──────────┐  ┌──────────────┐
│ RESOLVED │  │  CANCELLED   │ (terminal)
└────┬─────┘  └──────────────┘
     │
     ▼
┌──────────┐
│  CLOSED  │ (terminal)
└──────────┘
```

## Implementation Design

### Transition Map (Service Layer)
```typescript
const VALID_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  OPEN:         ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS:  ['RESOLVED', 'CANCELLED'],
  RESOLVED:     ['CLOSED'],
  CLOSED:       [],
  CANCELLED:    [],
};
```

### Algorithm
1. Load ticket by ID (404 if missing).
2. Read `currentStatus` from DB.
3. If `currentStatus === requestedStatus` → reject (no-op).
4. If `requestedStatus` not in `VALID_TRANSITIONS[currentStatus]` → throw `InvalidStatusTransitionError` (409).
5. Update status in DB (optionally within a transaction if side effects are added later).
6. Return updated ticket.

### Error Message Format
```
Invalid status transition from {CURRENT} to {REQUESTED}
```
Frontend displays this message directly to the user.

## Where This Does NOT Live
| Layer | Why not |
|-------|---------|
| Controller | Business rule — violates SRP |
| Repository | Persistence only — no domain knowledge |
| Prisma schema | DB cannot express friendly error messages |
| Frontend only | Backend must be the source of truth |

## Frontend Responsibility
- Display current status.
- Offer only valid next-status options in UI (UX convenience).
- **Always** handle 409 from backend — UI guard is not sufficient alone.

## Test Cases (Mandatory)

| # | Transition | Expected |
|---|------------|----------|
| 1 | Open → In Progress | PASS |
| 2 | In Progress → Resolved | PASS |
| 3 | Resolved → Closed | PASS |
| 4 | Open → Cancelled | PASS |
| 5 | In Progress → Cancelled | PASS |
| 6 | Open → Resolved | FAIL (409) |
| 7 | Resolved → Open | FAIL (409) |
| 8 | Closed → Open | FAIL (409) |
