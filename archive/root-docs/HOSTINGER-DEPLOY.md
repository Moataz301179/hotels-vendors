# HotelsVendors — Hostinger Production Deployment Blueprint

## Architecture Decision: Native (No Docker)

**Verdict**: Deploy natively on Hostinger VPS using PM2 + bare-metal PostgreSQL + Redis.

**Rationale**:
- Docker overhead (400-600 MB RAM) wastes 10-15% of VPS memory budget
- Bare-metal PostgreSQL gives direct `shared_buffers`, WAL, NVMe tuning
- ETA AES-256-GCM credentials need kernel-level isolation, not container isolation
- GitHub Actions → SSH → native deploy has 4 fewer failure points than Docker Compose orchestration
- PM2 cluster mode gives zero-downtime reload, auto-restart, log aggregation

---

## VPS Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 2 vCPU | 4 vCPU |
| RAM | 4 GB | 8 GB |
| Storage | 40 GB SSD | 80 GB NVMe |
| OS | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |
| Node.js | 22 LTS | 22 LTS |

---

## Directory Structure

```
/var/www/hotels-vendors/
├── current → releases/20260611_143022    # Symlink to active release
├── releases/
│   ├── 20260611_143022/                  # Timestamped release
│   ├── 20260610_091500/
│   └── ...
├── shared/
│   ├── .env                              # Persistent secrets (never in git)
│   ├── node_modules/                     # Shared across releases
│   └── logs/                             # PM2 + app logs
└── prisma/                               # Prisma migrations (symlinked)
```

---

## Step 1: Initial Server Setup

Run this once on a fresh Hostinger VPS:

```bash
#!/bin/bash
# ═══ run as root ═══

# System updates
apt update && apt upgrade -y
apt install -y curl wget git build-essential ufw

# ── Node.js 22 LTS ──
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
node -v  # v22.x.x

# ── PM2 globally ──
npm install -g pm2

# ── PostgreSQL 16 ──
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /usr/share/keyrings/postgresql.gpg
echo "deb [signed-by=/usr/share/keyrings/postgresql.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/postgresql.list
apt update
apt install -y postgresql-16 postgresql-client-16

# ── Redis 7 ──
apt install -y redis-server

# ── Nginx ──
apt install -y nginx

# ── Create deploy user ──
useradd -m -s /bin/bash hotels
usermod -aG sudo hotels
mkdir -p /var/www/hotels-vendors
chown -R hotels:hotels /var/www/hotels-vendors

# ── Firewall ──
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

---

## Step 2: PostgreSQL Configuration

```bash
sudo -u postgres psql
```

```sql
-- Create production database
CREATE DATABASE hotels_vendors;
CREATE USER hotels_vendors WITH ENCRYPTED PASSWORD 'CHANGE_ME_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE hotels_vendors TO hotels_vendors;

-- Enable required extensions
\c hotels_vendors
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Harden: only allow local connections
-- (already default for PostgreSQL on Ubuntu)
```

```bash
# /etc/postgresql/16/main/postgresql.conf
sudo nano /etc/postgresql/16/main/postgresql.conf
```

```ini
# ── Performance (adjust for your VPS RAM) ──
shared_buffers = 1GB                    # 25% of 4GB RAM
effective_cache_size = 3GB              # 75% of 4GB RAM
work_mem = 64MB                         # Per-query sort memory
maintenance_work_mem = 256MB            # For migrations, VACUUM
wal_buffers = 64MB
max_connections = 100

# ── Write-Ahead Log ──
wal_level = replica
max_wal_size = 2GB
min_wal_size = 80MB
checkpoint_completion_target = 0.9

# ── Query Planner ──
random_page_cost = 1.1                  # NVMe SSD (not 4.0 for spinning disk)
effective_io_concurrency = 200           # NVMe

# ── Logging ──
log_min_duration_statement = 500        # Log queries > 500ms
log_checkpoints = on
log_connections = on
log_disconnections = on
log_lock_waits = on
```

```bash
# /etc/postgresql/16/main/pg_hba.conf
# Ensure local connections use scram-sha-256
local   all             all                                     scram-sha-256
host    all             all             127.0.0.1/32            scram-sha-256
host    all             all             ::1/128                 scram-sha-256

sudo systemctl restart postgresql
```

---

## Step 3: Redis Configuration

```bash
sudo nano /etc/redis/redis.conf
```

```ini
# ── Persistence ──
save 900 1
save 300 10
save 60 10000

# ── Memory ──
maxmemory 512mb
maxmemory-policy allkeys-lru

# ── Security ──
requirepass CHANGE_ME_REDIS_PASSWORD
bind 127.0.0.1

# ── Performance ──
tcp-backlog 511
timeout 0
tcp-keepalive 300
```

```bash
sudo systemctl restart redis-server
sudo systemctl enable redis-server
```

---

## Step 4: Environment Variables

```bash
sudo -u hotels mkdir -p /var/www/hotels-vendors/shared
sudo -u hotels nano /var/www/hotels-vendors/shared/.env
```

```env
# ═══════════════════════════════════════════════════════════════
# HotelsVendors — Production Environment
# ═══════════════════════════════════════════════════════════════
# ⚠️  NEVER commit this file to git. It lives ONLY on the VPS.

# ── Application ──
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://www.hotelsvendors.com
NEXT_TELEMETRY_DISABLED=1

# ── Database ──
DATABASE_URL="postgresql://hotels_vendors:CHANGE_ME_STRONG_PASSWORD@localhost:5432/hotels_vendors?connection_limit=20&pool_timeout=30"

# ── Redis ──
REDIS_URL="redis://:CHANGE_ME_REDIS_PASSWORD@localhost:6379"

# ── JWT / Session ──
JWT_SECRET="generate-with: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
JWT_EXPIRY="24h"
SESSION_COOKIE_NAME="hv_session"

# ── ETA Credential Encryption (AES-256-GCM) ──
ETA_ENCRYPTION_KEY="generate-with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
ETA_WEBHOOK_SECRET="generate-with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""

# ── ETA API Endpoints ──
ETA_BASE_URL="https://api.preprod.invoicing.eta.gov.eg"
ETA_PROD_URL="https://api.invoicing.eta.gov.eg"

# ── WhatsApp (Meta Cloud API) ──
WHATSAPP_PROVIDER=meta
WHATSAPP_BEARER_TOKEN="your-meta-permanent-token"
WHATSAPP_PHONE_NUMBER_ID="your-phone-number-id"
WHATSAPP_BUSINESS_ID="your-business-id"

# ── WhatsApp (Twilio Fallback) ──
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
TWILIO_WHATSAPP_FROM="+14155238886"

# ── Email (Resend) ──
RESEND_API_KEY="re_xxxxxxxxx"
EMAIL_FROM="HotelsVendors <noreply@hotelsvendors.com>"

# ── Stripe (if using INVO billing) ──
STRIPE_SECRET_KEY="sk_live_xxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxx"
STRIPE_PUBLISHABLE_KEY="pk_live_xxxxxxxxx"

# ── AI / LLM ──
OLLAMA_URL="http://localhost:11434"
OLLAMA_MODEL="llama3.2:3b"
OLLAMA_EMBED_MODEL="nomic-embed-text"

# ── Logging ──
LOG_LEVEL=info
```

```bash
chmod 600 /var/www/hotels-vendors/shared/.env
chown hotels:hotels /var/www/hotels-vendors/shared/.env
```

---

## Step 5: Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/hotelsvendors
```

```nginx
upstream hotels_vendors {
    server 127.0.0.1:3000;
    keepalive 32;
}

server {
    listen 80;
    server_name hotelsvendors.com www.hotelsvendors.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name hotelsvendors.com www.hotelsvendors.com;

    # ── SSL (Let's Encrypt) ──
    ssl_certificate /etc/letsencrypt/live/hotelsvendors.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hotelsvendors.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # ── Security Headers ──
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://graph.facebook.com https://api.invoicing.eta.gov.eg;" always;

    # ── Rate Limiting ──
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=3r/s;

    # ── Gzip ──
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # ── Proxy ──
    location / {
        proxy_pass http://hotels_vendors;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }

    # ── API rate limiting ──
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://hotels_vendors;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ── Login rate limiting ──
    location ~ ^/(login|register|api/auth) {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://hotels_vendors;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ── Static assets caching ──
    location /_next/static/ {
        proxy_pass http://hotels_vendors;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # ── Health check endpoint ──
    location /health {
        proxy_pass http://hotels_vendors;
        access_log off;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/hotelsvendors /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx
```

---

## Step 6: SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d hotelsvendors.com -d www.hotelsvendors.com --non-interactive --agree-tos --email admin@hotelsvendors.com

# Auto-renewal (certbot installs a timer, but verify):
sudo systemctl status certbot.timer
```

---

## Step 7: PM2 Startup Script

```bash
# Generate startup script (run as hotels user):
sudo -u hotels pm2 startup systemd -u hotels --hp /home/hotels

# Save PM2 process list after first start:
sudo -u hotels pm2 save
```

---

## Step 8: GitHub Actions Secrets

Add these to your GitHub repo → Settings → Secrets and variables → Actions:

| Secret | Value |
|--------|-------|
| `HOSTINGER_HOST` | Your VPS IP address |
| `HOSTINGER_USER` | `hotels` |
| `HOSTINGER_SSH_KEY` | Private SSH key (ed25519) |
| `HOSTINGER_PORT` | `22` (or your custom port) |
| `HOSTINGER_KNOWN_HOSTS` | Output of `ssh-keyscan -t ed25519 YOUR_HOST` |

Generate the SSH key pair on your local machine:
```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/hotelsvendors-deploy -N ""
cat ~/.ssh/hotelsvendors-deploy.pub >> ~/.ssh/authorized_keys  # on VPS
cat ~/.ssh/hotelsvendors-deploy     # paste into GitHub secret
```

---

## Step 9: First Deployment

```bash
# On VPS — initial setup:
sudo -u hotels bash
mkdir -p /var/www/hotels-vendors/releases/initial
mkdir -p /var/www/hotels-vendors/shared/logs
cd /var/www/hotels-vendors/releases/initial
git clone https://github.com/Moataz301179/hotels-vendors.git .
ln -sfn /var/www/hotels-vendors/shared/.env .env
npm ci --legacy-peer-deps
npx prisma generate
npm run build
npx prisma migrate deploy   # creates all tables
ln -sfn /var/www/hotels-vendors/releases/initial /var/www/hotels-vendors/current
pm2 start ecosystem.config.js --env production
pm2 save
```

---

## Step 10: Verification Checklist

```bash
# ── App health ──
curl -s https://www.hotelsvendors.com/health | grep "ok"

# ── PM2 status ──
pm2 status
pm2 monit    # live CPU/memory

# ── Database ──
sudo -u postgres psql -d hotels_vendors -c "SELECT count(*) FROM \"User\";"

# ── Redis ──
redis-cli -a YOUR_PASSWORD ping

# ── Nginx ──
sudo nginx -t
sudo systemctl status nginx

# ── SSL ──
curl -I https://www.hotelsvendors.com | grep "strict-transport-security"

# ── Logs ──
pm2 logs hotels-vendors --nostream --lines 50
```

---

## Rollback Procedure

```bash
# List releases
ls -lt /var/www/hotels-vendors/releases/

# Rollback to previous release
PREV_RELEASE=$(ls -t /var/www/hotels-vendors/releases/ | sed -n '2p')
ln -sfn /var/www/hotels-vendors/releases/$PREV_RELEASE /var/www/hotels-vendors/current
pm2 reload ecosystem.config.js --env production
```

---

## Monitoring & Alerts

```bash
# ── PM2 monitoring ──
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 50M
pm2 set pm2-logrotate:retain 14

# ── Uptime monitoring (free tier) ──
# Set up: https://uptimerobot.com → monitor https://www.hotelsvendors.com
# Alert: email + webhook to Slack/Discord

# ── Database backups (daily) ──
sudo crontab -e -u postgres
# Add: 0 3 * * * pg_dump -U postgres hotels_vendors | gzip > /var/backups/hotels-vendors-$(date +\%Y\%m\%d).sql.gz
```

---

## Security Hardening Summary

| Layer | Control |
|-------|---------|
| Network | UFW firewall (only 22, 80, 443) |
| Transport | TLS 1.2+ with HSTS preload |
| Application | Helmet headers via Nginx |
| Database | scram-sha-256 auth, local-only connections |
| Secrets | `.env` file (chmod 600), never in git |
| ETA Keys | AES-256-GCM encrypted at rest |
| Rate Limiting | Nginx `limit_req` (10r/s API, 3r/s login) |
| Session | HTTP-only, secure, SameSite cookies |
| SSH | Ed25519 key-only auth, no password |
