"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Truck, Phone, Car, LogOut, Shield, Info } from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { useRouter } from "next/navigation";

interface DriverProfile {
  name: string;
  email: string;
  carrierName: string;
  driverPhone: string | null;
  vehiclePlate: string | null;
}

interface DriverStats {
  assignedCount: number;
  inTransitCount: number;
  deliveredCount: number;
  pendingGrns: number;
}

export default function DriverProfilePage() {
  const router = useRouter();
  const { data: profileData } = useApi<{ profile: DriverProfile }>("/api/v1/driver/stats");
  const { data: statsData } = useApi<{ stats: DriverStats }>("/api/v1/driver/stats");

  const profile = profileData?.profile;
  const stats = statsData?.stats;

  const handleSignOut = async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      // continue regardless
    }
    router.push("/login");
  };

  return (
    <div className="space-y-5 pt-4">
      {/* Profile header */}
      <div
        className="rounded-2xl p-5 text-center"
        style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
      >
        <div
          className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
          style={{ background: "var(--accent-base)", color: "#000" }}
        >
          <User size={28} />
        </div>
        <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
          {profile?.name || "Driver"}
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          {profile?.email || ""}
        </p>
        {profile?.carrierName && (
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <Truck size={12} style={{ color: "var(--accent-base)" }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{profile.carrierName}</span>
          </div>
        )}
      </div>

      {/* Info cards */}
      <div
        className="rounded-2xl p-4 space-y-3"
        style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
      >
        {profile?.driverPhone && (
          <div className="flex items-center gap-3">
            <Phone size={16} style={{ color: "var(--text-muted)" }} />
            <div>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Phone</p>
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>{profile.driverPhone}</p>
            </div>
          </div>
        )}
        {profile?.vehiclePlate && (
          <div className="flex items-center gap-3">
            <Car size={16} style={{ color: "var(--text-muted)" }} />
            <div>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Vehicle Plate</p>
              <p className="text-sm font-mono font-semibold" style={{ color: "var(--text-primary)" }}>{profile.vehiclePlate}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Shield size={16} style={{ color: "var(--text-muted)" }} />
          <div>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Role</p>
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>Driver</p>
          </div>
        </div>
      </div>

      {/* Today's stats summary */}
      {stats && (
        <div
          className="rounded-2xl p-4"
          style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
        >
          <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            Today&apos;s Summary
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{stats.deliveredCount}</p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Delivered</p>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{stats.inTransitCount}</p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>In Transit</p>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{stats.assignedCount}</p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Assigned</p>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{stats.pendingGrns}</p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Pending GRNs</p>
            </div>
          </div>
        </div>
      )}

      {/* App info */}
      <div
        className="rounded-2xl p-4 flex items-center gap-3"
        style={{ background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)" }}
      >
        <Info size={16} style={{ color: "var(--text-muted)" }} />
        <div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>HotelsVendors Driver v1.0.0</p>
          <span
            className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
            style={{ background: "var(--accent-base)", color: "#000" }}
          >
            Driver Mode
          </span>
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-medium"
        style={{ background: "var(--bg-surface-1)", color: "var(--error)", border: "1px solid var(--border-subtle)" }}
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  );
}
