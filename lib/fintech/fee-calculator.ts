import { prisma } from "@/lib/prisma";

const PLATFORM_FEE_RATE = 0.01;

export interface FeeCalculationResult {
  grossAmount: number;
  platformFeeAmount: number;
  platformFeeRate: number;
  supplierNetAmount: number;
  hotelAdminFeeAmount: number;
  hotelAdminFeeRate: number;
}

export function calculateInfrastructureFee(
  invoiceTotal: number,
  hotelAdminFeeRate: number = 0.01
): FeeCalculationResult {
  const grossAmount = Number(invoiceTotal);
  const platformFeeRate = PLATFORM_FEE_RATE;
  const platformFeeAmount = Math.round(grossAmount * platformFeeRate * 100) / 100;
  const hotelAdminFeeAmount = Math.round(grossAmount * hotelAdminFeeRate * 100) / 100;
  const supplierNetAmount = Math.round(
    (grossAmount - platformFeeAmount - hotelAdminFeeAmount) * 100
  ) / 100;

  return {
    grossAmount,
    platformFeeAmount,
    platformFeeRate,
    supplierNetAmount,
    hotelAdminFeeAmount,
    hotelAdminFeeRate,
  };
}

export async function settleInvoiceWithFees(
  invoiceId: string,
  tenantId: string
): Promise<{ paymentId: string; journalEntryId: string }> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { hotel: true, supplier: true, order: true },
  });

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  if (invoice.paymentStatus === "PAID" || invoice.paymentStatus === "FACTORED") {
    throw new Error("Invoice already settled");
  }

  const { grossAmount, platformFeeAmount, platformFeeRate, supplierNetAmount, hotelAdminFeeAmount, hotelAdminFeeRate } =
    calculateInfrastructureFee(Number(invoice.total));

  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        paymentNumber: `SETTLE-${invoice.invoiceNumber}-${Date.now()}`,
        invoiceId: invoice.id,
        hotelId: invoice.hotelId,
        amount: supplierNetAmount,
        status: "PENDING",
        settlementType: "SPLIT",
        tenantId,
      },
    });

    await tx.invoice.update({
      where: { id: invoice.id },
      data: {
        platformFee: platformFeeAmount,
        platformFeeRate,
        hotelAdminFeeAmount,
        hotelAdminFeeRate,
        paymentStatus: "PAID",
        paidDate: new Date(),
      },
    });

    const entryNumber = `JE-FEE-${invoice.invoiceNumber}-${Date.now()}`;
    const lineData = [
      { accountCode: "2020", accountName: "Settlement Payable", debit: grossAmount, credit: 0 },
      { accountCode: "1010", accountName: "Platform Escrow Bank Account", debit: 0, credit: platformFeeAmount + hotelAdminFeeAmount },
      { accountCode: "1020", accountName: "Corporate Clearing Cash Pool", debit: 0, credit: supplierNetAmount },
    ];
    const lines = JSON.stringify(lineData);
    const totalDebit = lineData[0].debit;
    const totalCredit = lineData[1].credit + lineData[2].credit;

    const journalEntry = await tx.journalEntry.create({
      data: {
        entryNumber,
        date: new Date(),
        sourceType: "INVOICE",
        sourceId: invoice.id,
        description: `Infrastructure fee split settlement for invoice ${invoice.invoiceNumber}. ${platformFeeAmount} platform fee + ${hotelAdminFeeAmount} admin fee deducted.`,
        lines,
        totalDebit,
        totalCredit,
        status: "POSTED",
        hotelId: invoice.hotelId,
        tenantId,
      },
    });

    await tx.auditLog.create({
      data: {
        tenantId,
        entityType: "SETTLEMENT",
        entityId: invoice.id,
        action: "SPLIT_SETTLEMENT_WITH_FEES",
        actorId: "system",
        actorRole: "SYSTEM",
        afterState: JSON.stringify({
          grossAmount,
          platformFeeAmount,
          hotelAdminFeeAmount,
          supplierNetAmount,
          paymentId: payment.id,
          journalEntryId: journalEntry.id,
        }),
      },
    });

    return { paymentId: payment.id, journalEntryId: journalEntry.id };
  });

  return result;
}
