# OpenClaw UI Design Agent — Assignment Brief

## Your Mission

You are the **Lead UI Designer** for Hotels Vendors. The CEO (Moataz) will attach **Dribbble screenshot references** to this conversation. Your job is to:

1. **Analyze** the attached Dribbble screenshots in extreme detail
2. **Extract** the complete visual design system (colors, typography, spacing, shadows, borders)
3. **Specify** every section of the Landing Page and Catalog/Marketplace page
4. **Output** structured design specification documents that the frontend developer (Kimi) will implement in React + Tailwind CSS

**You do NOT write code.** You produce design specifications. Kimi writes all the React/Tailwind code.

---

## Design References (Screenshots Attached by User)

### Reference A: Main Theme / Landing Page
- **Source**: Dribbble shot — "Leadmachine" (shot ID: 10011097)
- **Usage**: This is the PRIMARY visual language for the entire platform
- **Apply to**: Landing page (`/`), global header, footer, buttons, cards, hero sections

### Reference B: Marketplace / Catalog Theme
- **Source**: Dribbble shot — "B2B Ecommerce platform" (shot ID: 22722766)
- **Usage**: This defines the catalog browsing experience
- **Apply to**: Public catalog (`/catalog`), product cards, filters, search, product detail page

---

## Project Context — What We Are Building

**Hotels Vendors** is a B2B Digital Procurement Hub for the Egyptian hospitality sector. It is a **four-sided marketplace**:

1. **Hotels** (Buyers) — procurement portal
2. **Suppliers** (Sellers) — inventory & catalog management
3. **Logistics Providers** — delivery fulfillment
4. **Factoring Companies** — invoice financing / credit

### Key Brand Assets (MUST use)
- **Logo**: `public/logo-horse-only.png` (horse head silhouette, 82×98)
- **Logo SVG**: `public/logo-icon.svg` (horse head, can be styled with CSS stroke/fill)
- **Full Logo**: `public/hotelsvendors-logo.png` (618×336, wordmark + horse)
- **Brand color**: `#800000` (maroon/dark red)

### Current Tech Stack
- **Framework**: Next.js 16 + React 18 + TypeScript
- **Styling**: Tailwind CSS v4 (no arbitrary values needed — use design tokens)
- **UI Primitives**: shadcn/ui (Radix-based), lucide-react icons
- **Animation**: Framer Motion

### What Exists Today (Do NOT redesign these unless specified)
- **Auth pages** (`/login`, `/register`): Already redesigned in dark glassmorphism — leave as-is
- **Dashboard shell** (sidebar + header): Already has dark glassmorphism — only apply color/font updates if the new theme demands it
- **Catalog data**: 124 real products, 10 categories, working filters/search

---

## Pages Requiring Full Design Specifications

### 1. Landing Page (`/`)
**Sections to specify:**
- **Header/Navbar**: White background, black text, red-outlined horse logo (use SVG with stroke="#800000", fill="none"), transparent-to-solid on scroll
- **Hero Section**: Big bold headline + subheadline + 2 CTAs + stats row. Right side: abstract CSS visual (NO stock photos). Include a subtle gradient glow behind hero.
- **Trust Bar**: Hotel names strip (Marriott, Four Seasons, etc.)
- **Categories Section**: 6 category cards with large icons + gradient tints. NO Unsplash photos.
- **Features Grid**: 6 feature cards with icons
- **How It Works**: 3-step process cards with connector lines
- **Metrics Banner**: 4 stat cards (200+ hotels, 6 clusters, 48h delivery, 40% cost reduction)
- **Pricing**: 3 tiers (Starter free, Professional EGP 4,500/mo, Enterprise custom)
- **CTA Section**: Final call-to-action block
- **Footer**: 4-column layout

### 2. Public Catalog (`/catalog`)
**Sections to specify:**
- **Page header**: Title + search bar + view toggle (grid/list)
- **Category navigation**: Horizontal scrollable category pills/tabs
- **Filter sidebar/panel**: Price range, rating, supplier tier, city, stock status
- **Product grid**: Card design — image area (use CSS gradient placeholder, NO photos), product name, supplier, price, rating, stock badge, add-to-cart/compare buttons
- **Product detail page** (`/catalog/[id]`): Hero image area (CSS gradient), bulk pricing table, specs grid, supplier info card, related products
- **Compare drawer**: Side panel for comparing selected products

### 3. Global Components (Reuse across pages)
- **Buttons**: Primary (filled), Secondary (outlined), Ghost. Sizes: sm, md, lg.
- **Cards**: Product card, Feature card, Stat card, Pricing card
- **Forms**: Input fields, Select dropdowns, Search bar
- **Badges**: Stock status (In Stock / Low Stock / Out of Stock), Supplier tier (Gold/Silver/Bronze)
- **Icons**: Use Lucide icons only. Specify which icon for which purpose.

---

## Required Output Format

You MUST produce **4 structured markdown files** with exact specifications. Kimi will read these and implement them.

### File 1: `/docs/design-specs/design-system-v3.md`

This is the **single source of truth** for all visual tokens.

Must include these exact sections:

```markdown
# Design System v3

## Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| --color-bg-primary | #XXXXXX | Page background |
| --color-bg-secondary | #XXXXXX | Card/section background |
| --color-bg-elevated | #XXXXXX | Hover states, dropdowns |
| --color-text-primary | #XXXXXX | Headlines |
| --color-text-secondary | #XXXXXX | Body text |
| --color-text-muted | #XXXXXX | Captions, labels |
| --color-accent | #XXXXXX | Primary brand color (should work with #800000 maroon) |
| --color-accent-light | #XXXXXX | Accent hover |
| --color-accent-glow | rgba(...) | Glow effects |
| --color-border | #XXXXXX | Card borders |
| --color-border-strong | #XXXXXX | Focus states |
| --color-success | #XXXXXX | In stock, verified |
| --color-warning | #XXXXXX | Low stock |
| --color-error | #XXXXXX | Out of stock, errors |

## Typography Scale
| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| display-xl | XXpx | 700 | 1.1 | -0.02em | Hero headline |
| display-lg | XXpx | 700 | 1.15 | -0.01em | Section titles |
| heading | XXpx | 600 | 1.3 | 0 | Card titles |
| body | XXpx | 400 | 1.6 | 0 | Body text |
| body-sm | XXpx | 400 | 1.5 | 0 | Descriptions |
| caption | XXpx | 500 | 1.4 | 0.05em | Labels, uppercase |
| caption-xs | XXpx | 500 | 1.4 | 0.05em | Badges, stats |

## Spacing Scale
| Token | Value | Usage |
|-------|-------|-------|
| space-xs | Xpx | Icon gaps, inline spacing |
| space-sm | Xpx | Component internal padding |
| space-md | Xpx | Card padding |
| space-lg | Xpx | Section internal gaps |
| space-xl | Xpx | Between sections |
| space-2xl | Xpx | Major section separation |

## Border Radius Scale
| Token | Value | Usage |
|-------|-------|-------|
| radius-sm | Xpx | Buttons, badges |
| radius-md | Xpx | Inputs, small cards |
| radius-lg | Xpx | Cards, panels |
| radius-xl | Xpx | Modals, hero containers |

## Shadows
| Token | Value | Usage |
|-------|-------|-------|
| shadow-sm | ... | Cards at rest |
| shadow-md | ... | Cards hover, dropdowns |
| shadow-glow | ... | Accent glow effects |
| shadow-inset | ... | Inner depth |

## Animation / Motion
- Page transitions: ...
- Card hover: ... (duration, easing, transform)
- Button hover: ...
- Scroll reveals: ...
- Stagger delays: ...
```

### File 2: `/docs/design-specs/landing-page-design.md`

Section-by-section pixel-perfect specification:

```markdown
# Landing Page Design Specification

## Section: Navbar
- Height: XXpx
- Background: [color + opacity]
- Border bottom: ...
- Logo: [size, placement, exact SVG stroke color]
- Nav links: [font size, color, hover color, spacing between items]
- CTA button: [exact padding, bg color, text color, border radius, hover state]
- Mobile: [hamburger icon specs, menu panel design]

## Section: Hero
- Layout: [grid columns, gap, alignment]
- Left column max-width: ...
- Badge/pill above headline: [exact styling]
- Headline: [font token, color, max-width]
- Subheadline: [font token, color, max-width]
- CTA buttons: [exact specs for both buttons]
- Stats row: [layout, number size, label size, color]
- Right visual: [describe the abstract visual — circles, cards, glows, gradients]
- Background: [solid color or gradient? Any glow effects?]

## Section: Trust Bar
- Height/padding: ...
- Background: ...
- Text: [hotel names styling]
- Separator: ...

## Section: Categories
- Section padding: ...
- Grid: [columns, gap]
- Card: [padding, border, radius, bg, hover state]
- Icon container: [size, bg, radius]
- Icon: [size, color]
- Title: [font token, color]
- Count: [font token, color]
- Hover reveal: [what appears on hover?]

## Section: Features
- Same structure as Categories but with different icons/content

## Section: How It Works
- Grid: [3 columns, gap]
- Step number: [font, color]
- Connector line: [style between steps]
- Icon container: ...
- Title: ...
- Description: ...

## Section: Metrics Banner
- Grid: [4 columns on desktop, 2 on mobile]
- Card: [flex row, icon left, text right]
- Icon container: ...
- Value number: [font token — should be largest/boldest]
- Label: [font token]

## Section: Pricing
- Grid: [3 columns]
- Card: [padding, border, radius, bg]
- Highlighted card: [what makes it different? border color? bg?]
- "Most Popular" badge: [exact styling]
- Price number: [font size, weight]
- Feature list: [checkmark icon specs, text specs]
- CTA button per tier: [exact styling]

## Section: CTA
- Container: [padding, border, radius, bg]
- Background glow: [if any]
- Headline: ...
- Subheadline: ...
- Buttons: ...

## Section: Footer
- Background: ...
- Grid: [5 columns?]
- Logo: [size]
- Column headings: [font, color, uppercase?]
- Links: [font, color, hover]
- Copyright bar: [border top, text specs]
```

### File 3: `/docs/design-specs/catalog-design.md`

```markdown
# Catalog / Marketplace Design Specification

## Page: Catalog List (`/catalog`)
- Page padding: ...
- Header area: [title font, search bar specs, view toggle buttons]
- Category nav: [horizontal scroll, pill/tab design, active state]
- Filter panel: [width, bg, border, section headings, checkbox style, price slider]
- Product grid: [columns at each breakpoint, gap]
- Product card: [FULL spec — padding, border, radius, image area bg gradient, title font, price font, rating stars, stock badge, hover state]
- Floating compare bar: [position, height, bg, styling]
- Pagination or load more: [button spec]

## Page: Product Detail (`/catalog/[id]`)
- Breadcrumb: [font, color, separator]
- Hero section: [2-column layout? image left, info right?]
- Image area: [size, bg gradient placeholder, border radius]
- Product title: [font token]
- Price: [font token, color]
- Bulk pricing table: [table header, row styling, highlighted tier]
- Specs grid: [2-column grid of label:value pairs]
- Supplier card: [avatar placeholder, name, rating, location, tier badge]
- Add to cart / Compare buttons: [exact styling]
- Related products: [section title, horizontal scroll or grid]

## Component: Compare Drawer
- Position: [right side, width]
- Header: [title, close button]
- Table: [column per product, row per attribute, styling]
- Remove button: [icon, color]
```

### File 4: `/docs/design-specs/component-library.md`

```markdown
# Component Library Specification

## Button
- Sizes: sm (padding, font), md, lg
- Variants: primary (bg, text, border, hover, active), secondary, ghost, danger
- Border radius: [token]
- Transition: [duration, easing]
- Disabled state: [opacity, cursor]
- With icon: [gap between icon and text]

## Card
- Base: [padding, border, radius, bg, shadow]
- Hover: [border color change, shadow change, transform, transition]
- Interactive: [cursor, active state]

## Input / Search
- Height: ...
- Padding: ...
- Border: [width, color, radius]
- Focus: [border color, ring/glow, transition]
- Placeholder: [color]
- Icon left: [position, color]
- Icon right: [position, color]

## Badge / Pill
- Padding: ...
- Border radius: ...
- Font: ...
- Variants: default, success, warning, error, accent
- With dot: [dot size, color, gap]

## Icon Container
- Sizes: sm (24px), md (32px), lg (40px)
- Shape: [circle? rounded square?]
- Background: [tinted by accent color at low opacity]
- Icon: [size inside container, color]

## Modal / Drawer
- Overlay: [bg color, opacity, backdrop blur]
- Panel: [bg, border, radius, shadow, max-width]
- Header: [padding, title font, close button]
- Body: [padding]
- Animation: [enter/exit transitions]
```

---

## Critical Rules

1. **NO UNSPLASH / STOCK PHOTOS anywhere.** Use CSS gradients, abstract shapes, patterns, and icons instead.
2. **The logo horse MUST be red-outlined** (stroke="#800000", fill="none") on white backgrounds.
3. **Typography must be system fonts only** — no Google Fonts (causes build failures).
4. **All colors must have exact hex codes** — no "light gray" or "dark blue" descriptions.
5. **All spacing must have exact pixel values** — no "medium gap" descriptions.
6. **The maroon brand color (#800000) must be integrated** — either as the primary accent or as a strong secondary. Do NOT discard it.
7. **Dark mode first** — the platform is dark-themed. The only white/light element is the landing page header.
8. **Mobile responsive** — specify how every section changes at 768px and 1024px breakpoints.

---

## How to Deliver

After analyzing the Dribbble screenshots, write all 4 files in the exact locations above. Use markdown tables for token values. Be extremely precise — Kimi will copy hex codes and pixel values directly into Tailwind classes.

If a design element from Dribbble conflicts with an existing Hotels Vendors requirement (e.g., the Dribbble uses purple but our brand is maroon), **adapt the Dribbble design to use maroon** and note the adaptation.
