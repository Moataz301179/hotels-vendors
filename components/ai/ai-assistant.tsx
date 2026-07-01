"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, HelpCircle, ShoppingCart, FileText, Shield } from "lucide-react";
import { useAIAssistant } from "./assistant-context";
import { SuggestionChips } from "./suggestion-chips";
import { AssistantMessage } from "./assistant-message";

const INITIAL_SUGGESTIONS = [
  { label: "Help me onboard", icon: HelpCircle, response: "I'll guide you through onboarding! First, let's set up your company profile. Click 'Register' and follow the entity-first registration process." },
  { label: "How does factoring work?", icon: FileText, response: "Reverse factoring lets suppliers get paid in 24-48 hours while hotels keep Net-60 terms. We charge 0.85% per invoice." },
  { label: "Find suppliers", icon: ShoppingCart, response: "Browse 680+ verified Egyptian suppliers in our marketplace. Filter by category, price, or location." },
  { label: "Check compliance", icon: Shield, response: "ETA e-invoicing is fully automated. Every invoice is digitally signed and submitted to the Egyptian Tax Authority." },
];

export function AIAssistant() {
  const { isOpen, messages, toggle, addMessage, clearMessages } = useAIAssistant();
  const [input, setInput] = useState("");

  const handleSuggestion = (label: string, response: string) => {
    addMessage("user", label);
    setTimeout(() => addMessage("assistant", response), 500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    addMessage("user", text);
    setTimeout(() => addMessage("assistant", `I'll help with "${text}". For now, try one of the suggestions above or explore the platform features.`), 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all flex items-center justify-center hover:scale-110 border"
        style={{
          backgroundColor: "var(--bg-surface-1)",
          borderColor: "var(--border-subtle)",
          color: "var(--accent-base)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15), 0 0 12px var(--accent-glow)",
        }}
        title="HotelsVendors AI Guide"
      >
        {isOpen ? (
          <X size={22} />
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent-base)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l2.4 5.6L20 9l-4.5 4 1.3 6L12 16l-4.8 3 1.3-6L4 9l5.6-1.4L12 2z" fill="var(--accent-base)" fillOpacity="0.15" />
            <circle cx="12" cy="9" r="1.5" fill="var(--accent-base)" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-[24rem] rounded-2xl border overflow-hidden"
            style={{
              backgroundColor: "var(--bg-canvas)",
              borderColor: "var(--border-subtle)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              maxHeight: "60vh",
            }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
              <div className="flex items-center gap-2">
                <Sparkles size={14} style={{ color: "var(--accent-base)" }} />
                <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>AI Guide</span>
              </div>
              <button
                onClick={clearMessages}
                className="text-[10px] px-2 py-1 rounded-md hover:opacity-70 transition-opacity"
                style={{ color: "var(--text-secondary)" }}
              >
                Clear
              </button>
            </div>

            <div className="overflow-y-auto p-3 space-y-3" style={{ maxHeight: "calc(60vh - 110px)", scrollbarWidth: "thin" }}>
              {messages.length === 0 ? (
                <div className="text-center py-6">
                  <Sparkles size={24} style={{ color: "var(--accent-base)" }} className="mx-auto mb-2 opacity-50" />
                  <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
                    Ask me anything about the platform
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <AssistantMessage key={msg.id} role={msg.role} content={msg.content} />
                ))
              )}
            </div>

            {messages.length === 0 && (
              <div className="px-3 pb-3">
                <SuggestionChips
                  chips={INITIAL_SUGGESTIONS.map((s) => ({
                    label: s.label,
                    onClick: () => handleSuggestion(s.label, s.response),
                  }))}
                />
              </div>
            )}

            <div className="flex items-center gap-2 px-3 py-2.5 border-t" style={{ borderColor: "var(--border-subtle)" }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 rounded-xl text-[12px] outline-none"
                style={{ backgroundColor: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                style={{ backgroundColor: "var(--accent-base)", color: "#FFFFFF" }}
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
