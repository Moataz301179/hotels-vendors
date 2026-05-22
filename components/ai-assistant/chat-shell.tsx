"use client";

import { X, Sparkles } from "lucide-react";
import { ReactNode } from "react";

interface ChatShellProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  subtitleColor?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function ChatShell({
  open,
  onClose,
  title,
  subtitle,
  subtitleColor = "bg-emerald-400",
  children,
  footer,
}: ChatShellProps) {
  if (!open) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-4rem)] bg-[#0f0f0f] rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-white/[0.08]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#8b5cf6]/15 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{title}</p>
            <p className="text-[10px] text-white/40 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${subtitleColor}`} />
              {subtitle}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors"
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
