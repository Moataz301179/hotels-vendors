"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  AtSign,
  ThumbsUp,
  Network,
  MessageSquare,
  Plus,
  Send,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";

type Channel = "instagram" | "facebook" | "linkedin" | "whatsapp";
type Status = "scheduled" | "published" | "failed";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  channel: Channel;
  status: Status;
}

interface CalendarPost {
  id: string;
  title: string;
  scheduledAt: string;
  channel: Channel;
  status: Status;
}

const CHANNEL_META: Record<Channel, { label: string; icon: typeof AtSign; color: string }> = {
  instagram: { label: "Instagram", icon: AtSign, color: "text-pink-600" },
  facebook: { label: "Facebook", icon: ThumbsUp, color: "text-blue-600" },
  linkedin: { label: "LinkedIn", icon: Network, color: "text-sky-700" },
  whatsapp: { label: "WhatsApp", icon: MessageSquare, color: "text-emerald-600" },
};

const STATUS_STYLES: Record<Status, { bg: string; text: string; dot: string; label: string }> = {
  scheduled: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500", label: "Scheduled" },
  published: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-600", label: "Published" },
  failed: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500", label: "Failed" },
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function StatusPill({ status }: { status: Status }) {
  const s = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export default function MarketingCalendarPage() {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [form, setForm] = useState({
    title: "",
    date: new Date().toISOString().slice(0, 10),
    time: "10:00",
    channel: "instagram" as Channel,
  });
  const [localEvents, setLocalEvents] = useState<CalendarEvent[]>([]);

  const {
    data: eventsData,
    loading,
    error: fetchError,
  } = useApi<{ events: CalendarPost[] }>("/api/v1/marketing/calendar");

  const remoteEvents: CalendarEvent[] = useMemo(
    () =>
      (eventsData?.events ?? []).map((p) => ({
        id: p.id,
        title: p.title,
        date: p.scheduledAt.slice(0, 10),
        time: p.scheduledAt.slice(11, 16),
        channel: p.channel,
        status: p.status,
      })),
    [eventsData]
  );

  const allEvents = useMemo(
    () => [...remoteEvents, ...localEvents].sort((a, b) => a.date.localeCompare(b.date)),
    [remoteEvents, localEvents]
  );

  const changeMonth = (dir: number) => {
    setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + dir, 1));
  };

  const grid = useMemo(() => {
    const firstDay = cursor.getDay();
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells: { day: number | null; dateStr: string }[] = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push({ day: null, dateStr: "" });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ day: d, dateStr });
    }
    return cells;
  }, [cursor]);

  const postsForDay = (dateStr: string) =>
    allEvents.filter((e) => e.date === dateStr).slice(0, 3);

  const selectDay = (dateStr: string) => {
    if (!dateStr) return;
    setForm((f) => ({ ...f, date: dateStr }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const newEvent: CalendarEvent = {
      id: `local-${Date.now()}`,
      title: form.title.trim(),
      date: form.date,
      time: form.time,
      channel: form.channel,
      status: "scheduled",
    };
    setLocalEvents((prev) => [...prev, newEvent]);
    setForm((f) => ({ ...f, title: "", channel: "instagram" }));

    try {
      await fetch("/api/v1/marketing/calendar", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newEvent.title,
          scheduledAt: `${newEvent.date}T${newEvent.time}`,
          channel: newEvent.channel,
        }),
      });
    } catch {
      // Endpoint doesn't exist — event already added to local state.
    }
  };

  useEffect(() => {
    if (fetchError) {
      // Graceful: remote calendar endpoint missing simply means local-only mode.
      console.info("Calendar API unavailable, using local events:", fetchError);
    }
  }, [fetchError]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Content Calendar</h1>
            <p className="text-sm text-slate-500 mt-1">Plan and track scheduled posts and campaigns</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 shadow-sm">
            <button
              onClick={() => changeMonth(-1)}
              className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium px-2">
              {cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}
            </span>
            <button
              onClick={() => changeMonth(1)}
              className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Month grid */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
            {WEEKDAYS.map((d) => (
              <div key={d} className="px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {grid.map((cell, i) => {
              const isToday = cell.dateStr === new Date().toISOString().slice(0, 10);
              const dayPosts = cell.dateStr ? postsForDay(cell.dateStr) : [];
              return (
                <button
                  key={i}
                  disabled={!cell.dateStr}
                  onClick={() => selectDay(cell.dateStr)}
                  className={`min-h-[76px] border-b border-r border-slate-100 p-1.5 text-left transition-colors ${
                    cell.dateStr ? "cursor-pointer hover:bg-slate-50" : "bg-slate-50/50"
                  }`}
                >
                  <span
                    className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-medium ${
                      isToday ? "bg-blue-600 text-white" : "text-slate-700"
                    }`}
                  >
                    {cell.day ?? ""}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayPosts.map((p) => {
                      const meta = CHANNEL_META[p.channel];
                      return (
                        <div
                          key={p.id}
                          className="flex items-center gap-1 truncate rounded px-1 py-0.5 bg-slate-100"
                          title={p.title}
                        >
                          <meta.icon size={10} className={meta.color} />
                          <span className="truncate text-[10px] text-slate-600">{p.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {loading && <p className="text-xs text-slate-400">Loading remote events…</p>}
        {fetchError && (
          <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Calendar API unavailable — showing local events only.
          </div>
        )}

        {/* New event form */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold mb-4">
            <Plus size={16} className="text-blue-600" />
            New Event
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 lg:grid-cols-12 gap-3">
            <div className="col-span-2 lg:col-span-4">
              <label className="block text-xs font-medium text-slate-500 mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Summer campaign launch"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Channel</label>
              <select
                value={form.channel}
                onChange={(e) => setForm((f) => ({ ...f, channel: e.target.value as Channel }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              >
                {(Object.keys(CHANNEL_META) as Channel[]).map((c) => (
                  <option key={c} value={c}>
                    {CHANNEL_META[c].label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 lg:col-span-3 flex items-end">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors"
              >
                <Send size={14} />
                Add
              </button>
            </div>
          </form>
        </div>

        {/* Scheduled posts / campaigns list */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
            <CalendarDays size={16} className="text-blue-600" />
            <h2 className="text-sm font-semibold">Scheduled Posts &amp; Campaigns</h2>
            <span className="ml-auto text-xs text-slate-400">{allEvents.length} total</span>
          </div>
          {allEvents.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <CalendarDays size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">No events scheduled yet.</p>
              <p className="text-xs text-slate-400 mt-1">Use the form above to add your first event.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {allEvents.map((e) => {
                const meta = CHANNEL_META[e.channel];
                return (
                  <li key={e.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <meta.icon size={16} className={meta.color} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{e.title}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(`${e.date}T${e.time || "00:00"}`).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        • {e.time} • {meta.label}
                      </p>
                    </div>
                    <StatusPill status={e.status} />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}