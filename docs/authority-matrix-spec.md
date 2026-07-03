# Authority Matrix Specification v2.0
## Hotels Vendors — Payment Guarantee Enforcement
**Version:** 2.0 | **Date:** 2026-05-01 | **Status:** APPROVED FOR IMPLEMENTATION

---

## 1. THE GOLDEN RULE

> **No order may transition to `CONFIRMED`, `IN_TRANSIT`, or `DELIVERED` without a `PaymentGuaranteed` flag set to `true`.**

This rule is **absolute**. It overrides all other authority rules. Even the platform admin cannot bypass it without triggering an escalated alert and dual-authorization audit log entry.

---

## 2. AUTHORITY RULE DIMENSIONS

The Authority Matrix evaluates orders across **6 dimensions**:

| Dimension | Model Field | Type | Description |
|-----------|-------------|------|-------------|
| `orderValue` | `Order.total` | Float | Total order value in EGP |
| `hotelRiskTier` | `Hotel.riskTier` | Enum | LOW, MEDIUM, HIGH, CRITICAL |
| `hotelTier` | `Hotel.tier` | Enum | CORE, PREMIER, COASTAL |
| `supplierTier` | `Supplier.tier` | Enum | CORE, PREMIER, COASTAL, VERIFIED |
| `requesterRole` | `User.role` | Enum | OWNER, REGIONAL_GM, GM, FINANCIAL_CONTROLLER, DEPARTMENT_HEAD, CLERK |
| `paymentGuarantee` | `Order.paymentGuaranteed` | Boolean | True = payment secured |
| `etaStatus` | `Invoice.etaStatus` | Enum | PENDING, SUBMITTING, ACCEPTED, REJECTED |
| `factoringStatus` | `Invoice.factoringStatus` | Enum | NOT_FACTORABLE, AVAILABLE, OFFERED, ACCEPTED |

---

## 3. RULE EVALUATION ENGINE

### 3.1 Rule Precedence

Rules are evaluated in **priority order** (highest first). The first matching rule wins.

```typescript
interface AuthorityRule {
  id: string;
  name: string;
  priority: number; // Higher = evaluated first
  
  // Dimensions (null/undefined = "any")
  minValue: number;
  maxValue: number;
  hotelRiskTier?: RiskTier;
  hotelTier?: HotelTier;
  supplierTier?: SupplierTier;
  requesterRole?: UserRole;
  
  // Conditions
  requiresPaymentGuarantee: boolean;
  requiresEtaValidation: boolean;
  requiresDualSignOff: boolean;
  
  // Action
  action: AuthorityAction;
  routeToRole?: UserRole; // If action = ROUTE_TO_X
  
  // Scope
  tenantId?: string; // null = global platform rule
  isActive: boolean;
}
```

### 3.2 Built-in Rules (Platform Global)

| Priority | Name | Conditions | Action |
|----------|------|------------|--------|
| 1000 | **CRITICAL Risk Block** | `hotelRiskTier = CRITICAL` AND `paymentGuaranteed = false` | `REJECT` |
| 950 | **ETA Invalid Block** | `requiresEtaValidation = true` AND `etaStatus ≠ ACCEPTED` | `REJECT` |
| 900 | **Payment Guarantee Gate** | `requiresPaymentGuarantee = true` AND `paymentGuaranteed = false` | `REQUIRE_PAYMENT_GUARANTEE` |
| 850 | **Smart Fix Trigger** | `hotelRiskTier = HIGH` AND `paymentGuaranteed = false` | `SMART_FIX_REQUIRED` |
| 800 | **High Value Dual Sign** | `orderValue > 500,000` AND `hotelTier ≠ PREMIER` | `DUAL_SIGN_OFF` |
| 750 | **GM Route High Value** | `orderValue > 100,000` AND `requesterRole = CLERK` | `ROUTE_TO_GM` |
| 700 | **Auto-Approve Low Risk** | `orderValue < 50,000` AND `hotelRiskTier = LOW` AND `paymentGuaranteed = true` | `AUTO_APPROVE` |
| 650 | **FC Route Medium Value** | `orderValue > 50,000` AND `requesterRole = DEPARTMENT_HEAD` | `ROUTE_TO_FINANCIAL_CONTROLLER` |
| 600 | **Owner Route Critical Value** | `orderValue > 1,000,000` | `REQUIRE_OWNER` |
| 500 | **Default Approval** | Any unmatched order | `APPROVE` (requires one approver) |

### 3.3 Evaluation Algorithm

```typescript
async function evaluateAuthority(
  orderId: string,
  ctx: AuthorityContext
): Promise<AuthorityEvaluationResult> {
  
  // 1. Load order with all dimensions
  const order = await loadOrderWithDimensions(orderId);
  
  // 2. Load active rules for this tenant (sorted by priority DESC)
  const rules = await prisma.authorityRule.findMany({
    where: {
      OR: [
        { tenantId: ctx.tenantId },
        { tenantId: null } // Global rules
      ],
      isActive: true,
      minValue: { lte: order.total },
      maxValue: { gte: order.total },
    },
    orderBy: { priority: "desc" }
  });
  
  // 3. Evaluate each rule
  for (const rule of rules) {
    const match = checkRuleMatch(rule, order, ctx);
    if (match) {
      // 4. Check Payment Guarantee (absolute gate)
      if (rule.requiresPaymentGuarantee && !order.paymentGuaranteed) {
        // If Smart Fix is available, suggest it
        if (order.hotel.riskTier === "HIGH" || order.hotel.riskTier === "CRITICAL") {
          const smartFix = await generateSmartFix(order);
          return {
            action: "SMART_FIX_REQUIRED",
            rule,
            smartFix,
            canProceed: false,
            requiresAction: true,
          };
        }
        return {
          action: "REQUIRE_PAYMENT_GUARANTEE",
          rule,
          canProceed: false,
          requiresAction: true,
        };
      }
      
      // 5. Check ETA validation
      if (rule.requiresEtaValidation) {
        const etaValid = await validateEtaForOrder(order);
        if (!etaValid) {
          return {
            action: "REJECT",
            rule,
            reason: "ETA validation failed",
            canProceed: false,
            requiresAction: false,
          };
        }
      }
      
      // 6. Return matched action
      return {
        action: rule.action,
        rule,
        routeToRole: rule.routeToRole,
        canProceed: [
          "AUTO_APPROVE",
          "APPROVE",
          "ROUTE_TO_GM",
          "ROUTE_TO_FINANCIAL_CONTROLLER",
          "REQUIRE_OWNER"
        ].includes(rule.action),
        requiresAction: true,
      };
    }
  }
  
  // 7. Default fallback
  return {
    action: "APPROVE",
    rule: null,
    canProceed: true,
    requiresAction: true,
  };
}
```

---

## 4. PAYMENT GUARANTEE LIFECYCLE

### 4.1 States

```
ORDER_CREATED
    ↓
[Risk Engine evaluates hotel]
    ↓
Can proceed without guarantee? ──YES (LOW risk + small order)──→ PAYMENT_GUARANTEE_WAIVED
    ↓ NO
PAYMENT_GUARANTEE_REQUIRED
    ↓
[Smart Fix Engine generates options]
    ↓
Hotel selects fix:
    ├─→ FACTORING ──→ [ETA Validator] ──→ [Factoring Bridge Inquiry] ──→ APPROVED
    ├─→ DEPOSIT ──→ [Paymob] ──→ Deposit received ──→ APPROVED
    ├─→ SPLIT ──→ Configure terms ──→ APPROVED
    └─→ DIRECT ──→ Credit check passed ──→ APPROVED
    ↓
PAYMENT_GUARANTEED
    ↓
[Authority Matrix evaluates remaining rules]
    ↓
Order approved → Status = CONFIRMED
```

### 4.2 State Machine

```typescript
enum PaymentGuaranteeStatus {
  NOT_REQUIRED = "NOT_REQUIRED",      // LOW risk, small order
  REQUIRED = "REQUIRED",              // Guarantee needed
  SMART_FIX_PENDING = "SMART_FIX_PENDING", // Waiting for hotel to choose fix
  PENDING_VALIDATION = "PENDING_VALIDATION", // Fix chosen, validating
  GUARANTEED = "GUARANTEED",          // Payment secured
  FAILED = "FAILED",                  // Could not secure payment
  WAIVED_BY_ADMIN = "WAIVED_BY_ADMIN" // Admin override (audited)
}
```

### 4.3 The `PaymentGuaranteed` Flag

```typescript
interface PaymentGuaranteeRecord {
  id: string;
  orderId: string;
  
  // Status
  status: PaymentGuaranteeStatus;
  
  // Method
  method: "FACTORING" | "DEPOSIT" | "SPLIT" | "DIRECT" | "WAIVED";
  
  // Factoring details
  factoringRequestId?: string;
  factoringCompanyId?: string;
  advanceRate?: number;
  
  // Deposit details
  depositAmount?: number;
  depositReceived?: boolean;
  depositReceivedAt?: Date;
  paymobOrderId?: string;
  
  // Split details
  splitDeliveryAmount?: number;
  splitCreditAmount?: number;
  splitDeliveryPaid?: boolean;
  splitCreditPaid?: boolean;
  
  // Direct credit
  directCreditLimit?: number;
  directCreditUsed?: number;
  
  // ETA
  etaValidated: boolean;
  etaUuid?: string;
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
  verifiedBy?: string; // User ID or "SYSTEM"
  verifiedAt?: Date;
  waivedBy?: string; // Admin override
  waivedReason?: string;
}
```

---

## 5. SMART FIX INTEGRATION

### 5.1 Fix Selection by Risk Tier

| Hotel Risk Tier | Available Fixes | Default Fix |
|-----------------|-----------------|-------------|
| LOW | DIRECT, FACTORING | DIRECT |
| MEDIUM | DIRECT, FACTORING, SPLIT | FACTORING |
| HIGH | FACTORING, SPLIT, DEPOSIT | FACTORING (high-risk partner) |
| CRITICAL | DEPOSIT, SPLIT | DEPOSIT (20% minimum) |

### 5.2 Fix Application Flow

```typescript
async function applySmartFix(
  orderId: string,
  fixType: SmartFixType,
  ctx: AuthorityContext
): Promise<SmartFixResult> {
  
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { hotel: true, supplier: true, invoices: true }
  });
  
  switch (fixType) {
    case "FACTORING": {
      // 1. Validate ETA
      const invoice = order.invoices[0];
      const etaValid = await etaValidator.validateForFactoring(invoice.id);
      if (!etaValid.valid) {
        return { success: false, error: etaValid.message, code: etaValid.code };
      }
      
      // 2. Inquiry to factoring partners
      const inquiry = await factoringBridge.inquire({
        hotelTaxId: order.hotel.taxId,
        hotelName: order.hotel.name,
        invoiceAmount: invoice.total,
        invoiceDueDate: invoice.dueDate,
        etaUuid: invoice.etaUuid!,
        hotelRiskScore: order.hotel.riskScore ?? 50,
        hotelRiskTier: order.hotel.riskTier ?? "MEDIUM",
      });
      
      if (!inquiry.eligible) {
        return { success: false, error: inquiry.rejectionReason, code: "FACTORING_REJECTED" };
      }
      
      // 3. Calculate hub revenue
      const revenue = hubRevenue.calculate({
        grossAmount: invoice.total,
        hotelTier: order.hotel.tier,
        riskTier: order.hotel.riskTier ?? "MEDIUM",
        isCoastal: false, // TODO: detect coastal
        partnerDiscountRate: inquiry.discountRate,
        advanceRate: inquiry.maxAdvanceRate,
      });
      
      // 4. Create factoring request
      const factoringRequest = await prisma.factoringRequest.create({
        data: {
          invoiceId: invoice.id,
          factoringCompanyId: inquiry.partnerId!,
          requestedAmount: invoice.total,
          advanceRate: inquiry.maxAdvanceRate,
          discountRate: inquiry.discountRate,
          platformFeeRate: revenue.platformFeeRate,
          membershipDiscount: revenue.membershipDiscount,
          grossAmount: revenue.grossAmount,
          platformFee: revenue.platformFee,
          netPlatformFee: revenue.netPlatformFee,
          factoringFee: revenue.factoringFee,
          disbursedAmount: revenue.supplierDisbursement,
          status: "APPROVED",
          isNonRecourse: true,
        }
      });
      
      // 5. Set payment guarantee
      await setPaymentGuarantee(orderId, {
        status: "GUARANTEED",
        method: "FACTORING",
        factoringRequestId: factoringRequest.id,
        etaValidated: true,
        etaUuid: invoice.etaUuid!,
        verifiedBy: "SYSTEM",
        verifiedAt: new Date(),
      });
      
      return { success: true, factoringRequestId: factoringRequest.id };
    }
    
    case "DEPOSIT": {
      // 1. Calculate deposit
      const depositAmount = order.total * 0.20;
      
      // 2. Create Paymob order
      const paymobOrder = await paymobClient.createOrder({
        amount: depositAmount,
        currency: "EGP",
        description: `Deposit for Order ${order.orderNumber}`,
        hotelId: order.hotelId,
      });
      
      // 3. Set payment guarantee (pending deposit)
      await setPaymentGuarantee(orderId, {
        status: "PENDING_VALIDATION",
        method: "DEPOSIT",
        depositAmount,
        depositReceived: false,
        paymobOrderId: paymobOrder.id,
        etaValidated: false,
      });
      
      return {
        success: true,
        paymentLink: paymobOrder.paymentLink,
        depositAmount,
      };
    }
    
    case "SPLIT": {
      const deliveryAmount = order.total * 0.50;
      const creditAmount = order.total * 0.50;
      
      await setPaymentGuarantee(orderId, {
        status: "PENDING_VALIDATION",
        method: "SPLIT",
        splitDeliveryAmount: deliveryAmount,
        splitCreditAmount: creditAmount,
        splitDeliveryPaid: false,
        splitCreditPaid: false,
        etaValidated: false,
      });
      
      return { success: true, deliveryAmount, creditAmount };
    }
    
    case "DIRECT": {
      // Verify credit limit
      const credit = await checkCreditLimit(order.hotelId, order.total);
      if (!credit.allowed) {
        return { success: false, error: credit.reason, code: "CREDIT_LIMIT_EXCEEDED" };
      }
      
      await setPaymentGuarantee(orderId, {
        status: "GUARANTEED",
        method: "DIRECT",
        directCreditLimit: credit.available + order.total,
        directCreditUsed: order.total,
        etaValidated: false,
        verifiedBy: "SYSTEM",
        verifiedAt: new Date(),
      });
      
      return { success: true };
    }
  }
}
```

---

## 6. ADMIN AUTHORITY MATRIX CONFIGURATION

### 6.1 Global Rules (Platform Admin)

Platform admins can configure rules that apply to all tenants:

```typescript
// POST /api/v1/admin/authority-rules
{
  "name": "High Value Dual Sign-Off",
  "priority": 800,
  "minValue": 500000,
  "maxValue": 999999999,
  "hotelRiskTier": null, // Any
  "hotelTier": null, // Any
  "supplierTier": null, // Any
  "requesterRole": null, // Any
  "requiresPaymentGuarantee": true,
  "requiresEtaValidation": true,
  "requiresDualSignOff": true,
  "action": "DUAL_SIGN_OFF",
  "tenantId": null // Global
}
```

### 6.2 Tenant-Specific Rules

Hotel group admins can configure rules for their own tenants:

```typescript
{
  "name": "Department Head Auto-Approve",
  "priority": 700,
  "minValue": 0,
  "maxValue": 25000,
  "hotelRiskTier": "LOW",
  "requesterRole": "DEPARTMENT_HEAD",
  "requiresPaymentGuarantee": false,
  "action": "AUTO_APPROVE",
  "tenantId": "tenant_123" // Specific tenant
}
```

### 6.3 Admin Override

Platform admins can override the Authority Matrix for any order:

```typescript
// POST /api/v1/admin/authority-override
{
  "orderId": "order_456",
  "action": "ADMIN_OVERRIDE",
  "reason": "Emergency procurement — hurricane season",
  "waivePaymentGuarantee": true,
  "requiresDualAuthorization": true
}
```

**Requirements for admin override:**
1. Two admin signatures (dual authorization)
2. Reason must be at least 20 characters
3. Audit log entry with `beforeState` and `afterState`
4. Escalated alert sent to all platform admins
5. Order flagged for post-hoc review

---

## 7. AUDIT REQUIREMENTS

### 7.1 Authority Matrix Audit Log

Every evaluation, approval, rejection, and override writes to `AuditLog`:

```typescript
{
  entityType: "ORDER",
  entityId: orderId,
  action: "AUTHORITY_EVALUATED", // or APPROVED, REJECTED, SMART_FIX_APPLIED, ADMIN_OVERRIDE
  actorId: userId,
  actorRole: userRole,
  beforeState: JSON.stringify({
    status: order.status,
    paymentGuaranteed: order.paymentGuaranteed,
    paymentGuaranteeMethod: order.paymentGuaranteeMethod,
  }),
  afterState: JSON.stringify({
    status: newStatus,
    paymentGuaranteed: true,
    paymentGuaranteeMethod: "FACTORING",
    factoringRequestId: factoringRequest.id,
  }),
  ipAddress: ctx.ip,
  userAgent: ctx.userAgent,
}
```

### 7.2 Payment Guarantee Audit Log

```typescript
{
  entityType: "PAYMENT_GUARANTEE",
  entityId: guaranteeId,
  action: "GUARANTEE_SET", // or GUARANTEE_FAILED, GUARANTEE_WAIVED
  actorId: "SYSTEM", // or userId
  afterState: JSON.stringify({
    method: "FACTORING",
    factoringRequestId: requestId,
    etaUuid: etaUuid,
    netPlatformFee: netPlatformFee,
  }),
}
```

---

## 8. API ENDPOINTS

### 8.1 Authority Evaluation

```
POST /api/v1/orders/[id]/evaluate
→ Returns AuthorityEvaluationResult
→ Triggers Smart Fix if needed
→ Sets PaymentGuarantee status
```

### 8.2 Apply Smart Fix

```
POST /api/v1/orders/[id]/smart-fix
Body: { "fixType": "FACTORING" | "DEPOSIT" | "SPLIT" | "DIRECT" }
→ Returns SmartFixResult
→ May return paymentLink for DEPOSIT
```

### 8.3 Confirm Payment Guarantee

```
POST /api/v1/orders/[id]/confirm-guarantee
Body: { "guaranteeId": "..." }
→ Validates guarantee is complete
→ Updates order.paymentGuaranteed = true
→ Triggers Authority Matrix re-evaluation
```

### 8.4 Admin Override

```
POST /api/v1/admin/orders/[id]/override
Body: { "reason": "...", "waivePaymentGuarantee": boolean }
→ Requires dual authorization
→ Writes audit log
→ Sends escalated alert
```

---

**End of Specification**
