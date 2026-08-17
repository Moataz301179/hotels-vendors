# ESG Policy — HotelsVendors Digital Procurement Hub

**Document ID:** ESG-POL-001  
**Version:** 1.0  
**Effective Date:** 2026-05-14  
**Owner:** Business Strategist + The Auditor  
**Review Cycle:** Quarterly

---

## 1. Environmental Commitments

### 1.1 Carbon Measurement Roadmap

| Phase | Timeline | Action | Owner |
|---|---|---|---|
| **Baseline** | Q3 2026 | Estimate Scope 1+2+3 emissions from VPS, Vercel, Ollama inference, and third-party services | Integration Lead |
| **Tracking** | Q4 2026 | Add per-delivery CO2 estimation to `lib/logistics/load-pooler.ts` (weight × distance × vehicle type) | Integration Lead |
| **Reporting** | Q1 2027 | Publish first annual Sustainability Report with emissions data | Business Strategist |
| **Reduction** | Q2 2027 | Migrate VPS to provider with published renewable energy commitments (Hetzner/OVH) | Integration Lead |

### 1.2 Platform-Enabled Environmental Benefits

The platform inherently reduces environmental impact through:

- **Shared-route logistics:** Demand pooling across hotel clusters reduces individual truck trips by an estimated 30-40%, directly lowering vehicle-km and CO2 emissions.
- **Digital procurement:** Replaces paper-heavy PO/invoice/approval workflows with digital equivalents, eliminating an estimated 500+ sheets per order.
- **Storage-to-Revenue model:** Daily ordering frees 60% of hotel storage space, reducing the need for new construction and associated embodied carbon.
- **ETA e-invoicing:** Digital tax compliance replaces paper submissions, eliminating 2-3 pages per invoice across thousands of transactions.

### 1.3 Energy-Efficient Coding Practices

- All fonts use `display: "swap"` to avoid FOIT (Flash of Invisible Text)
- Service Worker registered for PWA — reduces repeated network requests
- Image lazy loading on marketplace product views
- DNS prefetch for external domains to reduce connection latency

---

## 2. Social Impact Metrics

### 2.1 SME Supplier Empowerment (Shark-Breaker Model)

| Metric | Target (Year 1) | Measurement |
|---|---|---|
| SME suppliers onboarded | 200+ | Platform registration data |
| Supplier revenue generated | EGP 50M+ | Transaction volume reports |
| Jobs created/retained | 500+ | Supplier self-reported surveys |
| Supplier CAC decline | $150 → $40 | Customer acquisition cost tracking |
| Factoring disbursements | EGP 20M+ | `lib/fintech/factoring-bridge.ts` logs |

### 2.2 Accessibility Commitments

- **WCAG 2.2 AA compliance** as minimum standard
- Skip navigation links on all layouts
- Reduced motion support via `prefers-reduced-motion`
- Descriptive alt text on all meaningful images
- ARIA landmarks on all dashboard and marketing pages
- Visible focus indicators on all interactive elements
- Cookie consent management for GDPR/EDPL compliance

### 2.3 Employment Impact

The platform creates more jobs than it displaces:

- **Hotel procurement staff** transition from manual order-taking to strategic sourcing roles
- **SME suppliers** gain access to more customers, enabling job creation
- **Logistics drivers** gain employment through the shared-route model
- **Factoring partners** gain a new distribution channel

### 2.4 Multi-Language Support

- Arabic/English translations defined in `lib/i18n/translations.ts`
- RTL layout support planned for full Arabic accessibility
- Arabic category names for hospitality SKU taxonomy

---

## 3. Governance Practices

### 3.1 Authority Matrix

The Authority Matrix (`lib/auth/authority-matrix.ts`) governs all order mutations through:

- **Multi-dimensional rules:** hotel_id × user_role × order_value × supplier_tier → action
- **Priority-based evaluation:** Rules evaluated by priority; first match wins
- **Dual sign-off:** Orders exceeding EGP 500K require dual authorization
- **Admin override controls:** Requires two admin signatures, 20+ character reason, and generates an escalated alert
- **Immutable audit trail:** All approval/rejection actions write `beforeState`/`afterState` to `AuditLog` with hash chaining

### 3.2 Audit Trail Integrity

- `AuditLog` model uses SHA-256 hash chaining (`previousHash` → `hash`) for tamper-proof records
- All financial mutations (orders, invoices, payments, factoring) are audit-logged
- Idempotency keys prevent duplicate financial transactions
- Console.log in production code paths is being replaced with structured Pino logging

### 3.3 Compliance Framework

| Regulation | Status | Implementation |
|---|---|---|
| ETA E-Invoicing | Core infrastructure built | `lib/eta/client.ts`, `lib/eta/validator.ts` |
| FRA Standards | Designed | Authority Matrix enforces FRA requirements |
| EDPL (Egyptian Data Protection) | Partial | Consent management UI (cookie banner) implemented |
| GDPR | Partial | Cookie consent; data subject rights documented |
| SOC 2 Type I | Planned Q3 2026 | Annual internal audit, ISMS framework |

### 3.4 Responsible AI

- AI assistants are role-specific with defined data boundaries
- Smart Fix engine provides explainability for credit decisions
- Human-in-the-loop enforced: AI recommends, humans decide
- Cross-tenant data isolation prevents unauthorized data access

### 3.5 Anti-Corruption (Planned)

- Immutable audit trails serve as deterrent and evidence
- Dual-authorization on high-value mutations reduces single-point corruption risk
- Formal Anti-Corruption & Bribery Policy planned for Q3 2026

---

## 4. Reporting Cadence

| Report | Frequency | Owner |
|---|---|---|
| ESG Scorecard | Quarterly | Business Strategist |
| Carbon Footprint Estimate | Annually | Integration Lead |
| SME Empowerment Report | Quarterly | Business Strategist |
| Authority Matrix Audit | Monthly | The Auditor |
| Data Lifecycle Review | Quarterly | Security Expert |

---

*This policy is a living document. It will be updated as the platform progresses from pre-revenue to operational status.*
