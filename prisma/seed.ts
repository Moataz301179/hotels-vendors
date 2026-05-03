/**
 * Prisma Seed — Tenant + RBAC + Sample Data
 *
 * Run: npx prisma db seed
 * Or:  npx tsx prisma/seed.ts
 */

import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth";

async function main() {
  console.log("🌱 Starting seed...");

  // ─────────────────────────────────────────
  // 1. PLATFORM TENANT
  // ─────────────────────────────────────────

  const platformTenant = await prisma.tenant.upsert({
    where: { slug: "platform" },
    update: {},
    create: {
      name: "Hotels Vendors Platform",
      slug: "platform",
      type: "PLATFORM",
      status: "ACTIVE",
      taxId: "000-000-000",
    },
  });
  console.log(`🏢 Platform tenant: ${platformTenant.id}`);

  // ─────────────────────────────────────────
  // 2. PERMISSIONS
  // ─────────────────────────────────────────

  const permissionCodes = [
    // Orders
    { code: "order:create", name: "Create Purchase Orders", description: "Create new purchase orders" },
    { code: "order:read", name: "View Orders", description: "View purchase orders" },
    { code: "order:approve", name: "Approve Orders", description: "Approve pending orders" },
    { code: "order:reject", name: "Reject Orders", description: "Reject orders" },
    { code: "order:cancel", name: "Cancel Orders", description: "Cancel existing orders" },
    // Products / Catalog
    { code: "product:create", name: "Create Products", description: "Add products to catalog" },
    { code: "product:read", name: "View Products", description: "View product catalog" },
    { code: "product:update", name: "Update Products", description: "Edit product details" },
    { code: "product:delete", name: "Delete Products", description: "Remove products from catalog" },
    // Invoices
    { code: "invoice:create", name: "Create Invoices", description: "Create invoices" },
    { code: "invoice:read", name: "View Invoices", description: "View invoices" },
    { code: "invoice:submit_eta", name: "Submit ETA", description: "Submit to Egyptian Tax Authority" },
    { code: "invoice:factor", name: "Factor Invoices", description: "Submit invoices for factoring" },
    // Users
    { code: "user:create", name: "Create Users", description: "Add new users" },
    { code: "user:read", name: "View Users", description: "View user list" },
    { code: "user:update", name: "Update Users", description: "Edit user details" },
    { code: "user:delete", name: "Delete Users", description: "Deactivate users" },
    // Leads / Acquisition
    { code: "lead:read", name: "View Leads", description: "View supplier leads" },
    { code: "lead:create", name: "Create Leads", description: "Add and acquire leads" },
    { code: "lead:update", name: "Update Leads", description: "Edit lead details" },
    { code: "lead:delete", name: "Delete Leads", description: "Remove leads" },
    { code: "lead:enrich", name: "Enrich Leads", description: "AI-enrich lead data" },
    { code: "lead:outreach", name: "Outreach Leads", description: "Send outreach messages" },
    { code: "lead:convert", name: "Convert Leads", description: "Convert leads to suppliers" },
    // Suppliers
    { code: "supplier:create", name: "Create Suppliers", description: "Add new suppliers" },
    { code: "supplier:read", name: "View Suppliers", description: "View supplier directory" },
    { code: "supplier:update", name: "Update Suppliers", description: "Edit supplier details" },
    { code: "supplier:delete", name: "Delete Suppliers", description: "Remove suppliers" },
    // Reports / Admin
    { code: "admin:read", name: "View Admin Dashboard", description: "Access admin dashboard" },
    { code: "admin:manage_tenants", name: "Manage Tenants", description: "Create and manage tenants" },
    { code: "admin:override_authority", name: "Override Authority Matrix", description: "Override approval rules" },
    { code: "report:read", name: "View Reports", description: "Access reports and analytics" },
    // Shipping
    { code: "shipping:create_trip", name: "Create Trips", description: "Create logistics trips" },
    { code: "shipping:read", name: "View Shipping", description: "View shipping data" },
    // Factoring
    { code: "factoring:inquire", name: "Inquire Factoring", description: "Request factoring quotes" },
    { code: "factoring:fund", name: "Fund Invoices", description: "Fund factored invoices" },
  ];

  for (const p of permissionCodes) {
    await prisma.permission.upsert({
      where: { code: p.code },
      update: {},
      create: p,
    });
  }
  console.log(`🔑 ${permissionCodes.length} permissions seeded`);

  // ─────────────────────────────────────────
  // 3. ROLES (global + per-tenant defaults)
  // ─────────────────────────────────────────

  const roleDefs = [
    { name: "Platform Admin", isGlobal: true, permissions: ["admin:read", "admin:manage_tenants", "admin:override_authority", "user:create", "user:read", "user:update", "user:delete", "report:read", "lead:read", "lead:create", "lead:update", "lead:delete", "lead:enrich", "lead:outreach", "lead:convert", "supplier:create", "supplier:read", "supplier:update", "supplier:delete"] },
    { name: "Owner", isGlobal: false, permissions: ["order:create", "order:read", "order:approve", "order:reject", "order:cancel", "product:create", "product:read", "product:update", "product:delete", "invoice:create", "invoice:read", "invoice:submit_eta", "invoice:factor", "user:create", "user:read", "user:update", "user:delete", "report:read", "shipping:create_trip", "shipping:read", "factoring:inquire", "factoring:fund"] },
    { name: "Hotel Manager", isGlobal: false, permissions: ["order:create", "order:read", "order:approve", "order:reject", "product:read", "invoice:read", "invoice:submit_eta", "user:read", "user:update", "report:read", "shipping:read", "factoring:inquire"] },
    { name: "Department Head", isGlobal: false, permissions: ["order:create", "order:read", "order:approve", "product:read", "invoice:read", "user:read"] },
    { name: "Clerk", isGlobal: false, permissions: ["order:create", "order:read", "product:read", "invoice:read"] },
    { name: "Supplier Manager", isGlobal: false, permissions: ["order:read", "product:create", "product:read", "product:update", "invoice:create", "invoice:read", "user:read", "user:update", "report:read", "shipping:create_trip", "shipping:read"] },
    { name: "Factoring Agent", isGlobal: false, permissions: ["invoice:read", "invoice:factor", "factoring:inquire", "factoring:fund", "report:read"] },
    { name: "Logistics Coordinator", isGlobal: false, permissions: ["shipping:create_trip", "shipping:read", "order:read", "report:read"] },
  ];

  const createdRoles: Record<string, { id: string; name: string }> = {};

  for (const r of roleDefs) {
    const role = await prisma.role.upsert({
      where: {
        tenantId_name: { tenantId: platformTenant.id, name: r.name },
      },
      update: {},
      create: {
        name: r.name,
        tenantId: platformTenant.id,
        isGlobal: r.isGlobal,
      },
    });
    createdRoles[r.name] = role;

    // Link permissions
    for (const code of r.permissions) {
      const perm = await prisma.permission.findUnique({ where: { code } });
      if (perm) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: { roleId: role.id, permissionId: perm.id },
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: perm.id,
          },
        });
      }
    }
  }
  console.log(`🛡️ ${roleDefs.length} roles seeded with permissions`);

  // ─────────────────────────────────────────
  // 4. SAMPLE HOTEL TENANT
  // ─────────────────────────────────────────

  const hotelTenant = await prisma.tenant.upsert({
    where: { slug: "demo-hotel" },
    update: {},
    create: {
      name: "Nile Grand Hotel",
      slug: "demo-hotel",
      type: "HOTEL_GROUP",
      status: "ACTIVE",
      taxId: "100-123-456",
    },
  });

  const hotelRole = await prisma.role.upsert({
    where: { tenantId_name: { tenantId: hotelTenant.id, name: "Owner" } },
    update: {},
    create: { name: "Owner", tenantId: hotelTenant.id, isGlobal: false },
  });

  const hotel = await prisma.hotel.upsert({
    where: { taxId: hotelTenant.taxId },
    update: {},
    create: {
      name: "Nile Grand Hotel",
      legalName: "Nile Grand Hotels SAE",
      taxId: hotelTenant.taxId,
      commercialReg: "CR-2020-001",
      address: "126 Nile Corniche, Cairo",
      city: "Cairo",
      governorate: "Cairo",
      phone: "+20 2 2577 0000",
      email: "procurement@nilegrand.com",
      starRating: 5,
      roomCount: 320,
      tier: "CORE",
      creditLimit: 1500000,
      creditUsed: 0,
      tenantId: hotelTenant.id,
    },
  });

  const hotelPassword = await hashPassword("HotelOwner123!");
  const hotelUser = await prisma.user.upsert({
    where: { email: "hotel.owner@nilegrand.com" },
    update: {},
    create: {
      email: "hotel.owner@nilegrand.com",
      name: "Omar El-Sayed",
      passwordHash: hotelPassword,
      platformRole: "HOTEL",
      role: "OWNER",
      tenantId: hotelTenant.id,
      roleId: hotelRole.id,
      hotelId: hotel.id,
      status: "ACTIVE",
    },
  });
  console.log(`🏨 Hotel tenant: ${hotelTenant.id}, user: ${hotelUser.email}`);

  // ─────────────────────────────────────────
  // 5. SAMPLE SUPPLIER TENANT
  // ─────────────────────────────────────────

  const supplierTenant = await prisma.tenant.upsert({
    where: { slug: "demo-supplier" },
    update: {},
    create: {
      name: "Delta Food Supply",
      slug: "demo-supplier",
      type: "SUPPLIER",
      status: "ACTIVE",
      taxId: "200-789-012",
    },
  });

  const supplierRole = await prisma.role.upsert({
    where: { tenantId_name: { tenantId: supplierTenant.id, name: "Owner" } },
    update: {},
    create: { name: "Owner", tenantId: supplierTenant.id, isGlobal: false },
  });

  const supplier = await prisma.supplier.upsert({
    where: { taxId: supplierTenant.taxId },
    update: {},
    create: {
      name: "Delta Food Supply",
      legalName: "Delta Food Supply Co. SAE",
      taxId: supplierTenant.taxId,
      commercialReg: "CR-2019-045",
      address: "45 Industrial Zone, 6th of October",
      city: "6th of October",
      governorate: "Giza",
      phone: "+20 2 3838 5500",
      email: "orders@deltafood.com",
      website: "https://deltafood.com",
      tenantId: supplierTenant.id,
    },
  });

  const supplierPassword = await hashPassword("SupplierOwner123!");
  const supplierUser = await prisma.user.upsert({
    where: { email: "supplier.owner@deltafood.com" },
    update: {},
    create: {
      email: "supplier.owner@deltafood.com",
      name: "Amir Khalil",
      passwordHash: supplierPassword,
      platformRole: "SUPPLIER",
      role: "OWNER",
      tenantId: supplierTenant.id,
      roleId: supplierRole.id,
      supplierId: supplier.id,
      status: "ACTIVE",
    },
  });
  console.log(`🏭 Supplier tenant: ${supplierTenant.id}, user: ${supplierUser.email}`);

  // ─────────────────────────────────────────
  // 6. SAMPLE FACTORING TENANT
  // ─────────────────────────────────────────

  const factoringTenant = await prisma.tenant.upsert({
    where: { slug: "demo-factoring" },
    update: {},
    create: {
      name: "Cairo Capital Factoring",
      slug: "demo-factoring",
      type: "FACTORING_COMPANY",
      status: "ACTIVE",
      taxId: "300-111-222",
    },
  });

  const factoringRole = await prisma.role.upsert({
    where: { tenantId_name: { tenantId: factoringTenant.id, name: "Owner" } },
    update: {},
    create: { name: "Owner", tenantId: factoringTenant.id, isGlobal: false },
  });

  const factoringCompany = await prisma.factoringCompany.upsert({
    where: { taxId: factoringTenant.taxId },
    update: {},
    create: {
      name: "Cairo Capital Factoring",
      legalName: "Cairo Capital Factoring SAE",
      taxId: factoringTenant.taxId,
      contactEmail: "factoring@cairocapital.com",
      contactPhone: "+20 2 2400 5000",
      status: "ACTIVE",
      maxFacility: 10000000,
      interestRate: 0.022,
      rate: 0.018,
      tenantId: factoringTenant.id,
    },
  });

  const factoringPassword = await hashPassword("FactoringOwner123!");
  const factoringUser = await prisma.user.upsert({
    where: { email: "factoring.owner@cairocapital.com" },
    update: {},
    create: {
      email: "factoring.owner@cairocapital.com",
      name: "Hassan Ibrahim",
      passwordHash: factoringPassword,
      platformRole: "FACTORING",
      role: "OWNER",
      tenantId: factoringTenant.id,
      roleId: factoringRole.id,
      factoringCompanyId: factoringCompany.id,
      status: "ACTIVE",
    },
  });
  console.log(`🏦 Factoring tenant: ${factoringTenant.id}, user: ${factoringUser.email}`);

  // ─────────────────────────────────────────
  // 7. SAMPLE PRODUCTS
  // ─────────────────────────────────────────

  const products = [
    { sku: "FNB-001", name: "Premium Olive Oil 5L", category: "F_AND_B" as const, subcategory: "Oils & Fats", unitPrice: 450, stockQuantity: 120, minOrderQty: 6 },
    { sku: "FNB-002", name: "Egyptian Rice 10kg", category: "F_AND_B" as const, subcategory: "Grains", unitPrice: 280, stockQuantity: 200, minOrderQty: 10 },
    { sku: "FNB-003", name: "Halal Chicken Breast 1kg", category: "F_AND_B" as const, subcategory: "Poultry", unitPrice: 185, stockQuantity: 80, minOrderQty: 20 },
    { sku: "HSK-001", name: "Luxury Bath Amenities Set", category: "CONSUMABLES" as const, subcategory: "Amenities", unitPrice: 120, stockQuantity: 500, minOrderQty: 50 },
    { sku: "HSK-002", name: "Premium Bed Sheets (King)", category: "FFE" as const, subcategory: "Linens", unitPrice: 850, stockQuantity: 60, minOrderQty: 10 },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: {
        ...p,
        currency: "EGP",
        supplierId: supplier.id,
        tenantId: supplierTenant.id,
      },
    });
  }
  console.log(`📦 ${products.length} products seeded`);

  // ─────────────────────────────────────────
  // 8. AUTHORITY RULES
  // ─────────────────────────────────────────

  const authorityRules = [
    {
      name: "Low Value Auto-Approve",
      description: "Orders under EGP 10,000 auto-approved for Department Heads",
      role: "DEPARTMENT_HEAD" as const,
      minValue: 0,
      maxValue: 10000,
      hotelTier: "CORE",
      action: "AUTO_APPROVE" as const,
      priority: 100,
    },
    {
      name: "Medium Value Route to GM",
      description: "Orders EGP 10,000–50,000 routed to GM",
      role: "GM" as const,
      minValue: 10001,
      maxValue: 50000,
      hotelTier: "CORE",
      action: "ROUTE_TO_GM" as const,
      priority: 90,
    },
    {
      name: "High Value Dual Sign-Off",
      description: "Orders over EGP 50,000 require dual sign-off",
      role: "OWNER" as const,
      minValue: 50001,
      maxValue: 999999999,
      hotelTier: "CORE",
      action: "DUAL_SIGN_OFF" as const,
      priority: 80,
      requiresDualSignOff: true,
    },
    {
      name: "Large Orders Require Owner",
      description: "Orders over EGP 100,000 require owner approval",
      role: "OWNER" as const,
      minValue: 100000,
      maxValue: 999999999,
      hotelTier: "CORE",
      action: "REQUIRE_OWNER" as const,
      priority: 70,
      requiresPaymentGuarantee: true,
    },
    {
      name: "ETA Validation for Large Orders",
      description: "Orders over EGP 250,000 require ETA validation",
      role: "OWNER" as const,
      minValue: 250000,
      maxValue: 999999999,
      hotelTier: "CORE",
      action: "REQUIRE_OWNER" as const,
      priority: 60,
      requiresEtaValidation: true,
    },
  ];

  const existingRules = await prisma.authorityRule.count();
  if (existingRules === 0) {
    for (const rule of authorityRules) {
      await prisma.authorityRule.create({
        data: {
          ...rule,
          isActive: true,
        },
      });
    }
  }
  console.log(`⚖️ ${authorityRules.length} authority rules seeded`);

  // ─────────────────────────────────────────
  // 9. PLATFORM ADMIN USER
  // ─────────────────────────────────────────

  const adminPassword = await hashPassword("Admin123!");
  const adminRole = createdRoles["Platform Admin"];
  await prisma.user.upsert({
    where: { email: "admin@hotelsvendors.com" },
    update: {},
    create: {
      email: "admin@hotelsvendors.com",
      name: "System Administrator",
      passwordHash: adminPassword,
      platformRole: "ADMIN",
      role: "OWNER",
      tenantId: platformTenant.id,
      roleId: adminRole.id,
      status: "ACTIVE",
    },
  });
  console.log(`👤 Platform admin seeded`);

  console.log("\n✅ Seed complete!");
  console.log("\nLogin credentials:");
  console.log("  Hotel:    hotel.owner@nilegrand.com / HotelOwner123!");
  console.log("  Supplier: supplier.owner@deltafood.com / SupplierOwner123!");
  console.log("  Factoring: factoring.owner@cairocapital.com / FactoringOwner123!");
  console.log("  Admin:    admin@hotelsvendors.com / Admin123!");
}

main()
  .then(async () => {
    const p = prisma as unknown as { $disconnect: () => Promise<void> };
    await p.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    const p = prisma as unknown as { $disconnect: () => Promise<void> };
    await p.$disconnect();
    process.exit(1);
  });
