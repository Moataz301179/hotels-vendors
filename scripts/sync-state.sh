#!/bin/bash
set -euo pipefail
APP_DIR="/var/www/hotelsvendors-v2"
STATE_FILE="/tmp/mission-control-state.json"
SYNC_INTERVAL=60
if [[ ! -f "$STATE_FILE" ]]; then
    echo agents:{},lastSync:0,status:initialized > "$STATE_FILE"
fi
while true; do
    if redis-cli ping > /dev/null 2>&1; then
        redis-cli hgetall hv:agents 2>/dev/null | while read -r key && read -r val; do
            jq --arg k "$key" --arg v "$val" ".agents[\$k] = \$v" "$STATE_FILE" > "${STATE_FILE}.tmp" && \
                mv "${STATE_FILE}.tmp" "$STATE_FILE"
        done
        jq --arg ts "$(date -Iseconds)" ".lastSync = \$ts | .status = \"redis\"" "$STATE_FILE" > "${STATE_FILE}.tmp" && \
            mv "${STATE_FILE}.tmp" "$STATE_FILE"
    else
        jq --arg ts "$(date -Iseconds)" ".lastSync = \$ts | .status = \"json_fallback\"" "$STATE_FILE" > "${STATE_FILE}.tmp" && \
            mv "${STATE_FILE}.tmp" "$STATE_FILE"
    fi
    cp "$STATE_FILE" "$APP_DIR/.state.json" 2>/dev/null || true
    sleep $SYNC_INTERVAL
done
