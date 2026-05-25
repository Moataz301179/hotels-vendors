-- Pre-Spend Gatekeeper Migration
-- Created: 2025-05-25
-- Adds: BudgetGate, SpendRequest, SpendRequestItem, SpendGatekeeperLog
-- Enums: SpendRequestStatus, GatekeeperDecision, BudgetPeriod, BudgetGateStatus

-- Create new enums
CREATE TYPE "SpendRequestStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'GATEKEEPER_EVALUATING', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'CONVERTED_TO_ORDER', 'CANCELLED');
CREATE TYPE "GatekeeperDecision" AS ENUM ('PASS', 'FLAG_BUDGET_EXCEEDED', 'FLAG_AUTHORITY_MISMATCH', 'FLAG_SUPPLIER_RISK', 'FLAG_DUPLICATE', 'FLAG_SEASONAL_ANOMALY', 'BLOCKED');
CREATE TYPE "BudgetPeriod" AS ENUM ('MONTHLY', 'QUARTERLY', 'ANNUAL', 'CUSTOM');
CREATE TYPE "BudgetGateStatus" AS ENUM ('ACTIVE', 'EXHAUSTED', 'WARNING', 'FROZEN');

-- BudgetGate: Hotel-level budget controls
CREATE TABLE "BudgetGate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "period" "BudgetPeriod" NOT NULL DEFAULT 'MONTHLY',
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "totalBudget" DECIMAL(12,2) NOT NULL,
    "spentAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "reservedAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "categoryBudgets" TEXT,
    "categorySpent" TEXT,
    "status" "BudgetGateStatus" NOT NULL DEFAULT 'ACTIVE',
    "warningThreshold" DECIMAL(65,30) NOT NULL DEFAULT 80,
    "hardCap" BOOLEAN NOT NULL DEFAULT true,
    "allowRollover" BOOLEAN NOT NULL DEFAULT false,
    "rolloverFromId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BudgetGate_pkey" PRIMARY KEY ("id")
);

-- SpendRequest: Upstream spend approval before order creation
CREATE TABLE "SpendRequest" (
    "id" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "status" "SpendRequestStatus" NOT NULL DEFAULT 'DRAFT',
    "hotelId" TEXT NOT NULL,
    "propertyId" TEXT,
    "outletId" TEXT,
    "requesterId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "vatAmount" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "preferredSupplierId" TEXT,
    "deliveryDate" TIMESTAMP(3),
    "deliveryInstructions" TEXT,
    "costCenter" TEXT,
    "gatekeeperDecision" "GatekeeperDecision",
    "gatekeeperScore" INTEGER,
    "gatekeeperReasons" TEXT,
    "gatekeeperEvaluatedAt" TIMESTAMP(3),
    "requiredApproverRole" "UserRole",
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "convertedOrderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpendRequest_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "SpendRequest_requestNumber_key" UNIQUE ("requestNumber")
);

-- SpendRequestItem: Line items within a spend request
CREATE TABLE "SpendRequestItem" (
    "id" TEXT NOT NULL,
    "spendRequestId" TEXT NOT NULL,
    "productId" TEXT,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "aiSuggestions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpendRequestItem_pkey" PRIMARY KEY ("id")
);

-- SpendGatekeeperLog: Audit trail for all gatekeeper decisions
CREATE TABLE "SpendGatekeeperLog" (
    "id" TEXT NOT NULL,
    "spendRequestId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "decision" "GatekeeperDecision",
    "score" INTEGER,
    "details" TEXT,
    "actorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpendGatekeeperLog_pkey" PRIMARY KEY ("id")
);

-- Foreign keys
ALTER TABLE "BudgetGate" ADD CONSTRAINT "BudgetGate_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BudgetGate" ADD CONSTRAINT "BudgetGate_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SpendRequest" ADD CONSTRAINT "SpendRequest_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SpendRequest" ADD CONSTRAINT "SpendRequest_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SpendRequest" ADD CONSTRAINT "SpendRequest_outletId_fkey" FOREIGN KEY ("outletId") REFERENCES "Outlet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SpendRequest" ADD CONSTRAINT "SpendRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SpendRequest" ADD CONSTRAINT "SpendRequest_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SpendRequest" ADD CONSTRAINT "SpendRequest_preferredSupplierId_fkey" FOREIGN KEY ("preferredSupplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SpendRequest" ADD CONSTRAINT "SpendRequest_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SpendRequestItem" ADD CONSTRAINT "SpendRequestItem_spendRequestId_fkey" FOREIGN KEY ("spendRequestId") REFERENCES "SpendRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SpendRequestItem" ADD CONSTRAINT "SpendRequestItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SpendGatekeeperLog" ADD CONSTRAINT "SpendGatekeeperLog_spendRequestId_fkey" FOREIGN KEY ("spendRequestId") REFERENCES "SpendRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SpendGatekeeperLog" ADD CONSTRAINT "SpendGatekeeperLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Indexes
CREATE INDEX "BudgetGate_hotelId_periodStart_periodEnd_idx" ON "BudgetGate"("hotelId", "periodStart", "periodEnd");
CREATE INDEX "BudgetGate_tenantId_status_idx" ON "BudgetGate"("tenantId", "status");
CREATE INDEX "SpendRequest_hotelId_status_idx" ON "SpendRequest"("hotelId", "status");
CREATE INDEX "SpendRequest_tenantId_createdAt_idx" ON "SpendRequest"("tenantId", "createdAt");
CREATE INDEX "SpendRequest_requesterId_status_idx" ON "SpendRequest"("requesterId", "status");
CREATE INDEX "SpendRequestItem_spendRequestId_idx" ON "SpendRequestItem"("spendRequestId");
CREATE INDEX "SpendGatekeeperLog_spendRequestId_createdAt_idx" ON "SpendGatekeeperLog"("spendRequestId", "createdAt");
