"use client";

import { useState, useCallback } from "react";
import { ChatShell } from "./chat-shell";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { useTheme } from "@/components/theme/theme-provider";

const PUBLIC_PRESETS = [
  "What is HotelsVendors?",
  "How does the free trial work?",
  "What suppliers are available?",
  "How much can my hotel save?",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

function RobotFaceIcon({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <rect x="10" y="16" width="44" height="36" rx="8" fill={color} opacity="0.15" stroke={color} strokeWidth="2.5"/>
      {/* Antenna base */}
      <rect x="29" y="8" width="6" height="10" rx="2" fill={color}/>
      {/* Antenna ball */}
      <circle cx="32" cy="6" r="4" fill={color}/>
      {/* Left eye */}
      <circle cx="22" cy="32" r="5" fill={color} opacity="0.2"/>
      <circle cx="22" cy="32" r="2.5" fill={color}/>
      {/* Right eye */}
      <circle cx="42" cy="32" r="5" fill={color} opacity="0.2"/>
      <circle cx="42" cy="32" r="2.5" fill={color}/>
      {/* Mouth */}
      <rect x="20" y="42" width="24" height="4" rx="2" fill={color} opacity="0.3"/>
      {/* Mouth teeth/grid lines */}
      <line x1="24" y1="42" x2="24" y2="46" stroke={color} strokeWidth="1" opacity="0.5"/>
      <line x1="28" y1="42" x2="28" y2="46" stroke={color} strokeWidth="1" opacity="0.5"/>
      <line x1="32" y1="42" x2="32" y2="46" stroke={color} strokeWidth="1" opacity="0.5"/>
      <line x1="36" y1="42" x2="36" y2="46" stroke={color} strokeWidth="1" opacity="0.5"/>
      <line x1="40" y1="42" x2="40" y2="46" stroke={color} strokeWidth="1" opacity="0.5"/>
      {/* Side bolts */}
      <circle cx="12" cy="28" r="2" fill={color} opacity="0.4"/>
      <circle cx="52" cy="28" r="2" fill={color} opacity="0.4"/>
    </svg>
  );
}

export function PublicChatbot() {
  const { mode } = useTheme();
  const isLight = false;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to HotelsVendors! I'm your AI guide. Ask me anything about our platform, suppliers, pricing, or how to get started.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

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
          body: JSON.stringify({ question: msg.trim() }),
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

  const accentColor = isLight ? "#581c87" : "#FF6B00";

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all flex items-center justify-center hover:scale-110 border"
          style={{
            backgroundColor: isLight ? "#ffffff" : "#0B0F1A",
            borderColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)",
            color: accentColor,
            boxShadow: isLight
              ? "0 4px 20px rgba(0,0,0,0.12)"
              : "0 4px 20px rgba(0,0,0,0.4)",
          }}
          title="HotelsVendors AI Guide"
        >
          <RobotFaceIcon size={26} color={accentColor} />
        </button>
      )}

      {/* Chat Window */}
      <ChatShell
        open={open}
        onClose={() => setOpen(false)}
        title="AI Guide"
        subtitle="Powered by HotelsVendors Intelligence"
        subtitleColor={isLight ? "bg-purple-500" : "bg-pink-400"}
        accentColor={accentColor}
        footer={
          <>
            {/* Presets */}
            <div className="px-3 pt-2 pb-1 flex flex-wrap gap-1.5 border-t shrink-0"
              style={{ borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.04)" }}>
              {PUBLIC_PRESETS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-2 py-1 rounded-md text-[11px] transition-colors"
                  style={{
                    backgroundColor: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"}`,
                    color: isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)",
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
              <p className="text-[9px] text-center pb-1"
                style={{ color: isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.2)" }}>
                {remaining === 0
                  ? "Free limit reached. Sign up for unlimited access."
                  : `${remaining} free question${remaining === 1 ? "" : "s"} remaining`}
              </p>
            )}
            <p className="text-[9px] text-center pb-1.5"
              style={{ color: isLight ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.15)" }}>
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
