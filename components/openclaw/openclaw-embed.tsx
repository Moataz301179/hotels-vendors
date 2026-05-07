"use client";

import { useState } from "react";
import { Bot, ExternalLink, RefreshCw } from "lucide-react";
import { getOpenClawChatUrl } from "@/lib/integrations/openclaw";

interface OpenClawEmbedProps {
  sessionId?: string;
  height?: string;
}

export function OpenClawEmbed({
  sessionId,
  height = "calc(100vh - 200px)",
}: OpenClawEmbedProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chatUrl = getOpenClawChatUrl(sessionId);

  return (
    <div className="glass-card overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Bot size={16} className="text-[#FF5C00]" />
          <span className="text-sm font-semibold text-white">OpenClaw Workspace</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={chatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-white/40 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
          >
            <ExternalLink size={10} />
            Open in Tab
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative" style={{ height }}>
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10">
            <RefreshCw size={20} className="text-white/30 animate-spin mb-2" />
            <span className="text-[11px] text-white/30">Loading OpenClaw workspace...</span>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10">
            <Bot size={24} className="text-white/20 mb-2" />
            <span className="text-[11px] text-white/40">{error}</span>
          </div>
        )}
        <iframe
          src={chatUrl}
          className="w-full h-full border-0"
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError("Failed to load OpenClaw workspace");
          }}
          allow="clipboard-write"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    </div>
  );
}
