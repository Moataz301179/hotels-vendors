/**
 * Push Notification Pipeline — Expo server SDK.
 * register: POST /api/v1/push/register { token, platform }
 * emit:     emitPush(userId, tenantId, { title, body, data }) — fire-and-forget
 * Used by order events (approval requested/decided, confirmed, delivered),
 * factoring offers, and GRN events. Never blocks the main flow.
 */
import { prisma } from "@/lib/prisma";

const EXPO_API = "https://exp.host/--/api/v2/push/send";

export interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, string | number>;
  channelId?: string;
}

/** Send to all devices of one user. Fails soft — push never breaks business flow. */
export async function emitPush(
  userId: string,
  tenantId: string,
  payload: PushPayload
): Promise<{ sent: number }> {
  try {
    const tokens = await prisma.pushToken.findMany({
      where: { userId, tenantId, deletedAt: null },
      select: { token: true },
    });
    if (!tokens.length) return { sent: 0 };

    const messages = tokens.map((t) => ({
      to: t.token,
      title: payload.title,
      body: payload.body,
      data: payload.data ?? {},
      sound: "default",
      channelId: payload.channelId ?? "default",
    }));

    const res = await fetch(EXPO_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messages),
    });
    if (!res.ok) {
      console.error("[push] expo api error:", res.status);
      return { sent: 0 };
    }
    const j = (await res.json()) as { data?: Array<{ status: string }> };
    const sent = (j.data ?? []).filter((d) => d.status === "ok").length;
    return { sent };
  } catch (err) {
    console.error("[push] emit failed (soft):", (err as Error).message);
    return { sent: 0 };
  }
}

/** Send to every user in a tenant holding a permission-relevant role (e.g., all HOTEL approvers). */
export async function emitPushToUsers(
  userIds: string[],
  tenantId: string,
  payload: PushPayload
): Promise<{ sent: number }> {
  let sent = 0;
  for (const uid of userIds) {
    const r = await emitPush(uid, tenantId, payload);
    sent += r.sent;
  }
  return { sent };
}
