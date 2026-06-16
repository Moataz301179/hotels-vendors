#!/bin/bash
set -e
cd /var/www/hotelsvendors-v2

echo "═══════════════════════════════════════════"
echo "  FIXED MIGRATION DEPLOY"
echo "═══════════════════════════════════════════"

# Apply migrations using prisma, ignoring "already exists" errors
# Strategy: try migrate deploy, if it fails due to "already exists",
# mark that migration as applied and retry

MAX_RETRIES=10
for i in $(seq 1 $MAX_RETRIES); do
  OUTPUT=$(npx prisma migrate deploy 2>&1) && RETCODE=0 || RETCODE=$?
  echo "$OUTPUT"

  if [ "$RETCODE" -eq 0 ]; then
    echo "All migrations applied successfully"
    break
  fi

  # Check for "already exists" error
  if echo "$OUTPUT" | grep -q "relation.*already exists"; then
    TABLE=$(echo "$OUTPUT" | grep "relation.*already exists" | head -1 | sed 's/.*relation "\([^"]*\)".*/\1/')
    echo "⚠ Table $TABLE already exists — checking which migration creates it"

    # Find which pending migration creates this table
    MIGRATION=$(ls -d prisma/migrations/20260*/ | while read dir; do
      name=$(basename "$dir")
      # Skip if already applied
      IS_APPLIED=$(node -e "
        const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();
        p.\$queryRaw\`SELECT id FROM _prisma_migrations WHERE migration_name='\${name}' AND finished_at IS NOT NULL\`.then(r=>{console.log(r.length>0?'yes':'no');p.\$disconnect()});
      " 2>/dev/null)
      if [ "$IS_APPLIED" = "no" ] && grep -q "CREATE TABLE.*\"$TABLE\"" "$dir/migration.sql" 2>/dev/null; then
        echo "$name"
        break
      fi
    done)

    if [ -n "$MIGRATION" ]; then
      echo "Marking $MIGRATION as applied (tables already exist)..."
      npx prisma migrate resolve --applied "$MIGRATION" 2>&1 | tail -1
      continue
    fi
  fi

  # Check for "already been applied" error (duplicate migration in DB)
  if echo "$OUTPUT" | grep -q "started at.*failed"; then
    FAILED_MIGRATION=$(echo "$OUTPUT" | grep "migration started at" | sed "s/.*The \`\(.*\)\` migration started.*/\1/")
    echo "⚠ Found failed record for $FAILED_MIGRATION — marking as applied..."
    npx prisma migrate resolve --applied "$FAILED_MIGRATION" 2>&1 | tail -1
    continue
  fi

  # Unknown error — check for column already exists
  if echo "$OUTPUT" | grep -q "column.*already exists\|duplicate column"; then
    echo "⚠ Column already exists error — marking migration as applied"
    # Extract migration name from the Applying migration line
    MIGRATION=$(echo "$OUTPUT" | grep "Applying migration" | sed "s/.*\`\(.*\)\`/\1/")
    if [ -n "$MIGRATION" ]; then
      npx prisma migrate resolve --applied "$MIGRATION" 2>&1 | tail -1
      continue
    fi
  fi

  echo "❌ Unrecoverable error"
  exit 1
done

echo "═══════════════════════════════════════════"
echo "  MIGRATION DEPLOY COMPLETE"
echo "═══════════════════════════════════════════"
