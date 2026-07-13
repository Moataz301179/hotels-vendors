"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { ChatShell } from "./chat-shell";
import { MessageList, type ChatMessageItem } from "./message-list";
import { ChatInput } from "./chat-input";
import { ConversationSidebar } from "./conversation-sidebar";

const ROLE_COLORS: Record<string, string> = {
  hotel: "bg-emerald-400",
  supplier: "bg-amber-400",
  factoring: "bg-purple-400",
  shipping: "bg-cyan-400",
  admin: "bg-accent-base",
};

const ROLE_LABELS: Record<string, string> = {
  hotel: "Hotel Mode",
  supplier: "Supplier Mode",
  factoring: "Factoring Mode",
  shipping: "Logistics Mode",
  admin: "Admin Mode",
};

const WORKSPACE_PRESETS: Record<string, string[]> = {
  hotel: [
    "Find F&B suppliers in 6th of October",
    "Check my latest order status",
    "What's my monthly spend?",
    "Suggest reorder for low-stock items",
  ],
  supplier: [
    "Forecast demand for next month",
    "Which products need price adjustment?",
    "Summarize my pending orders",
    "How does non-recourse factoring work?",
  ],
  factoring: [
    "Assess risk of top 5 hotels",
    "Portfolio yield this quarter",
    "Flag overdue invoices",
    "Liquidity forecast for next 30 days",
  ],
  shipping: [
    "Optimize tomorrow's North Coast route",
    "Fuel cost forecast",
    "Delivery bottleneck alerts",
    "Fleet utilization summary",
  ],
  admin: [
    "System health summary",
    "Fee anomaly detection",
    "Cross-tenant audit flags",
    "Swarm agent status overview",
  ],
};

interface WorkspaceChatbotProps {
  mode: string;
  userId: string;
}

export function WorkspaceChatbot({ mode, userId }: WorkspaceChatbotProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      role: "assistant",
      content: `Welcome back. I'm your HotelsVendors Intelligence Engine. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [quota, setQuota] = useState<{ remainingMessages: number; plan: string } | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Load quota on mount
  useEffect(() => {
    if (!open) return;
    fetch("/api/v1/ai/quota")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setQuota(json.data.quota);
        }
      })
      .catch(() => {});
  }, [open]);

  const handleNewConversation = useCallback(() => {
    setConversationId(undefined);
    setMessages([
      {
        role: "assistant",
        content: `Welcome back. I'm your HotelsVendors Intelligence Engine. How can I help you today?`,
      },
    ]);
    setInput("");
  }, []);

  const handleSelectConversation = useCallback(async (id: string) => {
    setConversationId(id);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/ai/conversations/${id}`);
      const json = await res.json();
      if (json.success && json.data.conversation) {
        const conv = json.data.conversation;
        setMessages(
          conv.messages.map((m: { role: string; content: string }) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          }))
        );
      }
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, []);

  const parseStreamChunk = (chunk: string): string | null => {
    const lines = chunk.split("\n");
    let text = "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("data: ")) {
        const data = trimmed.slice(6);
        if (data === "[DONE]") return null;
        try {
          const parsed = JSON.parse(data);
          if (parsed.v) {
            // text-delta format from Vercel AI SDK
            text += parsed.v;
          } else if (parsed.choices?.[0]?.delta?.content) {
            // OpenAI format
            text += parsed.choices[0].delta.content;
          }
        } catch {
          // Not JSON, might be raw text
          text += data;
        }
      }
    }
    return text || null;
  };

  const handleSend = useCallback(
    async (text?: string) => {
      const msg = text || input;
      if (!msg.trim() || isLoading) return;

      const userMsg: ChatMessageItem = { role: "user", content: msg.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      // Abort any previous request
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const apiUrl = process.env.NEXT_PUBLIC_VPS_API_URL
        ? `${process.env.NEXT_PUBLIC_VPS_API_URL}/ai/assistant`
        : "/api/v1/ai/assistant";

      const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            role: mode,
            conversationId,
          }),
          signal: controller.signal,
        });

        // Check if it's a stream or JSON fallback
        const contentType = res.headers.get("content-type") || "";

        if (contentType.includes("text/event-stream") || contentType.includes("text/plain")) {
          // Streaming response
          const reader = res.body?.getReader();
          if (!reader) throw new Error("No response body");

          let assistantContent = "";
          setMessages((prev) => [...prev, { role: "assistant", content: "", isStreaming: true }]);

          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const parsed = parseStreamChunk(chunk);
            if (parsed) {
              assistantContent += parsed;
              setMessages((prev) => {
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                if (updated[lastIdx].role === "assistant") {
                  updated[lastIdx] = { ...updated[lastIdx], content: assistantContent };
                }
                return updated;
              });
            }
          }

          // Mark as done streaming
          setMessages((prev) => {
            const updated = [...prev];
            const lastIdx = updated.length - 1;
            if (updated[lastIdx].role === "assistant") {
              updated[lastIdx] = { ...updated[lastIdx], isStreaming: false };
            }
            return updated;
          });

          // Refresh quota
          fetch("/api/v1/ai/quota")
            .then((r) => r.json())
            .then((json) => {
              if (json.success) setQuota(json.data.quota);
            })
            .catch(() => {});
        } else {
          // JSON fallback response
          const json = await res.json();
          if (!json.success) {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: json.error || "I'm sorry, I couldn't process that. Please try again.",
              },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: json.data.answer },
            ]);
            if (json.data.conversationId) {
              setConversationId(json.data.conversationId);
            }
            // Refresh quota
            fetch("/api/v1/ai/quota")
              .then((r) => r.json())
              .then((json2) => {
                if (json2.success) setQuota(json2.data.quota);
              })
              .catch(() => {});
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("[Workspace Chat] Error:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Connection issue detected. Please retry in a moment.",
          },
        ]);
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [input, isLoading, messages, mode, conversationId]
  );

  const presets = WORKSPACE_PRESETS[mode] || WORKSPACE_PRESETS.hotel;
  const color = ROLE_COLORS[mode] || ROLE_COLORS.hotel;
  const label = ROLE_LABELS[mode] || ROLE_LABELS.hotel;

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white text-accent-base shadow-lg shadow-black/20 hover:bg-accent-base hover:text-white transition-all flex items-center justify-center hover:scale-110 border border-black/[0.08]"
          title="HotelsVendors Intelligence Engine"
        >
          <Sparkles size={22} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[680px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-4rem)] bg-[#0f0f0f] rounded-2xl flex overflow-hidden shadow-2xl border border-white/[0.08]">
          {/* Sidebar */}
          {showSidebar && (
            <ConversationSidebar
              activeId={conversationId}
              onSelect={handleSelectConversation}
              onNew={handleNewConversation}
            />
          )}

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent-base/15 flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Intelligence Engine</p>
                  <p className="text-[10px] text-white/40 flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
                    {label}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Quota indicator */}
                {quota && quota.plan === "FREE" && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-white/40">
                    {quota.remainingMessages}/2 free
                  </span>
                )}
                {/* Sidebar toggle */}
                <button
                  onClick={() => setShowSidebar((s) => !s)}
                  className="px-2 py-1 rounded-lg text-[10px] text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
                >
                  {showSidebar ? "Hide" : "History"}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors"
                >
                  <span className="text-lg leading-none">×</span>
                </button>
              </div>
            </div>

            {/* Messages */}
            <MessageList messages={messages} isLoading={isLoading} />

            {/* Presets */}
            <div className="px-3 pt-2 pb-1 flex flex-wrap gap-1.5 border-t border-white/[0.04] shrink-0">
              {presets.map((prompt) => (
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
            <ChatInput
              input={input}
              onChange={setInput}
              onSend={() => handleSend()}
              disabled={isLoading}
              placeholder="Ask anything about your workspace..."
            />
            <p className="text-[9px] text-white/20 text-center pb-1">
              AI-generated responses may contain errors. Verify critical information.
            </p>
            <p className="text-[9px] text-white/15 text-center pb-1.5">
              Powered by Hotels Vendors Intelligence Engine
            </p>
          </div>
        </div>
      )}
    </>
  );
}
