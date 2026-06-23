"use client";

import { X, Sparkles } from "lucide-react";
import { ReactNode } from "react";
import { useTheme } from "@/components/theme/theme-provider";

interface ChatShellProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  subtitleColor?: string;
  accentColor?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function ChatShell({
  open,
  onClose,
  title,
  subtitle,
  subtitleColor,
  accentColor,
  children,
  footer,
}: ChatShellProps) {
  const { mode } = useTheme();
  const isLight = false;

  if (!open) return null;

  const effectiveAccent = accentColor || (isLight ? "#581c87" : "#FF6B00");
  const effectiveSubtitleColor = subtitleColor || (isLight ? "bg-purple-500" : "bg-emerald-400");

  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-4rem)] rounded-2xl flex flex-col overflow-hidden shadow-2xl border"
      style={{
        backgroundColor: isLight ? "#ffffff" : "#0f0f0f",
        borderColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b shrink-0"
        style={{
          borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)",
          backgroundColor: isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: effectiveAccent + "15" }}
          >
            <Sparkles size={16} style={{ color: effectiveAccent }} />
          </div>
          <div>
            <p className={`text-sm font-semibold ${isLight ? "text-gray-800" : "text-white"}`}>{title}</p>
            <p className={`text-[10px] flex items-center gap-1 ${isLight ? "text-gray-400" : "text-white/40"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${effectiveSubtitleColor}`} />
              {subtitle}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className={`p-1.5 rounded-lg transition-colors ${isLight ? "hover:bg-gray-100 text-gray-400 hover:text-gray-700" : "hover:bg-white/5 text-white/30 hover:text-white"}`}
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>

      {/* Footer */}
      {footer}
    </div>
  );
}
