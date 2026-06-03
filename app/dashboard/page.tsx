"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  PieChart,
  Bot,
  Globe,
  Send,
  Copy,
  Sparkles,
  TrendingUp,
  Truck,
  BrainCircuit,
  ArrowRightLeft,
  Ship,
  Landmark,
  Eye,
  Loader2,
  Zap,
  ScanLine,
  Activity,
  SatelliteDish,
  CreditCard,
  PackageOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────
type TabKey = "ledger" | "copilot" | "scanner";

interface ChatMessage {
  id: number;
  role: "system" | "user" | "assistant";
  text: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────
const TXNS = [
  {
    id: "TXN-80321",
    vendor: "Grand Ritz Linens",
    category: "Textiles",
    state: "Factored",
    sum: "$18,450.00",
    stateColor: "text-lime-400",
    stateBg: "bg-lime-500/10",
  },
  {
    id: "TXN-79540",
    vendor: "EquipSupply Hardware",
    category: "Equipment",
    state: "Under Review",
    sum: "$4,120.00",
    stateColor: "text-amber-400",
    stateBg: "bg-amber-500/10",
  },
];

const OPERATIONS = [
  {
    label: "Hotels → Vendors",
    stat: "14 Active",
    icon: ArrowRightLeft,
    bar: 65,
  },
  {
    label: "Vendors → Shipping",
    stat: "8 In Transit",
    icon: Ship,
    bar: 42,
  },
  {
    label: "Shipping → Financiers",
    stat: "3 Settled Today",
    icon: Landmark,
    bar: 28,
  },
];

const COPILOT_ACTIONS = [
  {
    title: "Factoring Balance Optimizer",
    desc: "Reconcile outstanding balances across ledgers",
    icon: TrendingUp,
  },
  {
    title: "Draft Procurement Request",
    desc: "Auto-generate RFQ from inventory signals",
    icon: FileTextIcon,
  },
  {
    title: "Resolve Carrier Delay",
    desc: "Surface alternative logistics providers",
    icon: Truck,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────
function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function PingDot() {
  return (
    <span className="relative flex h-2 w-2 mr-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500" />
    </span>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("ledger");

  // Copilot state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "system",
      text: "Hello Moataz. I am the HotelsVendors Intelligent Assistant. I can optimize your factoring balances, draft procurement requests, and resolve carrier delays in real time. How can I assist your operations today?",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [thinking, setThinking] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Prompt architect state
  const [promptInput, setPromptInput] = useState("");
  const [promptOutput, setPromptOutput] = useState(
    `// Generated prompt will appear here\n// Example:\n{\n  "system": "You are a supply-chain analyst...",\n  "instruction": "Analyze the following ledger..."\n}`
  );
  const [copied, setCopied] = useState(false);

  // Scanner state
  const [scannerText, setScannerText] = useState(
    "Select one of the three real-time market scanners to surface actionable intelligence on global shipping rates, fintech factoring trends, and vendor cost benchmarks."
  );
  const [scannerLoading, setScannerLoading] = useState(false);
  const [scannerQuery, setScannerQuery] = useState("");

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now(),
      role: "user",
      text: inputVal.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: "Acknowledged. I have queued that request for analysis. A detailed report will be ready in your Ledger Hub within 60 seconds.",
        },
      ]);
    }, 1800);
  };

  const handleGeneratePrompt = () => {
    if (!promptInput.trim()) return;
    setPromptOutput(
      `{\n  "system": "You are an elite supply-chain AI architect embedded in HotelsVendors.",\n  "context": "${promptInput.trim()}",\n  "constraints": ["Use live ledger data", "Factor risk-weighted returns", "Limit to 3 action items"],\n  "output_format": "structured_json"\n}`
    );
  };

  const handleScanner = (type: string) => {
    setScannerLoading(true);
    setScannerText("Scanning global data feeds...");
    setTimeout(() => {
      setScannerLoading(false);
      if (type === "shipping") {
        setScannerText(
          "[Shipping & Logistics] Asia-Europe rates down 4.2% WoW. Trans-Pacific capacity +6%. Recommended action: Lock 30-day FCL contracts via preferred forwarders."
        );
      } else if (type === "fintech") {
        setScannerText(
          "[Fintech Factoring Rates] Average advance rate: 87.3%. Discount rate spread: 1.4% – 3.1%. Top performer: Dynamic Discounting (11.4% effective yield)."
        );
      } else {
        setScannerText(
          "[Vendor Cost Metrics] Linens category deflationary (-2.1%). Hardware stable. Energy surcharges +8% across transport vendors. Renegotiate Q3 contracts."
        );
      }
    }, 1200);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(promptOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── Render ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#030712] text-white font-sans overflow-hidden selection:bg-lime-500/30">
      {/* ── Left Sidebar ── */}
      <aside className="w-full md:w-48 bg-[#030712] border-r border-white/5 flex flex-col p-4 shrink-0">
        {/* Status */}
        <div className="flex items-center mb-6">
          <div className="flex items-center bg-[#0a111e] border border-white/5 rounded-full px-3 py-1.5">
            <PingDot />
            <span className="text-[10px] uppercase tracking-widest text-white/80 font-medium">
              System: SYNCED
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col space-y-1">
          <SidebarBtn
            active={activeTab === "ledger"}
            onClick={() => setActiveTab("ledger")}
            icon={<PieChart className="w-3.5 h-3.5" />}
            label="Ledger Hub"
          />
          <SidebarBtn
            active={activeTab === "copilot"}
            onClick={() => setActiveTab("copilot")}
            icon={
              <Bot
                className={`w-3.5 h-3.5 ${
                  activeTab === "copilot"
                    ? "text-lime-400 animate-pulse"
                    : ""
                }`}
              />
            }
            label="AI Copilot"
          />
          <SidebarBtn
            active={activeTab === "scanner"}
            onClick={() => setActiveTab("scanner")}
            icon={
              <Globe
                className={`w-3.5 h-3.5 ${
                  activeTab === "scanner" ? "text-lime-400" : ""
                }`}
              />
            }
            label="Market Intelligence"
          />
        </nav>

        <div className="flex-1" />

        {/* Operator */}
        <div className="mt-auto pt-4 border-t border-white/5">
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">
            Active Operator
          </p>
          <p className="text-[11px] text-white font-semibold">Moataz (Admin)</p>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-black/10 space-y-6">
        {activeTab === "ledger" && <LedgerTab />}
        {activeTab === "copilot" && (
          <CopilotTab
            messages={messages}
            thinking={thinking}
            inputVal={inputVal}
            setInputVal={setInputVal}
            onSend={handleSend}
            chatScrollRef={chatScrollRef}
          />
        )}
        {activeTab === "scanner" && (
          <ScannerTab
            scannerText={scannerText}
            scannerLoading={scannerLoading}
            scannerQuery={scannerQuery}
            setScannerQuery={setScannerQuery}
            onScan={handleScanner}
          />
        )}
      </main>

      {/* ── Right Panel ── */}
      <aside className="w-full lg:w-[450px] bg-[#030712] border-l border-white/5 p-4 md:p-6 flex flex-col overflow-y-auto shrink-0">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-lime-400" />
          <h2 className="text-[10px] uppercase tracking-widest text-white/80 font-semibold">
            Gemini Prompt Architect
          </h2>
        </div>

        <div className="space-y-3 mb-4">
          <label className="text-[9px] uppercase tracking-[0.2em] text-white/40 block">
            Custom Requirements
          </label>
          <textarea
            className="w-full bg-black/40 border border-white/5 rounded-lg p-3 text-[11px] text-white placeholder-white/20 focus:outline-none focus:border-lime-500/40 resize-none h-20"
            placeholder="Describe what you want the AI to analyze..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
          />
          <button
            onClick={handleGeneratePrompt}
            className="w-full bg-lime-500 hover:bg-lime-400 text-black text-[10px] uppercase tracking-widest font-bold py-2 rounded-lg transition-colors"
          >
            Generate Prompt
          </button>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/40">
            Output
          </span>
          <button
            onClick={copyPrompt}
            className="flex items-center space-x-1 text-[10px] text-white/50 hover:text-white transition-colors"
          >
            <Copy className="w-3 h-3" />
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
        <textarea
          readOnly
          className="w-full flex-1 min-h-[140px] bg-black/40 border border-white/5 rounded-lg p-3 font-mono text-[10px] text-lime-400/90 resize-none focus:outline-none"
          value={promptOutput}
        />

        <div className="mt-4 p-3 bg-[#0a111e]/80 border border-white/5 rounded-lg">
          <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1">
            Customizer Details
          </p>
          <p className="text-[10px] text-white/60 leading-relaxed">
            This panel builds structured zero-shot prompts for the Gemini API.
            Add domain context, constraints, and output formats to tune agent
            behavior without touching code.
          </p>
        </div>
      </aside>
    </div>
  );

  // ─── Sub-components ────────────────────────────────────────────────

  function SidebarBtn({
    active,
    onClick,
    icon,
    label,
  }: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
  }) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center space-x-2.5 w-full px-3 py-2.5 rounded-r-md text-left transition-all ${
          active
            ? "bg-[#0a111e] border-l-2 border-lime-500 text-white"
            : "text-white/50 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
        }`}
      >
        {icon}
        <span className="text-[11px] font-medium">{label}</span>
      </button>
    );
  }

  function LedgerTab() {
    return (
      <>
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <KpiCard
            label="Factored Balances"
            value="$412,890.00"
            change="+14.2%"
            changeUp
            icon={<TrendingUp className="w-3.5 h-3.5 text-lime-400" />}
          />
          <KpiCard
            label="Freight Operations"
            value="37"
            sub="Dispatched"
            icon={<Truck className="w-3.5 h-3.5 text-amber-400" />}
          />
          <KpiCard
            label="AI Capital Saving"
            value="11.4%"
            sub="Saved"
            icon={<BrainCircuit className="w-3.5 h-3.5 text-lime-400" />}
          />
        </div>

        {/* Operations + Table */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Active Operations */}
          <div className="lg:col-span-2 bg-[#0a111e]/80 border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] uppercase tracking-widest text-white/60 font-semibold">
                Active Operations
              </h3>
              <Activity className="w-3 h-3 text-white/30" />
            </div>
            <div className="space-y-3">
              {OPERATIONS.map((op) => (
                <div
                  key={op.label}
                  className="flex items-center space-x-3 bg-black/20 rounded-lg p-3 border border-white/5"
                >
                  <div className="p-1.5 bg-white/5 rounded-md">
                    <op.icon className="w-3.5 h-3.5 text-lime-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-white font-medium truncate">
                      {op.label}
                    </p>
                    <p className="text-[9px] text-white/40 uppercase tracking-wider">
                      {op.stat}
                    </p>
                  </div>
                  <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-lime-500 rounded-full"
                      style={{ width: `${op.bar}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions Table */}
          <div className="lg:col-span-3 bg-[#0a111e]/80 border border-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] uppercase tracking-widest text-white/60 font-semibold">
                Recent Transactions
              </h3>
              <span className="text-[9px] text-white/30 uppercase tracking-wider">
                Live Feed
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="pb-2 text-[9px] uppercase tracking-[0.2em] text-white/30 font-normal">
                      ID
                    </th>
                    <th className="pb-2 text-[9px] uppercase tracking-[0.2em] text-white/30 font-normal">
                      Vendor
                    </th>
                    <th className="pb-2 text-[9px] uppercase tracking-[0.2em] text-white/30 font-normal">
                      State
                    </th>
                    <th className="pb-2 text-[9px] uppercase tracking-[0.2em] text-white/30 font-normal text-right">
                      Sum
                    </th>
                    <th className="pb-2 text-[9px] uppercase tracking-[0.2em] text-white/30 font-normal text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {TXNS.map((t) => (
                    <tr key={t.id} className="group">
                      <td className="py-3 text-[10px] text-white/80 font-mono">
                        {t.id}
                      </td>
                      <td className="py-3">
                        <p className="text-[11px] text-white font-medium">
                          {t.vendor}
                        </p>
                        <p className="text-[9px] text-white/40">{t.category}</p>
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-medium ${t.stateColor} ${t.stateBg} border border-white/5`}
                        >
                          {t.state === "Factored" ? (
                            <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                          ) : (
                            <Clock className="w-2.5 h-2.5 mr-1" />
                          )}
                          {t.state}
                        </span>
                      </td>
                      <td className="py-3 text-[11px] text-white font-semibold text-right">
                        {t.sum}
                      </td>
                      <td className="py-3 text-right">
                        <button className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md border border-lime-500/20 bg-lime-500/5 text-lime-400 text-[9px] uppercase tracking-wider font-medium hover:bg-lime-500 hover:text-black transition-all">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>AI Gen Visual</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  }

  function KpiCard({
    label,
    value,
    sub,
    change,
    changeUp,
    icon,
  }: {
    label: string;
    value: string;
    sub?: string;
    change?: string;
    changeUp?: boolean;
    icon: React.ReactNode;
  }) {
    return (
      <div className="bg-[#0a111e]/80 border border-white/5 rounded-xl p-4 flex items-start justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">
            {label}
          </p>
          <p className="text-xl text-white font-bold tracking-tight">
            {value}
          </p>
          {sub && (
            <p className="text-[10px] text-white/50 mt-0.5">{sub}</p>
          )}
          {change && (
            <p
              className={`text-[10px] font-semibold mt-1 ${
                changeUp ? "text-lime-400" : "text-red-400"
              }`}
            >
              {change}
            </p>
          )}
        </div>
        <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
      </div>
    );
  }

  function CopilotTab({
    messages,
    thinking,
    inputVal,
    setInputVal,
    onSend,
    chatScrollRef,
  }: {
    messages: ChatMessage[];
    thinking: boolean;
    inputVal: string;
    setInputVal: (v: string) => void;
    onSend: () => void;
    chatScrollRef: React.RefObject<HTMLDivElement | null>;
  }) {
    return (
      <div className="flex flex-col h-full space-y-4">
        {/* Header Banner */}
        <div className="flex items-center justify-between bg-[#0a111e]/80 border border-white/5 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-lime-400" />
            <h2 className="text-xs font-semibold text-white">
              Smart Hub Optimizer
            </h2>
            <span className="text-[9px] text-white/40">(Gemini API)</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-lime-500/10 border border-lime-500/20 text-lime-400 text-[9px] uppercase tracking-wider font-medium">
            gemini-3-flash
          </span>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {COPILOT_ACTIONS.map((a) => (
            <button
              key={a.title}
              className="text-left bg-[#0a111e]/60 border border-white/5 hover:border-lime-500/30 rounded-xl p-3 transition-all group"
            >
              <div className="flex items-center space-x-2 mb-1.5">
                <a.icon className="w-3.5 h-3.5 text-lime-400 group-hover:text-lime-300" />
                <span className="text-[10px] text-white font-medium">
                  {a.title}
                </span>
              </div>
              <p className="text-[9px] text-white/40 leading-relaxed">
                {a.desc}
              </p>
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-black/40 border border-white/5 rounded-xl overflow-hidden min-h-[250px]">
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-[11px] leading-relaxed ${
                    m.role === "user"
                      ? "bg-lime-500 text-black font-medium"
                      : m.role === "system"
                      ? "bg-[#0a111e] border border-white/5 text-white/80"
                      : "bg-white/5 border border-white/5 text-white/80"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex justify-start">
                <div className="bg-[#0a111e] border border-white/5 rounded-lg px-3 py-2 flex items-center space-x-2">
                  <Loader2 className="w-3 h-3 text-lime-400 animate-spin" />
                  <span className="text-[10px] text-white/50">
                    Assistant is thinking...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-white/5 bg-black/20">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="flex-1 bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-[11px] text-white placeholder-white/20 focus:outline-none focus:border-lime-500/40"
                placeholder="Ask the AI Copilot..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSend()}
              />
              <button
                onClick={onSend}
                className="bg-lime-500 hover:bg-lime-400 text-black p-2 rounded-lg transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function ScannerTab({
    scannerText,
    scannerLoading,
    scannerQuery,
    setScannerQuery,
    onScan,
  }: {
    scannerText: string;
    scannerLoading: boolean;
    scannerQuery: string;
    setScannerQuery: (v: string) => void;
    onScan: (type: string) => void;
  }) {
    return (
      <div className="flex flex-col h-full space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-2 bg-[#0a111e]/80 border border-white/5 rounded-xl p-4">
          <Globe className="w-4 h-4 text-lime-400 animate-spin" />
          <h2 className="text-xs font-semibold text-white">
            Grounded Global Market Intelligence
          </h2>
        </div>

        {/* Scan Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ScanBtn
            icon={<Ship className="w-3.5 h-3.5" />}
            label="Shipping & Logistics"
            onClick={() => onScan("shipping")}
          />
          <ScanBtn
            icon={<CreditCard className="w-3.5 h-3.5" />}
            label="Fintech Factoring Rates"
            onClick={() => onScan("fintech")}
          />
          <ScanBtn
            icon={<PackageOpen className="w-3.5 h-3.5" />}
            label="Vendor Cost Metrics"
            onClick={() => onScan("vendor")}
          />
        </div>

        {/* Output Area */}
        <div className="flex-1 flex flex-col bg-black/40 border border-white/5 rounded-xl overflow-hidden min-h-[200px]">
          <div className="flex-1 p-4 overflow-y-auto">
            {scannerLoading ? (
              <div className="flex items-center space-x-2 text-white/40">
                <ScanLine className="w-3.5 h-3.5 animate-pulse text-lime-400" />
                <span className="text-[11px]">Scanning data feeds...</span>
              </div>
            ) : (
              <p className="text-[11px] text-white/70 leading-relaxed whitespace-pre-wrap">
                {scannerText}
              </p>
            )}
          </div>
          <div className="p-3 border-t border-white/5 bg-black/20">
            <div className="flex items-center space-x-2">
              <SatelliteDish className="w-3 h-3 text-white/20" />
              <input
                type="text"
                className="flex-1 bg-transparent text-[11px] text-white placeholder-white/20 focus:outline-none"
                placeholder="Enter custom market query..."
                value={scannerQuery}
                onChange={(e) => setScannerQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function ScanBtn({
    icon,
    label,
    onClick,
  }: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }) {
    return (
      <button
        onClick={onClick}
        className="flex items-center justify-center space-x-2 bg-[#0a111e]/60 border border-white/5 hover:border-lime-500/30 hover:bg-lime-500/5 rounded-xl py-3 transition-all group"
      >
        <span className="text-lime-400 group-hover:text-lime-300">
          {icon}
        </span>
        <span className="text-[10px] text-white font-medium">{label}</span>
      </button>
    );
  }
}
