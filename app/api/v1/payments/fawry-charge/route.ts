import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createFawryCharge } from "@/lib/payments/fawry";
import { apiRoute, authenticate, success, error, audit } from "@/lib/api-utils";
import { z } from "zod";

const FawryChargeSchema = z.object({
  orderId: z.string().min(1),
  customerEmail: z.string().email(),
  customerMobile: z.string().min(10),
  customerName: z.string().min(1),
  amount: z.number().positive(),
  description: z.string().max(200).default("Order deposit payment"),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = await request.json();
  const data = FawryChargeSchema.parse(body);

  const merchantRefNum = `HV-FAWRY-${Date.now()}-${auth.userId.slice(-6)}`;

  const chargeResponse = await createFawryCharge({
    merchantRefNum,
    customerProfileId: auth.userId,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerMobile: data.customerMobile,
    paymentMethod: "PayAtFawry",
    amount: data.amount,
    currencyCode: "EGP",
    description: data.description,
    chargeItems: [
      {
        itemId: data.orderId,
        description: data.description,
        price: data.amount,
        quantity: 1,
      },
    ],
    paymentExpiry: 24 * 60,
  });

  await prisma.paymentTransaction.create({
    data: {
      tenantId: auth.tenantId,
      amount: data.amount,
      currency: "EGP",
      gatewayRef: chargeResponse.referenceNumber,
      status: "PENDING",
      transactionType: "MARKETPLACE_COMMISSION",
      observedMethod: "FAWRY",
      metadata: JSON.stringify({
        merchantRefNum,
        referenceNumber: chargeResponse.referenceNumber,
        expirationTime: chargeResponse.expirationTime,
        fawryFees: chargeResponse.fawryFees,
        orderId: data.orderId,
      }),
    },
  });

  await prisma.order.update({
    where: { id: data.orderId, tenantId: auth.tenantId },
    data: {
      paymentGuaranteeMethod: `DEPOSIT_FAWRY:${chargeResponse.referenceNumber}`,
      paymentGuaranteed: false,
    },
  });

  await audit({
    entityType: "PAYMENT",
    entityId: data.orderId,
    action: "FAWRY_CHARGE_CREATED",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: {
      amount: data.amount,
      currency: "EGP",
      referenceNumber: chargeResponse.referenceNumber,
      orderId: data.orderId,
    },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    referenceNumber: chargeResponse.referenceNumber,
    paymentAmount: chargeResponse.paymentAmount,
    expirationTime: chargeResponse.expirationTime,
  }, 201);
}, { rateLimit: "financial" });
