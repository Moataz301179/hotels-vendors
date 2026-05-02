# UI System Skill
## Hotels Vendors — Glassmorphism Design System with shadcn/ui

### Purpose
Reusable UI patterns for all agents building dashboards, components, or marketing pages.

### Non-Negotiable Rules
1. **Dark Mode Glassmorphism ONLY.** Translucent layers (`backdrop-blur`, `bg-white/5`, `border-white/10`), high whitespace, institutional greys.
2. **Color Palette:** Professional obsidian greys + ruby brand accent + high-contrast white text. NO neon, NO gradient backgrounds as primary.
3. **WCAG 2.2 AA contrast ratios** on ALL interactive elements.
4. **Keyboard navigability** across all interactive elements (`focus-visible` rings).
5. **Data tables are PRIMARY UI element.** Medium-high density, clear hierarchies, whitespace rhythm.
6. **ALL UI primitives MUST live in `components/ui/`** using Radix UI + CVA + tailwind-merge.
7. **NO inline raw HTML elements** (`<button>`, `<table>`) in dashboard pages — use `components/ui/` primitives.
8. **Business logic does NOT belong in presentational components.** Pure props-driven components only.
9. **Next.js `<Link>`** for all internal navigation. NO standard `<a>` tags for client-side routes.
10. **Responsive by default.** All layouts must work on 320px to 4K.

### Tech Stack
- shadcn/ui (initialized with Tailwind v4)
- Radix UI primitives
- CVA + clsx + tailwind-merge
- lucide-react for icons
- Framer Motion for subtle transitions only

### Required Primitives (Initialize First)
- `Button` — Primary, secondary, ghost, danger variants
- `Input` — Text, number, search variants
- `Table` — Sortable, selectable, with pagination
- `Dialog` — Modal confirmations, forms
- `Badge` — Status indicators (order status, risk tier)
- `Card` — Metric cards, info panels
- `Select` — Dropdowns, filters
- `Tabs` — Dashboard section navigation
- `Toast` — Notifications and alerts

### Patterns
```tsx
// CORRECT — using UI primitive
import { Button } from "@/components/ui/button";

<Button variant="primary" size="lg" onClick={handleSubmit}>
  Submit Order
</Button>

// FORBIDDEN — inline raw HTML
<button className="bg-red-500 text-white px-4 py-2" onClick={handleSubmit}>
  Submit Order
</button>
```

### Files You Must Read Before Writing
- `app/globals.css` (theme tokens)
- `components/ui/` (initialize shadcn/ui if empty)
- `components/layout/dashboard-shell.tsx`
