# Incident Response Plan

**Version:** 1.0  
**Date:** June 14, 2026  
**Status:** Draft for FRA Inspection  
**Owner:** Hotels Vendors Security Team

## 1. Purpose

This document defines the incident response process for Hotels Vendors platform in compliance with Egyptian Data Protection Law 151/2020 and FRA regulations.

## 2. Incident Classification

| Severity | Definition | Examples | Response SLA |
|----------|------------|----------|-------------|
| **CRITICAL** | Active data breach, system compromise, financial fraud | Unauthorized DB access, payment system compromise, customer data exfiltration | 15 min response, 1 hr containment |
| **HIGH** | Service outage affecting multiple tenants, potential data exposure | Extended downtime, partial data exposure, failed payment processing | 30 min response, 4 hr containment |
| **MEDIUM** | Single-tenant issue, non-critical vulnerability discovered | Isolated account compromise, minor data inconsistency | 4 hr response, 24 hr containment |
| **LOW** | Cosmetic issues, informational | UI bugs, non-sensitive log exposure | Next business day |

## 3. Response Team

| Role | Responsibility |
|------|---------------|
| Incident Commander | Coordinates response, makes escalation decisions |
| Security Lead | Investigates technical root cause, containment |
| Engineering Lead | Implements fix, deploys patch |
| Compliance Officer | Assesses regulatory notification requirements |
| Communications Lead | Manages internal and external communications |

## 4. Response Process

### Phase 1: Detection & Assessment (0-15 min)
1. Incident detected via monitoring alert, user report, or automated scan
2. Security Lead assesses severity using the classification matrix
3. If CRITICAL or HIGH: Incident Commander is immediately notified
4. Initial assessment documented in incident log

### Phase 2: Containment (15 min - 4 hr)
1. Isolate affected systems (network segmentation, credential rotation)
2. Block malicious IP addresses or user accounts
3. Take affected services offline if necessary
4. Preserve forensic evidence (logs, snapshots)

### Phase 3: Eradication (1-24 hr)
1. Identify and remove root cause
2. Patch vulnerabilities
3. Rotate all affected credentials
4. Verify no persistent access remains

### Phase 4: Recovery (1-48 hr)
1. Restore affected systems from clean backups
2. Verify system integrity
3. Gradually return services to production
4. Monitor for recurrence

### Phase 5: Post-Mortem (within 5 business days)
1. Conduct root cause analysis
2. Document lessons learned
3. Update security controls
4. Report to regulatory authorities as required

## 5. Regulatory Notification

Under Egyptian law, the following notifications are required:

| Regulation | Notification Trigger | Deadline | Notify |
|------------|---------------------|----------|--------|
| PDPE Law 151/2020 | Personal data breach | 72 hours | Data Protection Authority |
| FRA Regulations | Financial system compromise | 24 hours | FRA |
| CBE Regulations | Payment system incident | 1 hour | Central Bank of Egypt |

## 6. Communication Templates

### Internal Alert
```
[SEVERITY] Incident Detected - [DATE/TIME]
Description: [Brief description]
Affected Systems: [Systems]
Current Status: [Detection/Containment/Recovery]
Incident Commander: [Name]
```

### Customer Notification (if required)
```
Subject: Security Incident Notification
We are writing to inform you of a security incident affecting our platform.
[Description of incident]
[Actions taken]
[Steps you should take]
[Contact information]
```

## 7. Contact Information

| Contact | Details |
|---------|---------|
| Security Team | security@hotelsvendors.com |
| Compliance Officer | compliance@hotelsvendors.com |
| Engineering On-Call | [To be configured] |
| Data Protection Authority | [DPA contact in Egypt] |

## 8. Testing

- Tabletop exercises: Quarterly
- Full incident simulation: Bi-annually
- Backup restoration test: Monthly

---
*This document is maintained by the Hotels Vendors Security Team.*
