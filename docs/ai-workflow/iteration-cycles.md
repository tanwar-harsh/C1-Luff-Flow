# Iteration Cycles — Where AI Output Was Corrected

Three concrete cases from [`prompt-log.md`](./prompt-log.md) where the first AI suggestion was wrong, incomplete, or blocked — and how a follow-up prompt or code change fixed it.

---

## 1. Stitch MCP blocked → gcloud auth setup

**Prompts:** [P-003](prompt-log.md#p-003--stitch-mcp-design-extraction), [P-004](prompt-log.md#p-004--stitch-mcp-auth-blocked), [P-005](prompt-log.md#p-005--list-stitch-projects)

### What AI suggested

After the design-extraction prompt, the AI tried Stitch MCP in Cursor, then fell back to the CLI (`npx @_davideast/stitch-mcp tool list_projects`). Both failed — no MCP server connected, no API key or OAuth token. The AI stopped and offered two paths:

- **Option A:** Configure Stitch MCP in Cursor + authenticate with `gcloud auth application-default login`
- **Option B:** Manually export HTML/screenshots from Stitch

It explicitly refused to invent a `DESIGN.md` from guesses.

### What was wrong

The AI could not complete the task in-session. Option B would have bypassed the Stitch → canonical design-token workflow the project spec required. Waiting without action would have blocked Milestone 3.

### How it was corrected

**Environment change (not a code change):** Stitch MCP was connected in Cursor Settings using the `@_davideast/stitch-mcp` proxy with `STITCH_USE_SYSTEM_GCLOUD=1`, then:

```bash
gcloud auth application-default login
gcloud services enable stitch.googleapis.com --project=YOUR_PROJECT_ID
```

Cursor was restarted. A short verification prompt followed:

> List my Stitch projects

### Final result

MCP connected as `user-stitch`. **Luff-Flow Ticket Manager** was found, four screens were fetched, and `DESIGN.md` was written at the project root — unblocking Milestone 3 with real Stitch tokens instead of manual exports or fabricated values.

---

## 2. Test DB fallback wiped production → isolated `.env.test` + safe demo seed

**Prompts:** [P-010](prompt-log.md#p-010--start-milestone-5), [P-024](prompt-log.md#p-024--production-login-invalid-credentials)

### What AI suggested

During Milestone 5 testing, integration suites were skipping because `.env.test` pointed at localhost with no local Postgres. The AI updated test setup to **fall back to `.env`** (shared Neon URL) so tests would run instead of silently skipping. Tests passed: 34/34.

### What was wrong

Dev and production shared the same Neon database. Integration tests call `resetDatabase()` before each suite — so running tests **wiped all users and tickets** on the shared instance. Weeks later on production, `user@example.com` / `Password123!` returned **"Invalid email or password"** because demo accounts no longer existed.

The fallback solved "tests skip" but created a worse problem: destructive tests against a live/shared DB.

### How it was corrected

**Prompt that surfaced the bug:**

> Please check getting invalid email / password error

**Code changes:**

1. **`backend/src/tests/setup.ts`** — load only `.env.test`; never fall back to `.env`:

```ts
// Use only .env.test — never fall back to .env (may point at shared Neon production).
dotenv.config({ path: '.env.test' });
```

2. **`backend/prisma/seedDemoUsers.ts`** + **`npm run db:seed:demo`** — upsert demo accounts without wiping tickets or other data; safe to run on production Neon.

### Final result

- Tests no longer touch production/dev Neon when `.env.test` is isolated.
- Production demo logins restored via `db:seed:demo` without a full `db:seed` wipe.
- Documented in `docs/deployment-vercel.md` and README demo-accounts section.

---

## 3. README screenshots over-scoped → user trimmed to three images

**Prompts:** [P-028](prompt-log.md#p-028--readme-stitch-images-only), [P-030](prompt-log.md#p-030--readme-three-images-only), [P-031](prompt-log.md#p-031--readme-recheck)

### What AI suggested

> Can you pull images from stitch and only use those images in readme file

The AI pulled Stitch screenshots for **seven** screens (landing, login, signup, ticket list, ticket details, search, create ticket), downloaded them to `docs/images/stitch-*.png`, and expanded the README Screenshots section with a subsection per screen.

### What was wrong

- **Scope creep:** "Only use Stitch images" was read as "include every screen," not "keep the README lean."
- **Repo weight:** Seven images (including a very tall landing page) made the README heavy and hard to scan.
- **Later regression:** The README was overwritten by an older version, so Screenshots disappeared entirely — reported in P-031.

### How it was corrected

**Follow-up prompts:**

> I have only 3 images now, just keep them and update readme and show these 3 in markdown.

> Can you please recheck the readme as I am not able to see the changes

The user manually kept three files: `stitch-landing-hero.png`, `stitch-login.png`, `stitch-ticket-list.png`. The AI removed references to the other screenshots and re-added the Screenshots + Demo Accounts sections after the file revert.

### Final result

README shows exactly **three** Stitch images (landing hero, login, ticket list) plus a demo-accounts table. Extra image files were deleted; attribution to Stitch and `DESIGN.md` retained. Clearer README without sacrificing the most important UI proof points.

---

## Pattern across all three

| Cycle | First AI move | Correction type | Lesson |
|-------|---------------|-----------------|--------|
| Stitch MCP | Stop + document unblock steps | Fix tooling/auth, then re-prompt | Infrastructure blockers need human setup; don't substitute guesses |
| Test DB | Convenience fallback to `.env` | Fix test isolation + safe seed script | "Make tests pass" can break production if DBs are shared |
| README images | Maximal interpretation of prompt | Narrow scope via follow-up prompt | Tie deliverable size to explicit limits (count, file names) |

See full chronology: [`prompt-log.md`](./prompt-log.md)
