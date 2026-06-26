import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, audit } from "@/lib/api-utils";
import { executeLLM } from "@/lib/ai/llm";
import { buildSystemPrompt, type AssistantRole } from "@/components/ai-assistant/prompts";
import { z } from "zod";

const ChatSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.string().optional(),
});

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
    // Determine role from user's platform role
    const role: AssistantRole = (() => {
      const r = auth.platformRole?.toLowerCase() as AssistantRole | undefined;
      if (r && ["hotel", "supplier", "factoring", "shipping", "admin", "public"].includes(r)) return r;
      return "public";
    })();

    // Build system prompt using the shared prompt registry
    const systemPrompt = buildSystemPrompt(role);

    // Load conversation history from DB for context
    const dbHistory = await prisma.chatMessage.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
      take: 20, // last 20 messages for context window
    });

    // Build messages array for the chat API
    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...dbHistory
        .filter((m) => m.role === "USER" || m.role === "ASSISTANT")
        .map((m) => ({
          role: (m.role === "USER" ? "user" : "assistant") as "user" | "assistant",
          content: m.content,
        })),
    ];

    const result = await executeLLM(messages, {
      maxTokens: 800,
      temperature: 0.5,
    });

    if (result.provider === "none" || result.content === "Service unavailable.") {
      throw new Error("LLM provider unavailable");
    }

    aiResponse = result.content;
  } catch (ollamaError) {
    console.error("Ollama call failed:", ollamaError);
    aiResponse =
      "I'm having trouble connecting to my AI engine right now. Please try again in a moment. If the issue persists, contact our support team at support@hotelsvendors.com.";
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
