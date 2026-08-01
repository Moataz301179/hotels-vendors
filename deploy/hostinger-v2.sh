#!/bin/bash
# Hotels Vendors — Hostinger VPS Deployment Script (PM2 + Standalone)
#
# This is a MANUAL fallback script. The primary deployment path is
# GitHub Actions: push to main → deploy-hostinger.yml
#
# Run this on the VPS to do a fresh PM2 deployment (not Docker):
#   bash deploy/hostinger-v2.sh [production|staging]
#

ENV=${1:-production}
DOMAIN="www.hotelsvendors.com"
APP_DIR="/var/www/hotelsvendors-v2"
USER="ubuntu"

echo "═══════════════════════════════════════════════════"
echo "  Hotels Vendors — Hostinger VPS Deploy (PM2)"
echo "  Environment: $ENV"
echo "  Domain:      $DOMAIN"
echo "  App Dir:     $APP_DIR"
echo "═══════════════════════════════════════════════════"

# ── 1. System update ──
echo "[1/6] Updating system..."
sudo apt-get update -qq
sudo apt-get upgrade -y -qq
echo ""

# ── 2. Install Node.js / PM2 ──
echo "[2/6] Checking Node.js & PM2..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

if ! command -v pm2 &> /dev/null; then
  sudo npm install -g pm2
fi
echo "  Node: $(node --version)"
echo "  npm:  $(npm --version)"
echo "  PM2:  $(pm2 --version)"
echo ""

# ── 3. Create app directory & clone repo ──
echo "[3/6] Setting up application directory..."
sudo mkdir -p "$APP_DIR"
sudo chown "$USER":"$USER" "$APP_DIR"

if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR" && git pull origin main
else
  git clone https://github.com/Moataz301179/hotels-vendors.git "$APP_DIR"
  cd "$APP_DIR"
fi
echo ""

# ── 4. Install dependencies & build ──
echo "[4/6] Installing dependencies & building..."
npm ci --legacy-peer-deps
npx prisma generate
NEXT_TELEMETRY_DISABLED=1 npm run build
echo ""

# ── 5. Create/Update PM2 ecosystem config ──
echo "[5/6] Configuring PM2 process..."
cat > "$APP_DIR/ecosystem.config.js" << 'EOF'
module.exports = {
  apps: [{
    name: "hotels-vendors",
    script: "./.next/standalone/server.js",
    cwd: "/var/www/hotelsvendors-v2",
    env: {
      NODE_ENV: "production",
      PORT: 3000,
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 3000,
    },
    max_memory_restart: "1G",
    log_file: "/var/www/hotelsvendors-v2/logs/app-combined.log",
    error_file: "/var/www/hotelsvendors-v2/logs/app-error.log",
    out_file: "/var/www/hotelsvendors-v2/logs/app-out.log",
    time: true,
    combine_logs: true,
    kill_timeout: 30000,
  }],
};
EOF

sudo mkdir -p "$APP_DIR/logs"
sudo chown "$USER":"$USER" "$APP_DIR/logs"

pm2 reload ecosystem.config.js --env "$ENV" || pm2 start ecosystem.config.js --env "$ENV"
pm2 save
sudo pm2 startup systemd -u "$USER" --mpath "$(which pm2)" 2>/dev/null || true
echo ""

# ── 6. Health check ──
echo "[6/6] Running health checks..."
sleep 10

APP_STATUS=$(pm2 describe hotels-vendors 2>/dev/null | grep -c "online" || echo "0")
if [ "$APP_STATUS" -gt 0 ]; then
  echo "  ✅ PM2: hotels-vendors is online"
else
  echo "  ❌ PM2: hotels-vendors is NOT running"
  pm2 logs hotels-vendors --lines 50
  exit 1
fi

HTTP_STATUS=$(curl -so /dev/null -w "%{http_code}" "https://$DOMAIN/api/health" || echo "000")
if [ "$HTTP_STATUS" = "200" ]; then
  echo "  ✅ App is healthy (HTTP $HTTP_STATUS)"
else
  echo "  ⚠ Health check returned HTTP $HTTP_STATUS"
fi

echo ""
echo "═══════════════════════════════════════════════════"
echo "  Deploy Complete"
echo "═══════════════════════════════════════════════════"
echo ""
echo "Management commands:"
echo "  pm2 status              # Check process status"
echo "  pm2 logs hotels-vendors # View app logs"
echo "  pm2 restart hotels-vendors"
echo "  pm2 stop hotels-vendors"
echo ""
echo "App:   https://$DOMAIN"
