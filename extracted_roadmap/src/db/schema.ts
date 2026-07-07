import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  bigint,
  boolean,
  timestamp,
  numeric,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

/* ----------------------------- Enums ----------------------------- */
export const orgTypeEnum = pgEnum("org_type", [
  "hotel",
  "supplier",
  "funder",
  "carrier",
  "platform",
]);

export const kycStatusEnum = pgEnum("kyc_status", [
  "pending",
  "in_review",
  "verified",
  "rejected",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "financed",
  "in_transit",
  "delivered",
  "settled",
  "cancelled",
]);

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "issued",
  "financed",
  "due",
  "paid",
  "overdue",
]);

export const financeStatusEnum = pgEnum("finance_status", [
  "requested",
  "approved",
  "funded",
  "repaying",
  "repaid",
  "declined",
]);

/* --------------------------- Organizations ------------------------ */
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  type: orgTypeEnum("type").notNull(),
  city: varchar("city", { length: 80 }).default("Cairo"),
  logo: text("logo"),
  description: text("description"),
  kycStatus: kycStatusEnum("kyc_status").notNull().default("verified"),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("4.7"),
  creditLimit: bigint("credit_limit", { mode: "number" }).default(0),
  creditUsed: bigint("credit_used", { mode: "number" }).default(0),
  walletBalance: bigint("wallet_balance", { mode: "number" }).default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ------------------------------- Users --------------------------- */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(() => organizations.id),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 40 }).notNull().default("member"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ------------------------------ Products ------------------------- */
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").references(() => organizations.id).notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  description: text("description"),
  image: text("image"),
  unit: varchar("unit", { length: 40 }).default("unit"),
  price: bigint("price", { mode: "number" }).notNull(),
  moq: integer("moq").default(1),
  stock: integer("stock").default(1000),
  leadTimeDays: integer("lead_time_days").default(3),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("4.8"),
  deal: boolean("deal").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ------------------------------- Orders -------------------------- */
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  reference: varchar("reference", { length: 24 }).notNull(),
  hotelId: integer("hotel_id").references(() => organizations.id).notNull(),
  supplierId: integer("supplier_id").references(() => organizations.id).notNull(),
  carrierId: integer("carrier_id").references(() => organizations.id),
  status: orderStatusEnum("status").notNull().default("pending"),
  subtotal: bigint("subtotal", { mode: "number" }).notNull(),
  platformFee: bigint("platform_fee", { mode: "number" }).default(0),
  total: bigint("total", { mode: "number" }).notNull(),
  paymentTermDays: integer("payment_term_days").default(0),
  items: jsonb("items").$type<OrderItem[]>().default([]),
  
  // Compliance & Real-time GRN fields for VC round readiness
  etaUuid: varchar("eta_uuid", { length: 100 }),
  etaStatus: varchar("eta_status", { length: 40 }).default("pending"),
  grnStatus: varchar("grn_status", { length: 40 }).default("not_received"),
  grnVarianceBps: integer("grn_variance_bps").default(0),
  grnReceivedAt: timestamp("grn_received_at"),
  grnNotes: text("grn_notes"),
  grnPhotoUrl: text("grn_photo_url"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type OrderItem = {
  productId: number;
  name: string;
  qty: number;
  price: number;
};

/* ------------------------------ Invoices ------------------------- */
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  supplierId: integer("supplier_id").references(() => organizations.id).notNull(),
  hotelId: integer("hotel_id").references(() => organizations.id).notNull(),
  amount: bigint("amount", { mode: "number" }).notNull(),
  status: invoiceStatusEnum("status").notNull().default("issued"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ------------------------- Financing Deals ----------------------- */
export const financings = pgTable("financings", {
  id: serial("id").primaryKey(),
  reference: varchar("reference", { length: 24 }).notNull(),
  type: varchar("type", { length: 30 }).notNull().default("trade_credit"), // trade_credit | factoring
  orderId: integer("order_id").references(() => orders.id),
  borrowerId: integer("borrower_id").references(() => organizations.id).notNull(),
  funderId: integer("funder_id").references(() => organizations.id),
  principal: bigint("principal", { mode: "number" }).notNull(),
  aprBps: integer("apr_bps").notNull().default(1800), // 18.00%
  termDays: integer("term_days").notNull().default(60),
  feeBps: integer("fee_bps").default(150),
  status: financeStatusEnum("status").notNull().default("requested"),
  
  // VC Institutional scoring metrics
  riskScore: varchar("risk_score", { length: 10 }).default("A+"),
  underwritingConfidence: integer("underwriting_confidence").default(95),
  insuranceStatus: varchar("insurance_status", { length: 30 }).default("insured"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ------------- Payment Guarantees (digital LG/LC equivalent) ------------- */
/*
  HotelsVendors is NOT a bank. It orchestrates a Payment Guarantee Order (PGO)
  — a digital equivalent of a Letter of Guarantee / Letter of Credit — that is
  ISSUED by a licensed funder (bank / factoring co). HotelsVendors is the
  compliance reviewer, evidence custodian and assurance provider only.
*/
export const guaranteeStatusEnum = pgEnum("guarantee_status", [
  "draft",           // hotel requested at checkout
  "under_review",    // HotelsVendors compliance/assurance review
  "funder_pending",  // routed to funder(s) for underwriting
  "issued",          // funder issued the guarantee -> supplier can ship
  "claimed",         // supplier claimed after GRN
  "settled",         // hotel repaid funder, guarantee closed
  "declined",
  "expired",
]);

export const guarantees = pgTable("guarantees", {
  id: serial("id").primaryKey(),
  reference: varchar("reference", { length: 24 }).notNull(),
  instrument: varchar("instrument", { length: 20 }).notNull().default("PGO"), // PGO | CTU (confirmed trade undertaking)
  orderId: integer("order_id").references(() => orders.id),
  hotelId: integer("hotel_id").references(() => organizations.id).notNull(),
  supplierId: integer("supplier_id").references(() => organizations.id).notNull(),
  funderId: integer("funder_id").references(() => organizations.id),
  faceValue: bigint("face_value", { mode: "number" }).notNull(),           // guaranteed amount to supplier
  supplierDiscountBps: integer("supplier_discount_bps").default(300),       // early payment discount taken from supplier
  hotelFeeBps: integer("hotel_fee_bps").default(150),                       // platform + assurance fee to hotel
  funderSpreadBps: integer("funder_spread_bps").default(1800),             // funder yield (APR-equivalent)
  platformMarginBps: integer("platform_margin_bps").default(120),          // HotelsVendors margin
  termDays: integer("term_days").default(60),
  status: guaranteeStatusEnum("status").notNull().default("draft"),
  complianceScore: integer("compliance_score").default(0),                  // 0-100 assurance review score
  evidenceComplete: boolean("evidence_complete").default(false),           // PO + KYC + tax profile ready
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Guarantee = typeof guarantees.$inferSelect;

/* ---------------------------- Transactions ----------------------- */
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id").references(() => organizations.id).notNull(),
  kind: varchar("kind", { length: 40 }).notNull(), // payout | charge | fee | disbursement | repayment
  gateway: varchar("gateway", { length: 40 }), // paymob | fawry | instapay | wallet
  amount: bigint("amount", { mode: "number" }).notNull(),
  reference: varchar("reference", { length: 40 }),
  meta: jsonb("meta").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ---------------------------- Waitlist --------------------------- */
export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }),
  email: varchar("email", { length: 160 }).notNull(),
  company: varchar("company", { length: 160 }),
  segment: varchar("segment", { length: 40 }).default("hotel"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Organization = typeof organizations.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Financing = typeof financings.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
