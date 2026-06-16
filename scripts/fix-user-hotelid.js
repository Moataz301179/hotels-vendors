const {PrismaClient} = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  // Find users with null hotelId
  const orphans = await p.$queryRaw`SELECT id, email, name, role FROM "User" WHERE "hotelId" IS NULL`;
  console.log(`Users with null hotelId: ${orphans.length}`);
  console.log(JSON.stringify(orphans, null, 2));

  // Find the first valid hotel to assign
  const hotel = await p.$queryRaw`SELECT id, name FROM "Hotel" LIMIT 1`;
  if (hotel.length === 0) {
    console.log('No hotel found — cannot fix orphans');
    process.exit(1);
  }
  console.log(`Assigning orphan users to hotel: ${hotel[0].name} (${hotel[0].id})`);

  // Update orphan users
  const updated = await p.$executeRaw`UPDATE "User" SET "hotelId" = ${hotel[0].id} WHERE "hotelId" IS NULL`;
  console.log(`Updated ${updated} users`);

  // Verify
  const remaining = await p.$queryRaw`SELECT count(*) FROM "User" WHERE "hotelId" IS NULL`;
  console.log(`Remaining orphans: ${remaining[0].count}`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => p.$disconnect());
