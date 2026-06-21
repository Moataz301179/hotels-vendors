import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

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
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
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
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
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
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
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
