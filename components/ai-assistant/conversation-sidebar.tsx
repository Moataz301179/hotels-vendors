"use client";

import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface ConversationItem {
  id: string;
  title: string;
  role: string;
  messageCount: number;
  updatedAt: string;
}

interface ConversationSidebarProps {
  activeId?: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export function ConversationSidebar({ activeId, onSelect, onNew }: ConversationSidebarProps) {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const apiBase = process.env.NEXT_PUBLIC_VPS_API_URL || "/api/v1";

  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/ai/conversations`);
      const json = await res.json();
      if (json.success) {
        setConversations(json.data.conversations);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const deleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this conversation?")) return;
    try {
      await fetch(`${apiBase}/ai/conversations/${id}`, { method: "DELETE" });
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) {
        onNew();
      }
    } catch {
      // silent
    }
  };

  return (
    <div className="w-60 border-r border-white/[0.06] bg-white/[0.02] flex flex-col shrink-0">
      <div className="p-3 border-b border-white/[0.06]">
        <button
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#bef264]/20 text-[#bef264] text-sm font-medium hover:bg-[#bef264]/30 transition-colors"
        >
          <Plus size={14} />
          New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {loading && (
          <p className="text-xs text-white/20 text-center py-4">Loading...</p>
        )}
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-xs transition-colors group ${
              activeId === conv.id
                ? "bg-white/[0.08] text-white"
                : "text-white/40 hover:text-white/60 hover:bg-white/[0.04]"
            }`}
          >
            <MessageSquare size={12} className="shrink-0" />
            <span className="truncate flex-1">{conv.title}</span>
            <button
              onClick={(e) => deleteConversation(conv.id, e)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-opacity"
            >
              <Trash2 size={10} />
            </button>
          </button>
        ))}
        {!loading && conversations.length === 0 && (
          <p className="text-xs text-white/20 text-center py-4">No conversations yet</p>
        )}
      </div>
    </div>
  );
}
