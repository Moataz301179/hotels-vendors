const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const tenants = await prisma.tenant.findMany({ select: { id: true, name: true, slug: true, taxId: true, type: true } });
  console.log(JSON.stringify(tenants, null, 2));
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
