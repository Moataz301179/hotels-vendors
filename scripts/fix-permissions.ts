import { prisma } from "../lib/prisma";

async function main() {
  // Find the hotel user's role
  const hotelUser = await prisma.user.findUnique({
    where: { email: "hotel.owner@nilegrand.com" },
    include: { assignedRole: true },
  });

  if (!hotelUser) {
    console.log("Hotel user not found");
    return;
  }

  console.log("User:", hotelUser.email, "Role:", hotelUser.assignedRole.name);

  // Get all permissions
  const allPerms = await prisma.permission.findMany();
  console.log("Total permissions:", allPerms.length);

  // Check existing role permissions
  const existing = await prisma.rolePermission.findMany({
    where: { roleId: hotelUser.assignedRole.id },
    include: { permission: true },
  });
  console.log("Existing role permissions:", existing.length);

  if (existing.length === 0) {
    // Link all permissions to this role
    console.log("Linking all permissions to role...");
    for (const perm of allPerms) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: hotelUser.assignedRole.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: hotelUser.assignedRole.id,
          permissionId: perm.id,
        },
      });
    }
    console.log("Done! Linked", allPerms.length, "permissions.");
  } else {
    console.log("Role already has permissions.");
  }

  await prisma.$disconnect();
}

main();
