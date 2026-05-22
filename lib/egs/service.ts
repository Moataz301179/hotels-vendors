/**
 * EGS Code Service
 * CRUD operations + ETA synchronization for EGS/GS1 product codes.
 */

import { prisma } from "@/lib/prisma";
import { etaClient } from "@/lib/eta/client";
import type {
  EgsCodeInput,
  EgsCodeUpdateInput,
  EgsSyncResult,
  EtaEgsRegistrationPayload,
} from "./types";

// ── CRUD ──

export async function listEgsCodes(filters: {
  tenantId: string;
  supplierId?: string;
  status?: string;
  productId?: string;
  page?: number;
  pageSize?: number;
}) {
  const { tenantId, supplierId, status, productId, page = 1, pageSize = 50 } = filters;

  const where = {
    tenantId,
    ...(supplierId && { supplierId }),
    ...(status && { status: status as any }),
    ...(productId && { productId }),
  };

  const [items, total] = await Promise.all([
    prisma.egsCode.findMany({
      where,
      include: {
        Product: { select: { id: true, name: true, sku: true } },
        Supplier: { select: { id: true, name: true, taxId: true } },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.egsCode.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getEgsCode(id: string, tenantId: string) {
  return prisma.egsCode.findFirst({
    where: { id, tenantId },
    include: {
      Product: { select: { id: true, name: true, sku: true } },
      Supplier: { select: { id: true, name: true, taxId: true } },
    },
  });
}

export async function createEgsCode(input: EgsCodeInput) {
  // Validate uniqueness within tenant + codeValue
  const existing = await prisma.egsCode.findFirst({
    where: {
      tenantId: input.tenantId,
      codeValue: input.codeValue,
      supplierId: input.supplierId,
    },
  });
  if (existing) {
    throw new Error(`EGS code ${input.codeValue} already exists for this supplier`);
  }

  // If linking to a product, ensure no other EGS code is linked
  if (input.productId) {
    const linked = await prisma.egsCode.findFirst({
      where: { productId: input.productId, tenantId: input.tenantId },
    });
    if (linked && linked.id !== undefined) {
      throw new Error(`Product already has an EGS code: ${linked.codeValue}`);
    }
  }

  return prisma.egsCode.create({
    data: {
      codeValue: input.codeValue,
      codeType: input.codeType ?? "EGS",
      description: input.description,
      activeFrom: input.activeFrom ?? new Date(),
      activeTo: input.activeTo,
      supplierId: input.supplierId,
      productId: input.productId,
      tenantId: input.tenantId,
      status: "PENDING",
    },
    include: {
      Product: { select: { id: true, name: true, sku: true } },
      Supplier: { select: { id: true, name: true, taxId: true } },
    },
  });
}

export async function updateEgsCode(
  id: string,
  tenantId: string,
  input: EgsCodeUpdateInput
) {
  const existing = await prisma.egsCode.findFirst({
    where: { id, tenantId },
  });
  if (!existing) {
    throw new Error("EGS code not found");
  }

  // If changing product link, ensure no conflict
  if (input.productId && input.productId !== existing.productId) {
    const linked = await prisma.egsCode.findFirst({
      where: { productId: input.productId, tenantId },
    });
    if (linked && linked.id !== id) {
      throw new Error(`Product already linked to EGS code ${linked.codeValue}`);
    }
  }

  return prisma.egsCode.update({
    where: { id },
    data: {
      ...(input.codeValue !== undefined && { codeValue: input.codeValue }),
      ...(input.codeType !== undefined && { codeType: input.codeType }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.activeFrom !== undefined && { activeFrom: input.activeFrom }),
      ...(input.activeTo !== undefined && { activeTo: input.activeTo }),
      ...(input.productId !== undefined && { productId: input.productId }),
      ...(input.status !== undefined && { status: input.status }),
    },
    include: {
      Product: { select: { id: true, name: true, sku: true } },
      Supplier: { select: { id: true, name: true, taxId: true } },
    },
  });
}

export async function deleteEgsCode(id: string, tenantId: string) {
  const existing = await prisma.egsCode.findFirst({
    where: { id, tenantId },
  });
  if (!existing) {
    throw new Error("EGS code not found");
  }
  return prisma.egsCode.delete({ where: { id } });
}

// ── ETA Sync ──

/**
 * Register an EGS code with the ETA API.
 * Updates the local record with etaCodeId and status on success.
 */
export async function registerWithEta(
  egsCodeId: string,
  tenantId: string
) {
  const code = await prisma.egsCode.findFirst({
    where: { id: egsCodeId, tenantId },
    include: { Supplier: true, Product: true },
  });

  if (!code) throw new Error("EGS code not found");
  if (!code.Supplier.taxId) throw new Error("Supplier has no tax ID");

  const payload: EtaEgsRegistrationPayload = {
    itemCode: code.codeValue,
    codeType: code.codeType as "EGS" | "GS1",
    itemDesc: code.description || code.Product?.name || code.codeValue,
    itemType: code.codeType as "EGS" | "GS1",
    activeFrom: code.activeFrom.toISOString().split("T")[0],
    ...(code.activeTo && { activeTo: code.activeTo.toISOString().split("T")[0] }),
  };

  try {
    const response = await etaClient.registerEgsCode(payload, code.Supplier.taxId);

    await prisma.egsCode.update({
      where: { id: egsCodeId },
      data: {
        etaCodeId: String(response.codeID),
        status: response.status === "Approved" ? "ACTIVE" : "PENDING",
        etaResponse: JSON.stringify(response),
      },
    });

    return { success: true, response };
  } catch (err: any) {
    await prisma.egsCode.update({
      where: { id: egsCodeId },
      data: {
        status: "REJECTED",
        etaResponse: JSON.stringify({ error: err.message }),
      },
    });
    throw err;
  }
}

/**
 * Sync all PENDING EGS codes for a supplier with ETA.
 * Returns summary of results.
 */
export async function syncPendingEgsCodes(
  supplierId: string,
  tenantId: string
): Promise<EgsSyncResult> {
  const pending = await prisma.egsCode.findMany({
    where: { supplierId, tenantId, status: "PENDING" },
    include: { Supplier: true, Product: true },
  });

  const result: EgsSyncResult = { synced: 0, failed: 0, skipped: 0, errors: [] };

  for (const code of pending) {
    if (!code.Supplier.taxId) {
      result.skipped++;
      result.errors.push({ codeValue: code.codeValue, error: "Supplier missing tax ID" });
      continue;
    }

    try {
      await registerWithEta(code.id, tenantId);
      result.synced++;
    } catch (err: any) {
      result.failed++;
      result.errors.push({ codeValue: code.codeValue, error: err.message });
    }
  }

  return result;
}

/**
 * Bulk import EGS codes from a CSV-like array.
 * Does NOT sync with ETA — call syncPendingEgsCodes after.
 */
export async function bulkImportEgsCodes(
  rows: { codeValue: string; codeType?: string; description?: string; productSku?: string }[],
  supplierId: string,
  tenantId: string
) {
  const results = { created: 0, skipped: 0, errors: [] as { row: number; error: string }[] };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      // Find product by SKU if provided
      let productId: string | undefined;
      if (row.productSku) {
        const product = await prisma.product.findFirst({
          where: { sku: row.productSku, supplierId, tenantId },
        });
        if (product) productId = product.id;
      }

      await createEgsCode({
        codeValue: row.codeValue,
        codeType: (row.codeType as any) || "EGS",
        description: row.description,
        supplierId,
        tenantId,
        productId,
      });
      results.created++;
    } catch (err: any) {
      if (err.message?.includes("already exists")) {
        results.skipped++;
      } else {
        results.errors.push({ row: i + 1, error: err.message });
      }
    }
  }

  return results;
}
