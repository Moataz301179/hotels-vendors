---
name: awesome-design-md
description: Curated design reference library for fintech-grade web, landing page, and visual polish. Contains 70+ brand design systems (Stripe, Wise, Revolut, Binance, Linear, Apple, Coinbase, Notion, Vercel). Use when the user asks for design polish, color palette suggestions, typography scales, landing page layout, motion choreography, or visual asset direction for hotels-vendors marketing/dashboard pages.
---

# Awesome-design-md — Fintech Design Reference Library

Curated from VoltAgent/awesome-design-md. 70+ brand design systems. Use these as **reference** — never copy directly. Synthesize principles into your own system.

## How to use

When asked to design/polish a page or section:
1. Pick 2-3 reference brands from `ref/design-md/` that match the vibe you want.
2. Extract their color tokens, type scale, spacing, and motion rules.
3. Synthesize — do not clone. Your brand is different.
4. Apply to `app/globals.css` (theme variables) and the page components.

## Fintech B2B reference brands (most relevant)

| Brand | Canvas | Primary | Why reference |
|---|---|---|---|
| `stripe` | White `#ffffff` | Indigo `#533afd` | Atmospheric gradient mesh upper-third, Sohne thin display, tight pill buttons, near-white cards. Best-in-class marketing page rhythm. |
| `wise` | White `#ffffff` | Lime `#9fe870` | Heavy near-black display sans (weight 900), lime accent, sage neutrals, rounded white cards. Scandinavian fintech magazine feel. |
| `revolut` | Black `#000000` | Violet `#494fdf` | Oversized 80-136px Aeonik Pro display, photography-led hero bands, full-width product mockups, near-black sections. Consumer-financial-app serious. |
| `binance` | Near-black `#0b0e11` | Yellow `#fcd535` | Dark canvas, yellow voltage CTAs, trading green/red accents. Best example of dark-mode financial platform. |
| `linear.app` | OLED `#010102` | Lavender `#5e6ad2` | Deepest dark surface, single chromatic accent, charcoal panels with hairline borders, product-UI-screenshot framed sections. Software-craft luxury. |
| `apple` | White `#ffffff` | Blue `#0066cc` | Photography-first, edge-to-edge product tiles, SF Pro Display with negative tracking, single Action Blue interactive. Museum-gallery marketing. |
| `coinbase` | White `#ffffff` | Blue `#0052ff` | Institutional calm, Coinbase Display at weight 400 (editorial not bombastic), card-on-card layering, full-bleed dark editorial heroes. |
| `notion` | White `#ffffff` | Purple `#5645d4` | Illustration-rich, pastel-tinted feature cards, 4-tier pricing, brand-navy hero band. All-in-one workspace voice. |

## Luxury / automotive (for high-end feel)

| Brand | Canvas | Primary | Why reference |
|---|---|---|---|
| `ferrari` | — | Red | Aspirational descriptor naming, heritage speed. |
| `lamborghini` | — | — | Extreme type scale contrast, utilitarian color. |
| `bmw` | — | — | Precision, engineering-grade spacing. |
| `tesla` | — | — | Minimal chrome, product-first, no decorative gradients. |

## Hospitality / consumer (for warmth)

| Brand | Canvas | Primary | Why reference |
|---|---|---|---|
| `airbnb` | — | — | Editorial warmth, human-centered copy. |
| `starbucks` | — | Green | Proprietary vocabulary, Italianate sizing, premium European sensibility. |

## Hotels Vendors — recommended synthesis

### Color system (3 themes)

| Token | Commercial (dark) | Hospitality (dark) | Resort (dark) |
|---|---|---|---|
| `--bg-canvas` | `#0B0F17` | `#14110E` | `#0A1612` |
| `--bg-surface-1` | `#111520` | `#1C1814` | `#0F1F1A` |
| `--bg-surface-2` | `#181D2A` | `#262019` | `#162A23` |
| `--bg-surface-3` | `#1F2535` | `#302A22` | `#1D332B` |
| `--text-primary` | `#F0F2F5` | `#F5F1EB` | `#F0F2F5` |
| `--text-secondary` | `#A1A8B8` | `#C4B8A4` | `#A8C4B8` |
| `--text-muted` | `#4A515E` | `#7A6F62` | `#5A7A6E` |
| `--accent-base` | `#FF6B00` | `#D4AF37` | `#FF8A33` |
| `--accent-light` | `#FF8A33` | `#E6C65A` | `#FFA85C` |
| `--accent-dark` | `#CC5500` | `#B8962E` | `#CC6E24` |
| `--border-subtle` | `rgba(255,255,255,0.06)` | `rgba(255,255,255,0.06)` | `rgba(255,255,255,0.06)` |
| `--border-accent` | `rgba(255,107,0,0.30)` | `rgba(212,175,55,0.30)` | `rgba(255,138,51,0.30)` |

Light theme (default `:root`): canvas `#F6F7F9`, surface `#FFFFFF`, text `#0F172A`, accent `#FF6B00`.

### Typography scale

| Token | Size | Weight | Letter-spacing | Use |
|---|---|---|---|---|
| `display-xxl` | 56px | 700 | -1.4px | Hero headline (one line) |
| `display-xl` | 48px | 700 | -0.96px | Hero headline (two lines) |
| `display-lg` | 36px | 600 | -0.64px | Section title |
| `display-md` | 28px | 600 | -0.26px | Subsection title |
| `heading-lg` | 22px | 600 | -0.22px | Card title |
| `heading-md` | 18px | 600 | 0 | Card subtitle |
| `body-lg` | 16px | 400 | 0 | Body lead |
| `body-md` | 14px | 400 | 0 | Body |
| `caption` | 12px | 400 | 0 | Caption / meta |

Font stack: `"Plus Jakarta Sans", "Inter", ui-sans-serif, system-ui, sans-serif` — single family, no serif for body. Use Playfair Display only for one or two hero accent words, never for body.

### Spacing scale

4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 px. Section padding: 96px top/bottom on desktop, 48px on mobile. Inter-section gap: 64px.

### Radius

sm: 8px / md: 12px / lg: 16px / full: 9999px. Buttons: pill (9999px). Cards: 12px. Inputs: 8px.

### Shadows (dark theme)

`--shadow-elevated: 0 4px 24px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)`
`--shadow-glow-accent: 0 0 40px rgba(255,107,0,0.06)`
`--shadow-inner-light: inset 0 1px 0 rgba(255,255,255,0.03)`

### Motion (Framer Motion)

| Pattern | Config |
|---|---|
| Page entrance | fade + 12px up, stagger 0.05, easeOutExpo |
| Section title word reveal | stagger 0.08 |
| Card slide-in | 20px up + scale 0.97→1, mass 0.8 stiffness 200 |
| Stat count-up | 1.2s duration |
| CTA hover | scale 1.02 + accent glow pulse |
| Sidebar mobile | x: [-100%, 0] spring |
| Notification bell shake | 8deg, 3 oscillations, 0.4s |
| Route transitions | crossfade 200ms, AnimatePresence exitBeforeEnter |
| Scroll-triggered | whileInView once: true amount: 0.2 |
| Reduced motion | prefers-reduced-motion: reduce → 0.01ms |

### Banned patterns (from high-end-visual-design skill)

- Inter, Roboto, Arial, Open Sans, Helvetica as primary fonts.
- Standard thick-stroked Lucide, FontAwesome, Material Icons.
- Generic 1px solid gray borders.
- Edge-to-edge sticky navbars glued to top.
- Symmetrical 3-column Bootstrap grids without whitespace.
- Linear or ease-in-out transitions.
- Standard `shadow-md` / `rgba(0,0,0,0.3)`.

### Landing page sections (recommended order)

1. **Hero** — oversized display headline, one CTA (pill), one subline, no image (gradient mesh background).
2. **Trusted-by marquee** — monochrome partner logos, infinite horizontal scroll, opacity 0.4→0.9 hover.
3. **Problem/Solution split** — two columns, icon-led, 60/40 asymmetry.
4. **How it works** — 3-step horizontal flow, connected dots, icon per step, number counter on scroll.
5. **Product categories** — 5 bento cards (F&B, Consumables, Guest Supplies, FF&E, Services), icon + one-line description.
6. **Stats band** — 4 KPIs in a row, count-up on scroll, large display numbers.
7. **Dashboard mockup** — real dashboard screenshot in MacBook frame, floating on gradient mesh.
8. **Testimonials** — 3 cards, photo + quote + name + role, subtle card-on-card layer.
9. **Pricing** — 3-tier comparison (Free / Pro / Enterprise), featured tier highlighted with accent border.
10. **CTA section** — solid black, one orange button, one line of copy, zero decoration.
11. **Footer** — 4 columns of links + liability disclaimer, dark surface, minimal.

### Fintech copywriting tone

- **Confident, not hype.** "Procurement infrastructure for coastal hospitality" not "Revolutionizing hotel supply chains!"
- **Specific, not vague.** "Net-30 credit lines for Stella Di Mare properties" not "Flexible payment solutions for hotels."
- **Active voice.** "Hotels order. Suppliers deliver. We handle the rest." not "Orders are handled by the platform."
- **No exclamation marks.** Ever. In B2B fintech, exclamation marks signal consumer app energy.
- **Numbers over adjectives.** "1,200 rooms served" not "Thousands of happy hotel rooms."
- **Liability disclaimer on every transaction page.** "Restaurants for E-Marketing operates strictly as a technical data orchestrator. Zero liability for counterparty collection defaults."

### Copy patterns to use

| Instead of | Write |
|---|---|
| "Revolutionary platform" | "Procurement infrastructure" |
| "Seamless experience" | "ETA-compliant digital workflow" |
| "Trusted by thousands" | "Serving 1,200+ Red Sea rooms" |
| "Fast payments" | "Net-30 / Net-60 with embedded factoring" |
| "Easy onboarding" | "Single KYC, multi-property access" |
| "24/7 support" | "Cairo-based operations team" |
| "AI-powered" | "Automated ETA compliance" |
| "Best prices" | "Fixed-price catalogs, per-hotel negotiated" |
| "Get started" | "Request supplier access" |
| "Contact us" | "Schedule a procurement review" |

## Reference files

Full brand design systems live in `ref/design-md/<brand>/DESIGN.md`. Read them when you need specific hex values, type scales, or spacing for a particular vibe.
