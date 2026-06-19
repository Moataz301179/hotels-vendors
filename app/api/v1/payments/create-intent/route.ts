import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getAuthToken,
  createPaymobOrder,
  generatePaymentKey,
} from "@/lib/payments/paymob";
import { apiRoute, authenticate, success, error, audit } from "@/lib/api-utils";
import { z } from "zod";

const CreateIntentSchema = z.object({
  amount: z.number().positive(), // Amount in EGP
  description: z.string().max(200).optional(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(10),
  referenceType: z.enum(["SUBSCRIPTION", "DOCUMENT_FEE", "MARKETPLACE_COMMISSION"]).optional(),
  referenceId: z.string().optional(),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = await request.json();
  const data = CreateIntentSchema.parse(body);

  const amountCents = Math.round(data.amount * 100);
  const merchantOrderId = `HV-${Date.now()}-${auth.userId.slice(-6)}`;

  // Step 1: Authenticate with Paymob
  const authToken = await getAuthToken();

  // Step 2: Create Paymob order
  const paymobOrderId = await createPaymobOrder(authToken, amountCents, merchantOrderId);

  // Step 3: Generate payment key
  const paymentKey = await generatePaymentKey(authToken, paymobOrderId, amountCents, {
    email: data.email,
    phone: data.phone,
    firstName: data.firstName,
    lastName: data.lastName,
  });

  // Store payment record
  const paymentRecord = await prisma.paymentTransaction.create({
    data: {
      tenantId: auth.tenantId,
      amount: data.amount,
      currency: "EGP",
      gatewayRef: String(paymobOrderId),
      status: "PENDING",
      transactionType: data.referenceType || "SUBSCRIPTION",
      observedMethod: "PAYMOB",
      metadata: JSON.stringify({
        paymobOrderId,
        referenceType: data.referenceType,
        referenceId: data.referenceId,
        description: data.description,
      }),
    },
  });

  const iframeId = process.env.PAYMOB_IFRAME_ID;
  const iframeBaseUrl = process.env.PAYMOB_IFRAME_BASE_URL || "https://accept.paymob.com";
  const paymentUrl = iframeId
    ? `${iframeBaseUrl}/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey}`
    : null;

  await audit({
    entityType: "PAYMENT",
    entityId: paymentRecord.id,
    action: "PAYMENT_INTENT_CREATED",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: {
      amount: data.amount,
      currency: "EGP",
      paymobOrderId,
      referenceType: data.referenceType,
    },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    paymentId: paymentRecord.id,
    paymentKey,
    paymentUrl,
    paymobOrderId,
    amount: data.amount,
    currency: "EGP",
    status: "PENDING",
    message: "Payment intent created. Redirect user to paymentUrl or use paymentKey with Paymob's JS SDK.",
  }, 201);
}, { rateLimit: "financial" });
