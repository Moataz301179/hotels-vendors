#!/usr/bin/env bash
# ==============================================================================
# HotelsVendors — Automated PostgreSQL Database Backup
# ==============================================================================
# Usage:
#   ./scripts/backup-db.sh                    # Run manually
#   0 3 * * * /path/to/scripts/backup-db.sh  # Cron: daily at 3 AM
#
# Prerequisites:
#   - Docker running with the postgres container
#   - PGPASSWORD env var or .pgpass file configured
#
# Environment:
#   PG_CONTAINER  — Docker container name (default: hotels-vendors-db)
#   PG_USER       — PostgreSQL user (default: hotels_vendors)
#   PG_DATABASE   — Database name (default: hotels_vendors)
#   BACKUP_DIR    — Backup storage path (default: /var/backups/hotels-vendors)
#   RETENTION_DAYS— Days to keep old backups (default: 30)
# ==============================================================================

set -euo pipefail

# ── Configuration ──
PG_CONTAINER="${PG_CONTAINER:-hotels-vendors-db}"
PG_USER="${PG_USER:-hotels_vendors}"
PG_DATABASE="${PG_DATABASE:-hotels_vendors}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/hotels-vendors}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${PG_DATABASE}_${TIMESTAMP}.sql.gz"

# ── Ensure backup directory exists ──
mkdir -p "${BACKUP_DIR}"

# ── Verify container is running ──
if ! docker inspect --format='{{.State.Running}}' "${PG_CONTAINER}" 2>/dev/null | grep -q "true"; then
  echo "[ERROR] PostgreSQL container '${PG_CONTAINER}' is not running."
  exit 1
fi

# ── Perform backup ──
echo "[INFO] Starting backup: ${PG_DATABASE} @ $(date -Iseconds)"
echo "[INFO] Output: ${BACKUP_FILE}"

docker exec "${PG_CONTAINER}" \
  pg_dump -U "${PG_USER}" -d "${PG_DATABASE}" \
  --no-owner --no-privileges --clean --if-exists \
  | gzip > "${BACKUP_FILE}"

# ── Verify backup ──
BACKUP_SIZE=$(stat -f%z "${BACKUP_FILE}" 2>/dev/null || stat -c%s "${BACKUP_FILE}" 2>/dev/null || echo "0")
if [ "${BACKUP_SIZE}" -lt 100 ]; then
  echo "[ERROR] Backup file is suspiciously small (${BACKUP_SIZE} bytes). Possible failure."
  exit 1
fi

echo "[INFO] Backup completed: ${BACKUP_FILE} (${BACKUP_SIZE} bytes)"

# ── Rotate old backups ──
echo "[INFO] Rotating backups older than ${RETENTION_DAYS} days..."
DELETED=$(find "${BACKUP_DIR}" -name "${PG_DATABASE}_*.sql.gz" -type f -mtime +${RETENTION_DAYS} -print -delete | wc -l)
echo "[INFO] Removed ${DELETED} old backup(s)"

# ── Summary ──
REMAINING=$(find "${BACKUP_DIR}" -name "${PG_DATABASE}_*.sql.gz" -type f | wc -l)
TOTAL_SIZE=$(du -sh "${BACKUP_DIR}" 2>/dev/null | cut -f1)
echo "[INFO] Remaining backups: ${REMAINING} (${TOTAL_SIZE} total)"
echo "[DONE] Backup pipeline complete."
