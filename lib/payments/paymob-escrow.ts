/**
 * Paymob Marketplace Escrow
 * Hotels Vendors — Payment Token Release System
 *
 * Legal structure: Paymob (licensed PSP) holds funds.
 * HotelsVendors only instructs release. We never touch the float.
 *
 * Flow:
 * 1. Invoice approved → create Paymob order with escrow hold
 * 2. Hotel funds the order via Paymob (card/bank/wallet)
 * 3. On due date: auto-release token → Paymob pays supplier
 * 4. On early payment: funder replaces hotel → Paymob pays supplier now
 */

import { prisma } from "@/lib/prisma";

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_BASE_URL = process.env.PAYMOB_BASE_URL || "https://accept.paymob.com/api";

interface PaymobAuthResponse {
  token: string;
}

interface PaymobOrderResponse {
  id: number;
  amount_cents: number;
  currency: string;
  merchant_order_id: string;
  payment_status: string;
}

interface PaymobPayoutResponse {
  id: number;
  status: string;
  amount_cents: number;
  recipient: string;
}

async function paymobFetch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${PAYMOB_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Paymob ${path}: ${err.slice(0, 300)}`);
  }
  return res.json() as Promise<T>;
}

async function getAuthToken(): Promise<string> {
  if (!PAYMOB_API_KEY) throw new Error("PAYMOB_API_KEY not configured");
  const data = await paymobFetch<PaymobAuthResponse>("/auth/tokens", {
    api_key: PAYMOB_API_KEY,
  });
  return data.token;
}

export interface EscrowInvoice {
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  hotelId: string;
  supplierId: string;
  hotelName: string;
  supplierName: string;
  dueDate?: Date | null;
  etaUuid?: string | null;
  tenantId: string;
}

export interface EscrowCreateResult {
  paymobOrderId: number;
  paymentUrl: string;
  escrowReference: string;
}

export async function createEscrowDeposit(invoice: EscrowInvoice): Promise<EscrowCreateResult> {
  const authToken = await getAuthToken();
  const amountCents = Math.round(invoice.amount * 100);

  const order = await paymobFetch<PaymobOrderResponse>("/ecommerce/orders", {
    auth_token: authToken,
    delivery_needed: false,
    amount_cents: amountCents,
    currency: "EGP",
    merchant_order_id: `ESCROW-${invoice.invoiceId}-${Date.now()}`,
    items: [
      {
        name: `Invoice ${invoice.invoiceNumber}`,
        amount_cents: amountCents,
        quantity: 1,
        description: `HotelsVendors escrow: ${invoice.hotelName} → ${invoice.supplierName}`,
      },
    ],
  });

  const escrowReference = `HV-ESC-${invoice.invoiceId}-${order.id}`;

  await prisma.payment.create({
    data: {
      paymentNumber: `PAY-${Date.now()}`,
      amount: invoice.amount,
      currency: "EGP",
      method: "ESCROW",
      status: "PENDING",
      referenceCode: escrowReference,
      gatewayRef: String(order.id),
      invoiceId: invoice.invoiceId,
      hotelId: invoice.hotelId,
      tenantId: invoice.tenantId,
      metadata: JSON.stringify({
        paymobOrderId: order.id,
        dueDate: invoice.dueDate?.toISOString(),
        etaUuid: invoice.etaUuid,
        supplierId: invoice.supplierId,
        type: "ESCROW_DEPOSIT",
      }),
    },
  });

  const paymentKey = await paymobFetch<{ token: string }>("/acceptance/payment_keys", {
    auth_token: authToken,
    amount_cents: amountCents,
    expiration: 86400 * 30,
    order_id: order.id,
    currency: "EGP",
    integration_id: parseInt(process.env.PAYMOB_INTEGRATION_ID || "0", 10),
    billing_data: {
      apartment: "NA",
      email: "escrow@hotelsvendors.com",
      floor: "NA",
      first_name: invoice.hotelName,
      street: "NA",
      building: "NA",
      phone_number: "NA",
      shipping_method: "NA",
      postal_code: "NA",
      city: "Cairo",
      country: "EG",
      last_name: "HotelsVendors",
      state: "Cairo",
    },
  });

  const iframeBase = process.env.PAYMOB_IFRAME_BASE_URL || "https://accept.paymob.com";
  const iframeId = process.env.PAYMOB_IFRAME_ID || "";
  const paymentUrl = `${iframeBase}/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey.token}`;

  return { paymobOrderId: order.id, paymentUrl, escrowReference };
}

export interface TokenReleaseInput {
  invoiceId: string;
  releaseType: "DUE_DATE" | "EARLY_PAYMENT" | "MANUAL";
  funderId?: string;
  approverId: string;
  coApproverId: string;
}

export async function releaseEscrowToken(input: TokenReleaseInput): Promise<{ released: boolean; message: string }> {
  const payment = await prisma.payment.findFirst({
    where: { invoiceId: input.invoiceId, method: "ESCROW", status: "PENDING" },
  });

  if (!payment) {
    return { released: false, message: "No pending escrow payment found for this invoice" };
  }

  if (!input.approverId || !input.coApproverId) {
    return { released: false, message: "Escrow release requires two distinct approvers" };
  }

  if (input.approverId === input.coApproverId) {
    return { released: false, message: "Escrow release requires two distinct approvers — self-approval blocked" };
  }

  const [approver, coApprover] = await Promise.all([
    prisma.user.findUnique({ where: { id: input.approverId }, select: { id: true, platformRole: true } }),
    prisma.user.findUnique({ where: { id: input.coApproverId }, select: { id: true, platformRole: true } }),
  ]);

  if (!approver || !coApprover) {
    return { released: false, message: "One or both approvers not found" };
  }

  const metadata = JSON.parse(payment.metadata || "{}");
  const paymobOrderId = metadata.paymobOrderId;

  if (input.releaseType === "DUE_DATE") {
    const invoice = await prisma.invoice.findUnique({
      where: { id: input.invoiceId },
      select: { dueDate: true },
    });
    if (invoice?.dueDate && new Date() < new Date(invoice.dueDate)) {
      return {
        released: false,
        message: `Due date not yet reached. Invoice due: ${invoice.dueDate.toISOString().split("T")[0]}. Release available after maturity.`,
      };
    }
  }

  const authToken = await getAuthToken();

  if (input.releaseType === "EARLY_PAYMENT" && input.funderId) {
    await prisma.factoringRequest.create({
      data: {
        invoiceId: input.invoiceId,
        factoringCompanyId: input.funderId,
        requestedAmount: Number(payment.amount),
        status: "DISBURSED",
        disbursedAt: new Date(),
        tenantId: payment.tenantId,
      },
    });
  }

  await paymobFetch<PaymobPayoutResponse>("/acceptance/payouts", {
    auth_token: authToken,
    amount_cents: Math.round(Number(payment.amount) * 100),
    currency: "EGP",
    order_id: paymobOrderId,
    merchant_order_id: `RELEASE-${input.invoiceId}-${Date.now()}`,
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: "PAID",
      paidAt: new Date(),
      metadata: JSON.stringify({
        ...metadata,
        releasedAt: new Date().toISOString(),
        releaseType: input.releaseType,
        funderId: input.funderId || null,
        approvedBy: input.approverId,
        coApprovedBy: input.coApproverId,
      }),
    },
  });

  await prisma.invoice.update({
    where: { id: input.invoiceId },
    data: { paidDate: new Date() },
  });

  await prisma.auditLog.create({
    data: {
      entityType: "PAYMENT",
      entityId: payment.id,
      action: "ESCROW_RELEASED",
      tenantId: payment.tenantId,
      actorId: input.approverId,
      actorRole: "ADMIN",
      afterState: JSON.stringify({
        releaseType: input.releaseType,
        funderId: input.funderId || null,
        approverId: input.approverId,
        coApproverId: input.coApproverId,
      }),
    },
  });

  return {
    released: true,
    message: `EGP ${Number(payment.amount).toLocaleString()} released from escrow to supplier`,
  };
}

export async function getEscrowStatus(invoiceId: string): Promise<{
  funded: boolean;
  released: boolean;
  amount: number;
  paymentUrl?: string;
}> {
  const payment = await prisma.payment.findFirst({
    where: { invoiceId, method: "ESCROW" },
    orderBy: { createdAt: "desc" },
  });

  if (!payment) {
    return { funded: false, released: false, amount: 0 };
  }

  return {
    funded: payment.status !== "PENDING",
    released: payment.status === "PAID",
    amount: Number(payment.amount),
  };
}
