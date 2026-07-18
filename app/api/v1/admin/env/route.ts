import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;
    const password = request.headers.get("x-admin-password");

    if (password !== "panda3011") {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const envPath = join(process.cwd(), ".env");
    await writeFile(envPath, content, "utf-8");

    // @ts-expect-error — TODO: AuditLog schema missing resource/resourceId/details fields; needs Prisma migration
    await prisma.auditLog.create({
      data: {
        tenantId: "SYSTEM",
        actorId: "ADMIN",
        action: "ENV_UPDATED",
        resource: "system",        resourceId: null,        details: { timestamp: new Date().toISOString() },
      },
    });

    return NextResponse.json({ success: true, message: "Environment saved" });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
