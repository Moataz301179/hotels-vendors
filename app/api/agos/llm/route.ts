// AgentOS LLM Route - Groq → Ollama Fallback for Localhost
import { NextRequest, NextResponse } from "next/server";
import { agentOS } from "@/lib/agos/core";

// Helper: query OpenRouter/Groq - only if key available
async function callGroq(messages: any[]) {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AgentOS Local"
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "groq/meta-llama/llama-3.1-8b-instant",
        messages: messages
      }),
    });

    if (!res.ok) {
      console.warn("[LLM] Groq/OpenRouter failed:", res.status);
      return null;
    }

    return res.json();
  } catch (error) {
    console.warn("[LLM] Network error calling Groq:", error);
    return null;
  }
}

// Helper: query local Ollama - the reliable fallback
async function callOllama(messages: any[]) {
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL || "phi3:3.8b";

  try {
    const lastMessage = messages[messages.length - 1];
    const prompt = lastMessage?.content || "Hello";

    const res = await fetch(`${ollamaUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model,
        messages: messages,
        stream: false,
        options: {
          temperature: 0.7,
          max_tokens: 1024
        }
      }),
    });

    if (!res.ok) {
      console.warn("[LLM] Ollama failed:", res.status);
      return null;
    }

    const data = await res.json();
    return {
      choices: [{
        message: {
          content: data.message?.content || "No response from local model",
          role: "assistant"
        }
      }],
      model: `ollama/${model}`
    };
  } catch (error) {
    console.warn("[LLM] Ollama network error:", error);
    return null;
  }
}

// Main POST handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, taskId, action, agentId, description } = body;

    // Handle task execution from agent
    if (action === "execute") {
      if (!taskId || !agentId) {
        return NextResponse.json(
          { error: "Task execution requires taskId and agentId" },
          { status: 400 }
        );
      }

      const task = agentOS.startTask(taskId, agentId, description || "No description");
      const result = await agentOS.executeTask(taskId, agentId);

      return NextResponse.json({
        success: true,
        taskId,
        agentId,
        status: "completed",
        result
      });
    }

    // Handle LLM requests
    if (messages && Array.isArray(messages)) {
      // Try Groq/OpenRouter first (fastest)
      const groqResult = await Promise.race([
        callGroq(messages).catch(() => null),
        new Promise((resolve) => setTimeout(() => resolve(null), 3000)) // 3s timeout
      ]);

      if (groqResult && groqResult.choices?.[0]?.message?.content) {
        return NextResponse.json({
          ...groqResult,
          provider: "groq",
          usage: { fast: true }
        });
      }

      // Fallback to local Ollama (always available)
      const ollamaResult = await callOllama(messages);

      if (ollamaResult && ollamaResult.choices?.[0]?.message?.content) {
        return NextResponse.json({
          ...ollamaResult,
          provider: "ollama",
          usage: { fast: false, model: process.env.OLLAMA_MODEL || "phi3:3.8b" }
        });
      }

      // Both failed
      return NextResponse.json(
        { error: "LLM providers unavailable - network issue or service down" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Invalid request - need messages array or action" },
      { status: 400 }
    );

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Server error: ${errorMsg}` },
      { status: 500 }
    );
  }
}

// GET health check
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: "ok",
    version: "1.0.0",
    agents: agentOS.listAgents().length,
    tasks: agentOS.listTasks().length,
    providers: {
      groq: !!process.env.OPENROUTER_API_KEY || !!process.env.GROQ_API_KEY,
      ollama: "http://localhost:11434"
    }
  });
}