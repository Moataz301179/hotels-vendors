"use client";

import { useState, useCallback } from "react";
import { Sparkles } from "lucide-react";
import { ChatShell } from "./chat-shell";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";

const PUBLIC_PRESETS = [
  "What is Hotels Vendors?",
  "How does the free trial work?",
  "What suppliers are available?",
  "How much can my hotel save?",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function PublicChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to Hotels Vendors! I'm your Public Guide. Ask me anything about our platform, suppliers, pricing, or how to get started.",
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

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white text-[#8B0000] shadow-lg shadow-black/20 hover:bg-[#8B0000] hover:text-white transition-all flex items-center justify-center hover:scale-110 border border-black/[0.08]"
          title="HotelsVendors Guide"
        >
          <Sparkles size={22} />
        </button>
      )}

      {/* Chat Window */}
      <ChatShell
        open={open}
        onClose={() => setOpen(false)}
        title="Public Guide"
        subtitle="Ask about HotelsVendors"
        subtitleColor="bg-pink-400"
        footer={
          <>
            {/* Presets */}
            <div className="px-3 pt-2 pb-1 flex flex-wrap gap-1.5 border-t border-white/[0.04] shrink-0">
              {PUBLIC_PRESETS.map((prompt) => (
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
              disabled={loading}
              placeholder="Ask about our platform..."
            />
            {remaining !== null && remaining <= 2 && (
              <p className="text-[9px] text-white/20 text-center pb-1">
                {remaining === 0
                  ? "Free limit reached. Sign up for unlimited access."
                  : `${remaining} free question${remaining === 1 ? "" : "s"} remaining`}
              </p>
            )}
            <p className="text-[9px] text-white/15 text-center pb-1.5">
              Powered by Hotels Vendors Intelligence Engine
            </p>
          </>
        }
      >
        <MessageList messages={messages} isLoading={loading} />
      </ChatShell>
    </>
  );
}
