"use client"

export function PublicPrompt() {
  const suggestions = [
    "Find eco-friendly hotel suppliers in Egypt",
    "Compare linen pricing across vendors",
    "Check compliance requirements for hotel imports",
  ]

  return (
    <div
      style={{
        padding: 24,
        borderRadius: 12,
        background: "var(--bg-surface-1)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <p style={{ margin: "0 0 16px", color: "var(--text-secondary)", fontSize: 14 }}>
        Try asking the AI Assistant:
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {suggestions.map((text, i) => (
          <button
            key={i}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid var(--border-subtle)",
              background: "transparent",
              color: "var(--accent-base)",
              cursor: "pointer",
              fontSize: 13,
              textAlign: "left",
            }}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  )
}
