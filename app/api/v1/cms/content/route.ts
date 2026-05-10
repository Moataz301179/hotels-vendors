import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const CMS_FILE = join(process.cwd(), "data", "cms-content.json");

async function readCms() {
  try {
    const data = await readFile(CMS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { pages: {} };
  }
}

async function writeCms(data: unknown) {
  await writeFile(CMS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const data = await readCms();

    if (page) {
      const pageData = data.pages?.[page];
      if (!pageData) {
        return NextResponse.json(
          { success: false, error: "Page not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: pageData });
    }

    return NextResponse.json({ success: true, data: data.pages });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to read CMS content" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, content } = body;

    if (!page || typeof content !== "object") {
      return NextResponse.json(
        { success: false, error: "Missing page or content" },
        { status: 400 }
      );
    }

    const data = await readCms();
    data.pages = data.pages || {};
    data.pages[page] = { ...data.pages[page], ...content };
    await writeCms(data);

    return NextResponse.json({
      success: true,
      data: data.pages[page],
      message: `${page} content updated`,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update CMS content" },
      { status: 500 }
    );
  }
}
