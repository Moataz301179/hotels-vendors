import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { PostStatus, SocialPlatform } from "@prisma/client";

const updateSchema = z.object({
  id: z.string(),
  content: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
  status: z.nativeEnum(PostStatus).optional(),
  hashtags: z.string().optional(),
});

// GET /api/v1/social/posts — List posts with filtering
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get("campaignId");
    const status = searchParams.get("status");
    const platform = searchParams.get("platform");

    const posts = await prisma.socialPost.findMany({
      where: {
        ...(campaignId && { campaignId }),
        ...(status && { status: status as PostStatus }),
        ...(platform && { platform: platform as SocialPlatform }),
      },
      include: { campaign: { select: { name: true, objective: true } } },
      orderBy: { scheduledAt: "asc" },
    });

    return NextResponse.json({ posts, count: posts.length });
  } catch (error) {
    console.error("[SocialPosts] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/social/posts — Update a post
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { id, ...data } = parsed.data;

    const post = await prisma.socialPost.update({
      where: { id },
      data: {
        ...data,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      },
      include: { campaign: { select: { name: true } } },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("[SocialPosts] PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/social/posts — Delete a post
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    await prisma.socialPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SocialPosts] DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
