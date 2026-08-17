# Hotels Vendors — Design System v2.0
## 2026 Dark-First Premium B2B SaaS
### Inspired by MONO AI × Suprema × Linear

---

## Philosophy

**"The interface disappears so the work shines."**

This is an institutional-grade procurement platform, not a consumer app. Every pixel must signal:
- **Trust** — We handle millions in EGP transactions
- **Speed** — Procurement admin cut by 80%
- **Clarity** — Complex workflows made obvious
- **Premium** — We compete with WhatsApp + Excel and win

Design is **silent partner**, not loud marketer.

---

## 2026 Trend Alignment

| Trend | Implementation | Status |
|-------|---------------|--------|
| **Dark Mode as Default** | Deep warm charcoals, not pure black. OLED-friendly. | ✅ Core |
| **Bento Grid Layouts** | Feature cards in asymmetric grid. Apple/Linear style. | ✅ Implemented |
| **Glassmorphism Evolved** | Functional blur for hierarchy only. No decorative orbs. | ✅ Refined |
| **Expressive Minimalism** | One accent color. Bold typography. Generous whitespace. | ✅ Core |
| **Micro-animations** | Scroll-triggered reveals. Hover lift on cards. | ✅ Implemented |
| **Trust-Focused Design** | Stats, certifications, client logos prominent. | ✅ Added |
| **Self-Serve UX** | Live catalog preview, interactive product demo. | ✅ Implemented |
| **Accessibility First** | WCAG 2.2 AA contrast. Keyboard navigable. | ✅ Required |

---

## Color Palette

### Chosen: Deep Obsidian + Electric Indigo
*(Why: Indigo signals trust, intelligence, and technology. Deep warm charcoal avoids the coldness of pure black. Single accent = MONO AI DNA.)*

#### Background Scale (Dark-First)
| Token | Hex | Usage |
|-------|-----|-------|
| `bg-void` | `#070708` | Deepest background, hero section |
| `bg-base` | `#0a0a0c` | Page default background |
| `bg-elevated` | `#121216` | Cards, panels, nav |
| `bg-raised` | `#1a1a20` | Hover states, dropdowns |
| `bg-hover` | `#22222a` | Active states, selected items |

#### Foreground Scale
| Token | Hex | Usage |
|-------|-----|-------|
| `fg-primary` | `#f1f0f5` | Headlines, primary text |
| `fg-secondary` | `#a09fb0` | Body text, descriptions |
| `fg-tertiary` | `#6e6d7e` | Labels, captions, metadata |
| `fg-muted` | `#4a4958` | Disabled, placeholders |
| `fg-inverse` | `#0a0a0c` | Text on light buttons |

#### Accent: Electric Indigo
| Token | Hex | Usage |
|-------|-----|-------|
| `accent-50` | `#eef2ff` | Lightest tint |
| `accent-100` | `#e0e7ff` | Badge backgrounds |
| `accent-200` | `#c7d2fe` | Focus rings |
| `accent-300` | `#a5b4fc` | Hover accents |
| `accent-400` | `#818cf8` | **PRIMARY ACCENT** — icons, links, labels |
| `accent-500` | `#6366f1` | Buttons, CTAs |
| `accent-600` | `#4f46e5` | Button hover |
| `accent-700` | `#4338ca` | Pressed states |

#### Semantic Colors (Minimal Usage)
| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#34d399` | Positive indicators, online status |
| `warning` | `#fbbf24` | Alerts, pending |
| `error` | `#f87171` | Errors, rejections |
| `info` | `#60a5fa` | Informational |

#### Border Scale
| Token | Value | Usage |
|-------|-------|-------|
| `border-subtle` | `rgba(255,255,255,0.04)` | Invisible structure |
| `border-default` | `rgba(255,255,255,0.06)` | Card borders |
| `border-strong` | `rgba(255,255,255,0.10)` | Dividers, section breaks |
| `border-accent` | `rgba(99,102,241,0.20)` | Focused/selected states |

---

## Alternative Palette Options

### Option B: Charcoal Cyan (Tech-Forward)
```
Background: #0c0c0e → #141418
Accent: #22d3ee (Cyan-400)
Best for: AI-first positioning, startup energy
```

### Option C: Deep Slate Violet (Luxury Fintech)
```
Background: #0f0f12 → #18181f
Accent: #a78bfa (Violet-400)
Best for: Premium positioning, factoring emphasis
```

### Option D: Midnight Emerald (Trust/Compliance)
```
Background: #0a0f0d → #121916
Accent: #34d399 (Emerald-400)
Best for: ETA compliance, sustainability angle
```

---

## Typography

### Font Stack
```css
--font-sans: "Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: "JetBrains Mono", "SF Mono", ui-monospace, monospace;
```

### Type Scale (Dark Theme — Slightly Larger for Readability)
| Token | Size | Weight | Line-Height | Letter-Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `display` | 72px / 4.5rem | 700 | 1.0 | -0.03em | Hero headline (desktop) |
| `h1` | 56px / 3.5rem | 700 | 1.1 | -0.02em | Section headlines |
| `h2` | 40px / 2.5rem | 600 | 1.15 | -0.02em | Sub-sections |
| `h3` | 24px / 1.5rem | 600 | 1.3 | -0.01em | Card titles |
| `h4` | 18px / 1.125rem | 600 | 1.4 | 0 | Feature titles |
| `body-lg` | 18px / 1.125rem | 400 | 1.6 | 0 | Hero subtext |
| `body` | 16px / 1rem | 400 | 1.6 | 0 | Paragraphs |
| `body-sm` | 14px / 0.875rem | 400 | 1.5 | 0 | Card descriptions |
| `caption` | 12px / 0.75rem | 500 | 1.4 | 0.02em | Labels, metadata |
| `micro` | 11px / 0.6875rem | 500 | 1.4 | 0.05em | Badges, uppercase |

---

## Spacing System

### Section Spacing
| Token | Value | Usage |
|-------|-------|-------|
| `section-xl` | 160px / 10rem | Hero bottom, major sections |
| `section-lg` | 120px / 7.5rem | Standard sections |
| `section-md` | 80px / 5rem | Sub-sections |
| `section-sm` | 48px / 3rem | Compact sections |

### Content Spacing
| Token | Value |
|-------|-------|
| `gap-xs` | 4px |
| `gap-sm` | 8px |
| `gap-md` | 16px |
| `gap-lg` | 24px |
| `gap-xl` | 32px |
| `gap-2xl` | 48px |
| `gap-3xl` | 64px |

### Container
```
max-width: 1280px (7xl)
padding-x: 24px mobile / 32px tablet / 48px desktop
```

---

## Component Specifications

### Button — Primary
```
Background: #6366f1 (accent-500)
Text: #ffffff
Padding: 12px 24px
Border-radius: 12px
Font: 14px, weight 600
Hover: #4f46e5 (accent-600), translateY(-1px)
Active: scale(0.98)
Transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1)
```

### Button — Secondary (Ghost)
```
Background: transparent
Border: 1px solid rgba(255,255,255,0.08)
Text: #a09fb0 (fg-secondary)
Padding: 12px 24px
Border-radius: 12px
Font: 14px, weight 500
Hover: bg-white/[0.03], border-white/[0.12], text-white
```

### Card — Bento
```
Background: rgba(18, 18, 22, 0.6) — translucent
Border: 1px solid rgba(255,255,255,0.05)
Border-radius: 20px
Padding: 32px
Backdrop-filter: blur(12px) — on supported browsers
Hover: border-white/[0.10], bg-[#1a1a20]/60, translateY(-2px)
Transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1)
```

### Badge — Section Label
```
Background: rgba(99, 102, 241, 0.08)
Border: 1px solid rgba(99, 102, 241, 0.15)
Text: #818cf8 (accent-400)
Font: 11px, weight 500, uppercase, letter-spacing 0.08em
Padding: 6px 12px
Border-radius: 999px
```

### Input — Search
```
Background: rgba(18, 18, 22, 0.8)
Border: 1px solid rgba(255,255,255,0.06)
Border-radius: 12px
Padding: 12px 16px
Font: 14px
Placeholder: #4a4958 (fg-muted)
Focus: border-accent, ring-2 ring-accent-500/20
```

---

## Layout Templates by Section

### 1. Hero — "Centered Impact"
```
Layout: Centered, single column
Background: bg-void with subtle radial gradient (indigo-500/5 at top)
Content:
  ├─ Section Badge ("Now Live in Egypt" + pulse dot)
  ├─ H1 Display (3-4 lines max, accent color on last phrase)
  ├─ Body-lg (max-width 560px, centered)
  ├─ Button Group (Primary + Ghost, horizontal on desktop)
  ├─ Stats Row (4 metrics, monospace numbers)
  └─ Scroll indicator (optional)
Spacing: pt-40 pb-32
```

### 2. Trust Bar — "Social Proof Strip"
```
Layout: Full-width, horizontal scroll on mobile
Background: bg-base, border-y border-default
Content:
  ├─ Micro label ("Trusted by...")
  └─ Logo cloud (8+ hotel names, faded, evenly spaced)
Spacing: py-10
```

### 3. Features — "Bento Grid"
```
Layout: CSS Grid, 3 columns, auto-rows
Background: bg-base
Content:
  ├─ Section header (centered, badge + h2 + description)
  └─ Grid of BentoCards:
      ├─ 2×1 cards for major features
      ├─ 1×1 cards for secondary features
      └─ 3×1 card for flagship feature (factoring)
Spacing: py-32
```

### 4. How It Works — "Stepped Process"
```
Layout: 3-column grid with connecting line (desktop)
Background: bg-base, bordered top/bottom
Content:
  ├─ Section header
  └─ 3 StepCards:
      ├─ Step number (mono, muted)
      ├─ Icon in accent circle
      ├─ H4 title
      └─ Body-sm description
Spacing: py-32
```

### 5. Live Catalog — "Interactive Preview"
```
Layout: Full-width, tabs + product grid
Background: bg-base
Content:
  ├─ Section header
  ├─ Search bar + Category tabs
  └─ Product grid (4 columns desktop)
      ├─ Product image
      ├─ Name + Category badge
      ├─ Price + Supplier
      └─ Add to cart button
Spacing: py-32
```

### 6. Testimonials — "Voice of Customer"
```
Layout: 3-column cards or horizontal carousel
Background: bg-void (slight variation for rhythm)
Content:
  ├─ Section header
  └─ QuoteCards:
      ├─ Quote text (italic, fg-secondary)
      ├─ Avatar + Name + Role
      └─ Hotel name (muted)
Spacing: py-32
```

### 7. CTA — "Final Conversion"
```
Layout: Centered, contained card
Background: bg-base
Content:
  ├─ Large contained card with gradient border
  ├─ H2 headline
  ├─ Body description
  ├─ Primary CTA button (larger)
  └─ Trust micro-copy ("Free 14-day trial • No credit card")
Spacing: py-32
```

### 8. Footer — "Clean Exit"
```
Layout: 4-column grid
Background: bg-void, border-t
Content:
  ├─ Brand column (logo + tagline)
  ├─ Product links
  ├─ Company links
  ├─ Legal links
  └─ Bottom bar (copyright + social)
Spacing: py-16
```

---

## Motion & Animation

### Easing
```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Durations
| Context | Duration |
|---------|----------|
| Hover states | 200ms |
| Card transitions | 400ms |
| Scroll reveals | 600ms |
| Page transitions | 300ms |
| Stagger delay | 80ms per item |

### Patterns
- **Fade Up**: opacity 0→1, translateY(30px)→0, expo ease
- **Scale In**: opacity 0→1, scale(0.95)→1, spring ease
- **Stagger Children**: 80ms delay between siblings
- **Hover Lift**: translateY(-2px), border brightens, subtle shadow
- **Gradient Shift**: Background gradients animate position on hover

---

## Accessibility Requirements

- All text meets WCAG 2.2 AA (4.5:1 for body, 3:1 for large text)
- Focus states visible on all interactive elements
- Reduced motion respected (`prefers-reduced-motion`)
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<footer>`
- ARIA labels on icon-only buttons
- Color is never sole indicator of state

---

## Image Guidelines

- No stock photos of people in suits
- Product screenshots preferred (real UI)
- Abstract 3D elements OK if subtle
- All images: `loading="lazy"`, proper `alt` text
- Prefer SVG illustrations over raster

---

*Last Updated: 2026-05-02*
*Owner: UX Designer Agent*
*Status: Approved for Implementation*
