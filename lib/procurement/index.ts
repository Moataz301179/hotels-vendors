
// Procurement Transaction Spine — evidence-based skeleton
// Based on mission directive: demand -> purchase/RFQ -> supplier response -> comparison -> approval -> PO -> confirmation -> fulfillment -> delivery -> receiving -> discrepancy -> invoice -> reconciliation -> authorized payment -> settlement -> intelligence

export interface ProcurementState {
  demandDetected: boolean;
  requisitionCreated: boolean;
  rfqIssued: boolean;
  supplierResponseReceived: boolean;
  comparisonCompleted: boolean;
  approvalGranted: boolean;
  purchaseOrderConfirmed: boolean;
  fulfillmentStarted: boolean;
  deliveryConfirmed: boolean;
  receivingVerified: boolean;
  discrepancyHandled: boolean;
  invoiceReconciled: boolean;
  paymentAuthorized: boolean;
  settlementRecorded: boolean;
  intelligenceOutcome: boolean;
}

export const initialState: ProcurementState = {
  demandDetected: false,
  requisitionCreated: false,
  rfqIssued: false,
  supplierResponseReceived: false,
  comparisonCompleted: false,
  approvalGranted: false,
  purchaseOrderConfirmed: false,
  fulfillmentStarted: false,
  deliveryConfirmed: false,
  receivingVerified: false,
  discrepancyHandled: false,
  invoiceReconciled: false,
  paymentAuthorized: false,
  settlementRecorded: false,
  intelligenceOutcome: false,
};

export function nextRequiredStep(current: ProcurementState): string {
  if (!current.demandDetected) return "detect-demand";
  if (!current.requisitionCreated) return "create-requisition";
  if (!current.rfqIssued) return "issue-rfq";
  if (!current.supplierResponseReceived) return "await-supplier-response";
  if (!current.comparisonCompleted) return "compare-quotes";
  if (!current.approvalGranted) return "await-approval";
  if (!current.purchaseOrderConfirmed) return "confirm-po";
  if (!current.fulfillmentStarted) return "start-fulfillment";
  if (!current.deliveryConfirmed) return "await-delivery";
  if (!current.receivingVerified) return "verify-receiving";
  if (!current.discrepancyHandled) return "handle-discrepancy";
  if (!current.invoiceReconciled) return "reconcile-invoice";
  if (!current.paymentAuthorized) return "authorize-payment";
  if (!current.settlementRecorded) return "record-settlement";
  return "generate-intelligence";
}
