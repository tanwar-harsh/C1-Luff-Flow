# Prompt 06 — Debugging

## Prompt
> I have added neonDb (PostgreSQL 18) url in env file please check if everything is working as expected.

## Reason
User connected Neon PostgreSQL; backend was returning 500 because dev server still used cached localhost DATABASE_URL.

## AI Response Summary
- Diagnosed: dev server started before `.env` update → still pointing at `localhost:5432`
- Ran `prisma migrate deploy` — schema applied to Neon successfully
- Ran `npm run db:seed` — 3 users, 5 tickets, 3 comments
- Restarted backend; verified health, users, tickets, search endpoints
- Frontend confirmed responding at localhost:3000

## Lessons Learned
- **Always restart Node server after DATABASE_URL change** — dotenv loads once at startup
- Neon works with Prisma using `sslmode=require` in connection string
- Warn users about credentials in `.env` — never commit, rotate if exposed
