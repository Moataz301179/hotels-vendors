# Security & Compliance Documentation
*For QDB Submission & Audit Review*

## Regulatory Compliance Matrix

| Framework | Status | Evidence |
|-----------|--------|----------|
| **Egyptian Data Protection Law (EDPL)** | Compliant | • Data residency in Egyptian servers<br>• User consent management UI<br>• Right to be forgotten implementation |
| **Payment Card Industry (PCI DSS)** | Compliant | • No card data storage<br>• PCI-DSS Self-Assessment Completed<br>• Tokenization for stored payment methods |
| **ISO 27001** | In Progress | • Annual internal audit<br>• ISMS framework implemented<br>• Risk register maintained |
| **SOC 2 Type I** | Planned | Audit scheduled Q3 2026<br>Scope: Data protection processes |
| **FRA Anti-Fraud Compliance** | Compliant | • Three-way matching gate (PO + ETA UUID + GRN)<br>• SHA-256 audit trail for all transactions<br>• FRA Policy v2.1 |

## Authorization Matrix

### Role-Based Access Control (RBAC)

| Role | Permissions | Denied Actions |
|------|-------------|---------------|
| **Hotel Admin** | - Approve orders<br>- View financial reports<br>- Request payments<br>- Manual adjustments | - Bypass payment guarantee gate<br>- Direct bank transfers<br>- Delete settlement history |
| **Supplier** | - Submit products<br>- Upload GRN<br>- View payment status<br>- Request dispute | - Edit order details<br>- Change payment terms<br>- Cancel settled orders |
| **Funder** | - View receivables<br>- Bid on financing<br>- Approve settlement | - Initiate new payments<br>- Alter GRN data<br>- Access hotel operational data |
| **Factoring Officer** | - Review credit risk<br>- Access ledger<br>- Approve settlements<br>- Audit transactions | - Modify payment amounts<br>- View PII of non-order parties |

### Session Authorization Flow
```mermaid
graph TD
  Session -- Jwt -- Auth Middleware --> Role Verification
  Role Verification -- Policy Engine --> Permission Check
  Permission Check -- Matrix Lookup --> Action Execution
  Deny -- Mount Validation Layer --> Block Event
```

## Data Security Controls

### Encryption
- **At Rest:** AES-256-GCM for database, S3://AWS with SSE-KMS
- **In Transit:** 
  - Internal: mTLS between services
  - External: HTTPS 1.3 with Perfect Forward Secrecy
  - WebSocket: TLS 1.3 + rate limiting

### Authentication
- **MFA Options:** TOTP Authenticator, SMS (fallback), Push OAuth
- **Password Policy:** 12+ chars, mixed case, numbers, symbols, 90-day rotation
- **Audit Trails:** All auth events logged to audit.log with JWT claim verification

### Data Retention
| Data Type | Retention Period | Disposal Method |
|-----------|------------------|-----------------|
| Transaction Logs | 3 years | Secure destroy (asset wiping) |
| User Profiles | 5 years after account closure | Anonymization then delete |
| Audit Trails | Permanent (immutable) | Write-once storage |
| Support Chat | 2 years | Encrypted backup |

### Incident Response
```mermaid
graph LR
  Alarm --> Detection --> Containment --> Eradication --> Recovery --> Review
  Incident --> Runbooks --> IRP v3 --> Forensic Team --> Evidence Chain
```

## Security Testing

| Test Type | Frequency | Tools | Owner |
|-----------|-----------|-------|-------|
| Static Analysis | Monthly | Semgrep, Snyk | DevOps |
| Dynamic Scanning | Quarterly | Burp Suite | Security Team |
| Penetration Testing | Annual | OWASP ZAP Pro | External Vendor |
| Red Team Exercise | Biannual | Custom scripts | Security Red Team |
| Compliance Audit | Quarterly | Custom checklists | Compliance Officer |

## Data Governance

### Consent Management
- Explicit opt-in for data collection
- Purpose limitation enforcement
- Withdrawal mechanism in profile settings

### User Rights
- Access Request (GDPR Art. 15)
- Rectification Right (GDPR Art. 16)
- Erasure Right (GDPR Art. 17)
- Data Portability Request (GDPR Art. 20)

### Cross-Border Transfers
- Data never leaves Egypt without explicit consent
- Transfer Risk Assessment required annually

### Auditing
- Quarterly compliance reports generated
- Access to audit logs granted to authorized personnel only
- Logs stored immutable (write-once) in AWS S3 with object lock
