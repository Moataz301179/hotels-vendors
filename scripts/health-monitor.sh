#!/bin/bash
LOG_FILE="/var/log/hv-health.log"
APP_DIR="/var/www/hotelsvendors-v2"
PID_FILE="/tmp/hv-health.pid"
STATE_FILE="/tmp/hv-build-state.json"

if [ -f "$PID_FILE" ]; then
  OLD_PID=$(cat "$PID_FILE")
  if ps -p "$OLD_PID" > /dev/null 2>&1; then
    echo "$(date): Monitor already running (PID $OLD_PID)" >> "$LOG_FILE"
    exit 0
  fi
fi
echo $$ > "$PID_FILE"

echo "$(date): HotelsVendors Health Monitor started (PID $$)" >> "$LOG_FILE"

while true; do
  PM2_STATUS=$(pm2 describe hotelsvendors 2>/dev/null | grep -c "online")
  
  if [ "$PM2_STATUS" -eq 0 ]; then
    echo "$(date): App offline. Restarting..." >> "$LOG_FILE"
    cd "$APP_DIR" && pm2 restart hotelsvendors 2>/dev/null || cd "$APP_DIR" && pm2 start npm --name hotelsvendors -- start
    echo "$(date): App restarted" >> "$LOG_FILE"
  fi
  
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health 2>/dev/null || echo "000")
  
  if [ "$HTTP_CODE" != "200" ]; then
    echo "$(date): Health check failed (HTTP $HTTP_CODE). Rebuilding..." >> "$LOG_FILE"
    cd "$APP_DIR" && npm run build 2>&1 | tail -n 20 >> "$LOG_FILE"
    pm2 restart hotelsvendors
    echo "$(date): Rebuild complete" >> "$LOG_FILE"
  fi
  
  MEM_USAGE=$(free -m | awk 'NR==2{printf "%.1f%%", $3*100/$2}')
  echo "$(date): Memory: $MEM_USAGE | HTTP: $HTTP_CODE" >> "$LOG_FILE"
  
  sleep 60
done
