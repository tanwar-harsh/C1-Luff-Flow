# Prompt 12 — Auth UI (Login & Signup from Stitch)

## Prompt
> Please pull login and Signup pages from stitch and update the login flow accordingly. Currently we don't seem to have a signup flow, please work on that as well.

## Milestone
**M9b — Auth UI & Public Landing** ✅

## Delivered
- Stitch-aligned `/login` and `/signup` pages (`AuthLayout`, `PasswordInput`, `AuthDivider`, `SocialAuthButtons`)
- `SignupForm` wired to `POST /api/auth/register` via `AuthContext.register()`
- `registerSchema` validation in `frontend/utils/validators.ts`
- Header hidden on auth routes; `?redirect=` preserved between login ↔ signup
- Google/SSO and forgot-password as UI placeholders (disabled)
- `DESIGN.md` updated with Login and Sign Up screen IDs

## Spec
[`planning/auth-ui.md`](../planning/auth-ui.md)
