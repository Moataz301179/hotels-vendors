# Supplier Onboarding Skill
## Hotels Vendors — Automated 24/7 Onboarding Pipeline

### Purpose
Reusable supplier onboarding automation. Handles KYC, document verification, Trust Score calculation, and account activation without human intervention (for low-risk suppliers).

### Pipeline Steps
1. **Registration:** Collect business details, tax ID, commercial registration
2. **Document Upload:** CR document, tax card, bank statement (optional)
3. **Trust Score Calculation:** Multi-signal aggregator (platform/ETA/Paymob/bank)
4. **Risk Classification:** LOW → Auto-approve | MEDIUM → Review queue | HIGH → Manual KYC
5. **Catalog Setup:** AI-assisted product upload or REST sync
6. **Activation:** Account live with pre-approved credit terms

### Auto-Approval Criteria
- Trust Score >= 500 (SILVER)
- Valid ETA Tax ID
- Commercial Registration verified
- No negative signals from ETA registry

### Human Review Triggers
- Trust Score < 500 (BRONZE/UNTRUSTED)
- Missing commercial registration
- Tax ID mismatch with ETA
- Previous suspension on platform

### Usage
Call `lib/integrations/trust-score.ts` to assess new suppliers. Use `lib/intelligence/memory-layer.ts` to build initial supplier embedding.
