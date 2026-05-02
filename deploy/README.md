# Hotels Vendors — Swarm Infrastructure Deployment

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    HOSTINGER VPS (Ubuntu)                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────────┐  │
│  │   App   │  │ OpenClaw│  │ Agent0  │  │Swarm Worker  │  │
│  │ :3000   │  │ :8000   │  │ :9000   │  │ (BullMQ)     │  │
│  │ Next.js │  │Browser  │  │ LLM     │  │ Background   │  │
│  │         │  │Automation│  │Router   │  │ Jobs         │  │
│  └────┬────┘  └────┬────┘  └────┬────┘  └──────┬───────┘  │
│       │            │            │               │          │
│  ┌────┴────────────┴────────────┴───────────────┘          │
│  │              Docker Network (hv-network)                 │
│  └────┬────────────┬───────────────────────────────────────┘
│       │            │
│  ┌────┴────┐  ┌────┴────┐
│  │ Postgres│  │  Redis  │
│  │ :5432   │  │ :6379   │
│  └─────────┘  └─────────┘
│
│  ┌─────────┐  ┌─────────────────┐
│  │  Nginx  │  │ Cloudflare Tunnel│ (optional)
│  │ :80/443 │  │ (if no direct IP)│
│  └─────────┘  └─────────────────┘
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Provision Hostinger VPS
- Ubuntu 22.04 LTS
- 4 vCPU, 8GB RAM minimum (for swarm + OpenClaw)
- 100GB SSD

### 2. Run Deploy Script
```bash
ssh ubuntu@YOUR_VPS_IP
git clone https://github.com/Moataz301179/hotels-vendors.git
cd hotels-vendors
chmod +x deploy/hostinger-v2.sh
./deploy/hostinger-v2.sh production
```

### 3. Configure Environment
Edit `.env` with your actual API keys:
```bash
nano /var/www/hotelsvendors/.env
# Set: DATABASE_URL, SESSION_SECRET, KIMI_API_KEY, XAI_API_KEY, EMAIL_API_KEY
```

### 4. Restart Services
```bash
cd /var/www/hotelsvendors
docker-compose -f docker-compose.swarm.yml restart
```

## Swarm Management

### Trigger Director Cycle (Manual)
```bash
curl -X POST https://www.hotelsvendors.com/api/v1/swarm/director/plan \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Check Swarm Health
```bash
curl https://www.hotelsvendors.com/api/v1/swarm/health \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### List All Agents
```bash
curl https://www.hotelsvendors.com/api/v1/swarm/agents \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### View Jobs
```bash
curl "https://www.hotelsvendors.com/api/v1/swarm/jobs?status=PENDING&limit=20" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Scheduled Jobs (Auto-Running)

| Job | Schedule | Squad |
|-----|----------|-------|
| Director Daily Plan | 6:00 AM Cairo | Director |
| Lead Scout | Every 4 hours | Growth |
| Price Benchmark | 8:00 AM daily | Intelligence |
| Health Check | Every 2 hours | Operations |

## Logs

```bash
# App logs
docker-compose -f docker-compose.swarm.yml logs -f app

# Swarm worker logs
docker-compose -f docker-compose.swarm.yml logs -f swarm-worker

# OpenClaw logs
docker-compose -f docker-compose.swarm.yml logs -f openclaw

# Agent0 logs
docker-compose -f docker-compose.swarm.yml logs -f agent0
```

## Scaling

```bash
# Scale swarm workers
docker-compose -f docker-compose.swarm.yml up -d --scale swarm-worker=4

# Restart single service
docker-compose -f docker-compose.swarm.yml restart swarm-worker
```

## Troubleshooting

### OpenClaw browser fails
```bash
docker-compose -f docker-compose.swarm.yml exec openclaw playwright install chromium
```

### Database connection issues
```bash
docker-compose -f docker-compose.swarm.yml exec postgres psql -U hotels_vendors -d hotels_vendors
```

### Redis memory full
```bash
docker-compose -f docker-compose.swarm.yml exec redis redis-cli INFO memory
```
