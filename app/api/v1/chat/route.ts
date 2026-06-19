import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, audit } from "@/lib/api-utils";
import { z } from "zod";

const ChatSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.string().optional(),
});

const SYSTEM_PROMPT = `You are HotelsVendors AI Guide — an expert assistant for Egypt's B2B hospitality procurement platform.

Key facts about HotelsVendors:
- Founded in 2023 by Moataz (former EY/Deloitte/KPMG auditor)
- Owned by Restaurants for E-Marketing (Tax ID: 704226146, Commercial Registry: 105300900196948)
- Egypt's first AI-native B2B procurement platform for hospitality
- Operates as a technical data orchestrator (not a bank, not a payment provider)
- ETA e-invoicing compliant (Egyptian Tax Authority)
- 680+ verified suppliers across 6 governorates
- AI demand forecasting with 94% accuracy
- Reverse factoring: suppliers paid in 48 hours
- Free to join, earn 1% on bank transfers, 1.5-3% on factoring
- INVO is the vendor marketplace sub-layer
- Serves coastal hotels in Sharm El-Sheikh, Hurghada, Cairo, Alexandria, North Coast
- Target customers: local branded hotel chains (Stella Di Mare, Sunrise, Jaz, Baron)
- ISO 27001 aligned, AES-256-GCM encryption, data hosted in Egypt

Answer questions concisely and accurately. If you don't know something, say so honestly. Always be helpful and professional.`;

async function callOllama(message: string, conversationId?: string): Promise<string> {
  const vpsUrl = process.env.OLLAMA_URL || process.env.NEXT_PUBLIC_VPS_API_URL || process.env.VPS_API_URL;
  const ollamaModel = process.env.OLLAMA_MODEL || "llama3.2:latest";

  if (!vpsUrl) {
    throw new Error("Ollama URL not configured. Set OLLAMA_URL, NEXT_PUBLIC_VPS_API_URL, or VPS_API_URL");
  }

  // Build conversation context if we have history
  let prompt = message;
  if (conversationId) {
    try {
      const history = await prisma.chatMessage.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
        take: 10, // last 10 messages for context
      });
      if (history.length > 1) {
        const context = history
          .slice(0, -1) // exclude the latest (current) message
          .map((m) => `${m.role === "USER" ? "User" : "Assistant"}: ${m.content}`)
          .join("\n");
        prompt = `${SYSTEM_PROMPT}\n\nConversation history:\n${context}\n\nUser: ${message}\nAssistant:`;
      } else {
        prompt = `${SYSTEM_PROMPT}\n\nUser: ${message}\nAssistant:`;
      }
    } catch {
      prompt = `${SYSTEM_PROMPT}\n\nUser: ${message}\nAssistant:`;
    }
  } else {
    prompt = `${SYSTEM_PROMPT}\n\nUser: ${message}\nAssistant:`;
  }

  const ollamaUrl = `${vpsUrl.replace(/\/$/, "")}/api/generate`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(ollamaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: ollamaModel,
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 512,
        },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Ollama returned ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    return data.response?.trim() || "I apologize, I couldn't generate a response. Please try again.";
  } finally {
    clearTimeout(timeout);
  }
}

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = await request.json();
  const { message, conversationId } = ChatSchema.parse(body);

  let conversation;
  if (conversationId) {
    conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, userId: auth.userId },
    });
  }

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        userId: auth.userId,
        title: message.slice(0, 50),
        tenantId: auth.tenantId,
        role: "GENERAL",
      },
    });
  }

  await prisma.chatMessage.create({
    data: {
      conversationId: conversation.id,
      role: "USER",
      content: message,
    },
  });

  const agentRun = await prisma.agentRun.create({
    data: {
      taskType: "chat",
      taskName: "chat-response",
      prompt: message,
      agentName: "chatbot",
      status: "RUNNING",
      tenantId: auth.tenantId,
    },
  });

  let aiResponse: string;
  try {
    aiResponse = await callOllama(message, conversation.id);
  } catch (ollamaError) {
    console.error("Ollama call failed:", ollamaError);
    aiResponse = "I'm having trouble connecting to my AI engine right now. Please try again in a moment. If the issue persists, contact support.";
  }

  await prisma.chatMessage.create({
    data: {
      conversationId: conversation.id,
      role: "ASSISTANT",
      content: aiResponse,
    },
  });

  await prisma.agentRun.update({
    where: { id: agentRun.id },
    data: { status: "COMPLETED", output: aiResponse },
  });

  await audit({
    entityType: "CHAT",
    entityId: conversation.id,
    action: "CHAT_MESSAGE_SENT",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { conversationId: conversation.id, agentRunId: agentRun.id },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    conversationId: conversation.id,
    response: aiResponse,
    agentRunId: agentRun.id,
  });
});
