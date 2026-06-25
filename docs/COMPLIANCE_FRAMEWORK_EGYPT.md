# Egypt Compliance Framework for HotelsVendors.com

Research date: June 2026. Status: READ-ONLY research — reflects publicly verifiable sources as of June 2026. Validate every mandatory item against current regulator guidance before filing.

---

## 1. ETA E-Invoicing (Egyptian Tax Authority)

**Status: MANDATORY for all VAT-registered businesses**

- Legal basis: Law No. 206 of 2020; Resolution No. 281 of 2025.
- All VAT-registered B2B entities must issue structured electronic invoices (XML/JSON) through ETA's pre-clearance/real-time platform. Paper invoices no longer valid for input VAT deduction.
- ETA validates 47 mandatory fields; UBL 2.1 is the accepted XML format. JSON also accepted, 20-30% faster.
- As of Jan 2025 mandate expanded to B2C e-receipts (relevant only if platform ever serves consumers directly).

**Registration process:**
1. Obtain TRN from local ETA office (3-5 business days)
2. Register on ETA portal (eta.gov.eg)
3. Acquire digital-signature hardware: USB token EGP 2,000-3,500 or HSM EGP 8,000-12,000
4. Generate API credentials (Client ID + Secret) for ERP integration

**Timeline:** 10-15 business days to go live.

**Threshold:** lowered from EGP 500,000 to EGP 250,000 annual revenue. Businesses over this must register by 31 March 2026. Penalty: EGP 20,000 + EGP 1,000/day.

**Marketplace note:** No ETA guidance specifically addresses B2B marketplaces. Standard B2B pre-clearance rules apply to every VAT-registered supplier. If HotelsVendors is itself VAT-registered (it should be), it must issue e-invoices on its own supplies. Whether a marketplace must issue e-invoices on behalf of unregistered small suppliers is not specifically addressed — seek ETA confirmation.

---

## 2. VAT & ETA Digital Guidelines for Marketplaces

**Status: MANDATORY (registration, once threshold crossed)**

- VAT registration threshold: Mandatory when annual turnover exceeds EGP 500,000. (The EGP 250,000 threshold above concerns e-invoicing enrollment, not VAT registration itself.)
- For B2B supplies: reverse-charge mechanism applies. The resident taxpayer (hotel or supplier) self-accounts for VAT. The non-resident marketplace has no obligation to register for purely B2B services.
- For B2C supplies via Electronic Distribution Platform (EDP): the non-resident must register under simplified regime if turnover exceeds EGP 500,000 in any 12 months.
- VAT rate: standard 14%; 10% for professional/consultancy services.
- Commissions: subject to VAT. The marketplace must account for VAT on fees collected.

**Practical reading:** Because HotelsVendors is B2B-focused (hotels buying from suppliers), under current ETA guidance it is treated as a resident platform providing B2B services. The reverse-charge mechanism means the supplier is generally the taxable person. HotelsVendors still needs its own VAT registration and TRN because it charges commissions.

---

## 3. Paymob / Payment Processing Licenses — Central Bank of Egypt (CBE)

**Status: MANDATORY for any entity that processes, routes, or intermediates payment transactions**

- CBE issued new Rules for Licensing and Registration of Payment System Operators and PSPs in June 2025, effective immediately, with a 12-month transition ending June 2026.
- CBE has issued dedicated "Technical Payment Aggregators & Payment Facilitators Regulations" (PDF on cbe.org.eg). Directly relevant to the marketplace model.

**License categories (PSO/PSP):**

| License | Activity | Min. capital |
|---|---|---|
| PSP Category A | > EGP 750M monthly transactions | EGP 30M (~USD 600K) |
| PSP Category B | ≤ EGP 750M monthly (excluding payment-order initiation / account info services) | EGP 10M (~USD 200K) |
| Payment Order Creation / Account Information Service Provider | Specific | EGP 20M (~USD 400K) |
| Payment System Operator (PSO) | Operates clearing, settlement, or transaction routing infrastructure | EGP 500M |

Covered activities: cash deposits/withdrawals, fund transfers, payment-instrument acceptance, issuing/managing electronic payment instruments, processing electronic payment transactions, remittances, payment-order creation, electronic money issuance. Payment aggregation across multiple merchants and payment facilitation explicitly fall within scope.

**What HotelsVendors needs:** at minimum a PSP Category B license (unless volume exceeds EGP 750M/month), plus coverage under the Payment Aggregator/Payment Facilitator regulations.

**Application process:**
1. Obtain CBE preliminary "green light" approval
2. Apply for the specific PSO or PSP license
3. Demonstrate technical expertise, reputation, full ownership/UBO disclosure, and a bank collaboration agreement
4. Ongoing compliance: AML, KYC, data protection, regular reporting

**Foreign institutions:** must obtain a CBE license, be licensed in home jurisdiction with 2+ years' experience, and appoint a local representative.

**Paymob specifically:** public reporting confirms Paymob is an Egyptian fintech processing payments regionally. It holds a UAE Central Bank retail payment services licence (Jan 2025) but no public record of its specific CBE license category in Egypt was found. HotelsVendors should confirm with Paymob whether it is acting as a licensed PSP/aggregator and under what authorization.

---

## 4. Financial Regulatory Authority (FRA) — Non-Bank Financial Licenses

**Status: MANDATORY if HotelsVendors offers factoring, lending, insurance, or other non-bank financial services**

- FRA mandate: Insurers, capital markets, mortgage finance, financial leasing, factoring (debt purchase), consumer finance, microfinance, insurance intermediation/insurtech, BNPL, crowdfunding. Confirmed by FRA official portal listings and multiple law-firm analyses.
- FRA explicitly lists "Factoring company licensing" as one of its non-bank financial license categories.
- **Key FRA ownership/economic test:** "Companies must have at least 25% of their capital owned by a financial institution or qualified investor."

**Typical timelines:**
- 6 months to complete establishment procedures after preliminary approval (extendable)
- 3 months to fulfill licensing requirements after commercial registration (extendable)
- 6 months to start operations after obtaining the license (extendable)

**What this means for HotelsVendors:**
- Current license does not permit cash custody or factoring (consistent with CEO's earlier statement).
- If the marketplace plans to offer supplier factoring (buying hotel receivables), FRA factoring license is mandatory.
- If offering embedded insurance, BNPL, or lending, separate FRA licenses apply.
- If the marketplace never touches the flow of funds beyond passing payments through a licensed PSP, FRA is not triggered.

---

## 5. Egypt Personal Data Protection Law (PDPL) — Law 151/2020 + Executive Regulations

**Status: MANDATORY**

- PDPL Law 151/2020; Executive Regulations issued by Minister of Telecommunications Decree No. 816 of 2025 (published Nov 2025; effective 02/11/2025). Nine-month transition until ~Aug 2026 — enforcement deadline flagged Nov 2026.

**What is required:**
- Controllers and processors must obtain a license or permit from the specialized Center, scaled to data volume.
- **Annual license fee structure:**
  - 1-100,000 records: exempt
  - 101,000-1,000,000: EGP 200-1,000
  - Above 1M records: progressive up to EGP 666,666 (~USD 13K) per year
  - Controller-only or processor-only: half the combined fee
- Required documents: commercial register, technical infrastructure details, security procedures, Data Protection Officer contract, proof of consent mechanisms.
- **Breach notification:** notify the Center within 72 hours; notify data subjects within 3 business days.
- **Sensitive data:** explicit written consent.
- **Children under 15:** explicit written guardian consent.
- **Cross-border transfers:** require a separate license/permit based on adequacy assessment.
- Foreign controllers without an Egyptian office: must appoint a local representative accredited by the Center.
- **Data Protection Officer:** must be appointed and registered (decisions within 30 business days).

**Penalties:** EGP 100,000 to EGP 5,000,000 for serious violations, plus possible imprisonment.

**Timeline:** License/permit decisions within 90 business days of complete submission.

**Practical reading:** Broadly equivalent to GDPR in structure. HotelsVendors will register as a controller (and likely also a processor on behalf of principals). Supplier and hotel data both count. Given supplier + hotel PII volumes, expect annual fee at least mid-five-figures EGP.

**Recommended pre-compliance actions:** data mapping, gap analysis, DPO appointment, consent management system, cross-border transfer mechanism.

---

## 6. Commercial Registration, Chamber of Commerce, and Sector Licenses

**Status: MANDATORY (baseline)**

**Company formation process at GAFI:**
1. Name reservation — 1-2 business days
2. Draft & notarize Articles of Association (Arabic) — 2-5 business days
3. GAFI one-stop-shop filing — 3-7 business days
4. Commercial Registry Certificate issued
5. Tax card issued (within GAFI process)
6. Open corporate bank account — 1-4 weeks

**Total incorporation timeline:** 3-7 business days (basic LLC) to 4-8 weeks operational readiness.

**E-commerce specific license:** No separate "e-commerce license" in Egypt. "E-commerce" or "electronic trading" must be included in the company's commercial register activities. Sector-specific approvals only triggered for regulated goods (food, health products, etc.), not general B2B marketplace activities. No separate e-commerce license required by the Consumer Protection Agency either; the CPA's "Regulated E-Commerce" initiative targets consumer-facing platforms.

**Chamber of Commerce (e.g., Cairo Chamber of Commerce):** Strongly recommended, often required for public-tender participation and because many foreign buyers expect it. Not legally mandated for a purely private B2B marketplace, but in practice is a KYC signal counterparties and regulators ask for.

**Trademark:** Not mandatory. First-to-file system. Strongly recommended to register "hotelsvendors.com" with the Egyptian Trademarks Office (EITO) to block cybersquatting. Process: 18-24 months. Cost: EGP 5,800-9,700 per class, filed through a licensed Egyptian trademark agent.

**Other good-practice registrations:** register on the ITDA (Industry and Trade Development Authority) supplier databases if planning to serve government/tourism-tender-adjacent hotels.

---

## 7. ISO Certifications Relevant to HotelsVendors.com

### ISO 27001 (Information Security Management)

**Status: NOT mandated by Egyptian law. RECOMMENDED — effectively essential when selling to large hotel chains.**

- No Egyptian statute requires ISO 27001 as of 2026.
- Public-tender rules increasingly reference ISO 9001; trend likely to extend to ISO 27001 in IT/cybersecurity procurement, though not yet verified as across-the-board mandate.
- Large Egyptian and international hotel chains require it of vendors that touch their data.
- Certification process: typically 3-6 months for a prepared SME (gap analysis + ISMS build + Stage 1 + Stage 2 certification audit by EGAC-accredited body). EGAC (Egyptian Accreditation Council) accredits certification bodies.

### ISO 9001 (Quality Management)

**Status: NOT mandated by law. RECOMMENDED. Almost a standard clause in Egyptian public tenders.**

- Government tender pre-qualification commonly requires ISO 9001; private B2B buyers increasingly do too.
- EGAC-accredited certification bodies available in Egypt.
- Timeline: 3-6 months for a small entity.

**NB:** Neither ISO requires Egyptian accreditation; an internationally accredited certificate is valid. But if a specific government tender requires EGAC accreditation of the certifier, that condition should be verified in the tender documents.

---

## 8. Supplier-Side Quality Certifications for Hotel Suppliers

These are requirements FOR THE SUPPLIERS, but a well-gated marketplace should verify them.

### HACCP (food safety)

**Status: MANDATORY in practice for any supplier seeking an NFSA operating license; effectively mandatory for food-service suppliers to hotels as of 2026.**

- NFSA (National Food Safety Authority) under Law No. 1 of 2017 is the unified food-safety authority. It licenses, labels, inspects, and runs traceability programs across all food facilities.
- 2026 NFSA hospitality regulations confirm: mandatory HACCP for hospitality establishments; new businesses compliant from Jan 2026; existing ones must submit HACCP plans by Apr 2026, full compliance by July 2026.
- Hotels will contractually require suppliers to present HACCP and NFSA license documentation. Marketplace should demand this during onboarding.

### ISO 22000 (Food Safety Management)

**Status: RECOMMENDED (voluntary unless a hotel contract requires it).**

- Covers the entire food chain from raw material to finished product.
- Supports compliance with HACCP and NFSA requirements.
- Useful differentiator for F&B suppliers; reduces buyer audit frequency.

### HALAL certification

**Status: MANDATORY for certain food categories; RECOMMENDED for all F&B suppliers serving hotels with Gulf/MENA guests.**

- Egypt notified WTO of mandatory Halal requirements for food products (EG2022-0021).
- Dairy: deadline extended to 31 Dec 2025 (per USDA FAIN reports EG2023-0027 and EG2024-0025).
- EGAC (Egyptian Accreditation Council) accredits Halal certification bodies.
- Hotels serving Gulf tourists will require Halal-certified F&B suppliers as a contractual matter even where the law does not.

### OEKO-TEX (textiles/linens)

**Status: RECOMMENDED. Not mandated by Egyptian law.**

- Voluntary international standard for textile safety.
- Relevant for hotel linen, towel, and uniform suppliers.
- Useful differentiator for quality positioning; some international hotel chains require it.
- Testex/OETI Egypt (Giza) and Hohenstein-accredited labs can certify locally.

### GMP (Good Manufacturing Practice)

**Status: RECOMMENDED for food/cosmetics manufacturers.**

- 3-year certificate, annual surveillance audits.
- Relevant for cosmetics, supplements, packaged-food suppliers to hotels.

---

## 9. Other Regulatory Points to Watch

### PCI DSS (Payment Card Industry Data Security Standard)

**Status: NOT mandated by Egyptian law. CONTRACTUAL requirement of Visa/Mastercard — effectively mandatory if accepting card payments.**

- HotelsVendors should never store card data; use Paymob's hosted fields / tokenization to stay out of PCI scope (SAQ-A or SAQ-A-EP).
- If it ever handles card data directly, Level depends on annual transaction volume (Level 4: <20,000 txn/year; Level 1: >6M txn/year).

### AML/CFT compliance

**Status: MANDATORY for PSPs/PSOs under CBE regulations; good practice for all marketplaces.**

- Law No. 80 of 2002 (as amended) is Egypt's anti-money-laundering statute.
- CBE-licensed PSPs must implement KYC, transaction monitoring, and suspicious-activity reporting.
- Even before licensing, marketplace onboarding should include supplier identity verification.

### Consumer Protection Law (Law No. 181 of 2018)

**Status: MANDATORY for B2C; relevant to B2B as a reputational/legal benchmark.**

- The CPA's "Regulated E-Commerce" initiative targets consumer-facing platforms.
- For B2B: the Commercial Code and general contract law govern. The platform is typically treated as a service provider facilitating transactions, not a direct party to sales — but liability can attach if the platform fails to verify seller legitimacy or ignores violations.

### Cross-border data transfers

**Status: MANDATORY to license under PDPL if transferring personal data outside Egypt.**

- PDPL requires a separate license/permit based on adequacy assessment.
- If HotelsVendors uses AWS/GCP/Azure in EU/US regions, this triggers the requirement.

### E-Signature Law (Law No. 15 of 2004)

**Status: MANDATORY for electronic contracts to have legal weight.**

- Electronic signatures have equal legal weight to handwritten ones.
- Use qualified digital signatures (ETA-issued or equivalent) for contracts with suppliers and hotels.

---

## 10. Compliance Prioritization Matrix

| Priority | Item | Status | Trigger |
|---|---|---|---|
| 1 | GAFI incorporation + commercial register + tax card | MANDATORY | Before launch |
| 2 | VAT registration + TRN | MANDATORY | Before launch (or immediately upon exceeding EGP 500K) |
| 3 | ETA e-invoicing enrollment | MANDATORY | Before issuing first invoice |
| 4 | PDPL license (controller + processor) | MANDATORY | Before processing supplier/hotel PII at scale |
| 5 | CBE PSP Category B license (or use Paymob as licensed PSP) | MANDATORY | Before holding/intermediating any payment |
| 6 | AML/CFT program | MANDATORY | Concurrent with PSP license |
| 7 | PCI DSS compliance (SAQ-A via Paymob) | CONTRACTUAL | Before accepting card payments |
| 8 | ISO 27001 | RECOMMENDED | Before onboarding large hotel chains |
| 9 | ISO 9001 | RECOMMENDED | Before bidding on government tenders |
| 10 | Trademark registration (EITO) | RECOMMENDED | Before launch |
| 11 | Supplier onboarding: HACCP + NFSA license verification | MANDATORY (for F&B suppliers) | Before listing F&B suppliers |
| 12 | Supplier onboarding: HALAL cert verification | MANDATORY (for relevant F&B) | Before listing F&B suppliers |
| 13 | FRA factoring license | MANDATORY only if offering factoring | Only if factoring product launches |
| 14 | Cross-border data transfer license (PDPL) | MANDATORY if EU/US data flows | Before using non-Egyptian cloud |

---

## 11. Open Questions / Unverified Items

The following could not be verified from authoritative Egyptian-government primary sources — recommend direct confirmation:

1. **ETA marketplace e-invoicing rules** — no published guidance specifically addressing whether a B2B marketplace must issue e-invoices on behalf of unregistered small suppliers. Seek ETA ruling.
2. **Paymob's specific CBE license category** — not publicly disclosed in sources located. Confirm directly with Paymob.
3. **FRA sandbox duration** — one source cited 90 days, but not verified on the FRA portal.
4. **Whether the CPA "Regulated E-Commerce" initiative will impose a registration requirement on B2B platforms** — current reporting suggests consumer-focused, but the initiative is new and could expand.
5. **Exact penalty amounts under PDPL** — the executive regulations reference financial penalties set by the Center but the published schedule was not located. The EGP 100K-5M range is from the law itself.
6. **Whether a separate "e-commerce license" will be introduced** — Egypt's Consumer Protection Agency has signaled interest in regulating e-commerce more formally; no law published yet.

---

## 12. Recommended Compliance Roadmap (First 12 Months)

**Month 1-2:** GAFI incorporation, commercial register, tax card, TRN, VAT registration, ETA e-invoicing enrollment, trademark filing.

**Month 2-3:** PDPL gap analysis, DPO appointment, data-mapping, initiate PDPL license application, confirm Paymob CBE license coverage.

**Month 3-4:** PSP license application (if building own payment rail) OR Paymob contract + AML/KYC program build-out.

**Month 4-6:** PCI DSS SAQ-A self-assessment, supplier onboarding framework (HACCP/HALAL/NFSA verification for F&B; OEKO-TEX for linens), ISO 27001 gap analysis.

**Month 6-9:** ISO 27001 implementation, ISO 9001 (if targeting government tenders), PDPL license approval expected.

**Month 9-12:** Full go-live compliance, surveillance audits preparation, cross-border data transfer license (if needed), FRA factoring license (if factoring product planned).

---

## Sources

- https://www.cleartax.com/eg/en/e-invoicing-egypt
- https://www.avalara.com/us/en/vatlive/country-guides/africa-and-middle-east/egypt-vat/egyptian-e-invoicing.html
- https://www.voxelgroup.net/compliance/guides/egypt/
- https://www.fonoa.com/resources/blog/egypt-publishes-updated-guides-on-e-invoicing-obligations
- https://www.eta.gov.eg/en/content/guides-dealing-electronic-invoices-system
- https://www.eta.gov.eg/en/content/egyptian-tax-authority-eta-has-recently-published-value-added-tax-vat-guidelines-digital
- https://vatabout.com/egypts-vat-rules-for-marketplaces--digital-services-key-compliance-guide
- https://www.ey.com/en_gl/technical/tax-alerts/egypt-introduces-vat-guidelines-for-nonresident-providers-of-rem
- https://docnova.ai/egypt-vat-rules-mandatory-trn-and-uin-validation/
- https://shehatalaw.com/law-update/cbe-regulations-licensing-payment-operators/
- https://launchbaseafrica.com/2025/06/24/the-rulebook-for-egypts-fintech-startups-has-changed-heres-how-to-get-licensed/
- https://www.cbe.org.eg/en/news-publications/news/2025/06/19/08/20/psos-and-psps-licensing-rules
- https://www.cbe.org.eg/-/media/project/cbe/listing/circulars/payments-regulations/technical-payment-aggregators-payment-facilitators-regulations_en_pos.pdf
- https://moneywiki.app/regulators/financial-regulatory-authority-egypt
- https://payatlas.com/regulator/fra-4716
- https://fra.gov.eg/en/
- https://cryptolicenses.net/corporate-services/fintech-licensing/egypt/
- https://adsero.me/fra-implements-new-licensing-standards-for-non-banking-financial-activities/
- https://consortiolawfirm.com/egypt-data-protection-law-executive-regulations-2025-english/
- https://tenintel.com/egypt-pdpl/
- https://www.recordinglaw.com/world-laws/world-data-privacy-laws/egypt-data-privacy-laws/
- https://www.lexology.com/library/detail.aspx?334b6157-bbeb-474d-ba67-11140e89cc07
- https://iclg.com/practice-areas/data-protection-laws-and-regulations/egypt
- https://911digital.co/en/blogs/how-to-start-an-e-commerce-business-in-egypt-complete-guide
- https://almajidilaw.com/legal-considerations-when-launching-an-e-commerce-business-in-egypt/
- https://ig-bs.com/articles/how-to-register-company-egypt
- https://www.mondaq.com/advertising-marketing-branding/1702228/marketplace-liability-in-egypt-evolving-roles-in-the-digital-economy
- https://www.businesstodayegypt.com/Article/1/5769/Consumer-Protection-Agency-launches-%E2%80%9CRegulated-E-Commerce%E2%8D-initiative-to-address
- https://www.tra.gov.eg/en/ntra-obtains-iso-27001-of-information-security-systems/
- https://qcert360.com/winning-government-tenders-with-iso-compliance-in-egypt/
- https://egac.gov.eg/en/egac_services/management-system-certification-bodies/
- https://swissmena.com/new-regulations-food-safety-egypt-hospitality-2026/
- https://youssrysaleh.com/en/food-safety-in-egypt/
- https://www.kitchenthree.co/blog/haccp-requirements-for-small-food-businesses-in-egypt
- https://egac.gov.eg/en/egac_services/halal-certification-bodies/
- https://apps.fas.usda.gov/newgainapi/api/Report/DownloadReportByFileName?fileName=Egypt+Further+Extends+Deadline+for+Requiring+Halal+Dairy+Certification+Until+December+31+2025_Cairo_Egypt_EG2024-0025.pdf
- https://qcert360.com/food-safety-certifications-in-egypt/
- https://www.oeko-tex.com/en/
