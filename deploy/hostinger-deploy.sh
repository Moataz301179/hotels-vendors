#!/bin/bash
# Hotels Vendors — Hostinger Deployment Script
# Usage: ./deploy/hostinger-deploy.sh [staging|production]
#
# Prerequisites:
#   - Hostinger VPS with Ubuntu 22.04+
#   - Node.js 20+ installed
#   - Domain pointed to server IP
#   - SSH key configured

set -e

ENV=${1:-staging}
DOMAIN="www.hotelsvendors.com"
STAGING_DOMAIN="staging.hotelsvendors.com"
DEPLOY_DOMAIN=$([ "$ENV" = "production" ] && echo "$DOMAIN" || echo "$STAGING_DOMAIN")
APP_DIR="/var/www/hotelsvendors"
USER="ubuntu"
NODE_VERSION="20"

echo "═══════════════════════════════════════════════════"
echo "  Hotels Vendors — Hostinger Deployment"
echo "  Environment: $ENV"
echo "  Domain: $DEPLOY_DOMAIN"
echo "═══════════════════════════════════════════════════"

# ── 1. SYSTEM DEPENDENCIES ──
echo "[1/10] Installing system dependencies..."
sudo apt-get update -qq
sudo apt-get install -y -qq \
  nginx \
  certbot \
  python3-certbot-nginx \
  redis-server \
  postgresql-14 \
  postgresql-client-14 \
  git \
  curl \
  build-essential

# ── 2. NODE.JS ──
echo "[2/10] Setting up Node.js $NODE_VERSION..."
if ! command -v node &> /dev/null || [ "$(node -v | cut -d'v' -f2 | cut -d'.' -f1)" != "$NODE_VERSION" ]; then
  curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
  sudo apt-get install -y -qq nodejs
fi
npm install -g pm2

# ── 3. DATABASE ──
echo "[3/10] Configuring PostgreSQL..."
sudo systemctl enable postgresql
sudo systemctl start postgresql

sudo -u postgres psql <<EOF
CREATE DATABASE hotelsvendors_${ENV};
CREATE USER hv_${ENV} WITH ENCRYPTED PASSWORD '$(openssl rand -base64 32)';
GRANT ALL PRIVILEGES ON DATABASE hotelsvendors_${ENV} TO hv_${ENV};
\c hotelsvendors_${ENV}
GRANT ALL ON SCHEMA public TO hv_${ENV};
EOF

# ── 4. REDIS ──
echo "[4/10] Configuring Redis..."
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Secure Redis
sudo tee /etc/redis/redis.conf > /dev/null <<EOF
bind 127.0.0.1
port 6379
requirepass $(openssl rand -base64 32)
maxmemory 256mb
maxmemory-policy allkeys-lru
EOF
sudo systemctl restart redis-server

# ── 5. APPLICATION DIRECTORY ──
echo "[5/10] Setting up application directory..."
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# ── 6. BUILD APPLICATION ──
echo "[6/10] Building application..."
cd $APP_DIR

# Install dependencies
npm ci --legacy-peer-deps

# Generate Prisma client
npx prisma generate

# Run migrations
DATABASE_URL="postgresql://hv_${ENV}:$(sudo -u postgres psql -t -c "SELECT passwd FROM pg_shadow WHERE usename='hv_${ENV}'" | xargs)@localhost:5432/hotelsvendors_${ENV}" npx prisma migrate deploy

# Build Next.js
npm run build

# ── 7. PM2 CONFIGURATION ──
echo "[7/10] Configuring PM2..."
cat > ecosystem.config.js <<EOF
module.exports = {
  apps: [{
    name: 'hotelsvendors-${ENV}',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '${APP_DIR}',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: '${ENV}',
      PORT: 3000,
      DATABASE_URL: 'postgresql://hv_${ENV}:$(sudo -u postgres psql -t -c "SELECT passwd FROM pg_shadow WHERE usename='hv_${ENV}'" | xargs)@localhost:5432/hotelsvendors_${ENV}',
      REDIS_URL: 'redis://:$(sudo grep requirepass /etc/redis/redis.conf | awk '{print $2}')@localhost:6379',
      SESSION_SECRET: '$(openssl rand -base64 64)',
      ETA_CLIENT_ID: '${ETA_CLIENT_ID}',
      ETA_CLIENT_SECRET: '${ETA_CLIENT_SECRET}',
      ETA_API_URL: 'https://api.invoicing.eta.gov.eg',
      PAYMOB_API_KEY: '${PAYMOB_API_KEY}',
    },
    error_file: '/var/log/hotelsvendors/error.log',
    out_file: '/var/log/hotelsvendors/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '512M',
    restart_delay: 3000,
    max_restarts: 5,
    min_uptime: '10s',
  }]
};
EOF

sudo mkdir -p /var/log/hotelsvendors
sudo chown $USER:$USER /var/log/hotelsvendors

pm2 start ecosystem.config.js
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER

# ── 8. NGINX CONFIGURATION ──
echo "[8/10] Configuring Nginx..."
sudo tee /etc/nginx/sites-available/hotelsvendors > /dev/null <<EOF
upstream hotelsvendors {
  least_conn;
  server 127.0.0.1:3000 max_fails=3 fail_timeout=30s;
}

server {
  listen 80;
  listen [::]:80;
  server_name ${DEPLOY_DOMAIN};

  location / {
    proxy_pass http://hotelsvendors;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_cache_bypass \$http_upgrade;
    proxy_read_timeout 86400;
  }

  # SSE endpoint — no buffering
  location /api/v1/admin/pulse {
    proxy_pass http://hotelsvendors;
    proxy_http_version 1.1;
    proxy_set_header Connection '';
    proxy_buffering off;
    proxy_cache off;
    proxy_read_timeout 86400;
  }

  # Static assets — cache aggressively
  location /_next/static {
    proxy_pass http://hotelsvendors;
    proxy_cache_valid 200 365d;
    add_header Cache-Control "public, immutable";
  }

  # Gzip
  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
EOF

sudo ln -sf /etc/nginx/sites-available/hotelsvendors /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# ── 9. SSL CERTIFICATE ──
echo "[9/10] Installing SSL certificate..."
sudo certbot --nginx -d ${DEPLOY_DOMAIN} --non-interactive --agree-tos --email admin@${DOMAIN}

# Auto-renewal cron
sudo tee /etc/cron.d/certbot-renewal > /dev/null <<EOF
0 3 * * * root certbot renew --quiet && systemctl reload nginx
EOF

# ── 10. HOSTINGER OBJECT CACHE ──
echo "[10/10] Configuring Hostinger Object Cache..."
# Enable Redis Object Cache for WordPress-compatible caching
# For Next.js, we use Redis directly via ioredis

echo "═══════════════════════════════════════════════════"
echo "  DEPLOYMENT COMPLETE"
echo "  Domain: https://${DEPLOY_DOMAIN}"
echo "  App Directory: ${APP_DIR}"
echo "  Logs: /var/log/hotelsvendors/"
echo "═══════════════════════════════════════════════════"
