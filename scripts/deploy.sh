#!/bin/bash
# Hotelsvendors deployment script
# This script is called by cron every 5 minutes
# It ensures the app is running, reloads if needed, and fixes static assets

APP_DIR="/var/www/hotelsvendors-v2"
cd "$APP_DIR"

# Ensure .env exists in standalone directory (standalone server.js needs it)
if [ ! -f "$APP_DIR/.next/standalone/.env" ]; then
    cp "$APP_DIR/.env" "$APP_DIR/.next/standalone/.env" 2>/dev/null || true
fi

# Ensure static assets are available for Nginx (Next.js 16 standalone doesn't include them)
if [ ! -d "$APP_DIR/.next/standalone/.next/static" ] && [ -d "$APP_DIR/.next/static" ]; then
    mkdir -p "$APP_DIR/.next/standalone/.next/static"
    cp -r "$APP_DIR/.next/static/"* "$APP_DIR/.next/standalone/.next/static/" 2>/dev/null || true
fi

# Health check for web app
HEALTH=$(curl -s http://localhost:3003/api/health 2>/dev/null || echo '{"status":"unhealthy"}')
if echo "$HEALTH" | grep -q 'unhealthy'; then
    echo "$(date): Web app unhealthy, restarting..."
    pm2 restart hotels-vendors --update-env 2>&1 || pm2 start ecosystem.config.js 2>&1 || true
fi

# Check if OS backend is running
if ! pm2 list | grep -q "hotels-vendors-os.*online"; then
    echo "$(date): OS backend not running, starting..."
    pm2 start ecosystem.config.js 2>&1 || true
fi

# Copy .env to standalone if it was lost
if [ ! -f "$APP_DIR/.next/standalone/.env" ]; then
    cp "$APP_DIR/.env" "$APP_DIR/.next/standalone/.env" 2>/dev/null || true
fi

echo "$(date): Deploy check complete"
