/**
 * Unified Payment Router
 * Hotels Vendors Fintech Layer
 *
 * Exports all payment adapters behind a common interface.
 * Consumers should import from this file rather than individual adapters.
 */

// ─────────────────────────────────────────
// 1. ADAPTER EXPORTS
// ─────────────────────────────────────────

export { fawryAdapter } from "./fawry";
export { instapayAdapter } from "./instapay";
export { createDepositPayment, getTransactionStatus, paymobConfig } from "./paymob";
export type { DepositRequest } from "./paymob";

// ─────────────────────────────────────────
// 2. TYPE RE-EXPORTS
// ─────────────────────────────────────────

export type {
  FawryChargeRequest,
  FawryChargeResponse,
  FawryRefundRequest,
  FawryRefundResponse,
  FawryStatusResponse,
  FawryCallbackPayload,
} from "./fawry";

export type {
  InstaPayWallet,
  InstaPayTransferRequest,
  InstaPayTransferResponse,
  InstaPayValidateResponse,
  InstaPayBalanceResponse,
  InstaPayCallbackPayload,
} from "./instapay";

// ─────────────────────────────────────────
// 3. UNIFIED INTERFACE (optional consumer helper)
// ─────────────────────────────────────────

import { fawryAdapter } from "./fawry";
import { instapayAdapter } from "./instapay";
import { paymobConfig } from "./paymob";

export const paymentAdapters = {
  fawry: fawryAdapter,
  instapay: instapayAdapter,
  paymob: paymobConfig,
} as const;

export type PaymentProvider = keyof typeof paymentAdapters;

// ─────────────────────────────────────────
// 4. MOCK STATUS CHECK
// ─────────────────────────────────────────

export function isMockMode(provider: PaymentProvider): boolean {
  switch (provider) {
    case "fawry":
      return !process.env.FAWRY_MERCHANT_CODE || !process.env.FAWRY_SECRET || process.env.FAWRY_MOCK === "true";
    case "instapay":
      return !process.env.INSTAPAY_API_KEY || !process.env.INSTAPAY_SECRET || process.env.INSTAPAY_MOCK === "true";
    case "paymob":
      return !process.env.PAYMOB_API_KEY || paymobConfig.isTest;
    default:
      return true;
  }
}
