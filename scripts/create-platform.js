const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  // Create or update platform tenant with real CR data
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'platform' },
    update: { taxId: '704226146' },
    create: {
      name: 'Hotels Vendors Platform',
      slug: 'platform',
      type: 'PLATFORM',
      status: 'ACTIVE',
      taxId: '704226146',
    }
  });
  console.log('Platform tenant:', tenant.id, tenant.taxId);

  // Also update any existing hotels/suppliers to have proper tax IDs if they are missing
  const hotelsNoTax = await prisma.hotel.findMany({ where: { taxId: '' }, select: { id: true, name: true } });
  console.log('Hotels without taxId:', hotelsNoTax.length);

  const suppliersNoTax = await prisma.supplier.findMany({ where: { taxId: '' }, select: { id: true, name: true } });
  console.log('Suppliers without taxId:', suppliersNoTax.length);

  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
