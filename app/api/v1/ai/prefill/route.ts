/**
 * POST /api/v1/ai/prefill
 * Extract structured registration form fields from natural language input.
 * No auth required (used during registration). Rate-limited by IP.
 * Uses LLM with jsonMode to extract WizardData fields.
 */

import { NextRequest, NextResponse } from "next/server";
import { executeLLM } from "@/lib/ai/llm";
import { checkRateLimit } from "@/lib/redis";
import { z } from "zod";

const PrefillSchema = z.object({
  text: z.string().min(1).max(2000),
  role: z.enum(["hotel", "supplier", "funder", "logistics"]).optional(),
});

const EXTRACTION_PROMPT = `You are a registration assistant for HotelsVendors, Egypt's B2B hospitality procurement platform. Extract structured registration fields from the user's natural language input.

Return ONLY a JSON object with these fields (omit any that cannot be determined):
{
  "companyName": "string — the business/property name",
  "contactName": "string — the person's full name",
  "phone": "string — phone number with country code",
  "email": "string — email address",
  "city": "string — city in Egypt",
  "taxId": "string — Egyptian tax ID number",
  "commercialReg": "string — commercial registration number",
  "bankName": "string — bank name",
  "bankAccount": "string — bank account or IBAN",
  "subCategory": "string — business type subcategory",
  "capacity": "string — team size: Solo / 1 person, Small team (2–10), Medium (11–50), Large (51–200), Enterprise (200+)",
  "coverage": "string — coverage areas (for logistics)",
  "licenseNumber": "string — FRA license number (for funders)",
  "paymobMerchantId": "string — Paymob merchant ID",
  "supplyCategories": ["array of supply categories if supplier"]
}

Rules:
- Only include fields you can confidently extract or infer
- Normalize phone numbers to include +20 prefix if Egyptian
- For subCategory, pick the closest match from the role's known subcategories
- Return empty object {} if nothing can be extracted
- Do NOT include any explanation, only the JSON object`;

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIP = request.headers.get("x-real-ip");
  if (realIP) return realIP;
  return "unknown";
}

export async function POST(request: NextRequest) {
  // Rate limit: 10 prefill requests per hour per IP
  const ip = getClientIP(request);
  const rateLimit = await checkRateLimit(`ai:prefill:${ip}`, 3600, 10);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  const parsed = PrefillSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { text, role } = parsed.data;

  const roleContext = role ? `The user is registering as a ${role}.` : "The user's role is unknown.";

  const result = await executeLLM(
    EXTRACTION_PROMPT,
    `${roleContext}\n\nUser input: "${text}"`,
    { jsonMode: true, maxTokens: 1024, temperature: 0.2 }
  );

  let extracted: Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(result.content);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      extracted = parsed;
    }
  } catch {
    // LLM returned non-JSON, return empty
  }

  return NextResponse.json({
    success: true,
    data: {
      extracted,
      fieldsFound: Object.keys(extracted).length,
      provider: result.provider,
    },
  });
}
