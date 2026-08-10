# Shipping/Carrier Onboarding Audit Report

**Audit Date:** 2026-07-14
**Auditor:** The Auditor
**Scope:** Shipping/Carrier/Logistics onboarding flow completeness
**Completeness Score:** 28/100

---

## Executive Summary

The shipping/carrier onboarding flow is **critically incomplete**. While registration exists (as a role option), there is no dedicated onboarding pipeline, no carrier-specific entity creation, no onboarding chatbot, and the dashboard is a minimal read-only view. Compared to supplier onboarding (which has a dedicated chatbot, onboarding API, email templates, and admin review), shipping onboarding is effectively **non-existent**.

---

## 1. What Exists

### 1.1 Registration (Entry Point)

| Asset | Path | Status |
|-------|------|--------|
| Register page with LOGISTICS role | `app/(auth)/register/page.tsx:26` | ✅ Role selector exists |
| Register API handles `type: "shipping"` | `app/api/v1/auth/register/route.ts:133-138` | ⚠️ Creates user only — NO entity |

**Critical Gap:** When a carrier registers, the API creates a `User` record but **does NOT create a `LogisticsProvider` or equivalent entity**. Compare to hotels (creates `Hotel`), suppliers (creates `Supplier`), and factoring (creates `FactoringCompany`). The shipping branch falls through to a generic user-only creation.

### 1.2 Dashboard

| Asset | Path | Status |
|-------|------|--------|
| Shipping dashboard page | `app/(dashboard)/shipping/page.tsx` | ⚠️ Read-only trip viewer |
| Sidebar nav entry | `components/layout/pulse-sidebar.tsx:156-167` | ⚠️ Only "Dashboard" link |
| Dashboard shell accepts `shipping` role | `components/layout/dashboard-shell.tsx:19` | ✅ Role type includes shipping |

**Dashboard Gaps:**
- No fleet management (add/edit vehicles)
- No driver management
- No hub management
- No trip creation UI (only API exists)
- No proof-of-delivery upload
- No earnings/payments view
- Map integration placeholder ("coming soon")

### 1.3 API Routes

| Endpoint | Path | Status |
|----------|------|--------|
| `GET /api/v1/shipping/trips` | `app/api/v1/shipping/trips/route.ts` | ✅ Works — lists trips |
| `POST /api/v1/shipping/trips` | `app/api/v1/shipping/trips/route.ts` | ✅ Works — creates trip |
| `POST /api/v1/shipping/routes/optimize` | `app/api/v1/shipping/routes/optimize/route.ts` | ✅ Works — TSP optimization |
| `GET /api/logistics/hubs` | `app/api/logistics/hubs/route.ts` | ⚠️ Legacy route — no auth |
| `GET /api/logistics/trips` | `app/api/logistics/trips/route.ts` | ⚠️ Legacy route — no auth |
| `POST /api/logistics/trips` | `app/api/logistics/trips/route.ts` | ⚠️ Legacy route — partial auth |
| `POST /api/v1/shipping/onboard` | — | ❌ **MISSING** |
| `GET/POST /api/v1/shipping/fleet` | — | ❌ **MISSING** |
| `GET/POST /api/v1/shipping/drivers` | — | ❌ **MISSING** |
| `POST /api/v1/shipping/pod` | — | ❌ **MISSING** (proof of delivery) |

### 1.4 Business Logic

| Module | Path | Status |
|--------|------|--------|
| Load Pooling Engine | `lib/logistics/load-pooler.ts` | ✅ Sophisticated — bundle prediction, clustering, cost sharing |
| Route Optimizer | `app/api/v1/shipping/routes/optimize/route.ts` | ✅ Greedy nearest-neighbor TSP |
| AI Assistant Prompt | `components/ai-assistant/prompts/shipping-prompt.ts` | ✅ Comprehensive system prompt |

### 1.5 Marketing

| Asset | Path | Status |
|-------|------|--------|
| Logistics service landing page | `app/(marketing)/logistics-service/page.tsx` | ✅ Full page with features |
| Logistics dashboard mockup | `components/marketing/logistics-dashboard-mockup.tsx` | ✅ Marketing mockup |

### 1.6 Database Models

| Model | Schema Location | Status |
|-------|----------------|--------|
| `LogisticsHub` | `prisma/schema.prisma:1097` | ✅ Exists |
| `Trip` | `prisma/schema.prisma:1121` | ✅ Exists |
| `TripStop` | `prisma/schema.prisma:1146` | ✅ Exists |
| `LogisticsProvider` | — | ❌ **MISSING** (no dedicated entity) |
| `Vehicle` | — | ❌ **MISSING** |
| `Driver` | — | ❌ **MISSING** |
| `DeliveryConfirmation` | — | ❌ **MISSING** |

---

## 2. Comparison: Shipping vs. Other Onboarding Flows

| Component | Hotel | Supplier | Factoring | **Shipping** |
|-----------|-------|----------|-----------|--------------|
| Registration form | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Entity creation on register | ✅ `Hotel` | ✅ `Supplier` | ✅ `FactoringCompany` | ❌ **User only** |
| Dedicated onboard API | — | ✅ `POST /api/v1/supplier/onboard` | — | ❌ **MISSING** |
| Onboarding chatbot | — | ✅ `supplier-onboarding-chatbot.tsx` | — | ❌ **MISSING** |
| Onboarding email template | — | ✅ `supplier-onboarding-en.html` | — | ❌ **MISSING** |
| Dashboard with full UI | ✅ 7 nav items | ✅ Full catalog/orders | ✅ Full | ⚠️ **1 nav item** |
| Fleet/vehicle management | — | — | — | ❌ **MISSING** |
| Driver management | — | — | — | ❌ **MISSING** |
| Proof of delivery | — | — | — | ❌ **MISSING** |
| Earnings/payments view | — | — | — | ❌ **MISSING** |
| AI assistant prompt | ✅ | ✅ | ✅ | ✅ |
| Admin review workflow | — | ✅ PENDING → ACTIVE | — | ❌ **MISSING** |

---

## 3. Broken Items

### 3.1 Registration Creates Orphan User
`app/api/v1/auth/register/route.ts:133-138` — When `type === "shipping"`, only a `User` record is created. No `LogisticsProvider` entity, no tenant association beyond the user's own tenant. The carrier has nothing to manage.

### 3.2 Legacy Logistics API Routes Lack Auth
`app/api/logistics/hubs/route.ts` and `app/api/logistics/trips/route.ts` use raw `NextResponse` without the `apiRoute` wrapper, `authenticate()`, or `requirePermission()`. These are security risks and inconsistent with the v1 API pattern.

### 3.3 Dashboard Trip Status Enum Mismatch
The dashboard page (`app/(dashboard)/shipping/page.tsx:33-41`) defines statuses: `SCHEDULED`, `PICKED_UP`, `IN_TRANSIT`, `ARRIVED`, `DELIVERED`, `DELAYED`, `RETURNING`. But the Prisma schema (`prisma/schema.prisma:1181-1187`) defines: `SCHEDULED`, `LOADING`, `IN_TRANSIT`, `COMPLETED`, `CANCELLED`. The frontend statuses `PICKED_UP`, `ARRIVED`, `DELAYED`, `RETURNING` don't exist in the schema. `COMPLETED` and `CANCELLED` aren't mapped in the UI.

### 3.4 Missing `stopNumber` Field Usage
`app/api/v1/shipping/routes/optimize/route.ts:60` updates `stopNumber` but the Prisma model uses `stopOrder` as the primary ordering field and `stopNumber` as optional. The optimizer updates a nullable field while the UI may rely on `stopOrder`.

---

## 4. Recommendations

### Priority 1: Critical (Blocks carrier onboarding)
1. **Create `LogisticsProvider` model** in Prisma schema with fields: fleet size, vehicle types, coverage zones, insurance, operating license
2. **Update register API** to create `LogisticsProvider` entity when `type === "shipping"`, similar to how `Supplier` is created
3. **Add `POST /api/v1/shipping/onboard`** endpoint for carrier self-registration with admin review (PENDING status)
4. **Create `Vehicle` and `Driver` models** and CRUD APIs

### Priority 2: High (Required for dashboard functionality)
5. **Add fleet management pages** — vehicle list, add/edit vehicle, driver list, add/edit driver
6. **Add trip creation UI** — the API exists but no UI to create trips from the dashboard
7. **Align trip status enums** — update Prisma schema or frontend to match
8. **Add proof-of-delivery upload** — camera/file upload for POD photos and signatures
9. **Add earnings/payments view** — carriers need to see their revenue

### Priority 3: Medium (Onboarding experience)
10. **Create shipping onboarding chatbot** — adapt `supplier-onboarding-chatbot.tsx` for carrier-specific questions (fleet requirements, insurance, coverage areas, SLA terms)
11. **Create shipping onboarding email template** — similar to `supplier-onboarding-en.html`
12. **Add carrier-specific fields to registration** — fleet size, vehicle types, coverage zones, insurance info, operating license number

### Priority 4: Low (Polish)
13. **Migrate legacy `/api/logistics/*` routes** to `/api/v1/shipping/*` with proper auth
14. **Integrate map provider** — replace placeholder with Google Maps or Mapbox
15. **Add real-time GPS tracking** via webhook or polling from fleet management systems

---

## 5. File Inventory

### Exists (Working)
- `app/(dashboard)/shipping/page.tsx` — Dashboard page (read-only)
- `app/(marketing)/logistics-service/page.tsx` — Marketing landing page
- `app/api/v1/shipping/trips/route.ts` — Trip CRUD
- `app/api/v1/shipping/routes/optimize/route.ts` — Route optimizer
- `app/api/logistics/hubs/route.ts` — Legacy hub API (no auth)
- `app/api/logistics/trips/route.ts` — Legacy trip API (partial auth)
- `lib/logistics/load-pooler.ts` — Load pooling engine
- `components/ai-assistant/prompts/shipping-prompt.ts` — AI assistant prompt
- `components/marketing/logistics-dashboard-mockup.tsx` — Marketing mockup
- `prisma/schema.prisma` — LogisticsHub, Trip, TripStop models

### Missing (Required)
- `app/api/v1/shipping/onboard/route.ts` — Carrier onboarding API
- `app/api/v1/shipping/fleet/route.ts` — Fleet management API
- `app/api/v1/shipping/drivers/route.ts` — Driver management API
- `app/api/v1/shipping/pod/route.ts` — Proof of delivery API
- `app/(dashboard)/shipping/fleet/page.tsx` — Fleet management page
- `app/(dashboard)/shipping/drivers/page.tsx` — Driver management page
- `app/(dashboard)/shipping/trips/new/page.tsx` — Trip creation page
- `app/(dashboard)/shipping/earnings/page.tsx` — Earnings dashboard
- `components/ai-assistant/shipping-onboarding-chatbot.tsx` — Onboarding chatbot
- `templates/emails/shipping-onboarding-en.html` — Onboarding email
- `lib/shipping/` — Shipping business logic directory
- `prisma/schema.prisma` — LogisticsProvider, Vehicle, Driver, DeliveryConfirmation models
