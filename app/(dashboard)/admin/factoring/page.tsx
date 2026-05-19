"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CardEnterprise,
  CardEnterpriseHeader,
  CardEnterpriseContent,
  CardEnterpriseFooter,
} from "@/components/ui/card-enterprise";
import { ButtonEnterprise } from "@/components/ui/button-enterprise";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Building2,
  DollarSign,
  Calendar,
  User,
  FileArchive,
  ChevronRight,
  Search,
  Filter,
  MoreHorizontal,
  MessageSquare,
  Check,
  X,
  Loader2,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ArrowRight,
  CreditCard,
  FileCheck,
  Send,
  StickyNote,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

export type FactoringStatus = "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";

export interface FactoringDocument {
  id: string;
  type: "BANK_STATEMENT" | "TRADE_LICENSE" | "VAT_CERTIFICATE" | "ID_PROOF" | "OTHER";
  name: string;
  url: string;
  uploadedAt: string;
  verified: boolean;
}

export interface HotelInfo {
  id: string;
  name: string;
  registrationNumber: string;
  taxId: string;
  location: string;
  starRating: number;
  yearsInBusiness: number;
  monthlyProcurementAmount: number;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}

export interface FactoringApplication {
  id: string;
  hotelId: string;
  hotel: HotelInfo;
  monthlyProcurementAmount: number;
  requestedCreditLimit: number;
  status: FactoringStatus;
  documents: FactoringDocument[];
  applicationDate: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes: ReviewNote[];
  riskScore?: number;
  daysUnderReview: number;
}

export interface ReviewNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface StatsData {
  totalApplications: number;
  pendingReview: number;
  approvedToday: number;
  averageApprovalHours: number;
  approvedAmountThisMonth: number;
}

// ============================================================================
// MOCK DATA (REPLACE WITH API INTEGRATION)
// ============================================================================

const MOCK_APPLICATIONS: FactoringApplication[] = [
  {
    id: "fact-001",
    hotelId: "htl-001",
    hotel: {
      id: "htl-001",
      name: "Marriott Cairo",
      registrationNumber: "REG-2024-001",
      taxId: "TX-8872341",
      location: "Downtown Cairo",
      starRating: 5,
      yearsInBusiness: 12,
      monthlyProcurementAmount: 1250000,
      contactPerson: "Ahmed Hassan",
      contactEmail: "ahmed.hassan@marriott.com",
      contactPhone: "+20 10 1234 5678",
    },
    monthlyProcurementAmount: 1250000,
    requestedCreditLimit: 3750000,
    status: "UNDER_REVIEW",
    documents: [
      { id: "doc-001", type: "BANK_STATEMENT", name: "Bank_Statements_2024.pdf", url: "/docs/bank_001.pdf", uploadedAt: "2026-05-18", verified: true },
      { id: "doc-002", type: "TRADE_LICENSE", name: "Trade_License.pdf", url: "/docs/license_001.pdf", uploadedAt: "2026-05-18", verified: true },
      { id: "doc-003", type: "VAT_CERTIFICATE", name: "VAT_Registration.pdf", url: "/docs/vat_001.pdf", uploadedAt: "2026-05-18", verified: false },
    ],
    applicationDate: "2026-05-18T10:30:00Z",
    riskScore: 78,
    daysUnderReview: 2,
    notes: [],
  },
  {
    id: "fact-002",
    hotelId: "htl-002",
    hotel: {
      id: "htl-002",
      name: "Four Seasons Alexandria",
      registrationNumber: "REG-2024-042",
      taxId: "TX-9981234",
      location: "Corniche Road, Alexandria",
      starRating: 5,
      yearsInBusiness: 18,
      monthlyProcurementAmount: 2100000,
      contactPerson: "Sandra Michel",
      contactEmail: "s.michel@fourseasons.com",
      contactPhone: "+20 3 581 8000",
    },
    monthlyProcurementAmount: 2100000,
    requestedCreditLimit: 6300000,
    status: "PENDING",
    documents: [
      { id: "doc-004", type: "BANK_STATEMENT", name: "Q1_2024_Statements.pdf", url: "/docs/bank_002.pdf", uploadedAt: "2026-05-17", verified: false },
    ],
    applicationDate: "2026-05-17T14:00:00Z",
    riskScore: 85,
    daysUnderReview: 0,
    notes: [],
  },
  {
    id: "fact-003",
    hotelId: "htl-003",
    hotel: {
      id: "htl-003",
      name: "Stella Di Mare Sharm",
      registrationNumber: "REG-2023-156",
      taxId: "TX-7734098",
      location: "Sharm El-Sheikh",
      starRating: 4,
      yearsInBusiness: 7,
      monthlyProcurementAmount: 680000,
      contactPerson: "Khaled Farouk",
      contactEmail: "finance@stelladimare.com",
      contactPhone: "+20 69 360 0140",
    },
    monthlyProcurementAmount: 680000,
    requestedCreditLimit: 2040000,
    status: "APPROVED",
    documents: [
      { id: "doc-005", type: "BANK_STATEMENT", name: "Bank_Statements_2024.pdf", url: "/docs/bank_003.pdf", uploadedAt: "2026-05-15", verified: true },
      { id: "doc-006", type: "TRADE_LICENSE", name: "License_2024.pdf", url: "/docs/license_003.pdf", uploadedAt: "2026-05-15", verified: true },
      { id: "doc-007", type: "VAT_CERTIFICATE", name: "VAT_Cert.pdf", url: "/docs/vat_003.pdf", uploadedAt: "2026-05-15", verified: true },
    ],
    applicationDate: "2026-05-15T09:00:00Z",
    reviewedAt: "2026-05-16T11:30:00Z",
    reviewedBy: "Omar El-Sayed",
    riskScore: 72,
    daysUnderReview: 1,
    notes: [
      { id: "note-001", content: "Credit limit approved at 3x monthly average. Hotel has strong payment history.", author: "Omar El-Sayed", createdAt: "2026-05-16T11:30:00Z" },
    ],
  },
  {
    id: "fact-004",
    hotelId: "htl-004",
    hotel: {
      id: "htl-004",
      name: "Sunrise Resorts Hurghada",
      registrationNumber: "REG-2022-089",
      taxId: "TX-6652301",
      location: "Hurghada Marina",
      starRating: 4,
      yearsInBusiness: 5,
      monthlyProcurementAmount: 450000,
      contactPerson: "Mona Gamal",
      contactEmail: "procurement@sunrise.com.eg",
      contactPhone: "+20 65 344 8800",
    },
    monthlyProcurementAmount: 450000,
    requestedCreditLimit: 1350000,
    status: "REJECTED",
    documents: [
      { id: "doc-008", type: "BANK_STATEMENT", name: "Statements.pdf", url: "/docs/bank_004.pdf", uploadedAt: "2026-05-14", verified: true },
    ],
    applicationDate: "2026-05-14T16:45:00Z",
    reviewedAt: "2026-05-15T10:20:00Z",
    reviewedBy: "Fatima Hassan",
    riskScore: 45,
    daysUnderReview: 1,
    notes: [
      { id: "note-002", content: "Insufficient cash flow history. Bank statements show irregular deposits. Recommend reapplication after 6 months.", author: "Fatima Hassan", createdAt: "2026-05-15T10:20:00Z" },
    ],
  },
  {
    id: "fact-005",
    hotelId: "htl-005",
    hotel: {
      id: "htl-005",
      name: "Mena House Oberoi",
      registrationNumber: "REG-2019-023",
      taxId: "TX-1123456",
      location: "Pyramids Road, Giza",
      starRating: 5,
      yearsInBusiness: 25,
      monthlyProcurementAmount: 3500000,
      contactPerson: "Tarek Ibrahim",
      contactEmail: "t.ibrahim@oberoihotels.com",
      contactPhone: "+20 2 3377 3222",
    },
    monthlyProcurementAmount: 3500000,
    requestedCreditLimit: 10500000,
    status: "PENDING",
    documents: [
      { id: "doc-009", type: "BANK_STATEMENT", name: "Annual_Statements.pdf", url: "/docs/bank_005.pdf", uploadedAt: "2026-05-19", verified: false },
      { id: "doc-010", type: "TRADE_LICENSE", name: "License.pdf", url: "/docs/license_005.pdf", uploadedAt: "2026-05-19", verified: false },
      { id: "doc-011", type: "VAT_CERTIFICATE", name: "VAT.pdf", url: "/docs/vat_005.pdf", uploadedAt: "2026-05-19", verified: false },
    ],
    applicationDate: "2026-05-19T08:00:00Z",
    riskScore: 92,
    daysUnderReview: 0,
    notes: [],
  },
];

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const slideInVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
};

const formatCurrencyFull = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getStatusConfig = (status: FactoringStatus) => {
  const config = {
    PENDING: { variant: "pending" as const, label: "Pending Review", icon: Clock, color: "text-amber-400" },
    UNDER_REVIEW: { variant: "processing" as const, label: "Under Review", icon: FileCheck, color: "text-blue-400" },
    APPROVED: { variant: "active" as const, label: "Approved", icon: CheckCircle2, color: "text-emerald-400" },
    REJECTED: { variant: "error" as const, label: "Rejected", icon: XCircle, color: "text-rose-400" },
  };
  return config[status];
};

const calculateSuggestedLimit = (monthlyAmount: number): number => {
  return Math.round(monthlyAmount * 3);
};

// ============================================================================
// MODAL COMPONENTS
// ============================================================================

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}> = ({ isOpen, onClose, title, children, maxWidth = "md" }) => {
  if (!isOpen) return null;

  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  }[maxWidth];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "relative w-full bg-[var(--oled-raised)] border border-[var(--border-enterprise-default)] rounded-2xl shadow-[0_24px_48px_rgba(0,0,0,0.5)]",
            maxWidthClass
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-[var(--border-enterprise-subtle)]">
            <h3 className="text-lg font-semibold text-[var(--enterprise-200)]">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-[var(--enterprise-500)] hover:text-[var(--enterprise-300)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================================================
// REVIEW SIDE PANEL
// ============================================================================

const ReviewPanel: React.FC<{
  application: FactoringApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (app: FactoringApplication) => void;
}> = ({ application, isOpen, onClose, onUpdate }) => {
  const [noteText, setNoteText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creditLimit, setCreditLimit] = useState(0);

  useEffect(() => {
    if (application) {
      setCreditLimit(application.requestedCreditLimit);
    }
  }, [application]);

  if (!application) return null;

  const suggestedLimit = calculateSuggestedLimit(application.monthlyProcurementAmount);
  const isUnderReview = application.status === "UNDER_REVIEW";
  const isPending = application.status === "PENDING";
  const canReview = isPending || isUnderReview;

  const handleStatusChange = async (newStatus: FactoringStatus) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const updatedApp = {
      ...application,
      status: newStatus,
      reviewedAt: new Date().toISOString(),
      reviewedBy: "Current User",
      requestedCreditLimit: creditLimit,
    };
    onUpdate(updatedApp);
    setIsSubmitting(false);
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newNote: ReviewNote = {
      id: `note-${Date.now()}`,
      content: noteText,
      author: "Current User",
      createdAt: new Date().toISOString(),
    };
    onUpdate({
      ...application,
      notes: [...application.notes, newNote],
    });
    setNoteText("");
    setIsSubmitting(false);
  };

  const StatusIcon = getStatusConfig(application.status).icon;
  const statusConfig = getStatusConfig(application.status);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            variants={slideInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 h-full w-full max-w-[600px] z-50 bg-[var(--oled-black)] border-l border-[var(--border-enterprise-default)] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-enterprise-subtle)]">
              <div className="flex items-center gap-3">
                <StatusIcon className={cn("w-5 h-5", statusConfig.color)} />
                <div>
                  <h2 className="text-lg font-semibold text-[var(--enterprise-200)]">
                    Application Review
                  </h2>
                  <p className="text-sm text-[var(--enterprise-600)]">
                    {application.id} • Applied {formatDate(application.applicationDate)}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5 text-[var(--enterprise-500)]" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Risk Score Card */}
              {application.riskScore !== undefined && (
                <CardEnterprise variant="elevated" size="compact">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[var(--enterprise-600)]">Risk Assessment</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className={cn(
                          "text-2xl font-bold",
                          application.riskScore >= 70 ? "text-emerald-400" :
                          application.riskScore >= 50 ? "text-amber-400" : "text-rose-400"
                        )}>
                          {application.riskScore}
                        </span>
                        <span className="text-sm text-[var(--enterprise-500)]">/ 100</span>
                      </div>
                    </div>
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center border-4",
                      application.riskScore >= 70 ? "border-emerald-500/30 bg-emerald-500/10" :
                      application.riskScore >= 50 ? "border-amber-500/30 bg-amber-500/10" : "border-rose-500/30 bg-rose-500/10"
                    )}>
                      <TrendingUp className={cn(
                        "w-6 h-6",
                        application.riskScore >= 70 ? "text-emerald-400" :
                        application.riskScore >= 50 ? "text-amber-400" : "text-rose-400"
                      )} />
                    </div>
                  </div>
                </CardEnterprise>
              )}

              {/* Hotel Information */}
              <CardEnterprise variant="elevated" size="compact">
                <CardEnterpriseHeader title="Hotel Information" />
                <CardEnterpriseContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[var(--enterprise-600)] uppercase tracking-wider">Hotel Name</p>
                      <p className="text-[var(--enterprise-200)] font-medium mt-1 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-indigo-400" />
                        {application.hotel.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--enterprise-600)] uppercase tracking-wider">Registration</p>
                      <p className="text-[var(--enterprise-200)] font-medium mt-1">{application.hotel.registrationNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--enterprise-600)] uppercase tracking-wider">Tax ID</p>
                      <p className="text-[var(--enterprise-200)] font-medium mt-1">{application.hotel.taxId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--enterprise-600)] uppercase tracking-wider">Location</p>
                      <p className="text-[var(--enterprise-200)] font-medium mt-1">{application.hotel.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--enterprise-600)] uppercase tracking-wider">Rating</p>
                      <p className="text-[var(--enterprise-200)] font-medium mt-1">{"★".repeat(application.hotel.starRating)} {application.hotel.starRating} Star</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--enterprise-600)] uppercase tracking-wider">Years in Business</p>
                      <p className="text-[var(--enterprise-200)] font-medium mt-1">{application.hotel.yearsInBusiness} years</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[var(--border-enterprise-subtle)]">
                    <p className="text-xs text-[var(--enterprise-600)] uppercase tracking-wider mb-2">Contact</p>
                    <div className="space-y-1">
                      <p className="text-sm text-[var(--enterprise-300)] flex items-center gap-2">
                        <User className="w-4 h-4 text-[var(--enterprise-500)]" />
                        {application.hotel.contactPerson}
                      </p>
                      <p className="text-sm text-[var(--enterprise-300)] flex items-center gap-2">
                        <MailIcon className="w-4 h-4 text-[var(--enterprise-500)]" />
                        {application.hotel.contactEmail}
                      </p>
                      <p className="text-sm text-[var(--enterprise-300)] flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4 text-[var(--enterprise-500)]" />
                        {application.hotel.contactPhone}
                      </p>
                    </div>
                  </div>
                </CardEnterpriseContent>
              </CardEnterprise>

              {/* Credit Facility Calculator */}
              {canReview && (
                <CardEnterprise variant="glass" size="compact">
                  <CardEnterpriseHeader 
                    title="Credit Facility Amount"
                    description="Based on monthly procurement volume"
                  />
                  <CardEnterpriseContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm text-[var(--enterprise-600)]">Monthly Procurement</span>
                        <span className="text-lg font-semibold text-[var(--enterprise-200)]">
                          {formatCurrencyFull(application.monthlyProcurementAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm text-[var(--enterprise-600)]">Requested Limit</span>
                        <span className={cn(
                          "text-lg font-semibold",
                          creditLimit !== application.requestedCreditLimit ? "text-amber-400" : "text-[var(--enterprise-200)]"
                        )}>
                          {formatCurrencyFull(creditLimit)}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm text-[var(--enterprise-600)]">Suggested (3x)</span>
                        <span className="text-lg font-semibold text-emerald-400">
                          {formatCurrencyFull(suggestedLimit)}
                        </span>
                      </div>
                      
                      <div className="pt-4 border-t border-[var(--border-enterprise-subtle)]">
                        <label className="text-sm text-[var(--enterprise-500)] mb-2 block">
                          Adjust Credit Limit
                        </label>
                        <input
                          type="range"
                          min={application.requestedCreditLimit * 0.5}
                          max={application.requestedCreditLimit * 2}
                          value={creditLimit}
                          onChange={(e) => setCreditLimit(Number(e.target.value))}
                          className="w-full h-2 rounded-full bg-[var(--border-enterprise-default)] accent-indigo-400 appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, var(--color-indigo-400) 0%, var(--color-indigo-400) ${(creditLimit / (application.requestedCreditLimit * 2)) * 100}%, var(--border-enterprise-default) ${(creditLimit / (application.requestedCreditLimit * 2)) * 100}%, var(--border-enterprise-default) 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-[var(--enterprise-600)] mt-2">
                          <span>{formatCurrency(application.requestedCreditLimit * 0.5)}</span>
                          <span>{formatCurrency(application.requestedCreditLimit * 2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardEnterpriseContent>
                </CardEnterprise>
              )}

              {/* Documents */}
              <CardEnterprise variant="elevated" size="compact">
                <CardEnterpriseHeader title="Uploaded Documents" />
                <CardEnterpriseContent>
                  <div className="space-y-2">
                    {application.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-[var(--oled-elevated)] border border-[var(--border-enterprise-default)] hover:border-[var(--border-enterprise-subtle)] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            doc.verified ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                          )}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[var(--enterprise-200)]">{doc.name}</p>
                            <p className="text-xs text-[var(--enterprise-600)]">
                              {doc.type.replace(/_/g, " ")} • {formatDate(doc.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.verified && (
                            <StatusBadge variant="active" size="sm" dot>
                              Verified
                            </StatusBadge>
                          )}
                          <ButtonEnterprise variant="ghost" size="icon-sm" title="View Document">
                            <Eye className="w-4 h-4" />
                          </ButtonEnterprise>
                          <ButtonEnterprise variant="ghost" size="icon-sm" title="Download">
                            <Download className="w-4 h-4" />
                          </ButtonEnterprise>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardEnterpriseContent>
              </CardEnterprise>

              {/* Notes */}
              <CardEnterprise variant="elevated" size="compact">
                <CardEnterpriseHeader title="Review Notes" />
                <CardEnterpriseContent>
                  <div className="space-y-3">
                    {application.notes.length === 0 && (
                      <p className="text-sm text-[var(--enterprise-600)] text-center py-4">
                        No notes yet
                      </p>
                    )}
                    {application.notes.map((note) => (
                      <div key={note.id} className="p-3 rounded-lg bg-[var(--oled-elevated)]">
                        <p className="text-sm text-[var(--enterprise-300)]">{note.content}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-[var(--enterprise-600)]">
                          <User className="w-3 h-3" />
                          {note.author}
                          <span className="text-[var(--border-enterprise-default)]">•</span>
                          {formatDate(note.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {canReview && (
                    <div className="mt-4 pt-4 border-t border-[var(--border-enterprise-subtle)]">
                      <div className="flex gap-2">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add a review note..."
                          className="flex-1 bg-[var(--oled-elevated)] border border-[var(--border-enterprise-default)] rounded-lg px-3 py-2 text-sm text-[var(--enterprise-200)] placeholder:text-[var(--enterprise-600)] focus:outline-none focus:border-indigo-400 resize-none h-20"
                        />
                        <ButtonEnterprise
                          variant="secondary"
                          size="icon"
                          onClick={handleAddNote}
                          isLoading={isSubmitting}
                          className="self-end"
                        >
                          <Send className="w-4 h-4" />
                        </ButtonEnterprise>
                      </div>
                    </div>
                  )}
                </CardEnterpriseContent>
              </CardEnterprise>
            </div>

            {/* Actions Footer */}
            {canReview && (
              <div className="p-6 border-t border-[var(--border-enterprise-subtle)] bg-[var(--oled-black)]">
                <div className="flex gap-3">
                  <ButtonEnterprise
                    variant="destructive"
                    size="lg"
                    className="flex-1"
                    isLoading={isSubmitting}
                    loadingText="Rejecting..."
                    onClick={() => handleStatusChange("REJECTED")}
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </ButtonEnterprise>
                  <ButtonEnterprise
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    isLoading={isSubmitting}
                    loadingText="Approving..."
                    onClick={() => handleStatusChange("APPROVED")}
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </ButtonEnterprise>
                </div>
                {(isPending || (isUnderReview && application.daysUnderReview > 2)) && (
                  <div className="mt-3 flex gap-3">
                    {!isUnderReview && (
                      <ButtonEnterprise
                        variant="secondary"
                        size="default"
                        className="flex-1"
                        isLoading={isSubmitting}
                        onClick={() => handleStatusChange("UNDER_REVIEW")}
                      >
                        <Clock className="w-4 h-4" />
                        Move to Under Review
                      </ButtonEnterprise>
                    )}
                    <ButtonEnterprise
                      variant="ghost"
                      size="default"
                      className="flex-1"
                      onClick={onClose}
                    >
                      <Send className="w-4 h-4" />
                      Request More Documents
                    </ButtonEnterprise>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Icon helper components
const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function AdminFactoringReviewPage() {
  const [applications, setApplications] = useState<FactoringApplication[]>(MOCK_APPLICATIONS);
  const [filteredStatus, setFilteredStatus] = useState<FactoringStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<FactoringApplication | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Stats calculation
  const stats: StatsData = {
    totalApplications: applications.length,
    pendingReview: applications.filter((a) => a.status === "PENDING" || a.status === "UNDER_REVIEW").length,
    approvedToday: applications.filter((a) => 
      a.status === "APPROVED" && 
      a.reviewedAt && 
      new Date(a.reviewedAt).toDateString() === new Date().toDateString()
    ).length,
    averageApprovalHours: Math.round(
      applications
        .filter((a) => a.status === "APPROVED" && a.applicationDate && a.reviewedAt)
        .map((a) => new Date(a.reviewedAt!).getTime() - new Date(a.applicationDate).getTime())
        .reduce((acc, curr) => acc + curr, 0) / (1000 * 60 * 60) / Math.max(1, applications.filter((a) => a.status === "APPROVED").length)
    ),
    approvedAmountThisMonth: applications
      .filter((a) => a.status === "APPROVED")
      .reduce((acc, curr) => acc + curr.requestedCreditLimit, 0),
  };

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesStatus = filteredStatus === "ALL" || app.status === filteredStatus;
    const matchesSearch = 
      app.hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.hotel.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Sort by date (newest first)
  const sortedApplications = [...filteredApplications].sort(
    (a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()
  );

  const handleViewApplication = (app: FactoringApplication) => {
    setSelectedApplication(app);
    setIsPanelOpen(true);
  };

  const handleUpdateApplication = (updatedApp: FactoringApplication) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === updatedApp.id ? updatedApp : app))
    );
    setSelectedApplication(null);
    setIsPanelOpen(false);
  };

  const statusFilters: { value: FactoringStatus | "ALL"; label: string; count: number }[] = [
    { value: "ALL", label: "All Applications", count: applications.length },
    { value: "PENDING", label: "Pending", count: applications.filter((a) => a.status === "PENDING").length },
    { value: "UNDER_REVIEW", label: "Under Review", count: applications.filter((a) => a.status === "UNDER_REVIEW").length },
    { value: "APPROVED", label: "Approved", count: applications.filter((a) => a.status === "APPROVED").length },
    { value: "REJECTED", label: "Rejected", count: applications.filter((a) => a.status === "REJECTED").length },
  ];

  return (
    <div className="min-h-screen bg-[var(--oled-black)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border-enterprise-subtle)] bg-[var(--oled-black)]/95 backdrop-blur-xl">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--enterprise-100)] tracking-[-0.02em]">
                Factoring Review Queue
              </h1>
              <p className="text-sm text-[var(--enterprise-600)] mt-1">
                Review and manage hotel credit facility applications
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ButtonEnterprise variant="secondary" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </ButtonEnterprise>
            </div>
          </div>

          {/* Stats Row */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-4 gap-4 mt-6"
          >
            <CardEnterprise variant="elevated" size="compact" className="group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--enterprise-600)] uppercase tracking-wider">Total Applications</p>
                  <p className="text-2xl font-bold text-[var(--enterprise-200)] mt-1">
                    {stats.totalApplications}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                  <ClipboardCheck className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
            </CardEnterprise>

            <CardEnterprise variant="elevated" size="compact" className="group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--enterprise-600)] uppercase tracking-wider">Pending Review</p>
                  <p className="text-2xl font-bold text-amber-400 mt-1">
                    {stats.pendingReview}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            </CardEnterprise>

            <CardEnterprise variant="elevated" size="compact" className="group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--enterprise-600)] uppercase tracking-wider">Approved Today</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">
                    {stats.approvedToday}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </CardEnterprise>

            <CardEnterprise variant="elevated" size="compact" className="group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--enterprise-600)] uppercase tracking-wider">Avg. Approval Time</p>
                  <p className="text-2xl font-bold text-[var(--enterprise-200)] mt-1">
                    {stats.averageApprovalHours}h
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                  <TrendingUp className="w-5 h-5 text-violet-400" />
                </div>
              </div>
            </CardEnterprise>
          </motion.div>

          {/* Filters */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilteredStatus(filter.value)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    filteredStatus === filter.value
                      ? "bg-[var(--crimson-primary)] text-white shadow-[0_0_16px_rgba(139,0,0,0.3)]"
                      : "bg-[var(--oled-elevated)] text-[var(--enterprise-500)] hover:bg-[var(--oled-raised)] hover:text-[var(--enterprise-300)]"
                  )}
                >
                  {filter.label}
                  <span className={cn(
                    "ml-2 px-1.5 py-0.5 rounded text-xs",
                    filteredStatus === filter.value
                      ? "bg-white/20 text-white"
                      : "bg-[var(--border-enterprise-default)] text-[var(--enterprise-400)]"
                  )}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--enterprise-600)]" />
              <input
                type="text"
                placeholder="Search hotels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-[var(--oled-elevated)] border border-[var(--border-enterprise-default)] rounded-lg pl-9 pr-4 py-2 text-sm text-[var(--enterprise-200)] placeholder:text-[var(--enterprise-600)] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Applications List */}
      <main className="p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <CardEnterprise key={i} variant="elevated" size="compact" className="animate-pulse">
                <div className="flex items-center gap-4 p-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--border-enterprise-default)]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 rounded bg-[var(--border-enterprise-default)]" />
                    <div className="h-3 w-24 rounded bg-[var(--border-enterprise-default)]" />
                  </div>
                </div>
              </CardEnterprise>
            ))
          ) : sortedApplications.length === 0 ? (
            <CardEnterprise variant="glass" size="spacious" className="text-center">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-[var(--border-enterprise-default)] flex items-center justify-center mb-4">
                  <ClipboardCheck className="w-8 h-8 text-[var(--enterprise-600)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--enterprise-300)]">No applications found</h3>
                <p className="text-sm text-[var(--enterprise-600)] mt-1">
                  {searchQuery ? "Try adjusting your search" : "Applications will appear here when submitted"}
                </p>
              </div>
            </CardEnterprise>
          ) : (
            sortedApplications.map((application) => {
              const statusConfig = getStatusConfig(application.status);
              const StatusIcon = statusConfig.icon;
              const documentCount = application.documents.length;
              const verifiedDocs = application.documents.filter((d) => d.verified).length;

              return (
                <motion.div
                  key={application.id}
                  variants={itemVariants}
                  layoutId={application.id}
                >
                  <CardEnterprise
                    variant={selectedApplication?.id === application.id ? "interactive" : "elevated"}
                    size="compact"
                    isHoverable
                    onClick={() => handleViewApplication(application)}
                    className="cursor-pointer group"
                  >
                    <div className="flex items-center gap-6 p-4">
                      {/* Hotel Info */}
                      <div className="flex items-center gap-4 w-[280px]">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--enterprise-200)] group-hover:text-white transition-colors">
                            {application.hotel.name}
                          </h3>
                          <p className="text-xs text-[var(--enterprise-600)]">
                            {application.hotel.registrationNumber}
                          </p>
                        </div>
                      </div>

                      {/* Monthly Procurement */}
                      <div className="w-[160px]">
                        <p className="text-xs text-[var(--enterprise-600)] uppercase tracking-wider">Monthly Procurement</p>
                        <p className="font-semibold text-[var(--enterprise-200)] mt-1">
                          {formatCurrency(application.monthlyProcurementAmount)}
                        </p>
                      </div>

                      {/* Requested Credit */}
                      <div className="w-[160px]">
                        <p className="text-xs text-[var(--enterprise-600)] uppercase tracking-wider">Requested Credit</p>
                        <p className="font-semibold text-[var(--enterprise-200)] mt-1">
                          {formatCurrencyFull(application.requestedCreditLimit)}
                        </p>
                      </div>

                      {/* Documents */}
                      <div className="w-[140px]">
                        <p className="text-xs text-[var(--enterprise-600)] uppercase tracking-wider">Documents</p>
                        <div className="flex items-center gap-2 mt-1">
                          <FileArchive className="w-4 h-4 text-[var(--enterprise-500)]" />
                          <span className="text-sm text-[var(--enterprise-200)]">
                            {verifiedDocs}/{documentCount} verified
                          </span>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="w-[120px]">
                        <p className="text-xs text-[var(--enterprise-600)] uppercase tracking-wider">Applied</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4 text-[var(--enterprise-500)]" />
                          <span className="text-sm text-[var(--enterprise-200)]">
                            {formatDate(application.applicationDate)}
                          </span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="w-[140px]">
                        <StatusBadge
                          variant={statusConfig.variant}
                          dot
                          pulse={application.status === "UNDER_REVIEW"}
                        >
                          {statusConfig.label}
                        </StatusBadge>
                        {application.daysUnderReview > 0 && (
                          <p className="text-xs text-[var(--enterprise-600)] mt-1">
                            {application.daysUnderReview} day{application.daysUnderReview > 1 ? "s" : ""} under review
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2 ml-auto">
                        {(application.status === "PENDING" || application.status === "UNDER_REVIEW") && (
                          <>
                            <ButtonEnterprise
                              variant="ghost"
                              size="icon-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewApplication(application);
                              }}
                              title="Review Application"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            </ButtonEnterprise>
                            <ButtonEnterprise
                              variant="ghost"
                              size="icon-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewApplication(application);
                              }}
                              title="Reject Application"
                            >
                              <XCircle className="w-4 h-4 text-rose-400" />
                            </ButtonEnterprise>
                          </>
                        )}
                        <ButtonEnterprise
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewApplication(application);
                          }}
                          title="View Details"
                        >
                          <ChevronRight className="w-4 h-4 text-[var(--enterprise-500)] group-hover:translate-x-1 transition-transform" />
                        </ButtonEnterprise>
                      </div>
                    </div>
                  </CardEnterprise>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Load More / Pagination */}
        {sortedApplications.length > 0 && (
          <div className="flex items-center justify-between mt-6 border-t border-[var(--border-enterprise-subtle)] pt-6">
            <p className="text-sm text-[var(--enterprise-600)]">
              Showing {sortedApplications.length} of {applications.length} applications
            </p>
            <div className="flex items-center gap-2">
              <ButtonEnterprise variant="ghost" size="sm" disabled>
                Previous
              </ButtonEnterprise>
              <ButtonEnterprise variant="secondary" size="sm" disabled>
                Next
              </ButtonEnterprise>
            </div>
          </div>
        )}
      </main>

      {/* Review Panel */}
      <ReviewPanel
        application={selectedApplication}
        isOpen={isPanelOpen}
        onClose={() => {
          setIsPanelOpen(false);
          setTimeout(() => setSelectedApplication(null), 300);
        }}
        onUpdate={handleUpdateApplication}
      />
    </div>
  );
}
