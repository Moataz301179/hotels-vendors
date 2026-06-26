"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Truck, MapPin, Phone, Clock, ChevronRight, PackageCheck } from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { useRouter } from "next/navigation";

interface DeliveryJob {
  id: string;
  jobNumber: string;
  status: string;
  pickupAddress: string;
  deliveryAddress: string;
  deliveryContact: string | null;
  deliveryPhone: string | null;
  deliveryDate: string | null;
  order: { id: string; orderNumber: string };
  tripStop: { id: string; hotel: { id: string; name: string } } | null;
}

const STATUS_COLORS: Record<string, string> = {
  ASSIGNED: "var(--warning)",
  ACCEPTED_BY_CARRIER: "#60a5fa",
  PICKED_UP: "#c084fc",
  IN_TRANSIT: "var(--accent-base)",
  ARRIVED: "#fb923c",
  DELIVERED: "var(--success)",
  FAILED: "var(--error)",
  CANCELLED: "var(--text-muted)",
  RETURNED: "var(--error)",
};

const FILTER_CHIPS = [
  { label: "All", value: "" },
  { label: "Assigned", value: "ASSIGNED" },
  { label: "In Transit", value: "IN_TRANSIT" },
  { label: "Arrived", value: "ARRIVED" },
  { label: "Delivered", value: "DELIVERED" },
] as const;

export default function DriverDeliveriesPage() {
  const [filter, setFilter] = useState("");
  const router = useRouter();

  const url = filter
    ? `/api/v1/deliveries?limit=50&status=${filter}`
    : `/api/v1/deliveries?limit=50`;

  const { data, loading, refetch } = useApi<{ deliveries: DeliveryJob[]; pagination: { total: number } }>(url);
  const deliveries = data?.deliveries || [];

  return (
    <div className="space-y-4 pt-2">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <Truck size={20} style={{ color: "var(--accent-base)" }} />
          My Deliveries
        </h1>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          {data?.pagination.total || 0} jobs assigned
        </p>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip.value}
            onClick={() => setFilter(chip.value)}
            className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: filter === chip.value ? "var(--accent-base)" : "var(--bg-surface-1)",
              color: filter === chip.value ? "#000" : "var(--text-muted)",
              border: `1px solid ${filter === chip.value ? "var(--accent-base)" : "var(--border-subtle)"}`,
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-4 animate-pulse"
              style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
            >
              <div className="h-4 w-32 rounded mb-2" style={{ background: "var(--border-subtle)" }} />
              <div className="h-3 w-48 rounded" style={{ background: "var(--border-subtle)" }} />
            </div>
          ))}
        </div>
      ) : deliveries.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
        >
          <PackageCheck size={40} className="mx-auto mb-3 opacity-20" style={{ color: "var(--text-muted)" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>No delivery jobs found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deliveries.map((job) => (
            <motion.button
              key={job.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => router.push(`/deliveries/${job.id}`)}
              className="w-full text-left rounded-2xl p-4 transition-colors"
              style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {job.jobNumber}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                      style={{
                        color: STATUS_COLORS[job.status] || "var(--text-muted)",
                        background: `${STATUS_COLORS[job.status] || "var(--text-muted)"}15`,
                      }}
                    >
                      {job.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
              </div>

              <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                <MapPin size={12} />
                <span className="truncate">{job.deliveryAddress}</span>
              </div>

              {job.deliveryContact && (
                <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                  <Phone size={12} />
                  <span>{job.deliveryContact}</span>
                  {job.deliveryPhone && <span className="opacity-60">{job.deliveryPhone}</span>}
                </div>
              )}

              {job.deliveryDate && (
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  <Clock size={12} />
                  <span>{new Date(job.deliveryDate).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
