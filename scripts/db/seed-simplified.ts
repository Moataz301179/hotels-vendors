/**
 * Simplified Seed Script
 * Populates PostgreSQL with 20 suppliers, 5 hotels, 3 factoring partners
 */

import { prisma } from "@/lib/prisma";

async function main() {
  console.log("🌱 Starting simplified seed...");

  // 1. Create Organizations
  const org = await prisma.organization.create({
    data: {
      name: "Nile Hospitality Group",
      type: "HOTEL_GROUP",
      crNumber: "123456",
      taxId: "9876543210",
      email: "procurement@nilehotels.com",
      phone: "01001234567",
    },
  });

  // 2. Create Properties
  const properties = await Promise.all([
    prisma.property.create({
      data: {
        name: "Nile Resort Sharm El-Sheikh",
        type: "RESORT",
        address: "Naama Bay, Sharm El-Sheikh",
        orgId: org.id,
      },
    }),
    prisma.property.create({
      data: {
        name: "Nile Plaza Cairo",
        type: "HOTEL",
        address: "Garden City, Cairo",
        orgId: org.id,
      },
    }),
    prisma.property.create({
      data: {
        name: "Nile Coast Alexandria",
        type: "HOTEL",
        address: "Corniche, Alexandria",
        orgId: org.id,
      },
    }),
  ]);

  // 3. Create Users
  await prisma.user.create({
    data: {
      email: "gm.sharm@nilehotels.com",
      name: "Ahmed Hassan",
      role: "PROPERTY_GM",
      propertyId: properties[0].id,
      orgId: org.id,
    },
  });

  // 4. Create Suppliers (20)
  const suppliers = await Promise.all(
    Array.from({ length: 20 }).map((_, i) =>
      prisma.supplier.create({
        data: {
          name: `Supplier ${String.fromCharCode(65 + i)}`,
          category: ["F&B", "HOUSEKEEPING", "ENGINEERING", "AMENITIES", "LINENS"][i % 5],
          crNumber: `SUP-${1000 + i}`,
          taxId: `TAX-${2000 + i}`,
          email: `supplier${i}@example.com`,
          phone: `0100${100000 + i}`,
          zone: ["6th_OCTOBER", "10th_RAMADAN", "ALEXANDRIA", "CAIRO"][i % 4],
          status: "ACTIVE",
        },
      })
    )
  );

  // 5. Create Products (50 per supplier = 1000 products)
  for (const supplier of suppliers) {
    await Promise.all(
      Array.from({ length: 5 }).map((_, i) =>
        prisma.product.create({
          data: {
            name: `${supplier.category} Product ${i + 1}`,
            sku: `${supplier.crNumber}-SKU-${i + 1}`,
            category: supplier.category,
            price: Math.round((10 + Math.random() * 490) * 100) / 100,
            unit: ["KG", "UNIT", "BOX", "LITER", "PACK"][i % 5],
            minOrderQty: [10, 50, 100, 200, 500][i % 5],
            stockQty: Math.floor(Math.random() * 1000),
            supplierId: supplier.id,
          },
        })
      )
    );
  }

  // 6. Create Factoring Partners
  await Promise.all([
    prisma.factoringPartner.create({
      data: {
        name: "Oliv Finance",
        type: "DIGITAL",
        apiEndpoint: "https://api.oliv.finance/v1",
        status: "PENDING_SETUP",
      },
    }),
    prisma.factoringPartner.create({
      data: {
        name: "EFG Hermes Factoring",
        type: "TRADITIONAL",
        apiEndpoint: "https://factoring.efg-hermes.com/api",
        status: "PENDING_SETUP",
      },
    }),
    prisma.factoringPartner.create({
      data: {
        name: "Contact Financial",
        type: "TRADITIONAL",
        apiEndpoint: "https://contact.eg/api/factoring",
        status: "PENDING_SETUP",
      },
    }),
  ]);

  console.log("✅ Seed complete!");
  console.log(`   Organization: ${org.name}`);
  console.log(`   Properties: ${properties.length}`);
  console.log(`   Suppliers: ${suppliers.length}`);
  console.log(`   Products: ${suppliers.length * 5}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
