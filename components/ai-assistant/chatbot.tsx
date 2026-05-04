"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, User, Bot, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome to Hotels Vendors! I'm your AI assistant. Ask me anything about the platform, your orders, or how to get started.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });

      const json = await res.json();
      const reply = json.data?.response || json.response || "I'm here to help. Could you provide more details?";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again shortly.", timestamp: new Date() },
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
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[var(--accent-500)] text-white shadow-lg hover:bg-[var(--accent-600)] transition-all flex items-center justify-center hover:scale-110"
          title="AI Assistant"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-4rem)] glass-card rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-[var(--border-default)]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--surface-raised)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[var(--accent-500)]/15 flex items-center justify-center">
                <Bot size={16} className="text-[var(--accent-400)]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">HV Assistant</p>
                <p className="text-[10px] text-[var(--foreground-muted)]">AI-powered support</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--foreground-muted)] hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  m.role === "user" ? "bg-[var(--accent-500)]" : "bg-[var(--surface-raised)] border border-[var(--border-default)]"
                }`}>
                  {m.role === "user" ? <User size={12} className="text-white" /> : <Bot size={12} className="text-[var(--accent-400)]" />}
                </div>
                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-[var(--accent-500)] text-white rounded-tr-sm"
                    : "bg-[var(--surface-raised)] border border-[var(--border-default)] text-[var(--foreground-secondary)] rounded-tl-sm"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[var(--surface-raised)] border border-[var(--border-default)] flex items-center justify-center">
                  <Bot size={12} className="text-[var(--accent-400)]" />
                </div>
                <div className="bg-[var(--surface-raised)] border border-[var(--border-default)] px-3 py-2 rounded-xl rounded-tl-sm">
                  <Loader2 size={16} className="animate-spin text-[var(--foreground-muted)]" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-[var(--border-subtle)] bg-[var(--surface-raised)]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask anything..."
                className="flex-1 h-10 px-3 rounded-lg bg-[var(--background)] border border-[var(--border-default)] text-sm text-white placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-[var(--accent-500)]"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-lg bg-[var(--accent-500)] text-white flex items-center justify-center hover:bg-[var(--accent-600)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
