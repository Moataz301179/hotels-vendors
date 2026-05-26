#!/bin/bash
STATE_FILE="/tmp/hv-build-state.json"
APP_DIR="/var/www/hotelsvendors-v2"

echo "=== HotelsVendors Session Recovery ==="
echo "Timestamp: $(date)"
echo ""

if [ -f "$STATE_FILE" ]; then
  echo "Last known state:"
  cat "$STATE_FILE"
else
  echo "No state file found. Creating fresh state..."
  echo '{"status":"unknown","last_build":"never","agents":[],"issues":[]}' > "$STATE_FILE"
fi

echo ""
echo "Current PM2 status:"
pm2 describe hotelsvendors 2>/dev/null || echo "App not registered in PM2"

echo ""
echo "Current git status:"
cd "$APP_DIR" && git status --short 2>/dev/null || echo "Not a git repo or no git"

echo ""
echo "Health check:"
curl -s http://localhost:3000/api/health 2>/dev/null || echo "App not responding"
