# Tool Workflow

## Primary AI Tool

**Cursor** (Agent mode) with **Stitch MCP** (`user-stitch`) for design extraction.

## Project Context

Support Ticket Management System — a full-stack app for managing support tickets with a strict status state machine. Built as a milestone-driven assignment demonstrating professional engineering workflow: analysis → design → implementation → testing → review.

**Tech stack:** Next.js, Express, Prisma, PostgreSQL (Neon), TypeScript, TailwindCSS, Zod, Vitest, Supertest.

---

## Workflow Phases

### 1. Requirement Analysis (Milestone 1)
- Parsed full project specification into formal requirements
- Documented assumptions where spec was silent (no auth, default OPEN status, priority enums)
- Created planning docs: requirements, architecture, database, API, state machine, user stories
- **AI role:** Structured ambiguous spec into actionable design documents
- **Human role:** Confirmed assumptions and architecture decisions before coding

### 2. Planning & Design (Milestone 1)
- Chose Clean Architecture with repository pattern
- Designed state machine as pure service-layer module
- Mapped user stories to API endpoints and implementation order
- **Output:** `/planning/` folder (7 documents)

### 3. Backend Scaffolding (Milestone 2)
- Bootstrapped Express + Prisma + TypeScript
- Implemented repository interfaces, error handling, health check
- **AI role:** Generated boilerplate following architecture doc
- **Human role:** Approved milestone before business logic

### 4. Design Extraction (Pre-Milestone 3)
- Connected Stitch MCP, listed Luff-Flow project
- Extracted design tokens into `DESIGN.md` as single source of truth
- **AI role:** Pulled colors, typography, spacing, component specs from Stitch design system
- **Human role:** Confirmed design tokens before frontend work

### 5. Backend API & State Machine (Milestone 3)
- Implemented all 8 endpoints, services, Zod validators
- State machine with 8 mandatory test cases
- Integration tests with Vitest + Supertest
- **AI role:** Generated services, controllers, routes, tests per design docs
- **Human role:** Milestone gate approval

### 6. Frontend (Milestone 4)
- Next.js app styled per `DESIGN.md`
- React Hook Form + Zod, Axios API client
- Error surfacing for validation and 409 state machine errors
- **AI role:** Built components and pages referencing DESIGN.md tokens
- **Human role:** Verified UI in browser, approved milestone

### 7. Testing & Documentation (Milestone 5)
- Ran full 34-test suite against Neon PostgreSQL (all pass)
- Completed README, API docs, review, reflection
- **AI role:** Final documentation and test execution
- **Human role:** Connected NeonDB, verified end-to-end in browser

### 8. Vercel Deployment (Milestone 6)
- Backend serverless + frontend on two Vercel projects
- `docs/deployment-vercel.md`, CORS production config

### 9. Dark / Light Theme (Milestone 7)
- CSS variables, ThemeProvider, header toggle

### 10. Backend Authentication (Milestone 8)
- bcrypt, JWT cookies, RefreshToken model, auth middleware
- `planning/auth-design.md`, 44 tests total

### Status Tracking (`pulse/` folder)
- `pulse/current.md` — live health snapshot (update each milestone)
- `pulse/milestone-log.md` — completed work chronicle
- `pulse/upcoming.md` — M9+ planned milestones
- `planning/milestones.md` — master roadmap index

---

## Code Generation Approach

- **Milestone gating:** AI never skipped ahead — each milestone waited for explicit confirmation
- **Design-first:** Planning docs and DESIGN.md written before implementation
- **Incremental verification:** Health check → repositories → API → frontend → full tests
- **No dump:** Full project never generated in one shot; ~5 milestones over the conversation

---

## Validation & Testing

| Layer | How validated |
|-------|-------------|
| State machine | 10 unit tests + 8 integration tests |
| API validation | Zod middleware + integration tests for 400 responses |
| Frontend forms | React Hook Form + Zod client-side; API error mapping |
| Build | `tsc` (backend), `next build` (frontend) |
| E2E | Manual browser verification + API curl tests |

---

## Debugging

| Issue | Resolution |
|-------|------------|
| Backend still on localhost after Neon URL added | Restart dev server after `.env` change |
| Integration tests skipped | Updated test setup to fall back to `.env` Neon URL |
| Stitch MCP not connected | User connected `user-stitch` MCP in Cursor settings |
| Prisma migrate on empty Neon | `prisma migrate deploy` applied init migration |

---

## Code Review Process

1. **AI self-review** at each milestone (checklist in milestone output)
2. **Architecture traceability** — requirements → stories → endpoints → tests
3. **Review docs** — `review/ai-review.md`, `review/self-review.md`
4. **Future improvements** documented without implementing (scope control)

---

## Security Considerations

- No secrets in repository (`.env` gitignored)
- Backend auth (M8): bcrypt, httpOnly JWT cookies, hashed refresh tokens
- Ticket routes not yet protected (M10 planned)
- Zod validation at API boundary
- Centralized error handler (no stack traces in production)
- Neon connection uses `sslmode=require`

## Information Deliberately Not Shared with AI

- Production database credentials (user added Neon URL locally)
- Real customer data (seed uses fictional examples)
- Deployment infrastructure details

---

## Comparison to Real-World Workflow

| This project | Real team |
|--------------|-----------|
| Milestone gates via chat | Sprint reviews, PR approvals |
| AI generates code from design docs | Developers implement from tickets |
| Stitch MCP for design tokens | Figma → design system handoff |
| Single developer + AI | Team with dedicated QA, DevOps |
| `prompts/` folder logs AI interaction (01–23) | Not typical; useful for assignment reflection |
| `docs/ai-workflow/prompt-log.md` | Full chronological prompt transcript |
| `docs/ai-workflow/iteration-cycles.md` | Where AI output was corrected |

**Key similarity:** Design before code, tests before merge, documentation as deliverable.

**Key difference:** AI accelerates boilerplate and documentation; human still gates milestones and verifies in browser.
