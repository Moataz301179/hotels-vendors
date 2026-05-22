/**
 * EGS Code Validation
 * Validates that products have registered, active EGS codes before
 * any invoice can be submitted to ETA.
 */

import { prisma } from "@/lib/prisma";
import type {
  EgsCodeValidationResult,
  EgsBatchValidationResult,
} from "./types";

/**
 * Validate a single product's EGS code.
 */
export async function validateProductEgsCode(
  productId: string
): Promise<EgsCodeValidationResult> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { EgsCode: true },
  });

  if (!product) {
    return {
      valid: false,
      codeValue: "",
      productId,
      productName: undefined,
      status: "MISSING",
      message: "Product not found",
    };
  }

  if (!product.EgsCode) {
    return {
      valid: false,
      codeValue: "",
      productId,
      productName: product.name,
      status: "MISSING",
      message: `Product "${product.name}" has no EGS code registered`,
    };
  }

  if (product.EgsCode.status !== "ACTIVE") {
    return {
      valid: false,
      codeValue: product.EgsCode.codeValue,
      productId,
      productName: product.name,
      status: product.EgsCode.status,
      message: `EGS code ${product.EgsCode.codeValue} for "${product.name}" is ${product.EgsCode.status} (must be ACTIVE)`,
    };
  }

  // Check expiry
  if (product.EgsCode.activeTo && new Date(product.EgsCode.activeTo) < new Date()) {
    return {
      valid: false,
      codeValue: product.EgsCode.codeValue,
      productId,
      productName: product.name,
      status: "EXPIRED",
      message: `EGS code ${product.EgsCode.codeValue} for "${product.name}" has expired`,
    };
  }

  return {
    valid: true,
    codeValue: product.EgsCode.codeValue,
    productId,
    productName: product.name,
    status: "ACTIVE",
    message: `EGS code ${product.EgsCode.codeValue} for "${product.name}" is valid`,
  };
}

/**
 * Validate EGS codes for all products on a given order.
 * This is the critical gate before ETA submission.
 */
export async function validateOrderEgsCodes(
  orderId: string
): Promise<EgsBatchValidationResult> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            include: { EgsCode: true },
          },
        },
      },
    },
  });

  if (!order) {
    return {
      allValid: false,
      results: [],
      missingCount: 0,
      invalidCount: 1,
    };
  }

  const results: EgsCodeValidationResult[] = [];
  let missingCount = 0;
  let invalidCount = 0;

  for (const item of order.items) {
    const product = item.product;
    if (!product) continue;

    if (!product.EgsCode) {
      missingCount++;
      results.push({
        valid: false,
        codeValue: "",
        productId: product.id,
        productName: product.name,
        status: "MISSING",
        message: `Product "${product.name}" (SKU: ${product.sku}) has no EGS code`,
      });
      continue;
    }

    if (product.EgsCode.status !== "ACTIVE") {
      invalidCount++;
      results.push({
        valid: false,
        codeValue: product.EgsCode.codeValue,
        productId: product.id,
        productName: product.name,
        status: product.EgsCode.status,
        message: `EGS code ${product.EgsCode.codeValue} for "${product.name}" is ${product.EgsCode.status}`,
      });
      continue;
    }

    if (product.EgsCode.activeTo && new Date(product.EgsCode.activeTo) < new Date()) {
      invalidCount++;
      results.push({
        valid: false,
        codeValue: product.EgsCode.codeValue,
        productId: product.id,
        productName: product.name,
        status: "EXPIRED",
        message: `EGS code ${product.EgsCode.codeValue} for "${product.name}" has expired`,
      });
      continue;
    }

    results.push({
      valid: true,
      codeValue: product.EgsCode.codeValue,
      productId: product.id,
      productName: product.name,
      status: "ACTIVE",
      message: `Valid: ${product.EgsCode.codeValue}`,
    });
  }

  return {
    allValid: missingCount === 0 && invalidCount === 0,
    results,
    missingCount,
    invalidCount,
  };
}

/**
 * Validate EGS codes for a batch of product IDs (e.g. all products in a cart).
 */
export async function validateProductIdsEgsCodes(
  productIds: string[]
): Promise<EgsBatchValidationResult> {
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { EgsCode: true },
  });

  const results: EgsCodeValidationResult[] = [];
  let missingCount = 0;
  let invalidCount = 0;

  for (const product of products) {
    if (!product.EgsCode) {
      missingCount++;
      results.push({
        valid: false,
        codeValue: "",
        productId: product.id,
        productName: product.name,
        status: "MISSING",
        message: `"${product.name}" has no EGS code`,
      });
      continue;
    }

    if (product.EgsCode.status !== "ACTIVE") {
      invalidCount++;
      results.push({
        valid: false,
        codeValue: product.EgsCode.codeValue,
        productId: product.id,
        productName: product.name,
        status: product.EgsCode.status,
        message: `"${product.name}": EGS code is ${product.EgsCode.status}`,
      });
      continue;
    }

    if (product.EgsCode.activeTo && new Date(product.EgsCode.activeTo) < new Date()) {
      invalidCount++;
      results.push({
        valid: false,
        codeValue: product.EgsCode.codeValue,
        productId: product.id,
        productName: product.name,
        status: "EXPIRED",
        message: `"${product.name}": EGS code has expired`,
      });
      continue;
    }

    results.push({
      valid: true,
      codeValue: product.EgsCode.codeValue,
      productId: product.id,
      productName: product.name,
      status: "ACTIVE",
      message: `Valid: ${product.EgsCode.codeValue}`,
    });
  }

  return {
    allValid: missingCount === 0 && invalidCount === 0,
    results,
    missingCount,
    invalidCount,
  };
}
