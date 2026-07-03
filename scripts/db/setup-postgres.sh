#!/bin/bash
# PostgreSQL Setup Script for Hotels Vendors
# Run once per environment (dev, staging)

set -e

echo "=== Hotels Vendors PostgreSQL Setup ==="

# Configuration (override with env vars)
DB_NAME="${HV_DB_NAME:-hotelsvendors}"
DB_USER="${HV_DB_USER:-hvuser}"
DB_PASS="${HV_DB_PASS:-hvpass123}"
DB_HOST="${HV_DB_HOST:-localhost}"
DB_PORT="${HV_DB_PORT:-5432}"

echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Host: $DB_HOST:$DB_PORT"

# Create user
psql postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';" 2>/dev/null || echo "User may already exist"

# Create database
psql postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null || echo "Database may already exist"

# Grant permissions
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# Create extensions
psql "$DB_NAME" -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

# Generate connection string
CONNECTION_URL="postgresql://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME"

echo ""
echo "=== Setup Complete ==="
echo "Connection URL: $CONNECTION_URL"
echo ""
echo "Add to .env:"
echo "DATABASE_URL=$CONNECTION_URL"
echo ""
echo "Test with: npx prisma db pull"
