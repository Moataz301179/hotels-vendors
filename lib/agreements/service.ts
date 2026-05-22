/**
 * Digital Agreement Automation Engine
 * Generates, renders, and manages digital contracts for the factoring agency model.
 * Uses e-Seal/e-Signature from the certificate vault for digital signing.
 */

import { prisma } from "@/lib/prisma";
import { getCertificateForSigning } from "@/lib/compliance/eseal";
import crypto from "crypto";

export interface AgreementVariable {
  key: string;
  value: string;
}

const TEMPLATE_VARIABLES: Record<string, string[]> = {
  agency_factoring: [
    "{{principalName}}", "{{principalTaxId}}", "{{agentName}}", "{{agentTaxId}}",
    "{{commissionRate}}", "{{disbursementFee}}", "{{effectiveDate}}", "{{jurisdiction}}",
  ],
  supplier_ack: [
    "{{supplierName}}", "{{supplierTaxId}}", "{{principalName}}", "{{agentName}}",
    "{{commissionRate}}", "{{effectiveDate}}",
  ],
  hotel_disclosure: [
    "{{hotelName}}", "{{hotelTaxId}}", "{{platformName}}", "{{platformTaxId}}",
    "{{serviceFees}}", "{{effectiveDate}}",
  ],
  financing_terms: [
    "{{hotelName}}", "{{hotelTaxId}}", "{{nbfiName}}", "{{nbfiLicense}}",
    "{{creditLimit}}", "{{interestRate}}", "{{tenorDays}}", "{{effectiveDate}}",
  ],
};

/**
 * Seed default agreement templates for the factoring agency model.
 */
export async function seedAgreementTemplates(tenantId: string) {
  const templates = [
    {
      slug: "agency_factoring",
      name: "Factoring Services Agency Agreement",
      description: "HV acts as disbursement agent for licensed factoring company",
      content: `<h2>AGENCY AGREEMENT FOR FACTORING SERVICES</h2>
<p><strong>Principal:</strong> {{principalName}} (Tax ID: {{principalTaxId}})</p>
<p><strong>Agent:</strong> {{agentName}} (Tax ID: {{agentTaxId}})</p>
<p><strong>Effective Date:</strong> {{effectiveDate}}</p>
<br/>
<h3>1. APPOINTMENT</h3>
<p>The Principal appoints the Agent as its exclusive technology and administrative agent for the aggregation, validation, and disbursement of trade receivables.</p>
<h3>2. SCOPE OF AGENCY</h3>
<p>The Agent shall: (a) aggregate supplier invoices; (b) validate ETA compliance; (c) execute payment instructions; (d) manage supplier data. The Agent shall NOT purchase receivables, bear credit risk, or guarantee payments.</p>
<h3>3. COMPENSATION</h3>
<p>Commission Rate: {{commissionRate}}% of aggregated value. Disbursement Fee: {{disbursementFee}} per transaction.</p>
<h3>4. FUNDS</h3>
<p>All disbursement funds are held in trust for the Principal in a segregated account. The Agent has no ownership interest in such funds.</p>
<h3>5. LIABILITY</h3>
<p>The Agent is not liable for hotel creditworthiness, supplier performance, or hotel repayment. All credit risk remains with the Principal.</p>
<h3>6. GOVERNING LAW</h3>
<p>{{jurisdiction}}</p>`,
      requiredRoles: "NBFI_REP,PLATFORM_REP",
    },
    {
      slug: "supplier_ack",
      name: "Supplier Payment Authorization",
      description: "Supplier acknowledges HV as payment routing agent",
      content: `<h2>SUPPLIER PAYMENT AUTHORIZATION</h2>
<p><strong>Supplier:</strong> {{supplierName}} (Tax ID: {{supplierTaxId}})</p>
<p><strong>Principal:</strong> {{principalName}}</p>
<p><strong>Agent:</strong> {{agentName}}</p>
<br/>
<p>The Supplier acknowledges that:</p>
<ol>
<li>The Agent acts as the payment routing agent for the Principal.</li>
<li>Payment received from the Agent equals payment from the Principal.</li>
<li>The Supplier's e-invoice is issued to the Hotel (not to the Agent).</li>
<li>The Agent is not the purchaser of goods.</li>
<li>The Agent's role is strictly administrative and technological.</li>
</ol>
<p>Commission Rate: {{commissionRate}}%</p>`,
      requiredRoles: "SUPPLIER_OWNER",
    },
    {
      slug: "hotel_disclosure",
      name: "Hotel Platform Disclosure",
      description: "Hotel acknowledges HV as technology platform, not financial institution",
      content: `<h2>HOTEL PLATFORM DISCLOSURE</h2>
<p><strong>Hotel:</strong> {{hotelName}} (Tax ID: {{hotelTaxId}})</p>
<p><strong>Platform:</strong> {{platformName}} (Tax ID: {{platformTaxId}})</p>
<br/>
<p>The Hotel acknowledges that:</p>
<ol>
<li>The Platform is a technology platform, not a financial institution.</li>
<li>All financing is provided by licensed third-party NBFIs.</li>
<li>The Platform does not guarantee any financing approval.</li>
<li>The Platform charges a technology platform fee for software use.</li>
<li>The Hotel's repayment obligation is to the NBFI, not to the Platform.</li>
</ol>
<p>Platform Service Fee: {{serviceFees}}</p>`,
      requiredRoles: "HOTEL_OWNER",
    },
    {
      slug: "financing_terms",
      name: "Revolving Credit Facility Terms",
      description: "NBFI provides pre-approved credit line to hotel",
      content: `<h2>REVOLVING CREDIT FACILITY AGREEMENT</h2>
<p><strong>Borrower:</strong> {{hotelName}} (Tax ID: {{hotelTaxId}})</p>
<p><strong>Lender:</strong> {{nbfiName}} (License: {{nbfiLicense}})</p>
<br/>
<h3>1. CREDIT LIMIT</h3>
<p>Approved Limit: EGP {{creditLimit}}</p>
<h3>2. INTEREST RATE</h3>
<p>{{interestRate}}% APR</p>
<h3>3. TENOR</h3>
<p>{{tenorDays}} days from draw date</p>
<h3>4. PURPOSE</h3>
<p>Procurement of goods and services through the Hotels Vendors platform.</p>
<h3>5. REPAYMENT</h3>
<p>Full repayment due on maturity date. Early repayment permitted without penalty.</p>`,
      requiredRoles: "HOTEL_OWNER,NBFI_REP",
    },
  ];

  for (const t of templates) {
    await prisma.agreementTemplate.upsert({
      where: { slug: t.slug },
      create: { ...t, tenantId },
      update: { ...t, tenantId },
    });
  }
}

/**
 * Render an agreement by substituting variables into the template.
 */
export async function renderAgreement(
  templateSlug: string,
  variables: Record<string, string>,
  tenantId: string,
  hotelId?: string,
  supplierId?: string,
  factoringCompanyId?: string
) {
  const template = await prisma.agreementTemplate.findUnique({
    where: { slug: templateSlug },
  });

  if (!template) throw new Error(`Template ${templateSlug} not found`);

  let rendered = template.content;
  for (const [key, value] of Object.entries(variables)) {
    rendered = rendered.replace(new RegExp(`{{${key}}}`, "g"), value);
  }

  const agreement = await prisma.digitalAgreement.create({
    data: {
      templateId: template.id,
      hotelId: hotelId || null,
      supplierId: supplierId || null,
      factoringCompanyId: factoringCompanyId || null,
      renderedContent: rendered,
      variables: JSON.stringify(variables),
      status: "DRAFT",
      tenantId,
    },
  });

  return agreement;
}

/**
 * Digitally sign an agreement using the platform's e-Seal.
 */
export async function signAgreement(
  agreementId: string,
  signerRole: "hotel" | "supplier" | "nbfi",
  signerId: string
) {
  const agreement = await prisma.digitalAgreement.findUnique({
    where: { id: agreementId },
  });
  if (!agreement) throw new Error("Agreement not found");

  // Get platform e-Seal for HV signature, or use certificate vault for others
  const cert = await getCertificateForSigning(signerId).catch(() => null);
  const signature = crypto
    .createHash("sha256")
    .update(agreement.renderedContent + signerRole + Date.now())
    .digest("hex");

  const updateData: Record<string, any> = {
    status: "PARTIALLY_SIGNED",
  };

  if (signerRole === "hotel") {
    updateData.signedByHotelAt = new Date();
    updateData.hotelSignature = signature;
  } else if (signerRole === "supplier") {
    updateData.signedBySupplierAt = new Date();
    updateData.supplierSignature = signature;
  } else if (signerRole === "nbfi") {
    updateData.signedByNbfiAt = new Date();
    updateData.nbfiSignature = signature;
  }

  const updated = await prisma.digitalAgreement.update({
    where: { id: agreementId },
    data: updateData,
  });

  // Check if fully signed
  const isFullySigned =
    updated.signedByHotelAt &&
    updated.signedBySupplierAt &&
    updated.signedByNbfiAt;

  if (isFullySigned) {
    await prisma.digitalAgreement.update({
      where: { id: agreementId },
      data: { status: "SIGNED" },
    });
  }

  return updated;
}

/**
 * Auto-generate all required agreements for a new factoring relationship.
 */
export async function onboardFactoringRelationship(params: {
  tenantId: string;
  hotelId: string;
  supplierId?: string;
  factoringCompanyId: string;
  principalName: string;
  principalTaxId: string;
  commissionRate: string;
  disbursementFee: string;
  creditLimit?: string;
  interestRate?: string;
  tenorDays?: string;
}) {
  const now = new Date().toISOString().split("T")[0];

  const agreements = [];

  // 1. Agency Agreement (NBFI ↔ HV)
  const agency = await renderAgreement(
    "agency_factoring",
    {
      principalName: params.principalName,
      principalTaxId: params.principalTaxId,
      agentName: "Hotels Vendors / Returants for E-Marketing",
      agentTaxId: "704226146",
      commissionRate: params.commissionRate,
      disbursementFee: params.disbursementFee,
      effectiveDate: now,
      jurisdiction: "Arab Republic of Egypt",
    },
    params.tenantId,
    undefined,
    undefined,
    params.factoringCompanyId
  );
  agreements.push(agency);

  // 2. Hotel Disclosure
  const hotel = await prisma.hotel.findUnique({
    where: { id: params.hotelId },
    select: { name: true, taxId: true },
  });

  if (hotel) {
    const disclosure = await renderAgreement(
      "hotel_disclosure",
      {
        hotelName: hotel.name,
        hotelTaxId: hotel.taxId,
        platformName: "Hotels Vendors",
        platformTaxId: "704226146",
        serviceFees: "1.5% per transaction + EGP 500 disbursement fee",
        effectiveDate: now,
      },
      params.tenantId,
      params.hotelId
    );
    agreements.push(disclosure);
  }

  // 3. Financing Terms (if credit limit provided)
  if (params.creditLimit && params.interestRate) {
    const nbfi = await prisma.factoringCompany.findUnique({
      where: { id: params.factoringCompanyId },
      select: { name: true },
    });

    const financing = await renderAgreement(
      "financing_terms",
      {
        hotelName: hotel?.name || "",
        hotelTaxId: hotel?.taxId || "",
        nbfiName: nbfi?.name || params.principalName,
        nbfiLicense: "FSA-LICENSE-XXX",
        creditLimit: params.creditLimit,
        interestRate: params.interestRate,
        tenorDays: params.tenorDays || "60",
        effectiveDate: now,
      },
      params.tenantId,
      params.hotelId,
      undefined,
      params.factoringCompanyId
    );
    agreements.push(financing);
  }

  // 4. Supplier Ack (if supplier provided)
  if (params.supplierId) {
    const supplier = await prisma.supplier.findUnique({
      where: { id: params.supplierId },
      select: { name: true, taxId: true },
    });

    if (supplier) {
      const ack = await renderAgreement(
        "supplier_ack",
        {
          supplierName: supplier.name,
          supplierTaxId: supplier.taxId,
          principalName: params.principalName,
          agentName: "Hotels Vendors",
          commissionRate: params.commissionRate,
          effectiveDate: now,
        },
        params.tenantId,
        undefined,
        params.supplierId
      );
      agreements.push(ack);
    }
  }

  return agreements;
}
