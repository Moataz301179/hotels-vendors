import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  apiRoute,
  authenticate,
  validateBody,
  success,
  requirePermission,
} from "@/lib/api-utils";
import { draftOutreach } from "@/lib/swarm/acquisition-engine";
import { sendEmail } from "@/lib/notifications/email";
import { sendWhatsApp } from "@/lib/integrations/whatsapp";

const OutreachSchema = z.object({
  channel: z.enum(["email", "whatsapp"]).default("email"),
  subject: z.string().optional(),
  body: z.string().optional(),
  autoSend: z.boolean().default(false),
});

export const POST = apiRoute(async (request: NextRequest, { params }: { params: { id: string } }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "lead:update");

  const reqBody = await request.json();
  const data = validateBody(OutreachSchema, reqBody);

  const lead = await prisma.lead.findFirst({
    where: { id: params.id, tenantId: auth.tenantId },
  });

  if (!lead) {
    return success({ error: "Lead not found" }, 404);
  }

  let subject = data.subject;
  let messageBody = data.body;
  let channel = data.channel;

  // If no custom message provided, draft one with AI
  if (!subject || !messageBody) {
    const draft = await draftOutreach(params.id, auth.tenantId, params.id);
    if (!draft) {
      return success({ error: "Failed to draft outreach message" }, 500);
    }
    subject = draft.subject;
    messageBody = draft.body;
    channel = draft.channel as "email" | "whatsapp";
  }

  // Update the draft outreach log
  const log = await prisma.outreachLog.findFirst({
    where: { leadId: params.id, status: "DRAFT" },
    orderBy: { createdAt: "desc" },
  });

  if (log) {
    await prisma.outreachLog.update({
      where: { id: log.id },
      data: {
        channel,
        subject,
        body: messageBody,
        status: data.autoSend ? "SENT" : "PENDING_APPROVAL",
      },
    });
  }

  // Auto-send if requested
  if (data.autoSend) {
    if (channel === "email" && lead.email) {
      await sendEmail({
        to: [lead.email],
        subject: subject || "Hotels Vendors Partnership",
        html: messageBody || "",
      });
    } else if (channel === "whatsapp" && lead.phone) {
      await sendWhatsApp(
        { to: lead.phone, body: messageBody || "" },
        { agentId: "outreach-agent", agentName: "Outreach Agent", leadId: lead.id }
      );
    }

    await prisma.lead.update({
      where: { id: params.id },
      data: {
        status: "CONTACTED",
        lastContactAt: new Date(),
        contactCount: { increment: 1 },
      },
    });
  }

  return success({
    leadId: params.id,
    channel,
    subject,
    body: messageBody,
    status: data.autoSend ? "SENT" : "PENDING_APPROVAL",
    autoSend: data.autoSend,
  });
});
