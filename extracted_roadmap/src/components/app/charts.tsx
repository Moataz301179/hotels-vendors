"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";

type Point = { label: string; value: number };

export function TrendChart({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="hv-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--lime)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--lime)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--fg-4)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "var(--fg-4)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          contentStyle={{ background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12, color: "var(--fg)" }}
          labelStyle={{ color: "var(--fg-3)" }}
          formatter={(v) => [`EGP ${Number(v).toLocaleString()}`, "Value"]}
        />
        <Area type="monotone" dataKey="value" stroke="var(--lime)" strokeWidth={2.5} fill="url(#hv-fill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function FunnelChart({ data }: { data: { label: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--fg-4)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "var(--fg-4)" }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12, color: "var(--fg)" }}
          formatter={(v) => [Number(v).toLocaleString(), "Count"]}
        />
        <Bar dataKey="value" fill="var(--gold)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
