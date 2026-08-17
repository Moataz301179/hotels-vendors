# A3-04: Zod Coverage Audit — v1 API Routes

**Date:** 2026-07-25  
**Scope:** All `app/api/v1/**/route.ts` files  
**Status:** Complete

## Summary

Audited 60+ v1 API route files for Zod input validation. Identified 23 routes accepting user input without Zod schemas. Fixed 18 worst offenders (POST/PUT routes). 2 credit-line routes no longer exist (removed). 3 remaining are lower-priority (webhook callbacks, FormData uploads, service-key protected).

## Routes Fixed (18)

| Route | Fix Applied |
|-------|------------|
| `suppliers/[id]/approve` | `ApproveSupplierSchema` — tier enum + notes |
| `suppliers/[id]/reject` | `RejectSupplierSchema` — reason string |
| `auth/forgot-password` | `ForgotPasswordSchema` — email validation |
| `auth/reset-password` | `ResetPasswordSchema` — token + password strength |
| `auth/verify-email` | `VerifyEmailSchema` — token string |
| `auth/resend-verification` | `ResendVerificationSchema` — email validation |
| `vat/issue` | `VATIssueSchema` — tax IDs + items array with VAT rate validation |
| `vat/compliance-check` | `ComplianceCheckSchema` — tax IDs + amount + items with VAT rates |
| `consent` | `GrantConsentSchema` — consentType enum + partnerId + dataCategories |
| `consent/withdraw` | `WithdrawConsentSchema` — consentType enum + partnerId + reason |
| `oliv/onboard-supplier` | `OlivOnboardSchema` — nested company/signatory/address/bank schemas |
| `oliv/initiate-factoring` | `InitiateFactoringSchema` — ETA UUID + tax IDs + invoice amount (min 5000) |
| `oliv/referral` | `OlivReferralSchema` — name + email + role enum |
| `invo/orders` POST+GET | `InvoOrderCreateSchema` + `InvoOrderQuerySchema` |
| `invo/factoring` POST+GET | `InvoFactoringCreateSchema` + `InvoFactoringQuerySchema` |
| `invo/invoices` POST+GET | `InvoInvoiceCreateSchema` + `InvoInvoiceQuerySchema` |
| `fintech/oliv-prefill` | `OlivPrefillSchema` — supplierId + optional invoiceId/etaUuid |
| `ai/conversations` | `CreateConversationSchema` — title + role enum |

## Routes Already Covered (no fix needed)

Auth login/register, products, orders, invoices, disputes, hotel catalog/orders, supplier orders/inventory, shipping trips/pod/routes, factoring fund/inquire/credit-lines, ETA submit, payments (intent/deposit/escrow/fawry), checkout, KYC, data rectification/consent, AI assistant/public, leads, fintech TCP report, financing invoice-upload, AI inventory, intelligence trust-score — all had Zod via `validateBody`/`validateQuery` or inline schemas.

## Remaining Gaps (acceptable)

| Route | Reason |
|-------|--------|
| `oliv/payout-callback` | Webhook — HMAC signature verified, no user input |
| `invo/delivery/quote`, `invo/delivery/route` | Service-key protected (internal only) |
| `credit-lines/[id]/approve`, `[id]/reject` | Files no longer exist (removed from codebase) |

## TypeScript Strict Mode

- `strict: true` confirmed in `tsconfig.json:7`
- Single `@ts-expect-error` at `lib/security/webhook-whitelist.ts:128` — justified (runtime `.ip` property)

## Pattern Used

```typescript
import { z } from "zod";

const MySchema = z.object({
  field: z.string().min(1, "Required"),
  amount: z.number().positive(),
});

// In handler:
const parsed = MySchema.safeParse(body);
if (!parsed.success) {
  return error(parsed.error.issues[0]?.message || "Invalid request body", 400);
}
const { field, amount } = parsed.data;
```

For routes using `apiRoute` wrapper + `validateBody`/`validateQuery` from `@/lib/api-utils`, existing pattern was preserved.
