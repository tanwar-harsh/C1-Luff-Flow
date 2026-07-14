# Prompt 09 — Dark / Light Theme

## Prompt
> Can we also add dark and night mode in the application, add a toggle to switch between dark and light themes covering entire application

## Reason
Improve UX with theme preference; extend DESIGN.md token system for dark surfaces.

## AI Response Summary
- CSS variable palettes in `globals.css` (`:root` + `.dark`)
- Tailwind semantic colors mapped to variables
- `ThemeProvider` + `ThemeToggle` in header
- Anti-flash inline script in `layout.tsx`
- localStorage persistence (`luff-flow-theme`)

## Milestone
**M7 — Dark / Light Theme** ✅

## Files
- `frontend/context/ThemeContext.tsx`
- `frontend/components/ui/ThemeToggle.tsx`
- `frontend/app/globals.css`
- `frontend/tailwind.config.ts`
