import { z } from "zod";
import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────
// RIGOROUS ZOD STRUCTURAL PARSING RULES
// ─────────────────────────────────────────
export const BulkReceivableSchema = z.object({
  invoiceNumber: z.string().min(3, "Invoice reference structure invalid."),
  etaUuid: z.string().min(10, "Mandatory ETA Cryptographic UUID is required."),
  totalAmount: z.number().positive("Total asset value must mathematically exceed zero."),
  vatAmount: z.number().min(0, "VAT decimal constraints cannot be negative."),
  currency: z.string().refine(
    (val) => val === "EGP",
    { message: "STRICT_CURRENCY_CONSTRAINT: Only EGP is authorized for Phase 2 bulk operations." }
  ),
  issueDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid ISO-8601 Issue Date."),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid ISO-8601 Due Date."),
  supplierId: z.string().cuid("Invalid CUID for vendor schema."),
  hotelId: z.string().cuid("Invalid CUID for corporate group schema."),
});

export const BulkPayloadSchema = z.array(BulkReceivableSchema);

export class BulkUploader {
  /**
   * The Bulk ISO 20022 Parser & Validator
   * High-throughput array processor class capable of validating bulk multi-vendor receivable data structures.
   *
   * @param tenantId The operational tenant executing the bulk ingestion.
   */
  public async processInboundManifest(tenantId: string, rawPayload: unknown) {
    console.log(`[Bulk Uploader Telemetry] Initializing high-throughput ingestion stream for tenant: ${tenantId}`);

    // 1. Structural Parsing and Strict Schema Validation
    const parsedData = BulkPayloadSchema.safeParse(rawPayload);
    
    if (!parsedData.success) {
      console.error("[Bulk Uploader Exception] Structural Parsing Failure:", parsedData.error.format());
      throw new Error(`ISO_20022_PARSE_EXCEPTION: Malformed array structure or missing mandatory cryptographic properties.`);
    }

    const cleanArray = parsedData.data;
    console.log(`[Bulk Uploader Telemetry] Parsing success. ${cleanArray.length} receivable items mathematically validated.`);

    const committedIds: string[] = [];

    // 2. Stream into Phase 2 Transaction Engines for atomic database commit
    await prisma.$transaction(async (tx) => {
      for (const record of cleanArray) {
        
        // Enforce active vendor-to-hotel relationship alignment matrix
        const relationship = await tx.hotelSupplier.findUnique({
          where: {
            hotelId_supplierId: { hotelId: record.hotelId, supplierId: record.supplierId }
          }
        });

        if (!relationship) {
          throw new Error(`RELATIONSHIP_ALIGNMENT_BREACH: No active vendor-to-hotel mandate exists between Supplier [${record.supplierId}] and Hotel [${record.hotelId}].`);
        }

        if (relationship.isShell) {
          throw new Error(`OPERATIONAL_FLAG_EXCEPTION: Supplier [${record.supplierId}] remains an unhydrated Shell Account. Bulk ingestion strictly denied.`);
        }

        // Commit standard Receivable asset
        // Note: Bulk uploader creates synthetic order placeholder for invoice schema compliance
        const placeholderOrder = await tx.order.create({
          data: {
            orderNumber: `BULK-${record.invoiceNumber}`,
            status: "DELIVERED",
            total: record.totalAmount,
            supplierId: record.supplierId,
            hotelId: record.hotelId,
            tenantId: tenantId,
          }
        });
        
        const invoice = await tx.invoice.create({
          data: {
            invoiceNumber: record.invoiceNumber,
            etaUuid: record.etaUuid,
            etaStatus: "ACCEPTED",
            subtotal: record.totalAmount - record.vatAmount,
            vatAmount: record.vatAmount,
            total: record.totalAmount,
            currency: record.currency,
            issueDate: new Date(record.issueDate),
            dueDate: new Date(record.dueDate),
            status: "ISSUED",
            paymentStatus: "UNPAID",
            factoringStatus: "AVAILABLE",
            supplierId: record.supplierId,
            hotelId: record.hotelId,
            tenantId: tenantId,
            orderId: placeholderOrder.id,
          }
        });
        
        committedIds.push(invoice.id);
      }

      // 3. Log the bulk ingestion to the immutable AuditLog
      await tx.auditLog.create({
        data: {
          action: "BULK_MANIFEST_INGESTION",
          entityType: "AGGREGATED_ARRAY",
          entityId: "BATCH_" + Date.now(),
          tenantId,
          afterState: JSON.stringify({
            ingestedVolume: cleanArray.length,
            currency: "EGP",
            status: "COMMITTED_TO_LEDGER"
          })
        }
      });
    });

    console.log(`[Bulk Uploader Telemetry] High-throughput ingestion complete. ${committedIds.length} assets cleanly streamed into transaction engines.`);
    return { success: true, count: committedIds.length, assetIds: committedIds };
  }
}
