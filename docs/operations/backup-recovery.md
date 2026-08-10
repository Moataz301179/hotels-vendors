# Backup & Recovery — Hotels Vendors

> **Owner:** The Auditor (Operational Excellence)  
> **Last Updated:** 2026-07-14  
> **Compliance:** Egyptian Data Protection Law (Law No. 151 of 2020), GDPR Art. 32

---

## Backup Strategy

### Database (PostgreSQL)

| Item | Value |
|------|-------|
| Method | `pg_dump` via cron |
| Frequency | Daily at 03:00 UTC |
| Retention | 30 days |
| Location | `/var/backups/hotels-vendors/` |
| Format | Compressed SQL (`gzip`) |
| Naming | `hotelsvendors-YYYYMMDD.sql.gz` |

### Cron Configuration
```bash
# /etc/cron.d/hotelsvendors-backup
0 3 * * * root pg_dump -U postgres hotelsvendors | gzip > /var/backups/hotels-vendors/hotelsvendors-$(date +\%Y\%m\%d).sql.gz
```

### Redis Persistence
- RDB snapshots: `save 900 1`, `save 300 10`, `save 60 10000`
- AOF: `appendonly yes` (recommended for production)
- Backup location: `/var/lib/redis/dump.rdb`

---

## Backup Verification

### Automated Verification
Run weekly via cron:
```bash
# /etc/cron.d/hotelsvendors-verify-backup
0 4 * * 0 root /var/www/hotelsvendors/scripts/verify-backup.sh >> /var/log/hotels-vendors/backup-verify.log 2>&1
```

### Manual Verification
```bash
cd /var/www/hotelsvendors
./scripts/verify-backup.sh
```

### What Verification Tests
1. ✅ Backup file exists and is non-empty
2. ✅ Gzip integrity check passes
3. ✅ Restore to temporary database succeeds
4. ✅ All critical tables exist (User, Tenant, Order, Invoice, Product, AuditLog, SwarmJob)
5. ✅ Record counts are non-zero (for populated tables)
6. ✅ AuditLog hash chain has no orphaned entries

---

## Recovery Procedures

### Scenario: Accidental Data Deletion
```bash
# 1. Stop writes immediately
pm2 stop hotels-vendors

# 2. Restore to point-in-time (if WAL archiving enabled)
# Or restore latest backup
gunzip -c /var/backups/hotels-vendors/hotelsvendors-YYYYMMDD.sql.gz | \
  sudo -u postgres psql -d hotelsvendors

# 3. Restart application
pm2 start hotels-vendors
```

### Scenario: Database Corruption
```bash
# 1. Take existing DB offline
docker stop hv-postgres

# 2. Backup corrupted state for investigation
docker cp hv-postgres:/var/lib/postgresql/data /var/secure/corrupted-db-$(date +%s)

# 3. Start fresh and restore
docker start hv-postgres
sleep 5

# 4. Restore from backup
gunzip -c /var/backups/hotels-vendors/hotelsvendors-YYYYMMDD.sql.gz | \
  docker exec -i hv-postgres psql -U postgres -d hotelsvendors

# 5. Verify
./scripts/verify-backup.sh
```

### Scenario: Full VPS Failure
1. Provision new VPS
2. Install Docker + Docker Compose
3. Clone repository
4. Restore latest backup from `/var/backups/` (if on separate volume)
5. Deploy via `docker-compose.swarm.yml`
6. Verify health check

**Note:** For true disaster recovery, backups should be replicated to a separate region (S3, GCS). Current setup stores backups on the same VPS — this is a known risk.

---

## Retention Policy

| Data Type | Retention | Legal Basis |
|-----------|-----------|-------------|
| Database backups | 30 days | Operational need |
| Audit logs | 10 years | Egyptian tax law |
| Invoices | 10 years | Egyptian tax law |
| User accounts | Account lifetime + 7 years | Data protection law |
| Application logs | 30 days | Operational need |
| Redis snapshots | 7 days | Operational need |

---

## Offsite Backup (Recommended)

Current state: Backups stored on same VPS. **This is a risk.**

### Recommended: S3 Replication
```bash
# Add to backup cron
0 4 * * * root aws s3 cp /var/backups/hotels-vendors/hotelsvendors-$(date +\%Y\%m\%d).sql.gz \
  s3://hotelsvendors-backups/$(date +\%Y)/$(date +\%m)/hotelsvendors-$(date +\%Y\%m\%d).sql.gz \
  --storage-class STANDARD_IA
```

### Recommended: S3 Lifecycle
```json
{
  "Rules": [
    {
      "ID": "BackupLifecycle",
      "Status": "Enabled",
      "Transitions": [
        { "Days": 30, "StorageClass": "GLACIER" },
        { "Days": 365, "StorageClass": "DEEP_ARCHIVE" }
      ],
      "Expiration": { "Days": 3650 }
    }
  ]
}
```

---

## Monitoring

### Backup Health Checks
- Alert if no backup file created in 25 hours
- Alert if backup file is < 1KB (empty/corrupted)
- Alert if verification script fails

### Integration with Alerting
```typescript
// In lib/monitoring/alerts.ts
export const alerts = {
  backupMissing: () =>
    alertHigh("Backup Missing", "No backup file created in the last 25 hours."),
  backupCorrupted: (file: string) =>
    alertCritical("Backup Corrupted", `Backup verification failed for ${file}.`),
};
```
