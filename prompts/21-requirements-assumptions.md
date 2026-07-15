# Prompt 21 — Requirements & Assumptions (As Implemented)

## Prompt
> Read through my Prisma schema and API routes, then draft a REQUIREMENTS.md listing the core acceptance criteria as implemented, plus an ASSUMPTIONS.md covering edge cases (invalid state transitions, concurrent updates, missing fields). Flag anything you're inferring so I can confirm or correct it.

## Delivered
- [`REQUIREMENTS.md`](../REQUIREMENTS.md) — acceptance criteria from schema + routes + RBAC
- [`ASSUMPTIONS.md`](../ASSUMPTIONS.md) — edge cases tagged ✅ Verified vs 🔶 Inferred
- Confirmation checklist for USER sees all tickets, comments on closed tickets, etc.

## Lessons Learned
- Separate “as implemented” docs from M1 `planning/requirements.md` to avoid drift
