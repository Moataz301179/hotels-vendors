#!/usr/bin/env bash
set -euo pipefail

APP_URL="${1:-https://www.hotelsvendors.com/api/health}"

printf "\nHotelsVendors deploy checkpoints\n"
printf "Target health URL: %s\n\n" "$APP_URL"

printf "[1/6] Install dependencies\n"
npm ci --legacy-peer-deps

printf "[2/6] Lint (non-blocking)\n"
if ! npm run lint; then
  echo "Lint failed (non-blocking). Continue with strict gates."
fi

printf "[3/6] Typecheck\n"
npx tsc --noEmit

printf "[4/6] Prisma generate\n"
npx prisma generate

printf "[5/6] Build\n"
NEXT_TELEMETRY_DISABLED=1 npm run build

printf "[6/6] Health check\n"
status=$(curl -s -o /tmp/hv-health.json -w "%{http_code}" "$APP_URL" || echo "000")
printf "Health status: %s\n" "$status"
if [ "$status" != "200" ]; then
  echo "Health check failed. Response body:"
  cat /tmp/hv-health.json || true
  exit 1
fi

echo "All deployment checkpoints passed."
