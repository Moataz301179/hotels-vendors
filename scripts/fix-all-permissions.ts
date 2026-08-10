import { prisma } from "../lib/prisma";

async function main() {
  const allPerms = await prisma.permission.findMany();
  const allRoles = await prisma.role.findMany();

  for (const role of allRoles) {
    const existing = await prisma.rolePermission.count({
      where: { roleId: role.id },
    });

    if (existing === 0) {
      console.log(`Linking ${allPerms.length} permissions to role: ${role.name}`);
      for (const perm of allPerms) {
        await prisma.rolePermission.create({
          data: {
            roleId: role.id,
            permissionId: perm.id,
          },
        });
      }
    } else {
      console.log(`Role ${role.name} already has ${existing} permissions`);
    }
  }

  await prisma.$disconnect();
}

main();
