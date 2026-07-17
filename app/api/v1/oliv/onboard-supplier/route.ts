/**
 * POST /api/v1/oliv/onboard-supplier
 *
 * Called during supplier account creation.
 * Builds Oliv KYC pre-fill payload (Layer 3) and logs onboarding audit.
 *
 * KYC TIMING: Done during HotelsVendors signup, NOT per transaction.
 * Supplier completes Oliv KYC once, then all future factoring is instant.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { buildOlivKYCPrefill } from "@/lib/fintech/anti-bypass/layer3-crm-attribution";

const PARTNER_ID = "HOTELSVENDORS_GLOBAL_001";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { userId, tenantId, company, signatory, bankAccount, shareholders, financial } = body;

    if (!userId || !tenantId || !company || !signatory) {
      return NextResponse.json(
        { error: "Missing required fields: userId, tenantId, company, signatory" },
        { status: 400 }
      );
    }

    // 1. Check if already onboarded
    const existing = await prisma.olivOnboardingAudit.findUnique({
      where: { supplierTaxId: company.taxRegistrationNumber },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Supplier already onboarded to Oliv", onboardingId: existing.id },
        { status: 409 }
      );
    }

    // 2. Build pre-fill payload (Layer 3)
    const prefillPayload = buildOlivKYCPrefill({
      company: {
        legalName: company.legalName,
        tradeName: company.tradeName,
        commercialRegisterNumber: company.commercialRegisterNumber,
        taxRegistrationNumber: company.taxRegistrationNumber,
        crIssueDate: company.crIssueDate,
        crExpiryDate: company.crExpiryDate,
        companyType: company.companyType || "LLC",
        incorporationDate: company.incorporationDate,
        address: {
          street: company.address.street,
          building: company.address.building,
          city: company.address.city,
          governorate: company.address.governorate,
          postalCode: company.address.postalCode,
        },
        phone: company.phone,
        email: company.email,
        website: company.website,
      },
      signatory: {
        fullName: signatory.fullName,
        nationalId: signatory.nationalId,
        nationalIdExpiry: signatory.nationalIdExpiry,
        position: signatory.position || "Managing Director",
        phone: signatory.phone,
        email: signatory.email,
      },
      bankAccount: bankAccount
        ? {
            bankName: bankAccount.bankName,
            branch: bankAccount.branch,
            accountNumber: bankAccount.accountNumber,
            iban: bankAccount.iban,
          }
        : undefined,
      shareholders: shareholders?.map((s: Record<string, unknown>) => ({
        fullName: s.fullName,
        nationalId: s.nationalId,
        ownershipPercentage: s.ownershipPercentage,
      })),
      financial: {
        estimatedMonthlyRevenueEGP: financial?.estimatedMonthlyRevenueEGP || 0,
        yearsInBusiness: financial?.yearsInBusiness || 1,
        numberOfEmployees: financial?.numberOfEmployees,
      },
      platformRef: {
        userId,
        registrationDate: new Date().toISOString(),
        subscriptionTier: "BASIC",
        totalTransactions: 0,
        averageOrderValueEGP: 0,
      },
    });

    // 3. Hash pre-fill data for audit
    const prefillHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(prefillPayload))
      .digest("hex");

    // 4. Create onboarding audit record
    const onboarding = await prisma.olivOnboardingAudit.create({
      data: {
        tenantId,
        supplierId: userId,
        supplierTaxId: company.taxRegistrationNumber,
        companyName: company.legalName,
        partnerId: PARTNER_ID,
        attributionType: "permanent_origin_account",
        attributionSource: "HOTELSVENDORS_PLUGIN_V1",
        commissionAgreementId: `HV-COMM-${PARTNER_ID}-${Date.now()}`,
        olivStatus: "PENDING",
        prefillDataHash: prefillHash,
        prefillDataSize: Object.keys(prefillPayload).length,
      },
    });

    // 5. Log outbound sync
    await prisma.olivSyncLog.create({
      data: {
        direction: "OUTBOUND",
        eventType: "REGISTRATION_PRE_FILL",
        entityType: "Supplier",
        entityId: userId,
        payload: JSON.stringify({
          taxId: company.taxRegistrationNumber,
          companyName: company.legalName,
          partnerId: PARTNER_ID,
        }),
        success: true,
        tenantId,
        idempotencyKey: `onboard-${company.taxRegistrationNumber}-${Date.now()}`,
      },
    });

    return NextResponse.json({
      success: true,
      onboardingId: onboarding.id,
      partnerId: PARTNER_ID,
      attributionType: "permanent_origin_account",
      prefillPayload,
      message: "Oliv onboarding initiated — KYC pre-fill data ready",
      nextStep: "Supplier must complete Oliv e-KYC via VLens (in-app, mandatory per FRA rules)",
    });
  } catch (error) {
    console.error("[OLIV] Onboarding error:", error);
    return NextResponse.json(
      { error: "Internal processing error" },
      { status: 500 }
    );
  }
}
