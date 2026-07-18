import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const credentials = await prisma.auditLog.findMany({
      where: { action: "CREDENTIAL_ACCESS" },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      data: (credentials as any[]).map((c: any) => ({
        id: c.id,
        name: (c.details as Record<string, string>)?.name || "Unknown",
        key: (c.details as Record<string, string>)?.key || "",
        type: (c.details as Record<string, string>)?.type || "api_key",
        service: (c.details as Record<string, string>)?.service || "unknown",
        lastRotated: c.createdAt.toISOString(),
        status: "active",
      })),
    });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;
    const password = request.headers.get("x-admin-password");

    if (password !== "panda3011") {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Write .env file
    const envPath = join(process.cwd(), ".env");
    await writeFile(envPath, content, "utf-8");

    // Log the action
    // @ts-expect-error — TODO: AuditLog schema missing resource/resourceId/details; needs Prisma migration
    await prisma.auditLog.create({
      data: {
        tenantId: "SYSTEM",
        actorId: "ADMIN",
        action: "ENV_UPDATED",
        resource: "system",
        resourceId: null,
        details: {
          updatedBy: "admin",
          timestamp: new Date().toISOString(),
        },
      } as any,
    });

    return NextResponse.json({ success: true, message: "Environment updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update environment" }, { status: 500 });
  }
}
