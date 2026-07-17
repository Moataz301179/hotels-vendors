import { prisma } from "../lib/prisma";

async function main() {
  const users = await prisma.user.count();
  const tenants = await prisma.tenant.count();
  const products = await prisma.product.count();
  const roles = await prisma.role.count();
  console.log(JSON.stringify({ users, tenants, products, roles }));
  await prisma.$disconnect();
}

main();
