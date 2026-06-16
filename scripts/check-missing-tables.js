const {PrismaClient} = require('@prisma/client');
const p = new PrismaClient();

// Tables that the pending migrations try to CREATE (from reading the SQL)
const migrationTables = {
  '20260501102449_add_intelligence_layer': ['Competitor', 'MarketInsight', 'FeatureProposal', 'AgentRun'],
  '20260501121709_add_accounting_inventory': ['JournalEntry', 'LedgerAccount', 'InventorySnapshot', 'InventoryMovement', 'BudgetAllocation'],
  '20260501133850_update_categories_roles': [], // ALTER TABLE only
  '20260501161123_add_coastal_models': ['Cart', 'CartItem', 'FactoringCompany', 'FactoringApplication', 'LogisticsHub', 'DeliveryZone', 'Trip', 'TripStop', 'ConsolidatedOrder'],
  '20260501203253_add_fintech_risk_layer': ['CreditFacility', 'CreditDraw', 'CreditRepayment', 'CreditTransaction', 'CreditLineApplication', 'RecourseLiability', 'RiskAssessment'],
  '20260501210526_add_audit_hash_chain': ['AuditHashChain', 'ComplianceCheck'],
};

async function main() {
  const existing = await p.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
  const existingSet = new Set(existing.map(r => r.table_name));

  for (const [migration, tables] of Object.entries(migrationTables)) {
    const missing = tables.filter(t => !existingSet.has(t));
    if (missing.length > 0) {
      console.log(`${migration}: MISSING tables: ${missing.join(', ')}`);
    } else if (tables.length > 0) {
      console.log(`${migration}: all tables exist`);
    } else {
      console.log(`${migration}: no new tables (DDL changes only)`);
    }
  }
}

main().catch(e => console.error(e)).finally(() => p.$disconnect());
