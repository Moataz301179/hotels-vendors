/**
 * Social Media Campaign Engine
 * Core business logic for creating, scheduling, and managing social media campaigns.
 */

import { prisma } from "@/lib/prisma";
import {
  generateContent,
  schedulePost,
  type GenerateContentRequest,
} from "./openclaw-client";
import { SocialPlatform, CampaignObjective, CampaignStatus, PostStatus } from "@prisma/client";

export interface CreateCampaignInput {
  name: string;
  description?: string;
  objective: CampaignObjective;
  targetRoles: string[];
  platforms: SocialPlatform[];
  budgetEgp?: number;
  startDate: Date;
  endDate?: Date;
  contentStrategy?: {
    themes: string[];
    tone: "professional" | "casual" | "exciting" | "educational";
    hashtags: string[];
    postingFrequency: "daily" | "3x_week" | "weekly";
  };
}

export interface CreatePostsInput {
  campaignId: string;
  count: number;
  topics?: string[];
}

/**
 * Create a new social media campaign
 */
export async function createCampaign(input: CreateCampaignInput) {
  const campaign = await prisma.socialCampaign.create({
    data: {
      name: input.name,
      description: input.description,
      objective: input.objective,
      targetRoles: input.targetRoles,
      platforms: input.platforms,
      budgetEgp: input.budgetEgp,
      startDate: input.startDate,
      endDate: input.endDate,
      status: CampaignStatus.DRAFT,
      contentStrategy: input.contentStrategy
        ? JSON.stringify(input.contentStrategy)
        : undefined,
    },
  });

  return campaign;
}

/**
 * Auto-generate and schedule posts for a campaign using OpenClaw AI
 */
export async function generateCampaignPosts(input: CreatePostsInput) {
  const campaign = await prisma.socialCampaign.findUnique({
    where: { id: input.campaignId },
  });

  if (!campaign) throw new Error("Campaign not found");
  if (campaign.status === CampaignStatus.CANCELLED) {
    throw new Error("Cannot generate posts for cancelled campaign");
  }

  const strategy = campaign.contentStrategy
    ? JSON.parse(campaign.contentStrategy)
    : null;

  const topics =
    input.topics || strategy?.themes || ["Hotels Vendors platform launch"];
  const tone = strategy?.tone || "professional";
  const baseHashtags = strategy?.hashtags || ["#HotelsVendors", "#EgyptHospitality"];

  const posts = [];
  const now = new Date();
  const frequencyMs =
    strategy?.postingFrequency === "daily"
      ? 24 * 60 * 60 * 1000
      : strategy?.postingFrequency === "3x_week"
      ? 2 * 24 * 60 * 60 * 1000
      : 7 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < input.count; i++) {
    const topic = topics[i % topics.length];
    const platform = campaign.platforms[i % campaign.platforms.length];

    // Generate content via OpenClaw
    const contentReq: GenerateContentRequest = {
      platform,
      objective: campaign.objective,
      topic,
      tone,
      audience: `Egyptian ${campaign.targetRoles.join(", ")} professionals`,
      hashtags: baseHashtags,
      includeCta: campaign.objective === "CONVERSION" || campaign.objective === "LEAD_GENERATION",
    };

    let generated;
    try {
      generated = await generateContent(contentReq);
    } catch (err) {
      console.error("[CampaignEngine] Content generation failed:", err);
      generated = {
        content: `${topic}. Hotels Vendors — Smarter Together.`,
        hashtags: baseHashtags,
        confidence: 0.5,
      };
    }

    const scheduledAt = new Date(now.getTime() + (i + 1) * frequencyMs);

    const post = await prisma.socialPost.create({
      data: {
        campaignId: campaign.id,
        platform,
        content: generated.content,
        hashtags: generated.hashtags.join(" "),
        scheduledAt,
        status: PostStatus.DRAFT,
      },
    });

    posts.push(post);
  }

  // Update campaign status to scheduled if it was draft
  if (campaign.status === CampaignStatus.DRAFT && posts.length > 0) {
    await prisma.socialCampaign.update({
      where: { id: campaign.id },
      data: { status: CampaignStatus.SCHEDULED },
    });
  }

  return posts;
}

/**
 * Publish approved posts that are due
 * Called by a cron job or swarm agent
 */
export async function publishDuePosts() {
  const duePosts = await prisma.socialPost.findMany({
    where: {
      status: PostStatus.SCHEDULED,
      scheduledAt: { lte: new Date() },
    },
    include: { campaign: true },
  });

  const results = [];

  for (const post of duePosts) {
    try {
      // Attempt to schedule via OpenClaw automation
      const scheduleRes = await schedulePost({
        platform: post.platform,
        content: post.content,
        mediaUrls: post.mediaUrls ? JSON.parse(post.mediaUrls) : undefined,
        scheduledAt: post.scheduledAt.toISOString(),
        campaignName: post.campaign.name,
      });

      if (scheduleRes.success) {
        await prisma.socialPost.update({
          where: { id: post.id },
          data: {
            status: PostStatus.PUBLISHED,
            publishedAt: new Date(),
          },
        });
        results.push({ id: post.id, status: "published" });
      } else {
        await prisma.socialPost.update({
          where: { id: post.id },
          data: { status: PostStatus.FAILED },
        });
        results.push({ id: post.id, status: "failed", error: scheduleRes.error });
      }
    } catch (err) {
      console.error(`[CampaignEngine] Failed to publish post ${post.id}:`, err);
      await prisma.socialPost.update({
        where: { id: post.id },
        data: { status: PostStatus.FAILED },
      });
      results.push({ id: post.id, status: "failed", error: String(err) });
    }
  }

  return results;
}

/**
 * Get campaign dashboard metrics
 */
export async function getCampaignMetrics(campaignId: string) {
  const campaign = await prisma.socialCampaign.findUnique({
    where: { id: campaignId },
    include: {
      posts: {
        orderBy: { scheduledAt: "asc" },
      },
    },
  });

  if (!campaign) throw new Error("Campaign not found");

  const totalPosts = campaign.posts.length;
  const publishedPosts = campaign.posts.filter((p) => p.status === PostStatus.PUBLISHED).length;
  const scheduledPosts = campaign.posts.filter((p) => p.status === PostStatus.SCHEDULED).length;
  const failedPosts = campaign.posts.filter((p) => p.status === PostStatus.FAILED).length;

  // Aggregate engagement
  let totalEngagement = { likes: 0, shares: 0, comments: 0, clicks: 0 };
  for (const post of campaign.posts) {
    if (post.engagement) {
      try {
        const e = JSON.parse(post.engagement);
        totalEngagement.likes += e.likes || 0;
        totalEngagement.shares += e.shares || 0;
        totalEngagement.comments += e.comments || 0;
        totalEngagement.clicks += e.clicks || 0;
      } catch {
        // ignore parse errors
      }
    }
  }

  return {
    campaign,
    stats: {
      totalPosts,
      publishedPosts,
      scheduledPosts,
      failedPosts,
      draftPosts: totalPosts - publishedPosts - scheduledPosts - failedPosts,
      engagement: totalEngagement,
    },
  };
}

/**
 * Get all campaigns with summary stats
 */
export async function getAllCampaigns() {
  const campaigns = await prisma.socialCampaign.findMany({
    include: {
      _count: { select: { posts: true } },
      posts: {
        where: { status: PostStatus.PUBLISHED },
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return campaigns.map((c) => ({
    id: c.id,
    name: c.name,
    objective: c.objective,
    status: c.status,
    platforms: c.platforms,
    startDate: c.startDate,
    endDate: c.endDate,
    totalPosts: c._count.posts,
    publishedPosts: c.posts.length,
  }));
}
