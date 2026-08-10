#!/usr/bin/env bash
set -euo pipefail

# ═══════════════════════════════════════════════════════════════
# Hotels Vendors — One-Command Production Deployment (PM2)
#
# This is a MANUAL fallback script. The primary deployment path is
# GitHub Actions: push to main → deploy.yml / deploy-hostinger.yml.
#
# Run this on the VPS ONLY to bypass GitHub Actions:
#   bash deploy/deploy.sh
# ═══════════════════════════════════════════════════════════════

REPO_DIR="/var/www/hotelsvendors-v2"
DOMAIN="www.hotelsvendors.com"
PM2_APP_NAME="hotels-vendors"

cd "$REPO_DIR"

echo "═══════════════════════════════════════════════════════════════"
echo "  Hotels Vendors — Production Deploy (PM2 + Standalone)"
echo "  $(date)"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# ── 1. Pull latest code ──
echo "[1/5] Pulling latest code..."
git fetch origin main
git reset --hard origin/main
echo ""

# ── 2. Install dependencies ──
echo "[2/5] Installing dependencies..."
npm ci --legacy-peer-deps
echo ""

# ── 3. Generate Prisma client ──
echo "[3/5] Generating Prisma client..."
npx prisma generate
echo ""

# ── 4. Build application (standalone) ──
echo "[4/5] Building application..."
NEXT_TELEMETRY_DISABLED=1 npm run build
echo ""

# ── 5. Restart PM2 process ──
echo "[5/5] Restarting PM2 process..."
if pm2 describe "$PM2_APP_NAME" > /dev/null 2>&1; then
    pm2 reload ecosystem.config.js --env production
else
    pm2 start ecosystem.config.js --env production
fi
pm2 save
echo ""

# ── Health check ──
echo "────────────────────────────────────────────────────────────"
echo "  Health Checks"
echo "────────────────────────────────────────────────────────────"
sleep 10
HTTP_STATUS=$(curl -so /dev/null -w "%{http_code}" "https://$DOMAIN/api/health" || echo "000")
if [ "$HTTP_STATUS" = "200" ]; then
    echo "  ✅ App is healthy (HTTP $HTTP_STATUS)"
else
    echo "  ⚠ Health check returned HTTP $HTTP_STATUS — check server logs"
    echo "  Run: pm2 logs $PM2_APP_NAME --lines 50"
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  Deploy Complete"
echo "  App:  https://$DOMAIN"
echo "  Logs: pm2 logs $PM2_APP_NAME"
echo "═══════════════════════════════════════════════════════════════"
