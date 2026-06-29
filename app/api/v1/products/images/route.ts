import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { apiRoute, authenticate, requirePermission } from "@/lib/api-utils";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export const POST = apiRoute(async (request: NextRequest) => {
  await authenticate(request);
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ success: false, error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return Response.json({ success: false, error: "Only JPEG, PNG, and WebP are allowed" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ success: false, error: "File exceeds 5 MB limit" }, { status: 413 });
  }

  const ext = file.type === "image/jpeg" ? "jpg" : file.type === "image/webp" ? "webp" : "png";
  const filename = `${randomUUID()}.${ext}`;
  const uploadsDir = join(process.cwd(), "public", "uploads");

  await mkdir(uploadsDir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(join(uploadsDir, filename), bytes);

  return Response.json({ success: true, data: { url: `/uploads/${filename}` } });
});
