"use client";

import { Send } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";

interface ChatInputProps {
  input: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
  accentColor?: string;
}

export function ChatInput({ input, onChange, onSend, disabled, placeholder, accentColor }: ChatInputProps) {
  const { mode } = useTheme();
  const isLight = mode === "light";
  const effectiveAccent = accentColor || (isLight ? "#581c87" : "#FF6B00");

  return (
    <div
      className="px-3 py-3 border-t shrink-0"
      style={{
        borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)",
        backgroundColor: isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)",
      }}
    >
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
          className={`flex-1 h-10 px-3 rounded-lg text-sm outline-none transition-colors disabled:opacity-50 ${isLight ? "bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400" : "bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20"}`}
          style={{
            border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)"}`,
          }}
        />
        <button
          onClick={onSend}
          disabled={!input.trim() || disabled}
          className="w-10 h-10 rounded-lg flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          style={{
            backgroundColor: effectiveAccent,
            color: isLight ? "#ffffff" : "var(--foreground)",
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
