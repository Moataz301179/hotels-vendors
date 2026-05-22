#!/bin/bash
set -euo pipefail

# HotelsVendors Autonomous Deploy Script
# Usage: bash scripts/deploy.sh

PROJECT_DIR="/var/www/hotelsvendors-v2"
LOG_FILE="/var/log/hv-deploy.log"
HEALTH_URL="http://localhost:3000"
MIN_DISK_GB=5

cd "$PROJECT_DIR"

log() {
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $1" | tee -a "$LOG_FILE"
}

fail() {
  log "ERROR: $1"
  exit 1
}

log "=== HV DEPLOY START ==="

# 1. Disk check
AVAILABLE_GB=$(df -BG / | awk 'NR==2 {print $4}' | tr -d 'G')
if [ "$AVAILABLE_GB" -lt "$MIN_DISK_GB" ]; then
  fail "Disk space too low: ${AVAILABLE_GB}GB < ${MIN_DISK_GB}GB required"
fi
log "Disk OK: ${AVAILABLE_GB}GB available"

# 2. Git checkpoint
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "auto: pre-deploy checkpoint $(date -u +%Y-%m-%dT%H:%M:%SZ)" || true
  log "Local checkpoint committed"
fi

# 3. Dependency install
log "Installing dependencies..."
npm ci --legacy-peer-deps || fail "npm ci failed"

# 4. Prisma generate
log "Generating Prisma client..."
npx prisma generate || fail "prisma generate failed"

# 5. Backup current build for rollback
if [ -d ".next/standalone" ]; then
  rm -rf .next/standalone.prev
  cp -r .next/standalone .next/standalone.prev
  log "Build backup created"
fi

# 6. Build
log "Building Next.js..."
npm run build:prod || fail "Build failed"

# 7. Fix standalone paths
log "Fixing standalone paths..."
bash scripts/fix-standalone.sh || fail "Standalone fix failed"

# 8. Reload PM2
log "Reloading PM2..."
pm2 reload ecosystem.config.js --update-env || pm2 start ecosystem.config.js

# 9. Health check
log "Health check..."
for i in {1..12}; do
  sleep 2
  if curl -sf "$HEALTH_URL" > /dev/null; then
    log "Health OK - HTTP 200"
    log "=== HV DEPLOY SUCCESS ==="
    exit 0
  fi
  log "Health check attempt $i/12..."
done

# 10. Rollback on failure
log "Health check FAILED - initiating rollback..."
if [ -d ".next/standalone.prev" ]; then
  rm -rf .next/standalone
  cp -r .next/standalone.prev .next/standalone
  pm2 reload ecosystem.config.js --update-env
  log "Rollback complete - previous build restored"
fi
fail "Deploy failed and rolled back"
