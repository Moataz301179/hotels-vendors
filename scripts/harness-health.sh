#!/bin/bash
# Harness Health — quick health check for cron use

URL="https://hotelsvendors.com"
LOG="./harness-health.log"
ALERT_LOG="./harness-alerts.log"

HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' --connect-timeout 10 "$URL" 2>/dev/null)
TS=$(date '+%Y-%m-%d %H:%M:%S')

echo "$TS HTTP $HTTP_CODE" >> "$LOG"

if [ "$HTTP_CODE" != "200" ] && [ "$HTTP_CODE" != "301" ] && [ "$HTTP_CODE" != "302" ]; then
  echo "$TS ALERT: Site returned HTTP $HTTP_CODE" >> "$ALERT_LOG"
  
  # Attempt auto-recovery
  pm2 restart 0 --update-env 2>/dev/null
  sleep 5
  
  RETRY=$(curl -s -o /dev/null -w '%{http_code}' --connect-timeout 10 "$URL" 2>/dev/null)
  echo "$TS Recovery attempt: HTTP $RETRY" >> "$ALERT_LOG"
fi

# Keep last 1000 lines
tail -1000 "$LOG" > "${LOG}.tmp" && mv "${LOG}.tmp" "$LOG"
