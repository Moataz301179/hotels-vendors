/**
 * Payment Lane Router
 * Routes checkout to the correct payment method:
 * - DIRECT_BANK: Immediate bank transfer
 * - SUPPLIER_CREDIT: 30/60/90 direct with supplier
 * - FACTORING: NBFI financed
 * 
 * Cash prices vs credit prices are displayed at checkout.
 */

import { prisma } from "@/lib/prisma";

export type PaymentLane = "DIRECT_BANK" | "SUPPLIER_CREDIT" | "FACTORING";

export interface LaneResult {
  lane: PaymentLane;
  hotelPays: number;
  supplierReceives: number;
  platformFee: number;
  financingFee?: number;
  totalDue?: number;
  dueDate?: Date;
  message: string;
}

/**
 * Calculate pricing for all three lanes at checkout.
 */
export async function calculateLanePricing(
  orderItems: { productId: string; quantity: number }[],
  hotelId: string
): Promise<Record<PaymentLane, LaneResult>> {
  let cashSubtotal = 0;
  let creditSubtotal = 0;

  for (const item of orderItems) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: { unitPrice: true, creditPrice: true, pricingModel: true, name: true },
    });
    if (!product) continue;

    const cashPrice = Number(product.unitPrice);
    const creditPrice = product.creditPrice ? Number(product.creditPrice) : cashPrice * 1.04; // Default 4% premium

    cashSubtotal += cashPrice * item.quantity;
    creditSubtotal += creditPrice * item.quantity;
  }

  const vatRate = 0.14;
  const cashTotal = cashSubtotal * (1 + vatRate);
  const creditTotal = creditSubtotal * (1 + vatRate);
  const platformFeeRate = 0.015;
  const platformFee = creditSubtotal * platformFeeRate;

  // Check hotel credit line for factoring lane
  const creditLine = await prisma.hotelCreditLine.findUnique({
    where: { hotelId },
  });

  const now = new Date();
  const dueDate60 = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  return {
    DIRECT_BANK: {
      lane: "DIRECT_BANK",
      hotelPays: cashTotal,
      supplierReceives: cashSubtotal,
      platformFee: 0,
      message: "Pay immediately via bank transfer. Best price.",
    },
    SUPPLIER_CREDIT: {
      lane: "SUPPLIER_CREDIT",
      hotelPays: creditTotal,
      supplierReceives: creditSubtotal,
      platformFee,
      totalDue: creditTotal,
      dueDate: dueDate60,
      message: "Pay in 60 days directly to supplier. Credit price applies.",
    },
    FACTORING: {
      lane: "FACTORING",
      hotelPays: creditTotal,
      supplierReceives: creditSubtotal - platformFee,
      platformFee,
      financingFee: creditSubtotal * 0.02, // 2% financing fee example
      totalDue: creditTotal,
      dueDate: dueDate60,
      message: creditLine?.status === "ACTIVE"
        ? `Pay in ${creditLine.tenorDays} days via ${creditLine.nbfiPartnerId}. Pre-approved limit: EGP ${creditLine.availableBalance}.`
        : "Apply for financing to unlock this lane.",
    },
  };
}

/**
 * Execute a checkout with the selected payment lane.
 */
export async function executeCheckout(params: {
  orderId: string;
  hotelId: string;
  lane: PaymentLane;
  tenantId: string;
  masterInvoiceId?: string;
}): Promise<{ success: boolean; message: string; reference?: string }> {
  const { orderId, hotelId, lane, tenantId, masterInvoiceId } = params;

  // Update order with payment lane
  await prisma.order.update({
    where: { id: orderId },
    data: { paymentLane: lane },
  });

  switch (lane) {
    case "DIRECT_BANK": {
      // Generate Paymob payment link or bank transfer instructions
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { Hotel: true, Supplier: true },
      });
      return {
        success: true,
        message: "Direct bank transfer initiated. Please complete payment within 24 hours.",
        reference: `BANK-${orderId}`,
      };
    }

    case "SUPPLIER_CREDIT": {
      // Record credit terms, update order status
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "CONFIRMED", paymentLaneRef: `CREDIT-60-${orderId}` },
      });
      return {
        success: true,
        message: "Order confirmed on 60-day credit terms. Invoice due date set.",
        reference: `CREDIT-60-${orderId}`,
      };
    }

    case "FACTORING": {
      const creditLine = await prisma.hotelCreditLine.findUnique({
        where: { hotelId },
      });

      if (!creditLine || creditLine.status !== "ACTIVE") {
        return { success: false, message: "No active credit line. Please apply for financing first." };
      }

      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order) return { success: false, message: "Order not found" };

      const drawAmount = Number(order.total);
      if (Number(creditLine.availableBalance) < drawAmount) {
        return { success: false, message: `Insufficient credit limit. Available: EGP ${creditLine.availableBalance}` };
      }

      // Create credit draw
      const interestAmount = drawAmount * (Number(creditLine.interestRate) / 365) * creditLine.tenorDays;
      const totalDue = drawAmount + interestAmount;
      const dueDate = new Date(Date.now() + creditLine.tenorDays * 24 * 60 * 60 * 1000);

      const draw = await prisma.creditDraw.create({
        data: {
          creditLineId: creditLine.id,
          masterInvoiceId: masterInvoiceId || null,
          amount: drawAmount,
          interestAmount,
          totalDue,
          dueDate,
          status: "DRAWN",
          tenantId,
        },
      });

      // Update credit line balance
      await prisma.hotelCreditLine.update({
        where: { id: creditLine.id },
        data: {
          availableBalance: { decrement: drawAmount },
          utilizedBalance: { increment: drawAmount },
        },
      });

      // Update order
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "CONFIRMED", paymentLaneRef: draw.id },
      });

      return {
        success: true,
        message: `Financing approved. EGP ${drawAmount} drawn from credit line. Due on ${dueDate.toISOString().split("T")[0]}.`,
        reference: draw.id,
      };
    }

    default:
      return { success: false, message: "Invalid payment lane" };
  }
}
