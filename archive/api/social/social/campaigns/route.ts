import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createCampaign,
  generateCampaignPosts,
  getCampaignMetrics,
  getAllCampaigns,
} from "@/lib/social-media/campaign-engine";
import { CampaignObjective, SocialPlatform } from "@prisma/client";

const createSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  description: z.string().optional(),
  objective: z.nativeEnum(CampaignObjective),
  targetRoles: z.array(z.string()).min(1, "At least one target role is required"),
  platforms: z.array(z.nativeEnum(SocialPlatform)).min(1, "At least one platform is required"),
  budgetEgp: z.number().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  contentStrategy: z
    .object({
      themes: z.array(z.string()),
      tone: z.enum(["professional", "casual", "exciting", "educational"]),
      hashtags: z.array(z.string()),
      postingFrequency: z.enum(["daily", "3x_week", "weekly"]),
    })
    .optional(),
});

const generatePostsSchema = z.object({
  campaignId: z.string(),
  count: z.number().min(1).max(50).default(5),
  topics: z.array(z.string()).optional(),
});

// GET /api/v1/social/campaigns — List all campaigns
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const metrics = await getCampaignMetrics(id);
      return NextResponse.json(metrics);
    }

    const campaigns = await getAllCampaigns();
    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error("[SocialCampaigns] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

// POST /api/v1/social/campaigns — Create a new campaign
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const campaign = await createCampaign({
      ...parsed.data,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : undefined,
    });

    return NextResponse.json({ success: true, campaign }, { status: 201 });
  } catch (error) {
    console.error("[SocialCampaigns] POST error:", error);
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/social/campaigns — Generate posts for a campaign
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = generatePostsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const posts = await generateCampaignPosts(parsed.data);

    return NextResponse.json({ success: true, posts, count: posts.length });
  } catch (error) {
    console.error("[SocialCampaigns] PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to generate posts" },
      { status: 500 }
    );
  }
}
