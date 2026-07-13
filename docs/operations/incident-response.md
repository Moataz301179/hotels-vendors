# Incident Response Playbook — Hotels Vendors

> **Owner:** The Auditor (Operational Excellence)  
> **Last Updated:** 2026-07-14  
> **Classification:** CONFIDENTIAL — Internal Use Only

---

## Incident Severity Levels

| Level | Name | Response Time | Examples |
|-------|------|---------------|----------|
| **P0** | CRITICAL | Immediate (< 15 min) | Total outage, data breach, ETA system down |
| **P1** | HIGH | < 1 hour | Partial outage, payment failures, memory OOM |
| **P2** | MEDIUM | < 4 hours | Degraded performance, non-critical errors |
| **P3** | LOW | < 24 hours | Minor bugs, cosmetic issues, warnings |

---

## Escalation Matrix

| Level | Primary | Backup | Notification |
|-------|---------|--------|--------------|
| **P0** | On-call Engineer | CTO | Slack #incidents + Phone + Email |
| **P1** | On-call Engineer | Tech Lead | Slack #incidents + Email |
| **P2** | Assigned Engineer | Tech Lead | Slack #engineering |
| **P3** | Assigned Engineer | — | GitHub Issue |

### Contact List

| Role | Name | Phone | Email |
|------|------|-------|-------|
| CTO | [TBD] | [TBD] | [TBD] |
| Tech Lead | [TBD] | [TBD] | [TBD] |
| On-call | [TBD] | [TBD] | [TBD] |

---

## Incident Response Phases

### Phase 1: Detection & Triage (0-15 minutes)

1. **Alert received** — via monitoring, health check, or user report
2. **Acknowledge** — react in Slack #incidents within 5 minutes
3. **Classify severity** — use matrix above
4. **Assign owner** — one person owns the incident
5. **Open incident channel** — `#incidents/YYYY-MM-DD-short-desc`

### Phase 2: Containment (15-60 minutes)

**For P0/P1 — Immediate containment:**
```bash
# 1. Check system status
curl -sf https://www.hotelsvendors.com/api/health | jq .

# 2. Check recent errors
pm2 logs hotels-vendors --lines 100 --err

# 3. Check resource usage
free -h && df -h && pm2 monit

# 4. If needed — isolate (DO NOT restart yet — preserve evidence)
sudo ufw deny from <suspicious_ip>  # If attack
# Do NOT restart services until evidence captured
```

**For data breach:**
1. Block attacker IP immediately
2. Capture all logs to `/var/secure/`
3. Rotate SESSION_SECRET, DATABASE_URL, REDIS_URL
4. Force all sessions to expire

### Phase 3: Resolution (varies)

**Database down:**
→ See [Runbook: Database Recovery](runbook.md#2-database-recovery)

**Redis down:**
→ See [Runbook: Redis Recovery](runbook.md#3-redis-recovery)

**ETA API down:**
→ See [Runbook: ETA API Outage](runbook.md#4-eta-api-outage)

**High memory:**
→ See [Runbook: High Memory Usage](runbook.md#5-high-memory-usage)

**Failed deploy:**
→ See [Runbook: Failed Deployment Rollback](runbook.md#9-failed-deployment-rollback)

### Phase 4: Recovery

1. Verify system health:
   ```bash
   curl -sf https://www.hotelsvendors.com/api/health | jq .
   ```

2. Verify data integrity:
   ```bash
   psql -d hotelsvendors -c "SELECT COUNT(*) FROM \"AuditLog\";"
   ```

3. Run smoke tests:
   ```bash
   ./scripts/e2e-smoke-test.ts
   ```

4. Monitor for 30 minutes post-resolution

### Phase 5: Post-Incident

1. **Post-mortem document** — within 24 hours
   ```markdown
   # Post-Mortem: [Incident Title]
   
   **Date:** YYYY-MM-DD
   **Duration:** X hours Y minutes
   **Severity:** P0/P1/P2
   **Owner:** [Name]
   
   ## Summary
   [What happened]
   
   ## Timeline
   - HH:MM — Alert received
   - HH:MM — Investigation started
   - HH:MM — Root cause identified
   - HH:MM — Fix deployed
   - HH:MM — Verified resolved
   
   ## Root Cause
   [Technical root cause]
   
   ## Impact
   [Users affected, data impact, revenue impact]
   
   ## Action Items
   - [ ] [Preventive measure] — Owner — Due date
   - [ ] [Detective measure] — Owner — Due date
   ```

2. **Update runbooks** — if new failure mode discovered

3. **Notify stakeholders** — for P0/P1 incidents

---

## Common Incident Scenarios

### Scenario: Complete Platform Outage

**Symptoms:** All endpoints return 5xx, health check fails
**Likely causes:** PostgreSQL down, Redis down, OOM kill, deployment failure

**Response:**
1. Check `pm2 status` or `docker ps`
2. Check resource usage (`free -h`, `df -h`)
3. Check recent deployments (`git log --oneline -5`)
4. If OOM: increase memory limit or identify leak
5. If DB: follow Database Recovery runbook
6. If deploy: follow Rollback runbook

### Scenario: Slow Response Times

**Symptoms:** High latency, timeouts, user complaints
**Likely causes:** Database connection pool exhaustion, memory pressure, ETA queue backup

**Response:**
1. Check DB connection count: `SELECT count(*) FROM pg_stat_activity;`
2. Check memory: `pm2 monit`
3. Check ETA queue depth
4. Restart if memory-bound
5. Kill idle DB connections if pool exhausted

### Scenario: Security Breach

**Symptoms:** Unusual traffic, unauthorized access, data exfiltration
**Likely causes:** Compromised credentials, vulnerability exploit, insider threat

**Response:**
1. **ISOLATE** — block IPs, disable compromised accounts
2. **PRESERVE** — capture all logs
3. **ASSESS** — what data was accessed
4. **ROTATE** — all secrets and credentials
5. **NOTIFY** — team, then affected users if PII exposed
6. **REVIEW** — audit log for tamper-proof evidence

### Scenario: ETA Submission Failures

**Symptoms:** Invoices stuck in SUBMITTING, DLQ growing
**Likely causes:** ETA API down, invalid payloads, signing failures

**Response:**
1. Check ETA API status (sandbox vs production)
2. Check DLQ: `SELECT COUNT(*) FROM "SwarmJob" WHERE "queueName" LIKE '%eta-dead-letter%';`
3. Verify signing keys are valid
4. Retry from DLQ via admin dashboard
5. If ETA API down: queue will retry automatically (3 attempts, exponential backoff)

---

## Communication Templates

### Internal Notification (Slack #incidents)
```
🚨 [P0] Incident: [Short Description]
Status: Investigating
Impact: [What's affected]
Owner: [Name]
ETA: [Estimated resolution time]
Updates: Every 15 minutes
```

### Customer-Facing (if needed)
```
We're currently experiencing [brief description of issue].
Our team is actively working on resolution.
Estimated resolution: [time].
We'll provide updates every [interval].
Status page: [URL]
```

### All-Clear
```
✅ [P0] Resolved: [Short Description]
Duration: [X hours Y minutes]
Root cause: [Brief explanation]
Post-mortem: [Link — to be completed within 24h]
```

---

## On-Call Rotation

**Schedule:** [To be defined]  
**Primary:** On-call engineer handles P0/P1 during rotation  
**Backup:** Escalates to Tech Lead if primary doesn't respond in 10 minutes  
**Handoff:** Slack message at rotation boundary with status summary

### On-Call Responsibilities
1. Acknowledge alerts within 5 minutes
2. Triage and classify incidents
3. Lead response for P0/P1
4. Document in incident channel
5. Complete post-mortem for P0/P1 within 24 hours
