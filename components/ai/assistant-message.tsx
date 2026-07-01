"use client";

import { motion } from "framer-motion";
import { User, Sparkles } from "lucide-react";

interface AssistantMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function AssistantMessage({ role, content }: AssistantMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: isUser ? "var(--accent-muted)" : "var(--accent-base)" }}
      >
        {isUser ? (
          <User size={12} style={{ color: "var(--accent-base)" }} />
        ) : (
          <Sparkles size={12} style={{ color: "#FFFFFF" }} />
        )}
      </div>
      <div
        className={`max-w-[80%] px-3.5 py-2 rounded-xl text-[13px] leading-relaxed ${
          isUser ? "" : ""
        }`}
        style={{
          backgroundColor: isUser ? "var(--bg-surface-1)" : "var(--accent-muted)",
          color: isUser ? "var(--text-primary)" : "var(--accent-base)",
          border: isUser ? "1px solid var(--border-subtle)" : "1px solid var(--accent-glow)",
        }}
      >
        {content}
      </div>
    </motion.div>
  );
}
