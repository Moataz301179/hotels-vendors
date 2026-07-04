# RBAC & Tenant-Scoping Quick Audit

Date: 2026-07-05

Summary:
- Scanned `app/api/v1/**/*.ts` for presence of `requirePermission`.
- The following route files do not reference `requirePermission`. Some are expected (auth, public AI endpoints, external callbacks). Others likely require RBAC or explicit tenant scoping.

Files without `requirePermission` (needs review):

- app/api/v1/ai/assistant/route.ts
- app/api/v1/ai/chat/route.ts
- app/api/v1/ai/conversations/[id]/route.ts
- app/api/v1/ai/conversations/route.ts
- app/api/v1/ai/public/route.ts
- app/api/v1/ai/quota/route.ts
- app/api/v1/auth/forgot-password/route.ts
- app/api/v1/auth/login/route.ts
- app/api/v1/auth/logout/route.ts
- app/api/v1/auth/me/route.ts
- app/api/v1/auth/refresh/route.ts
- app/api/v1/auth/register/route.ts
- app/api/v1/auth/resend-verification/route.ts
- app/api/v1/auth/reset-password/route.ts
- app/api/v1/auth/verify-email/route.ts
- app/api/v1/eta/callback/route.ts
- app/api/v1/eta/status/[uuid]/route.ts
- app/api/v1/factoring/credit-lines/[id]/analyze/route.ts
- app/api/v1/factoring/credit-lines/[id]/approve/route.ts
- app/api/v1/factoring/credit-lines/[id]/reject/route.ts
- app/api/v1/fintech/oliv-callback/route.ts
- app/api/v1/fintech/tcp-report/route.ts
- app/api/v1/invo/catalog/route.ts
- app/api/v1/invo/delivery/quote/route.ts
- app/api/v1/invo/delivery/route/route.ts
- app/api/v1/invo/docs/route.ts
- app/api/v1/invo/factoring/route.ts
- app/api/v1/invo/health/route.ts
- app/api/v1/invo/invoices/route.ts
- app/api/v1/invo/orders/route.ts
- app/api/v1/invo/partners/onboard/route.ts
- app/api/v1/invo/partners/status/[id]/route.ts
- app/api/v1/invo/settlement/route.ts
- app/api/v1/leads/capture/route.ts
- app/api/v1/leads/route.ts
- app/api/v1/payments/create-intent/route.ts
- app/api/v1/payments/fawry-callback/route.ts
- app/api/v1/payments/instapay-callback/route.ts
- app/api/v1/payments/paymob-callback/route.ts
- app/api/v1/products/route.ts
- app/api/v1/supplier/onboard/route.ts
- app/api/v1/suppliers/[id]/shared.ts
- app/api/v1/vat/compliance-check/route.ts
- app/api/v1/vat/issue/route.ts

Recommendations:
1. For any route that mutates data (orders, invoices, factoring, payments, suppliers) ensure both:
   - `await requirePermission(auth, "resource:action")` is called early in the handler, and
   - queries use `tenantWhereClause(ctx)` or `tenantWhere` helpers when fetching/updating DB.
2. Public routes (auth, email callbacks, payment callbacks, AI public endpoints) should remain without `requirePermission`, but still must validate and sanitize inputs.
3. Create a shared wrapper `lib/api-utils/enforceScope.ts` to validate tenant in request body/params for endpoints that accept `hotelId`/`supplierId` from clients.
4. Add unit tests that assert protected routes return 403 if permission missing/insufficient.

Next actions I can take (pick any or I'll proceed in order):
- Auto-insert `requirePermission` calls for obvious mutation routes (e.g., `invo/orders`, `invo/invoices`, `invo/factoring`, `products`), creating a PR. (This is a code change — I can do it.)
- Add `tenantWhereClause(ctx)` usage suggestions per-file in a follow-up patch.
- Generate a checklist PR that updates each route with TODO comments where enforcement is needed.

