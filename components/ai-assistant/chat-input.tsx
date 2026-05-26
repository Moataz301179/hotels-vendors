"use client";

import { Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ input, onChange, onSend, disabled, placeholder }: ChatInputProps) {
  return (
    <div className="px-3 py-3 border-t border-white/[0.06] bg-white/[0.02] shrink-0">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder={placeholder || "Ask anything..."}
          disabled={disabled}
          className="flex-1 h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#bef264]/40 transition-colors disabled:opacity-50"
        />
        <button
          onClick={onSend}
          disabled={!input.trim() || disabled}
          className="w-10 h-10 rounded-lg bg-[#bef264] text-white flex items-center justify-center hover:bg-[#b91c1c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
