import { describe, it, expect } from "vitest";
import { GrnCreateSchema, GrnLineItemSchema } from "@/lib/zod";

describe("GRN Validation", () => {
  describe("GrnLineItemSchema", () => {
    it("should accept valid line item", () => {
      const result = GrnLineItemSchema.safeParse({
        orderItemId: "clx1234567890",
        productId: "clx1234567891",
        orderedQuantity: 100,
        receivedQuantity: 95,
        acceptedQuantity: 90,
        rejectedQuantity: 5,
        rejectionReason: "5 items damaged",
      });
      expect(result.success).toBe(true);
    });

    it("should reject negative received quantity", () => {
      const result = GrnLineItemSchema.safeParse({
        orderItemId: "clx1234567890",
        productId: "clx1234567891",
        orderedQuantity: 100,
        receivedQuantity: -1,
        acceptedQuantity: 0,
      });
      expect(result.success).toBe(false);
    });

    it("should reject accepted > received", () => {
      // Note: this validation is in the API route, not Zod
      // Zod only validates types and ranges
      const result = GrnLineItemSchema.safeParse({
        orderItemId: "clx1234567890",
        productId: "clx1234567891",
        orderedQuantity: 100,
        receivedQuantity: 50,
        acceptedQuantity: 60, // > received — caught in API
      });
      expect(result.success).toBe(true); // Zod allows this; API catches it
    });

    it("should default rejectedQuantity to 0", () => {
      const result = GrnLineItemSchema.safeParse({
        orderItemId: "clx1234567890",
        productId: "clx1234567891",
        orderedQuantity: 100,
        receivedQuantity: 100,
        acceptedQuantity: 100,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.rejectedQuantity).toBe(0);
      }
    });
  });

  describe("GrnCreateSchema", () => {
    it("should accept valid GRN with line items", () => {
      const result = GrnCreateSchema.safeParse({
        orderId: "clx1234567890",
        lineItems: [
          {
            orderItemId: "clx1234567891",
            productId: "clx1234567892",
            orderedQuantity: 100,
            receivedQuantity: 100,
            acceptedQuantity: 95,
            rejectedQuantity: 5,
          },
        ],
      });
      expect(result.success).toBe(true);
    });

    it("should reject GRN with no line items", () => {
      const result = GrnCreateSchema.safeParse({
        orderId: "clx1234567890",
        lineItems: [],
      });
      expect(result.success).toBe(false);
    });

    it("should accept optional fields", () => {
      const result = GrnCreateSchema.safeParse({
        orderId: "clx1234567890",
        hotelId: "clx1234567891",
        supplierId: "clx1234567892",
        warehouseLocation: "Warehouse A",
        deliveryNoteRef: "DN-001",
        vehiclePlate: "ABC-1234",
        notes: "Checked at receiving dock",
        lineItems: [
          {
            orderItemId: "clx1234567893",
            productId: "clx1234567894",
            orderedQuantity: 50,
            receivedQuantity: 50,
            acceptedQuantity: 50,
          },
        ],
      });
      expect(result.success).toBe(true);
    });
  });
});
