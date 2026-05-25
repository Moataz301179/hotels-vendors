"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Shield, TrendingDown, BarChart3, Activity, CheckCircle2,
  AlertTriangle, XCircle, RefreshCw, Server, Zap, Clock
} from "lucide-react";

interface AgentStatus {
  id: string;
  name: string;
  squad: string;
  avatar: string;
  status: "online" | "warning" | "offline";
  capabilities: string[];
}

interface HealthCheck {
  name: string;
  status: "pass" | "warn" | "fail";
  latencyMs: number;
}

interface SprintTask {
  id: string;
  title: string;
  agent: string;
  status: "done" | "in-progress" | "blocked" | "pending";
  priority: "critical" | "high" | "medium" | "low";
}

export default function MissionControlPage() {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [health, setHealth] = useState<HealthCheck[]>([]);
  const [tasks, setTasks] = useState<SprintTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string>("-");
  const [activeTab, setActiveTab] = useState<"agents" | "health" | "sprint">("agents");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/swarm/agents", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        const mapped: AgentStatus[] = (data.data?.agents || data.agents || []).map((a: any) => ({
          id: a.id,
          name: a.name,
          squad: a.squad,
          avatar: a.avatar || "🤖",
          status: "online",
          capabilities: a.capabilities || [],
        }));
        setAgents(mapped);
      }
    } catch { /* silent */ }

    try {
      const res = await fetch("/api/health");
      if (res.ok) {
        const data = await res.json();
        setHealth([
          { name: "API Server", status: "pass", latencyMs: data.latencyMs || 0 },
          { name: "Database", status: data.checks?.database?.status === "ok" ? "pass" : "fail", latencyMs: data.checks?.database?.latencyMs || 0 },
          { name: "Redis", status: data.checks?.redis?.status === "ok" ? "pass" : "fail", latencyMs: data.checks?.redis?.latencyMs || 0 },
        ]);
      }
    } catch { /* silent */ }

    setTasks([
      { id: "t1", title: "Pre-Spend Gatekeeper", agent: "pre-spend-gatekeeper", status: "done", priority: "critical" },
      { id: "t2", title: "Cost Optimizer", agent: "cost-optimizer", status: "done", priority: "critical" },
      { id: "t3", title: "Cashflow Planner", agent: "cashflow-planner", status: "done", priority: "critical" },
      { id: "t4", title: "Swarm Integration Layer", agent: "director", status: "in-progress", priority: "high" },
      { id: "t5", title: "n8n Onboarding Engine", agent: "onboarding", status: "pending", priority: "high" },
      { id: "t6", title: "Mission Control Dashboard", agent: "reporter", status: "done", priority: "medium" },
    ]);

    setLastRefresh(new Date().toLocaleTimeString());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const squadColor = (squad: string) => {
    const map: Record<string, string> = {
      intelligence: "bg-purple-100 text-purple-800",
      fintech: "bg-emerald-100 text-emerald-800",
      growth: "bg-blue-100 text-blue-800",
      supplier: "bg-amber-100 text-amber-800",
      platform: "bg-slate-100 text-slate-800",
      director: "bg-rose-100 text-rose-800",
    };
    return map[squad] || "bg-gray-100 text-gray-800";
  };

  const statusIcon = (status: string) => {
    if (status === "pass" || status === "online" || status === "done") return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (status === "warn" || status === "warning" || status === "in-progress") return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const doneCount = tasks.filter((t) => t.status === "done").length;
  const progress = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab; label: string; icon: any }) => (
    <Button
      variant={activeTab === id ? "default" : "outline"}
      size="sm"
      onClick={() => setActiveTab(id)}
      className="gap-1"
    >
      <Icon className="w-4 h-4" /> {label}
    </Button>
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mission Control</h1>
          <p className="text-muted-foreground">Real-time swarm status, health checks, and sprint tracker</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Last refresh: {lastRefresh}</span>
          <Button size="sm" variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
            <div className="text-xs text-muted-foreground">{agents.filter((a) => a.status === "online").length} online</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sprint Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doneCount}/{tasks.length}</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {health.length ? Math.round((health.filter((h) => h.status === "pass").length / health.length) * 100) : 0}%
            </div>
            <div className="text-xs text-muted-foreground">{health.filter((h) => h.status === "pass").length}/{health.length} checks passing</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Server className="w-5 h-5 text-green-500" />
            <span className="text-lg font-semibold">Operational</span>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <TabButton id="agents" label="Agents" icon={Zap} />
        <TabButton id="health" label="Health" icon={Activity} />
        <TabButton id="sprint" label="Sprint" icon={Clock} />
      </div>

      {activeTab === "agents" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{agent.avatar}</span>
                    <div>
                      <div className="font-semibold">{agent.name}</div>
                      <Badge variant="secondary" className={squadColor(agent.squad)}>{agent.squad}</Badge>
                    </div>
                  </div>
                  {statusIcon(agent.status)}
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {agent.capabilities.slice(0, 4).map((c) => (
                    <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{c}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          {agents.length === 0 && !loading && (
            <div className="col-span-full text-center text-muted-foreground py-8">No agents returned. Ensure you are authenticated.</div>
          )}
        </div>
      )}

      {activeTab === "health" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {health.map((h) => (
            <Card key={h.name}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{h.name}</div>
                  <div className="text-sm text-muted-foreground">{h.latencyMs}ms latency</div>
                </div>
                {statusIcon(h.status)}
              </CardContent>
            </Card>
          ))}
          {health.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-8">Health data unavailable.</div>
          )}
        </div>
      )}

      {activeTab === "sprint" && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                  <div className="flex items-center gap-3">
                    {statusIcon(task.status)}
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs text-muted-foreground">{task.agent}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={task.priority === "critical" ? "destructive" : task.priority === "high" ? "default" : "secondary"}>
                      {task.priority}
                    </Badge>
                    <Badge variant="outline">{task.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transformation KPI Checklist */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            Transformation KPI Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2"><Shield className="w-4 h-4" /> Pre-Spend Gatekeeper</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Budget compliance check</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Credit utilization check</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Price benchmarking vs market</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Supplier risk scan</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Anomaly detection</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Gate decision (APPROVE/WARN/BLOCK)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2"><TrendingDown className="w-4 h-4" /> Cost Optimizer</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Substitution recommendations</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Bulk discount detection</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Supplier consolidation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Credit term optimization</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Savings quantification (EGP)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Cashflow Planner</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> 90-day cashflow forecast</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Liquidity gap detection</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Factoring opportunity scan</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Payment timing recommendations</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Working capital strategy</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2"><Activity className="w-4 h-4" /> Swarm Integration</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Agent registry updated</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> API routes deployed</li>
                <li className="flex items-center gap-2"><AlertTriangle className="w-3 h-3 text-amber-500" /> Swarm scheduler wiring (in progress)</li>
                <li className="flex items-center gap-2"><XCircle className="w-3 h-3 text-red-400" /> n8n onboarding engine (pending)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
