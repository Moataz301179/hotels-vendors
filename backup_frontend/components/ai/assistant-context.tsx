"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

type AIAssistantContextType = {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
  messages: Message[]
  addMessage: (role: "user" | "assistant", content: string) => void
  clearMessages: () => void
  currentPage: string
  setCurrentPage: (page: string) => void
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined)

export function AIAssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentPage, setCurrentPage] = useState("")

  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const addMessage = useCallback((role: "user" | "assistant", content: string) => {
    const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setMessages((prev) => [...prev, { id, role, content }])
  }, [])

  const clearMessages = useCallback(() => setMessages([]), [])

  return (
    <AIAssistantContext.Provider
      value={{ isOpen, toggle, open, close, messages, addMessage, clearMessages, currentPage, setCurrentPage }}
    >
      {children}
    </AIAssistantContext.Provider>
  )
}

export function useAIAssistant() {
  const context = useContext(AIAssistantContext)
  if (!context) {
    throw new Error("useAIAssistant must be used within an AIAssistantProvider")
  }
  return context
}
