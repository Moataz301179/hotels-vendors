#!/bin/bash
# Test DB bootstrap (chunk 9A): creates hotels_vendors_test from $DATABASE_URL,
# applies migrations, seeds reference data.
# Guard: SKIP_DB_SETUP=1 exits early (used by CI when DB is pre-provisioned).
set -euo pipefail

if [ "${SKIP_DB_SETUP:-0}" = "1" ]; then
  echo "SKIP_DB_SETUP=1 - skipping test database bootstrap."
  exit 0
fi

: "${DATABASE_URL:?DATABASE_URL must point at the test Postgres instance}"

TEST_DB_NAME="hotels_vendors_test"

# Derive admin connection URL (same server, default 'postgres' db) for CREATE DATABASE.
ADMIN_URL="$(echo "$DATABASE_URL" | sed -E 's#/[^/?]+(\?|$)#/postgres\1#')"

echo "Checking for test database '${TEST_DB_NAME}'..."
if psql "$ADMIN_URL" -tAc "SELECT 1 FROM pg_database WHERE datname='${TEST_DB_NAME}'" | grep -q 1; then
  echo "Database exists."
else
  echo "Creating database '${TEST_DB_NAME}'..."
  psql "$ADMIN_URL" -c "CREATE DATABASE ${TEST_DB_NAME}"
fi

TEST_DB_URL="$(echo "$DATABASE_URL" | sed -E "s#/[^/?]+(\?|$)#/${TEST_DB_NAME}\1#")"

echo "Applying Prisma migrations..."
DATABASE_URL="$TEST_DB_URL" npx prisma migrate deploy

echo "Seeding test data..."
DATABASE_URL="$TEST_DB_URL" npx tsx prisma/seed.ts

echo "Test database '${TEST_DB_NAME}' ready."
