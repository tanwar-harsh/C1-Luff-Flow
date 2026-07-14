# Prompt 08 — Vercel Deployment

## Prompt
> Now lets deploy this on Vercel

## Reason
Ship the application to production for demo and end-to-end verification.

## AI Response Summary
- Created `backend/api/index.ts` serverless entry and `vercel.json`
- Moved `prisma` to dependencies for Vercel builds
- Configured CORS for production frontend URL
- Deployed two Vercel projects (backend + frontend)
- Created `docs/deployment-vercel.md`

## Milestone
**M6 — Vercel Deployment** ✅

## Production URLs
- Frontend: https://frontend-alpha-murex-89.vercel.app
- Backend: https://backend-sigma-eight-96.vercel.app/api

## Redeploys

| Date | Notes |
|------|-------|
| 2026-07-13 | Initial M6 deploy |
| 2026-07-14 AM | Auth (M8/M9), login/signup/landing (M9b), `JWT_SECRET` |
| 2026-07-14 PM | RBAC (M10), centered navbar, `db:seed:demo`, test DB isolation |
