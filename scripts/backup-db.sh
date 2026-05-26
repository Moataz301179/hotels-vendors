#!/bin/bash
set -euo pipefail
BACKUP_DIR="/var/backups/hotelsvendors"
DB_NAME="${HV_DB_NAME:-hotels_vendors}"
DB_USER="${HV_DB_USER:-postgres}"
RETENTION_DAYS=14
mkdir -p "$BACKUP_DIR/daily" "$BACKUP_DIR/hourly"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DAILY_FILE="$BACKUP_DIR/daily/hv_${TIMESTAMP}.sql.gz"
HOURLY_FILE="$BACKUP_DIR/hourly/hv_${TIMESTAMP}.sql.gz"
log() { echo "[$(date +%Y-%m-%d\ %H:%M:%S)] $*" | tee -a "$BACKUP_DIR/backup.log"; }
if [[ "$(date +%H)" == "02" ]]; then
    log "Starting DAILY backup..."
    pg_dump -h localhost -U "$DB_USER" -d "$DB_NAME" --clean --if-exists | gzip > "$DAILY_FILE"
    log "Daily backup complete: $DAILY_FILE ($(du -h "$DAILY_FILE" | cut -f1))"
    find "$BACKUP_DIR/daily" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
fi
if (( $(date +%H) % 4 == 0 )); then
    log "Starting HOURLY backup..."
    pg_dump -h localhost -U "$DB_USER" -d "$DB_NAME" --data-only --inserts \
        --table="sessions" --table="audit_logs" --table="agent_runs" 2>/dev/null | gzip > "$HOURLY_FILE" || true
    log "Hourly backup complete"
    find "$BACKUP_DIR/hourly" -name "*.sql.gz" -mtime +2 -delete
fi
