"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/lib/toast";

interface SpendRequest {
  id: string;
  requestNumber: string;
  status: string;
  total: number;
  subtotal: number;
  vatAmount: number;
  currency: string;
  gatekeeperScore: number | null;
  gatekeeperDecision: string | null;
  createdAt: string;
  Hotel: { name: string };
  Requester: { name: string; email: string };
  PreferredSupplier: { name: string } | null;
  _count: { logs: number };
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-500",
  SUBMITTED: "bg-blue-500",
  GATEKEEPER_EVALUATING: "bg-yellow-500",
  PENDING_APPROVAL: "bg-orange-500",
  APPROVED: "bg-green-500",
  REJECTED: "bg-red-500",
  CONVERTED_TO_ORDER: "bg-purple-500",
  CANCELLED: "bg-gray-400",
};

export default function SpendRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<SpendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const res = await fetch("/api/v1/spend-requests?limit=50");
      const json = await res.json();
      if (json.success) setRequests(json.data);
      else toast.error(json.error || "Failed to load");
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  const filtered = filter === "ALL" ? requests : requests.filter((r) => r.status === filter);

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "PENDING_APPROVAL").length,
    approved: requests.filter((r) => r.status === "APPROVED").length,
    rejected: requests.filter((r) => r.status === "REJECTED").length,
    draft: requests.filter((r) => r.status === "DRAFT").length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pre-Spend Gatekeeper</h1>
        <Button onClick={() => router.push("/hotel/spend-requests/new")}>New Spend Request</Button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{stats.total}</div><p className="text-sm text-muted-foreground">Total</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-orange-600">{stats.pending}</div><p className="text-sm text-muted-foreground">Pending</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{stats.approved}</div><p className="text-sm text-muted-foreground">Approved</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-red-600">{stats.rejected}</div><p className="text-sm text-muted-foreground">Rejected</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-gray-600">{stats.draft}</div><p className="text-sm text-muted-foreground">Drafts</p></CardContent></Card>
      </div>

      <div className="flex gap-2">
        {["ALL", "DRAFT", "PENDING_APPROVAL", "APPROVED", "REJECTED", "CONVERTED_TO_ORDER"].map((s) => (
          <Button key={s} variant={filter === s ? "default" : "outline"} size="sm" onClick={() => setFilter(s)}>
            {s.replace(/_/g, " ")}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((req) => (
            <Card key={req.id} className="cursor-pointer hover:bg-muted/50" onClick={() => router.push(`/hotel/spend-requests/${req.id}`)}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold">{req.requestNumber}</span>
                    <Badge className={statusColors[req.status] || "bg-gray-500"}>{req.status.replace(/_/g, " ")}</Badge>
                    {req.gatekeeperScore !== null && (
                      <Badge variant="outline" className={req.gatekeeperScore >= 70 ? "border-green-500 text-green-600" : req.gatekeeperScore >= 40 ? "border-yellow-500 text-yellow-600" : "border-red-500 text-red-600"}>
                        Score: {req.gatekeeperScore}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {req.Hotel.name} · {req.Requester.name} · {new Date(req.createdAt).toLocaleDateString("en-GB")}
                  </p>
                  {req.PreferredSupplier && (
                    <p className="text-xs text-muted-foreground">Supplier: {req.PreferredSupplier.name}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{req.total.toLocaleString("en-GB", { minimumFractionDigits: 2 })} {req.currency}</div>
                  <div className="text-xs text-muted-foreground">
                    Sub: {req.subtotal.toLocaleString("en-GB", { minimumFractionDigits: 2 })} · VAT: {req.vatAmount.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No spend requests found.</p>}
        </div>
      )}
    </div>
  );
}
