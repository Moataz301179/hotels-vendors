"use client"

type Role = "procurement" | "operations" | "finance"

const benefits: Record<Role, { title: string; desc: string }[]> = {
  procurement: [
    { title: "Smart Sourcing", desc: "AI finds the best suppliers for your needs" },
    { title: "Price Comparison", desc: "Compare quotes across vendors instantly" },
  ],
  operations: [
    { title: "Inventory Alerts", desc: "Get notified when stock runs low" },
    { title: "Delivery Tracking", desc: "Real-time updates on all shipments" },
  ],
  finance: [
    { title: "Invoice Reconciliation", desc: "Auto-match POs to invoices" },
    { title: "Payment Scheduling", desc: "Optimize cash flow with smart scheduling" },
  ],
}

export function RoleBenefits({ role = "procurement" }: { role?: Role }) {
  const items = benefits[role] || benefits.procurement

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((b, i) => (
        <div
          key={i}
          style={{
            padding: 16,
            borderRadius: 8,
            background: "var(--bg-surface-1)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <h4 style={{ margin: "0 0 4px", color: "var(--text-primary)", fontSize: 14 }}>{b.title}</h4>
          <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: 13 }}>{b.desc}</p>
        </div>
      ))}
    </div>
  )
}
