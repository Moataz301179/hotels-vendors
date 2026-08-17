# Operational Runbooks — Hotels Vendors

> **Owner:** The Auditor (Operational Excellence)  
> **Last Updated:** 2026-07-14  
> **Scope:** All production operational scenarios

---

## Table of Contents

1. [Service Restart](#1-service-restart)
2. [Database Recovery](#2-database-recovery)
3. [Redis Recovery](#3-redis-recovery)
4. [ETA API Outage](#4-eta-api-outage)
5. [High Memory Usage](#5-high-memory-usage)
6. [Disk Space Exhaustion](#6-disk-space-exhaustion)
7. [SSL Certificate Expiry](#7-ssl-certificate-expiry)
8. [BullMQ Queue Backup](#8-bullmq-queue-backup)
9. [Failed Deployment Rollback](#9-failed-deployment-rollback)
10. [Security Incident](#10-security-incident)

---

## 1. Service Restart

**Trigger:** Application unresponsive, health check failing, high error rate

### PM2 (Native)
```bash
# Check status
pm2 status

# Restart with zero downtime
pm2 reload hotels-vendors

# Full restart (stops and starts)
pm2 restart hotels-vendors

# View logs after restart
pm2 logs hotels-vendors --lines 50
```

### Docker Compose
```bash
cd /var/www/hotelsvendors

# Restart just the app container
docker compose -f docker-compose.swarm.yml restart app

# Rebuild and restart
docker compose -f docker-compose.swarm.yml up -d --build app

# Full stack restart
docker compose -f docker-compose.swarm.yml down
docker compose -f docker-compose.swarm.yml up -d
```

### Verification
```bash
curl -sf https://www.hotelsvendors.com/api/health | jq .
# Expected: { "status": "healthy", ... }
```

---

## 2. Database Recovery

**Trigger:** PostgreSQL connection failures, data corruption, accidental deletion

### Check PostgreSQL Status
```bash
# Docker
docker exec hv-postgres pg_isready

# Native
systemctl status postgresql
sudo -u postgres psql -c "SELECT 1;"
```

### Restore from Backup
```bash
# List available backups
ls -lht /var/backups/hotels-vendors/*.sql.gz

# Restore latest backup
gunzip -c /var/backups/hotels-vendors/hotelsvendors-YYYYMMDD.sql.gz | \
  sudo -u postgres psql -d hotelsvendors

# Or via Docker
gunzip -c /var/backups/hotels-vendors/hotelsvendors-YYYYMMDD.sql.gz | \
  docker exec -i hv-postgres psql -U postgres -d hotelsvendors
```

### Verify Restore
```bash
# Run the verification script
./scripts/verify-backup.sh

# Manual check
psql -d hotelsvendors -c "SELECT COUNT(*) FROM \"AuditLog\";"
psql -d hotelsvendors -c "SELECT COUNT(*) FROM \"Tenant\";"
```

### Connection Pool Exhaustion
```bash
# Check active connections
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"

# Kill idle connections > 5 minutes
sudo -u postgres psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle' AND query_start < now() - interval '5 minutes';"
```

---

## 3. Redis Recovery

**Trigger:** Redis connection failures, memory exhaustion, data loss

### Check Redis Status
```bash
# Docker
docker exec hv-redis redis-cli ping
# Expected: PONG

# Check memory usage
docker exec hv-redis redis-cli info memory | grep used_memory_human
```

### Restart Redis
```bash
# Docker
docker compose -f docker-compose.swarm.yml restart redis

# Native
sudo systemctl restart redis
```

### Flush Redis (Nuclear Option)
```bash
# ONLY if in-memory fallback is active and Redis data is corrupted
docker exec hv-redis redis-cli FLUSHALL
# Then restart the app to reconnect
```

---

## 4. ETA API Outage

**Trigger:** ETA e-invoicing submissions failing, timeout errors

### Check ETA Queue Depth
```bash
# Via health dashboard
curl -sf https://www.hotelsvendors.com/api/health | jq .checks

# Via Prisma (if DB accessible)
psql -d hotelsvendors -c "SELECT \"etaStatus\", COUNT(*) FROM \"Invoice\" GROUP BY \"etaStatus\";"
```

### Monitor Dead-Letter Queue
```bash
# Check DLQ jobs
psql -d hotelsvendors -c "SELECT COUNT(*) FROM \"SwarmJob\" WHERE \"queueName\" LIKE '%eta-dead-letter%' AND status = 'FAILED';"
```

### Manual Retry Failed Submissions
```bash
# Via admin dashboard: Admin → Health → Dead Letter Queue → Retry
# Or via API (admin only):
curl -X POST https://www.hotelsvendors.com/api/v1/admin/eta/retry \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"invoiceId": "INV-xxx"}'
```

### ETA Status Codes
| Status | Meaning | Action |
|--------|---------|--------|
| `DRAFT` | Not yet submitted | Submit via queue |
| `SUBMITTING` | In transit to ETA | Wait, check ETA status |
| `ACCEPTED` | ETA accepted | No action needed |
| `REJECTED` | ETA rejected | Fix payload, resubmit |
| `MANUAL_RESOLUTION` | DLQ — needs human review | Check error, fix, retry |

---

## 5. High Memory Usage

**Trigger:** PM2 restarting due to memory, container OOM kills

### Check Memory
```bash
# PM2
pm2 monit

# Docker
docker stats --no-stream

# System
free -h
```

### Identify Memory Leaks
```bash
# Take heap snapshot (if enabled)
kill -USR2 $(pgrep -f "next start")

# Check Node.js memory
node -e "console.log(process.memoryUsage())"
```

### PM2 Memory Ceiling
```bash
# Current limit in ecosystem.config.js: 1500MB
# If consistently hitting limit:
# 1. Check for memory leaks
# 2. Increase limit: edit ecosystem.config.js max_memory_restart
# 3. Consider horizontal scaling with cluster mode
```

---

## 6. Disk Space Exhaustion

**Trigger:** Disk full warnings, application write failures

### Check Disk Usage
```bash
df -h
du -sh /var/log/hotels-vendors/*
du -sh /var/backups/hotels-vendors/*
```

### Clean Up
```bash
# Old logs (keep last 7 days)
find /var/log/hotels-vendors -name "*.log" -mtime +7 -delete

# Old backups (keep last 30 days)
find /var/backups/hotels-vendors -name "*.sql.gz" -mtime +30 -delete

# Docker cleanup
docker system prune -f
docker volume prune -f
```

### PM2 Log Rotation Setup
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 50M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
pm2 set pm2-logrotate:rotateInterval '0 0 * * *'
```

---

## 7. SSL Certificate Expiry

**Trigger:** HTTPS errors, browser security warnings

### Check Certificate
```bash
echo | openssl s_client -connect www.hotelsvendors.com:443 2>/dev/null | \
  openssl x509 -noout -dates
```

### Renew via Certbot
```bash
sudo certbot renew
sudo systemctl reload nginx
```

### If Auto-Renewal Fails
```bash
# Force renewal
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

---

## 8. BullMQ Queue Backup

**Trigger:** Jobs not processing, queue depth growing, workers stuck

### Check Queue Status
```bash
# Via Redis
redis-cli LLEN "bull:eta-submission:wait"
redis-cli LLEN "bull:eta-submission:active"

# Via Prisma
psql -d hotelsvendors -c "SELECT status, COUNT(*) FROM \"SwarmJob\" GROUP BY status;"
```

### Restart Workers
```bash
# Docker (restart swarm worker)
docker compose -f docker-compose.swarm.yml restart swarm-worker

# PM2 (restart app — workers run in-process)
pm2 restart hotels-vendors
```

### Clear Stuck Jobs
```bash
# List active jobs
redis-cli LRANGE "bull:eta-submission:active" 0 -1

# Move stuck jobs back to wait
redis-cli LREM "bull:eta-submission:active" 0 <job_id>
redis-cli LPUSH "bull:eta-submission:wait" <job_id>
```

---

## 9. Failed Deployment Rollback

**Trigger:** Deployment introduces errors, health check fails post-deploy

### PM2 Rollback
```bash
# Symlink-based rollback
cd /var/www/hotelsvendors
ls releases/  # List available releases
ln -sfn releases/<previous-timestamp> current
pm2 reload hotels-vendors
```

### Docker Rollback
```bash
cd /var/www/hotelsvendors

# Revert to previous image tag
docker compose -f docker-compose.swarm.yml down
# Edit image tag in docker-compose.swarm.yml to previous version
docker compose -f docker-compose.swarm.yml up -d
```

### Git Rollback
```bash
cd /var/www/hotelsvendors
git log --oneline -10  # Find the commit to revert to
git revert HEAD        # Revert last commit
# Or:
git reset --hard <commit-hash>
# Then redeploy
```

### Verification
```bash
curl -sf https://www.hotelsvendors.com/api/health | jq .status
# Expected: "healthy"
```

---

## 10. Security Incident

**Trigger:** Suspicious activity, data breach, unauthorized access

### Immediate Actions
1. **Isolate:** Block the source IP at firewall level
   ```bash
   sudo ufw deny from <attacker_ip>
   ```

2. **Preserve evidence:** Capture logs before rotation
   ```bash
   cp /var/log/hotels-vendors/combined.log /var/secure/incident-$(date +%s).log
   docker logs hv-app > /var/secure/docker-incident-$(date +%s).log 2>&1
   ```

3. **Rotate secrets:** Immediately rotate affected credentials
   - SESSION_SECRET
   - DATABASE_URL
   - REDIS_URL
   - Any API keys

4. **Notify:** Alert team via Slack/phone per escalation matrix

### Investigation
```bash
# Check security event log
grep "SECURITY-CRITICAL" /var/log/hotels-vendors/error.log | tail -20

# Check auth failures
grep "auth_failure" /var/log/hotels-vendors/combined.log | tail -50

# Check RBAC denials
grep "rbac_denied" /var/log/hotels-vendors/combined.log | tail -20

# Check tenant isolation breaches
grep "tenant_isolation_breach" /var/log/hotels-vendors/error.log
```

### Recovery
1. Verify data integrity via audit log hash chain
2. Restore from last known-good backup if data compromised
3. Force re-authentication for all active sessions
4. Document incident in `/docs/audit-log.md`
