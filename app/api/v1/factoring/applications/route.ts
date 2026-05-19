/**
 * Factoring Applications Admin API Route
 * 
 * GET /api/v1/factoring/applications
 * List all factoring applications (admin only)
 * 
 * PATCH /api/v1/factoring/applications/:id
 * Update application status (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { verifyAuth, requireRole } from "@/lib/auth";
import { z } from "zod";

// GET /api/v1/factoring/applications
export async function GET(request: NextRequest) {
  try {
    // Verify authentication and admin role
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Check admin role
    const hasRole = await requireRole(userId, ["ADMIN", "FACTORING_OFFICER", "RISK_MANAGER"]);
    if (!hasRole) {
      return NextResponse.json(
        { error: "Insufficient permissions. Admin access required." },
        { status: 403 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const query = searchParams.get("query");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const where: any = {};
    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }
    
    if (query) {
      where.OR = [
        { companyName: { contains: query, mode: "insensitive" } },
        { taxId: { contains: query, mode: "insensitive" } },
        { id: { contains: query, mode: "insensitive" } },
      ];
    }

    // Fetch applications
    const applications = await prisma.factoringApplication.findMany({
      where,
      include: {
        applicant: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
      take: limit,
      skip: offset,
    });

    // Get total count for pagination
    const totalCount = await prisma.factoringApplication.count({ where });

    // Transform for frontend
    const formattedApplications = applications.map((app) => ({
      id: app.id,
      status: app.status,
      submittedAt: app.submittedAt.toISOString(),
      reviewedAt: app.reviewedAt?.toISOString(),
      
      // Hotel info
      hotelInfo: {
        companyName: app.companyName,
        hotelCategory: app.hotelCategory,
        yearsInOperation: app.yearsInOperation,
        registrationNumber: app.commercialRegistration,
        numberOfRooms: app.numberOfRooms,
        taxId: app.taxId,
      },
      
      // Financial
      financialInfo: {
        monthlyProcurement: app.monthlyProcurementAmount,
        averageInvoiceAmount: app.averageInvoiceAmount,
        suppliersCount: app.currentSuppliersCount,
        paymentFrequency: app.preferredPaymentFrequency,
      },
      
      // Credit
      creditInfo: {
        requestedLimit: app.suggestedCreditLimit,
        approvedLimit: app.approvedCreditLimit,
        interestRate: app.interestRate,
        termDays: app.termDays,
      },
      
      // Documents
      documents: app.documents || {},
      documentsVerified: app.documentsVerified || false,
      
      // Contact
      contactInfo: {
        name: app.applicant?.name || "",
        email: app.applicant?.email || "",
        phone: app.applicant?.phone || "",
      },
      
      // Review
      reviewNotes: app.reviewNotes,
      reviewedBy: app.reviewedBy,
      riskScore: app.riskScore,
      riskTier: app.riskTier,
      
      // Next steps
      nextSteps: app.nextSteps || [],
    }));

    return NextResponse.json({
      applications: formattedApplications,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });

  } catch (error) {
    logger.error({ error }, "Failed to fetch factoring applications");
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// POST /api/v1/factoring/applications/:id/review
// Add review note to application
export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const hasRole = await requireRole(userId, ["ADMIN", "FACTORING_OFFICER", "RISK_MANAGER"]);
    if (!hasRole) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Get application ID from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const applicationId = pathParts[pathParts.length - 2]; // .../applications/:id/review

    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { note, status, approvedCreditLimit, interestRate, termDays } = body;

    // Get current user info for reviewer
    const reviewer = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    // Build update data
    const updateData: any = {};
    
    if (note) {
      updateData.reviewNotes = note;
    }
    
    if (status) {
      updateData.status = status;
      if (status === "APPROVED" || status === "REJECTED") {
        updateData.reviewedAt = new Date();
        updateData.reviewedBy = reviewer?.name || userId;
      }
    }
    
    if (approvedCreditLimit !== undefined) {
      updateData.approvedCreditLimit = approvedCreditLimit;
    }
    
    if (interestRate !== undefined) {
      updateData.interestRate = interestRate;
    }
    
    if (termDays !== undefined) {
      updateData.termDays = termDays;
    }

    // Add next steps based on status
    if (status === "APPROVED") {
      updateData.nextSteps = [
        "Complete supplier onboarding",
        "Submit first invoice for factoring",
        "Set up automatic payment preferences",
      ];
    } else if (status === "NEEDS_INFO") {
      updateData.nextSteps = [
        "Provide additional documentation",
        "Clarify financial details",
        "Resubmit for review",
      ];
    }

    const application = await prisma.factoringApplication.update({
      where: { id: applicationId },
      data: updateData,
    });

    // Log the review
    logger.info({
      applicationId,
      reviewerId: userId,
      status,
      approvedCreditLimit,
    }, "Factoring application reviewed");

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      status: application.status,
      message: `Application ${status?.toLowerCase() || "updated"} successfully`,
    });

  } catch (error) {
    logger.error({ error }, "Failed to review factoring application");
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
