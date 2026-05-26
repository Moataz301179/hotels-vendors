import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are HotelsVendors Design Studio AI — a UI/UX design assistant for B2B hospitality dashboards.

Design constraints:
- Dark backgrounds: #000000, #0a0a0a
- Accent: #a3e635 (violet), #06b6d4 (cyan), #f59e0b (amber)
- Text: white headings, white/30 muted

Respond concisely (1-2 sentences) confirming what change you'll make. Do NOT include CSS code blocks in your reply.`;

function addImportant(css: string): string {
  return css
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed.includes(':') || trimmed.endsWith('{') || trimmed.endsWith('}')) return line;
      if (trimmed.includes('!important')) return line;
      return line.replace(/(;?\s*)$/, ' !important$1');
    })
    .join('\n');
}

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
      reply: "Darkened the header to match the executive dark theme.",
      css: addImportant(`header { background-color: #0a0a0a; border-bottom-color: #1a1a2e; color: #ffffff; }
header * { color: #ffffff; }
header button, header a { color: rgba(255,255,255,0.6); }
header button:hover, header a:hover { color: #ffffff; }
.bg-white { background-color: #0a0a0a; }`),
    };
  }
  if (m.includes("button") || m.includes("cta") || m.includes("action")) {
    return {
      reply: "Applied violet accent buttons with rounded corners and hover states.",
      css: addImportant(`button { background-color: #a3e635; color: #ffffff; border-radius: 8px; padding: 10px 20px; font-weight: 600; border: none; }
button:hover { background-color: #6d28d9; }
button.secondary { background-color: transparent; color: #a3e635; border: 1px solid #a3e635; }`),
    };
  }
  if (m.includes("card") || m.includes("panel") || m.includes("metric") || m.includes("insight") || m.includes("workflow")) {
    return {
      reply: "Styled cards with dark surfaces, subtle borders, and hover lift effects.",
      css: addImportant(`.metric-card, .insight-card, .workflow-card, .card, .panel { background-color: #0a0a0a; border: 1px solid #1a1a2e; border-radius: 12px; color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
.metric-card:hover, .insight-card:hover, .workflow-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(5,5,8,0.4); }
.card h3, .panel h3, .metric-card h3 { color: #ffffff; }
.card p, .panel p, .metric-card p { color: rgba(255,255,255,0.6); }`),
    };
  }
  if (m.includes("font") || m.includes("text") || m.includes("typography") || m.includes("headline")) {
    return {
      reply: "Set high-contrast white headings with light gray body text.",
      css: addImportant(`body, p, span, div { color: rgba(255,255,255,0.7); font-family: 'Inter', system-ui, sans-serif; line-height: 1.6; }
h1, h2, h3, h4, h5, h6 { color: #ffffff; font-weight: 700; letter-spacing: -0.02em; }
.hero-card h1, .hero-card h2 { color: #ffffff; }
.text-slate-800, .text-slate-900, .text-ink { color: #ffffff; }
.text-slate-400, .text-slate-500, .text-slate-600 { color: rgba(255,255,255,0.4); }`),
    };
  }
  if (m.includes("color") || m.includes("theme") || m.includes("accent") || m.includes("purple") || m.includes("violet")) {
    return {
      reply: "Locked in the violet accent against the deep dark background.",
      css: addImportant(`:root { --accent: #a3e635; --accent-hover: #6d28d9; --bg: #000000; --surface: #0a0a0a; }
.bg-hv-600, .bg-hv-500 { background-color: #a3e635; }
.text-hv-700, .text-hv-600 { color: #bef264; }
.sidebar-link.active, .nav-item.active { background: rgba(124,58,237,0.15); border-color: #a3e635; color: #bef264; }`),
    };
  }
  if (m.includes("table") || m.includes("grid") || m.includes("list") || m.includes("row") || m.includes("order")) {
    return {
      reply: "Built a polished data table with violet headers and hover row highlighting.",
      css: addImportant(`table, .table { background-color: #0a0a0a; border-collapse: separate; border-spacing: 0; border-radius: 12px; overflow: hidden; }
th, .table-header { background-color: #141420; color: #bef264; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
td { border-bottom: 1px solid #1a1a2e; color: rgba(255,255,255,0.7); padding: 12px 16px; }
.order-row:hover td, tr:hover td { background-color: #11111a; }
.status-badge { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }`),
    };
  }
  if (m.includes("dark") || m.includes("darker") || m.includes("black") || m.includes("night")) {
    return {
      reply: "Deepened everything to dark mode with violet accents.",
      css: addImportant(`body { background-color: #000000; color: rgba(255,255,255,0.7); }
main, section, .main-content { background-color: #000000; }
.card, .panel, .metric-card, .insight-card, .workflow-card, aside, .sidebar { background-color: #0a0a0a; }
.bg-white { background-color: #0a0a0a; }
.border-slate-200, .border-sand { border-color: #1a1a2e; }
.text-slate-800, .text-slate-900, .text-ink { color: #ffffff; }
.text-slate-400, .text-slate-500 { color: rgba(255,255,255,0.4); }`),
    };
  }
  if (m.includes("sidebar") || m.includes("menu") || m.includes("navigation")) {
    return {
      reply: "Darkened the sidebar with violet active states and subtle hover highlights.",
      css: addImportant(`aside, .sidebar, nav.sidebar { background-color: #0a0a0a; border-right-color: #1a1a2e; }
.sidebar-link, .nav-item { color: rgba(255,255,255,0.5); }
.sidebar-link:hover, .nav-item:hover { background: rgba(163,230,53,0.08); color: rgba(255,255,255,0.8); }
.sidebar-link.active, .nav-item.active { background: rgba(124,58,237,0.15); border-right: 3px solid #a3e635; color: #bef264; }`),
    };
  }
  if (m.includes("hero") || m.includes("banner") || m.includes("top section")) {
    return {
      reply: "Styled the hero with a dark gradient and violet CTA buttons.",
      css: addImportant(`.hero-card { background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%); color: #ffffff; }
.hero-card h1, .hero-card h2, .hero-card p { color: #ffffff; }
.hero-card button { background-color: #a3e635; color: #ffffff; }`),
    };
  }

  return {
    reply: "Applied the default HotelsVendors dark theme with violet accents.",
    css: addImportant(`:root { --hv-primary: #a3e635; --hv-secondary: #06b6d4; --hv-accent: #f59e0b; --hv-bg: #000000; --hv-surface: #0a0a0a; --hv-text: #ffffff; --hv-muted: rgba(255,255,255,0.3); }
body { background-color: #000000; color: rgba(255,255,255,0.7); }
header { background-color: #0a0a0a; }
button { background-color: #a3e635; color: #ffffff; }
.card, .panel { background-color: #0a0a0a; border: 1px solid #1a1a2e; }`),
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

    // ALWAYS use local generator for CSS — it's deterministic and matches sketch selectors
    const { reply: localReply, css } = generateLocalCss(message);
    
    // Use AI reply if available, otherwise local
    const finalReply = reply.trim() || localReply;

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
