import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, audit } from "@/lib/api-utils";
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

  const aiResponse = "I'm processing your request. This is a placeholder response.";

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
