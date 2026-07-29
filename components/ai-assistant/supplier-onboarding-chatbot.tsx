"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, ArrowRight, Loader2 } from "lucide-react";

const SUPPLIER_PRESETS = [
  "How do I register as a supplier?",
  "How does the 48-hour payment work?",
  "What is the credit limit?",
  "What documents do I need?",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function SupplierOnboardingBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome! I'm here to help you get started on HotelsVendors. I'll guide you through registration, explain how you get paid in 48 hours, and help you understand the Oliv financing credit line up to EGP 10M. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(
    async (text?: string) => {
      const msg = text || input;
      if (!msg.trim() || loading) return;

      const userMsg: Message = { role: "user", content: msg.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const apiUrl = process.env.NEXT_PUBLIC_VPS_API_URL
          ? `${process.env.NEXT_PUBLIC_VPS_API_URL}/ai/public`
          : "/api/v1/ai/public";

        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: msg.trim(),
            context: "supplier_onboarding",
          }),
        });

        const json = await res.json();

        if (!json.success) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: json.error || "I'm sorry, I couldn't process that. Please try again.",
            },
          ]);
          return;
        }

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: json.data.answer },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Connection issue detected. Please retry in a moment.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading]
  );

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 group"
          title="Talk to Onboarding Agent"
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ backgroundColor: "#4A7C59", boxShadow: "0 0 30px rgba(74,124,89,0.3)" }}>
              <MessageCircle size={22} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#f5870a] border-2 border-[#0c0c12] animate-pulse" />
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-[#12121a] border border-white/10 text-[11px] text-white/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Talk to Onboarding Agent
            </div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-4rem)] rounded-2xl flex flex-col overflow-hidden transition-all duration-300" style={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(74,124,89,0.15)" }}>
                <Sparkles size={16} style={{ color: "#4A7C59" }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Onboarding Agent</p>
                <p className="text-[10px] text-white/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#4A7C59" }} />
                  Supplier Onboarding
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
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "text-white"
                      : "text-white/70"
                  }`}
                  style={
                    msg.role === "user"
                      ? { backgroundColor: "#4A7C59", color: "#ffffff" }
                      : { backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <Loader2 size={16} className="animate-spin" style={{ color: "#4A7C59" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Presets */}
          <div className="px-4 pt-2 pb-1 flex flex-wrap gap-1.5 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            {SUPPLIER_PRESETS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-lg text-[11px] transition-colors"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 pb-3 pt-2 shrink-0">
            <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about onboarding..."
                disabled={loading}
                className="flex-1 bg-transparent text-[13px] text-white placeholder:text-white/20 focus:outline-none"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
                style={{ backgroundColor: input.trim() ? "#4A7C59" : "transparent" }}
              >
                <Send size={14} className={input.trim() ? "text-white" : "text-white/20"} />
              </button>
            </div>
            <p className="text-[9px] text-white/15 text-center mt-2 pb-0.5">
              Powered by HotelsVendors Intelligence Engine
            </p>
          </div>
        </div>
      )}
    </>
  );
}
