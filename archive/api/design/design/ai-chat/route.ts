import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are HotelsVendors Design Studio AI — a UI/UX design assistant for B2B hospitality dashboards.

Design constraints:
- Dark backgrounds: #050508, #0a0a12
- Accent: #7c3aed (violet), #06b6d4 (cyan), #f59e0b (amber)
- Text: white headings, white/30 muted

Respond concisely (1-2 sentences) confirming what change you'll make. Do NOT include CSS code blocks in your reply.`;

async function callXAI(message: string, systemPrompt: string) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error("XAI key missing");

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-2-latest",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 300,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`xAI error: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

async function callOllama(message: string, systemPrompt: string) {
  const url = process.env.OLLAMA_URL || "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL || "llama3.2:3b";

  const res = await fetch(`${url}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      stream: false,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Ollama error: ${err}`);
  }

  const data = await res.json();
  return data.message?.content || "";
}

function generateLocalCss(message: string): { reply: string; css: string } {
  const m = message.toLowerCase();

  if (m.includes("header") || m.includes("nav") || m.includes("top bar")) {
    return {
      reply: "Darkened the header to #0a0a12 with white text and subtle borders.",
      css: `header { background-color: #0a0a12 !important; border-bottom-color: #1a1a2e !important; color: #ffffff !important; }
header * { color: #ffffff !important; }
header button, header a { color: rgba(255,255,255,0.6) !important; }
header button:hover, header a:hover { color: #ffffff !important; }
.bg-white { background-color: #0a0a12 !important; }`,
    };
  }
  if (m.includes("button") || m.includes("cta") || m.includes("action")) {
    return {
      reply: "Applied violet accent buttons with rounded corners and hover states.",
      css: `button { background-color: #7c3aed !important; color: #ffffff !important; border-radius: 8px !important; padding: 10px 20px !important; font-weight: 600 !important; border: none !important; }
button:hover { background-color: #6d28d9 !important; }
button.secondary { background-color: transparent !important; color: #7c3aed !important; border: 1px solid #7c3aed !important; }`,
    };
  }
  if (m.includes("card") || m.includes("panel") || m.includes("metric") || m.includes("insight") || m.includes("workflow")) {
    return {
      reply: "Styled cards with dark surfaces, subtle borders, and hover lift effects.",
      css: `.metric-card, .insight-card, .workflow-card, .card, .panel { background-color: #0a0a12 !important; border: 1px solid #1a1a2e !important; border-radius: 12px !important; color: #ffffff !important; box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important; }
.metric-card:hover, .insight-card:hover, .workflow-card:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 25px rgba(0,0,0,0.4) !important; }
.card h3, .panel h3, .metric-card h3 { color: #ffffff !important; }
.card p, .panel p, .metric-card p { color: rgba(255,255,255,0.6) !important; }`,
    };
  }
  if (m.includes("font") || m.includes("text") || m.includes("typography") || m.includes("headline")) {
    return {
      reply: "Set high-contrast white headings with light gray body text.",
      css: `body, p, span, div { color: rgba(255,255,255,0.7) !important; font-family: 'Inter', system-ui, sans-serif !important; line-height: 1.6 !important; }
h1, h2, h3, h4, h5, h6 { color: #ffffff !important; font-weight: 700 !important; letter-spacing: -0.02em !important; }
.hero-card h1, .hero-card h2 { color: #ffffff !important; }
.text-slate-800, .text-slate-900, .text-ink { color: #ffffff !important; }
.text-slate-400, .text-slate-500, .text-slate-600 { color: rgba(255,255,255,0.4) !important; }`,
    };
  }
  if (m.includes("color") || m.includes("theme") || m.includes("accent") || m.includes("purple") || m.includes("violet")) {
    return {
      reply: "Locked in the violet accent against the deep dark background.",
      css: `:root { --accent: #7c3aed; --accent-hover: #6d28d9; --bg: #050508; --surface: #0a0a12; }
.bg-hv-600, .bg-hv-500 { background-color: #7c3aed !important; }
.text-hv-700, .text-hv-600 { color: #a78bfa !important; }
.sidebar-link.active, .nav-item.active { background: rgba(124,58,237,0.15) !important; border-color: #7c3aed !important; color: #a78bfa !important; }`,
    };
  }
  if (m.includes("table") || m.includes("grid") || m.includes("list") || m.includes("row") || m.includes("order")) {
    return {
      reply: "Built a polished data table with violet headers and hover row highlighting.",
      css: `table, .table { background-color: #0a0a12 !important; border-collapse: separate !important; border-spacing: 0 !important; border-radius: 12px !important; overflow: hidden !important; }
th, .table-header { background-color: #141420 !important; color: #a78bfa !important; font-weight: 600 !important; text-transform: uppercase !important; font-size: 11px !important; letter-spacing: 0.05em !important; }
td { border-bottom: 1px solid #1a1a2e !important; color: rgba(255,255,255,0.7) !important; padding: 12px 16px !important; }
.order-row:hover td, tr:hover td { background-color: #11111a !important; }
.status-badge { font-size: 11px !important; font-weight: 600 !important; text-transform: uppercase !important; letter-spacing: 0.05em !important; }`,
    };
  }
  if (m.includes("dark") || m.includes("darker") || m.includes("black") || m.includes("night")) {
    return {
      reply: "Deepened everything to dark mode with violet accents.",
      css: `body { background-color: #050508 !important; color: rgba(255,255,255,0.7) !important; }
main, section, .main-content { background-color: #050508 !important; }
.card, .panel, .metric-card, .insight-card, .workflow-card, aside, .sidebar { background-color: #0a0a12 !important; }
.bg-white { background-color: #0a0a12 !important; }
.border-slate-200, .border-sand { border-color: #1a1a2e !important; }
.text-slate-800, .text-slate-900, .text-ink { color: #ffffff !important; }
.text-slate-400, .text-slate-500 { color: rgba(255,255,255,0.4) !important; }`,
    };
  }
  if (m.includes("sidebar") || m.includes("menu") || m.includes("navigation")) {
    return {
      reply: "Darkened the sidebar with violet active states and subtle hover highlights.",
      css: `aside, .sidebar, nav.sidebar { background-color: #0a0a12 !important; border-right-color: #1a1a2e !important; }
.sidebar-link, .nav-item { color: rgba(255,255,255,0.5) !important; }
.sidebar-link:hover, .nav-item:hover { background: rgba(124,58,237,0.08) !important; color: rgba(255,255,255,0.8) !important; }
.sidebar-link.active, .nav-item.active { background: rgba(124,58,237,0.15) !important; border-right: 3px solid #7c3aed !important; color: #a78bfa !important; }`,
    };
  }
  if (m.includes("hero") || m.includes("banner") || m.includes("top section")) {
    return {
      reply: "Styled the hero with a dark gradient and violet CTA buttons.",
      css: `.hero-card { background: linear-gradient(135deg, #1a1a2e 0%, #0a0a12 100%) !important; color: #ffffff !important; }
.hero-card h1, .hero-card h2, .hero-card p { color: #ffffff !important; }
.hero-card button { background-color: #7c3aed !important; color: #ffffff !important; }`,
    };
  }

  return {
    reply: "Applied the default HotelsVendors dark theme with violet accents.",
    css: `:root { --hv-primary: #7c3aed; --hv-secondary: #06b6d4; --hv-accent: #f59e0b; --hv-bg: #050508; --hv-surface: #0a0a12; --hv-text: #ffffff; --hv-muted: rgba(255,255,255,0.3); }
body { background-color: #050508 !important; color: rgba(255,255,255,0.7) !important; }
header { background-color: #0a0a12 !important; }
button { background-color: #7c3aed !important; color: #ffffff !important; }
.card, .panel { background-color: #0a0a12 !important; border: 1px solid #1a1a2e !important; }`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { message, currentDesign } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const userMsg = `Current design context: ${JSON.stringify(currentDesign || {})}\n\nUser request: ${message}`;
    let reply = "";
    let source = "xai";

    // Try xAI for natural language reply
    try {
      reply = await callXAI(userMsg, SYSTEM_PROMPT);
    } catch (xaiErr: any) {
      console.warn("xAI failed:", xaiErr.message);
      // Try Ollama for natural language reply
      try {
        reply = await callOllama(userMsg, SYSTEM_PROMPT);
        source = "ollama";
      } catch (ollamaErr: any) {
        console.warn("Ollama failed:", ollamaErr.message);
        source = "local";
      }
    }

    // ALWAYS use local generator for CSS — deterministic, correct selectors, !important
    const { reply: localReply, css } = generateLocalCss(message);
    
    // Use AI reply if it's coherent (longer than 10 chars), otherwise local
    const finalReply = reply.trim().length > 10 ? reply.trim() : localReply;

    return NextResponse.json({
      reply: finalReply,
      suggestedCss: css,
      changes: css ? [{ type: "css", value: css }] : [],
      source,
    });
  } catch (e: any) {
    console.error("Design AI chat error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
