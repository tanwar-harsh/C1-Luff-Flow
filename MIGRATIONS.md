# Prisma Migrations & Database Workflow

How to run migrations, seed data, and reset the database for this project. All commands assume you are in the **`backend/`** directory unless noted otherwise.

**Source of truth:** `backend/prisma/`, `backend/package.json` scripts, `backend/vercel.json` build command.

---

## Folder layout

```
backend/prisma/
├── schema.prisma              # Models: User, RefreshToken, Ticket, Comment
├── seed.ts                    # Full reset seed (wired to npm run db:seed)
├── seedDemoUsers.ts           # Safe demo-user upsert (npm run db:seed:demo)
└── migrations/
    ├── migration_lock.toml    # Provider lock: postgresql
    ├── 20260713120000_init/
    │   └── migration.sql      # users, tickets, comments + enums
    └── 20260714061742_add_auth/
        └── migration.sql      # passwordHash, refresh_tokens, role default
```

---

## Environment

| File | Purpose |
|------|---------|
| `backend/.env` | Local dev / shared Neon — `DATABASE_URL` |
| `backend/.env.test` | Integration tests only (`src/tests/setup.ts` loads **this file only**) |

Copy from examples:

```bash
cp .env.example .env
cp .env.test.example .env.test
```

**Local PostgreSQL** (from `.env.example`):

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/support_tickets?schema=public"
```

**Neon** — include `?sslmode=require` in the connection string.

> After changing `DATABASE_URL`, **restart the backend dev server** — env is loaded at startup.

---

## npm scripts (from `package.json`)

| Script | Command | When to use |
|--------|---------|-------------|
| `npm run db:generate` | `prisma generate` | Regenerate Prisma Client after schema changes |
| `npm run db:migrate` | `prisma migrate dev` | **Local dev** — apply migrations + create new migration files |
| `npm run db:migrate:deploy` | `prisma migrate deploy` | **CI / production / Neon** — apply existing migrations only |
| `npm run db:seed` | `prisma db seed` | Wipe all data and insert sample users, tickets, comments |
| `npm run db:seed:demo` | `tsx prisma/seedDemoUsers.ts` | Upsert demo login accounts only (safe for production) |
| `npm run db:studio` | `prisma studio` | GUI browser for the database |
| `postinstall` | `prisma generate` | Runs automatically on `npm install` |
| `vercel-build` | `prisma generate && prisma migrate deploy` | Vercel backend deploy (also in `vercel.json`) |

---

## First-time local setup

```bash
# 1. Create database (PostgreSQL CLI)
createdb support_tickets

# 2. Configure env
cd backend
cp .env.example .env
# edit DATABASE_URL if needed

# 3. Install + generate client
npm install

# 4. Apply all migrations
npm run db:migrate:deploy
# or: npm run db:migrate   (same migrations; dev command can prompt for migration names)

# 5. Load sample data
npm run db:seed

# 6. Start API
npm run dev
```

For a **separate test database**:

```bash
createdb support_tickets_test
cp .env.test.example .env.test
npm run db:migrate:deploy   # with DATABASE_URL pointing at test DB, or set in .env.test and:
# DATABASE_URL from .env.test is used when running tests, not migrate — run:
dotenv -e .env.test -- npx prisma migrate deploy
# simpler: temporarily use .env.test URL or run migrate deploy after exporting DATABASE_URL
```

Practical approach for test DB:

```bash
cd backend
export $(grep -v '^#' .env.test | xargs) && npx prisma migrate deploy
```

---

## Migration workflow

### Apply existing migrations (no schema change)

Use when pulling the repo or deploying:

```bash
cd backend
npm run db:migrate:deploy
```

This runs SQL in `prisma/migrations/*/migration.sql` in order. Does **not** create new migration files.

**Production (Vercel):** Migrations run automatically via `vercel.json`:

```json
"buildCommand": "npx prisma generate && npx prisma migrate deploy"
```

### Create a new migration (schema change)

1. Edit `prisma/schema.prisma`
2. Run:

```bash
cd backend
npm run db:migrate
```

3. Prisma will prompt for a migration name, generate SQL under `prisma/migrations/<timestamp>_<name>/`, apply it, and run `prisma generate`.
4. Commit the new migration folder + `schema.prisma`.

### Migration history (current)

| Migration | Contents |
|-----------|----------|
| `20260713120000_init` | `users`, `tickets`, `comments`; enums `Role`, `Priority`, `TicketStatus`; FKs + indexes |
| `20260714061742_add_auth` | `users.passwordHash`, `users.role` default `USER`; `refresh_tokens` table |

---

## Seed scripts

### Full seed — `npm run db:seed`

**Entry:** `package.json` → `"prisma": { "seed": "tsx prisma/seed.ts" }`  
**File:** `prisma/seed.ts`

**Behavior (destructive):**

1. Deletes all rows: `refresh_tokens` → `comments` → `tickets` → `users`
2. Creates 3 users (password `Password123!`):

| Email | Role |
|-------|------|
| `admin@example.com` | ADMIN |
| `agent@example.com` | AGENT |
| `user@example.com` | USER |

3. Creates 5 tickets (one per status: OPEN, IN_PROGRESS, RESOLVED, CLOSED, CANCELLED)
4. Creates 3 comments

Use after integration tests wipe dev data, or for a clean local QA dataset.

```bash
cd backend && npm run db:seed
```

Against Neon (one-off):

```bash
cd backend && DATABASE_URL="postgresql://..." npm run db:seed
```

### Demo seed — `npm run db:seed:demo`

**File:** `prisma/seedDemoUsers.ts`

**Behavior (non-destructive):** Upserts the three demo users by email. Updates name, role, and password hash. Does **not** delete tickets or comments.

```bash
cd backend && npm run db:seed:demo
```

**Production:** Use this to restore login accounts without wiping tickets. See [`docs/deployment-vercel.md`](./docs/deployment-vercel.md).

---

## Reset database locally

### Option A — Prisma migrate reset (recommended for local dev)

Drops the database, reapplies all migrations, runs **`db:seed` automatically** (via `package.json` seed config):

```bash
cd backend
npx prisma migrate reset
```

Confirms before destructive action. Requires interactive terminal.

### Option B — Re-seed without dropping schema

If migrations are already applied and you only want fresh data:

```bash
cd backend
npm run db:seed
```

This deletes all application data and re-inserts seed rows (same as seed script wipe step).

### Option C — Manual full reset (PostgreSQL)

```bash
dropdb support_tickets
createdb support_tickets
cd backend
npm run db:migrate:deploy
npm run db:seed
```

### After running integration tests

Tests call `resetDatabase()` (deletes all users/tickets/comments). Restore dev data:

```bash
cd backend && npm run db:seed
# or demo users only:
npm run db:seed:demo
```

**Important:** Tests use `.env.test` only — do not point `.env.test` at production Neon. See [`ASSUMPTIONS.md`](./ASSUMPTIONS.md).

---

## Prisma Studio

Browse/edit data in the browser:

```bash
cd backend && npm run db:studio
```

Uses `DATABASE_URL` from `backend/.env`.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `PrismaClient` out of date after schema change | `npm run db:generate` |
| Migrations pending on Neon | `npm run db:migrate:deploy` |
| API 500 after changing `.env` | Restart `npm run dev` |
| Login fails on production | `DATABASE_URL="..." npm run db:seed:demo` |
| Tests skip / DB connection errors | Create `support_tickets_test`, set `.env.test`, `migrate deploy` against test URL |
| Vercel build fails on Prisma | Ensure `DATABASE_URL` is set in Vercel project env |

---

## Quick reference

```bash
cd backend

# Daily dev
npm run db:migrate:deploy    # apply migrations
npm run db:seed              # fresh sample data
npm run dev

# Schema change
# edit prisma/schema.prisma
npm run db:migrate           # create + apply migration

# Production-safe demo accounts
npm run db:seed:demo

# Nuclear local reset
npx prisma migrate reset
```

---

## Related docs

- [`REQUIREMENTS.md`](./REQUIREMENTS.md) — data model acceptance criteria
- [`docs/deployment-vercel.md`](./docs/deployment-vercel.md) — Neon + Vercel migration on deploy
- [`planning/database-design.md`](./planning/database-design.md) — ERD and referential integrity
