# Hotels Vendors — Deployment Checklist

> **Last Updated:** 2026-05-12  
> **Commit:** `e5b837a` — AI engine overhaul + Marketplace V2 + Ollama VPS infrastructure

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DEPLOYMENT ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐         ┌──────────────────┐         ┌─────────────────┐  │
│  │   Vercel     │         │   Hostinger VPS  │         │   Local Dev     │  │
│  │  (Frontend)  │◄────────│  (Ollama + API)  │◄────────│  (MacBook)      │  │
│  │              │  HTTPS  │                  │   SSH   │                 │  │
│  └──────────────┘         └──────────────────┘         └─────────────────┘  │
│         │                          │                                        │
│         │                          │                                        │
│    ┌────┴────┐                ┌────┴────┐                                   │
│    │ Next.js │                │ Docker  │                                   │
│    │ Static  │                │ Compose │                                   │
│    │ Pages   │                │ Stack   │                                   │
│    └─────────┘                └─────────┘                                   │
│                                                                              │
│  Vercel serves:              VPS runs:                                       │
│  - Marketing pages           - Next.js app (standalone)                      │
│  - Auth flows                - PostgreSQL                                    │
│  - Dashboard UI              - Redis                                         │
│  - Marketplace V2            - Ollama (LLM engine)                           │
│                              - Nginx (reverse proxy + SSL)                   │
│                              - Agent0 (swarm executor)                       │
│                              - OpenClaw (browser automation)                 │
│                              - Swarm Worker (background jobs)                │
│                                                                              │
│  Vercel → VPS Ollama via `/ollama/` nginx proxy (IP-restricted)             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: VPS Preparation (One-Time)

### 1.1 Server Requirements
| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 4 vCPU | 8 vCPU |
| RAM | 8 GB | 16 GB (for 8B+ models) |
| Disk | 50 GB SSD | 100 GB SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

### 1.2 Initial Server Setup
```bash
# SSH into your Hostinger VPS
ssh user@YOUR_VPS_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker & Docker Compose
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Install Git
sudo apt install -y git

# Verify installations
docker --version
docker compose version
git --version
```

### 1.3 Clone Repository
```bash
cd ~
git clone https://github.com/YOUR_USERNAME/hotels-vendors.git
# OR if using SSH:
# git clone git@github.com:YOUR_USERNAME/hotels-vendors.git

cd hotels-vendors
```

### 1.4 Environment Variables
```bash
# Copy example env
cp .env.example .env

# Edit .env with production values
nano .env
```

**Required production values:**
```bash
# Database (PostgreSQL on same VPS)
DATABASE_URL="postgresql://hotels_vendors:STRONG_PASSWORD@postgres:5432/hotels_vendors"

# Redis
REDIS_URL="redis://redis:6379"

# Session (generate strong secret)
SESSION_SECRET="your-64-char-random-string-here"

# Ollama (internal Docker network — no external access needed)
OLLAMA_URL="http://ollama:11434"
OLLAMA_MODEL="llama3.2:3b"
OLLAMA_EMBED_MODEL="nomic-embed-text"

# Fallback LLM (set at least one)
XAI_API_KEY="xai-your-key-here"
GROQ_API_KEY=""
OPENROUTER_API_KEY=""

# Email (Resend)
RESEND_API_KEY="re_"

# ETA E-Invoicing
ETA_API_BASE_URL="https://api.invoicing.eta.gov.eg"
ETA_API_KEY=""
ETA_CLIENT_ID=""
ETA_CLIENT_SECRET=""

# Paymob
PAYMOB_API_KEY=""
PAYMOB_HMAC_SECRET=""
PAYMOB_INTEGRATION_ID=""

# Google Maps
GOOGLE_MAPS_API_KEY=""
```

### 1.5 Firewall Setup
```bash
# Run the firewall script
sudo bash deploy/ufw-setup.sh

# Verify
sudo ufw status verbose
```

**Expected output:**
```
Status: active
To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
Anywhere                   ALLOW       172.16.0.0/12
Anywhere                   ALLOW       10.0.0.0/8
Anywhere                   ALLOW       192.168.0.0/16
```

> ⚠️ **Port 11434 (Ollama) should NOT appear.** It must remain internal-only.

---

## Phase 2: First Deploy

### 2.1 Build & Start Services
```bash
cd ~/hotels-vendors

# Pull and start all services
docker compose -f docker-compose.swarm.yml up -d

# Watch logs
 docker compose -f docker-compose.swarm.yml logs -f
```

### 2.2 Pull Ollama Models
```bash
# Run the model pull script
bash deploy/ollama-pull.sh

# Or manually:
docker exec hv-ollama ollama pull llama3.2:3b
docker exec hv-ollama ollama pull nomic-embed-text
```

### 2.3 Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (first time only)
npx prisma db push

# OR run migrations (if you have migration files)
npx prisma migrate deploy

# Seed data (optional — for demo products)
npx tsx scripts/seed-marketplace.ts
```

### 2.4 Verify Services
```bash
# Check all containers are running
docker ps

# Expected containers:
# - hv-app (Next.js)
# - hv-postgres (PostgreSQL)
# - hv-redis (Redis)
# - hv-ollama (Ollama)
# - hv-nginx (Nginx)
# - hv-agent0 (Agent0)
# - hv-openclaw (OpenClaw)

# Test Ollama
curl http://localhost:11434/api/tags
# Should return list of models (from inside VPS)

# Test app health
curl http://localhost:3000/api/health

# Test nginx (from outside)
curl http://YOUR_VPS_IP
```

---

## Phase 3: SSL (Let's Encrypt)

### 3.1 Initial Certificate
```bash
# Stop nginx temporarily
docker compose -f docker-compose.swarm.yml stop nginx

# Run certbot (replace with your domain)
docker run -it --rm \
  -v certbot_data:/etc/letsencrypt \
  -v ./deploy/certbot/www:/var/www/certbot \
  certbot/certbot certonly \
  --standalone \
  -d hotelsvendors.com \
  -d www.hotelsvendors.com \
  --agree-tos \
  -m your-email@example.com

# Restart nginx
docker compose -f docker-compose.swarm.yml start nginx
```

### 3.2 Auto-Renewal
The `certbot` container in `docker-compose.swarm.yml` already handles auto-renewal with:
```bash
certbot renew; sleep 12h; done
```

---

## Phase 4: Vercel Integration (Hybrid Setup)

### 4.1 Vercel Environment Variables
Go to [Vercel Dashboard](https://vercel.com/dashboard) → Project Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://...` (VPS PostgreSQL — allow external or use connection pooler) | Production |
| `REDIS_URL` | `redis://...` (VPS Redis — allow external or use Upstash) | Production |
| `SESSION_SECRET` | Same as VPS | Production |
| `OLLAMA_URL` | `https://your-vps-domain/ollama` | Production |
| `OLLAMA_MODEL` | `llama3.2:3b` | Production |
| `XAI_API_KEY` | Your xAI key | Production |
| `RESEND_API_KEY` | Your Resend key | Production |
| `ETA_API_BASE_URL` | `https://api.invoicing.eta.gov.eg` | Production |
| `GOOGLE_MAPS_API_KEY` | Your Google Maps key | Production |

### 4.2 Allow Vercel IPs on VPS Nginx
Add Vercel's edge IP ranges to the nginx Ollama location allow list in `deploy/nginx.conf`:

```nginx
location /ollama/ {
    allow 127.0.0.1;
    allow 172.16.0.0/12;
    allow 10.0.0.0/8;
    allow 192.168.0.0/16;
    
    # Vercel Edge Network (update from https://vercel.com/docs/concepts/edge-network/ips)
    allow 76.76.21.0/24;
    allow 76.76.21.21;
    
    deny all;
    proxy_pass http://ollama:11434/;
    # ... rest of config
}
```

> ⚠️ **Security Note:** Instead of opening Ollama to Vercel, a safer approach is to keep Ollama internal and have the VPS app handle AI requests. The frontend calls your VPS API, which then calls internal Ollama.

### 4.3 Alternative: API-Only VPS (Recommended)
Instead of exposing Ollama, expose only your Next.js API:

```
Vercel Frontend ──► VPS Next.js API ──► Internal Ollama
```

In this setup:
- `OLLAMA_URL` stays `http://ollama:11434` on VPS (internal)
- Vercel frontend calls `https://your-vps-domain/api/v1/ai/assistant`
- No `/ollama/` proxy needed in nginx

Update `vercel.json` to proxy AI requests to VPS:
```json
{
  "rewrites": [
    {
      "source": "/api/v1/ai/:path*",
      "destination": "https://your-vps-domain/api/v1/ai/:path*"
    }
  ]
}
```

---

## Phase 5: Updates & Maintenance

### 5.1 Deploy New Code
```bash
# On VPS
cd ~/hotels-vendors
git pull origin main
docker compose -f docker-compose.swarm.yml up -d --build

# If schema changed:
npx prisma migrate deploy
# OR
npx prisma db push
```

### 5.2 View Logs
```bash
# All services
docker compose -f docker-compose.swarm.yml logs -f

# Specific service
docker compose -f docker-compose.swarm.yml logs -f app
docker compose -f docker-compose.swarm.yml logs -f ollama
docker compose -f docker-compose.swarm.yml logs -f nginx
```

### 5.3 Backup Database
```bash
# Backup
docker exec hv-postgres pg_dump -U hotels_vendors hotels_vendors > backup_$(date +%Y%m%d).sql

# Restore
docker exec -i hv-postgres psql -U hotels_vendors hotels_vendors < backup_20260512.sql
```

### 5.4 Restart Services
```bash
# Restart everything
docker compose -f docker-compose.swarm.yml restart

# Restart single service
docker compose -f docker-compose.swarm.yml restart app
```

---

## Troubleshooting

### Ollama not responding
```bash
# Check Ollama is running
docker ps | grep ollama

# Check logs
docker logs hv-ollama

# Test from inside Docker network
docker exec hv-app curl http://ollama:11434/api/tags

# If fails, check OLLAMA_HOST env
docker exec hv-ollama env | grep OLLAMA
```

### Build fails on VPS
```bash
# Clear build cache
docker compose -f docker-compose.swarm.yml down
docker system prune -a

# Rebuild
docker compose -f docker-compose.swarm.yml up -d --build
```

### SSL certificate expired
```bash
# Force renew
docker run -it --rm \
  -v certbot_data:/etc/letsencrypt \
  -v ./deploy/certbot/www:/var/www/certbot \
  certbot/certbot renew --force-renewal
```

### Database connection issues
```bash
# Check postgres is healthy
docker compose -f docker-compose.swarm.yml ps

# Check logs
docker logs hv-postgres

# Verify connection from app
docker exec hv-app nc -zv postgres 5432
```

---

## Pre-Deploy Checklist

- [ ] VPS has 8GB+ RAM
- [ ] `.env` file configured with production secrets
- [ ] Firewall active (UFW), ports 22/80/443 only
- [ ] Domain DNS points to VPS IP
- [ ] Ollama models pulled (`llama3.2:3b`, `nomic-embed-text`)
- [ ] Database schema synced (`prisma db push` or `migrate deploy`)
- [ ] SSL certificates obtained (Let's Encrypt)
- [ ] All Docker containers running (`docker ps`)
- [ ] Health check passes (`curl http://localhost:3000/api/health`)
- [ ] AI chat responds (`curl http://localhost:11434/api/tags`)
- [ ] Vercel env vars set (if using hybrid)

---

## Post-Deploy Verification

- [ ] Homepage loads at `https://your-domain.com`
- [ ] `/marketplace` shows products with real images and working cart
- [ ] Product detail pages work
- [ ] Registration flow works
- [ ] Login works
- [ ] AI chat streams responses
- [ ] Cart add/remove works
- [ ] Mobile responsive (test on phone)
- [ ] ETA e-invoicing API configured (if ready)
