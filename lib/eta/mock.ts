/**
 * ETA Mock Server
 * Simulates Egyptian Tax Authority API responses for development/testing.
 *
 * When ETA_MOCK_MODE=true, the etaClient routes all calls here instead of
 * the real ETA API. Submissions are stored in Redis for persistence across
 * restarts.
 *
 * Switch to real ETA by setting ETA_MOCK_MODE=false and providing real
 * ETA_CLIENT_ID / ETA_CLIENT_SECRET.
 */

import { getRedisConnection } from "@/lib/queues/connection";
import type {
  EtaInvoicePayload,
  EtaSubmissionResponse,
  EtaDocumentStatus,
} from "./types";
import type { EtaEgsRegistrationPayload, EtaEgsRegistrationResponse } from "@/lib/egs/types";

const MOCK_PREFIX = "eta:mock:";

// ── Token ──

export async function mockGetAccessToken(): Promise<string> {
  return "mock-access-token-" + Date.now();
}

// ── Document Submission ──

export async function mockSubmitInvoice(
  payload: EtaInvoicePayload
): Promise<EtaSubmissionResponse> {
  const redis = getRedisConnection();
  const uuid = generateMockUuid();
  const longId = generateMockLongId();
  const now = new Date().toISOString();

  const document: MockDocument = {
    uuid,
    longId,
    internalId: payload.internalId,
    status: "Submitted",
    payload,
    createdAt: now,
    updatedAt: now,
  };

  await redis.set(`${MOCK_PREFIX}doc:${uuid}`, JSON.stringify(document));
  await redis.set(`${MOCK_PREFIX}doc:long:${longId}`, uuid);

  // Simulate async validation: schedule status change to "Valid" after 5s
  await redis.setex(`${MOCK_PREFIX}pending:${uuid}`, 10, "1");

  // Simulate callback if webhook URL is configured
  const webhookUrl = process.env.ETA_MOCK_WEBHOOK_URL;
  if (webhookUrl) {
    setTimeout(() => mockSendCallback(webhookUrl, uuid, "Valid"), 5000);
  }

  return {
    submissionId: `SUB-${Date.now()}`,
    uuid,
    longId,
    internalId: payload.internalId,
    typeName: "Invoice",
    typeVersionName: "1.0",
    issuerId: payload.issuer.id,
    issuerName: payload.issuer.name,
    receiverId: payload.receiver.id,
    receiverName: payload.receiver.name,
    dateTimeIssued: payload.dateIssued,
    dateTimeReceived: now,
    totalSales: payload.totalSalesAmount,
    totalDiscount: 0,
    netAmount: payload.netAmount,
    total: payload.totalAmount,
    status: "Submitted",
    documentCount: 1,
  };
}

// ── Document Retrieval ──

export async function mockGetInvoice(
  uuid: string
): Promise<EtaSubmissionResponse | null> {
  const redis = getRedisConnection();
  const data = await redis.get(`${MOCK_PREFIX}doc:${uuid}`);
  if (!data) return null;

  const doc: MockDocument = JSON.parse(data);
  return documentToResponse(doc);
}

// ── Document Status ──

export async function mockGetInvoiceStatus(
  uuid: string
): Promise<EtaDocumentStatus | null> {
  const redis = getRedisConnection();
  const data = await redis.get(`${MOCK_PREFIX}doc:${uuid}`);
  if (!data) return null;

  const doc: MockDocument = JSON.parse(data);

  // Simulate validation after pending period expires
  const pending = await redis.get(`${MOCK_PREFIX}pending:${uuid}`);
  if (!pending && doc.status === "Submitted") {
    doc.status = "Valid";
    doc.updatedAt = new Date().toISOString();
    await redis.set(`${MOCK_PREFIX}doc:${uuid}`, JSON.stringify(doc));
  }

  return doc.status as EtaDocumentStatus;
}

// ── Cancel / Reject ──

export async function mockCancelInvoice(uuid: string): Promise<void> {
  const redis = getRedisConnection();
  const data = await redis.get(`${MOCK_PREFIX}doc:${uuid}`);
  if (!data) throw new Error("Document not found");

  const doc: MockDocument = JSON.parse(data);
  if (doc.status === "Valid") {
    throw new Error("Cannot cancel validated document");
  }
  doc.status = "Cancelled";
  doc.updatedAt = new Date().toISOString();
  await redis.set(`${MOCK_PREFIX}doc:${uuid}`, JSON.stringify(doc));
}

export async function mockRejectInvoice(uuid: string): Promise<void> {
  const redis = getRedisConnection();
  const data = await redis.get(`${MOCK_PREFIX}doc:${uuid}`);
  if (!data) throw new Error("Document not found");

  const doc: MockDocument = JSON.parse(data);
  doc.status = "Rejected";
  doc.updatedAt = new Date().toISOString();
  await redis.set(`${MOCK_PREFIX}doc:${uuid}`, JSON.stringify(doc));
}

// ── EGS Code Registration ──

const mockEgsCodes = new Map<string, EtaEgsRegistrationResponse>();

export async function mockRegisterEgsCode(
  payload: EtaEgsRegistrationPayload
): Promise<EtaEgsRegistrationResponse> {
  const codeID = Date.now();
  const response: EtaEgsRegistrationResponse = {
    codeID,
    codeName: payload.itemDesc,
    codeType: payload.codeType,
    itemCode: payload.itemCode,
    itemType: payload.itemType,
    activeFrom: payload.activeFrom,
    activeTo: payload.activeTo || "2099-12-31",
    status: "Approved",
  };
  mockEgsCodes.set(payload.itemCode, response);
  return response;
}

export async function mockListEgsCodes(): Promise<EtaEgsRegistrationResponse[]> {
  return Array.from(mockEgsCodes.values());
}

// ── Helpers ──

interface MockDocument {
  uuid: string;
  longId: string;
  internalId: string;
  status: string;
  payload: EtaInvoicePayload;
  createdAt: string;
  updatedAt: string;
}

function generateMockUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateMockLongId(): string {
  return Array.from({ length: 16 }, () =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(
      Math.floor(Math.random() * 62)
    )
  ).join("");
}

function documentToResponse(doc: MockDocument): EtaSubmissionResponse {
  return {
    submissionId: `SUB-${doc.createdAt}`,
    uuid: doc.uuid,
    longId: doc.longId,
    internalId: doc.internalId,
    typeName: "Invoice",
    typeVersionName: "1.0",
    issuerId: doc.payload.issuer.id,
    issuerName: doc.payload.issuer.name,
    receiverId: doc.payload.receiver.id,
    receiverName: doc.payload.receiver.name,
    dateTimeIssued: doc.payload.dateIssued,
    dateTimeReceived: doc.createdAt,
    totalSales: doc.payload.totalSalesAmount,
    totalDiscount: 0,
    netAmount: doc.payload.netAmount,
    total: doc.payload.totalAmount,
    status: doc.status,
    documentCount: 1,
    dateTimeValidated: doc.status === "Valid" ? doc.updatedAt : undefined,
    rejectionReasons:
      doc.status === "Invalid"
        ? [{ error: "Mock validation failed", errorCode: "MOCK-001" }]
        : undefined,
  };
}

async function mockSendCallback(url: string, uuid: string, status: string) {
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uuid,
        status,
        dateTimeValidated: new Date().toISOString(),
      }),
    });
  } catch {
    // Callback webhook may not be configured — ignore
  }
}

// ── Export ──

export const etaMock = {
  getAccessToken: mockGetAccessToken,
  submitInvoice: mockSubmitInvoice,
  getInvoice: mockGetInvoice,
  getInvoiceStatus: mockGetInvoiceStatus,
  cancelInvoice: mockCancelInvoice,
  rejectInvoice: mockRejectInvoice,
  registerEgsCode: mockRegisterEgsCode,
  listEgsCodes: mockListEgsCodes,
};
