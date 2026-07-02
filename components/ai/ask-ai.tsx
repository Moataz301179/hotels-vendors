"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Bot, ShoppingBag, Package, CreditCard } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const SUGGESTIONS = [
  { icon: ShoppingBag, label: "Create AI Procurement Agent", desc: "For hotels — automate ordering & forecasting" },
  { icon: Package, label: "Create AI Listing Assistant", desc: "For suppliers — bulk upload & inventory sync" },
  { icon: CreditCard, label: "Create AI Compliance Agent", desc: "Invoice scoring & ETA verification" },
];

export function AskAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi! I can help you set up AI agents or answer questions. What would you like to do?" },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input.trim() }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Thanks for your question! I'll connect you with a specialist or you can explore our AI agent options above." },
      ]);
    }, 500);
  };

  const handleSuggestion = (label: string) => {
    setMessages((prev) => [...prev, { role: "user", text: label }]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Great choice! ${label} can be configured from your dashboard after login. Would you like me to guide you through the setup?`,
        },
      ]);
    }, 400);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-base)]/50 relative group"
        style={{ color: "var(--text-secondary)" }}
        aria-label="Ask AI"
      >
        <Sparkles className="w-[18px] h-[18px] transition-transform group-hover:scale-110" />
      </button>

      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-4 right-4 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl z-[9999] overflow-hidden border"
          style={{
            backgroundColor: "var(--bg-surface-1)",
            borderColor: "var(--border-subtle)",
            maxHeight: "min(600px, calc(100vh - 2rem))",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "rgba(212, 168, 67, 0.12)" }}
              >
                <Sparkles className="w-4 h-4" style={{ color: "var(--accent-base)" }} />
              </div>
              <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
                Ask AI
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Suggestions */}
          <div className="px-4 py-3 space-y-1.5">
            <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Create an AI Agent
            </p>
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => handleSuggestion(s.label)}
                className="w-full flex items-start gap-3 p-2.5 rounded-xl transition-colors text-left"
                style={{ backgroundColor: "var(--bg-canvas)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-surface-2)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-canvas)")}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(212, 168, 67, 0.1)" }}
                >
                  <s.icon className="w-4 h-4" style={{ color: "var(--accent-base)" }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
                    {s.label}
                  </p>
                  <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {s.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Messages */}
          <div
            className="px-4 py-2 space-y-3 overflow-y-auto"
            style={{ maxHeight: "220px", minHeight: "120px" }}
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-[12px] leading-relaxed ${
                    msg.role === "user" ? "" : ""
                  }`}
                  style={{
                    backgroundColor: msg.role === "user" ? "var(--accent-base)" : "var(--bg-canvas)",
                    color: msg.role === "user" ? "var(--accent-text)" : "var(--text-primary)",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t flex items-center gap-2" style={{ borderColor: "var(--border-subtle)" }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[var(--text-muted)]"
              style={{ color: "var(--text-primary)" }}
            />
            <button
              onClick={handleSend}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: input.trim() ? "var(--accent-base)" : "var(--text-muted)" }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
