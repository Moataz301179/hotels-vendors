"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AIAssistantContextType {
  isOpen: boolean;
  messages: Message[];
  currentPage: string;
  toggle: () => void;
  open: () => void;
  close: () => void;
  addMessage: (role: "user" | "assistant", content: string) => void;
  clearMessages: () => void;
  setCurrentPage: (page: string) => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | null>(null);

export function AIAssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState("");

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const addMessage = useCallback((role: "user" | "assistant", content: string) => {
    const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setMessages((prev) => [...prev, { id, role, content }]);
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return (
    <AIAssistantContext.Provider value={{ isOpen, messages, currentPage, toggle, open, close, addMessage, clearMessages, setCurrentPage }}>
      {children}
    </AIAssistantContext.Provider>
  );
}

export function useAIAssistant() {
  const ctx = useContext(AIAssistantContext);
  if (!ctx) throw new Error("useAIAssistant must be used within AIAssistantProvider");
  return ctx;
}
