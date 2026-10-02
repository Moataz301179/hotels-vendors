
// Supplier Workflow Skeleton — evidence-based
// Based on Source B (v0.1.7-rc.2) supplier components + Source A business logic

export interface SupplierState {
  organizationVerified: boolean;
  catalogPublished: boolean;
  quoteSubmitted: boolean;
  quoteAccepted: boolean;
  fulfillmentStarted: boolean;
  deliveryConfirmed: boolean;
  invoiceIssued: boolean;
  invoiceReconciled: boolean;
  paymentReceived: boolean;
}

export const initialState: SupplierState = {
  organizationVerified: false,
  catalogPublished: false,
  quoteSubmitted: false,
  quoteAccepted: false,
  fulfillmentStarted: false,
  deliveryConfirmed: false,
  invoiceIssued: false,
  invoiceReconciled: false,
  paymentReceived: false,
};

export function nextSupplierStep(current: SupplierState): string {
  if (!current.organizationVerified) return "verify-organization";
  if (!current.catalogPublished) return "publish-catalog";
  if (!current.quoteSubmitted) return "submit-quote";
  if (!current.quoteAccepted) return "await-quote-acceptance";
  if (!current.fulfillmentStarted) return "start-fulfillment";
  if (!current.deliveryConfirmed) return "await-delivery-confirmation";
  if (!current.invoiceIssued) return "issue-invoice";
  if (!current.invoiceReconciled) return "reconcile-invoice";
  return "record-payment";
}
