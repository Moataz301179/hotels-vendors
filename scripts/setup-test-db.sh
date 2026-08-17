#!/bin/bash
# Create test database (mirrors prod schema, separate data)
set -e

echo "Setting up test database..."

PGPASSWORD=hv_prod_pass psql -h localhost -p 5433 -U hv_prod -tc \
  "SELECT 1 FROM pg_database WHERE datname = 'hotelsvendors_test'" | grep -q 1 || \
  PGPASSWORD=hv_prod_pass psql -h localhost -p 5433 -U hv_prod -c \
  "CREATE DATABASE hotelsvendors_test"

DATABASE_URL="postgresql://hv_prod:hv_prod_pass@localhost:5433/hotelsvendors_test?schema=public" \
  npx prisma db push --force-reset --accept-data-loss

echo "Test database ready."
