# Disaster Recovery Plan

**Version:** 1.0  
**Date:** June 14, 2026  
**Status:** Draft for FRA Inspection  
**Owner:** Hotels Vendors Engineering Team

## 1. Objectives

| Metric | Target |
|--------|--------|
| Recovery Point Objective (RPO) | 1 hour (max data loss) |
| Recovery Time Objective (RTO) | 4 hours (time to restore) |
| RPO for financial transactions | 5 minutes |
| RTO for payment processing | 2 hours |

## 2. Disaster Scenarios

| Scenario | Impact | Recovery Strategy |
|----------|--------|------------------|
| Database corruption | Complete service outage | Restore from point-in-time backup |
| Server failure | Service unavailable | Failover to standby instance |
| Network outage | Service unreachable | Activate secondary network path |
| Region failure | Complete infrastructure loss | Cross-region failover |
| Data breach | Compromised data integrity | Isolate, restore from pre-breach backup |

## 3. Backup Strategy

| Data Type | Frequency | Retention | Location |
|-----------|-----------|-----------|----------|
| PostgreSQL database | Continuous WAL archiving + Daily full backup | 30 days daily, 12 months monthly | Cloud storage + local |
| Application configuration | On change | 90 days | Git repository |
| Uploaded files | Daily | 30 days | Cloudflare R2 |
| Audit logs | Real-time | 3 years | Immutable storage |

## 4. Recovery Procedures

### Database Recovery
1. Stop application servers
2. Restore latest full backup
3. Apply WAL archives to point of failure
4. Verify data integrity (checksums, row counts)
5. Start application servers
6. Verify application functionality

### Full Infrastructure Recovery
1. Provision new server instance
2. Install dependencies (Node.js, PostgreSQL, Redis)
3. Deploy application from latest build artifact
4. Restore database from backup
5. Configure environment variables
6. Run smoke tests
7. Update DNS if needed

## 5. DR Testing

| Test Type | Frequency | Success Criteria |
|-----------|-----------|------------------|
| Backup restore | Monthly | Full restore completed within 2 hours |
| Failover test | Quarterly | Automatic failover within 5 minutes |
| Full DR drill | Bi-annually | Full recovery within RTO |

---
*This document is maintained by the Hotels Vendors Engineering Team.*
