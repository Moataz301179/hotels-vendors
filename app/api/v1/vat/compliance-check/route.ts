import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { validateTaxId } from "@/lib/tax-id"
import { ok, error } from "@/lib/api-response"

const VALID_VAT_RATES = [14, 5, 0, 10, 8]
const HIGH_AMOUNT_THRESHOLD = 100_000

type CheckItem = {
  description: string
  quantity: number
  unitPrice: number
  vatRate: number
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      companyTaxId,
      companyName,
      commercialRegister,
      vatRegistration,
      invoiceAmount,
      items,
    } = body as {
      companyTaxId: string
      companyName: string
      commercialRegister?: string
      vatRegistration?: string
      invoiceAmount: number
      items: CheckItem[]
    }

    if (!companyTaxId || !companyName || invoiceAmount === undefined || !items) {
      return error("Missing required fields: companyTaxId, companyName, invoiceAmount, items")
    }

    const issues: string[] = []
    let riskScore: "low" | "medium" | "high" = "low"

    // 1. Tax ID format validation
    const taxIdCheck = validateTaxId(companyTaxId)
    if (!taxIdCheck.valid) {
      issues.push(taxIdCheck.message || "Invalid Tax ID format")
    }

    // 2. VAT registration status (mock - query Prisma for existing user, else mock valid)
    const existingUser = await prisma.user.findFirst({
      where: { taxId: companyTaxId },
    })
    if (!existingUser) {
      issues.push("Company not found in our system. VAT registration could not be verified automatically.")
    }

    // 3. Amount threshold check
    const amountNum = Number(invoiceAmount)
    if (isNaN(amountNum) || amountNum <= 0) {
      issues.push("Invoice amount must be a positive number")
    } else if (amountNum > HIGH_AMOUNT_THRESHOLD) {
      issues.push(`Invoice exceeds EGP ${HIGH_AMOUNT_THRESHOLD.toLocaleString()} threshold — additional approval required`)
    }

    // 4. Item-level VAT rate validation
    if (!items || items.length === 0) {
      issues.push("At least one line item is required")
    } else {
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (!VALID_VAT_RATES.includes(item.vatRate)) {
          issues.push(
            `Item #${i + 1} ("${item.description || "Unnamed"}") has invalid VAT rate ${item.vatRate}%. Valid rates: ${VALID_VAT_RATES.join(", ")}%`
          )
        }
        if (!item.description?.trim()) {
          issues.push(`Item #${i + 1} is missing a description`)
        }
        if (item.quantity <= 0) {
          issues.push(`Item #${i + 1} has invalid quantity: ${item.quantity}`)
        }
        if (item.unitPrice < 0) {
          issues.push(`Item #${i + 1} has negative unit price: ${item.unitPrice}`)
        }
      }
    }

    // Determine risk score based on issues
    if (issues.length > 3) {
      riskScore = "high"
    } else if (issues.length > 1) {
      riskScore = "medium"
    }

    // Calculate max allowed (if amount exceeds threshold, max is threshold)
    const maxAllowed = amountNum > HIGH_AMOUNT_THRESHOLD ? HIGH_AMOUNT_THRESHOLD : amountNum

    const etaCompliant =
      issues.length === 0 ||
      (issues.length === 1 && issues[0].includes("additional approval required"))

    return ok({
      compliant: issues.length === 0,
      issues,
      maxAllowed,
      riskScore,
      etaCompliant,
    })
  } catch (e) {
    console.error("Compliance check error:", e)
    return error("Internal server error")
  }
}
