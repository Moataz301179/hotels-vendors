const {PrismaClient} = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // Delete all failed/stale migration records
  const deleted = await p.$executeRaw`DELETE FROM _prisma_migrations WHERE finished_at IS NULL`;
  console.log(`Deleted ${deleted} failed/stale records`);

  // Mark init as applied (all core tables exist from tenant_rbac_schema)
  const initExists = await p.$queryRaw`SELECT id FROM _prisma_migrations WHERE migration_name = '20260501082822_init' AND finished_at IS NOT NULL`;
  if (initExists.length === 0) {
    await p.$executeRaw`INSERT INTO _prisma_migrations (id, checksum, migration_name, started_at, finished_at, applied_steps_count) VALUES (gen_random_uuid()::text, 'baseline-init', '20260501082822_init', NOW(), NOW(), 1)`;
    console.log('Marked 20260501082822_init as applied');
  }

  // Mark intelligence_layer as applied (Competitor, MarketInsight, FeatureProposal, AgentRun all exist)
  const intelExists = await p.$queryRaw`SELECT id FROM _prisma_migrations WHERE migration_name = '20260501102449_add_intelligence_layer' AND finished_at IS NOT NULL`;
  if (intelExists.length === 0) {
    await p.$executeRaw`INSERT INTO _prisma_migrations (id, checksum, migration_name, started_at, finished_at, applied_steps_count) VALUES (gen_random_uuid()::text, 'baseline-intel', '20260501102449_add_intelligence_layer', NOW(), NOW(), 1)`;
    console.log('Marked 20260501102449_add_intelligence_layer as applied');
  }

  // Mark coastal_models as applied (all tables exist)
  const coastalExists = await p.$queryRaw`SELECT id FROM _prisma_migrations WHERE migration_name = '20260501161123_add_coastal_models' AND finished_at IS NOT NULL`;
  if (coastalExists.length === 0) {
    await p.$executeRaw`INSERT INTO _prisma_migrations (id, checksum, migration_name, started_at, finished_at, applied_steps_count) VALUES (gen_random_uuid()::text, 'baseline-coastal', '20260501161123_add_coastal_models', NOW(), NOW(), 1)`;
    console.log('Marked 20260501161123_add_coastal_models as applied');
  }

  // The remaining 3 need actual deploy: add_accounting_inventory, update_categories_roles, add_fintech_risk_layer, add_audit_hash_chain
  // These have new tables that don't exist yet

  // Verify final state
  const all = await p.$queryRaw`SELECT migration_name, finished_at FROM _prisma_migrations ORDER BY started_at`;
  console.log('\nFinal migration state:');
  for (const r of all) {
    console.log(`  ${r.migration_name}: ${r.finished_at ? 'APPLIED' : 'PENDING'}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => p.$disconnect());
