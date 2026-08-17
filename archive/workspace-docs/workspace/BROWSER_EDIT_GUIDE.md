# Browser-Based Edit Guide

**Purpose:** Edit HV and INVO pages visually via Chrome AI selector, then save changes back to source files.

---

## How It Works

1. **You** use Chrome's AI selector to pick elements and describe changes
2. **I** (Kimi) read the selected elements, identify the source file, and apply the change
3. **Changes are saved** to the workspace and deployed automatically

---

## Page → Source File Mapping

### Hotels Vendors (`hotelsvendors.com`)

| Section | Source File | Line Range |
|---|---|---|
| Nav (logo, links, toggle, CTA) | `components/layout/marketing-nav.tsx` | 1-119 |
| Hero headline, subhead, CTAs | `app/(marketing)/page.tsx` | 90-170 |
| Hero right card (AI Forecast) | `app/(marketing)/page.tsx` | 171-220 |
| Marquee (scrolling text) | `app/(marketing)/page.tsx` | 222-235 |
| Features grid (6 cards) | `app/(marketing)/page.tsx` | 237-280 |
| How It Works (4 steps) | `app/(marketing)/page.tsx` | 282-325 |
| Testimonials (3 quotes) | `app/(marketing)/page.tsx` | 327-370 |
| Pricing (3 tiers) | `app/(marketing)/page.tsx` | 372-425 |
| CTA banner | `app/(marketing)/page.tsx` | 427-445 |
| Footer | `components/layout/marketing-footer.tsx` | full |
| Global styles (colors, fonts, borders) | `app/globals.css` | full |

### INVO (`invo.hotelsvendors.com`)

| Section | Source File | Line Range |
|---|---|---|
| Nav (logo, links, CTA) | `components/invo/invo-nav.tsx` | 1-120 |
| Hero headline, subhead, CTAs | `app/invo/page.tsx` | 55-145 |
| Terminal/code preview card | `app/invo/page.tsx` | 146-185 |
| Marquee | `app/invo/page.tsx` | 187-200 |
| Integrations grid (6 cards) | `app/invo/page.tsx` | 202-245 |
| Partner types (3 cards) | `app/invo/page.tsx` | 247-290 |
| Code preview section | `app/invo/page.tsx` | 292-345 |
| CTA banner | `app/invo/page.tsx` | 347-375 |
| Footer | `components/invo/invo-footer.tsx` | full |

---

## Allowed Edits

### ✅ Safe to Edit
- **Text/copy** — headlines, descriptions, button labels
- **Colors** — accent colors, backgrounds, borders (use CSS variables)
- **Spacing** — padding, margins, gaps
- **Icons** — swap lucide-react icons
- **Links** — href destinations
- **Stats/numbers** — metric values, labels
- **Card content** — titles, descriptions, list items

### ⚠️ Ask Before Editing
- **Page structure** — adding/removing sections
- **New pages/routes** — requires file creation
- **API endpoints** — requires backend logic
- **Database schema** — requires migration
- **Authentication** — security-critical

### ❌ Do Not Edit
- **Middleware** (`middleware.ts`) — security layer
- **API route logic** — business logic
- **Environment variables** — secrets
- **Prisma schema** — data model
- **Fintech calculations** — monetary logic

---

## Color Variables

Use these CSS variables for consistency:

```css
/* Hotels Vendors (Orange) */
var(--accent-base)      /* #F97316 */
var(--accent-light)     /* #FB923C */
var(--accent-dark)      /* #EA580C */
var(--accent-muted)     /* rgba(249,115,22,0.10) */

/* INVO (Lime) */
var(--accent-base)      /* #84CC16 (when data-accent="lime") */
var(--accent-light)     /* #A3E635 */
var(--accent-dark)      /* #65A30D */
var(--accent-muted)     /* rgba(132,204,22,0.10) */

/* Shared */
var(--bg-canvas)        /* #0B0F1A */
var(--bg-surface-1)     /* #111827 */
var(--bg-surface-2)     /* #151D2E */
var(--text-primary)     /* #f0f0f0 */
var(--text-secondary)   /* #9CA3AF */
var(--text-muted)       /* #4B5563 */
var(--border-subtle)    /* rgba(255,255,255,0.06) */
var(--border-visible)   /* rgba(255,255,255,0.10) */
```

---

## Typography Rules

- **NO bold fonts** (700+). Use weight 300, 400, 500 only.
- Headlines: `font-weight: 500`, large sizes (32px-60px)
- Body: `font-weight: 400`, 14px-16px
- Labels: `font-weight: 500`, 11px-12px, uppercase, tracking-wider

---

## Edit Workflow

### Step 1: Select Element
Use Chrome AI selector to click/highlight the element you want to change.

### Step 2: Describe Change
Tell me exactly what to change:
- "Change headline from X to Y"
- "Make this button lime instead of orange"
- "Add padding here"
- "Swap this icon for [icon-name]"

### Step 3: I Apply + Verify
I will:
1. Read the source file
2. Apply the change with `StrReplaceFile`
3. Rebuild locally
4. Deploy to VPS
5. Take a screenshot to verify

### Step 4: You Review
Check the live site. If it needs adjustment, repeat.

---

## Subdomain Routing

| URL | Serves |
|---|---|
| `https://hotelsvendors.com` | HV marketing page |
| `https://hotelsvendors.com/invo` | INVO page (path) |
| `https://invo.hotelsvendors.com` | INVO page (subdomain) |

The subdomain `invo.hotelsvendors.com` is now active and routes through nginx → Next.js middleware → `/invo` page.

---

## Quick Reference: Icon Names (lucide-react)

Common icons used:
- `ArrowRight`, `Play`, `Check`, `Quote`
- `Brain`, `FileText`, `ShoppingCart`, `Grid3x3`, `Landmark`, `Building2`
- `Package`, `Truck`, `Shield`, `BarChart3`
- `Link2`, `Sparkles`, `Zap`, `Code2`, `Terminal`

Full list: https://lucide.dev/icons/
