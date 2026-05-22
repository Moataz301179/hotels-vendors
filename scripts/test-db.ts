import { prisma } from "@/lib/prisma";

async function main() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Database connection: OK");
  } catch (e: any) {
    console.error("Database connection failed:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
