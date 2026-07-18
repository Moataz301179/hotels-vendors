// @ts-nocheck — TODO: Pre-existing type errors need schema migration; tracked in docs/audit-log.md
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

    // Log the action
    await prisma.auditLog.create({
      data: {
        tenantId: "SYSTEM",
        actorId: "ADMIN",
        action: "ENV_UPDATED",
        resource: "system",
        resourceId: null,
        details: { timestamp: new Date().toISOString() },
      } as any,
    });

    return NextResponse.json({ success: true, message: "Environment saved" });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
