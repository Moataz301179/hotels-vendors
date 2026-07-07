"use client"

import { motion } from "framer-motion"
import { Sparkles, User } from "lucide-react"

type AssistantMessageProps = {
  role: "user" | "assistant"
  content: string
}

export function AssistantMessage({ role, content }: AssistantMessageProps) {
  const isUser = role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className="flex items-center justify-center w-7 h-7 rounded-full shrink-0 mt-0.5"
        style={{
          backgroundColor: isUser ? "var(--accent-muted)" : "var(--accent-base)",
        }}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5" style={{ color: "var(--text-primary)" }} />
        ) : (
          <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--bg-canvas)" }} />
        )}
      </div>
      <div
        className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser ? "rounded-tr-md" : "rounded-tl-md"
        }`}
        style={{
          backgroundColor: isUser ? "var(--accent-muted)" : "var(--bg-surface-1)",
          color: "var(--text-primary)",
          border: isUser ? "none" : "1px solid var(--border-subtle)",
        }}
      >
        {content}
      </div>
    </motion.div>
  )
}
