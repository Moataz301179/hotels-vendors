import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { invoiceId } = await req.json();

    const inv = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { hotel: true },
    });

    if (!inv) {
      return NextResponse.json({ success: false, error: "Invoice not found" }, { status: 404 });
    }

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { paymentStatus: "PAID" as any },
    });

    // Auto-post payment journal: Dr AP / Cr Bank
    const lines = [
      { accountCode: "2100", accountName: "Accounts Payable", debit: inv.total, credit: 0 },
      { accountCode: "1100", accountName: "Bank / Cash", debit: 0, credit: inv.total },
    ];

    await prisma.journalEntry.create({
      data: {
          tenantId: inv.hotel.tenantId,
        entryNumber: `JE-PAY-${inv.invoiceNumber}`,
        date: new Date(),
        sourceType: "PAYMENT",
        sourceId: inv.id,
        description: `Auto-posted payment — ${inv.invoiceNumber}`,
        lines: JSON.stringify(lines),
        totalDebit: inv.total,
        totalCredit: inv.total,
        status: "POSTED",
        hotelId: inv.hotelId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
