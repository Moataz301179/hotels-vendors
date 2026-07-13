#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Backup Verification Script — Hotels Vendors
# CRITICAL FIX: Automated backup restore testing.
#
# Usage:
#   ./scripts/verify-backup.sh                    # Verify latest backup
#   ./scripts/verify-backup.sh /path/to/backup.sql.gz  # Verify specific file
#
# Requirements:
#   - pg_restore or psql available
#   - DATABASE_URL for temp restore database
#   - Backups stored in BACKUP_DIR (default: /var/backups/hotels-vendors)
#
# What it does:
#   1. Lists available backups (sorted by date)
#   2. Creates a temporary verification database
#   3. Restores the backup into the temp database
#   4. Runs integrity queries
#   5. Reports success/failure
#   6. Cleans up temp database
# ─────────────────────────────────────────────────────────────

set -euo pipefail

# ── Configuration ──
BACKUP_DIR="${BACKUP_DIR:-/var/backups/hotels-vendors}"
TEMP_DB_NAME="hotelsvendors_verify_$(date +%s)"
SOURCE_DB_URL="${DATABASE_URL:-}"
VERIFY_DB_PORT="${VERIFY_DB_PORT:-5432}"
VERIFY_DB_HOST="${VERIFY_DB_HOST:-localhost}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

# ── Colors ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()  { echo -e "${BLUE}[INFO]${NC}  $*"; }
log_ok()    { echo -e "${GREEN}[OK]${NC}    $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*"; }

# ── Cleanup ──
cleanup() {
  log_info "Cleaning up temporary database..."
  psql -h "$VERIFY_DB_HOST" -p "$VERIFY_DB_PORT" -U "${DB_USER:-postgres}" -d postgres \
    -c "DROP DATABASE IF EXISTS $TEMP_DB_NAME;" 2>/dev/null || true
}

trap cleanup EXIT

# ── List Backups ──
list_backups() {
  log_info "Available backups in $BACKUP_DIR:"
  echo ""
  if [ ! -d "$BACKUP_DIR" ]; then
    log_error "Backup directory does not exist: $BACKUP_DIR"
    exit 1
  fi

  local count=0
  ls -lht "$BACKUP_DIR"/*.sql.gz 2>/dev/null | head -10 | while read -r line; do
    echo "  $line"
    count=$((count + 1))
  done

  if [ -z "$(ls -A "$BACKUP_DIR"/*.sql.gz 2>/dev/null)" ]; then
    log_error "No backup files found in $BACKUP_DIR"
    exit 1
  fi
  echo ""
}

# ── Determine Backup File ──
BACKUP_FILE="${1:-}"
if [ -z "$BACKUP_FILE" ]; then
  BACKUP_FILE=$(ls -t "$BACKUP_DIR"/*.sql.gz 2>/dev/null | head -1)
  if [ -z "$BACKUP_FILE" ]; then
    log_error "No backup file found"
    exit 1
  fi
  log_info "Using latest backup: $BACKUP_FILE"
fi

if [ ! -f "$BACKUP_FILE" ]; then
  log_error "Backup file not found: $BACKUP_FILE"
  exit 1
fi

# ── Verify backup file ──
log_info "Verifying backup file..."
BACKUP_SIZE=$(stat -f%z "$BACKUP_FILE" 2>/dev/null || stat -c%s "$BACKUP_FILE" 2>/dev/null)
if [ "$BACKUP_SIZE" -lt 100 ]; then
  log_error "Backup file is suspiciously small ($BACKUP_SIZE bytes) — likely empty or corrupted"
  exit 1
fi
log_ok "Backup file size: $BACKUP_SIZE bytes"

# Check gzip integrity
if ! gzip -t "$BACKUP_FILE" 2>/dev/null; then
  log_error "Backup file is corrupted (gzip test failed)"
  exit 1
fi
log_ok "Gzip integrity check passed"

# ── Create Temp Database ──
log_info "Creating temporary verification database: $TEMP_DB_NAME"
DB_USER="${DB_USER:-postgres}"
psql -h "$VERIFY_DB_HOST" -p "$VERIFY_DB_PORT" -U "$DB_USER" -d postgres \
  -c "CREATE DATABASE $TEMP_DB_NAME;" 2>/dev/null
log_ok "Temp database created"

# ── Restore Backup ──
log_info "Restoring backup into temp database..."
RESTORE_START=$(date +%s)

if gunzip -c "$BACKUP_FILE" | psql -h "$VERIFY_DB_HOST" -p "$VERIFY_DB_PORT" -U "$DB_USER" \
  -d "$TEMP_DB_NAME" -v ON_ERROR_STOP=1 --quiet 2>/dev/null; then
  RESTORE_END=$(date +%s)
  RESTORE_DURATION=$((RESTORE_END - RESTORE_START))
  log_ok "Restore completed in ${RESTORE_DURATION}s"
else
  log_error "Restore FAILED — backup may be corrupted"
  exit 1
fi

# ── Integrity Checks ──
log_info "Running integrity checks..."
ERRORS=0

# Check critical tables exist
TABLES_TO_CHECK=("User" "Tenant" "Order" "Invoice" "Product" "AuditLog" "SwarmJob")
for table in "${TABLES_TO_CHECK[@]}"; do
  if psql -h "$VERIFY_DB_HOST" -p "$VERIFY_DB_PORT" -U "$DB_USER" \
    -d "$TEMP_DB_NAME" -tAc "SELECT 1 FROM information_schema.tables WHERE table_name = '$table'" 2>/dev/null | grep -q 1; then
    log_ok "Table '$table' exists"
  else
    log_error "Table '$table' NOT FOUND"
    ERRORS=$((ERRORS + 1))
  fi
done

# Check record counts
log_info "Record counts in restored database:"
for table in "${TABLES_TO_CHECK[@]}"; do
  COUNT=$(psql -h "$VERIFY_DB_HOST" -p "$VERIFY_DB_PORT" -U "$DB_USER" \
    -d "$TEMP_DB_NAME" -tAc "SELECT COUNT(*) FROM \"$table\"" 2>/dev/null || echo "?")
  echo "  $table: $COUNT rows"
done

# Check AuditLog hash chain integrity (if records exist)
AUDIT_COUNT=$(psql -h "$VERIFY_DB_HOST" -p "$VERIFY_DB_PORT" -U "$DB_USER" \
  -d "$TEMP_DB_NAME" -tAc "SELECT COUNT(*) FROM \"AuditLog\"" 2>/dev/null || echo "0")
if [ "$AUDIT_COUNT" -gt 0 ]; then
  ORPHANED=$(psql -h "$VERIFY_DB_HOST" -p "$VERIFY_DB_PORT" -U "$DB_USER" \
    -d "$TEMP_DB_NAME" -tAc \
    "SELECT COUNT(*) FROM \"AuditLog\" a WHERE a.\"previousHash\" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM \"AuditLog\" b WHERE b.hash = a.\"previousHash\")" 2>/dev/null || echo "?")
  if [ "$ORPHANED" = "0" ]; then
    log_ok "AuditLog hash chain: no orphaned entries"
  else
    log_warn "AuditLog hash chain: $ORPHANED orphaned entries (may indicate tampering)"
  fi
fi

# ── Report ──
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$ERRORS" -eq 0 ]; then
  log_ok "BACKUP VERIFICATION PASSED"
  echo "  Backup: $BACKUP_FILE"
  echo "  Size:   $BACKUP_SIZE bytes"
  echo "  Time:   $(date -r "$BACKUP_FILE" 2>/dev/null || stat -c%y "$BACKUP_FILE" 2>/dev/null)"
  echo "  Restore: ${RESTORE_DURATION:-0}s"
  echo "  Status:  All integrity checks passed"
else
  log_error "BACKUP VERIFICATION FAILED — $ERRORS errors detected"
  echo "  Backup: $BACKUP_FILE"
  echo "  Errors: $ERRORS"
  exit 1
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
