import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR_CANDIDATES = [
  path.join(process.cwd(), "content", "blog"),
  path.join(process.cwd(), "..", "content", "blog"),
  path.join(process.cwd(), "..", "..", "content", "blog"),
  path.join(process.cwd(), "..", "..", "..", "content", "blog"),
  path.join(__dirname, "..", "..", "content", "blog"),
  path.join(__dirname, "..", "..", "..", "content", "blog"),
  path.join(__dirname, "..", "..", "..", "..", "content", "blog"),
  path.join(__dirname, "..", "..", "..", "..", "..", "content", "blog"),
  "/var/task/content/blog",
];

function getBlogDir(): string {
  for (const dir of BLOG_DIR_CANDIDATES) {
    if (fs.existsSync(dir)) return dir;
  }
  console.error("[blog] Could not find content/blog directory. cwd=", process.cwd(), "dirname=", __dirname);
  return BLOG_DIR_CANDIDATES[0];
}

export interface BlogPost {
  slug: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  date: string;
  author: string;
  category: string;
  categoryAr: string;
  tags: string[];
  readTime: number;
  featured: boolean;
  content: string;
}

function getReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function getAllPosts(): BlogPost[] {
  const dir = getBlogDir();
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title || "",
        titleAr: data.titleAr || "",
        description: data.description || "",
        descriptionAr: data.descriptionAr || "",
        date: data.date || new Date().toISOString(),
        author: data.author || "HotelsVendors Team",
        category: data.category || "Platform",
        categoryAr: data.categoryAr || "المنصة",
        tags: data.tags || [],
        readTime: getReadTime(content),
        featured: data.featured || false,
        content,
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const dir = getBlogDir();
  const filePath = path.join(dir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title || "",
    titleAr: data.titleAr || "",
    description: data.description || "",
    descriptionAr: data.descriptionAr || "",
    date: data.date || new Date().toISOString(),
    author: data.author || "HotelsVendors Team",
    category: data.category || "Platform",
    categoryAr: data.categoryAr || "المنصة",
    tags: data.tags || [],
    readTime: getReadTime(content),
    featured: data.featured || false,
    content,
  };
}

export function getAllSlugs(): string[] {
  const dir = getBlogDir();
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts().filter((p) => p.featured);
}

export function getAllCategories(): string[] {
  const cats = new Set(getAllPosts().map((p) => p.category));
  return Array.from(cats);
}
