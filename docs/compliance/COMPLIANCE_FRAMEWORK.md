# Compliance Framework

**Version:** 1.0  
**Date:** June 14, 2026  
**Status:** Draft for FRA Inspection

## 1. Regulatory Scope

Hotels Vendors operates in the Arab Republic of Egypt under the following regulatory framework:

| Regulation | Applicability | Status |
|------------|--------------|--------|
| FRA Law 194/2020 (Fintech) | Factoring platform registration | In progress - partnering with licensed entities |
| ETA Law 67/2018 (E-Invoicing) | B2B invoice submission | Integration in progress |
| PDPE Law 151/2020 (Data Privacy) | Personal data processing | Initial compliance measures implemented |
| AML Law 80/2002 | Customer due diligence | KYC framework in development |
| CBE Regulations | Payment aggregation | Compliant via licensed partners |

## 2. Compliance Officer

**Appointed Compliance Officer:** [Name]  
**Contact:** compliance@hotelsvendors.com  
**Alternate:** [Name]

## 3. AML/KYC Framework

### Customer Due Diligence (CDD)
- **Standard CDD:** Required for all platform users (name, email, company verification)
- **Enhanced CDD:** Required for factoring-eligible users (national ID, commercial registration, bank account verification)
- **Ongoing Monitoring:** Transaction pattern analysis for suspicious activity

### Suspicious Activity Reporting
- Internal reporting to Compliance Officer within 24 hours
- SAR filing to FRA/AML unit as required
- Record retention: 5 years per Egyptian law

## 4. Data Protection

### Data Classification
| Classification | Examples | Handling Requirements |
|---------------|----------|----------------------|
| Public | Marketing content, company descriptions | No restrictions |
| Internal | Order data, product catalogs | Access control required |
| Confidential | User PII, financial records | Encryption + access control |
| Restricted | Bank accounts, tax IDs | Encryption + MFA + audit trail |

### Data Flow Diagram
```
User → Platform (encrypted TLS 1.3)
  → PostgreSQL (encrypted at rest AES-256)
  → Licensed Partners (Paymob, Oliv) via API
  → ETA Portal (e-invoice submission)

Platform NEVER holds or custodies customer funds.
All financial processing routed through licensed third parties.
```

## 5. Vendor Risk Management

| Partner | Service | License Status | Last Reviewed |
|---------|---------|---------------|---------------|
| Paymob | Payment processing | CBE licensed | [Date] |
| Oliv Finance | Factoring | FRA licensed | [Date] |
| Cloudflare | CDN, R2 storage | N/A (infrastructure) | [Date] |

---
*This document is maintained by the Hotels Vendors Compliance Team.*
