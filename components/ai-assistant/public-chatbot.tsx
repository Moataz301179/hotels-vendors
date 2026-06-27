"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ChatShell } from "./chat-shell";
import { MessageList, type ChatMessageItem } from "./message-list";
import { ChatInput } from "./chat-input";
import { useTheme } from "@/components/theme/theme-provider";
import { Sparkles, RotateCcw } from "lucide-react";

const PUBLIC_PRESETS = [
  "What is HotelsVendors?",
  "How does factoring work?",
  "What suppliers are available?",
  "How much can my hotel save?",
  "ETA e-invoicing compliance?",
  "How to join as a supplier?",
];

interface PublicChatbotProps {
  /** If user is logged in, pass their role for context-aware responses */
  userRole?: string;
}

function AIIcon({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 5.6L20 9l-4.5 4 1.3 6L12 16l-4.8 3 1.3-6L4 9l5.6-1.4L12 2z" fill={color} fillOpacity="0.15" />
      <circle cx="12" cy="9" r="1.5" fill={color} />
    </svg>
  );
}

export function PublicChatbot({ userRole }: PublicChatbotProps) {
  const { mode } = useTheme();
  const isNoir = mode === "dark";
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      role: "assistant",
      content:
        "Welcome to HotelsVendors! I'm your AI procurement guide. Ask me anything about our platform, suppliers, pricing, ETA compliance, or how to get started.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [retrying, setRetrying] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  const handleReset = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setMessages([
      {
        role: "assistant",
        content:
          "Conversation reset. How can I help you with HotelsVendors today?",
      },
    ]);
    setLoading(false);
    setRetrying(false);
  }, []);

  const handleSend = useCallback(
    async (text?: string) => {
      const msg = text || input;
      if (!msg.trim() || loading) return;

      const userMsg: ChatMessageItem = { role: "user", content: msg.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);
      setRetrying(false);

      // Abort any previous request
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const apiUrl = process.env.NEXT_PUBLIC_VPS_API_URL
          ? `${process.env.NEXT_PUBLIC_VPS_API_URL}/ai/public`
          : "/api/v1/ai/public";

        // Build conversation history from existing messages (last 10 for context)
        const history = messages
          .slice(-10)
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          }));

        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: msg.trim(),
            history,
            source: userRole ? undefined : "homepage",
          }),
          signal: controller.signal,
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
        if (json.data.remainingQuestions !== undefined) {
          setRemaining(json.data.remainingQuestions);
        }
      } catch (err) {
        // Don't show error if request was aborted (user sent new message)
        if ((err as Error).name === "AbortError") return;

        console.error("[Public Chat] Error:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I'm having trouble connecting right now. This might be a temporary issue — please try again in a moment.",
            isError: true,
          },
        ]);
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [input, loading, messages, userRole]
  );

  const accentColor = "var(--accent-base)";

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all flex items-center justify-center hover:scale-110 border"
          style={{
            backgroundColor: "var(--bg-surface-1)",
            borderColor: "var(--border-subtle)",
            color: accentColor,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15), 0 0 12px var(--accent-glow)",
            fontFamily: "var(--font-sans)",
          }}
          title="HotelsVendors AI Guide"
        >
          <AIIcon size={26} color={accentColor} />
        </button>
      )}

      {/* Chat Window */}
      <ChatShell
        open={open}
        onClose={() => setOpen(false)}
        title="AI Procurement Guide"
        subtitle="Powered by HotelsVendors Intelligence"
        subtitleColor={isNoir ? "bg-amber-400" : "bg-emerald-400"}
        accentColor={accentColor}
        headerRight={
          messages.length > 1 ? (
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors"
              style={{ fontFamily: "var(--font-sans)" }}
              title="Reset conversation"
            >
              <RotateCcw size={14} />
            </button>
          ) : undefined
        }
        footer={
          <>
            {/* Presets */}
            <div
              className="px-3 pt-2 pb-1 flex flex-wrap gap-1.5 border-t shrink-0"
              style={{
                borderColor: "var(--border-subtle)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {PUBLIC_PRESETS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="px-2 py-1 rounded-md text-[11px] transition-colors disabled:opacity-40"
                  style={{
                    backgroundColor: "var(--accent-muted)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-sans)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--accent-base)";
                    (e.currentTarget as HTMLElement).style.color = "var(--accent-text)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--accent-muted)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                  }}
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
              disabled={loading}
              placeholder="Ask about our platform..."
              accentColor={accentColor}
            />
            {remaining !== null && remaining <= 2 && (
              <p
                className="text-[9px] text-center pb-1"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}
              >
                {remaining === 0
                  ? "Free limit reached. Sign up for unlimited access."
                  : `${remaining} free question${remaining === 1 ? "" : "s"} remaining`}
              </p>
            )}
            <p
              className="text-[9px] text-center pb-1.5"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-sans)" }}
            >
              Powered by HotelsVendors Intelligence Engine
            </p>
          </>
        }
      >
        <MessageList messages={messages} isLoading={loading} accentColor={accentColor} />
      </ChatShell>
    </>
  );
}
