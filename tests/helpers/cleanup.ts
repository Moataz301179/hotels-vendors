import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

const tables = [
  "AuditLog", "InvoiceItem", "Invoice", "OrderItem", "Order",
  "CartItem", "Product", "Category", "SupplierProfile", "HotelProfile",
  "User", "Tenant", "FactoringCompany", "CreditLine", "ShippingProvider", "Referral",
];

export async function cleanTestDatabase() {
  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM "${table}"`);
    } catch { /* table may not exist */ }
  }
}

export async function createTestTenant() {
  return prisma.tenant.create({
    data: {
      id: `test-tenant-${Date.now()}`,
      name: "Test Hotel",
      type: "HOTEL_GROUP",
      slug: `test-hotel-${Date.now()}`,
    },
  });
}

export async function cleanupAll() {
  await cleanTestDatabase();
  await prisma.$disconnect();
}
