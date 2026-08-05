// Prisma Seed Script for RBAC Permissions + Role Mapping
// Run with: npx prisma db seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PERMISSIONS = [
  // Hotel Buyer
  { code: "hotel:catalog:read", name: "View Product Catalog", description: "Browse supplier catalog" },
  { code: "hotel:requisition:create", name: "Create Internal Requisition", description: "Scan-to-request items" },
  { code: "hotel:requisition:read", name: "View Requisitions", description: "See own/team requisitions" },
  { code: "hotel:requisition:approve", name: "Approve Requisitions", description: "Manager approval up to budget" },
  { code: "hotel:po:create", name: "Create Purchase Order", description: "Procurement converts requisition to PO" },
  { code: "hotel:po:read", name: "View Purchase Orders", description: "Track PO status" },
  { code: "hotel:po:approve", name: "Approve PO Payment", description: "Finance approves final payment" },
  { code: "hotel:invoice:read", name: "View Invoices", description: "Finance reviews invoices" },
  { code: "hotel:invoice:submit_eta", name: "Submit Invoice to ETA", description: "ETA compliance submission" },
  { code: "hotel:credit:redirect", name: "Redirect to Oliv for Payment", description: "Pay via credit line" },
  { code: "hotel:spend:read", name: "View Spend Analytics", description: "Procurement analytics" },

  // Supplier
  { code: "supplier:catalog:manage", name: "Manage Product Catalog", description: "CRUD products, inventory" },
  { code: "supplier:po:read", name: "View Incoming POs", description: "See orders from hotels" },
  { code: "supplier:po:accept", name: "Accept/Reject PO", description: "Confirm availability" },
  { code: "supplier:invoice:create", name: "Generate Digital Invoice", description: "Create invoice from accepted PO" },
  { code: "supplier:invoice:upload", name: "Upload Invoice Document", description: "PDF/ETA submission" },
  { code: "supplier:delivery:update", name: "Update Delivery Status", description: "Mark shipped/delivered" },
  { code: "supplier:credit:view", name: "View Credit Facility", description: "See Oliv credit line" },
  { code: "supplier:factoring:request", name: "Request Factoring", description: "Initiate early payment" },

  // Factoring Company
  { code: "factoring:facility:manage", name: "Manage Credit Facilities", description: "Approve/suspend lines" },
  { code: "factoring:invoice:review", name: "Review Factorable Invoices", description: "Pipeline of invoices" },
  { code: "factoring:risk:assess", name: "Assess Credit Risk", description: "Scoring & monitoring" },

  // Shipping/Logistics (Future Phase)
  { code: "shipping:trip:manage", name: "Manage Trips", description: "Create/optimize routes" },
  { code: "shipping:delivery:confirm", name: "Confirm Delivery", description: "POD capture" },

  // Platform Admin
  { code: "admin:tenants:manage", name: "Manage Tenants", description: "CRUD tenant records" },
  { code: "admin:roles:manage", name: "Manage Roles", description: "Role/permission assignment" },
  { code: "admin:authority:configure", name: "Configure Authority Matrix", description: "Global rules" },
  { code: "admin:audit:read", name: "View Audit Log", description: "Immutable audit trail" },
  { code: "admin:fees:track", name: "Track Transaction Fees", description: "Revenue monitoring" },
  { code: "admin:oliv:manage", name: "Manage Oliv Integration", description: "Partner configuration" },
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  HOTEL_STAFF: [
    "hotel:catalog:read",
    "hotel:requisition:create",
    "hotel:requisition:read",
  ],
  HOTEL_MANAGER: [
    "hotel:catalog:read",
    "hotel:requisition:create",
    "hotel:requisition:read",
    "hotel:requisition:approve",
    "hotel:po:read",
  ],
  HOTEL_PROCUREMENT: [
    "hotel:catalog:read",
    "hotel:requisition:create",
    "hotel:requisition:read",
    "hotel:requisition:approve",
    "hotel:po:create",
    "hotel:po:read",
    "hotel:spend:read",
  ],
  HOTEL_FINANCE: [
    "hotel:catalog:read",
    "hotel:requisition:create",
    "hotel:requisition:read",
    "hotel:requisition:approve",
    "hotel:po:create",
    "hotel:po:read",
    "hotel:po:approve",
    "hotel:invoice:read",
    "hotel:invoice:submit_eta",
    "hotel:credit:redirect",
    "hotel:spend:read",
  ],
  SUPPLIER_SALES: [
    "supplier:catalog:manage",
    "supplier:po:read",
    "supplier:po:accept",
    "supplier:invoice:create",
    "supplier:invoice:upload",
    "supplier:delivery:update",
  ],
  SUPPLIER_DELIVERY: [
    "supplier:po:read",
    "supplier:delivery:update",
  ],
  FACTORING_ANALYST: [
    "factoring:facility:manage",
    "factoring:invoice:review",
    "factoring:risk:assess",
  ],
  PLATFORM_ADMIN: PERMISSIONS.map(p => p.code), // All permissions
};

async function main() {
  console.log("🌱 Seeding RBAC permissions and roles...");

  // 1. Create permissions
  for (const perm of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: { name: perm.name, description: perm.description },
      create: perm,
    });
  }
  console.log(`✅ Created/updated ${PERMISSIONS.length} permissions`);

  // 2. Get platform tenant (or create)
  let platformTenant = await prisma.tenant.findFirst({
    where: { type: "PLATFORM" },
  });

  if (!platformTenant) {
    platformTenant = await prisma.tenant.create({
      data: {
        name: "Hotels Vendors Platform",
        slug: "platform",
        type: "PLATFORM",
        taxId: "PLATFORM-001",
      },
    });
    console.log("✅ Created platform tenant");
  }

  // 3. Create roles and assign permissions
  for (const [roleName, permissionCodes] of Object.entries(ROLE_PERMISSIONS)) {
    const isGlobal = roleName === "PLATFORM_ADMIN";
    const tenantId = isGlobal ? null : platformTenant.id;

    const role = await prisma.role.upsert({
      where: {
        tenantId_name: {
          tenantId: tenantId ?? "",
          name: roleName,
        },
      },
      update: { isGlobal },
      create: {
        name: roleName,
        tenantId: tenantId ?? undefined,
        isGlobal,
      },
    });

    // Assign permissions
    const permissions = await prisma.permission.findMany({
      where: { code: { in: permissionCodes } },
    });

    for (const perm of permissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: perm.id,
        },
      });
    }

    console.log(`✅ Role "${roleName}" with ${permissionCodes.length} permissions`);
  }

  console.log("🎉 RBAC seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });