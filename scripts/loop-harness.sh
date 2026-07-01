#!/bin/bash
# Loop Harness v1 — Autonomous Build → Optimize → Deploy cycle

set -e

LOG_FILE="loop-harness.log"
STATE_FILE=".harness-state.json"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

# ── Phase Functions ──

phase_build() {
  log "═══ PHASE: BUILD ═══"
  
  # 1. Pull latest
  git pull origin main 2>&1 | tail -1
  
  # 2. Install deps
  npm ci --silent 2>&1 || npm install --silent 2>&1
  
  # 3. Prisma generate
  npx prisma generate 2>&1 | tail -1
  
  # 4. TypeScript check
  npx tsc --noEmit 2>&1 && log "TypeScript: OK" || { log "TypeScript: FAILED"; return 1; }
  
  # 5. Lint
  npx next lint 2>&1 | tail -3 && log "Lint: OK" || { log "Lint: FAILED"; return 1; }
  
  # 6. Build
  npx next build 2>&1 | tail -3 && log "Build: OK" || { log "Build: FAILED"; return 1; }
  
  return 0
}

phase_optimize() {
  log "═══ PHASE: OPTIMIZE ═══"
  
  # 1. Check for dead/unused imports
  UNUSED=$(grep -rn "console.log" app/ components/ --include='*.tsx' --include='*.ts' | grep -v "node_modules" | grep -v ".next" | wc -l)
  if [ "$UNUSED" -gt 0 ]; then
    log "WARNING: $UNUSED console.log statements found"
  fi
  
  # 2. Check for hardcoded blue (#3B82F6) in pages
  BLUE_COUNT=$(grep -rn "#3B82F6" app/ --include='*.tsx' --include='*.ts' 2>/dev/null | wc -l)
  if [ "$BLUE_COUNT" -gt 0 ]; then
    log "WARNING: $BLUE_COUNT instances of #3B82F6 (blue) found — should use Ember amber"
  fi
  
  log "Optimization check: OK"
  return 0
}

phase_deploy() {
  log "═══ PHASE: DEPLOY ═══"
  
  # 1. Restart PM2
  pm2 restart 0 --update-env && log "PM2: restarted" || { log "PM2: restart failed"; return 1; }
  
  sleep 3
  
  # 2. Health check
  STATUS=$(curl -s -o /dev/null -w '%{http_code}' -H 'Host: hotelsvendors.com' https://localhost:443/ -k 2>/dev/null)
  if [ "$STATUS" = "200" ]; then
    log "Health check: HTTP $STATUS ✓"
  else
    log "Health check: HTTP $STATUS ✗"
    return 1
  fi
  
  # 3. Verify pages (check for 200 on key routes)
  for path in "/" "/marketplace" "/invo" "/register" "/login"; do
    CODE=$(curl -s -o /dev/null -w '%{http_code}' -H "Host: hotelsvendors.com" "https://localhost:443$path" -k 2>/dev/null)
    log "  $path → $CODE"
    if [ "$CODE" != "200" ] && [ "$CODE" != "301" ] && [ "$CODE" != "302" ]; then
      log "  WARNING: $path returned $CODE"
    fi
  done
  
  return 0
}

phase_operate() {
  log "═══ PHASE: OPERATE ═══"
  
  # 1. Check for recent errors in PM2 logs
  pm2 logs 0 --lines 20 --nostream 2>/dev/null | grep -i "error\|warn\|fatal" | tail -5
  
  # 2. Check disk space
  USAGE=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')
  if [ "$USAGE" -gt 85 ]; then
    log "WARNING: Disk at ${USAGE}%"
  fi
  
  # 3. Check memory
  MEM=$(free -m | grep Mem | awk '{print $3/$2 * 100.0}' | cut -d. -f1)
  if [ "$MEM" -gt 85 ]; then
    log "WARNING: Memory at ${MEM}%"
  fi
  
  log "Operation check: OK"
  return 0
}

# ── Main Loop ──

log "══════════════════════════════════════"
log "  LOOP HARNESS STARTED"
log "══════════════════════════════════════"

while true; do
  START_TIME=$(date +%s)
  
  phase_build || log "BUILD FAILED — retrying in 60s"
  phase_optimize || log "OPTIMIZE FAILED — continuing"
  phase_deploy || log "DEPLOY FAILED — retrying in 60s"
  phase_operate || log "OPERATE CHECK FAILED — continuing"
  
  ELAPSED=$(( $(date +%s) - START_TIME ))
  SLEEP=$(( 300 - ELAPSED ))
  [ "$SLEEP" -lt 60 ] && SLEEP=60
  
  log "Cycle complete in ${ELAPSED}s. Sleeping ${SLEEP}s..."
  log "────────────────────────────────────"
  sleep "$SLEEP"
done
