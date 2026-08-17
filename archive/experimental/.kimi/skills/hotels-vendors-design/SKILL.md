---
name: hotels-vendors-design
description: Hotels Vendors design system and UI/UX construction skill. Use when building, updating, or styling any React/Next.js page, component, or layout in the hotels-vendors project. Covers the crimson-dark premium theme, Framer Motion animation patterns, layout components (dashboard shell, marketing nav, auth forms), typography, spacing, and responsive rules. Triggers on requests involving pages, components, UI, styling, themes, animations, landing pages, dashboards, auth screens, or marketplace pages.
---

# Hotels Vendors — Design System

## Brand Identity

**Crimson + Deep Charcoal.** Institutional B2B SaaS for Egyptian hospitality procurement.
- Primary accent: `#8B0000` (crimson red)
- Hover accent: `#6B0000`
- Background canvas: `#050505`
- Surface: `#0a0a0a`
- Surface raised: `#101010`
- Surface hover: `#1a1a1a`
- Text primary: `#f0f0f0`
- Text secondary: `#a0a0a0`
- Text muted: `#505050`
- Border subtle: `rgba(255,255,255,0.06)`
- Border visible: `rgba(255,255,255,0.10)`
- Gold complementary: `#e1a95f` (for premium/factoring cues)

## Page Types & Their Rules

### Auth Pages (`app/(auth)/`)
- Dark fullscreen, centered card
- Background: `bg-[#050505]` with optional `bg-aurora` class
- Card: `surface-card` or `glass-card`
- Inputs: `surface-input` with `focus:border-[#8B0000]/60`
- Primary button: `bg-[#8B0000] hover:bg-[#6B0000]` with shadow glow
- Use `motion` from Framer for entrance animations

### Marketing Pages (`app/(marketing)/`)
- MarketingNav + MarketingFooter wrappers
- Hero: `bg-void` with radial gradient, display typography
- Trust bar, bento grid features, stepped process, CTA card
- Use `FadeIn`, `StaggerContainer`, `ScaleIn` from `components/motion`
- Light theme toggle supported via `html[data-theme="light"]`

### Dashboard Pages (`app/(dashboard)/`)
- Wrapped in `DashboardShell` (header + sidebar + main)
- Background: `bg-[#050505]` (set by shell)
- Cards: `surface-card` or `surface-elevated`
- Tables: `data-table-row` classes
- Status pills: `status-pill` with color variants
- Use `FadeIn` for page content entrance

## Core CSS Utilities (from `app/globals.css`)

```
surface-card        → gradient card with subtle border + shadow
surface-elevated    → stronger shadow, raised surface
surface-input       → form input with focus glow
glass-card          → backdrop-blur translucent card
glass-card-interactive → hover lift + border brighten
bg-aurora           → CSS animated mesh gradient
bg-noise            → SVG noise texture overlay
btn-crimson         → primary crimson button
btn-gold            → gold premium button
btn-ghost           → transparent border button
bento-grid          → 12-col responsive grid
metric-value        → tabular-nums, tight tracking
label-upper         → 11px uppercase muted label
gradient-text-animated → shifting gradient text
animate-fade-in-up  → fade + translateY entrance
animate-shimmer     → loading skeleton shimmer
animate-glow-pulse  → pulsing box-shadow
```

## Framer Motion Patterns (`components/motion/`)

Always import from `components/motion` — never rewrite animation variants.

| Component | Use For |
|-----------|---------|
| `FadeIn` / `FadeInUp` | Scroll-triggered section reveals |
| `StaggerContainer` + `StaggerItem` | Lists, grids, feature cards |
| `ScaleIn` | Modals, important callouts |
| `PageTransition` | Route-level page wraps |
| `HoverLift` | Cards, buttons, interactive tiles |
| `GlowCard` | Highlighted cards with crimson glow |

### Default Easing
- Standard: `[0.16, 1, 0.3, 1]` (expo out)
- Spring: `[0.34, 1.56, 0.64, 1]` (bounce)
- Duration: 0.2s hover, 0.4s card, 0.6s scroll reveal

## Layout Components

### DashboardHeader
- Sticky top, `bg-[#121212]/80 backdrop-blur-xl`
- Search: `bg-white/[0.04] focus:border-[#8B0000]/40`
- Role badge: colored dot + label in `bg-white/[0.04]` pill
- Icons: `text-white/30 hover:text-white/70`

### PulseSidebar
- Background: `bg-[#121212]`, border: `border-white/[0.06]`
- Active item: `bg-[rgba(128,0,0,0.15)] text-white` with crimson left bar
- Icon active: `text-[#8B0000]`
- Collapsed: `w-[72px]`, Expanded: `w-[280px]`

### DashboardShell
- Flex row: sidebar + main content
- Main: `flex-1 overflow-y-auto p-4 sm:p-6`
- Mobile: overlay sidebar with `bg-black/60 backdrop-blur-sm` backdrop

### MarketingNav
- Top utility bar: `bg-[#8B0000]` with phone/email
- Main nav: white background light / transparent dark
- Scroll state: `shadow-md` when scrolled
- Marketplace link: gold accent

## Spacing

- Section padding: `py-24` to `py-32` (96px–128px)
- Content gap: `gap-4` to `gap-6`
- Card padding: `p-6` to `p-8`
- Container: `max-w-7xl mx-auto px-6`

## Responsive Breakpoints

- Mobile first
- `sm:` 640px, `md:` 768px, `lg:` 1024px, `xl:` 1280px
- Sidebar collapses at `md:`
- Bento grid: 3 cols → 2 cols → 1 col

## Do Not

- Use pure white `#ffffff` for text (causes halation on dark)
- Use pure black `#000000` for backgrounds
- Hardcode purple `#7c3aed` anywhere (old brand)
- Write custom Framer variants when `components/motion` exports exist
- Forget `viewport={{ once: true }}` on scroll animations
