export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";

async function fetchAgents() {
  const supabase = await createClient();
  if (!supabase) return { audit: [], alerts: [] };
  const [auditRes, alertsRes] = await Promise.all([
    supabase.from("agent_audit_log").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("alerts").select("*").order("created_at", { ascending: false }).limit(20),
  ]);
  return { audit: auditRes.data || [], alerts: alertsRes.data || [] };
}

export default async function AgentsPage() {
  const { audit, alerts } = await fetchAgents();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Agents & Monitoring</h1>
        <p className="text-sm text-foreground-secondary mt-1">Agent audit log and alerts</p>
      </div>
      {audit.length === 0 && alerts.length === 0 ? (
        <div className="rounded-xl border p-8 text-center text-foreground-secondary">
          No agent data available (Supabase not configured)
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border p-4">
            <h2 className="text-lg font-semibold mb-4">Audit Log</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {audit.map((a, i) => (
                <div key={i} className="p-3 bg-surface-raised rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-base/10 text-purple-base">
                      {a.action}
                    </span>
                    <span className="text-sm font-mono">{a.agent_name}</span>
                  </div>
                  <span className="text-xs text-foreground-secondary">
                    {a.created_at ? new Date(a.created_at).toLocaleString("en-EG") : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border p-4">
            <h2 className="text-lg font-semibold mb-4">Alerts</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {alerts.map((a, i) => (
                <div key={i} className="p-3 bg-surface-raised rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-warning-bg text-warning">
                      {a.severity}
                    </span>
                    <span className="text-sm">{a.message}</span>
                  </div>
                  <span className="text-xs text-foreground-secondary">
                    {a.created_at ? new Date(a.created_at).toLocaleString("en-EG") : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
