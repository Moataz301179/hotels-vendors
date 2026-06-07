/**
 * Auto-Reorder System
 * Monitors par levels and generates purchase orders when stock
 * falls below thresholds.
 */

export interface ParLevel {
  hotelId: string;
  sku: string;
  parQuantity: number; // minimum desired stock
  reorderPoint: number; // trigger reorder at this level
  reorderQuantity: number; // how much to order
  supplierId: string;
}

export interface StockLevel {
  hotelId: string;
  sku: string;
  currentQuantity: number;
  lastUpdated: string;
}

export interface ReorderSuggestion {
  hotelId: string;
  sku: string;
  supplierId: string;
  suggestedQuantity: number;
  currentStock: number;
  parLevel: number;
  reason: string;
  priority: "critical" | "normal" | "low";
}

/**
 * Check all SKUs against par levels and generate reorder suggestions.
 */
export async function checkReorderNeeds(
  parLevels: ParLevel[],
  stockLevels: StockLevel[]
): Promise<ReorderSuggestion[]> {
  const suggestions: ReorderSuggestion[] = [];

  for (const par of parLevels) {
    const stock = stockLevels.find(
      (s) => s.hotelId === par.hotelId && s.sku === par.sku
    );

    if (!stock) continue;

    const { currentQuantity } = stock;
    const { reorderPoint, reorderQuantity, parQuantity } = par;

    if (currentQuantity <= reorderPoint) {
      const priority: ReorderSuggestion["priority"] =
        currentQuantity <= reorderPoint * 0.5 ? "critical" : "normal";

      suggestions.push({
        hotelId: par.hotelId,
        sku: par.sku,
        supplierId: par.supplierId,
        suggestedQuantity: reorderQuantity,
        currentStock: currentQuantity,
        parLevel: parQuantity,
        reason: `Stock (${currentQuantity}) at or below reorder point (${reorderPoint})`,
        priority,
      });
    }
  }

  // Sort by priority
  const priorityOrder = { critical: 0, normal: 1, low: 2 };
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return suggestions;
}

/**
 * Generate a draft purchase order from a reorder suggestion.
 * Returns PO data ready for Authority Matrix approval.
 */
export async function generateDraftPO(
  suggestion: ReorderSuggestion,
  unitPrice: number
): Promise<{
  poNumber: string;
  hotelId: string;
  supplierId: string;
  items: { sku: string; quantity: number; unitPrice: number; total: number }[];
  totalAmount: number;
  status: "draft";
  createdAt: string;
}> {
  const total = suggestion.suggestedQuantity * unitPrice;

  return {
    poNumber: `PO-${Date.now()}`,
    hotelId: suggestion.hotelId,
    supplierId: suggestion.supplierId,
    items: [
      {
        sku: suggestion.sku,
        quantity: suggestion.suggestedQuantity,
        unitPrice,
        total,
      },
    ],
    totalAmount: total,
    status: "draft",
    createdAt: new Date().toISOString(),
  };
}
