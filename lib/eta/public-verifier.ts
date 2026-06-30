/**
 * ETA Public URL Verifier
 * Hotels Vendors Compliance Layer
 *
 * Verifies invoice compliance using ETA's anonymous public URL (share/longId).
 * No authentication required — supplier shares their publicUrl, we read it.
 *
 * publicUrl format: https://{baseUrl}/{uuid}/share/{longId}
 * "Sharing this URL will grant read access to the document."
 *   — ETA SDK documentation
 */

import type { EtaValidationResult, EtaSubmissionResponse } from "./types";

const ETA_API_URL = process.env.ETA_API_URL || "https://api.preprod.invoicing.eta.gov.eg";

export interface PublicInvoiceDetails {
  uuid: string;
  longId: string;
  status: "Submitted" | "Valid" | "Invalid" | "Rejected" | "Cancelled";
  issuerId?: string;
  issuerName?: string;
  receiverId?: string;
  receiverName?: string;
  dateTimeIssued?: string;
  dateTimeReceived?: string;
  totalSales?: number;
  totalDiscount?: number;
  netAmount?: number;
  total?: number;
  validationResults?: {
    status: "In progress" | "Valid" | "Invalid";
    validationSteps?: Array<{
      name: string;
      status: "In progress" | "Valid" | "Invalid";
      error?: { code: string; message: string };
    }>;
  };
  rejectionReasons?: Array<{ error: string; errorCode: string }>;
}

export interface VerificationRequest {
  type: "publicUrl" | "longId" | "uuid_longId";
  publicUrl?: string;
  longId?: string;
  uuid?: string;
}

export interface VerifiedInvoice {
  valid: boolean;
  etaStatus: string;
  totalMatch: boolean;
  receiverMatch: boolean;
  issuerMatch: boolean;
  details: PublicInvoiceDetails;
  checks: {
    etaStatusValid: boolean;
    amountVerified: boolean;
    receiverVerified: boolean;
    issuerVerified: boolean;
    digitalSignatureValid: boolean;
  };
}

function parsePublicUrl(url: string): { uuid: string; longId: string } | null {
  const match = url.match(/\/documents\/([^/]+)\/share\/([^/\s?]+)/);
  if (match) return { uuid: match[1], longId: match[2] };
  const altMatch = url.match(/\/([a-f0-9-]+)\/share\/([a-zA-Z0-9]+)/i);
  if (altMatch) return { uuid: altMatch[1], longId: altMatch[2] };
  return null;
}

async function fetchPublicInvoice(url: string): Promise<PublicInvoiceDetails> {
  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`ETA public query failed: ${response.status} ${text.slice(0, 200)}`);
  }

  return response.json() as Promise<PublicInvoiceDetails>;
}

export async function verifyInvoiceByPublicUrl(
  publicUrl: string,
  expected?: {
    amount?: number;
    receiverTaxId?: string;
    issuerTaxId?: string;
  }
): Promise<VerifiedInvoice> {
  const parsed = parsePublicUrl(publicUrl);
  if (!parsed) {
    throw new Error(
      "Invalid publicUrl format. Expected: https://{baseUrl}/{uuid}/share/{longId}"
    );
  }

  const details = await fetchPublicInvoice(publicUrl);

  const etaStatusValid = details.status === "Valid";
  const amountVerified = expected?.amount
    ? Math.abs(Number(details.total) - expected.amount) < 0.01
    : true;
  const receiverVerified = expected?.receiverTaxId
    ? details.receiverId === expected.receiverTaxId
    : true;
  const issuerVerified = expected?.issuerTaxId
    ? details.issuerId === expected.issuerTaxId
    : true;
  const digitalSignatureValid = details.validationResults?.status === "Valid";

  return {
    valid: etaStatusValid && amountVerified && receiverVerified && issuerVerified,
    etaStatus: details.status,
    totalMatch: amountVerified,
    receiverMatch: receiverVerified,
    issuerMatch: issuerVerified,
    details,
    checks: {
      etaStatusValid,
      amountVerified,
      receiverVerified,
      issuerVerified,
      digitalSignatureValid: digitalSignatureValid ?? false,
    },
  };
}

export async function verifyInvoiceByLongId(
  longId: string,
  expected?: {
    amount?: number;
    receiverTaxId?: string;
    issuerTaxId?: string;
  }
): Promise<VerifiedInvoice> {
  const shareUrl = `${ETA_API_URL}/api/v1.0/documents/share/${longId}`;
  return verifyInvoiceByPublicUrl(shareUrl, expected);
}

export { parsePublicUrl };
