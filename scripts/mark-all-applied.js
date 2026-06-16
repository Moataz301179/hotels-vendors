const {PrismaClient} = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // Delete any failed/stale records
  await p.$executeRaw`DELETE FROM _prisma_migrations WHERE finished_at IS NULL`;

  // Mark all migrations as applied
  const allMigrations = [
    '20260501082822_init',
    '20260501102449_add_intelligence_layer',
    '20260501121709_add_accounting_inventory',
    '20260501133850_update_categories_roles',
    '20260501161123_add_coastal_models',
    '20260501203253_add_fintech_risk_layer',
    '20260501210526_add_audit_hash_chain',
    '20260502000000_add_tenant_rbac_schema',
  ];

  for (const name of allMigrations) {
    const existing = await p.$queryRaw`SELECT id FROM _prisma_migrations WHERE migration_name = ${name} AND finished_at IS NOT NULL`;
    if (existing.length === 0) {
      await p.$executeRaw`
        INSERT INTO _prisma_migrations (id, checksum, migration_name, started_at, finished_at, applied_steps_count)
        VALUES (gen_random_uuid()::text, 'baseline-' || ${name}, ${name}, NOW(), NOW(), 1)
      `;
      console.log(`Marked: ${name}`);
    } else {
      console.log(`Already applied: ${name}`);
    }
  }

  // Verify
  const final = await p.$queryRaw`SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NOT NULL ORDER BY started_at`;
  console.log(`\nTotal applied: ${final.length}`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => p.$disconnect());
