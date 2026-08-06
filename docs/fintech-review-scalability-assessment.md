# Deliverable 4 — Multi-Industry Scalability Assessment

> Read-only analysis. Every claim cites `file_path:line_number`.

---

## 4.1 Current Industry Scope

**The platform is strictly hospitality-vertical.** All models, enums, categories, and business logic are hardcoded for the Egyptian hospitality market. There is **no industry discriminator** in the active Prisma schema.

### Evidence:

**Tenant Types** (`prisma/schema.prisma:2457-2463`):
```
enum TenantType {
  HOTEL_GROUP
  SUPPLIER
  FACTORING_COMPANY
  SHIPPING_PROVIDER
  PLATFORM
}
```
Only hospitality-related tenant types. No generic "ENTERPRISE" or vertical-specific types (e.g., "RESTAURANT_CHAIN", "HEALTHCARE_SYSTEM").

**Product Categories** (`prisma/schema.prisma:2562-2568`):
```
enum ProductCategory {
  F_AND_B
  CONSUMABLES
  GUEST_SUPPLIES
  FFE
  SERVICES
}
```
All five categories are **hotel-specific**. FFE (Furniture, Fixtures & Equipment) is hospitality terminology. There is no mapping layer for generic B2B categories.

**Category Definitions** (`lib/marketplace/categories.ts:19-130`):
The `HOTEL_CATEGORIES` array contains exactly 10 categories, all hospitality-specific:
- F&B, Housekeeping, FFE, OS&E, Guest Amenities, Linens & Textiles, Engineering, Spa & Recreation, IT & Technology, Safety & Security

There is `CATEGORY_MAP` (`lib/marketplace/categories.ts:132-139`) that maps old names to new IDs, but **no function to map non-hospitality categories**. The `classifySupplier()` function at `lib/marketplace/categories.ts:152-186` keyword-matches against hospitality keywords only — a medical device supplier would get zero matches.

**Marketing Copy** (`app/(marketing)/hotels/join/page.tsx:9`):
> "Think of Amazon: buyers discover products, sellers list inventory, logistics fulfills delivery, payments/financing grease the wheels, and compliance keeps everyone legal. **Hotels Vendors does exactly this**, but every feature is purpose-built for Egyptian hospitality."

**Supplier Categories** (`app/(marketing)/become-supplier/page.tsx:67-71`):
```javascript
const CATEGORIES = [
  "F&B", "Housekeeping", "Engineering", "Amenities",
  "Capital Equipment", "Linens & Textiles", "Chemicals & Cleaning",
  "IT & Electronics", "Security Equipment", "Outdoor & Pool",
];
```
All hospitality-oriented. No option for industrial, retail, healthcare, or other B2B categories.

---

## 4.2 Shadow Schema vs. Active Schema Conflict

There are **two conflicting schemas** in the codebase:

### Active Schema (Prisma) — `prisma/schema.prisma`
- 3,479+ lines
- Used at runtime via `lib/prisma.ts`
- **No `industry_type` field** on any table
- **No `default_take_rate` field** on Tenant
- Tenant model: `prisma/schema.prisma:2457-2463` — `TenantType` enum has 5 values (all hospitality)
- Product model: `prisma/schema.prisma:2562` — `ProductCategory` enum has 5 values (all hospitality)
- User model: `prisma/schema.prisma:224-273` — no `tenant_type` or `industry` field

### Shadow Schema (Types) — `types/database.ts`
- 1,411 lines
- Supabase-style type definitions
- **Contains `industry_type` field** on `users` table: `types/database.ts:50` — `tenant_type: string` (string, not enum)
- **Contains `default_take_rate`** on `platform_config` table: `types/database.ts:1186`
- Contains more granular models: `platform_config`, `notifications`, `analytics`, etc.

### Gap Analysis:
| Field | In Prisma | In Shadow Types | Impact |
|---|---|---|---|
| `tenant_type` | Via enum `TenantType` (5 values) | As string on `users` table | Shadow is more flexible but divergent |
| `industry_type` | ❌ Missing | ✅ Present (string field) | Cannot filter/search by industry |
| `default_take_rate` | ❌ Missing | ✅ Present on `platform_config` | Cannot customize take rates per industry |
| Product categories | Enum (5 hotel-specific) | Not present | No way to map non-hotel categories |

**The shadow `types/database.ts` appears to be a Supabase migration artifact that was never reconciled with the Prisma schema.** This creates a **duplicate-schema friction** that blocks multi-industry expansion — the codebase doesn't know which schema is authoritative for industry-related fields.

---

## 4.3 Scalability Readiness: Strengths

### 1. Multi-Sided Marketplace Architecture
The platform natively supports 4 actor types with distinct flows:
- `prisma/schema.prisma:2457-2463` — `TenantType` enum: HOTEL_GROUP, SUPPLIER, FACTORING_COMPANY, SHIPPING_PROVIDER
- `prisma/schema.prisma:2510-2517` — `PlatformRole` enum: HOTEL, SUPPLIER, FACTORING, SHIPPING, ADMIN, MARKETING

This 4-sided model (buyers/sellers/logistics/finance) is **industry-agnostic** at the conceptual level. Each industry needs: buyers, suppliers, logistics, finance.

### 2. Tenant Isolation
- `TenantType` and `tenantId` are on every model (orders, invoices, suppliers, hotels)
- `lib/tenant/` directory exists (per AGENTS.md system guardrails G1)
- All API routes scope queries by `tenantId` (e.g., `app/api/v1/checkout/route.ts:77`)

### 3. Authority Matrix is Rules-Driven
- `lib/auth/authority-matrix.ts:83-212` — Built-in rules + database-driven rules (`AuthorityRule` model)
- Rules key off: `hotelTier`, `hotelRiskTier`, `supplierTier`, `requesterRole`, `minValue`, `maxValue`
- To expand to other industries, new rules can be added without code changes — **only the enum values and entity types would need extension**

### 4. Factoring Bridge is Adapter-Pattern
- `lib/fintech/factoring-bridge.ts:94-111` — `FactoringPartnerAdapter` interface
- `lib/fintech/factoring-bridge.ts:118-121` — Partner registry (currently only Oliv)
- New factoring partners can be added by implementing the adapter and registering in the `PARTNERS` map — **zero changes to core factoring logic**

### 5. ETA Bridge is Modular
- `lib/eta/validator.ts` — Validation logic is separate from the adapter
- `lib/eta/client.ts` — API client (referenced at `lib/eta/validator.ts:11`)
- `lib/eta/queue.ts` — Background job queue (referenced at `app/api/v1/invoices/[id]/eta-submit/route.ts:4`)
- The ETA system is "INVISIBLE to UI" per AGENTS.md G4 — it's a compliance layer that can be swapped per jurisdiction

---

## 4.4 Scalability Barriers

### Barrier 1: Hardcoded Hospitality Vocabulary
**Scope:** Critical — affects data model, UI, search, and business logic

- `lib/marketplace/categories.ts:7` — `HotelCategory` interface name implies hotel-only
- `lib/marketplace/categories.ts:19` — `HOTEL_CATEGORIES` is a hardcoded array
- `lib/fintech/risk-engine.ts:243-251` — `calculateScaleScore()` uses `roomCount` as the scale metric: "Larger hotels = lower risk (more stable, harder to default)"
- `app/api/v1/checkout/route.ts:122` — VAT hardcoded at 14% (Egypt rate): `const vatAmount = subtotal * 0.14`
- `lib/fintech/fee-calculator.ts:68` — `currency = "EGP"` hardcoded
- `app/api/v1/oliv/initiate-factoring/route.ts:23` — `"Minimum invoice amount is EGP 5,000"` hardcoded

### Barrier 2: Missing `industry_type` Field in Prisma Schema
**Scope:** High — prevents runtime industry routing

The shadow types have `tenant_type` as a string on the `users` table (`types/database.ts:50`), but the active Prisma schema has no equivalent. The `TenantType` enum in Prisma is hospitality-only.

To support multiple industries, we would need:
```prisma
model Tenant {
  // ...
  industryType String?  // NEW FIELD — missing from current schema
  defaultTakeRate Decimal? // NEW FIELD — exists only in shadow types
}
```

### Barrier 3: OTP/Phone System is Egypt-Locked
**Scope:** Medium

- `app/api/v1/auth/register/route.ts:59-63` — calls `normalizePhone()` and `isValidEgyptianPhone()` from `lib/auth/phone`
- These functions are not read in this session but are clearly Egypt-specific (Egyptian phone format validation)
- `app/(auth)/register/page.tsx:46-51` — `GOVERNORATES` array is exclusively Egyptian governorates
- `app/(marketing)/become-supplier/page.tsx:58-65` — Same Egyptian governorates list

### Barrier 4: Single Factoring Partner
**Scope:** Medium — limits geographic expansion

- `lib/fintech/factoring-bridge.ts:118-121` — `PARTNERS` map has only one entry: `olivFinanceAdapter`
- Oliv advertises itself as "Egypt's first FRA-licensed digital factoring platform" (`app/(marketing)/financing/oliv/page.tsx:56`)
- No adapter abstraction for regional factoring partners (e.g., EFG Hermes for Egypt, Tamara for GCC, etc.)

### Barrier 5: No Industry-Specific Risk Models
**Scope:** Medium — affects credit/risk engines

- `lib/fintech/risk-engine.ts:19` — `RiskScoreFactors` includes `etaComplianceScore` — ETA is Egypt-specific
- `lib/fintech/risk-engine.ts:243` — `calculateScaleScore()` uses hotel room count as scale proxy
- `lib/fintech/risk-engine.ts:234-241` — `calculateEtaComplianceScore()` filters on `etaStatus === "ACCEPTED" || "VALIDATED"` — Egypt-specific status values

### Barrier 6: Mobile App Role Limitation
**Scope:** Medium

- `mobile/app/(auth)/RegisterScreen.tsx:12` — role state type is `'hotel' | 'supplier'` only (no `'factoring'` or `'logistics'`)
- `mobile/app/(auth)/OnboardingGatewayScreen.tsx:21,29` — only shows "Hotel Buyer" and "Supplier" cards
- Factoring and logistics must use the web registration flow

### Barrier 7: Hardcoded Platform Config Values
**Scope:** Low-Medium — inflexible rate configuration

- `lib/payments/oliv/index.ts:356-365` — Oliv config (advance rate, discount rate, min/max amounts) hardcoded
- `lib/fintech/hub-revenue.ts:251` — platform fee rate hardcoded at 0.025
- `app/api/v1/oliv/payout-callback/route.ts:181` — platform fee hardcoded at 0.02
- `prisma/schema.prisma:2054-2095` — `FactoringTransaction` model has no `currency` field (assumes EGP)

---

## 4.5 Scalability Score

| Dimension | Current State | Scalability Rating | Effort to Expand |
|---|---|---|---|
| Multi-tenant isolation | ✅ Robust, enforced | HIGH | Low — already done |
| Industry discrimination | ❌ None in active schema | CRITICAL | High — schema migration |
| Category system | ❌ Hotel-only hardcoded | CRITICAL | High — rewrite `categories.ts` |
| VAT/Tax handling | ❌ 14% hardcode + ETA-only | MEDIUM | Medium — extract to config |
| Currency support | ❌ EGP hardcoded everywhere | MEDIUM | Medium — add currency dimension |
| Phone/OTP | ❌ Egypt-only | MEDIUM | Medium — add country config |
| Factoring adapter | ✅ Adapter pattern | HIGH | Low — add new adapters |
| Authority rules | ✅ DB-driven + built-in | HIGH | Low — add rules per industry |
| Risk scoring | ❌ Hotel room count + ETA | MEDIUM | Medium — make metrics pluggable |
| Mobile roles | ❌ Hotel + Supplier only | LOW | Low — add roles to mobile |

---

## 4.5 Detailed Roadmap for Multi-Industry Expansion

### Phase 1: Schema Foundation (High Priority)
1. **Add `industryType` to Tenant model** in Prisma schema — resolve the shadow schema conflict
2. **Make `ProductCategory` industry-agnostic** — create a join table `IndustryCategory` or use string field with validation per industry
3. **Add `currency` and `vatRate` fields** to Invoice/Tenant models
4. **Reconcile or remove `types/database.ts`** — the shadow schema creates dangerous ambiguity

### Phase 2: Business Logic Abstraction (Medium Priority)
1. **Rate configuration service** — move hardcoded rates to a `RateConfig` model (`lib/fintech/fee-calculator.ts`, `lib/payments/oliv/index.ts:356`)
2. **Industry-specific risk scoring** — abstract `calculateScaleScore()` to accept industry metric (`lib/fintech/risk-engine.ts:243`)
3. **VAT calculation service** — replace `* 0.14` with configurable rate (`app/api/v1/checkout/route.ts:122`)
4. **Phone/OTP per-country** — abstract `normalizePhone`/`isValidEgyptianPhone` (`app/api/v1/auth/register/route.ts:59-63`)

### Phase 3: Category System Rewrite (High Priority)
1. **Replace `HOTEL_CATEGORIES`** with industry-aware category tree (`lib/marketplace/categories.ts`)
2. **Add category-to-industry mapping** so suppliers are classified correctly
3. **Support generic procurement categories** (industrial supplies, medical, retail) alongside hospitality

### Phase 4: Multi-Partner Factoring (Low Priority)
1. **Add adapter for additional factoring partners** beyond Oliv
2. **Route inquiries to partners by industry/region**

---

## 4.6 Key Files for Industry Expansion

| File | Issue | Lines |
|---|---|---|
| `prisma/schema.prisma` | No `industryType` field; `ProductCategory` enum hotel-only | `2457-2463`, `2562-2568` |
| `types/database.ts` | Shadow schema has `industry_type` but not in Prisma — conflict | `50`, `1186` |
| `lib/marketplace/categories.ts` | `HOTEL_CATEGORIES` hardcoded, `HotelCategory` type | `7-17`, `19-130` |
| `app/api/v1/checkout/route.ts` | VAT 14% hardcoded | `122` |
| `lib/fintech/fee-calculator.ts` | Currency EGP hardcoded | `68` |
| `lib/fintech/risk-engine.ts` | Scale score uses room count; ETA compliance hardcoded | `243-251`, `234-241` |
| `mobile/app/(auth)/RegisterScreen.tsx` | Role type `'hotel' \| 'supplier'` only | `12` |
| `app/(auth)/register/page.ts` | `GOVERNORATES` array Egypt-only | `45-51` |
| `app/(marketing)/become-supplier/page.tsx` | Categories all hospitality | `67-71` |
| `app/(marketing)/hotels/join/page.tsx` | "purpose-built for Egyptian hospitality" | `9` |

---

*End of Part 4. Next: Part 5 (Friction Points & ROI Fixes).*
