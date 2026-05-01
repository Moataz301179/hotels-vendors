import { prisma } from "./prisma";

const MAP: Record<string, string> = {
  FOOD_AND_BEVERAGE: "F_AND_B",
  HOUSEKEEPING: "CONSUMABLES",
  ENGINEERING: "SERVICES",
  GUEST_AMENITIES: "GUEST_SUPPLIES",
  FRONT_OFFICE: "SERVICES",
  CAPITAL_EQUIPMENT: "FFE",
  LINENS_AND_UNIFORMS: "CONSUMABLES",
  CHEMICALS: "CONSUMABLES",
};

async function migrate() {
  for (const [oldCat, newCat] of Object.entries(MAP)) {
    const result = await prisma.$executeRawUnsafe(
      `UPDATE Product SET category = '${newCat}' WHERE category = '${oldCat}'`
    );
    console.log(`  ${oldCat} → ${newCat}: ${result} rows`);
  }
  console.log("✅ Category migration complete");
}

migrate()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
