/**
 * POST /api/v1/leads/capture
 *
 * Captures a lead from the landing page Sector Router signup form.
 * Public endpoint — no authentication required.
 *
 * Accepts:
 * - companyName: string (required)
 * - email: string (required)
 * - sector: UserSector enum value (optional)
 *
 * Creates:
 * 1. An INACTIVE User record as a lead placeholder
 * 2. An AuditLog entry for pipeline tracking
 *
 * Idempotent: duplicate emails return 200 with existing lead info.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ─── Validation ────────────────────────────────────────────────────

const VALID_SECTORS = ["HOTEL", "SUPPLIER", "LOGISTICS", "FINANCE"];

interface LeadPayload {
  companyName: string;
  email: string;
  sector?: string;
}

function validateLeadPayload(body: Record<string, unknown>): LeadPayload {
  const companyName = body.companyName;
  const email = body.email;
  const sector = body.sector;

  if (!companyName || typeof companyName !== "string" || companyName.trim().length < 2) {
    throw new Error("Company name is required (minimum 2 characters)");
  }

  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("A valid email address is required");
  }

  if (sector !== undefined && sector !== null) {
    if (typeof sector !== "string" || !VALID_SECTORS.includes(sector)) {
      throw new Error(`Sector must be one of: ${VALID_SECTORS.join(", ")}`);
    }
  }

  return {
    companyName: companyName.trim(),
    email: email.toLowerCase().trim(),
    sector: (sector as string) || undefined,
  };
}

// ─── Route Handler ─────────────────────────────────────────────────

// ─── Rate Limiting (in-memory, per-IP fixed window) ────────────────
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
const rateHits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateHits.get(ip);
  if (!entry || now >= entry.resetAt) {
    rateHits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_MAX) return false;
  entry.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many requests — please wait a moment." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await request.json();
    let payload: LeadPayload;
    try {
      payload = validateLeadPayload(body);
    } catch (validationErr) {
      return NextResponse.json(
        {
          success: false,
          error: validationErr instanceof Error ? validationErr.message : "Invalid payload",
        },
        { status: 400 }
      );
    }

    // Idempotency: check if lead already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: payload.email },
      select: { id: true, name: true, email: true, sector: true, status: true, createdAt: true },
    });

    if (existingUser) {
      // Update company name and sector if provided
      if (payload.sector && payload.companyName) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            companyName: payload.companyName,
            sector: payload.sector as any,
          },
        });
      }

      return NextResponse.json(
        {
          success: true,
          message: "Lead already captured — welcome back",
          data: {
            leadId: existingUser.id,
            email: existingUser.email,
            sector: existingUser.sector,
            status: existingUser.status,
            existing: true,
          },
        },
        { status: 200 }
      );
    }

    // Create lead as placeholder user (no tenant yet — will be assigned during onboarding)
    const lead = await prisma.$transaction(async (tx) => {
      // Use LeadCapture model (no FK constraints) instead of creating an invalid User
      const lead = await tx.leadCapture.create({
        data: {
          companyName: payload.companyName,
          email: payload.email,
          sector: payload.sector as any || null,
          role: payload.sector || null,
          source: "landing-page-signup",
          status: "new",
        },
      });

      // Also create a lightweight user reference with the platform tenant
      const platformTenant = await tx.tenant.findUnique({ where: { slug: "platform" } });
      if (platformTenant) {
        const platformOwnerRole = await tx.role.findFirst({
          where: { tenantId: platformTenant.id, name: "Platform Admin" },
        });
        if (platformOwnerRole) {
          const existing = await tx.user.findFirst({
            where: { email: payload.email, tenantId: platformTenant.id },
          });
          if (existing) {
            await tx.user.update({
              where: { id: existing.id },
              data: {
                companyName: payload.companyName,
                sector: (payload.sector as any) || null,
              },
            });
          } else {
            await tx.user.create({
              data: {
                email: payload.email,
                name: payload.companyName,
                companyName: payload.companyName,
                role: "DEPARTMENT_HEAD",
                status: "INACTIVE",
                platformRole: payload.sector === "SUPPLIER" ? "SUPPLIER" : "HOTEL",
                sector: (payload.sector as any) || null,
                tenantId: platformTenant.id,
                roleId: platformOwnerRole.id,
                canOverride: false,
              },
            });
          }
        }
      }

      // Audit log for lead pipeline tracking
      await tx.auditLog.create({
        data: {
          action: "LEAD_CAPTURED",
          entityType: "USER",
          entityId: lead.id,
          actorId: "landing-page",
          actorRole: "PUBLIC",
          tenantId: platformTenant?.id || "system",
          afterState: JSON.stringify({
            email: payload.email,
            companyName: payload.companyName,
            sector: payload.sector || null,
            source: "landing-page-signup",
            capturedAt: new Date().toISOString(),
          }),
        },
      });

      return lead;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Lead captured successfully — welcome to HotelsVendors",
        data: {
          leadId: lead.id,
          email: lead.email,
          sector: lead.sector,
          status: lead.status,
          existing: false,
          nextStep: "Check your email for onboarding instructions",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Lead Capture] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to capture lead",
      },
      { status: 500 }
    );
  }
}
