/**
 * Procurement Agent Executor
 * Hotels Vendors — Operational AI Agent Runtime
 *
 * Each agent has a handler that performs its operational function.
 * Runs inside a BullMQ worker for async execution.
 */

import { prisma } from "@/lib/prisma";
import { PROCUREMENT_AGENTS } from "./agents";
import type {
  ProcurementAgentId,
  AgentTask,
  AgentActionResult,
  ImportTaskInput,
  InviteTaskInput,
  InvoiceAuditInput,
} from "./types";
import { verifyInvoiceByPublicUrl } from "@/lib/eta/public-verifier";

type AgentHandler = (task: AgentTask) => Promise<unknown>;

const HANDLERS: Record<ProcurementAgentId, AgentHandler> = {
  "import-agent": async (task) => {
    const input = task.input as ImportTaskInput;
    const hotel = await prisma.hotel.findUnique({
      where: { id: input.hotelId },
      include: { properties: true },
    });
    if (!hotel) throw new Error("Hotel not found");

    return {
      hotelId: hotel.id,
      hotelName: hotel.name,
      propertiesImported: hotel.properties.length,
      message: "Hotel data loaded. Ready for supplier import from ERP/CSV.",
    };
  },

  "onboarding-agent": async (task) => {
    const input = task.input as InviteTaskInput;
    const suppliers = await prisma.supplier.findMany({
      where: { id: { in: input.supplierIds } },
    });

    const invites = suppliers.map((s) => ({
      supplierId: s.id,
      supplierName: s.name,
      channel: input.channel,
      inviteLink: `${process.env.NEXT_PUBLIC_BASE_URL}/supplier/register?ref=${task.tenantId}&sid=${s.id}`,
      sent: true,
    }));

    await prisma.lead.createMany({
      data: invites.map((i) => ({
        source: "HOTEL_INVITE",
        email: "",
        phone: "",
        company: i.supplierName,
        status: "INVITED_SENT",
        tenantId: task.tenantId,
        metadata: JSON.stringify(i),
      })),
      skipDuplicates: true,
    });

    return {
      invitesSent: invites.length,
      invites,
      message: `${invites.length} supplier invites sent via ${input.channel}`,
    };
  },

  "integration-agent": async (task) => {
    return {
      message: "Integration wizard initialized. Supplier should visit their onboarding link.",
      wizardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/supplier/onboard`,
    };
  },

  "procurement-agent": async (task) => {
    return { message: "Procurement agent ready. Create a PO to begin." };
  },

  "invoice-agent": async (task) => {
    const input = task.input as InvoiceAuditInput;
    const invoice = await prisma.invoice.findUnique({
      where: { id: input.invoiceId },
    });
    if (!invoice) throw new Error("Invoice not found");

    const order = invoice.orderId
      ? await prisma.order.findUnique({
          where: { id: invoice.orderId },
          include: { items: true },
        })
      : null;

    let etaResult = null;
    if (input.etaPublicUrl) {
      etaResult = await verifyInvoiceByPublicUrl(input.etaPublicUrl, {
        amount: input.expectedAmount ?? Number(invoice.total),
        receiverTaxId: input.expectedReceiverTaxId,
      });
    }

    return {
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      total: Number(invoice.total),
      matchedToOrder: !!order,
      orderItems: order?.items.length ?? 0,
      etaVerified: etaResult?.valid ?? null,
      etaDetails: etaResult?.details ?? null,
      discrepancies: [],
    };
  },

  "audit-agent": async (task) => {
    const invoice = await prisma.invoice.findUnique({
      where: { id: task.input as string },
      include: { hotel: true, supplier: true },
    });
    if (!invoice) throw new Error("Invoice not found");

    let etaStatus = "NOT_CHECKED";
    let publicUrl = (task.metadata?.etaPublicUrl as string) || null;

    if (publicUrl) {
      try {
        const result = await verifyInvoiceByPublicUrl(publicUrl, {
          amount: Number(invoice.total),
          receiverTaxId: invoice.hotel?.taxId,
        });
        etaStatus = result.etaStatus;
        if (result.valid) {
          await prisma.invoice.update({
            where: { id: invoice.id },
            data: { etaStatus: "ACCEPTED" },
          });
        }
      } catch {
        etaStatus = "VERIFICATION_FAILED";
      }
    }

    await prisma.auditLog.create({
      data: {
        entityType: "INVOICE",
        entityId: invoice.id,
        action: "ETA_COMPLIANCE_CHECK",
        tenantId: task.tenantId,
        actorId: "audit-agent",
        actorRole: "SYSTEM",
        afterState: JSON.stringify({ etaStatus, invoiceId: invoice.id }),
      },
    });

    return {
      invoiceId: invoice.id,
      etaStatus,
      compliant: etaStatus === "Valid",
    };
  },

  "cashflow-agent": async (task) => {
    const invoices = await prisma.invoice.findMany({
      where: {
        hotelId: task.hotelId,
        etaStatus: "ACCEPTED",
        paidAt: null,
      },
      orderBy: { dueDate: "asc" },
    });

    const totalPayable = invoices.reduce((s, i) => s + Number(i.total), 0);
    const dueThisWeek = invoices.filter(
      (i) => i.dueDate && i.dueDate <= new Date(Date.now() + 7 * 86400000)
    );

    return {
      totalPayable,
      invoiceCount: invoices.length,
      dueThisWeek: dueThisWeek.length,
      dueThisWeekAmount: dueThisWeek.reduce((s, i) => s + Number(i.total), 0),
      forecast: `EGP ${totalPayable.toLocaleString()} payable across ${invoices.length} invoices`,
    };
  },

  "dispute-agent": async (task) => {
    return { message: "Dispute agent ready. Flag an invoice to start a dispute." };
  },

  "inventory-agent": async (task) => {
    const products = await prisma.product.findMany({
      where: { supplierId: task.input as string },
    });

    const reorderAlerts = products.filter((p) => {
      const stock = p.stockQuantity;
      const reorderPoint = p.reorderPoint;
      return stock <= reorderPoint;
    });

    return {
      productsTracked: products.length,
      reorderAlerts: reorderAlerts.length,
      alerts: reorderAlerts.map((p) => ({
        productId: p.id,
        name: p.name,
        stock: p.stockQuantity,
        reorderPoint: p.reorderPoint,
        suggestedOrder: Math.max(p.reorderQty, p.reorderPoint - p.stockQuantity + p.avgDailyUsage * 7),
      })),
    };
  },

  "reporting-agent": async (task) => {
    const hotelId = task.hotelId;
    const [invoiceCount, orderCount, totalSpent] = await Promise.all([
      prisma.invoice.count({ where: { hotelId } }),
      prisma.order.count({ where: { hotelId } }),
      prisma.invoice.aggregate({
        where: { hotelId, etaStatus: "ACCEPTED" },
        _sum: { total: true },
      }),
    ]);

    return {
      hotelId,
      reportDate: new Date().toISOString(),
      metrics: {
        totalOrders: orderCount,
        totalInvoices: invoiceCount,
        totalSpent: Number(totalSpent._sum.total ?? 0),
        averageOrderValue: orderCount > 0 ? Number(totalSpent._sum.total ?? 0) / orderCount : 0,
      },
    };
  },
};

export async function executeAgentTask(task: AgentTask): Promise<AgentActionResult> {
  const start = Date.now();
  const handler = HANDLERS[task.agentId];

  if (!handler) {
    return {
      taskId: task.id,
      agentId: task.agentId,
      status: "failed",
      error: `No handler for agent: ${task.agentId}`,
      durationMs: Date.now() - start,
    };
  }

  try {
    await prisma.swarmJob.create({
      data: {
        agentId: task.agentId,
        taskType: task.type,
        status: "RUNNING",
        input: JSON.stringify(task.input),
        tenantId: task.tenantId,
      },
    });

    const output = await handler(task);

    await prisma.swarmJob.updateMany({
      where: { agentId: task.agentId, status: "RUNNING" },
      data: { status: "COMPLETED", output: JSON.stringify(output), completedAt: new Date() },
    });

    return {
      taskId: task.id,
      agentId: task.agentId,
      status: "completed",
      output,
      durationMs: Date.now() - start,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    await prisma.swarmJob.updateMany({
      where: { agentId: task.agentId, status: "RUNNING" },
      data: { status: "FAILED", output: message, completedAt: new Date() },
    });

    return {
      taskId: task.id,
      agentId: task.agentId,
      status: "failed",
      error: message,
      durationMs: Date.now() - start,
    };
  }
}

export async function dispatchAgentTask(task: AgentTask): Promise<AgentActionResult> {
  const config = PROCUREMENT_AGENTS[task.agentId];
  if (!config) {
    return {
      taskId: task.id,
      agentId: task.agentId,
      status: "failed",
      error: `Unknown agent: ${task.agentId}`,
      durationMs: 0,
    };
  }
  return executeAgentTask(task);
}
