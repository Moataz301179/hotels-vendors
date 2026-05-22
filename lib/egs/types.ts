/**
 * EGS Code Domain Types
 * Egyptian Goods/Services code management for ETA compliance
 *
 * Every product line item on an ETA invoice must reference a registered
 * EGS (or GS1) code. This module defines the domain types.
 */

import type { EgsCodeStatus, EgsCodeType } from "@prisma/client";

// ── Core Entity ──

export interface EgsCodeInput {
  codeValue: string;
  codeType?: EgsCodeType;
  description?: string;
  activeFrom?: Date;
  activeTo?: Date | null;
  supplierId: string;
  productId?: string | null;
  tenantId: string;
}

export interface EgsCodeUpdateInput {
  codeValue?: string;
  codeType?: EgsCodeType;
  description?: string;
  activeFrom?: Date;
  activeTo?: Date | null;
  productId?: string | null;
  status?: EgsCodeStatus;
}

// ── ETA API Types ──

export interface EtaEgsRegistrationPayload {
  itemCode: string;
  codeType: "EGS" | "GS1";
  itemDesc: string;
  itemType: "GS1" | "EGS";
  activeFrom: string; // ISO date
  activeTo?: string;
}

export interface EtaEgsRegistrationResponse {
  codeID: number;
  codeName: string;
  codeType: string;
  itemCode: string;
  itemType: string;
  activeFrom: string;
  activeTo: string;
  status: string;
}

export interface EtaEgsListResponse {
  result: EtaEgsRegistrationResponse[];
  metadata: {
    totalPages: number;
    totalCount: number;
  };
}

// ── Validation Result ──

export interface EgsCodeValidationResult {
  valid: boolean;
  codeValue: string;
  productId?: string;
  productName?: string;
  status: EgsCodeStatus | "MISSING" | "NOT_REGISTERED";
  message: string;
}

export interface EgsBatchValidationResult {
  allValid: boolean;
  results: EgsCodeValidationResult[];
  missingCount: number;
  invalidCount: number;
}

// ── Service Result ──

export interface EgsSyncResult {
  synced: number;
  failed: number;
  skipped: number;
  errors: { codeValue: string; error: string }[];
}
