/**
 * OpenClaw Social Media Automation Client
 * Bridges Hotels Vendors to OpenClaw for social media marketing tasks:
 * - Content generation
 * - Post scheduling
 * - Audience analysis
 * - Campaign performance tracking
 */

import { proxyOpenClawAutomation } from "@/lib/integrations/openclaw";
import { SocialPlatform, CampaignObjective } from "@prisma/client";

export interface GenerateContentRequest {
  platform: SocialPlatform;
  objective: CampaignObjective;
  topic: string;
  tone: "professional" | "casual" | "exciting" | "educational";
  audience: string; // e.g., "Egyptian hotel procurement managers"
  hashtags?: string[];
  maxLength?: number;
  includeCta?: boolean;
}

export interface GenerateContentResponse {
  content: string;
  hashtags: string[];
  suggestedImagePrompt?: string;
  suggestedPostingTime?: string; // ISO time
  confidence: number; // 0-1
}

export interface AudienceAnalysisRequest {
  platform: SocialPlatform;
  targetRoles: string[];
  locations?: string[];
  interests?: string[];
}

export interface AudienceAnalysisResponse {
  estimatedReach: number;
  bestPostingTimes: string[]; // e.g., ["09:00", "18:00"]
  topHashtags: string[];
  contentThemes: string[];
  competitorInsights?: string;
}

export interface SchedulePostRequest {
  platform: SocialPlatform;
  content: string;
  mediaUrls?: string[];
  scheduledAt: string; // ISO datetime
  campaignName: string;
}

export interface SchedulePostResponse {
  success: boolean;
  jobId?: string;
  scheduledAt: string;
  platform: SocialPlatform;
  error?: string;
}

export interface CampaignPerformanceRequest {
  campaignId: string;
  platforms: SocialPlatform[];
  startDate: string;
  endDate?: string;
}

export interface CampaignPerformanceResponse {
  impressions: number;
  clicks: number;
  conversions: number;
  engagement: number;
  spend: number;
  platformBreakdown: Record<string, { impressions: number; clicks: number }>;
}

/**
 * Generate social media content via OpenClaw AI
 */
export async function generateContent(
  req: GenerateContentRequest
): Promise<GenerateContentResponse> {
  const res = await proxyOpenClawAutomation("/social/generate", {
    method: "POST",
    body: {
      ...req,
      brand: "Hotels Vendors",
      industry: "hospitality procurement",
      market: "Egypt",
    },
  });

  if (!res.ok) {
    console.warn("[OpenClaw] Content generation failed, using fallback:", res.data);
    return generateFallbackContent(req);
  }

  return res.data as GenerateContentResponse;
}

/**
 * Analyze audience and get recommendations via OpenClaw
 */
export async function analyzeAudience(
  req: AudienceAnalysisRequest
): Promise<AudienceAnalysisResponse> {
  const res = await proxyOpenClawAutomation("/social/audience", {
    method: "POST",
    body: req as unknown as Record<string, unknown>,
  });

  if (!res.ok) {
    return generateFallbackAudience(req);
  }

  return res.data as AudienceAnalysisResponse;
}

/**
 * Schedule a post via OpenClaw automation engine
 */
export async function schedulePost(
  req: SchedulePostRequest
): Promise<SchedulePostResponse> {
  const res = await proxyOpenClawAutomation("/social/schedule", {
    method: "POST",
    body: req as unknown as Record<string, unknown>,
  });

  if (!res.ok) {
    return {
      success: false,
      scheduledAt: req.scheduledAt,
      platform: req.platform,
      error: String(res.data),
    };
  }

  return res.data as SchedulePostResponse;
}

/**
 * Get campaign performance from OpenClaw
 */
export async function getCampaignPerformance(
  req: CampaignPerformanceRequest
): Promise<CampaignPerformanceResponse> {
  const res = await proxyOpenClawAutomation("/social/performance", {
    method: "POST",
    body: req as unknown as Record<string, unknown>,
  });

  if (!res.ok) {
    return {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      engagement: 0,
      spend: 0,
      platformBreakdown: {},
    };
  }

  return res.data as CampaignPerformanceResponse;
}

// ─────────────────────────────────────────
// Fallback generators (when OpenClaw is down)
// ─────────────────────────────────────────

function generateFallbackContent(
  req: GenerateContentRequest
): GenerateContentResponse {
  const templates: Record<CampaignObjective, string[]> = {
    AWARENESS: [
      `🚀 Hotels Vendors is transforming how Egyptian hotels procure. ${req.topic}. Discover the platform built for hospitality.`,
      `The future of hotel procurement in Egypt starts here. ${req.topic}. Join the revolution.`,
    ],
    ENGAGEMENT: [
      `What if your hotel could cut procurement costs by 30%? ${req.topic}. Share your thoughts below 👇`,
      `Egyptian hoteliers: what is your biggest procurement challenge? ${req.topic}. Let's discuss.`,
    ],
    CONVERSION: [
      `Ready to streamline your hotel's supply chain? ${req.topic}. Sign up for early access today.`,
      `Join 500+ Egyptian hotels already saving time and money. ${req.topic}. Register now.`,
    ],
    RETENTION: [
      `Thank you to our amazing community of hotel partners. ${req.topic}. Here's what is coming next.`,
      `Your feedback shapes Hotels Vendors. ${req.topic}. Stay tuned for new features.`,
    ],
    LEAD_GENERATION: [
      `Be the first to experience smarter procurement. ${req.topic}. Join our beta waiting list.`,
      `Limited beta spots available. ${req.topic}. Reserve yours now.`,
    ],
  };

  const content =
    templates[req.objective]?.[Math.floor(Math.random() * (templates[req.objective]?.length || 1))] ||
    `${req.topic}. Hotels Vendors — Smarter Together.`;

  const defaultHashtags = [
    "#HotelsVendors",
    "#EgyptHospitality",
    "#HotelProcurement",
    "#B2BMarketplace",
    "#SmarterTogether",
  ];

  return {
    content: content.length > (req.maxLength || 500)
      ? content.slice(0, req.maxLength || 500)
      : content,
    hashtags: req.hashtags || defaultHashtags,
    suggestedPostingTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    confidence: 0.6,
  };
}

function generateFallbackAudience(
  req: AudienceAnalysisRequest
): AudienceAnalysisResponse {
  return {
    estimatedReach: 5000,
    bestPostingTimes: ["09:00", "13:00", "18:00"],
    topHashtags: [
      "#HotelsVendors",
      "#EgyptHospitality",
      "#HotelProcurement",
      "#B2BEgypt",
      "#HospitalityTech",
    ],
    contentThemes: [
      "Procurement cost savings",
      "Supplier spotlights",
      "Industry insights",
      "Beta launch updates",
      "Behind the scenes",
    ],
  };
}
