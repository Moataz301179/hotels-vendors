import { NextRequest, NextResponse } from "next/server";
import { publishDuePosts } from "@/lib/social-media/campaign-engine";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/v1/social/queue
 * Process the social media publishing queue.
 * Called by swarm agents, cron jobs, or admin actions.
 */
export async function POST(req: NextRequest) {
  try {
    // Optional: verify a simple secret for non-authenticated cron calls
    const authHeader = req.headers.get("x-queue-secret");
    const expectedSecret = process.env.SOCIAL_QUEUE_SECRET;
    
    if (expectedSecret && authHeader !== expectedSecret) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Publish posts that are due
    const results = await publishDuePosts();

    // Also count pending posts for the next run
    const pendingCount = await prisma.socialPost.count({
      where: {
        status: "SCHEDULED",
        scheduledAt: { gt: new Date() },
      },
    });

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
      pendingForFuture: pendingCount,
    });
  } catch (error) {
    console.error("[SocialQueue] POST error:", error);
    return NextResponse.json(
      { error: "Failed to process queue" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/social/queue
 * Queue status overview for admin dashboard
 */
export async function GET(req: NextRequest) {
  try {
    const now = new Date();

    const [
      overdueCount,
      scheduledCount,
      draftCount,
      publishedToday,
      failedCount,
    ] = await Promise.all([
      prisma.socialPost.count({
        where: { status: "SCHEDULED", scheduledAt: { lte: now } },
      }),
      prisma.socialPost.count({
        where: { status: "SCHEDULED", scheduledAt: { gt: now } },
      }),
      prisma.socialPost.count({ where: { status: "DRAFT" } }),
      prisma.socialPost.count({
        where: {
          status: "PUBLISHED",
          publishedAt: { gte: new Date(now.setHours(0, 0, 0, 0)) },
        },
      }),
      prisma.socialPost.count({ where: { status: "FAILED" } }),
    ]);

    return NextResponse.json({
      queue: {
        overdue: overdueCount,
        scheduled: scheduledCount,
        draft: draftCount,
        publishedToday,
        failed: failedCount,
      },
    });
  } catch (error) {
    console.error("[SocialQueue] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch queue status" },
      { status: 500 }
    );
  }
}
