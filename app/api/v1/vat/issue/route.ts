import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { ok, error } from "@/lib/api-response"
import crypto from "crypto"

const VAT_RATE = 0.14
const SERVICE_FEE_RATE = 0.01

type IssueItem = {
  description: string
  quantity: number
  unitPrice: number
  vatRate: number
}

function generateEtaUuid(payload: object): string {
  const hash = crypto.createHash("sha256")
  hash.update(JSON.stringify(payload) + Date.now().toString())
  return hash.digest("hex")
}

function generateInvoiceRef(): string {
  const prefix = "VAT"
  const ts = Date.now().toString(36).toUpperCase()
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase()
  return `${prefix}-${ts}-${rand}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      companyTaxId,
      buyerName,
      buyerTaxId,
      items,
      notes,
    } = body as {
      companyTaxId: string
      buyerName: string
      buyerTaxId: string
      items: IssueItem[]
      notes?: string
    }

    if (!companyTaxId || !buyerName || !buyerTaxId || !items?.length) {
      return error("Missing required fields: companyTaxId, buyerName, buyerTaxId, items")
    }

    // Calculate amounts
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    )

    const vatAmount = Math.round(subtotal * VAT_RATE * 100) / 100
    const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE * 100) / 100
    const total = subtotal + vatAmount + serviceFee

    // Generate identifiers
    const etaPayload = {
      companyTaxId,
      buyerName,
      buyerTaxId,
      items,
      subtotal,
      vatAmount,
      total,
      timestamp: new Date().toISOString(),
    }
    const etaUuid = generateEtaUuid(etaPayload)
    const invoiceRef = generateInvoiceRef()

    // Simulate ETA submission — store record in DB
    const invoice = await prisma.invoice.create({
      data: {
        id: etaUuid,
        invoiceNumber: invoiceRef,
        etaUuid,
        subtotal,
        vatRate: 14,
        vatAmount,
        total,
        status: "ISSUED" as any,
        paymentStatus: "UNPAID" as any,
        orderId: "VAT-STANDALONE",
        hotelId: "VAT-STANDALONE",
        supplierId: "VAT-STANDALONE",
        tenantId: "VAT-STANDALONE",
        issueDate: new Date(),
        updatedAt: new Date(),
        etaResponse: {
          submissionId: `ETA-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
          submittedAt: new Date().toISOString(),
          status: "ACCEPTED",
        },
      },
    })

    const etaResponse = invoice.etaResponse as Record<string, unknown> | null

    return ok({
      success: true,
      etaUuid,
      invoiceRef,
      subtotal,
      vatAmount,
      serviceFee,
      total,
      etaSubmissionId: etaResponse?.submissionId || undefined,
      submittedAt: new Date().toISOString(),
    })
  } catch (e) {
    console.error("Invoice issue error:", e)
    return error("Internal server error")
  }
}
