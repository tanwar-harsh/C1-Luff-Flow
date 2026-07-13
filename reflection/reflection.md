# Reflection

## What the AI Did Well

1. **Milestone discipline** — Consistently refused to dump the full project, waiting for confirmation at each gate. This mirrors how a senior engineer would mentor a mid-level developer.

2. **Planning before code** — Milestone 1 produced 7 planning documents before any application code. This prevented rework and gave clear traceability.

3. **Architecture consistency** — Every file followed the Clean Architecture layers defined in M1. No controllers with business logic, no Prisma in services.

4. **State machine rigor** — Implemented as pure module + service integration + 8 integration tests. The highest-risk requirement got the most test coverage.

5. **DESIGN.md extraction** — Used Stitch MCP to pull Luff-Flow design tokens into a canonical reference file, then faithfully applied them in Tailwind config.

6. **Error handling** — Consistent API envelope, `parseApiError()` on frontend, field-specific validation messages end-to-end.

7. **Documentation volume** — README, API docs, test plan, tool workflow, review, reflection — all produced without being asked repeatedly.

## What the AI Got Wrong

1. **Initial Stitch MCP unavailable** — First attempt failed because MCP wasn't connected. Required user to configure `user-stitch` in Cursor settings.

2. **Dev server not restarted after `.env` change** — Didn't proactively warn that Express caches env on startup. User saw 500 errors until restart.

3. **Integration tests skipped initially** — `.env.test` pointed to localhost; tests silently skipped rather than failing loudly. Fixed with Neon fallback in test setup.

4. **Download assets from Stitch failed silently** — `download_assets` reported success but files weren't on disk. Fell back to design system API metadata (sufficient for tokens).

5. **Over-eager test DB credential copy blocked** — Security review blocked copying DATABASE_URL between env files; solved with code fallback instead.

## Manual Fixes Made

| Fix | By whom |
|-----|---------|
| Added Neon DATABASE_URL to `.env` | User |
| Connected Stitch MCP | User |
| Restarted backend after env change | User + AI |
| Re-seeded DB after integration tests | AI |

## Lessons Learned

1. **Always restart services after env changes** — Obvious in hindsight but easy to miss with hot-reload tools.

2. **Test DB should be isolated from dev DB** — Sharing Neon instance means `resetDatabase()` in tests wipes dev seed data.

3. **Milestone gating works for AI too** — Prevents scope creep and produces reviewable chunks.

4. **Design system as code** — `DESIGN.md` → Tailwind config is a repeatable pattern for Stitch → implementation handoff.

5. **AI is fast at boilerplate, human is needed for verification** — Browser testing and Neon setup required human action.

## Productivity Impact

| Task | Estimated manual time | With AI | Savings |
|------|----------------------|---------|---------|
| Planning docs (7 files) | 4–6 hours | ~30 min | ~85% |
| Backend (M2+M3) | 8–12 hours | ~2 hours | ~80% |
| Frontend (M4) | 6–8 hours | ~1.5 hours | ~75% |
| Documentation (M5) | 3–4 hours | ~45 min | ~80% |
| **Total** | **~21–30 hours** | **~5 hours** | **~80%** |

**Caveats:** AI time includes user milestone approvals and manual fixes (Neon setup, MCP config, browser verification). Quality of AI output depended heavily on detailed upfront spec and milestone structure.

## Would I Use This Workflow Again?

**Yes**, with these adjustments:
- Connect MCP tools before starting
- Set up test DB branch on Neon upfront
- Add a CI step to run tests on every milestone completion
- Keep milestone gates — they're the highest-value part of the process
