#!/usr/bin/env bash
# ----------------------------------------
# hostinger-deploy.sh
#  • Builds Next.js in export mode
#  • Copies output to Hostinger via SCP
#  • Supports dry‑run mode for testing
# ----------------------------------------

set -euo pipefail

# Configuration – edit or load from env
SSH_USER="${HOSTINGER_SSH_USER:-}"
SSH_HOST="${HOSTINGER_SSH_HOST:-}"
TARGET_DIR="${HOSTINGER_TARGET_DIR:-/public}"
DRY_RUN="${HOSTINGER_DRY_RUN:-false}"

if [[ -z "$SSH_USER" ]] || [[ -z "$SSH_HOST" ]]; then
  echo "⚠️  Missing SSH config. Please set HOSTINGER_SSH_USER, HOSTINGER_SSH_HOST, and HOSTINGER_TARGET_DIR."
  exit 1
fi

# 1. Build & export
echo "🔨 Building Next.js (production)..."
npm run build:host

# 2. Confirm output directory
EXPORT_DIR="_next"
if [[ ! -d "$EXPORT_DIR" ]]; then
  echo "❌ Expected export directory _next not found."
  exit 1
fi

# 3. Upload to Hostinger
if [[ "$DRY_RUN" == "true" ]]; then
  echo "✅ Dry‑run: files would be uploaded to $SSH_USER@$SSH_HOST:$TARGET_DIR"
else
  echo "🚀 Uploading to Hostinger ($SSH_USER@$SSH_HOST:$TARGET_DIR)..."
  rsync -avz --delete _next/ "${SSH_USER}@${SSH_HOST}:${TARGET_DIR}/"
  echo "✅ Upload complete."
fi

exit 0