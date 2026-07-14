# Prompt 13 — Public Landing Page & Conditional Nav

## Prompt
> The Tabs Tickets, Create, Search should not be visible, also pull the landing page from stitch and show it when user land on the website and is not logged in.

## Milestone
**M9b — Auth UI & Public Landing** ✅

## Delivered
- `LandingPage` component from Stitch screen **Luff-Flow — Support at the Speed of Flow** (`92cffc924c4f4f4f908bc962ad6e2b35`)
- `/` shows landing when logged out, ticket list when logged in
- Header: Tickets / Create / Search tabs hidden until authenticated
- Guest header shows Sign In + Get Started; logout redirects to `/`
- `TicketListView` extracted from home page for cleaner auth routing
- `DESIGN.md` landing screen reference added

## Spec
[`planning/auth-ui.md`](../planning/auth-ui.md)
