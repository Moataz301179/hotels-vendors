/**
 * Factoring Application API Route
 * 
 * POST /api/v1/factoring/apply
 * Creates a new factoring pre-qualification application for hotels
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { verifyAuth } from "@/lib/auth";
import { queueOperation } from "@/lib/factoring/queue";
import { z } from "zod";

// Validation schema for factoring application
const FactoringApplicationSchema = z.object({
  hotelCategory: z.string().min(1, "Hotel category is required"),
  monthlyProcurementAmount: z.string().min(1, "Monthly procurement amount is required"),
  companyName: z.string().min(2, "Company name is required"),
  taxId: z.string().min(1, "Tax ID is required"),
  commercialRegistration: z.string().optional(),
  yearsInOperation: z.string().min(1, "Years in operation is required"),
  numberOfRooms: z.string().optional(),
  preferredPaymentFrequency: z.string().min(1, "Payment frequency is required"),
  averageInvoiceAmount: z.string().optional(),
  currentSuppliersCount: z.string().optional(),
  taxCardUrl: z.string().min(1, "Tax card document is required"),
  commercialRegistryUrl: z.string().min(1, "Commercial registry is required"),
  bankStatementUrl: z.string().optional(),
  recentInvoicesUrl: z.string().optional(),
  notes: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to terms"),
});

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = FactoringApplicationSchema.parse(body);

    // Calculate suggested credit limit (3x monthly procurement)
    const monthlyAmount = parseFloat(validatedData.monthlyProcurementAmount);
    const suggestedCreditLimit = monthlyAmount * 3;

    // Get user info for the application
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { tenant: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user already has pending application
    const existingApplication = await prisma.factoringApplication.findFirst({
      where: {
        tenantId: user.tenant?.id || userId,
        status: { in: ["PENDING", "UNDER_REVIEW", "NEEDS_INFO"] },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { 
          error: "You already have an active application",
          applicationId: existingApplication.id,
          status: existingApplication.status,
        },
        { status: 409 }
      );
    }

    // Create factoring application
    const application = await prisma.factoringApplication.create({
      data: {
        tenantId: user.tenant?.id || userId,
        applicantId: userId,
        hotelCategory: validatedData.hotelCategory,
        monthlyProcurementAmount: monthlyAmount,
        suggestedCreditLimit,
        companyName: validatedData.companyName,
        taxId: validatedData.taxId,
        commercialRegistration: validatedData.commercialRegistration || null,
        yearsInOperation: parseInt(validatedData.yearsInOperation) || 0,
        numberOfRooms: parseInt(validatedData.numberOfRooms || "0") || null,
        preferredPaymentFrequency: validatedData.preferredPaymentFrequency,
        averageInvoiceAmount: validatedData.averageInvoiceAmount 
          ? parseFloat(validatedData.averageInvoiceAmount) 
          : null,
        currentSuppliersCount: validatedData.currentSuppliersCount 
          ? parseInt(validatedData.currentSuppliersCount) 
          : null,
        documents: {
          taxCard: validatedData.taxCardUrl,
          commercialRegistry: validatedData.commercialRegistryUrl,
          bankStatement: validatedData.bankStatementUrl || null,
          recentInvoices: validatedData.recentInvoicesUrl || null,
        },
        notes: validatedData.notes || null,
        status: "PENDING",
        submittedAt: new Date(),
      },
    });

    // Queue document analysis job
    await queueOperation({
      tenant: user.tenant?.id || userId,
      payload: {
        operationType: "INQUIRE",
        documents: application.documents as Record<string, string>,
        applicationId: application.id,
      },
    });

    // Log the application creation
    logger.info({
      applicationId: application.id,
      tenantId: application.tenantId,
      monthlyAmount,
      suggestedCreditLimit,
    }, "Factoring application created");

    // TODO: Send notification to admins
    // await notifyAdminsNewApplication(application);

    return NextResponse.json(
      {
        success: true,
        applicationId: application.id,
        status: application.status,
        message: "Application submitted successfully",
      },
      { status: 201 }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    logger.error({ error }, "Factoring application creation failed");
    
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

// GET /api/v1/factoring/apply - Get application status
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { tenant: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const application = await prisma.factoringApplication.findFirst({
      where: {
        tenantId: user.tenant?.id || userId,
      },
      orderBy: { submittedAt: "desc" },
    });

    if (!application) {
      return NextResponse.json(
        { error: "No application found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: application.id,
      status: application.status,
      submittedAt: application.submittedAt,
      reviewedAt: application.reviewedAt,
      hotelName: application.companyName,
      monthlyProcurement: application.monthlyProcurementAmount,
      creditFacility: application.status === "APPROVED" ? {
        approvedAmount: application.approvedCreditLimit || 0,
        utilizedAmount: 0, // Will calculate from actual usage
        availableAmount: (application.approvedCreditLimit || 0) - 0,
        interestRate: 2.5,
        termDays: 90,
      } : undefined,
      reviewNotes: application.reviewNotes,
      nextSteps: application.nextSteps,
    });

  } catch (error) {
    logger.error({ error }, "Failed to fetch factoring status");
    return NextResponse.json(
      { error: "Failed to fetch application status" },
      { status: 500 }
    );
  }
}
