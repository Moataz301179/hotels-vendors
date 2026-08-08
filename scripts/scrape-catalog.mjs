#!/usr/bin/env node
/**
 * Catalog Inventory Sync Worker
 * HotelsVendors — Automated Supplier Portal Scraper
 *
 * Usage: node scripts/scrape-catalog.mjs [--supplier <id>] [--dry-run]
 *
 * Environment:
 *   SUPPLIER_SCRAPERS — JSON array of supplier portal configs
 *   DEFAULT_TENANT_ID  — Tenant ID for new products
 */

import { chromium } from "playwright";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DRY_RUN = process.argv.includes("--dry-run");
const TARGET_SUPPLIER = process.argv.includes("--supplier")
  ? process.argv[process.argv.indexOf("--supplier") + 1]
  : null;

/**
 * @typedef {{ supplierId: string, portalUrl: string, credentials: {user:string, pass:string}, selectors: {productList:string, sku:string, price:string, stock:string, name?:string}, transformPrice?: (raw:string)=>number, transformStock?: (raw:string)=>number }} ScraperConfig
 */

function loadConfigs() {
  const raw = process.env.SUPPLIER_SCRAPERS;
  if (!raw) {
    console.warn("[scraper] No SUPPLIER_SCRAPERS configured. Exiting.");
    process.exit(0);
  }
  try {
    const configs = JSON.parse(raw);
    if (TARGET_SUPPLIER) {
      return configs.filter((/** @type {ScraperConfig} */ c) => c.supplierId === TARGET_SUPPLIER);
    }
    return configs;
  } catch {
    console.error("[scraper] Invalid SUPPLIER_SCRAPERS JSON");
    process.exit(1);
  }
}

function parseEgyptianPrice(raw) {
  const cleaned = raw.replace(/[^0-9\u0660-\u0669\u06F0-\u06F9.,]/g, "").replace(/,/g, "");
  const normalized = cleaned
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06F0));
  return parseFloat(normalized) || 0;
}

function parseStockCount(raw) {
  const cleaned = raw.replace(/[^0-9\u0660-\u0669]/g, "");
  if (!cleaned) return 0;
  const normalized = cleaned.replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660));
  return parseInt(normalized) || 0;
}

/**
 * @param {ScraperConfig} config
 */
async function scrapeSupplier(config) {
  console.log(`[scraper] Starting: ${config.supplierId} → ${config.portalUrl}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "HotelsVendors-Scraper/1.0 (+https://hotelsvendors.com)",
  });
  const page = await context.newPage();

  let updated = 0, inserted = 0, skipped = 0;

  try {
    await page.goto(config.portalUrl, { waitUntil: "networkidle", timeout: 30000 });

    const userInput = page.locator('input[type="text"], input[name="username"], input[name="email"]').first();
    const passInput = page.locator('input[type="password"]').first();
    const submitBtn = page.locator('button[type="submit"], input[type="submit"]').first();

    if (await userInput.count() > 0) {
      await userInput.fill(config.credentials.user);
      await passInput.fill(config.credentials.pass);
      if (await submitBtn.count() > 0) await submitBtn.click();
      await page.waitForLoadState("networkidle");
    }

    const products = await page.locator(config.selectors.productList).all();
    console.log(`[scraper] ${config.supplierId}: Found ${products.length} products`);

    for (const el of products) {
      const skuRaw = (await el.locator(config.selectors.sku).textContent()) || "";
      const priceRaw = (await el.locator(config.selectors.price).textContent()) || "0";
      const stockRaw = (await el.locator(config.selectors.stock).textContent()) || "0";
      const nameRaw = config.selectors.name
        ? (await el.locator(config.selectors.name).textContent()) || ""
        : "";

      const sku = skuRaw.trim();
      if (!sku) { skipped++; continue; }

      const unitPrice = config.transformPrice
        ? config.transformPrice(priceRaw)
        : parseEgyptianPrice(priceRaw);
      const stockQty = config.transformStock
        ? config.transformStock(stockRaw)
        : parseStockCount(stockRaw);

      if (DRY_RUN) {
        console.log(`  [dry-run] SKU=${sku} price=${unitPrice} stock=${stockQty}`);
        skipped++;
        continue;
      }

      const existing = await prisma.product.findFirst({
        where: { sku, supplierId: config.supplierId, deletedAt: null },
        select: { id: true, unitPrice: true, stockQuantity: true },
      });

      if (existing) {
        const priceChanged = Number(existing.unitPrice) !== unitPrice;
        const stockChanged = existing.stockQuantity !== stockQty;
        if (priceChanged || stockChanged) {
          await prisma.product.update({
            where: { id: existing.id },
            data: {
              unitPrice,
              stockQuantity: stockQty,
              status: stockQty === 0 ? "OUT_OF_STOCK" : "ACTIVE",
              updatedAt: new Date(),
            },
          });
          updated++;
        } else { skipped++; }
      } else {
        if (!nameRaw) { skipped++; continue; }
        await prisma.product.create({
          data: {
            sku,
            name: nameRaw.trim(),
            supplierId: config.supplierId,
            unitPrice,
            stockQuantity: stockQty,
            currency: "EGP",
            category: "CONSUMABLES",
            status: stockQty === 0 ? "OUT_OF_STOCK" : "ACTIVE",
            tenantId: process.env.DEFAULT_TENANT_ID || "TENANT_001",
          },
        });
        inserted++;
      }
    }

    console.log(`[scraper] ${config.supplierId}: updated=${updated} inserted=${inserted} skipped=${skipped}`);

  } catch (err) {
    console.error(`[scraper] ${config.supplierId}: ERROR`, err.message || err);
  } finally {
    await browser.close();
  }

  // Log sync run
  const tenantId = process.env.DEFAULT_TENANT_ID || "TENANT_001";
  try {
    await prisma.auditLog.create({
      data: {
        tenantId,
        entityId: config.supplierId,
        actorId: "SCRAPER_WORKER",
        actionType: "UPDATE",
        changes: {
          supplierId: config.supplierId,
          portalUrl: config.portalUrl,
          syncedAt: new Date().toISOString(),
          dryRun: DRY_RUN,
        },
      },
    });
  } catch {}
}

async function main() {
  const configs = loadConfigs();
  if (configs.length === 0) {
    console.log("[scraper] No suppliers to scrape. Exiting.");
    process.exit(0);
  }

  console.log(`[scraper] Scraping ${configs.length} supplier(s)...`);
  for (const config of configs) {
    await scrapeSupplier(config);
  }

  console.log("[scraper] Done.");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("[scraper] Fatal error:", err.message || err);
  process.exit(1);
});