# Prompt 01 — Requirements

## Prompt
> Support Ticket Management System — full project specification including tech stack (Next.js 16, Express, Prisma, PostgreSQL), Clean Architecture folder structure, database schema, status state machine rules, API endpoints, validation rules, testing requirements, UI guidelines, and deliverables (README, tool-workflow.md, prompts/, planning/, testing/, review/, reflection/).

## Reason
Establish a shared understanding of scope before writing any code. In a real team, this maps to a product brief + technical spec review. We need explicit requirements, constraints, and acceptance criteria to avoid scope creep and rework.

## AI Response Summary
- Confirmed workspace is empty — greenfield project.
- Proposed **Milestone 1: Requirements Analysis & Project Foundation** rather than generating all code at once.
- Produced planning documents: `requirements.md`, `assumptions.md`, `architecture.md`, `database-design.md`, `api-design.md`, `state-machine.md`, `user-stories.md`.
- Identified out-of-scope items for v1 (auth, pagination, attachments).
- Documented key assumptions (no auth, default OPEN status, enum values).
- Mapped user stories to API endpoints and implementation priority.

## Lessons Learned
- **Resist the urge to code first.** The spec is detailed enough that jumping to implementation would skip valuable design decisions (e.g., separate status endpoint, repository pattern tradeoffs).
- **Assumptions must be explicit.** The spec doesn't mention auth, priority values, or default status — documenting these now prevents mid-project surprises.
- **State machine is the highest-risk business rule.** It deserves its own design doc and dedicated test plan before implementation.
- **Milestone gating works.** A senior engineer would not approve a PR with code but no requirements traceability.
