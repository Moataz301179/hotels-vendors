import { prisma } from "@/lib/prisma";
import { logSecurityEvent } from "@/lib/security/security-logger";

export interface FraudDetectionResult {
  triggered: boolean;
  alerts: FraudAlertResult[];
}

export interface FraudAlertResult {
  ruleId: string;
  ruleName: string;
  ruleType: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  autoAction: string;
  description: string;
  evidence: Record<string, unknown>;
}

export async function evaluateOrderForFraud(
  orderId: string,
  tenantId: string,
  actorId: string,
  ipAddress?: string
): Promise<FraudDetectionResult> {
  const order = await prisma.order.findUnique({
    where: { id: orderId, tenantId },
    include: {
      items: { include: { product: true } },
      hotel: true,
      supplier: true,
      requester: true,
    },
  });

  if (!order) {
    return { triggered: false, alerts: [] };
  }

  const alerts: FraudAlertResult[] = [];
  const activeRules = await prisma.fraudRule.findMany({
    where: { isActive: true, tenantId },
  });

  const globalRules = activeRules.filter((r) => r.ruleType);

  for (const rule of globalRules) {
    const result = await evaluateRule(rule, order, tenantId);
    if (result) {
      alerts.push(result);
    }
  }

  const builtInAlerts = await evaluateBuiltInRules(order, tenantId);
  alerts.push(...builtInAlerts);

  for (const alert of alerts) {
    await storeFraudAlert(alert, ruleIdFromType(alert.ruleType), orderId, tenantId, actorId);

    if (alert.autoAction === "BLOCK_TRANSACTION" || alert.autoAction === "SUSPEND_ENTITY") {
      logSecurityEvent({
        event: "suspicious_input",
        severity: "critical",
        ip: ipAddress,
        userId: actorId,
        details: {
          orderId,
          rule: alert.ruleName,
          autoAction: alert.autoAction,
          description: alert.description,
        },
      });
    }
  }

  return { triggered: alerts.length > 0, alerts };
}

export async function evaluateInvoiceForFraud(
  invoiceId: string,
  tenantId: string,
  actorId: string,
  ipAddress?: string
): Promise<FraudDetectionResult> {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId, tenantId },
    include: {
      hotel: true,
      supplier: true,
      order: { include: { items: { include: { product: true } } } },
    },
  });

  if (!invoice) {
    return { triggered: false, alerts: [] };
  }

  const alerts: FraudAlertResult[] = [];

  const builtInAlerts = await evaluateInvoiceBuiltInRules(invoice, tenantId);
  alerts.push(...builtInAlerts);

  for (const alert of alerts) {
    await storeFraudAlert(alert, ruleIdFromType(alert.ruleType), invoiceId, tenantId, actorId);
  }

  return { triggered: alerts.length > 0, alerts };
}

async function evaluateRule(
  rule: { id: string; name: string; ruleType: string; config: string; severity: string; autoAction: string },
  order: Record<string, unknown>,
  tenantId: string
): Promise<FraudAlertResult | null> {
  const config = tryParseJson<Record<string, unknown>>(rule.config);
  if (!config) return null;

  switch (rule.ruleType) {
    case "PRICE_ANOMALY": {
      const threshold = Number(config?.thresholdPercent || 50);
      const items = (order as Record<string, unknown>).items as { unitPrice: number; product: { name: string } }[];
      if (!items) return null;
      for (const item of items) {
        if (item.unitPrice <= 0) {
          return {
            ruleId: rule.id,
            ruleName: rule.name,
            ruleType: "PRICE_ANOMALY",
            severity: rule.severity as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
            autoAction: rule.autoAction,
            description: `Zero or negative unit price detected: ${item.product?.name || "unknown"}`,
            evidence: { unitPrice: item.unitPrice },
          };
        }
      }
      return null;
    }
    case "RAPID_FIRE": {
      const windowMinutes = Number(config?.windowMinutes || 60);
      const maxOrders = Number(config?.maxOrders || 10);
      const orderHotelId = (order as Record<string, unknown>).hotelId as string;
      const recentCount = await prisma.order.count({
        where: {
          hotelId: orderHotelId,
          tenantId,
          createdAt: { gte: new Date(Date.now() - windowMinutes * 60 * 1000) },
        },
      });
      if (recentCount >= maxOrders) {
        return {
          ruleId: rule.id,
          ruleName: rule.name,
          ruleType: "RAPID_FIRE",
          severity: rule.severity as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
          autoAction: rule.autoAction,
          description: `Rapid order creation detected: ${recentCount} orders in ${windowMinutes} minutes`,
          evidence: { orderCount: recentCount, windowMinutes },
        };
      }
      return null;
    }
    default:
      return null;
  }
}

async function evaluateBuiltInRules(
  order: Record<string, unknown> & { id: string; total: number; hotelId: string; supplierId: string; items: { productId: string; unitPrice: number; quantity: number }[] },
  tenantId: string
): Promise<FraudAlertResult[]> {
  const alerts: FraudAlertResult[] = [];

  const dupCheck = await prisma.order.findFirst({
    where: {
      tenantId,
      hotelId: order.hotelId,
      supplierId: order.supplierId,
      total: order.total,
      id: { not: order.id },
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
    select: { id: true, orderNumber: true, createdAt: true },
  });
  if (dupCheck) {
    alerts.push({
      ruleId: "builtin_duplicate_order",
      ruleName: "Duplicate Order Detection",
      ruleType: "DUPLICATE_INVOICE",
      severity: "HIGH",
      autoAction: "FLAG_FOR_REVIEW",
      description: `Order matches existing order ${dupCheck.orderNumber} (same hotel, supplier, amount within 24h)`,
      evidence: { matchedOrderId: dupCheck.id, matchedOrderNumber: dupCheck.orderNumber, matchedAt: dupCheck.createdAt.toISOString() },
    });
  }

  return alerts;
}

async function evaluateInvoiceBuiltInRules(
  invoice: Record<string, unknown> & { id: string; total: number; invoiceNumber: string; hotelId: string; supplierId: string; orderId: string },
  tenantId: string
): Promise<FraudAlertResult[]> {
  const alerts: FraudAlertResult[] = [];

  const dupInvoice = await prisma.invoice.findFirst({
    where: {
      tenantId,
      hotelId: invoice.hotelId,
      supplierId: invoice.supplierId,
      total: invoice.total,
      id: { not: invoice.id },
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
    select: { id: true, invoiceNumber: true, createdAt: true },
  });
  if (dupInvoice) {
    alerts.push({
      ruleId: "builtin_duplicate_invoice",
      ruleName: "Duplicate Invoice Detection",
      ruleType: "DUPLICATE_INVOICE",
      severity: "HIGH",
      autoAction: "FLAG_FOR_REVIEW",
      description: `Invoice matches existing invoice ${dupInvoice.invoiceNumber} (same hotel, supplier, amount within 24h)`,
      evidence: { matchedInvoiceId: dupInvoice.id, matchedInvoiceNumber: dupInvoice.invoiceNumber, matchedAt: dupInvoice.createdAt.toISOString() },
    });
  }

  const invoiceTotal = Number(invoice.total);
  if (invoiceTotal <= 0) {
    alerts.push({
      ruleId: "builtin_zero_amount_invoice",
      ruleName: "Zero Amount Invoice",
      ruleType: "PRICE_ANOMALY",
      severity: "MEDIUM",
      autoAction: "FLAG_FOR_REVIEW",
      description: `Invoice ${invoice.invoiceNumber} has zero or negative total`,
      evidence: { total: invoiceTotal },
    });
  }

  return alerts;
}

async function storeFraudAlert(
  alert: FraudAlertResult,
  ruleId: string,
  entityId: string,
  tenantId: string,
  actorId: string
): Promise<void> {
  const existingAlert = await prisma.fraudAlert.findFirst({
    where: {
      entityId,
      ruleId,
      status: { in: ["OPEN", "UNDER_INVESTIGATION"] },
    },
  });
  if (existingAlert) return;

  await prisma.fraudAlert.create({
    data: {
      ruleId,
      entityType: alert.ruleType === "DUPLICATE_INVOICE" ? "INVOICE" : "ORDER",
      entityId,
      description: alert.description,
      evidence: JSON.stringify(alert.evidence),
      severity: alert.severity,
      status: "OPEN",
      tenantId,
    },
  });
}

function ruleIdFromType(ruleType: string): string {
  const map: Record<string, string> = {
    PRICE_ANOMALY: "builtin_price_anomaly",
    DUPLICATE_INVOICE: "builtin_duplicate",
    UNUSUAL_ORDER: "builtin_unusual_order",
    PHANTOM_SUPPLIER: "builtin_phantom_supplier",
    RAPID_FIRE: "builtin_rapid_fire",
    CIRCULAR_TRADING: "builtin_circular_trading",
  };
  return map[ruleType] || "builtin_unknown";
}

function tryParseJson<T>(str: string | null | undefined): T | null {
  if (!str) return null;
  try {
    return JSON.parse(str) as T;
  } catch {
    return null;
  }
}
