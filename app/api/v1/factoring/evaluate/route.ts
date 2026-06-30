import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, requirePermission, success, error } from "@/lib/api-utils";
import { z } from "zod";

const EvaluateSchema = z.object({
  invoiceId: z.string().cuid(),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "factoring:inquire");

  const body = await request.json();
  const data = EvaluateSchema.parse(body);

  const invoice = await prisma.invoice.findUnique({
    where: { id: data.invoiceId },
    include: {
      hotel: true,
      supplier: true,
    },
  });

  if (!invoice) {
    return error("Invoice not found", 404);
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { hotelId: true, supplierId: true },
  });

  if (auth.platformRole === "HOTEL" && invoice.hotelId !== user?.hotelId) {
    return error("Forbidden", 403);
  }
  if (auth.platformRole === "SUPPLIER" && invoice.supplierId !== user?.supplierId) {
    return error("Forbidden", 403);
  }

  const daysSinceIssue = Math.floor(
    (Date.now() - new Date(invoice.issueDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceIssue < 1) {
    return success({
      factorable: false,
      reason: "Invoice must be at least 1 day old before factoring is available",
      invoiceId: data.invoiceId,
    });
  }

  if (invoice.paymentStatus === "PAID" || invoice.paymentStatus === "FACTORED") {
    return success({
      factorable: false,
      reason: "Invoice is already paid or factored",
      invoiceId: data.invoiceId,
    });
  }

  if (invoice.etaStatus !== "ACCEPTED" && invoice.etaStatus !== "VALIDATED") {
    return success({
      factorable: false,
      reason: "Invoice must have ACCEPTED or VALIDATED ETA status",
      invoiceId: data.invoiceId,
    });
  }

  const hotelCreditScore = invoice.hotel.riskScore ?? 50;
  const amount = Number(invoice.total);

  const minAmount = 5000;
  const maxAmount = 5_000_000;

  if (amount < minAmount) {
    return success({
      factorable: false,
      reason: `Invoice amount (EGP ${amount.toLocaleString()}) is below the minimum threshold of EGP ${minAmount.toLocaleString()}`,
      invoiceId: data.invoiceId,
    });
  }

  if (amount > maxAmount) {
    return success({
      factorable: false,
      reason: `Invoice amount (EGP ${amount.toLocaleString()}) exceeds the maximum threshold of EGP ${maxAmount.toLocaleString()}. Consider splitting into multiple invoices.`,
      invoiceId: data.invoiceId,
    });
  }

  let advanceRate: number;
  if (hotelCreditScore <= 30) {
    advanceRate = 0.70;
  } else if (hotelCreditScore <= 50) {
    advanceRate = 0.80;
  } else if (hotelCreditScore <= 70) {
    advanceRate = 0.85;
  } else {
    advanceRate = 0.90;
  }

  const feeRate = hotelCreditScore <= 30 ? 0.035 : hotelCreditScore <= 50 ? 0.025 : 0.02;

  const advanceAmount = Math.round(amount * advanceRate);
  const fee = Math.round(advanceAmount * feeRate);
  const netAmount = advanceAmount - fee;

  const repaymentDueDate = new Date();
  repaymentDueDate.setDate(repaymentDueDate.getDate() + (hotelCreditScore >= 70 ? 90 : hotelCreditScore >= 50 ? 60 : 45));

  return success({
    factorable: true,
    advanceRate,
    advanceAmount,
    fee,
    netAmount,
    repaymentDueDate: repaymentDueDate.toISOString(),
    riskScore: hotelCreditScore,
    currency: invoice.currency,
    invoiceId: data.invoiceId,
  });
});
