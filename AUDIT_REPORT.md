# Hotels Vendors — Comprehensive Platform Quality Audit

> **Auditor:** Senior Platform Quality Auditor (B2B Fintech / Marketplace Specialist)  
> **Date:** 2026-05-01  
> **Codebase Version:** Commit range pre-audit (`0.1.0` manifest)  
> **Scope:** Full-stack Next.js 16 App Router application  

---

## Executive Summary

**Verdict: This is a well-designed CRUD admin panel masquerading as a B2B marketplace. The gap between the ambition ("Amazon of Egyptian Hospitality") and the implementation is enormous.**

The codebase has a solid foundational schema and a polished dark-mode UI shell. However, it lacks the four critical pillars of a production B2B fintech marketplace: **authentication, transaction security, compliance integration, and business workflow enforcement**. The developer has been iterating on surface-level features (dashboard widgets, landing page animations, AI-simulation pages) while ignoring the foundational infrastructure required to move money, enforce credit limits, and comply with Egyptian tax law.

**Risk Level: CRITICAL** — The current codebase cannot be shown to investors as a "functional platform" without major disclaimers. The ETA e-invoicing implementation is a UI demo with zero backend integration, and the order API will accept a 10-million-EGP order from any unauthenticated caller without checking credit limits.

---

## 1. ARCHITECTURE & SECURITY

### 1.1 Authentication: ABSENT — Unacceptable for Any Environment

**Finding:** There is no authentication system. None.

- `passwordHash` exists on the `User` model but is never populated by the seed, never validated by any API, and never used by any route.
- `bcryptjs` is in `package.json` but is not imported anywhere in the codebase.
- The `RoleProvider` in `components/app/role-context.tsx` stores the active role in `localStorage` and filters the sidebar navigation client-side. This is purely cosmetic — changing `localStorage.setItem('hv_role', 'ADMIN')` and refreshing grants full UI access.
- **There is no `middleware.ts` file.** No API route checks who the caller is.

**Impact:** Any attacker with `curl` can read all hotels, suppliers, tax IDs, bank accounts, invoices, and journal entries. Any attacker can create, update, or delete orders, invoices, and users.

**Recommendation:**
- Implement NextAuth.js v5 (Auth.js) with credentials provider for MVP, or integrate with Egyptian identity providers (Nafath) for production.
- Add a `middleware.ts` that validates JWT/session on every `/api/*` and `/(app)/*` route.
- Replace `localStorage` role switching with server-side session claims.
- Add row-level security: a hotel user should only see their own hotel's orders, invoices, and users.

### 1.2 API Security: Open by Design

**Finding:** Every single API route is completely unprotected.

- **No rate limiting:** An attacker can hammer `/api/orders` or `/api/invoices` indefinitely.
- **No CORS configuration:** The API will respond to requests from any origin.
- **No input sanitization beyond Zod:** While Zod schemas prevent malformed data, they do not prevent business logic abuse (e.g., creating an order for EGP 1 billion).
- **No idempotency keys:** The `/api/orders/approve` and `/api/invoices/pay` endpoints can be double-submitted, creating duplicate journal entries.
- **No API versioning:** The `/api/route.ts` manifest shows `v0.1.0` but endpoints are not versioned.

**Impact:** DDoS vulnerability, duplicate financial transactions, cross-origin data exfiltration.

**Recommendation:**
- Add `rate-limiter-flexible` or Upstash Redis rate limiting on all mutation endpoints.
- Configure strict CORS in `next.config.ts`.
- Add idempotency keys to all financial endpoints (`/api/orders/approve`, `/api/invoices/pay`).
- Implement API versioning (`/api/v1/...`).

### 1.3 Data Model: Comprehensive Schema, Shallow Enforcement

**Finding:** The Prisma schema (`prisma/schema.prisma`) is surprisingly well-designed for an MVP. It includes:

- `Hotel` with `creditLimit` and `creditUsed`
- `Invoice` with `factoringStatus`, `factoringAmount`, `etaUuid`, `digitalSignature`
- `AuthorityRule` with role-based thresholds
- `AuditLog` with immutable before/after state
- `Property` for multi-property chains
- `DeliveryZone` for supplier coverage

**However, critical enforcement is missing:**
- `creditUsed` is never incremented when an order is created.
- `factoringCompanyId` on `Invoice` references nothing — there is no `FactoringCompany` model.
- `OrderApproval` records who approved, but the authority check API (`/api/authority/check`) returns a recommendation; it does not block unauthorized approvals.
- There is no `Payment` model, no `CreditTransaction` model, no `ShippingHub` model.
- The `User` model has a `platformRole` enum (HOTEL, SUPPLIER, FACTORING, SHIPPING, ADMIN) but no foreign key to `Supplier` — a supplier user is just a `User` with `platformRole: "SUPPLIER"` and a `hotelId` pointing to a random hotel. This is architecturally broken.

**Recommendation:**
- Add a `FactoringCompany` model and proper relations.
- Add a `CreditTransaction` model to track credit drawdowns and repayments.
- Add a `Payment` model to track real payment attempts (not just `paymentStatus` enum flips).
- Fix supplier user modeling: either add `supplierId` to `User` or create a separate `SupplierUser` model.
- Enforce `creditUsed <= creditLimit` in the order creation transaction.

### 1.4 SQL Injection Risk: LOW (Prisma Protects You)

**Finding:** All database queries use Prisma's typed ORM. No raw SQL exists in the codebase.

**Verdict:** Safe from SQL injection, but this is the only security win.

### 1.5 PII Handling: SEVERE GAPS

**Finding:** Sensitive business and personal data is stored in plaintext:

- `Hotel.taxId` — Egyptian Tax Registration Number (plaintext, no encryption)
- `Supplier.taxId` — same
- `Supplier.bankAccount` — bank account number (plaintext)
- `Supplier.bankName` — plaintext
- `User.email` — plaintext (though unique index is appropriate)
- `User.phone` — plaintext

**There is no encryption at rest.** The SQLite `.db` file on disk contains fully readable bank accounts and tax IDs.

**Recommendation:**
- Encrypt `taxId` and `bankAccount` at the application layer using AES-256-GCM before storing.
- Use field-level decryption only when needed (e.g., for ETA submission).
- Add database-level access controls when migrating to PostgreSQL.
- Implement data retention policies and GDPR/Egyptian data privacy compliance.

---

## 2. BUSINESS LOGIC GAPS

### 2.1 The Core Problem: This Is Not a Marketplace

The current application is a **CRUD data viewer with role-based navigation**. A B2B marketplace requires:

1. **Buyer discovers products** → Search, compare, add to cart
2. **Buyer builds a purchase order** → Multi-SKU, multi-property, with budget checks
3. **Platform enforces governance** → Authority matrix blocks overspend
4. **Seller fulfills order** → Pick, pack, ship, confirm delivery
5. **Platform generates invoice** → ETA-compliant, digitally signed
6. **Payment/factoring settles** → Money moves between parties
7. **Platform takes a fee** → Revenue recognition

The current app implements steps 1 and 2 as **read-only tables**, skips step 3 entirely, implements step 4 as a status dropdown, implements step 5 as a **random hex generator**, and skips steps 6 and 7 completely.

### 2.2 Shopping Cart / Bulk Order Builder: MISSING

**Finding:** There is no cart. There is no "Add to Cart" button. The Catalog page (`app/(app)/catalog/page.tsx`) displays products in a grid with prices, but there is no way to add items to an order from the UI. Orders can only be created by POSTing raw JSON to `/api/orders`.

**Impact:** A procurement officer cannot use this platform to build an order.

**Recommendation:**
- Build a persistent cart (React Context + localStorage for MVP, database-backed for production).
- Support multi-supplier carts with split POs.
- Support multi-property distribution (one cart, quantities per property).
- Show running subtotal, VAT, and credit impact in real time.

### 2.3 RFQ (Request for Quote): MISSING

**Finding:** There is no RFQ system. The business model specifies "fixed-price catalogs," but B2B procurement still requires custom quotes for large volumes, FF&E, and services.

**Recommendation:**
- Add an `Rfq` model with status workflow: `DRAFT` → `SUBMITTED` → `QUOTED` → `ACCEPTED` → `CONVERTED_TO_ORDER`.
- Allow hotels to request quotes from multiple suppliers simultaneously.
- Display quote comparisons side-by-side.

### 2.4 Supplier Onboarding Verification: SCHEMA ONLY

**Finding:** The `Supplier` model has `status: SupplierStatus` (PENDING, ACTIVE, SUSPENDED, REJECTED) and `certifications: String?`, but:

- There is no onboarding flow UI.
- There is no document upload (commercial registration, tax certificate, ISO certs).
- There is no verification workflow (admin review, automated ETA tax ID validation).
- Seed data creates suppliers directly as ACTIVE with fake certifications.

**Recommendation:**
- Build a multi-step supplier onboarding wizard.
- Add file upload infrastructure (S3/Cloudflare R2 + presigned URLs).
- Integrate ETA tax ID validation during onboarding.
- Add an admin verification queue UI.

### 2.5 Credit Limit Enforcement: COMPLETELY ABSENT

**Finding:** The `Order` creation API (`app/api/orders/route.ts`) calculates subtotal, VAT, and total, but **never checks `hotel.creditLimit` or `hotel.creditUsed`**.

```typescript
// Current code — no credit check
const order = await prisma.order.create({
  data: { ...orderData, subtotal, vatAmount, total, items: { create: items } }
});
```

**Impact:** A hotel can create unlimited orders regardless of their credit limit. The `creditUsed` field is decorative.

**Recommendation:**
- Wrap order creation in a Prisma transaction that:
  1. Locks the hotel row (`SELECT FOR UPDATE` equivalent).
  2. Checks `creditUsed + total <= creditLimit`.
  3. Creates the order.
  4. Increments `creditUsed`.
- Reject orders with a `402 Payment Required` or `403 Forbidden` response if credit is exceeded.
- Add a "Request Credit Increase" workflow.

### 2.6 Invoice Factoring Workflow: CONCEPTUAL ONLY

**Finding:** The schema has `factoringStatus` (NOT_FACTORABLE → AVAILABLE → OFFERED → ACCEPTED → PAID) and `factoringAmount`, but:

- There is no `FactoringCompany` model.
- There is no marketplace where factoring companies bid on invoices.
- There is no workflow for a supplier to "offer" an invoice for factoring.
- `/api/invoices/pay` simply flips `paymentStatus` to PAID with no actual payment processing.

**Recommendation:**
- Add a `FactoringCompany` model and `FactoringOffer` model.
- Build a factoring marketplace UI where companies see available invoices and submit bids (e.g., "97.2% of face value").
- Track the full workflow: invoice issued → available for factoring → offers received → offer accepted → factor pays supplier → hotel pays factor on due date.
- Integrate with actual payment rails (CIB, QNB, Fawry, etc.) or at least design the integration architecture.

### 2.7 Coastal Logistics (Shark-Breaker): NOT IMPLEMENTED

**Finding:** The `DeliveryZone` model exists but is not used in any order flow. There is no:

- Consolidation hub model (Shark-Breaker hubs).
- Route optimization logic.
- Seasonal delivery frequency (daily in high season, 3×/week in low season).
- Temperature-controlled lane logic for F&B.
- Real-time driver tracking.

**Recommendation:**
- Add `LogisticsHub` and `DeliveryRoute` models.
- Build a logistics dashboard for the SHIPPING role.
- Implement order batching by zone and delivery window.
- Add GPS tracking integration (or at least a simulated tracking UI for MVP).

### 2.8 Seasonal Demand Patterns: SIMULATED, NOT REAL

**Finding:** The AI Inventory page (`app/(app)/ai-inventory/page.tsx`) and API (`app/api/ai-inventory/route.ts`) generate "forecasts" using `Math.random()`:

```typescript
const noise = Math.round((Math.random() - 0.5) * base * 0.4);
```

This is not AI. It is not forecasting. It is random noise. The business context explicitly states seasonality (high season Oct-Apr, low season May-Sep) is critical for coastal hotels.

**Recommendation:**
- Replace random noise with a real forecasting model (even a simple moving average with seasonal multipliers would be better).
- Ingest occupancy data (manual input or PMS integration) to drive demand signals.
- Flag seasonal SKUs (e.g., pool chemicals peak in April, seafood peaks in December).

---

## 3. DESIGN & UX

### 3.1 Design Density: Too Dense for Operational Users

**Finding:** The entire app uses extremely small typography:
- Table text: `11px`
- Badge/pill text: `9px`–`10px`
- KPI labels: `9px` uppercase
- Sidebar links: `11px`

**Impact:** Procurement officers, warehouse managers, and receiving clerks often work in brightly lit environments, on lower-resolution screens, or with presbyopia. 9px text is illegible for many operational workers. The dark theme with red accents may look sleek but causes eye strain during 8-hour shifts.

**Recommendation:**
- Increase base table font to `13px` minimum.
- Add a "Compact / Comfortable" density toggle.
- Consider a light theme option for warehouse environments.
- Ensure all text meets WCAG 2.1 AA (4.5:1 contrast ratio). The current `foreground-muted` (`#9ca3af` on `#13161c`) is approximately 4.6:1 — barely passing. The `foreground-faint` (`#6b7280`) is approximately 3.2:1 — **failing WCAG AA**.

### 3.2 Missing Operational Patterns

**Finding:** The UI lacks patterns essential for high-volume B2B operations:

- **No bulk actions:** Users cannot select multiple orders and approve/reject/export them.
- **No quick view / side panel:** Clicking an order navigates to a separate page (which doesn't exist — `/orders/[id]` has no UI, only an API).
- **No command palette:** Power users cannot search and jump with `Cmd+K`.
- **No inline editing:** All edits require navigating to a form (which doesn't exist for most entities).
- **No data export:** The Accounting page has an "Export CSV" button that does nothing (`<button>` with no `onClick`).

**Recommendation:**
- Add checkboxes to all tables with bulk action toolbars.
- Build a slide-over panel for quick order/invoice preview.
- Implement a `cmdk` command palette for navigation and search.
- Add inline cell editing for simple fields (status, due date).
- Implement actual CSV/Excel export.

### 3.3 Mobile Responsiveness: BROKEN IN APP SHELL

**Finding:**
- The landing page (`app/page.tsx`) has a mobile hamburger menu and responsive grid.
- The app shell (`app/(app)/layout.tsx`) uses a **fixed 208px sidebar** (`ml-52`) with no collapse behavior.
- Tables overflow horizontally with no scroll indication.
- The header (`AppHeader`) assumes `left-52` spacing, which breaks on small screens.
- There is no responsive breakpoint that hides or collapses the sidebar.

**Impact:** The operational app is unusable on tablets and phones. Receiving clerks who work on phones in storage areas cannot use this.

**Recommendation:**
- Add a collapsible sidebar with a hamburger toggle.
- Use responsive table patterns (horizontal scroll with sticky first column, or card-based mobile tables).
- Ensure all touch targets are at least `44×44px` (currently many buttons are `24×24px`).

### 3.4 Accessibility Issues

**Finding:**
- No `aria-label` on icon-only buttons (approve/reject in dashboard).
- Tables lack `<th scope="col">`.
- The `RoleSwitcher` dropdown uses a custom implementation; ensure it supports keyboard navigation and `aria-expanded`.
- No skip-to-content link.
- No focus management on route changes.
- Color is used alone to convey status (the status badges have text, which is good, but the red/green stock indicators rely solely on color).

**Recommendation:**
- Run an axe DevTools scan and fix all violations.
- Add `aria-label` to every icon button.
- Implement a skip link.
- Ensure all status indicators have both color and text/icon.

### 3.5 Color Consistency & Brand

**Finding:**
- The brand is defined as "Grey + Red + White" in the design system.
- Functional colors (success=emerald, warning=amber, info=blue) are standard and acceptable.
- However, the **red brand color is used for both primary actions and danger states**, which is confusing. A "Submit" button and a "Delete" button should not share the same hue.

**Recommendation:**
- Reserve red (`brand-700`) for destructive actions and brand identity.
- Use a distinct primary action color (the current blue/cyan accent is fine, but be consistent).
- Document the color semantics in a design system guide.

---

## 4. COMPLIANCE (ETA E-INVOICING)

### 4.1 Current Implementation Status: UI DEMO ONLY

**Finding:** The ETA implementation is a **complete simulation** with no real integration:

- `/api/eta/route.ts` generates a fake UUID (`"eta-" + crypto.randomUUID()`) and a fake signature (64 random hex chars), then marks the invoice as `ACCEPTED`.
- The ETA Demo page (`app/eta-demo/page.tsx`) is a beautiful walkthrough with progress bars and simulated logs, but it calls no real API.
- There is no XML generation.
- There is no actual cryptographic signing.
- There is no connection to `eta.gov.eg`.
- The `digitalSignature` field in the schema is a plain `String?` with no validation.

**Impact:** If this platform processes real invoices and claims ETA compliance, it would be **tax fraud**. The Egyptian Tax Authority mandates real-time or near-real-time submission of digitally signed invoices.

### 4.2 What Is Needed for Full ETA Compliance

1. **ETA Sandbox Access:** Register for ETA developer credentials and obtain a PKCS#12 certificate for signing.
2. **UUID Generation (ETA-compliant):** The ETA uses a specific UUID v4 format. `crypto.randomUUID()` is close but must be validated against ETA specs.
3. **XML Invoice Format:** Generate invoices in the ETA-mandated XML schema (UBL 2.1 or Egyptian custom format).
4. **Digital Signing:** Use the supplier's ETA-registered certificate to create a CMS/PKCS#7 detached signature over the invoice XML. The current random hex string is not a signature.
5. **API Submission:** POST signed invoices to the ETA production or sandbox API.
6. **Callback Handling:** Implement webhook endpoints to receive ETA validation responses (accept/reject codes).
7. **Dead-Letter Queue:** Store failed submissions in a retry queue with exponential backoff. The demo shows this concept but there is no queue implementation.
8. **Audit Trail:** Every mutation (create, sign, submit, retry, resolve) must be logged immutably. The `AuditLog` model exists but is only populated by seed data.

**Recommendation:**
- Immediately label all ETA features as "DEMO — NOT PRODUCTION" in the UI.
- Obtain real ETA sandbox credentials.
- Build an `EtaSubmissionService` that handles XML generation, signing, and API submission.
- Add a background job processor (Bull MQ, Inngest, or at least a Vercel Cron) for retrying failed submissions.

---

## 5. SCALABILITY

### 5.1 SQLite → PostgreSQL Migration Path

**Finding:**
- The app uses `@prisma/adapter-better-sqlite3` with a local `dev.db` file.
- The schema is PostgreSQL-compatible (uses `@default(cuid())`, no SQLite-specific features).
- However, `prisma.config.ts` (not read in detail) and `lib/prisma.ts` are hardcoded to SQLite.

**Impact:** SQLite cannot handle concurrent writes from multiple app instances. It will corrupt under load.

**Recommendation:**
- Switch `datasource db` to `provider = "postgresql"` in production.
- Use environment-based configuration: `DATABASE_URL` should drive the provider.
- Add connection pooling (PgBouncer or Supabase pooling) immediately when switching to PostgreSQL.
- Run migration tests before production deployment.

### 5.2 Image Storage

**Finding:**
- Products have an `images` JSON string field.
- The catalog page attempts to parse it and falls back to a category initial.
- The supplier page uses hardcoded Unsplash URLs as placeholders.
- `next.config.ts` allows `images.unsplash.com`.

**Impact:** No real product imagery infrastructure exists.

**Recommendation:**
- Integrate S3/Cloudflare R2/Cloudinary for image storage.
- Implement image upload in the supplier catalog management UI.
- Add image optimization (WebP conversion, responsive sizes).

### 5.3 Search

**Finding:**
- All search is client-side string matching (`name.toLowerCase().includes(search.toLowerCase())`).
- The API supports `?search=` but passes it to Prisma `contains` with `mode: "insensitive"`, which does a full table scan (`LIKE '%term%'`).

**Impact:** With 10,000+ products, this will be unusable.

**Recommendation:**
- For MVP: Add Prisma full-text search (`_relevance` with PostgreSQL).
- For scale: Integrate Meilisearch or Algolia for instant, typo-tolerant search.
- Add search analytics to understand what buyers are looking for.

### 5.4 Real-Time Updates

**Finding:**
- Every page fetches data once on mount (`useEffect` + `fetch`).
- There is no polling, no WebSockets, no Server-Sent Events, no React Query/SWR caching.
- If a supplier updates an order status, the hotel buyer must refresh the page to see it.

**Recommendation:**
- Adopt TanStack Query (React Query) for caching, background refetching, and optimistic updates.
- Implement Server-Sent Events (SSE) or WebSockets for real-time order status updates.
- Add a notification bell with unread counts (currently a static red dot).

---

## 6. PRIORITIZED RECOMMENDATIONS

### P0 — CRITICAL (Block Any Production Use)

| # | Issue | Business Impact | Effort |
|---|-------|----------------|--------|
| 1 | **Implement Authentication & Authorization** | Without this, the platform is a public data breach waiting to happen. Hotels' tax IDs, supplier bank accounts, and invoice data are fully exposed. | Medium |
| 2 | **Enforce Credit Limits on Order Creation** | A hotel can bankrupt a supplier by ordering unlimited goods. The `creditUsed` field is decorative. | Low |
| 3 | **Label ETA Integration as DEMO Only** | Presenting the current mock as real ETA compliance is legally dangerous. Add prominent disclaimers. | Low |
| 4 | **Add API Rate Limiting & CORS** | Prevents DDoS and data scraping. Essential before any public demo. | Low |
| 5 | **Encrypt PII at Rest** | Tax IDs and bank accounts are stored in plaintext SQLite. Regulatory violation. | Medium |

### P1 — HIGH (Required for B2B Marketplace Viability)

| # | Issue | Business Impact | Effort |
|---|-------|----------------|--------|
| 6 | **Build Shopping Cart & Order Builder** | Procurement officers cannot use the platform without a way to build orders from the catalog. This is the core conversion flow. | High |
| 7 | **Build Supplier/Hotel Onboarding Workflows** | KYC, document upload, and verification are required for trust and compliance. | High |
| 8 | **Implement Server-Side Search** | Client-side search breaks above a few hundred products. | Medium |
| 9 | **Make App Shell Mobile-Responsive** | Receiving clerks and GMs use phones and tablets. The fixed sidebar makes the app unusable. | Medium |
| 10 | **Add Real-Time Notifications** | Orders, approvals, and deliveries require timely updates. Static pages force users to refresh manually. | Medium |

### P2 — MEDIUM (Competitive Differentiators)

| # | Issue | Business Impact | Effort |
|---|-------|----------------|--------|
| 11 | **Implement Real ETA API Integration** | Mandatory for legal operation in Egypt. Currently the biggest compliance gap. | High |
| 12 | **Build Factoring Marketplace Workflow** | Core monetization stream (2-4% spread). Currently conceptual only. | High |
| 13 | **Build Coastal Logistics Hub Model** | Key differentiator for Red Sea / North Coast properties. | High |
| 14 | **Replace Random Forecasts with Real Demand Model** | The "AI Inventory" page is misleading. Replace with seasonal baselines at minimum. | Medium |
| 15 | **Add Arabic RTL Support** | 60%+ of Egyptian hotel staff prefer Arabic. Critical for adoption. | Medium |

---

## Appendix A: Code Smells & Quick Fixes

1. **`app/api/orders/[id]/route.ts` — `PATCH` accepts any status string**  
   The `status` body field is passed directly to Prisma without validating it's a valid `OrderStatus`. Add Zod validation.

2. **`app/api/orders/approve/route.ts` — `approverId` is ignored**  
   The endpoint accepts `approverId` in the body but hardcodes `"system"` in the audit log. It also doesn't verify the approver has authority.

3. **`app/api/invoices/pay/route.ts` — No idempotency**  
   Calling this endpoint twice creates two identical journal entries (`JE-PAY-...`).

4. **`lib/prisma.ts` — Global variable type casting**  
   `globalThis as unknown as { prisma: PrismaClient | undefined }` is unnecessary. Use `declare global` properly.

5. **`components/app/role-context.tsx` — Full page reload on role switch**  
   `window.location.reload()` is a brute-force approach. Use React state and Next.js router for smoother transitions.

6. **`app/(app)/dashboard/page.tsx` — Hardcoded hotel ID**  
   `fetch("/api/hotels/cm00000000000000000000001/stats")` references a specific CUID. This will break with any other database.

7. **`app/api/ai-inventory/route.ts` — `Math.random()` presented as AI**  
   This is not a code smell; it is a product integrity issue. Either remove the "AI" branding or implement a real model.

---

## Appendix B: What Is Actually Working Well

Despite the critical gaps, several foundational pieces are solid:

1. **Prisma Schema Design:** The data model is well-normalized, uses appropriate enums, and covers most business entities. A fintech architect would be pleased with the schema as a starting point.
2. **Landing Page:** `app/page.tsx` is a polished, responsive marketing page with good SEO metadata, animated counters, and a clear value proposition.
3. **Design System:** `globals.css` establishes a consistent dark theme with Tailwind v4 custom properties. The glassmorphism aesthetic is cohesive.
4. **Zod Validation:** Input schemas exist and are applied consistently across API routes.
5. **Agent Orchestration Layer:** The intelligence layer (`lib/agents/`) is a well-structured extensible system for competitive analysis and feature proposals. It shows architectural ambition.
6. **Authority Rule Schema:** The governance model (role × value × category × supplier tier → action) is correctly designed for hotel chains.

**Bottom line:** The developer has built an excellent **skeleton** and a beautiful **skin**, but there is no **muscle** (business logic enforcement), no **nervous system** (auth/security), and no **legal identity** (ETA compliance). Stop adding new pages and fix the foundation.

---

*End of Audit Report*
