// @ts-nocheck
/**
 * Conversation API — HotelsVendors AI
 * List, create, and delete user conversations.
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";

// GET /api/v1/ai/conversations — List user's conversations
export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);

  const conversations = await prisma.conversation.findMany({
    where: { userId: auth.userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { messages: true } },
    },
  });

  return success({
    conversations: conversations.map((c) => ({
      id: c.id,
      title: c.title,
      role: c.role,
      messageCount: c._count.messages,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    })),
  });
});

// POST /api/v1/ai/conversations — Create a new conversation
export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = await request.json().catch(() => ({}));
  const { title, role = "hotel" } = body;

  const conversation = await prisma.conversation.create({
    data: {
      userId: auth.userId,
      tenantId: auth.tenantId,
      title: title || "New Conversation",
      role,
    },
  });

  return success({ conversation });
});
