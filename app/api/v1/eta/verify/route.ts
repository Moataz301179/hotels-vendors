import { NextRequest } from "next/server";
import { verifyInvoiceByPublicUrl, verifyInvoiceByLongId } from "@/lib/eta/public-verifier";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";
import { z } from "zod";

const VerifyByUrlSchema = z.object({
  type: z.literal("publicUrl"),
  publicUrl: z.string().url(),
  expectedAmount: z.number().positive().optional(),
  expectedReceiverTaxId: z.string().optional(),
  expectedIssuerTaxId: z.string().optional(),
});

const VerifyByLongIdSchema = z.object({
  type: z.literal("longId"),
  longId: z.string().min(10),
  expectedAmount: z.number().positive().optional(),
  expectedReceiverTaxId: z.string().optional(),
  expectedIssuerTaxId: z.string().optional(),
});

const VerifySchema = z.discriminatedUnion("type", [VerifyByUrlSchema, VerifyByLongIdSchema]);

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  const body = await request.json();
  const data = VerifySchema.parse(body);

  let result;
  if (data.type === "publicUrl") {
    result = await verifyInvoiceByPublicUrl(data.publicUrl, {
      amount: data.expectedAmount,
      receiverTaxId: data.expectedReceiverTaxId,
      issuerTaxId: data.expectedIssuerTaxId,
    });
  } else {
    result = await verifyInvoiceByLongId(data.longId, {
      amount: data.expectedAmount,
      receiverTaxId: data.expectedReceiverTaxId,
      issuerTaxId: data.expectedIssuerTaxId,
    });
  }

  return success(result);
});

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const longId = searchParams.get("longId");

  if (url) {
    const result = await verifyInvoiceByPublicUrl(url);
    return success(result);
  }
  if (longId) {
    const result = await verifyInvoiceByLongId(longId);
    return success(result);
  }

  return error("Provide ?url= or ?longId= parameter", 400);
});
