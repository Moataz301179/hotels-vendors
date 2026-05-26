"use client";

import { User, Bot, Loader2 } from "lucide-react";
import { useRef, useEffect } from "react";

export interface ChatMessageItem {
  id?: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

interface MessageListProps {
  messages: ChatMessageItem[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

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
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
              m.role === "user"
                ? "bg-[#bef264]"
                : "bg-white/[0.04] border border-white/[0.08]"
            }`}
          >
            {m.role === "user" ? (
              <User size={12} className="text-white" />
            ) : (
              <Bot size={12} className="text-[#bef264]" />
            )}
          </div>
          <div
            className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-[#bef264] text-white rounded-tr-sm"
                : "bg-white/[0.04] border border-white/[0.08] text-white/70 rounded-tl-sm"
            }`}
          >
            {m.content}
            {m.isStreaming && <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-white/30 animate-pulse" />}
          </div>
        </div>
      ))}
      {isLoading && !messages.some((m) => m.isStreaming) && (
        <div className="flex gap-2.5">
          <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            <Bot size={12} className="text-[#bef264]" />
          </div>
          <div className="bg-white/[0.04] border border-white/[0.08] px-3 py-2 rounded-xl rounded-tl-sm">
            <Loader2 size={16} className="animate-spin text-white/30" />
          </div>
        </div>
      )}
    </div>
  );
}
