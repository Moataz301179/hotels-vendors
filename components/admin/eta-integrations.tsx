"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plug,
  CheckCircle2,
  XCircle,
  Clock,
  Server,
  FileText,
  Webhook,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Settings,
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  type: "pms" | "erp" | "eta" | "webhook";
  description: string;
  status: "connected" | "disconnected" | "pending" | "error";
  lastSync?: string;
  icon: React.ElementType;
}

const INTEGRATIONS: Integration[] = [
  {
    id: "eta-bridge",
    name: "ETA E-Invoicing Bridge",
    type: "eta",
    description: "Real-time submission to Egyptian Tax Authority. UUID generation, digital signing, and validation.",
    status: "connected",
    lastSync: "2 min ago",
    icon: ShieldCheck,
  },
  {
    id: "opera-pms",
    name: "Oracle Opera PMS",
    type: "pms",
    description: "Two-way sync: room inventory, guest folio, procurement requisitions.",
    status: "pending",
    icon: Server,
  },
  {
    id: "fidelio",
    name: "Fidelio Suite 8",
    type: "pms",
    description: "Hotel operations integration for midscale and luxury properties.",
    status: "disconnected",
    icon: Server,
  },
  {
    id: "sap-erp",
    name: "SAP Business One",
    type: "erp",
    description: "Supplier inventory, pricing, and invoice sync.",
    status: "disconnected",
    icon: FileText,
  },
  {
    id: "oracle-erp",
    name: "Oracle NetSuite",
    type: "erp",
    description: "Enterprise supplier financial management and reporting.",
    status: "pending",
    icon: FileText,
  },
  {
    id: "inventory-webhook",
    name: "Inventory Webhooks",
    type: "webhook",
    description: "Real-time stock updates from supplier WMS systems.",
    status: "connected",
    lastSync: "15 sec ago",
    icon: Webhook,
  },
  {
    id: "quickbooks",
    name: "QuickBooks Online",
    type: "erp",
    description: "SME supplier accounting and invoice reconciliation.",
    status: "disconnected",
    icon: FileText,
  },
  {
    id: "cloudbeds",
    name: "Cloudbeds",
    type: "pms",
    description: "Boutique hotel and hostel property management.",
    status: "disconnected",
    icon: Server,
  },
];

export function EtaIntegrations() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS);
  const [connecting, setConnecting] = useState<string | null>(null);

  const toggleConnection = async (id: string) => {
    setConnecting(id);
    await new Promise((r) => setTimeout(r, 1200));
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: i.status === "connected" ? "disconnected" : "connected",
              lastSync: i.status === "disconnected" ? "Just now" : undefined,
            }
          : i
      )
    );
    setConnecting(null);
  };

  const byType = {
    eta: integrations.filter((i) => i.type === "eta"),
    pms: integrations.filter((i) => i.type === "pms"),
    erp: integrations.filter((i) => i.type === "erp"),
    webhook: integrations.filter((i) => i.type === "webhook"),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Integration Hub</h3>
          <p className="text-[11px] text-white/30 mt-0.5">
            Connect your existing PMS, ERP, and compliance systems
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400/70">
            <CheckCircle2 size={11} />
            {integrations.filter((i) => i.status === "connected").length} connected
          </span>
          <span className="flex items-center gap-1 text-white/20">
            <Clock size={11} />
            {integrations.filter((i) => i.status === "pending").length} pending
          </span>
        </div>
      </div>

      <IntegrationGroup title="ETA Compliance" items={byType.eta} connecting={connecting} onToggle={toggleConnection} />
      <IntegrationGroup title="Hotel PMS" items={byType.pms} connecting={connecting} onToggle={toggleConnection} />
      <IntegrationGroup title="Supplier ERP" items={byType.erp} connecting={connecting} onToggle={toggleConnection} />
      <IntegrationGroup title="Webhooks & Sync" items={byType.webhook} connecting={connecting} onToggle={toggleConnection} />
    </div>
  );
}

function IntegrationGroup({
  title,
  items,
  connecting,
  onToggle,
}: {
  title: string;
  items: Integration[];
  connecting: string | null;
  onToggle: (id: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <h4 className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            className="glass-card p-4 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                  <item.icon size={16} className="text-white/40" />
                </div>
                <div>
                  <h5 className="text-[13px] font-semibold text-white/90">{item.name}</h5>
                  <StatusBadge status={item.status} />
                </div>
              </div>
              <button
                onClick={() => onToggle(item.id)}
                disabled={connecting === item.id}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                  item.status === "connected"
                    ? "bg-white/[0.03] border-white/[0.08] text-white/50 hover:text-white/80"
                    : "bg-accent-base/15 border-accent-base/25 text-accent-base hover:bg-accent-base/25"
                }`}
              >
                {connecting === item.id ? (
                  <RefreshCw size={11} className="animate-spin" />
                ) : item.status === "connected" ? (
                  "Disconnect"
                ) : (
                  "Connect"
                )}
              </button>
            </div>
            <p className="text-[11px] text-white/30 leading-relaxed mb-2">{item.description}</p>
            {item.lastSync && (
              <div className="flex items-center gap-1 text-[10px] text-white/20">
                <RefreshCw size={9} />
                Last sync: {item.lastSync}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Integration["status"] }) {
  const config = {
    connected: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    disconnected: { icon: XCircle, color: "text-white/25", bg: "bg-white/[0.02]", border: "border-white/[0.06]" },
    pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    error: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider border ${c.bg} ${c.color} ${c.border}`}>
      <c.icon size={8} />
      {status}
    </span>
  );
}
