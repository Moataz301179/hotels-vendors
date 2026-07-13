# FRA Licensing Requirements for Factoring Operations

> **Document Owner:** Compliance & Legal Engineer  
> **Last Updated:** 2026-07-14  
> **Status:** Compliance Gap Analysis  
> **Next Review:** 2026-08-14

---

## 1. Executive Summary

The HotelsVendors platform facilitates B2B procurement transactions between hotels and suppliers in Egypt. The platform's factoring operations require careful regulatory analysis under the Financial Regulatory Authority (FRA) framework.

**Current License:** Digital Marketing License (No. 105300900196948)  
**Legal Entity:** Restaurants for E-Marketing (Tax ID: 704226146)

---

## 2. FRA Regulatory Framework for Factoring

### 2.1 Applicable Laws

| Law | Scope | Relevance |
|-----|-------|-----------|
| **Law No. 177 of 2018** | Financial Regulatory Authority establishment | Primary regulatory body |
| **Law No. 80 of 2002 (amended 2020)** | Anti-Money Laundering | KYC/AML requirements for financial intermediaries |
| **Ministerial Resolution No. 212 of 2019** | Factoring activities regulation | Defines factoring as a licensed financial activity |
| **Law No. 175 of 2002** | Electronic transactions | Digital signature requirements |

### 2.2 FRA License Types for Factoring

| License Type | Description | Required For |
|-------------|-------------|--------------|
| **Factorization License** | Authorizes direct factoring operations (purchasing receivables) | Direct factoring, invoice discounting |
| **Consumer Finance License** | Authorizes lending to consumers/enterprises | Credit lines, loans |
| **Payment Service Provider License** | Authorizes payment processing | Wallet operations, payment gateways |

---

## 3. Platform's Current Position

### 3.1 What the Platform Does

The platform performs the following factoring-related activities:

1. **Risk Assessment** — Evaluates hotel creditworthiness for factoring eligibility
2. **Partner Matching** — Inquires with licensed factoring partners (Oliv, EFG Hermes)
3. **Revenue Calculation** — Computes platform commission on successful factoring
4. **Settlement Tracking** — Monitors payment settlement between parties
5. **Documentation** — Generates ETA-compliant invoices required for factoring

### 3.2 What the Platform Does NOT Do

1. **Does NOT hold or transfer cash** — No wallet balances, no cash custody
2. **Does NOT purchase receivables** — Does not buy invoices from suppliers
3. **Does NOT provide credit** — Does not lend money to any party
4. **Does NOT charge factoring fees** — Charges only SaaS fees and marketplace commissions
5. **Does NOT set factoring rates** — Rates are determined by licensed partners

### 3.3 Revenue Model

| Revenue Stream | Source | FRA Classification |
|---------------|--------|-------------------|
| SaaS subscription fees | Supplier listing plans via INVO | Digital service — not financial |
| Document processing fees | ETA invoice submission per-document | Document service — not financial |
| Marketplace commission | Transaction fee on completed orders | Referral fee — not financial spread |

---

## 4. Licensing Gap Analysis

### 4.1 Does the Platform Need a FRA Factoring License?

**Analysis:**

The platform's role is that of a **referral intermediary**, not a factoring entity. Key factors:

1. **No receivable purchase:** The platform never purchases invoices or receivables
2. **No cash flow:** Money flows directly from factoring partners to suppliers
3. **No risk assumption:** The platform does not bear credit risk
4. **No rate setting:** Factoring rates are set by licensed partners
5. **Commission model:** Platform earns a fixed percentage referral fee

**Conclusion:** Under current FRA regulations, a Digital Marketing license is sufficient for the platform's referral-only factoring facilitation model. However, this requires:

1. **Legal opinion** from an Egyptian fintech regulatory attorney
2. **Documentation** of the referral-only scope (this document)
3. **Compliance monitoring** to ensure platform behavior stays within scope

### 4.2 Risk Areas

| Activity | Risk Level | Mitigation |
|----------|-----------|------------|
| Referring factoring requests to licensed partners | LOW | Ensure partners hold valid FRA licenses |
| Calculating platform commission | LOW | Commission is a referral fee, not a financial spread |
| Risk scoring for factoring eligibility | MEDIUM | Risk scoring is advisory, not a credit decision |
| Settlement tracking | LOW | Observational only, no fund custody |
| Marketing factoring services | MEDIUM | Must not imply platform is a factoring entity |

---

## 5. Required Actions

### 5.1 Immediate (P0)

| # | Action | Owner | Timeline |
|---|--------|-------|----------|
| 1 | Obtain formal legal opinion on FRA licensing requirements | Legal Counsel | 2 weeks |
| 2 | Document referral-only scope in Terms of Service | Compliance Engineer | 1 week |
| 3 | Add disclaimers to factoring-related UI components | UX Designer | 1 week |
| 4 | Verify all factoring partners hold valid FRA licenses | Compliance Engineer | 1 week |

### 5.2 Short-term (P1)

| # | Action | Owner | Timeline |
|---|--------|-------|----------|
| 5 | Implement partner license verification in onboarding | Integration Lead | 2 weeks |
| 6 | Add FRA license status to partner profile pages | UX Designer | 1 week |
| 7 | Create FRA compliance monitoring dashboard | Admin Team | 2 weeks |
| 8 | Implement automated partner license expiry alerts | Integration Lead | 1 week |

### 5.3 Medium-term (P2)

| # | Action | Owner | Timeline |
|---|--------|-------|----------|
| 9 | Evaluate whether platform activities require FRA registration | Legal Counsel | 4 weeks |
| 10 | If required, apply for FRA intermediary registration | Legal Counsel | 8 weeks |
| 11 | Implement ongoing FRA compliance monitoring | Compliance Engineer | Ongoing |

---

## 6. Partner License Verification

All factoring partners must provide and maintain valid FRA licenses:

| Partner | License Type | License Number | Expiry | Status |
|---------|-------------|---------------|--------|--------|
| Oliv Financial | Factorization | TBD | TBD | Pending verification |
| EFG Hermes Factoring | Factorization | TBD | TBD | Pending verification |

**Verification process:**
1. Partner provides FRA license copy during onboarding
2. Platform validates license number against FRA registry
3. License expiry is tracked and alerts generated 30 days before expiry
4. Expired licenses result in automatic suspension of factoring referrals

---

## 7. Compliance Monitoring

### 7.1 Automated Checks

The `lib/compliance/fra-license.ts` module enforces:

1. **Activity gate:** Blocks any factoring operation that exceeds referral scope
2. **Partner validation:** Verifies partner license status before routing requests
3. **Audit logging:** Records all compliance checks for FRA audit trail

### 7.2 Manual Reviews

| Review | Frequency | Owner |
|--------|-----------|-------|
| Partner license verification | Quarterly | Compliance Engineer |
| Platform activity scope review | Semi-annually | Legal Counsel |
| FRA regulatory update monitoring | Monthly | Compliance Engineer |
| Marketing claims audit | Monthly | Business Strategist |

---

## 8. Disclaimers

All factoring-related marketing materials and UI components must include:

> "HotelsVendors facilitates introductions between hotels and licensed factoring partners. HotelsVendors does not directly provide factoring services, hold cash, or assume credit risk. All factoring operations are conducted by licensed third-party financial institutions regulated by the Financial Regulatory Authority (FRA) of Egypt."

---

## 9. References

- [FRA Official Website](https://fra.gov.eg)
- [Law No. 177 of 2018 — FRA Establishment](https://www.legislation.gov.eg)
- [Law No. 80 of 2002 — Anti-Money Laundering](https://www.legislation.gov.eg)
- [Egyptian Factoring Association](https://egyptianfactoring.org)

---

*End of FRA Licensing Requirements Document*
