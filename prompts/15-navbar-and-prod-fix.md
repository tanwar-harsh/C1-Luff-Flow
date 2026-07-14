# Prompt 15 — Production Login Fix & Navbar Layout

## Prompts
1. > Please check getting invalid email / password error
2. > Can we bring Crud related nav tabs to the center of navbar

## Delivered

### Production login fix
- Root cause: demo seed users missing from production Neon (integration tests had wiped shared DB)
- Added `npm run db:seed:demo` — safe upsert for admin/agent/user accounts
- Fixed `src/tests/setup.ts` to use only `.env.test` (no `.env` fallback)

### Centered navbar
- Header uses 3-column grid: logo left · Tickets/Create/Search/Users center · user actions right

## Deploy
- Redeployed backend + frontend to Vercel (2026-07-14)

## Docs
- `docs/deployment-vercel.md` — `db:seed:demo` instructions
