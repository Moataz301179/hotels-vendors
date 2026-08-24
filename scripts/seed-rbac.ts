/**
 * RBAC Seed — Permission catalog + Role→Permission matrix.
 * Idempotent: upserts permissions, creates global roles per platform role,
 * and grants RolePermissions. Safe to re-run.
 *
 * Platform roles (JWT platformRole): HOTEL, SUPPLIER, FACTORING, SHIPPING,
 * MARKETING, ADMIN. Roles table rows are global (tenantId=null, isGlobal=true)
 * named exactly like the platformRole so rbac.ts lookups by user.roleId resolve.
 *
 * Run: npx tsx scripts/seed-rbac.ts
 */
import { prisma } from "@/lib/prisma";

const PERMISSIONS: [string, string, string][] = [
  // orders
  ["order:read", "Read orders", "View purchase orders in tenant scope"],
  ["order:create", "Create orders", "Draft and submit purchase orders"],
  ["order:update", "Update orders", "Edit draft orders"],
  ["order:approve", "Approve orders", "Authority Matrix approval actions"],
  ["order:confirm", "Confirm orders", "Confirm approved orders (payment-gated)"],
  ["order:checkout", "Checkout", "Complete marketplace checkout"],
  // products / catalog
  ["product:read", "Read products", "Browse marketplace catalog"],
  ["product:create", "Create products", "List new products"],
  ["product:update", "Update products", "Edit own listings"],
  ["product:delete", "Delete products", "Delist own products"],
  ["catalog:manage", "Manage catalog", "Bulk catalog management"],
  // inventory
  ["inventory:read", "Read inventory", "View stock levels and reconciliations"],
  ["inventory:write", "Write inventory", "Stock counts, par levels, GRN"],
  // invoices / ETA
  ["invoice:read", "Read invoices", "View invoices"],
  ["invoice:create", "Create invoices", "Issue invoices"],
  ["invoice:submit", "Submit invoices", "Submit for processing"],
  ["invoice:submit_eta", "Submit to ETA", "ETA e-invoicing submission"],
  ["invoice:factor", "Factor invoices", "Request factoring on invoices"],
  // factoring / fintech
  ["factoring:inquire", "Inquire factoring", "View factoring offers and status"],
  ["factoring:manage", "Manage factoring", "Manage factoring portfolio"],
  ["factoring:approve_credit", "Approve credit", "Credit line approvals"],
  ["factoring:fund", "Fund invoices", "Fund factored invoices"],
  ["fintech:read", "Read fintech", "Financial dashboards and reports"],
  ["fintech:write", "Write fintech", "Financial operations"],
  ["payment:create", "Create payments", "Initiate payments"],
  ["payment:write", "Write payments", "Payment mutations"],
  ["payment:release", "Release payments", "Release held payments"],
  // rfq / disputes
  ["rfq:create", "Create RFQ", "Request quotes from suppliers"],
  ["disputes:list", "List disputes", "View disputes"],
  ["disputes:read", "Read disputes", "View dispute detail"],
  ["disputes:create", "Create disputes", "Open disputes"],
  ["disputes:update", "Update disputes", "Update dispute status"],
  ["disputes:resolve", "Resolve disputes", "Final dispute resolution"],
  // shipping
  ["shipping:read", "Read shipping", "View trips and deliveries"],
  ["shipping:create_trip", "Create trips", "Plan and assign delivery trips"],
  // suppliers / reports
  ["supplier:read", "Read suppliers", "View supplier profiles"],
  ["report:read", "Read reports", "Analytics and spend reports"],
  // compliance
  ["compliance:kyc:read", "Read KYC", "View KYC status"],
  ["compliance:kyc:submit", "Submit KYC", "Submit KYC documents"],
  // crm
  ["crm:read", "Read CRM", "View CRM records"],
  ["crm:write", "Write CRM", "Manage CRM records"],
  // admin
  ["admin:read", "Read admin", "Admin dashboards"],
  ["admin:manage_platform", "Manage platform", "Full platform administration"],
  ["admin:manage_credentials", "Manage credentials", "ETA and partner credentials"],
  ["admin:manage_env", "Manage environment", "Environment configuration"],
  ["admin:override_authority", "Override authority", "Dual-auth authority override"],
];

/** Permission matrix per platform role (principle: role gets what its daily work needs) */
const MATRIX: Record<string, string[]> = {
  HOTEL: [
    "order:read", "order:create", "order:update", "order:approve", "order:confirm", "order:checkout",
    "product:read", "catalog:manage", "inventory:read", "inventory:write",
    "invoice:read", "invoice:create", "invoice:submit_eta",
    "factoring:inquire", "fintech:read",
    "payment:create", "payment:write",
    "rfq:create",
    "disputes:list", "disputes:read", "disputes:create", "disputes:update",
    "shipping:read", "supplier:read", "report:read",
  ],
  SUPPLIER: [
    "order:read", "order:update",
    "product:read", "product:create", "product:update", "product:delete", "catalog:manage",
    "invoice:read", "invoice:create", "invoice:submit", "invoice:factor",
    "factoring:inquire", "fintech:read",
    "inventory:read", "inventory:write",
    "shipping:read", "shipping:create_trip",
    "disputes:list", "disputes:read", "disputes:update",
    "report:read", "compliance:kyc:read", "compliance:kyc:submit",
  ],
  FACTORING: [
    "order:read", "invoice:read", "invoice:factor",
    "factoring:inquire", "factoring:manage", "factoring:approve_credit", "factoring:fund",
    "fintech:read", "fintech:write",
    "payment:create", "payment:write", "payment:release",
    "report:read", "compliance:kyc:read", "compliance:kyc:submit",
  ],
  SHIPPING: [
    "order:read", "shipping:read", "shipping:create_trip",
    "inventory:read", "report:read", "payment:create",
  ],
  MARKETING: [
    "product:read", "supplier:read", "report:read", "crm:read", "crm:write",
  ],
  ADMIN: ["*"], // all
};

async function main() {
  console.log("[rbac-seed] starting…");

  // 1. Upsert permissions
  const permIdByCode = new Map<string, string>();
  for (const [code, name, description] of PERMISSIONS) {
    const perm = await prisma.permission.upsert({
      where: { code },
      update: { name, description },
      create: { code, name, description },
    });
    permIdByCode.set(code, perm.id);
  }
  console.log(`[rbac-seed] permissions upserted: ${permIdByCode.size}`);

  // 2. Ensure a global Role row per platform role
  const roleIdByName = new Map<string, string>();
  for (const platformRole of Object.keys(MATRIX)) {
    let role = await prisma.role.findFirst({
      where: { name: platformRole, isGlobal: true, tenantId: null, deletedAt: null },
    });
    if (!role) {
      role = await prisma.role.create({
        data: { name: platformRole, isGlobal: true, tenantId: null },
      });
    }
    roleIdByName.set(platformRole, role.id);
  }
  console.log(`[rbac-seed] global roles ensured: ${roleIdByName.size}`);

  // 3. Grant RolePermissions
  let granted = 0;
  for (const [platformRole, codes] of Object.entries(MATRIX)) {
    const roleId = roleIdByName.get(platformRole)!;
    const grantCodes = codes.includes("*") ? [...permIdByCode.keys()] : codes;
    for (const code of grantCodes) {
      const permissionId = permIdByCode.get(code);
      if (!permissionId) continue;
      const existing = await prisma.rolePermission.findFirst({
        where: { roleId, permissionId },
      });
      if (!existing) {
        await prisma.rolePermission.create({ data: { roleId, permissionId } });
        granted++;
      }
    }
  }
  console.log(`[rbac-seed] rolePermissions granted: ${granted}`);

  // 4+5. Point every user at their platform-role GLOBAL role (User.roleId is required).
  // Per-tenant roles remain in the table but are no longer referenced by users.
  const allUsers = await prisma.user.findMany({
    where: { platformRole: { in: Object.keys(MATRIX) } },
    select: { id: true, platformRole: true, roleId: true },
  });
  let migrated = 0;
  for (const u of allUsers) {
    const globalRoleId = roleIdByName.get(u.platformRole);
    if (globalRoleId && u.roleId !== globalRoleId) {
      await prisma.user.update({ where: { id: u.id }, data: { roleId: globalRoleId } });
      migrated++;
    }
  }
  console.log(`[rbac-seed] users linked to global roles: ${migrated}/${allUsers.length}`);
  console.log("[rbac-seed] DONE");
}

main()
  .catch((e) => { console.error("[rbac-seed] FAILED:", e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
