"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight, Loader2, Sparkles, Bot, User, AlertCircle } from "lucide-react";
import Link from "next/link";

type Msg = { role: "user" | "assistant"; content: string; actions?: { label: string; href?: string; payload?: any }[] };

export function AIChat({ initialGreeting }: { initialGreeting: string }) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: initialGreeting, actions: [
      { label: "Draft a PO", href: "/marketplace" },
      { label: "Check capital", href: "/financing" },
      { label: "Summarise GRN variance" },
      { label: "Predict stockouts" },
    ]},
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim()) return;
    setError("");
    const userMsg: Msg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })) }),
      });
      const data = await res.json();
      if (data.ok) {
        setMessages((m) => [...m, { role: "assistant", content: data.reply, actions: data.actions }]);
      } else {
        setError(data.error || "AI request failed");
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  function submit(e: React.FormEvent) { e.preventDefault(); send(input); }
  function quickAction(text: string) { send(text); }

  return (
    <div className="rounded-3xl border border-border bg-bg-1 overflow-hidden flex flex-col h-[640px]">
      <div className="flex items-center gap-3 border-b border-border p-4">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-lime text-bg"><Sparkles className="h-5 w-5" /></div>
        <div>
          <h3 className="font-semibold">HotelsVendors Copilot</h3>
          <p className="text-xs text-fg-3">Connected to INVO + HV Capital</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] text-green"><span className="h-1.5 w-1.5 rounded-full bg-green animate-pulse" /> Live</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-bg-2 text-lime"><Bot className="h-4 w-4" /></div>}
            <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-lime text-bg rounded-br-sm" : "bg-bg-2 border border-border rounded-bl-sm text-fg"}`}>
              <p>{m.content}</p>
              {m.actions && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {m.actions.map((a) => a.href ? (
                    <Link key={a.label} href={a.href} className="inline-flex items-center gap-1 rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs hover:border-lime hover:text-lime transition">
                      {a.label}
                    </Link>
                  ) : (
                    <button key={a.label} type="button" onClick={() => quickAction(a.label)} className="inline-flex items-center gap-1 rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs hover:border-lime hover:text-lime transition">
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {m.role === "user" && <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-lime-dim text-lime"><User className="h-4 w-4" /></div>}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-bg-2 text-lime"><Bot className="h-4 w-4" /></div>
            <div className="rounded-2xl bg-bg-2 border border-border px-4 py-3 flex items-center gap-2 text-fg-3 text-sm">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking across both layers…
            </div>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red/10 border border-red/30 p-3 text-sm text-red">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}
      </div>

      <form onSubmit={submit} className="border-t border-border p-4 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about orders, suppliers, terms, cashflow, GRN…" className="h-11 flex-1 rounded-xl border border-border-2 bg-bg px-4 text-sm outline-none focus:border-lime focus:ring-2 focus:ring-lime/20" />
        <button type="submit" disabled={loading || !input.trim()} className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-lime text-bg hover:bg-lime-light disabled:opacity-50">
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
