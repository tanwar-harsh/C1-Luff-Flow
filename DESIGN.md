# DESIGN.md — Luff-Flow Design System

> **Single source of truth for all UI decisions in this project.**  
> Every frontend component, page, and style choice must reference this file.  
> Do not introduce colors, fonts, spacing, or component patterns not defined here.

**Source:** Stitch project **Luff-Flow Ticket Manager** (`projects/4825899821429159092`)  
**Extracted from:** Project design system + screens: Ticket List, Create Ticket, Ticket Details, Search & Filter  
**Last updated:** 2026-07-14

---

## Brand & Style

**Philosophy:** Minimalism + Corporate Modernism — light, high-utility, content-first.

**Goals:**
- Reduce cognitive load for support agents
- Structural elements (borders, backgrounds) recede; functional elements (status, titles, priority) stand out
- Whitespace as primary grouping tool — not heavy lines
- Professional, reliable, exceptionally clean

**Aesthetic keywords:** Atmospheric White · Slate neutrals · Corporate blue actions · High-density but readable

---

## Screens (Stitch Reference)

| Screen | Stitch Title | Screen ID | Device | Key UI Elements |
|--------|--------------|-----------|--------|-----------------|
| Landing | Luff-Flow — Support at the Speed of Flow | `92cffc924c4f4f4f908bc962ad6e2b35` | Desktop 2560×7820 | Hero, feature sections, stats, testimonial, CTA |
| Ticket List | Dashboard — Ticket List | `7499610d39734031951b24f083dc32ec` | Desktop 1280×1024 | Top nav, sub-header (Board/List/Timeline), ticket cards/table, status chips, search bar |
| Create Ticket | Create New Ticket | `98d63819c8a24092baf5fb2f2808863a` | Desktop 1280×1025 | Form layout, title/description/priority inputs, primary CTA |
| Ticket Details | Ticket Details | `c4aa09a642bb468781ed71241c12ff70` | Desktop 1280×1024 | Ticket metadata, status badge, assignee, comment thread, status actions |
| Search & Filter | Search & Filter Results | `e02686ff664e4a948643f33dd6bdfc0c` | Desktop 1280×1024 | Search input, status filter, filtered results list |
| Login | Login — Luff-Flow | `9df36f0f6e834a838bff4eb1fce138cd` | Desktop 1280×2048 | Centered auth card, email/password, SSO divider |
| Sign Up | Sign Up — Luff-Flow | `1a4df0795d964679b19debc384ef7c5f` | Desktop 1280×2048 | Registration form, Google SSO placeholder |

---

## Colors

### Core Palette (Material-style tokens)

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#f7f9fb` | App canvas, page background |
| `surface` | `#f7f9fb` | Same as background (Level 0) |
| `surface-dim` | `#d8dadc` | Dimmed surface areas |
| `surface-container-lowest` | `#ffffff` | Cards, modals, nav bars (Level 1–2) |
| `surface-container-low` | `#f2f4f6` | Subtle container backgrounds |
| `surface-container` | `#eceef0` | Column backgrounds (Kanban), recessed areas |
| `surface-container-high` | `#e6e8ea` | Elevated container tone |
| `surface-container-highest` | `#e0e3e5` | Highest container tone |
| `surface-variant` | `#e0e3e5` | Variant surfaces |
| `on-background` | `#191c1e` | Primary text on background |
| `on-surface` | `#191c1e` | Primary text on surfaces |
| `on-surface-variant` | `#434655` | Secondary/muted text |
| `outline` | `#737686` | Default borders, dividers |
| `outline-variant` | `#c3c6d7` | Subtle borders |
| `inverse-surface` | `#2d3133` | Dark inverse surfaces |
| `inverse-on-surface` | `#eff1f3` | Text on inverse surfaces |

### Brand / Action Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#004ac6` | Primary button background, active links |
| `primary-container` | `#2563eb` | Primary accent, focus rings, icons |
| `on-primary` | `#ffffff` | Text on primary buttons |
| `on-primary-container` | `#eeefff` | Text on primary-tinted surfaces |
| `surface-tint` | `#0053db` | Surface tint / hover accents |
| `secondary` | `#505f76` | Secondary actions, muted labels |
| `secondary-container` | `#d0e1fb` | Secondary button backgrounds |
| `on-secondary-container` | `#54647a` | Text on secondary containers |
| `tertiary` | `#943700` | Tertiary accent (warm) |
| `tertiary-container` | `#bc4800` | Tertiary containers |

### Semantic / Feedback Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `error` | `#ba1a1a` | Error text, destructive actions |
| `error-container` | `#ffdad6` | Error backgrounds |
| `on-error` | `#ffffff` | Text on error buttons |
| `on-error-container` | `#93000a` | Text on error containers |

### Domain-Specific: Ticket Status

Status chips use **10% opacity tinted background** + **saturated text** + **4px solid dot** of status color on the left.

| Status | Dot / Text Color | Background (10% tint) | Notes |
|--------|------------------|----------------------|-------|
| `OPEN` | `#2563eb` | `rgba(37, 99, 235, 0.1)` | Blue — active, awaiting work |
| `IN_PROGRESS` | `#d97706` | `rgba(217, 119, 6, 0.1)` | Amber — actively being worked |
| `RESOLVED` | `#059669` | `rgba(5, 150, 105, 0.1)` | Emerald — fix delivered |
| `CLOSED` | `#64748b` | `rgba(100, 116, 139, 0.1)` | Slate gray — terminal, recedes |
| `CANCELLED` | `#e11d48` | `rgba(225, 29, 72, 0.1)` | Rose — discarded |

### Domain-Specific: Priority

| Priority | Color | Icon treatment |
|----------|-------|----------------|
| `LOW` | `#64748b` | Muted gray icon |
| `MEDIUM` | `#2563eb` | Blue icon |
| `HIGH` | `#d97706` | Amber icon |
| `CRITICAL` | `#e11d48` | Rose/red icon |

### Layout-Specific Overrides (from design guidelines)

| Usage | Hex | Notes |
|-------|-----|-------|
| Canvas alt | `#f8fafc` | Referenced in elevation docs (Slate-50) |
| Nav border | `#e2e8f0` | 1px bottom border on headers (Slate-200) |
| Row hover | `#f1f5f9` | List row hover state (Slate-100) |

---

## Typography

### Font Families

| Role | Family | Google Fonts import |
|------|--------|---------------------|
| Headline & Body | **Hanken Grotesk** | `Hanken+Grotesk:wght@400;500;600;700` |
| Labels & Metadata | **JetBrains Mono** | `JetBrains+Mono:wght@400;500` |

```html
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Type Scale

| Token | Family | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|--------|------|--------|-------------|----------------|-------|
| `display` | Hanken Grotesk | 32px | 700 | 40px | -0.02em | Page titles |
| `headline-md` | Hanken Grotesk | 20px | 600 | 28px | — | Section headers |
| `headline-sm` | Hanken Grotesk | 16px | 600 | 24px | — | Card titles, ticket titles |
| `body-lg` | Hanken Grotesk | 16px | 400 | 24px | — | Body text, descriptions |
| `body-md` | Hanken Grotesk | 14px | 400 | 20px | — | Secondary body, table cells |
| `label-md` | JetBrains Mono | 12px | 500 | 16px | 0.02em | Ticket IDs, timestamps, metadata |
| `label-sm` | Hanken Grotesk | 11px | 700 | 12px | — | Status labels, micro badges |

### Typography Rules

- **Ticket titles:** `headline-sm` (16px / 600)
- **Ticket IDs & timestamps:** `label-md` (JetBrains Mono)
- **Section labels:** `label-sm` uppercase or semi-bold
- **Never** use more than 3 font weights on a single screen

---

## Spacing

**Base unit:** 4px — all spacing must be multiples of 4.

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight internal gaps |
| `sm` | 8px | Icon-to-text, chip padding |
| `md` | 16px | Card internal padding, form field gaps |
| `lg` | 24px | Section spacing |
| `xl` | 32px | Major section breaks |
| `gutter` | 20px | Grid gutters |
| `margin` | 40px | Page outer margin (desktop) |

### Layout Grid

| Breakpoint | Grid | Max Width | Side Margin |
|------------|------|-----------|-------------|
| Desktop | 12-column | 1440px centered | 40px |
| Tablet | 12-column, 16px gutter | Fluid | 16px |
| Mobile | Single column | Fluid | 16px |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 2px (0.125rem) | Checkboxes |
| `DEFAULT` | 4px (0.25rem) | Buttons, inputs, small tags |
| `md` | 6px (0.375rem) | — |
| `lg` | 8px (0.5rem) | Cards, modals |
| `xl` | 12px (0.75rem) | Large containers |
| `full` | 9999px | Avatars, status badge pills |

**Shape language:** Soft — approachable but space-efficient. Status badges are pill-shaped; buttons/inputs use 4px.

---

## Elevation & Depth

Hierarchy via **tonal layering + low-contrast outlines**, not heavy shadows.

| Level | Element | Background | Border / Shadow |
|-------|---------|------------|-----------------|
| 0 | Page canvas | `#f7f9fb` / `#f8fafc` | None |
| 1 | Nav, headers | `#ffffff` | 1px bottom `#e2e8f0`, no shadow |
| 2 | Cards, containers | `#ffffff` | No border on board; subtle shadow on hover only |
| 3 | Modals, popovers | `#ffffff` | Ambient shadow (see below) |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-hover` | `0 2px 4px rgba(0, 0, 0, 0.04)` | Card hover / drag |
| `shadow-modal` | `0 8px 24px rgba(0, 0, 0, 0.12)` | Modals, dropdowns |

**Rule:** Default cards have **no shadow**. Shadow appears only on hover, drag, or overlay.

---

## Components

### Buttons

| Variant | Background | Text | Border | Radius | Padding |
|---------|------------|------|--------|--------|---------|
| **Primary** | `#2563eb` | `#ffffff` | none | 4px | 10px 20px |
| **Secondary** | `#eceef0` | `#191c1e` | none | 4px | 10px 20px |
| **Ghost** | transparent | `#2563eb` or `#434655` | none | 4px | 10px 16px |

- No gradients on any button
- Ghost shows background on hover: `#f2f4f6`
- Disabled: 50% opacity, no pointer

### Status Chips

```
[ ● ] OPEN
```

- Pill shape (`border-radius: full`)
- 10% opacity tinted background of status color
- Saturated status color for text
- 4px solid dot (same color) to the left of label
- Font: `label-sm` (11px / 700)
- Padding: 4px 12px

### Input Fields

| State | Border | Background | Notes |
|-------|--------|------------|-------|
| Default | 1px `#c3c6d7` | `#ffffff` | — |
| Focus | 2px `#2563eb` | `#ffffff` | Optional 10% blue outer halo |
| Error | 1px `#ba1a1a` | `#ffffff` | Error message below in `#ba1a1a` |
| Disabled | 1px `#e0e3e5` | `#f2f4f6` | — |

- Radius: 4px
- Padding: 10px 14px
- Font: `body-md` (14px)
- Label above field: `label-sm` or `body-md` weight 600
- Search bar: recessed feel — light gray stroke + subtle inner shadow

### Textarea

Same as input. Min-height: 120px. Resize: vertical only.

### Select / Dropdown

Same border/focus as input. Chevron icon right-aligned. Dropdown panel: Level 3 shadow, 8px radius.

### Ticket Card (List / Board)

```
┌─────────────────────────────┐
│ KAN-42          [priority]  │  ← label-md (mono) + priority icon
│                             │
│ Payment failed on checkout  │  ← headline-sm
│                             │
│ [avatar]  Jane Agent  [●OPEN]│  ← footer: avatar + assignee + status chip
└─────────────────────────────┘
```

- Background: `#ffffff`
- Padding: 16px (`md`)
- Radius: 8px (`lg`)
- No visible border on board (white on `#eceef0` column)
- Hover: `shadow-hover` + optional `#f1f5f9` if in list view

### Avatar

- Shape: circle (`full`)
- Size: 24px (list), 32px (detail)
- Fallback: initials on `#d0e1fb` background, `#004ac6` text

### Navigation (Top Bar)

- Height: ~56px
- Background: `#ffffff`
- Border-bottom: 1px `#e2e8f0`
- Logo/app name: `headline-sm`
- Search input: inline, recessed style

### Sub-Header (View Switcher)

- Tabs: Board · List · Timeline (underline style)
- Active tab: 2px bottom border `#2563eb`, font-weight 600
- Inactive: `#434655`, weight 400

### Data Table (List View)

- Header row: `label-sm`, `#434655`, uppercase optional
- Row separator: 1px `#e0e3e5`
- Row hover: `#f1f5f9`
- Ticket ID column: JetBrains Mono, right-aligned or left with mono styling

### Comment Thread (Ticket Details)

- Comment card: no border, `surface-container-low` background
- Padding: 12px 16px
- Author name: `headline-sm` or `body-md` weight 600
- Timestamp: `label-md` (mono), `#434655`
- Message: `body-md`

### Form Layout (Create Ticket)

- Max form width: 640px
- Field stack gap: 16px (`md`)
- Section title: `headline-md`
- Submit button: Primary, full-width on mobile, auto-width on desktop
- Cancel: Ghost variant

### Search & Filter Bar

- Search input: full-width or prominent in header
- Status filter: chip toggles or select dropdown
- Active filter chip: primary-tinted background
- Results count: `label-md` (mono), `#434655`

### Error / Alert Banner

- Background: `#ffdad6`
- Text: `#93000a`
- Border-left: 4px `#ba1a1a`
- Padding: 12px 16px
- Radius: 4px

---

## Tailwind CSS Configuration

Use these extensions in `frontend/tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      colors: {
        background: '#f7f9fb',
        foreground: '#191c1e',
        primary: {
          DEFAULT: '#2563eb',
          dark: '#004ac6',
          foreground: '#ffffff',
          container: '#eeefff',
        },
        secondary: {
          DEFAULT: '#505f76',
          container: '#d0e1fb',
          foreground: '#54647a',
        },
        surface: {
          DEFAULT: '#f7f9fb',
          container: '#eceef0',
          'container-low': '#f2f4f6',
          'container-lowest': '#ffffff',
          'container-high': '#e6e8ea',
        },
        outline: {
          DEFAULT: '#737686',
          variant: '#c3c6d7',
          nav: '#e2e8f0',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
          foreground: '#93000a',
        },
        status: {
          open: '#2563eb',
          'in-progress': '#d97706',
          resolved: '#059669',
          closed: '#64748b',
          cancelled: '#e11d48',
        },
        priority: {
          low: '#64748b',
          medium: '#2563eb',
          high: '#d97706',
          critical: '#e11d48',
        },
      },
      fontFamily: {
        sans: ['Hanken Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        display: ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-md': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'headline-sm': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px' }],
        'body-md': ['14px', { lineHeight: '20px' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '500' }],
        'label-sm': ['11px', { lineHeight: '12px', fontWeight: '700' }],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
      spacing: {
        gutter: '20px',
        margin: '40px',
      },
      maxWidth: {
        content: '1440px',
        form: '640px',
      },
      boxShadow: {
        hover: '0 2px 4px rgba(0, 0, 0, 0.04)',
        modal: '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
    },
  },
};

export default config;
```

---

## CSS Variables (Alternative)

```css
:root {
  /* Surfaces */
  --color-background: #f7f9fb;
  --color-surface: #ffffff;
  --color-surface-container: #eceef0;
  --color-on-surface: #191c1e;
  --color-on-surface-variant: #434655;

  /* Brand */
  --color-primary: #2563eb;
  --color-primary-dark: #004ac6;
  --color-on-primary: #ffffff;

  /* Borders */
  --color-outline: #737686;
  --color-outline-variant: #c3c6d7;
  --color-outline-nav: #e2e8f0;

  /* Feedback */
  --color-error: #ba1a1a;
  --color-error-container: #ffdad6;

  /* Status */
  --color-status-open: #2563eb;
  --color-status-in-progress: #d97706;
  --color-status-resolved: #059669;
  --color-status-closed: #64748b;
  --color-status-cancelled: #e11d48;

  /* Typography */
  --font-sans: 'Hanken Grotesk', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Radius */
  --radius-sm: 2px;
  --radius-default: 4px;
  --radius-lg: 8px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-hover: 0 2px 4px rgba(0, 0, 0, 0.04);
  --shadow-modal: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

---

## Implementation Rules

1. **Reference this file first** before writing any frontend component.
2. **Use design tokens** — never hardcode hex values in components; use Tailwind classes or CSS variables from this spec.
3. **Status chips** must always include the left dot indicator.
4. **Ticket IDs and timestamps** must use JetBrains Mono.
5. **No dark mode** in v1 — light mode only (`colorMode: LIGHT`).
6. **No gradients** on buttons or surfaces.
7. **Cards on board view** have no border — rely on white-on-gray contrast.
8. **Max content width** 1440px, centered, 40px outer margin on desktop.
9. When Stitch screen HTML is ambiguous, prefer the token values in this file over ad-hoc choices.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-07-13 | Initial extraction from Stitch Luff-Flow Ticket Manager design system + 4 screens |
