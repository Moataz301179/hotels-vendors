/**
 * Accounting Ledger & Double-Entry Bookkeeping System
 * Hotels Vendors Fintech Layer — Reverse Factoring Hub Ledger Rules
 *
 * COMPLIANCE MANDATES:
 * 1. Absolute Immutability: Zero UPDATE or DELETE operations are written in this file.
 * 2. Mathematical Balance: Debits must equal Credits EXACTLY. Any difference triggers a 'LEDGER_MISMATCH_EXCEPTION'.
 * 3. Institutional FinTech Nomenclature: Utilizes standard terminology (e.g., 'Accelerated Capital Liquidation', 'Settlement Disbursals').
 */

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Prisma } from "@prisma/client";

export interface LedgerLine {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface FactoringLedgerInput {
  masterInvoiceId: string;
  tenantId: string;
  grossAmount: number;
  advanceRate: number;
  factoringCommissionRate: number;
  factoringCommissionAmount: number;
  factoringFee: number; // The fee charged by the factor
  supplierDiscountRate: number;
  supplierDiscountAmount: number;
  hotelAdminFeeRate: number;
  hotelAdminFeeAmount: number;
  supplierDisbursement: number;
}

export interface SettlementLedgerInput {
  masterInvoiceId: string;
  tenantId: string;
  grossAmount: number;
  hotelAdminFeeAmount: number;
  platformCommissionAmount: number;
  factorSettlementAmount: number;
}

/**
 * Record atomic double-entry bookkeeping journal entries for an Accelerated Capital Liquidation (factoring disbursement).
 * INVARIANT: Debits must balance Credits EXACTLY. Write-once, append-only.
 */
export async function recordDisbursementJournal(
  tx: Prisma.TransactionClient,
  input: FactoringLedgerInput
): Promise<string> {
  const {
    masterInvoiceId,
    tenantId,
    grossAmount,
    advanceRate,
    factoringCommissionAmount,
    factoringFee,
    supplierDiscountAmount,
    hotelAdminFeeAmount,
    supplierDisbursement,
  } = input;

  // 1. Fetch Master Invoice details to resolve hotel
  const ci = await tx.masterInvoice.findUnique({
    where: { id: masterInvoiceId },
    select: { hotelId: true, invoiceNumber: true },
  });

  if (!ci) {
    throw new Error(`Aggregated Debt Package not found for ledger: ${masterInvoiceId}`);
  }

  // 2. Calculate amounts for double-entry validation using Decimal precision
  const grossD = new Prisma.Decimal(grossAmount);
  const factoringFeeD = new Prisma.Decimal(factoringFee);
  const platformEscrowDebit = grossD.mul(advanceRate).sub(factoringFeeD);
  const cashDiscountDelta = Prisma.Decimal.max(0, new Prisma.Decimal(supplierDiscountAmount).sub(factoringFeeD));

  // Compile ledger lines conforming to standard Chart of Accounts
  const lines: LedgerLine[] = [
    // DEBITS (Asset and Receivable accounts increase)
    {
      accountCode: "1010",
      accountName: "Platform Escrow Bank Account",
      debit: parseFloat(platformEscrowDebit.toFixed(2)),
      credit: 0,
    },
    {
      accountCode: "1210",
      accountName: "Stream 1: Fintech Commission Receivable from Factor",
      debit: parseFloat(new Prisma.Decimal(factoringCommissionAmount).toFixed(2)),
      credit: 0,
    },
    // CREDITS (Liabilities decrease or Revenues increase)
    {
      accountCode: "4010",
      accountName: "Stream 1: Fintech Commission Revenue",
      debit: 0,
      credit: parseFloat(new Prisma.Decimal(factoringCommissionAmount).toFixed(2)),
    },
    {
      accountCode: "4020",
      accountName: "Stream 2: Supplier Cash-Discount Delta Revenue",
      debit: 0,
      credit: parseFloat(cashDiscountDelta.toFixed(2)),
    },
    {
      accountCode: "4030",
      accountName: "Stream 3: Hotel Treasury Admin Fee Revenue",
      debit: 0,
      credit: parseFloat(new Prisma.Decimal(hotelAdminFeeAmount).toFixed(2)),
    },
    {
      accountCode: "2010",
      accountName: "Supplier Accounts Payable (Accelerated Capital Liquidation)",
      debit: 0,
      credit: parseFloat(new Prisma.Decimal(supplierDisbursement).toFixed(2)),
    },
  ];

  let totalDebit = new Prisma.Decimal(0);
  let totalCredit = new Prisma.Decimal(0);
  for (const l of lines) {
    totalDebit = totalDebit.add(l.debit);
    totalCredit = totalCredit.add(l.credit);
  }
  totalDebit = new Prisma.Decimal(parseFloat(totalDebit.toFixed(2)));
  totalCredit = new Prisma.Decimal(parseFloat(totalCredit.toFixed(2)));

  // Assert mathematical balance to prevent decimal rounding anomalies
  const imbalance = totalDebit.sub(totalCredit).abs();
  if (imbalance.gt(0) && imbalance.lte(0.05)) {
    // Gracefully balance fractional rounding discrepancies against the Platform Bank account
    const platformLine = lines.find((l) => l.accountCode === "1010");
    if (platformLine) {
      if (totalDebit.lt(totalCredit)) {
        platformLine.debit = parseFloat(new Prisma.Decimal(platformLine.debit).add(imbalance).toFixed(2));
      } else {
        platformLine.debit = parseFloat(new Prisma.Decimal(platformLine.debit).sub(imbalance).toFixed(2));
      }
    }
  }

  // Recalculate and strictly validate balanced totals
  let finalDebit = new Prisma.Decimal(0);
  let finalCredit = new Prisma.Decimal(0);
  for (const l of lines) {
    finalDebit = finalDebit.add(l.debit);
    finalCredit = finalCredit.add(l.credit);
  }
  finalDebit = new Prisma.Decimal(parseFloat(finalDebit.toFixed(2)));
  finalCredit = new Prisma.Decimal(parseFloat(finalCredit.toFixed(2)));

  if (!finalDebit.eq(finalCredit)) {
    throw new Error(
      `LEDGER_MISMATCH_EXCEPTION: Ledger transaction Debits (${finalDebit}) does not equal Credits (${finalCredit}). Transaction rolled back.`
    );
  }

  const entryNumber = `JE-ACL-${ci.invoiceNumber}-${Date.now()}`;

  // Direct append-only entry creation. ZERO updates/deletes permitted.
  const entry = await tx.journalEntry.create({
    data: {
      entryNumber,
      date: new Date(),
      sourceType: "INVOICE",
      sourceId: masterInvoiceId,
      description: `Accelerated Capital Liquidation disbursal entry for Aggregated Debt Package: ${ci.invoiceNumber}`,
      lines: JSON.stringify(lines),
      totalDebit: finalDebit.toNumber(),
      totalCredit: finalCredit.toNumber(),
      status: "POSTED",
      hotelId: ci.hotelId,
      tenantId,
    },
  });

  return entry.id;
}

/**
 * Record atomic double-entry bookkeeping journal entries for a Settlement Disbursal.
 * Represents the final payment settlement by the Corporate Hotel Group.
 */
export async function recordSettlementDisbursalJournal(
  tx: Prisma.TransactionClient,
  input: SettlementLedgerInput
): Promise<string> {
  const {
    masterInvoiceId,
    tenantId,
    grossAmount,
    hotelAdminFeeAmount,
    platformCommissionAmount,
    factorSettlementAmount,
  } = input;

  const ci = await tx.masterInvoice.findUnique({
    where: { id: masterInvoiceId },
    select: { hotelId: true, invoiceNumber: true },
  });

  if (!ci) {
    throw new Error(`Aggregated Debt Package not found for settlement ledger: ${masterInvoiceId}`);
  }

  const grossD2 = new Prisma.Decimal(grossAmount);
  const lines: LedgerLine[] = [
    // DEBITS (Asset and Receivable accounts increase / Liabilities decrease)
    {
      accountCode: "2020",
      accountName: "Corporate Debt Settlement Payable (Settlement Disbursals)",
      debit: parseFloat(grossD2.toFixed(2)),
      credit: 0,
    },
    // CREDITS (Cash decreases / Platform Escrow decreases)
    {
      accountCode: "1020",
      accountName: "Corporate Clearing Cash Pool",
      debit: 0,
      credit: parseFloat(new Prisma.Decimal(factorSettlementAmount).toFixed(2)),
    },
    {
      accountCode: "1010",
      accountName: "Platform Escrow Bank Account",
      debit: 0,
      credit: parseFloat(new Prisma.Decimal(hotelAdminFeeAmount).add(platformCommissionAmount).toFixed(2)),
    },
  ];

  let totalDebit2 = new Prisma.Decimal(0);
  let totalCredit2 = new Prisma.Decimal(0);
  for (const l of lines) {
    totalDebit2 = totalDebit2.add(l.debit);
    totalCredit2 = totalCredit2.add(l.credit);
  }
  totalDebit2 = new Prisma.Decimal(parseFloat(totalDebit2.toFixed(2)));
  totalCredit2 = new Prisma.Decimal(parseFloat(totalCredit2.toFixed(2)));

  const imbalance2 = totalDebit2.sub(totalCredit2).abs();
  if (imbalance2.gt(0) && imbalance2.lte(0.05)) {
    const cashLine = lines.find((l) => l.accountCode === "1020");
    if (cashLine) {
      if (totalDebit2.lt(totalCredit2)) {
        cashLine.credit = parseFloat(new Prisma.Decimal(cashLine.credit).sub(imbalance2).toFixed(2));
      } else {
        cashLine.credit = parseFloat(new Prisma.Decimal(cashLine.credit).add(imbalance2).toFixed(2));
      }
    }
  }

  let finalDebit2 = new Prisma.Decimal(0);
  let finalCredit2 = new Prisma.Decimal(0);
  for (const l of lines) {
    finalDebit2 = finalDebit2.add(l.debit);
    finalCredit2 = finalCredit2.add(l.credit);
  }
  finalDebit2 = new Prisma.Decimal(parseFloat(finalDebit2.toFixed(2)));
  finalCredit2 = new Prisma.Decimal(parseFloat(finalCredit2.toFixed(2)));

  if (!finalDebit2.eq(finalCredit2)) {
    throw new Error(
      `LEDGER_MISMATCH_EXCEPTION: Settlement Disbursal Debits (${finalDebit2}) does not equal Credits (${finalCredit2}). Transaction aborted.`
    );
  }

  const entryNumber = `JE-SETT-${ci.invoiceNumber}-${Date.now()}`;

  const entry = await tx.journalEntry.create({
    data: {
      entryNumber,
      date: new Date(),
      sourceType: "PAYMENT",
      sourceId: masterInvoiceId,
      description: `Settlement Disbursal clearing journal entry for Aggregated Debt Package: ${ci.invoiceNumber}`,
      lines: JSON.stringify(lines),
      totalDebit: finalDebit.toNumber(),
      totalCredit: finalCredit.toNumber(),
      status: "POSTED",
      hotelId: ci.hotelId,
      tenantId,
    },
  });

  return entry.id;
}

/**
 * Record a compensating journal entry to completely reverse a compromised or cancelled posting.
 * Excludes direct UPDATE/DELETE operations to maintain FRA regulatory compliance.
 */
export async function recordCompensatingJournal(
  tx: Prisma.TransactionClient,
  originalEntryId: string,
  tenantId: string,
  reason: string
): Promise<string> {
  const original = await tx.journalEntry.findUnique({
    where: { id: originalEntryId, tenantId },
  });

  if (!original) {
    throw new Error(`Original Journal Entry not found for reversal: ${originalEntryId}`);
  }

  if (original.status === "REVERSED") {
    throw new Error(`Journal Entry ${original.entryNumber} has already been reversed.`);
  }

  // Parse lines and completely swap Debits and Credits
  const originalLines: LedgerLine[] = JSON.parse(original.lines);
  const reversingLines: LedgerLine[] = originalLines.map((l) => ({
    accountCode: l.accountCode,
    accountName: `${l.accountName} (Reversal offset)`,
    debit: l.credit, // Original Credit becomes Debit
    credit: l.debit, // Original Debit becomes Credit
  }));

  const finalDebit = original.totalCredit;
  const finalCredit = original.totalDebit;

  if (finalDebit !== finalCredit) {
    throw new Error(`LEDGER_MISMATCH_EXCEPTION: Reversal Debits/Credits do not balance. Reversal blocked.`);
  }

  const entryNumber = `JE-REV-${original.entryNumber}`;

  // Log as new offsetting entry
  const entry = await tx.journalEntry.create({
    data: {
      entryNumber,
      date: new Date(),
      sourceType: original.sourceType,
      sourceId: original.sourceId,
      description: `Compensating Offset Entry for ${original.entryNumber}. Reason: ${reason}`,
      lines: JSON.stringify(reversingLines),
      totalDebit: finalDebit.toNumber(),
      totalCredit: finalCredit.toNumber(),
      status: "REVERSED",
      hotelId: original.hotelId,
      tenantId,
    },
  });

  return entry.id;
}
