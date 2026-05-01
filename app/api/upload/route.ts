import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { writeFile } from "fs/promises";
import { mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || ".bin";
    const fileName = `${randomUUID()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      data: {
        fileName: file.name,
        url: fileUrl,
        size: file.size,
        type: file.type,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
