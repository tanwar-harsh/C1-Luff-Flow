# Auth UI & Public Landing (M9b)

## Overview

Stitch-aligned authentication screens and a public marketing landing page. Unauthenticated visitors see the landing at `/`; authenticated users see the ticket list. App navigation tabs are hidden until signed in.

**Stitch project:** Luff-Flow Ticket Manager (`4825899821429159092`)

## Stitch Screens

| Screen | Stitch Title | Screen ID | Route |
|--------|--------------|-----------|-------|
| Login | Login — Luff-Flow | `9df36f0f6e834a838bff4eb1fce138cd` | `/login` |
| Sign Up | Sign Up — Luff-Flow | `1a4df0795d964679b19debc384ef7c5f` | `/signup` |
| Landing | Luff-Flow — Support at the Speed of Flow | `92cffc924c4f4f4f908bc962ad6e2b35` | `/` (guest only) |

## Routes & Access

| Route | Access | Behavior |
|-------|--------|----------|
| `/` | Public | Landing page when logged out; ticket list when logged in |
| `/login` | Public | Sign in; redirects to `?redirect=` or `/` on success |
| `/signup` | Public | Register via `POST /auth/register`; auto-login on success |

## Auth Flow

### Login
1. User submits email + password
2. `POST /api/auth/login` sets httpOnly cookies
3. `AuthContext` updates from response user
4. Redirect to `redirect` query param or `/`

### Signup
1. User submits name, email, password
2. `POST /api/auth/register` creates `USER` role account and sets cookies
3. `AuthContext.register()` sets session
4. Redirect same as login

### Logout
1. `POST /api/auth/logout` revokes refresh token
2. Redirect to `/` (landing page)

## Header Behavior

| Auth state | Nav tabs | Layout |
|------------|----------|--------|
| Logged out | Hidden | Logo left · Sign In / Get Started right |
| Logged in | Centered: Tickets, Create*, Search, Users† | Logo left · tabs center · user + theme right |

\* Create hidden for USER. † Users hidden except ADMIN.

On `/login` and `/signup`, header is hidden (uses `AuthLayout`).

## Components

| Component | Purpose |
|-----------|---------|
| `AuthLayout` | Minimal shell for login/signup (logo, theme toggle, card, footer) |
| `LoginForm` | Stitch login form with password visibility toggle |
| `SignupForm` | Registration form wired to `AuthContext.register()` |
| `PasswordInput` | Password field with show/hide toggle |
| `AuthDivider` | “or” separator between form and social buttons |
| `SocialAuthButtons` | Google/SSO placeholders (disabled, “Coming soon”) |
| `LandingPage` | Marketing page: hero, features, stats, testimonial, CTA |

## Validation

`registerSchema` in `frontend/utils/validators.ts`:
- `name` — required, min 2 chars
- `email` — valid email
- `password` — min 8 chars (matches backend)

## Out of Scope (M9b)

- Forgot password flow
- Google / SSO OAuth
- Route protection for `/tickets/*` and `/search` (M10)
- “Talk to Sales” CTA (disabled placeholder)

## Files

```
frontend/
├── app/
│   ├── page.tsx              # Landing vs ticket list by auth
│   ├── login/page.tsx
│   └── signup/page.tsx
├── components/
│   ├── auth/
│   │   ├── AuthLayout.tsx
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── AuthDivider.tsx
│   │   └── SocialAuthButtons.tsx
│   ├── landing/
│   │   └── LandingPage.tsx
│   └── ui/
│       └── PasswordInput.tsx
├── context/AuthContext.tsx   # login, register, logout, refreshUser
└── services/authService.ts   # register, login, logout, fetchCurrentUser
```
