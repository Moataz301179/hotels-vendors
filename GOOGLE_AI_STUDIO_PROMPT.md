# Hotels Vendors — Complete UI/UX Generation Prompt for Google AI Studio

> **Purpose:** Generate a complete, production-ready React/Next.js frontend for a B2B hotel procurement marketplace. Every component must integrate with the existing backend API and respect the design system, RBAC, and multi-tenant architecture.
>
> **Output Format:** TypeScript React components using Next.js App Router, Tailwind CSS v4, Radix UI primitives, and shadcn/ui patterns.

---

## 1. BRAND IDENTITY & VISION

**Name:** Hotels Vendors  
**Tagline:** "Egypt's Digital Procurement Hub for Hospitality"  
**Arabic:** "موردين الفنادق — منصة المشتريات الرقمية للضيافة"  

**Brand Narrative:**  
We are not a generic B2B marketplace. We are a **vertical procurement platform purpose-built for Egyptian hospitality**. Every pixel, every interaction, every data table must scream: "This is a professional procurement tool, not a consumer shopping app."

**Personality:**
- **Tone:** Authoritative, precise, institutional-grade
- **Energy:** Calm confidence, not hype
- **Trust signals:** Certifications, verified badges, audit trails, ETA compliance marks

**Logo:** Knight chess piece (transparent PNG), symbolizing strategic positioning and protection.

---

## 2. BUSINESS MODEL & ACTORS

The platform connects **four actor types** in a four-sided marketplace:

| Actor | Role | Primary Actions |
|---|---|---|
| **Hotels** (Buyers) | Procurement managers, GMs, CFOs | Browse catalog, build POs, track orders, analyze spend, manage multi-property chains |
| **Suppliers** (Sellers) | Manufacturers, distributors, importers | Upload catalogs, manage inventory, fulfill orders, apply for factoring |
| **Logistics Providers** | Courier companies, freight forwarders, dry ports | Accept delivery jobs, optimize routes, track shipments |
| **Factoring Companies** | Banks, NBFCs, trade finance firms | Assess credit risk, purchase receivables, provide liquidity |

**Plus Platform Infrastructure:**
- **ETA E-Invoicing Engine** — invisible compliance backbone
- **Authority Matrix Engine** — multi-level approval governance

---

## 3. DESIGN SYSTEM (NON-NEGOTIABLE)

### 3.1 Theme: Dark Mode Glassmorphism

This is a **B2B fintech dashboard**, not a consumer app. The visual language must convey:
- Professionalism and trust
- Density and efficiency
- Financial precision

**CRITICAL:** Do NOT use neon colors, gradient backgrounds, or playful animations. This is procurement software used by CFOs and procurement managers.

### 3.2 Color Tokens

```css
/* Root dark theme */
--bg-primary: #04040a;        /* Deep void black */
--bg-panel: rgba(0,0,0,0.55);  /* Translucent panels */
--bg-elevated: rgba(255,255,255,0.03);

--border-default: rgba(255,255,255,0.06);
--border-hover: rgba(255,255,255,0.12);
--border-active: rgba(255,255,255,0.20);

--text-primary: #e2e2f0;      /* Off-white, easy on eyes */
--text-secondary: #8888a0;    /* Muted gray-purple */
--text-tertiary: #555570;     /* Very muted */

--accent-primary: #bf5af2;    /* Brand purple (derived from knight logo) */
--accent-primary-rgb: 191, 90, 242;
--accent-glow: rgba(191, 90, 242, 0.15);

--success: #00e676;
--warning: #ffaa00;
--danger: #ff4444;
--info: #00c8ff;

/* Glassmorphism card */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
}

/* Glassmorphism panel */
.glass-panel {
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
}
```

### 3.3 Typography

```css
/* Font stack */
--font-display: 'Jakarta Sans', sans-serif;  /* Headings */
--font-body: 'Inter', sans-serif;                  /* Body text */
--font-mono: 'JetBrains Mono', monospace;          /* Data, codes, timestamps */

/* Scale */
--text-xs: 11px;    /* Labels, badges */
--text-sm: 13px;    /* Secondary text */
--text-base: 14px;  /* Body (dense B2B interface) */
--text-lg: 16px;    /* Subheadings */
--text-xl: 20px;    /* Section titles */
--text-2xl: 24px;   /* Page titles */
--text-3xl: 32px;   /* Hero headlines */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 3.4 Spacing Scale

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

### 3.5 Component Primitives

**Button variants:**
```tsx
// Primary — for main actions
<button className="bg-[#bf5af2] hover:bg-[#a848d9] text-white px-4 py-2 rounded-lg font-medium transition-colors">

// Secondary — for supporting actions
<button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg font-medium transition-colors">

// Ghost — for subtle actions
<button className="text-white/60 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-lg text-sm transition-colors">

// Danger — for destructive actions
<button className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg font-medium transition-colors">
```

**Input fields:**
```tsx
<input className="bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[#bf5af2]/50 focus:outline-none focus:ring-1 focus:ring-[#bf5af2]/20 text-sm" />
```

**Data tables (PRIMARY UI PATTERN):**
```tsx
// Tables are the primary content pattern. Every dashboard uses tables.
<table className="w-full text-sm">
  <thead className="border-b border-white/10">
    <tr className="text-white/50 text-xs uppercase tracking-wider">
      <th className="text-left py-3 px-4 font-medium">Column</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-white/5">
    <tr className="hover:bg-white/[0.02] transition-colors">
      <td className="py-3 px-4 text-white/80">Value</td>
    </tr>
  </tbody>
</table>
```

**Status badges:**
```tsx
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
  Active
</span>
// Variants: green (active/approved), amber (pending), red (rejected/failed), blue (in-progress), purple (special)
```

---

## 4. PAGE INVENTORY

### 4.1 Marketing Site (Public — `app/(marketing)/`)

#### **Homepage (`/`)**
- **Hero section:** Full-width dark background with subtle animated gradient mesh (purple/blue, very subtle). Headline: "The Procurement Hub Egyptian Hotels Trust." Subheadline about vertical focus, ETA compliance, embedded factoring. CTA: "Join Beta" + "Explore Suppliers".
- **Live product grid:** 8-12 real products from the catalog with images, prices, supplier names. Clicking goes to `/marketplace/[id]`.
- **Actor cards:** 4 cards showing Hotels, Suppliers, Logistics, Factoring with icons and one-line value props.
- **Trust bar:** Logos of partner/certification bodies (ETA, etc.).
- **Stats section:** "500+ Suppliers", "200+ Hotels", "EGP 45M+ Monthly GMV" (use real data from `/api/v1/admin/pulse`).
- **Testimonials:** 3 hotel procurement manager quotes with photos.
- **CTA section:** "Ready to Transform Your Procurement?" with email capture.
- **Footer:** Links, social, Arabic/EN toggle, ETA compliance badge.

#### **About (`/about`)**
- Company story, team, mission, vision
- The Shark-Breaker model explanation
- Market data: $21.54B Egyptian hospitality, 7.12% CAGR

#### **Pricing (`/pricing`)**
- 3 tiers: Core (2.5%), Premier (2.0%), Coastal (1.5%)
- Feature comparison table
- "Storage-to-Revenue" calculator (interactive)
- CTA: "Schedule Demo"

#### **Solutions (`/solutions`)**
- Hotel Procurement Portal
- Supplier Central
- Logistics Network
- Factoring Marketplace
- Each with screenshot mockup + feature list

#### **Blog (`/blog`)**
- CMS-driven from `/api/v1/cms/posts`
- Card grid layout
- Category filters

### 4.2 Authentication (Public — `app/(auth)/`)

#### **Login (`/login`)**
- Email + password
- "Forgot password?" link
- Role selector if user has multiple roles (rare)
- Background: subtle abstract geometric pattern

#### **Register Hotel (`/register/hotel`)**
- Multi-step form (4 steps):
  1. Hotel info (name, chain, star rating, room count)
  2. Contact info (email, phone, address)
  3. Property setup (single vs multi-property)
  4. Credit application (optional)
- Progress indicator at top
- Each step validates before advancing

#### **Register Supplier (`/register/supplier`)**
- Multi-step form (5 steps):
  1. Company info (name, CR number, tax ID)
  2. Contact info
  3. Categories (F&B, Housekeeping, FF&E, etc.)
  4. Document upload (CR, tax card, commercial license)
  5. Catalog preview
- Document upload with drag-and-drop
- Upload progress indicators

### 4.3 Hotel Dashboard (Private — `app/(dashboard)/hotel/`)

#### **Hotel Home (`/hotel`)**
- **Welcome header:** Hotel name, property selector (if multi-property), notification bell
- **Quick stats row:** 4 glass cards — Open Orders, Monthly Spend, Active Suppliers, Pending Approvals
- **Reorder alerts:** "You're running low on [product]. Last ordered [date]." with one-click reorder
- **Recent orders table:** Last 5 orders with status badges
- **AI Assistant panel:** Collapsible chat widget (bottom-right) with role-specific prompts

#### **Catalog (`/hotel/catalog`)**
- **Search bar:** Full-text search with autocomplete
- **Category sidebar:** F&B, Consumables, Guest Supplies, FF&E, Services, Engineering, Amenities, Capital Equipment
- **Filter panel:** Price range, MOQ, delivery zone, certification, supplier tier, in-stock only
- **Product grid/table toggle:** Grid view (cards) vs Table view (dense data)
- **Product cards:** Image, name, supplier, price, MOQ, lead time, certification badges, "Add to PO" button
- **Pagination:** 24 items per page

#### **Product Detail (`/hotel/catalog/[id]`) — CRITICAL MISSING PAGE**
- **Hero section:** Large product image, name, supplier name + verified badge, star rating
- **Price section:** Unit price, volume pricing tiers (1-10: EGP X, 11-50: EGP Y, 51+: EGP Z), MOQ, lead time
- **Specs panel:** Technical specifications table
- **Certifications:** ETA, ISO, Halal, etc. with document preview
- **Supplier card:** Supplier info, trust score, other products from this supplier
- **Actions:** "Add to PO" (quantity selector), "Request Quote" (RFQ), "Compare" (add to comparison list)
- **Related products:** 4 similar items
- **Reviews:** Hotel ratings and comments

#### **Purchase Order Builder (`/hotel/order`)**
- **PO header:** Hotel, property, delivery address, requested delivery date
- **Line items table:** Product, qty, unit price, total, notes, delete
- **Add item:** Search modal for catalog products
- **Totals:** Subtotal, VAT, delivery fee, platform fee (transparent), total
- **Approval preview:** Shows who will need to approve based on Authority Matrix
- **Submit button:** "Submit for Approval" (not direct order)

#### **Orders (`/hotel/orders`)**
- **Status tabs:** All, Pending Approval, Approved, Confirmed, In Transit, Delivered, Cancelled
- **Orders table:** ID, date, supplier, items count, total, status, actions
- **Order detail drawer:** Slide-out panel with full order info, timeline, documents

#### **Invoices (`/hotel/invoices`)**
- **Table:** Invoice #, order ref, date, amount, status, ETA UUID, download
- **Filter by:** Date range, supplier, status

#### **Analytics (`/hotel/analytics`)**
- **Spend overview:** Line chart (monthly spend, 12 months)
- **Category breakdown:** Donut chart (% by category)
- **Supplier performance:** Table (orders, on-time %, quality rating, total spend)
- **Savings report:** "You saved EGP X vs market rates this month"
- **TCP Report:** Total Cost of Procurement breakdown

#### **Properties (`/hotel/properties`)**
- **Property cards:** For multi-property hotels
- Each card: name, address, GM, spend YTD, active orders
- "Add Property" button

### 4.4 Supplier Dashboard (Private — `app/(dashboard)/supplier/`)

#### **Supplier Home (`/supplier`)**
- **Stats:** Active orders, monthly revenue, catalog items, trust score
- **Order alerts:** New orders requiring confirmation
- **Low stock alerts:** Products below reorder threshold
- **Recent orders table**

#### **Products (`/supplier/products`)**
- **Product table:** Image, SKU, name, category, price, stock, status
- **Bulk actions:** Update prices, update stock, activate/deactivate
- **Add product:** Modal with full form (name, description, category, price, MOQ, lead time, images, certifications, specs)
- **Import:** CSV upload for bulk product creation

#### **Orders (`/supplier/orders`)**
- **Incoming orders table:** Hotel, products, qty, total, status, actions
- **Actions:** Confirm, reject (with reason), request changes
- **Order detail:** Full PO view with hotel info

#### **Analytics (`/supplier/analytics`)**
- **Revenue trends:** Monthly revenue chart
- **Top products:** Best-selling SKUs
- **Hotel customers:** Repeat customer analysis
- **Demand forecast:** AI-generated reorder suggestions

#### **Compliance (`/supplier/compliance`)**
- **ETA status:** E-Invoicing registration status
- **Documents:** CR, tax card, licenses with expiry dates
- **Certifications:** ISO, Halal, etc.
- **Trust score:** Breakdown of how score is calculated

### 4.5 Admin Dashboard (Private — `app/(dashboard)/admin/`)

#### **Admin Home (`/admin`)**
- **Platform pulse:** Total hotels, suppliers, orders, monthly GMV, active users
- **Revenue chart:** Platform fee revenue over time
- **Recent signups:** Hotels and suppliers pending approval
- **Swarm status panel:** Active agents, recent jobs, health metrics (links to `/admin/swarm`)

#### **Swarm Command Center (`/admin/swarm`) — ALREADY EXISTS, ENHANCE**
- **🎯 Orchestrate tab:** Input field for task description, "Dispatch Swarm" button
- **Agent grid:** All 28 agents with avatars, squads, status, trigger button
- **Job queue:** Real-time job table with status, progress, approve/retry
- **Health metrics:** Success rate, model health, events by severity
- **Battle plans:** Director's daily plans with initiatives

#### **Users (`/admin/users`)**
- **User table:** Name, email, role, tenant, status, last active
- **Actions:** Edit role, deactivate, impersonate

#### **Suppliers (`/admin/suppliers`)**
- **Approval queue:** Suppliers pending verification
- **Verified suppliers table**
- **Actions:** Approve, reject, request docs, view profile

#### **Hotels (`/admin/hotels`)**
- **Hotel table:** Name, chain, properties, GMV, status
- **Actions:** View profile, manage credit limit

### 4.6 Marketplace (Public/Private Hybrid — `/marketplace`)

#### **Marketplace Home (`/marketplace`)**
- **Hero search:** Large search bar with voice search icon
- **Category grid:** 8 categories with icons
- **Featured suppliers:** Carousel of verified suppliers
- **Trending products:** Grid of popular items
- **Premium section:** Sponsored listings

#### **Product Page (`/marketplace/[id]`)**
- Same as `/hotel/catalog/[id]` but public-facing
- "Request Access" CTA for non-logged-in users
- Supplier info card

### 4.7 Factoring Portal (Private — `app/(dashboard)/factoring/`)

#### **Portfolio (`/factoring`)**
- **Portfolio overview:** Total receivables, yield, risk distribution
- **Opportunities table:** Supplier invoices available for purchase
- **Risk assessment:** AI-generated risk scores

#### **Deal Room (`/factoring/deals`)**
- **Invoice detail:** Amount, supplier, hotel, payment terms, risk score
- **Actions:** Purchase, counter-offer, decline

---

## 5. CRITICAL UI PATTERNS

### 5.1 Glassmorphism Cards

Every content container uses this exact pattern:
```tsx
<div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl p-6">
  {/* content */}
</div>
```

### 5.2 Data Tables (Primary Pattern)

B2B users need density. Tables are primary, cards are secondary.
- Striped rows (subtle)
- Hover state on rows
- Sortable headers
- Inline actions (dropdown menu)
- Pagination with page size selector
- Export to CSV button

### 5.3 Modal/Drawer System

- **Drawers (slide-out):** For detail views, filters, forms that need context
- **Modals (center overlay):** For confirmations, quick edits, alerts
- **Backdrop:** `bg-black/60 backdrop-blur-sm`
- **Animation:** 200ms ease-out slide/fade

### 5.4 Toast Notifications

```tsx
// Success
<div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg flex items-center gap-2">
  <CheckIcon className="w-4 h-4" />
  <span>Order submitted successfully</span>
</div>

// Error
<div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
  <XIcon className="w-4 h-4" />
  <span>Failed to submit order</span>
</div>
```

### 5.5 Loading States

- **Skeleton screens:** For tables and grids (not spinners)
- **Button loading:** Spinner inside button, disabled state
- **Page transitions:** Fade + slight upward slide

### 5.6 Empty States

Every table/list must have an empty state:
- Icon (relevant to content type)
- Headline: "No orders yet"
- Subtext: "Create your first purchase order to get started"
- CTA button if applicable

---

## 6. RESPONSIVE BREAKPOINTS

```css
/* Mobile-first */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops — TABLES SWITCH TO CARDS BELOW THIS */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

**Mobile rules:**
- Tables become card lists below `lg`
- Sidebar becomes bottom nav or hamburger menu
- Multi-column forms become single column
- Modals become bottom sheets
- Touch targets minimum 44px

---

## 7. INTEGRATION REQUIREMENTS

### 7.1 API Integration

All data comes from `/api/v1/` endpoints. Use React Server Components where possible, client fetching only for:
- Real-time updates
- User interactions (forms, buttons)
- Infinite scroll

**Required fetch wrapper:**
```tsx
async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`/api/v1${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

### 7.2 RBAC Integration

**NO client-side role switching.** The server renders UI based on permissions.

```tsx
// Server component pattern
import { requirePermission } from "@/lib/auth/rbac";

export default async function Page() {
  const auth = await getAuthContext();
  await requirePermission(auth, "hotel:view_catalog");
  // Render page
}
```

**Permission codes to use:**
- `hotel:view_catalog`, `hotel:create_order`, `hotel:view_analytics`
- `supplier:manage_products`, `supplier:view_orders`, `supplier:view_analytics`
- `factoring:view_portfolio`, `factoring:manage_deals`
- `admin:manage_platform`, `admin:manage_users`, `admin:view_analytics`

### 7.3 Tenant Isolation

Every query must include `tenantId`. The server extracts this from the session.

### 7.4 ETA Integration (Invisible)

- **NO UI for ETA submission.** It happens automatically when invoice.status = "ISSUED".
- Invoices show "ETA Status" badge: Pending → Submitted → Validated → Failed (with retry button for admin)

### 7.5 File Upload

```tsx
// Drag and drop upload component
<div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#bf5af2]/30 transition-colors">
  <UploadIcon className="w-8 h-8 text-white/30 mx-auto mb-3" />
  <p className="text-white/60 text-sm">Drag files here or click to browse</p>
  <p className="text-white/30 text-xs mt-1">PDF, JPG, PNG up to 10MB</p>
</div>
```

### 7.6 Real-time Updates

Use Server-Sent Events (SSE) or polling for:
- Order status changes
- New notifications
- Swarm job progress

---

## 8. ACCESSIBILITY (WCAG 2.2 AA)

- All interactive elements must have `:focus-visible` styles
- Color contrast ratio minimum 4.5:1 for text
- All images have alt text
- Form inputs have associated labels
- Tables have `<caption>` or `aria-label`
- Keyboard navigation for all features
- ARIA live regions for dynamic content
- Skip-to-content link

---

## 9. SEO REQUIREMENTS

### 9.1 Metadata

Every page must export metadata:
```tsx
export const metadata = {
  title: "Hotel Procurement Portal | Hotels Vendors",
  description: "Browse verified suppliers, compare prices, and streamline your hotel's procurement process.",
  keywords: ["hotel procurement", "hospitality suppliers Egypt", "B2B hotel sourcing"],
  openGraph: {
    title: "...",
    description: "...",
    images: ["/og-image.jpg"],
  },
};
```

### 9.2 Structured Data

Add JSON-LD to marketing pages:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Hotels Vendors",
  "description": "Egypt's B2B procurement platform for hospitality",
  "url": "https://hotelsvendors.com",
  "logo": "https://hotelsvendors.com/logo.png"
}
```

### 9.3 Arabic Support

- All text must be RTL-ready
- Use logical CSS properties (`inline-start`, `block-start`)
- Arabic font: "Cairo" or "Tajawal"
- Language toggle in header/footer

---

## 10. ANIMATION & MICRO-INTERACTIONS

**Allowed:**
- Subtle hover transitions (150-200ms)
- Fade-in on page load (200ms)
- Slide-in for drawers (250ms)
- Skeleton pulse animation
- Progress bar animations

**Forbidden:**
- Parallax scrolling
- Heavy particle effects
- Animated gradients as backgrounds
- Bouncy/spring animations
- Anything that distracts from data

---

## 11. ERROR HANDLING

### 11.1 Error Pages

**404:**
- Minimal design, large "404" in mono font
- "This page doesn't exist"
- "Go back" and "Home" buttons

**500:**
- "Something went wrong"
- Error ID for support
- "Refresh page" button
- Contact support link

### 11.2 API Error Handling

```tsx
// Global error boundary pattern
// Show toast notification
// Log to Sentry (if configured)
// Allow retry for transient errors
```

---

## 12. PERFORMANCE BUDGET

| Metric | Target | Max |
|---|---|---|
| First Contentful Paint (FCP) | < 1.0s | 1.5s |
| Largest Contentful Paint (LCP) | < 2.0s | 2.5s |
| Time to Interactive (TTI) | < 3.0s | 4.0s |
| Cumulative Layout Shift (CLS) | < 0.05 | 0.1 |
| Total Page Weight | < 1MB | 2MB |
| JavaScript Bundle | < 200KB | 300KB |

**Techniques:**
- Image optimization: WebP/AVIF, lazy loading, blur placeholder
- Font subsetting: Only load needed weights
- Code splitting: Route-level and component-level
- `next/font` for font optimization

---

## 13. DELIVERABLES CHECKLIST

Generate these in order:

1. [ ] **Design tokens file** (`app/globals.css` with all tokens)
2. [ ] **Layout components** (dashboard shell, sidebar, header, mobile nav)
3. [ ] **Auth pages** (login, register hotel, register supplier)
4. [ ] **Marketing pages** (home, about, pricing, solutions)
5. [ ] **Hotel dashboard** (home, catalog, product detail, PO builder, orders, analytics)
6. [ ] **Supplier dashboard** (home, products, orders, analytics, compliance)
7. [ ] **Admin dashboard** (home, swarm, users, suppliers, hotels)
8. [ ] **Marketplace** (home, product page)
9. [ ] **Shared components** (data-table, stat-card, filter-panel, upload-dropzone, ai-chat-widget)
10. [ ] **Error pages** (404, 500, loading, empty states)

---

## 14. SWARM INTEGRATION

The platform includes an **AI Swarm** with 28 specialized agents. The UI must include:

### 14.1 Smart Assistant Widget

```tsx
// Floating chat widget (bottom-right corner)
// - Collapsible
// - Role-specific prompts based on current dashboard
// - Uses Vercel AI SDK
// - Context scoped to user's tenant
```

### 14.2 Swarm Status Indicators

In the admin dashboard:
- Real-time agent status (online/offline)
- Job queue depth
- Model health (Ollama, Groq, OpenRouter)
- Recent events feed

---

## 15. IMPORTANT NOTES FOR AI GENERATION

1. **Do NOT use `src/app/`** — all pages go in root `app/`
2. **Use route groups:** `(marketing)/`, `(auth)/`, `(dashboard)/`
3. **All API routes under `app/api/v1/`**
4. **TypeScript strict mode enabled** — no `any` types
5. **Zod validation** on all form inputs
6. **NO client-side secrets** — env vars only in server components
7. **shadcn/ui primitives** in `components/ui/`
8. **Role-specific dashboards** in `components/dashboards/[role]/`
9. **Pure presentational components** — business logic in server actions
10. **File naming:** kebab-case files, PascalCase components

---

## 16. EXAMPLE COMPONENT STRUCTURE

```tsx
// components/dashboards/hotel/product-detail.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/shared/quantity-selector";
import { TrustScore } from "@/components/shared/trust-score";
import type { Product } from "@/lib/types";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(product.moq);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="aspect-square bg-white/[0.03] rounded-xl overflow-hidden border border-white/[0.08]">
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
        </div>
        {/* Thumbnails */}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="verified">Verified Supplier</Badge>
            {product.certifications.map(c => (
              <Badge key={c.id} variant="certification">{c.name}</Badge>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-white">{product.name}</h1>
          <p className="text-white/50 mt-1">{product.supplier.name}</p>
        </div>

        {/* Pricing */}
        <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.08]">
          <div className="text-3xl font-bold text-white">
            EGP {product.price.toLocaleString()}
            <span className="text-sm font-normal text-white/50"> / unit</span>
          </div>
          <div className="mt-3 space-y-2">
            {product.volumePricing.map(tier => (
              <div key={tier.minQty} className="flex justify-between text-sm">
                <span className="text-white/60">{tier.minQty}-{tier.maxQty} units</span>
                <span className="text-white">EGP {tier.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MOQ & Lead Time */}
        <div className="flex gap-4">
          <div className="flex-1 bg-white/[0.03] rounded-xl p-4 border border-white/[0.08]">
            <div className="text-xs text-white/50 uppercase tracking-wider">MOQ</div>
            <div className="text-lg font-semibold text-white">{product.moq} units</div>
          </div>
          <div className="flex-1 bg-white/[0.03] rounded-xl p-4 border border-white/[0.08]">
            <div className="text-xs text-white/50 uppercase tracking-wider">Lead Time</div>
            <div className="text-lg font-semibold text-white">{product.leadTime} days</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <QuantitySelector value={quantity} onChange={setQuantity} min={product.moq} />
          <Button className="flex-1 bg-[#bf5af2] hover:bg-[#a848d9]">
            Add to Purchase Order
          </Button>
          <Button variant="secondary">Request Quote</Button>
        </div>
      </div>
    </div>
  );
}
```

---

**END OF PROMPT**

> Paste this entire file into Google AI Studio as the system prompt or context document. Then request: "Generate the complete Hotels Vendors frontend following this specification. Start with the design tokens and layout components, then build each dashboard role."
