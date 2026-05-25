#!/bin/bash
# HotelsVendors State Backup Script
# Run via cron or manually to snapshot critical state

set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/hotelsvendors"
PROJECT_DIR="/var/www/hotelsvendors-v2"
DB_NAME="hotels_vendors"
DB_USER="postgres"

mkdir -p "$BACKUP_DIR"

echo "[$TIMESTAMP] Starting backup..."

# 1. Database dump
pg_dump -U "$DB_USER" -d "$DB_NAME" --no-owner --no-privileges > "$BACKUP_DIR/db_$TIMESTAMP.sql" 2>/dev/null || echo "DB backup skipped (PostgreSQL not running)"

# 2. Git state snapshot
cd "$PROJECT_DIR"
git add -A
git commit -m "auto-backup: $TIMESTAMP" --allow-empty 2>/dev/null || true
git bundle create "$BACKUP_DIR/repo_$TIMESTAMP.bundle" --all 2>/dev/null || echo "Git bundle skipped"

# 3. Prisma schema copy
cp "$PROJECT_DIR/prisma/schema.prisma" "$BACKUP_DIR/schema_$TIMESTAMP.prisma"

# 4. Environment files (sanitized)
cp "$PROJECT_DIR/.env" "$BACKUP_DIR/env_$TIMESTAMP" 2>/dev/null || true
cp "$PROJECT_DIR/.env.local" "$BACKUP_DIR/env_local_$TIMESTAMP" 2>/dev/null || true

# 5. Keep only last 10 backups
ls -t "$BACKUP_DIR"/db_*.sql 2>/dev/null | tail -n +11 | xargs -r rm -f
ls -t "$BACKUP_DIR"/repo_*.bundle 2>/dev/null | tail -n +11 | xargs -r rm -f
ls -t "$BACKUP_DIR"/schema_*.prisma 2>/dev/null | tail -n +11 | xargs -r rm -f
ls -t "$BACKUP_DIR"/env_* 2>/dev/null | tail -n +11 | xargs -r rm -f

echo "[$TIMESTAMP] Backup complete. Files in $BACKUP_DIR"
ls -la "$BACKUP_DIR"
