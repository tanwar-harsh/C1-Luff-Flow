# Deploying to Vercel

This project uses **two Vercel projects**: one for the Express API (serverless) and one for the Next.js frontend.

```
┌─────────────────────┐         ┌─────────────────────┐
│  Frontend (Vercel)  │ ──────► │  Backend (Vercel)   │
│  Next.js            │  HTTPS  │  Express serverless │
│  *.vercel.app       │         │  *.vercel.app/api   │
└─────────────────────┘         └──────────┬──────────┘
                                           │
                                           ▼
                                ┌─────────────────────┐
                                │  Neon PostgreSQL    │
                                └─────────────────────┘
```

---

## Prerequisites

1. [Vercel account](https://vercel.com) (GitHub login recommended)
2. [Neon](https://neon.tech) database with connection string (use **pooled** URL)
3. Code pushed to a GitHub repository

Install Vercel CLI (optional):

```bash
npm i -g vercel
```

---

## Step 1: Deploy Backend API

### Via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. **Root Directory:** `backend`
4. **Framework Preset:** Other
5. **Build Command:** `prisma generate && prisma migrate deploy` (or use `vercel.json`)
6. **Environment Variables:**

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon pooled connection string (`?sslmode=require`) |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | `http://localhost:3000` (add frontend URL after Step 2) |
| `JWT_SECRET` | Strong random string, min 32 characters |

7. Deploy

8. Note your backend URL, e.g. `https://support-ticket-api.vercel.app`

9. Verify:
   ```bash
   curl https://YOUR-BACKEND.vercel.app/api/health
   ```

### Via CLI

```bash
cd backend
npx vercel
# Follow prompts — set root to backend, add env vars when prompted
npx vercel --prod
```

### Seed production data (one-time)

```bash
cd backend
DATABASE_URL="your-neon-url" npm run db:seed
```

---

## Step 2: Deploy Frontend

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the **same** repository again (second project)
3. **Root Directory:** `frontend`
4. **Framework Preset:** Next.js (auto-detected)
5. **Environment Variables:**

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://YOUR-BACKEND.vercel.app/api` |

6. Deploy

7. Note frontend URL, e.g. `https://support-ticket.vercel.app`

---

## Step 3: Update CORS on Backend

1. Open **backend** project in Vercel → Settings → Environment Variables
2. Update `CORS_ORIGIN` to include your frontend URL (comma-separated):

```
http://localhost:3000,https://support-ticket.vercel.app
```

3. Redeploy backend (Deployments → ⋯ → Redeploy)

---

## Step 4: Verify End-to-End

1. Open frontend URL in browser
2. Ticket list should load from Neon via backend API
3. Create a ticket, change status, search — all should work

---

## Environment Variables Summary

### Backend (`backend/`)

| Variable | Required | Example |
|----------|----------|---------|
| `DATABASE_URL` | Yes | `postgresql://...@ep-xxx.neon.tech/neondb?sslmode=require` |
| `CORS_ORIGIN` | Yes | `http://localhost:3000,https://your-frontend.vercel.app` |
| `JWT_SECRET` | Yes | Min 32 characters (random string) |
| `JWT_ACCESS_EXPIRES_IN` | No | `15m` |
| `JWT_REFRESH_EXPIRES_DAYS` | No | `7` |
| `NODE_ENV` | No | `production` (set by Vercel) |

### Frontend (`frontend/`)

| Variable | Required | Example |
|----------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Yes | `https://your-backend.vercel.app/api` |

---

## Production URLs (current)

| Project | URL |
|---------|-----|
| Frontend | https://frontend-alpha-murex-89.vercel.app |
| Backend API | https://backend-sigma-eight-96.vercel.app/api |

**Last redeploy:** 2026-07-14 (auth UI, signup, landing page)

### Redeploy via CLI

```bash
cd backend && npx vercel --prod --yes
cd ../frontend && npx vercel --prod --yes
```

Verify:

```bash
curl https://backend-sigma-eight-96.vercel.app/api/health
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `500` on API routes | Check `DATABASE_URL` in Vercel env vars; use Neon **pooler** URL |
| CORS errors in browser | Add frontend URL to backend `CORS_ORIGIN`; redeploy backend |
| Empty ticket list | Run `npm run db:seed` against production Neon DB |
| Build fails on Prisma | Ensure `postinstall` runs `prisma generate` (in `package.json`) |
| `Can't reach database` | Use pooled connection string; enable SSL (`sslmode=require`) |

---

## Local vs Production

| | Local | Production |
|---|-------|------------|
| Frontend | `http://localhost:3000` | `https://*.vercel.app` |
| Backend | `http://localhost:3001` | `https://*.vercel.app` |
| Database | Neon or local PostgreSQL | Neon |
| Entry | `npm run dev` | `api/index.ts` serverless |

After changing production env vars, always **redeploy** both projects.
