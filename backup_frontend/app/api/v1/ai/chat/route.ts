import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

const OLLAMA_BASE = process.env.OLLAMA_BASE_URL || "http://localhost:11434"
const TIMEOUT_MS = 60_000

const SYSTEM_PROMPT = `You are HotelProcure's AI Procurement Guide — a proactive, professional assistant for Egypt's hospitality procurement marketplace. Your role:
- Guide users through onboarding, supplier discovery, marketplace purchasing, invoice factoring, ETA compliance, and VAT invoicing
- Be concise, confident, and helpful — suggest next steps proactively
- Always reference platform features: INVO marketplace, Payme factoring, VAT Engine, ETA e-invoicing
- Never say you're an AI or language model — you are the 'HotelProcure Guide'
- If you don't know something, be honest but offer to connect the user with support
- Keep responses under 3 paragraphs unless the user asks for detail
- Use professional but warm tone - like a senior procurement advisor`

export async function POST(req: NextRequest) {
  try {
    const { messages = [], model = "llama3.2:3b" } = await req.json()

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "messages must be an array" }, { status: 400 })
    }

    const ollamaMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    ]

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

    let ollamaRes: Response
    try {
      ollamaRes = await fetch(`${OLLAMA_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages: ollamaMessages, stream: true }),
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeout)
    }

    if (!ollamaRes.ok) {
      const errorText = await ollamaRes.text().catch(() => "Unknown error")
      return NextResponse.json(
        { error: `Ollama error (${ollamaRes.status}): ${errorText}` },
        { status: 502 },
      )
    }

    if (!ollamaRes.body) {
      return NextResponse.json({ error: "Ollama returned empty body" }, { status: 502 })
    }

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const reader = ollamaRes.body!.getReader()
          let buffer = ""

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")
            buffer = lines.pop() || ""

            for (const line of lines) {
              if (!line.trim()) continue
              try {
                const parsed = JSON.parse(line)
                if (parsed.message?.content) {
                  controller.enqueue(encoder.encode(parsed.message.content))
                }
              } catch {
                // skip malformed lines
              }
            }
          }

          if (buffer.trim()) {
            try {
              const parsed = JSON.parse(buffer)
              if (parsed.message?.content) {
                controller.enqueue(encoder.encode(parsed.message.content))
              }
            } catch {}
          }
        } catch (err) {
          if ((err as Error).name === "AbortError") {
            controller.enqueue(encoder.encode("\n\n[Request timed out]"))
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  } catch (err) {
    console.error("[AI_CHAT]", err)
    return NextResponse.json(
      { error: "Failed to communicate with AI service" },
      { status: 500 },
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    },
  )
}
