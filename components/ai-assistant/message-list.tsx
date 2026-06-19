"use client";

import { User, Bot, Loader2 } from "lucide-react";
import { useRef, useEffect } from "react";
import { useTheme } from "@/components/theme/theme-provider";

export interface ChatMessageItem {
  id?: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

interface MessageListProps {
  messages: ChatMessageItem[];
  isLoading?: boolean;
  accentColor?: string;
}

export function MessageList({ messages, isLoading, accentColor }: MessageListProps) {
  const { mode } = useTheme();
  const isLight = mode === "light";
  const scrollRef = useRef<HTMLDivElement>(null);
  const effectiveAccent = accentColor || (isLight ? "#581c87" : "#FFB000");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((m, i) => (
        <div key={m.id || i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{
              backgroundColor: m.role === "user" ? effectiveAccent : (isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)"),
              border: m.role === "user" ? "none" : `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)"}`,
            }}
          >
            {m.role === "user" ? (
              <User size={12} color={isLight ? "#ffffff" : "#0B0F1A"} />
            ) : (
              <Bot size={12} style={{ color: effectiveAccent }} />
            )}
          </div>
          <div
            className="max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap"
            style={{
              backgroundColor: m.role === "user" ? effectiveAccent : (isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)"),
              color: m.role === "user"
                ? (isLight ? "#ffffff" : "#0B0F1A")
                : (isLight ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)"),
              border: m.role === "user" ? "none" : `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)"}`,
              borderTopRightRadius: m.role === "user" ? "4px" : "16px",
              borderTopLeftRadius: m.role === "user" ? "16px" : "4px",
            }}
          >
            {m.content}
            {m.isStreaming && <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-white/30 animate-pulse" />}
          </div>
        </div>
      ))}
      {isLoading && !messages.some((m) => m.isStreaming) && (
        <div className="flex gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)"}`,
            }}
          >
            <Bot size={12} style={{ color: effectiveAccent }} />
          </div>
          <div
            className="px-3 py-2 rounded-xl"
            style={{
              backgroundColor: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)"}`,
            }}
          >
            <Loader2 size={16} className="animate-spin" style={{ color: isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)" }} />
          </div>
        </div>
      )}
    </div>
  );
}
