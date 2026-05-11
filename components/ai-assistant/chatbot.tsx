"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle, X, Send, User, Bot, Loader2, Sparkles,
  ShoppingCart, Package, Landmark, Truck, ShieldCheck, BarChart3,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

type RoleMode = "hotel" | "supplier" | "factoring" | "shipping" | "admin" | "marketing";

const ROLE_CONFIG: Record<RoleMode, { label: string; color: string; icon: React.ElementType; prompts: string[] }> = {
  hotel: {
    label: "Hotel Mode",
    color: "text-emerald-400",
    icon: ShoppingCart,
    prompts: [
      "Find F&B suppliers in 6th of October",
      "Check status of my latest order",
      "What's my budget utilization?",
      "Suggest reorder for low-stock items",
    ],
  },
  supplier: {
    label: "Supplier Mode",
    color: "text-amber-400",
    icon: Package,
    prompts: [
      "Forecast demand for next month",
      "Which products need price adjustment?",
      "Summarize my pending orders",
      "How does non-recourse factoring work?",
    ],
  },
  factoring: {
    label: "Factoring Mode",
    color: "text-purple-400",
    icon: Landmark,
    prompts: [
      "Assess risk of top 5 hotels",
      "Portfolio yield this quarter",
      "Flag overdue invoices",
      "Liquidity forecast for next 30 days",
    ],
  },
  shipping: {
    label: "Logistics Mode",
    color: "text-cyan-400",
    icon: Truck,
    prompts: [
      "Optimize tomorrow's North Coast route",
      "Fuel cost forecast for May",
      "Delivery bottleneck alerts",
      "Fleet utilization summary",
    ],
  },
  admin: {
    label: "Admin Mode",
    color: "text-[#022349]",
    icon: ShieldCheck,
    prompts: [
      "System health summary",
      "Fee anomaly detection",
      "Cross-tenant audit flags",
      "Swarm agent status overview",
    ],
  },
  marketing: {
    label: "Growth Mode",
    color: "text-pink-400",
    icon: BarChart3,
    prompts: [
      "Lead pipeline summary",
      "Campaign performance",
      "Supplier acquisition targets",
      "Social media analytics",
    ],
  },
};

export function ChatbotWidget({ mode = "hotel" }: { mode?: RoleMode }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome to Hotels Vendors. I'm your Intelligence Engine. Ask me anything about procurement, suppliers, orders, or market insights.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const config = ROLE_CONFIG[mode];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend(text?: string) {
    const msg = text || input;
    if (!msg.trim() || loading) return;

    const userMsg: Message = { role: "user", content: msg.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: msg.trim(), role: mode }),
      });

      const json = await res.json();
      const reply = json.data?.answer || json.answer || "I'm processing your request. Could you provide more context?";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection issue detected. Please retry in a moment.", timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white text-[#022349] shadow-lg shadow-black/20 hover:bg-[#022349] hover:text-white transition-all flex items-center justify-center hover:scale-110 border border-black/[0.08]"
          title="HotelsVendors Intelligence Engine"
        >
          <Sparkles size={22} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-4rem)] bg-[#0f0f0f] rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-white/[0.08]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#022349]/15 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Intelligence Engine</p>
                <p className="text-[10px] text-white/40 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${config.color.replace("text-", "bg-")}`} />
                  {config.label}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  m.role === "user" ? "bg-[#022349]" : "bg-white/[0.04] border border-white/[0.08]"
                }`}>
                  {m.role === "user" ? <User size={12} className="text-white" /> : <Bot size={12} className="text-[#022349]" />}
                </div>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-[#022349] text-white rounded-tr-sm"
                    : "bg-white/[0.04] border border-white/[0.08] text-white/70 rounded-tl-sm"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                  <Bot size={12} className="text-[#022349]" />
                </div>
                <div className="bg-white/[0.04] border border-white/[0.08] px-3 py-2 rounded-xl rounded-tl-sm">
                  <Loader2 size={16} className="animate-spin text-white/30" />
                </div>
              </div>
            )}
          </div>

          {/* Prompt Chips */}
          <div className="px-3 pt-2 pb-1 flex flex-wrap gap-1.5 border-t border-white/[0.04]">
            {config.prompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-[11px] text-white/40 hover:text-white/70 hover:border-white/[0.12] transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask anything about your workspace..."
                className="flex-1 h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#022349]/40 transition-colors"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-lg bg-[#022349] text-white flex items-center justify-center hover:bg-[#b91c1c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[9px] text-white/15 text-center mt-1.5">Powered by Hotels Vendors Intelligence Engine</p>
          </div>
        </div>
      )}
    </>
  );
}
