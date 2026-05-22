const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const tenant = await prisma.tenant.updateMany({
    where: { slug: 'platform' },
    data: { name: 'Returants for E-Marketing' }
  });
  console.log('Platform tenant updated:', tenant.count);
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
