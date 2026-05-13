"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  Brain, Send, Loader2, Terminal, CheckCircle2, XCircle,
  Eye, Database, Globe, Mail, MemoryStick, Sparkles,
  Clock, Zap, ArrowLeft, RefreshCw, ChevronDown, ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ExecutionEvent {
  id: string;
  type: "thinking" | "tool_call" | "tool_result" | "screenshot" | "final_answer" | "error";
  timestamp: number;
  data: Record<string, unknown>;
}

interface ToolCallEvent {
  round: number;
  tool: string;
  arguments: Record<string, unknown>;
}

interface ToolResultEvent {
  round: number;
  tool: string;
  success: boolean;
  output: unknown;
  error?: string;
}

const TOOL_ICONS: Record<string, React.ReactNode> = {
  openclaw_navigate: <Globe className="w-4 h-4" />,
  openclaw_extract: <Eye className="w-4 h-4" />,
  openclaw_deep_scrape: <Globe className="w-4 h-4" />,
  openclaw_smart_navigate: <Sparkles className="w-4 h-4" />,
  openclaw_use_skill: <Zap className="w-4 h-4" />,
  db_query: <Database className="w-4 h-4" />,
  db_count: <Database className="w-4 h-4" />,
  db_aggregate: <Database className="w-4 h-4" />,
  email_send: <Mail className="w-4 h-4" />,
  memory_write: <MemoryStick className="w-4 h-4" />,
  memory_read: <MemoryStick className="w-4 h-4" />,
  analyze_competitor: <Eye className="w-4 h-4" />,
  score_hotel_credit: <CheckCircle2 className="w-4 h-4" />,
};

function getToolIcon(toolName: string) {
  return TOOL_ICONS[toolName] || <Terminal className="w-4 h-4" />;
}

function getToolColor(toolName: string): string {
  if (toolName.startsWith("openclaw_")) return "#3b82f6";
  if (toolName.startsWith("db_")) return "#8b5cf6";
  if (toolName.startsWith("memory_")) return "#f59e0b";
  if (toolName === "email_send") return "#10b981";
  if (toolName === "analyze_competitor") return "#ef4444";
  if (toolName === "score_hotel_credit") return "#06b6d4";
  return "#6366f1";
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export default function GrokBrainDashboardPage() {
  const [prompt, setPrompt] = useState("");
  const [events, setEvents] = useState<ExecutionEvent[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedRounds, setExpandedRounds] = useState<Set<number>>(new Set());
  const [finalAnswer, setFinalAnswer] = useState("");
  const [metadata, setMetadata] = useState<Record<string, unknown> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const toggleRound = (round: number) => {
    setExpandedRounds((prev) => {
      const next = new Set(prev);
      if (next.has(round)) next.delete(round);
      else next.add(round);
      return next;
    });
  };

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [events, scrollToBottom]);

  const handleSubmit = async () => {
    if (!prompt.trim() || isRunning) return;

    setIsRunning(true);
    setEvents([]);
    setFinalAnswer("");
    setMetadata(null);

    const newEvents: ExecutionEvent[] = [];
    const addEvent = (type: ExecutionEvent["type"], data: Record<string, unknown>) => {
      const event: ExecutionEvent = { id: `${Date.now()}_${Math.random()}`, type, timestamp: Date.now(), data };
      newEvents.push(event);
      setEvents([...newEvents]);
    };

    try {
      const response = await fetch("/api/v1/intelligence/grok-brain/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, maxRounds: 5 }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let currentEvent: { event?: string; data?: string } = {};

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            currentEvent.event = line.slice(7);
          } else if (line.startsWith("data: ")) {
            currentEvent.data = line.slice(6);
          } else if (line === "" && currentEvent.event && currentEvent.data) {
            try {
              const data = JSON.parse(currentEvent.data);
              addEvent(currentEvent.event as ExecutionEvent["type"], data);

              if (currentEvent.event === "final_answer") {
                setFinalAnswer(data.answer || "");
                setMetadata(data.metadata || null);
              }
            } catch {
              // ignore parse errors
            }
            currentEvent = {};
          }
        }
      }
    } catch (error) {
      addEvent("error", { error: error instanceof Error ? error.message : "Stream failed" });
    } finally {
      setIsRunning(false);
    }
  };

  const toolCallsByRound = events
    .filter((e) => e.type === "tool_call")
    .map((e) => e.data as unknown as ToolCallEvent);

  const toolResultsByRound = events
    .filter((e) => e.type === "tool_result")
    .map((e) => e.data as unknown as ToolResultEvent);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <div className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/70 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Admin
            </Link>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B0000] to-[#b91c1c] flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-[16px] font-bold tracking-tight">Grok Brain</h1>
                <p className="text-[11px] text-white/40">Real-time agent execution monitor</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRunning ? "bg-green-400 animate-pulse" : "bg-white/20"}`} />
            <span className="text-[11px] text-white/40">{isRunning ? "Executing..." : "Idle"}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Chat & Input */}
        <div className="lg:col-span-2 space-y-4">
          {/* Input Area */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2 block">
              Mission Prompt
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.metaKey) handleSubmit();
                }}
                placeholder="e.g., Research Suplyd's pricing and compare with our suppliers, then score Fairmont Nile City's credit risk..."
                className="w-full h-28 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 resize-none"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span className="text-[10px] text-white/20">Cmd+Enter</span>
                <button
                  onClick={handleSubmit}
                  disabled={isRunning || !prompt.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#8B0000] text-white text-[12px] font-semibold hover:bg-[#a00000] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  {isRunning ? "Running..." : "Execute"}
                </button>
              </div>
            </div>
          </div>

          {/* Execution Timeline */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-white/40" />
                <span className="text-[12px] font-semibold text-white/70">Execution Log</span>
                {events.length > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40">
                    {events.length} events
                  </span>
                )}
              </div>
              {events.length > 0 && (
                <button
                  onClick={() => { setEvents([]); setFinalAnswer(""); setMetadata(null); }}
                  className="flex items-center gap-1 text-[11px] text-white/30 hover:text-white/60 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>

            <div ref={scrollRef} className="max-h-[500px] overflow-y-auto p-4 space-y-3">
              <AnimatePresence>
                {events.length === 0 && !isRunning && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <Brain className="w-10 h-10 text-white/10 mx-auto mb-3" />
                    <p className="text-[13px] text-white/30">Enter a prompt and click Execute to watch Grok Brain work</p>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      {[
                        "Research Suplyd pricing",
                        "Score Fairmont Nile City credit",
                        "Find F&B suppliers in 6th October",
                        "Analyze competitor MaxAB",
                      ].map((s) => (
                        <button
                          key={s}
                          onClick={() => setPrompt(s)}
                          className="text-[11px] px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/70 hover:border-white/15 transition-all"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {events.map((event) => {
                  if (event.type === "thinking") {
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                      >
                        <Loader2 className="w-4 h-4 text-[#8B0000] animate-spin" />
                        <span className="text-[12px] text-white/50">{event.data.message as string}</span>
                      </motion.div>
                    );
                  }

                  if (event.type === "tool_call") {
                    const data = event.data as ToolCallEvent;
                    const isExpanded = expandedRounds.has(data.round);
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
                      >
                        <button
                          onClick={() => toggleRound(data.round)}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${getToolColor(data.tool)}15`, color: getToolColor(data.tool) }}
                            >
                              {getToolIcon(data.tool)}
                            </div>
                            <div className="text-left">
                              <div className="text-[12px] font-medium text-white/70">{data.tool}</div>
                              <div className="text-[10px] text-white/30">Round {data.round}</div>
                            </div>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                        </button>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-3">
                                <pre className="text-[11px] text-white/40 bg-black/30 rounded-lg p-3 overflow-x-auto">
                                  {JSON.stringify(data.arguments, null, 2)}
                                </pre>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  }

                  if (event.type === "tool_result") {
                    const data = event.data as ToolResultEvent;
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-8 flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                      >
                        {data.success ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="text-[11px] text-white/50 mb-1">
                            {data.success ? "Success" : "Failed"} — {data.tool}
                          </div>
                          {data.error ? (
                            <div className="text-[11px] text-red-300/70">{data.error}</div>
                          ) : (
                            <pre className="text-[10px] text-white/30 bg-black/20 rounded-lg p-2 overflow-x-auto max-h-32">
                              {JSON.stringify(data.output, null, 2)}
                            </pre>
                          )}
                        </div>
                      </motion.div>
                    );
                  }

                  if (event.type === "screenshot") {
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-8 flex items-center gap-2 p-2 rounded-lg bg-blue-500/[0.05] border border-blue-500/10"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-[11px] text-blue-300/60">{event.data.note as string}</span>
                      </motion.div>
                    );
                  }

                  if (event.type === "final_answer") {
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-gradient-to-br from-[#8B0000]/10 to-transparent border border-[#8B0000]/20"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-[#8B0000]" />
                          <span className="text-[12px] font-semibold text-white/80">Final Answer</span>
                        </div>
                        <div className="text-[13px] text-white/70 leading-relaxed whitespace-pre-wrap">
                          {event.data.answer as string}
                        </div>
                      </motion.div>
                    );
                  }

                  if (event.type === "error") {
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-red-300/70 text-[12px]"
                      >
                        {event.data.error as string}
                      </motion.div>
                    );
                  }

                  return null;
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Metadata */}
        <div className="space-y-4">
          {/* Status Card */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-white/40" />
              <span className="text-[12px] font-semibold text-white/70">Execution Stats</span>
            </div>
            {metadata ? (
              <div className="space-y-3">
                <div className="flex justify-between text-[12px]">
                  <span className="text-white/40">Model</span>
                  <span className="text-white/70 font-mono">{metadata.model as string}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-white/40">Provider</span>
                  <span className="text-white/70">{metadata.provider as string}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-white/40">Latency</span>
                  <span className="text-white/70">{formatDuration(metadata.latencyMs as number)}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-white/40">Tool Rounds</span>
                  <span className="text-white/70">{metadata.rounds as number}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-white/40">Tool Calls</span>
                  <span className="text-white/70">{metadata.toolCallsCount as number}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-white/40">Tokens</span>
                  <span className="text-white/70">{metadata.tokensUsed as number}</span>
                </div>
              </div>
            ) : (
              <p className="text-[12px] text-white/30">No execution data yet</p>
            )}
          </div>

          {/* Active Tools */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-white/40" />
              <span className="text-[12px] font-semibold text-white/70">Tools Used</span>
            </div>
            {toolCallsByRound.length > 0 ? (
              <div className="space-y-2">
                {Array.from(new Map(toolCallsByRound.map((t) => [t.tool, t])).values()).map((tool) => (
                  <div key={tool.tool} className="flex items-center gap-2.5">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: `${getToolColor(tool.tool)}15`, color: getToolColor(tool.tool) }}
                    >
                      {getToolIcon(tool.tool)}
                    </div>
                    <span className="text-[11px] text-white/50">{tool.tool}</span>
                    <span className="text-[10px] text-white/20 ml-auto">
                      {toolCallsByRound.filter((t) => t.tool === tool.tool).length}x
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-white/30">No tools called yet</p>
            )}
          </div>

          {/* Quick Reference */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-white/40" />
              <span className="text-[12px] font-semibold text-white/70">Available Skills</span>
            </div>
            <div className="space-y-2">
              {[
                { name: "afrexai-prospect-research", desc: "Research hotels/suppliers" },
                { name: "afrexai-competitor-analysis", desc: "Analyze competitors" },
                { name: "afrexai-business-automation", desc: "Browser workflows" },
                { name: "afrexai-crm", desc: "Outreach automation" },
                { name: "afrexai-daily-briefing", desc: "Executive briefings" },
              ].map((skill) => (
                <div key={skill.name} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8B0000]" />
                  <div>
                    <div className="text-[11px] text-white/50">{skill.name}</div>
                    <div className="text-[10px] text-white/25">{skill.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
