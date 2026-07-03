"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, X, Send, BookOpen, Search, FileText, DollarSign, Shield } from "lucide-react"

import { useAIAssistant } from "./assistant-context"
import { AssistantMessage } from "./assistant-message"
import { SuggestionChips, type Chip } from "./suggestion-chips"

const suggestionChips: Chip[] = [
  { label: "Walk me through onboarding", icon: BookOpen, onClick: () => {} },
  { label: "How does marketplace work?", icon: Search, onClick: () => {} },
  { label: "Explain VAT invoicing", icon: FileText, onClick: () => {} },
  { label: "I need invoice factoring", icon: DollarSign, onClick: () => {} },
  { label: "Check ETA compliance", icon: Shield, onClick: () => {} },
]

export function AIAssistant() {
  const { isOpen, toggle, close, messages, addMessage, clearMessages } = useAIAssistant()
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (isOpen && !initialized.current && messages.length === 0) {
      initialized.current = true
      addMessage(
        "assistant",
        "Hi there! I'm your AI Guide. I can help you navigate the platform, understand features like invoice factoring, find suppliers, or check compliance. What would you like to explore?",
      )
    }
  }, [isOpen, messages.length, addMessage])

  const handleSend = async (text?: string) => {
    const content = (text || inputRef.current?.value || "").trim()
    if (!content || isLoading) return

    addMessage("user", content)
    if (inputRef.current) inputRef.current.value = ""

    setIsLoading(true)

    try {
      const chatMessages = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content },
      ]

      const res = await fetch("/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatMessages }),
      })

      if (!res.ok) {
        let errorMsg = "I'm sorry, I'm having trouble connecting right now. Please try again or contact support."
        try {
          const err = await res.json()
          errorMsg = err.error || errorMsg
        } catch {}
        addMessage("assistant", errorMsg)
        return
      }

      const reply = await res.text()
      addMessage("assistant", reply || "I'm sorry, I couldn't process that request.")
    } catch {
      addMessage("assistant", "I'm sorry, I'm having trouble connecting right now. Please try again or contact support.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <motion.button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl cursor-pointer"
        style={{
          backgroundColor: "var(--accent-base)",
          color: "var(--bg-canvas)",
          boxShadow: "0 0 20px var(--accent-glow)",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Toggle AI Assistant"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>
        <motion.div
          animate={{ rotate: isOpen ? 0 : -90, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <X className="w-5 h-5" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl overflow-hidden"
            style={{
              backgroundColor: "var(--bg-surface-1)",
              border: "1px solid var(--border-subtle)",
              maxHeight: "min(600px, calc(100vh - 160px))",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-full"
                  style={{ backgroundColor: "var(--accent-base)" }}
                >
                  <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--bg-canvas)" }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  AI Guide
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearMessages}
                  className="text-xs px-2 py-1 rounded-md transition-colors hover:bg-white/10"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Clear
                </button>
                <button
                  onClick={close}
                  className="p-1 rounded-md transition-colors hover:bg-white/10"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
              style={{ maxHeight: "400px" }}
            >
              {messages.length === 0 && (
                <p className="text-xs text-center py-8" style={{ color: "var(--text-secondary)" }}>
                  Ask me anything about the platform
                </p>
              )}
              {messages.map((msg) => (
                <AssistantMessage key={msg.id} role={msg.role} content={msg.content} />
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex gap-2.5"
                >
                  <div
                    className="flex items-center justify-center w-7 h-7 rounded-full shrink-0 mt-0.5"
                    style={{ backgroundColor: "var(--accent-base)" }}
                  >
                    <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--bg-canvas)" }} />
                  </div>
                  <div
                    className="px-3.5 py-2.5 rounded-2xl rounded-tl-md text-sm"
                    style={{
                      backgroundColor: "var(--bg-surface-1)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <span className="inline-flex gap-1">
                      <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="px-4 py-2.5 border-t space-y-2" style={{ borderColor: "var(--border-subtle)" }}>
              {messages.length <= 1 && (
                <SuggestionChips
                  chips={suggestionChips.map((chip) => ({
                    ...chip,
                    onClick: () => handleSend(chip.label),
                  }))}
                />
              )}
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 rounded-xl text-sm outline-none placeholder:text-sm"
                  style={{
                    backgroundColor: "var(--bg-canvas)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-subtle)",
                  }}
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading}
                  className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: "var(--accent-base)", color: "var(--bg-canvas)", opacity: isLoading ? 0.6 : 1 }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
