/**
 * Notifications API
 * GET  — List user notifications
 * POST — Mark as read
 */

import { NextRequest } from "next/server";
import {
  apiRoute,
  authenticate,
  success,
} from "@/lib/api-utils";
import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "@/lib/compliance/notifications";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const { searchParams } = new URL(request.url);
  const limit = Math.min(100, parseInt(searchParams.get("limit") || "50", 10));

  const [notifications, unreadCount] = await Promise.all([
    getUserNotifications(auth.userId, limit),
    getUnreadCount(auth.userId),
  ]);

  return success({ notifications, unreadCount });
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = await request.json();

  if (body.markAllRead) {
    await markAllAsRead(auth.userId);
    return success({ markedAllRead: true });
  }

  if (body.ids && Array.isArray(body.ids)) {
    await markAsRead(body.ids, auth.userId);
    return success({ markedRead: body.ids.length });
  }

  return success({});
});
