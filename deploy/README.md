# Hotels Vendors — Production Deployment Guide

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    HOSTINGER VPS (Ubuntu)                │
│                                                         │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌────────────┐  │
│  │  Next.js │ │ OpenClaw │ │ Agent0  │ │Swarm Worker│  │
│  │  :3000   │ │  :8000   │ │  :9000  │ │ (BullMQ)   │  │
│  └────┬─────┘ └────┬─────┘ └────┬────┘ └─────┬──────┘  │
│       │             │            │             │         │
│  ┌────┴─────────────┴────────────┴─────────────┴──────┐ │
│  │              Docker Network (hv-network)            │ │
│  └────┬───────────────────────────────────────┬───────┘ │
│       │                                       │         │
│  ┌────┴─────┐                            ┌────┴─────┐  │
│  │ Postgres │                            │  Redis   │  │
│  │ :5432    │                            │ :6379    │  │
│  └──────────┘                            └──────────┘  │
│                                                         │
│  ┌──────────────┐  ┌────────────────┐                   │
│  │ Nginx :80/443│  │ Certbot (SSL)  │                   │
│  └──────────────┘  └────────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

## Strategy: Docker Compose (Primary)

**This is the single canonical deployment strategy.** All other strategies (PM2 native, hybrid Vercel+VPS) are archived for reference only.

### Why Docker Compose?
- Consistent dev/prod parity
- Isolated services with clear dependency chains
- Built-in health checks and restart policies
- Swarm workers scale horizontally

### 1. Provision VPS
- Ubuntu 22.04 LTS
- 4 vCPU, 8GB RAM minimum
- 100GB SSD

### 2. Install Docker
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

### 3. Clone & Deploy
```bash
git clone https://github.com/Moataz301179/hotels-vendors.git
cd hotels-vendors
cp .env.example .env
nano .env  # Fill in all secrets
```

### 4. Start Services
```bash
docker compose -f docker-compose.swarm.yml up -d --build
```

### 5. Initialize Database
```bash
docker compose -f docker-compose.swarm.yml exec app npx prisma db push
```

### 6. Configure Firewall
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

## Environment Variables

### Required (production)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@postgres:5432/hotels_vendors?connection_limit=10` |
| `REDIS_PASSWORD` | Redis auth password (must match `requirepass`) | `your-secure-password` |
| `REDIS_URL` | Redis connection with auth | `redis://:your-secure-password@redis:6379` |
| `SESSION_SECRET` | JWT signing key (64 bytes) | `openssl rand -base64 64` |
| `ETA_ENCRYPTION_KEY` | AES-256-GCM key for ETA | `openssl rand -base64 32` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `your-secure-password` |

### Connection Pool (lib/prisma.ts)

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_POOL_MAX` | `10` | Max connections in pool |
| `DB_IDLE_TIMEOUT` | `30000` | Idle connection timeout (ms) |
| `DB_CONNECT_TIMEOUT` | `5000` | Connection attempt timeout (ms) |

## Database Backups

Daily automated backups via cron. See [docs/backup-strategy.md](../docs/backup-strategy.md).

```bash
# Quick manual backup
./scripts/backup-db.sh

# Setup cron (daily 3 AM)
sudo crontab -e -u postgres
# 0 3 * * * /var/www/hotels-vendors/scripts/backup-db.sh >> /var/log/hotels-vendors-backup.log 2>&1
```

## Operations

### Logs
```bash
docker compose -f docker-compose.swarm.yml logs -f app
docker compose -f docker-compose.swarm.yml logs -f swarm-worker
```

### Scaling Workers
```bash
docker compose -f docker-compose.swarm.yml up -d --scale swarm-worker=4
```

### Rollback
```bash
git log --oneline -5          # Find previous commit
git checkout <commit-hash>    # Or revert via Docker rebuild
docker compose -f docker-compose.swarm.yml up -d --build
```

### Health Check
```bash
curl https://www.hotelsvendors.com/api/health
```

## SSL / HTTPS

Certbot auto-renews via Docker volume. Verify:
```bash
docker compose -f docker-compose.swarm.yml exec certbot certbot renew --dry-run
```

---

## Archived Strategies (Reference Only)

> **Do not use these for new deployments.** They are preserved for historical context.

### PM2 + Native (archived)
- See `HOSTINGER-DEPLOY.md` — PM2 fork mode, bare-metal PostgreSQL/Redis
- Drawback: No container isolation, manual dependency management, dev/prod drift

### Hybrid Vercel + VPS (archived)
- See `deploy/hybrid-config.md` — Vercel for frontend, VPS for API/LLM
- Drawback: Auth token sharing complexity, CORS issues, split deployment surface

### Docker Compose (dev only)
- See `docker-compose.yml` — lightweight dev environment without swarm services
- Use for local development only, not production
