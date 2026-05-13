/**
 * Products API — Public Catalog + Supplier Inventory
 * Hotels Vendors Marketplace Layer
 *
 * GET  — Public catalog (no auth required for browsing)
 * POST — Create product (supplier auth required)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { transformManyToMarketplace, toPrismaCategory } from "@/lib/marketplace/category-mapper";
import { ProductCategory, ProductStatus } from "@prisma/client";
import { z } from "zod";

// ── GET: Public Catalog ───────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || "ACTIVE";
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "24", 10));
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const supplierId = searchParams.get("supplierId") || undefined;

    const where: Record<string, unknown> = {};

    // Always filter by ACTIVE for public catalog unless explicitly overridden
    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Category filter: accepts marketplace short codes (fb, hk, etc.)
    if (category) {
      const prismaCat = toPrismaCategory(category);
      where.category = prismaCat;
    }

    if (supplierId) {
      where.supplierId = supplierId;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
              tier: true,
              rating: true,
              reviewCount: true,
              city: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const marketplaceProducts = transformManyToMarketplace(products);

    return NextResponse.json({
      success: true,
      data: {
        products: marketplaceProducts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// ── POST: Create Product (Authenticated Supplier) ─────────────

const CreateProductSchema = z.object({
  sku: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  category: z.enum(["fb", "hk", "ffe", "ose", "gra", "lin", "eng", "spa", "it", "sec"]),
  subcategory: z.string().optional(),
  unitPrice: z.number().positive(),
  currency: z.string().default("EGP"),
  stockQuantity: z.number().int().min(0).default(0),
  minOrderQty: z.number().int().min(1).default(1),
  unitOfMeasure: z.string().default("piece"),
  leadTimeDays: z.number().int().min(1).default(1),
  shelfLifeDays: z.number().int().optional(),
  temperatureReq: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  specs: z.record(z.string(), z.string()).optional(),
  supplierId: z.string().optional(), // If not provided, derives from auth
});

export async function POST(request: NextRequest) {
  try {
    // TODO: Add proper auth check for supplier role
    // For now, accept supplierId in body for development
    const body = await request.json();
    const parsed = CreateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check for duplicate SKU
    const existing = await prisma.product.findUnique({
      where: { sku: data.sku },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: `Product with SKU "${data.sku}" already exists` },
        { status: 409 }
      );
    }

    // Verify supplier exists
    if (!data.supplierId) {
      return NextResponse.json(
        { success: false, error: "supplierId is required" },
        { status: 400 }
      );
    }

    const supplier = await prisma.supplier.findUnique({
      where: { id: data.supplierId },
    });

    if (!supplier) {
      return NextResponse.json(
        { success: false, error: "Supplier not found" },
        { status: 404 }
      );
    }

    const prismaCategory = toPrismaCategory(data.category);
  // eslint-disable-next-line no-console
  console.log(`[Products API] Creating product with category: ${data.category} → ${prismaCategory}`);

    const product = await prisma.product.create({
      data: {
        sku: data.sku,
        name: data.name,
        description: data.description,
        category: prismaCategory,
        subcategory: data.subcategory,
        unitPrice: data.unitPrice,
        currency: data.currency,
        stockQuantity: data.stockQuantity,
        minOrderQty: data.minOrderQty,
        unitOfMeasure: data.unitOfMeasure,
        leadTimeDays: data.leadTimeDays,
        shelfLifeDays: data.shelfLifeDays,
        temperatureReq: data.temperatureReq,
        images: data.images ? JSON.stringify(data.images) : null,
        specs: data.specs ? JSON.stringify(data.specs) : null,
        status: "ACTIVE",
        supplierId: data.supplierId,
        tenantId: supplier.tenantId,
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            tier: true,
            rating: true,
            reviewCount: true,
            city: true,
          },
        },
      },
    });

    // Create initial inventory snapshot
    await prisma.inventorySnapshot.create({
      data: {
        productId: product.id,
        tenantId: supplier.tenantId,
        stockLevel: data.stockQuantity,
        projectedDays: data.stockQuantity > 0 ? Math.round(data.stockQuantity / Math.max(1, product.avgDailyUsage || 1)) : 0,
      },
    });

    const marketplaceProduct = transformManyToMarketplace([product])[0];

    return NextResponse.json(
      { success: true, data: marketplaceProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create product" },
      { status: 500 }
    );
  }
}
