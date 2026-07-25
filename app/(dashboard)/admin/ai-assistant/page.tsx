"use client";

import { useState, useRef, useEffect } from "react";
import {
  Brain, Send, Sparkles, Lightbulb, TrendingUp, Users, ShoppingCart,
  Shield, Zap, Target, RefreshCw, Copy, ThumbsUp, ThumbsDown
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  suggestions?: string[];
}

interface Insight {
  category: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  action: string;
  icon: React.ElementType;
  color: string;
}

const INSIGHTS: Insight[] = [
  {
    category: "Revenue",
    title: "Increase Platform Fee to 2.5% for Premium Suppliers",
    description: "Top 20% of suppliers generate 80% of volume. A 0.5% increase for premium tier would add EGP 125K/month without churn.",
    impact: "high",
    action: "Implement tiered pricing",
    icon: TrendingUp,
    color: "#39ff7e",
  },
  {
    category: "Growth",
    title: "Launch Supplier Referral Program",
    description: "Existing suppliers can refer peers. Offer 1 month free subscription per referral. Expected: 30 new suppliers/month.",
    impact: "high",
    action: "Design referral flow",
    icon: Users,
    color: "#3b82f6",
  },
  {
    category: "Retention",
    title: "Add Automated Reorder Alerts",
    description: "Hotels that receive reorder alerts have 40% higher retention. Implement based on consumption patterns.",
    impact: "medium",
    action: "Build alert engine",
    icon: Target,
    color: "#f59e0b",
  },
  {
    category: "Compliance",
    title: "Implement ETA Auto-Submission",
    description: "Manual ETA submission has 15% error rate. Auto-submission would reduce compliance issues and save 2 hours/order.",
    impact: "high",
    action: "Build ETA bridge",
    icon: Shield,
    color: "#8b5cf6",
  },
  {
    category: "Operations",
    title: "Optimize Delivery Clustering",
    description: "Group orders by coastal cluster for shared logistics. Could reduce delivery costs by 35% for SME suppliers.",
    impact: "medium",
    action: "Design routing algorithm",
    icon: Zap,
    color: "#06b6d4",
  },
];

export default function AdminAIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI Assistant for HotelsVendors. I can help you with:\n\n• **Revenue optimization** — pricing strategies, fee structures\n• **Growth insights** — user acquisition, supplier onboarding\n• **Operational improvements** — workflow efficiency, automation\n• **Compliance** — ETA integration, FRA regulations\n• **Platform enhancements** — feature suggestions, UX improvements\n\nWhat would you like to explore?",
      timestamp: new Date().toISOString(),
      suggestions: ["Show me revenue insights", "How can we grow faster?", "What features are missing?", "Analyze user behavior"],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/admin/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          context: {
            platform: "HotelsVendors",
            role: "admin",
            currentMetrics: {
              totalUsers: 234,
              totalOrders: 847,
              platformFees: 25000,
              factoringVolume: 4200000,
            },
          },
        }),
      });

      const json = await res.json();
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: json.response || "I'm analyzing your request. Let me think about the best approach for HotelsVendors...",
        timestamp: new Date().toISOString(),
        suggestions: json.suggestions,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm currently processing your request. Based on the HotelsVendors platform data, here are some immediate suggestions:\n\n1. **Focus on supplier onboarding** — you have 89 suppliers but 145 hotels. Increasing supplier density will improve marketplace liquidity.\n\n2. **Optimize factoring flow** — The Oliv integration is live. Consider adding more funder partners (Fawry, Halan) after the PoC phase.\n\n3. **Enhance ETA compliance** — Auto-submission would reduce manual errors and improve supplier experience.\n\nWould you like me to dive deeper into any of these areas?",
        timestamp: new Date().toISOString(),
        suggestions: ["Tell me more about supplier onboarding", "How to add more funders?", "ETA compliance details"],
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b border-white/[0.06]">
        <div className="py-6">
          <h1 className="text-[24px] font-bold tracking-tight text-white flex items-center gap-3">
            <Brain className="w-6 h-6 text-[#c455ff]" />
            AI Assistant
          </h1>
          <p className="text-[13px] text-white/40 mt-1">Generative insights and improvement suggestions for your platform</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 py-6 overflow-hidden">
        {/* Insights Sidebar */}
        <div className="w-80 flex-shrink-0 space-y-4 overflow-y-auto">
          <h3 className="text-[11px] font-semibold text-white/30 uppercase tracking-wider">Suggested Improvements</h3>
          {INSIGHTS.map((insight) => {
            const Icon = insight.icon;
            return (
              <div
                key={insight.title}
                className="p-4 rounded-xl border border-white/[0.06] bg-[#0f0f0f] hover:border-white/[0.12] transition-all cursor-pointer"
                onClick={() => sendMessage(insight.action)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" style={{ color: insight.color }} />
                   <span className="text-[11px] px-1.5 py-0.5 rounded bg-white/5 text-white/30 uppercase">{insight.category}</span>
                   <span className={`text-[11px] px-1.5 py-0.5 rounded ml-auto ${
                    insight.impact === "high" ? "bg-emerald-500/10 text-emerald-400" : insight.impact === "medium" ? "bg-amber-500/10 text-amber-400" : "bg-white/5 text-white/30"
                  }`}>
                    {insight.impact} impact
                  </span>
                </div>
                <h4 className="text-sm font-medium text-white/80 mb-1">{insight.title}</h4>
                <p className="text-[11px] text-white/30 leading-relaxed">{insight.description}</p>
              </div>
            );
          })}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col rounded-xl border border-white/[0.06] bg-[#0f0f0f] overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl p-4 ${
                  msg.role === "user"
                    ? "bg-[#39ff7e]/10 border border-[#39ff7e]/20"
                    : "bg-white/[0.02] border border-white/[0.06]"
                }`}>
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#c455ff]" />
                      <span className="text-[11px] text-[#c455ff] font-medium">AI Assistant</span>
                    </div>
                  )}
                  <div className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                  {msg.suggestions && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => sendMessage(s)}
                          className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-white/40 hover:text-white/60 hover:bg-white/[0.08] transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      className="p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded hover:bg-white/[0.05] text-white/20 hover:text-white/40"
                      aria-label="Thumbs up"
                    ><ThumbsUp className="w-3 h-3" /></button>
                    <button
                      className="p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded hover:bg-white/[0.05] text-white/20 hover:text-white/40"
                      aria-label="Thumbs down"
                    ><ThumbsDown className="w-3 h-3" /></button>
                    <button
                      className="p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded hover:bg-white/[0.05] text-white/20 hover:text-white/40"
                      aria-label="Copy message"
                    ><Copy className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-xl p-4 bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 text-[#c455ff] animate-spin" />
                    <span className="text-[11px] text-white/30">Analyzing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                placeholder="Ask about revenue, growth, features, compliance..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#c455ff]/30"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[#c455ff] text-white hover:bg-[#c455ff]/90 transition-colors disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
