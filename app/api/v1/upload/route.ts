/**
 * Upload API — Product Images
 * POST /api/v1/upload — Upload product images
 */

import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/api-utils";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomBytes } from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "products");

export async function POST(request: NextRequest) {
  try {
    // Require auth
    await authenticate(request);

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided" },
        { status: 400 }
      );
    }

    if (files.length > 5) {
      return NextResponse.json(
        { success: false, error: "Maximum 5 images per upload" },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF` },
          { status: 400 }
        );
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: `File too large: ${file.name}. Max size: 5MB` },
          { status: 400 }
        );
      }

      // Generate unique filename
      const ext = file.name.split(".").pop() || "jpg";
      const uniqueId = randomBytes(16).toString("hex");
      const filename = `${uniqueId}.${ext}`;

      // Convert to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(join(UPLOAD_DIR, filename), buffer);

      // Return public URL
      const url = `/uploads/products/${filename}`;
      uploadedUrls.push(url);
    }

    return NextResponse.json({
      success: true,
      data: { urls: uploadedUrls },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
