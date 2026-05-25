"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/lib/toast";
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, ShoppingCart } from "lucide-react";

interface SpendRequestDetail {
  id: string;
  requestNumber: string;
  status: string;
  subtotal: number;
  vatAmount: number;
  total: number;
  currency: string;
  gatekeeperDecision: string | null;
  gatekeeperScore: number | null;
  gatekeeperReasons: string | null;
  gatekeeperEvaluatedAt: string | null;
  requiredApproverRole: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  deliveryDate: string | null;
  deliveryInstructions: string | null;
  costCenter: string | null;
  createdAt: string;
  Hotel: { name: string; tier: string };
  Property: { name: string } | null;
  Outlet: { name: string } | null;
  Requester: { name: string; email: string; role: string };
  ApprovedBy: { name: string; email: string } | null;
  PreferredSupplier: { name: string; complianceStatus: string; rating: number } | null;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    Product: { name: string; sku: string; category: string } | null;
    aiSuggestions: string | null;
  }>;
  logs: Array<{
    id: string;
    event: string;
    decision: string | null;
    score: number | null;
    details: string | null;
    createdAt: string;
    Actor: { name: string } | null;
  }>;
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

export default function SpendRequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [req, setReq] = useState<SpendRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  async function fetchDetail() {
    try {
      const res = await fetch(`/api/v1/spend-requests/${id}`);
      const json = await res.json();
      if (json.success) setReq(json.data);
      else toast.error(json.error || "Failed to load");
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function evaluate() {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/spend-requests/${id}/evaluate`, { method: "POST" });
      const json = await res.json();
      if (json.success) {
        toast.success("Evaluation complete");
        fetchDetail();
      } else {
        toast.error(json.error || "Evaluation failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setActionLoading(false);
    }
  }

  async function approve() {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/spend-requests/${id}/approve`, { method: "POST" });
      const json = await res.json();
      if (json.success) {
        toast.success("Approved");
        fetchDetail();
      } else {
        toast.error(json.error || "Approval failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setActionLoading(false);
    }
  }

  async function reject() {
    const reason = prompt("Rejection reason:");
    if (reason === null) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/spend-requests/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Rejected");
        fetchDetail();
      } else {
        toast.error(json.error || "Rejection failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setActionLoading(false);
    }
  }

  async function convert() {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/spend-requests/${id}/convert`, { method: "POST" });
      const json = await res.json();
      if (json.success) {
        toast.success(`Converted to order ${json.data.orderNumber}`);
        fetchDetail();
      } else {
        toast.error(json.error || "Conversion failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <Skeleton className="h-96 w-full" />;
  if (!req) return <div className="p-6">Not found</div>;

  const reasons = req.gatekeeperReasons ? JSON.parse(req.gatekeeperReasons) : [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.push("/hotel/spend-requests")}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold">{req.requestNumber}</h1>
        <Badge className={statusColors[req.status] || "bg-gray-500"}>{req.status.replace(/_/g, " ")}</Badge>
        {req.gatekeeperScore !== null && (
          <Badge variant="outline" className={req.gatekeeperScore >= 70 ? "border-green-500 text-green-600" : req.gatekeeperScore >= 40 ? "border-yellow-500 text-yellow-600" : "border-red-500 text-red-600"}>
            Gatekeeper Score: {req.gatekeeperScore}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Financials</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold">{req.total.toLocaleString("en-GB", { minimumFractionDigits: 2 })} {req.currency}</div>
            <div className="text-sm text-muted-foreground">Subtotal: {req.subtotal.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</div>
            <div className="text-sm text-muted-foreground">VAT (14%): {req.vatAmount.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Requester</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            <div className="font-medium">{req.Requester.name}</div>
            <div className="text-sm text-muted-foreground">{req.Requester.email}</div>
            <div className="text-sm text-muted-foreground">Role: {req.Requester.role}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Location</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            <div className="font-medium">{req.Hotel.name}</div>
            {req.Property && <div className="text-sm text-muted-foreground">{req.Property.name}</div>}
            {req.Outlet && <div className="text-sm text-muted-foreground">{req.Outlet.name}</div>}
            {req.costCenter && <div className="text-sm text-muted-foreground">Cost Center: {req.costCenter}</div>}
          </CardContent>
        </Card>
      </div>

      {req.PreferredSupplier && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Preferred Supplier</CardTitle></CardHeader>
          <CardContent>
            <div className="font-medium">{req.PreferredSupplier.name}</div>
            <div className="text-sm text-muted-foreground">Compliance: {req.PreferredSupplier.complianceStatus} · Rating: {req.PreferredSupplier.rating}</div>
          </CardContent>
        </Card>
      )}

      {reasons.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Gatekeeper Flags</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {reasons.map((r: string, i: number) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5">⚠</span>
                  {r}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Items</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2">Qty</th>
                <th className="text-right py-2">Unit Price</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {req.items.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-2">
                    <div className="font-medium">{item.description}</div>
                    {item.Product && <div className="text-xs text-muted-foreground">{item.Product.name} · {item.Product.sku}</div>}
                  </td>
                  <td className="text-right py-2">{item.quantity}</td>
                  <td className="text-right py-2">{item.unitPrice.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</td>
                  <td className="text-right py-2 font-medium">{item.total.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Audit Log</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {req.logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between text-sm border-b last:border-0 py-2">
                <div>
                  <span className="font-medium">{log.event}</span>
                  {log.decision && <Badge variant="outline" className="ml-2 text-xs">{log.decision}</Badge>}
                  {log.Actor && <span className="text-muted-foreground ml-2">by {log.Actor.name}</span>}
                </div>
                <div className="text-muted-foreground text-xs">{new Date(log.createdAt).toLocaleString("en-GB")}</div>
              </div>
            ))}
            {req.logs.length === 0 && <p className="text-muted-foreground text-sm">No logs yet.</p>}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        {req.status === "DRAFT" && (
          <Button onClick={evaluate} disabled={actionLoading}>
            <RefreshCw className="w-4 h-4 mr-1" /> Evaluate
          </Button>
        )}
        {req.status === "PENDING_APPROVAL" && (
          <>
            <Button onClick={approve} disabled={actionLoading} variant="default">
              <CheckCircle className="w-4 h-4 mr-1" /> Approve
            </Button>
            <Button onClick={reject} disabled={actionLoading} variant="destructive">
              <XCircle className="w-4 h-4 mr-1" /> Reject
            </Button>
          </>
        )}
        {req.status === "APPROVED" && (
          <Button onClick={convert} disabled={actionLoading}>
            <ShoppingCart className="w-4 h-4 mr-1" /> Convert to Order
          </Button>
        )}
      </div>
    </div>
  );
}
