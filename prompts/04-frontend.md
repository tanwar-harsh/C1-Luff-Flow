# Prompt 04 — Frontend

## Prompt
> Everything Looks good till now, please continue with Milestone 4 now

## Reason
Build the Next.js frontend with all pages, wired to the backend API, styled per DESIGN.md, with React Hook Form + Zod validation and error surfacing.

## AI Response Summary
- Scaffolded Next.js 15 App Router frontend with Tailwind configured from DESIGN.md tokens
- Created Axios API client mirroring backend types and response envelope
- Built reusable UI components: Button, Input, Textarea, Select, StatusBadge, PriorityBadge, Alert, Header
- Implemented pages: Ticket List (/), Create Ticket (/tickets/new), Ticket Details (/tickets/[id]), Search (/search)
- Wired React Hook Form + Zod for create ticket and comment forms
- StatusActions shows only valid next statuses; surfaces 409 state machine errors via Alert
- parseApiError utility maps backend validation errors to form fields
- Production build passes successfully

## Lessons Learned
- **DESIGN.md as single source of truth** — Tailwind config copied directly; no ad-hoc colors in components
- **Client components for data fetching** — Simple useEffect + useState keeps v1 lean without adding React Query
- **Frontend mirrors backend state machine** — UX guard in StatusActions; backend remains source of truth
- **StatusBadge dot indicator** — Required by DESIGN.md; easy to miss without the reference file
