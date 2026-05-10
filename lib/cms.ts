import { readFile } from "fs/promises";
import { join } from "path";

export interface CmsPage {
  title?: string;
  subtitle?: string;
  heroTitle?: string;
  heroDescription?: string;
  description?: string;
  features?: Array<{ title: string; description: string }>;
  pricingTiers?: Array<{
    name: string;
    price: string;
    description: string;
    features: string[];
  }>;
  faqs?: Array<{ question: string; answer: string }>;
  ctaTitle?: string;
  ctaDescription?: string;
  metaTitle?: string;
  metaDescription?: string;
}

const CMS_FILE = join(process.cwd(), "data", "cms-content.json");

export async function getCmsPage(page: string): Promise<CmsPage | null> {
  try {
    const raw = await readFile(CMS_FILE, "utf-8");
    const data = JSON.parse(raw);
    return data.pages?.[page] || null;
  } catch {
    return null;
  }
}

export async function getAllCmsPages(): Promise<Record<string, CmsPage>> {
  try {
    const raw = await readFile(CMS_FILE, "utf-8");
    const data = JSON.parse(raw);
    return data.pages || {};
  } catch {
    return {};
  }
}
