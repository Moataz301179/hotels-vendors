import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

const UPLOAD_DIR = "/var/www/hotelsvendors-v2/public/uploads/design-studio";

export async function POST(req: NextRequest) {
  try {
    const { file, name, type } = await req.json();
    if (!file || !name) {
      return NextResponse.json({ error: "File data and name required" }, { status: 400 });
    }

    const match = file.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ error: "Invalid file format. Expected base64 data URI." }, { status: 400 });
    }

    const mimeType = match[1];
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, "base64");

    const ext = name.split(".").pop() || "png";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = join(UPLOAD_DIR, safeName);

    mkdirSync(UPLOAD_DIR, { recursive: true });
    writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/design-studio/${safeName}`;

    return NextResponse.json({
      url: publicUrl,
      name: safeName,
      size: buffer.length,
      type: mimeType,
    });
  } catch (e: any) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
