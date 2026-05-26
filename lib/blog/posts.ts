import { BlogPost, BlogCategory } from "@/types/blog";

// Demo posts for frontend rendering
export const demoPosts: BlogPost[] = [
  {
    id: "1",
    slug: "ai-procurement-egypt-2024",
    title: "How AI is Transforming Hotel Procurement in Egypt",
    excerpt: "Discover how artificial intelligence is revolutionizing the way Egyptian hotels manage their supply chains and reduce costs.",
    content: "Full article content here...",
    coverImage: "/hero-hotel-drone.jpg",
    category: "Technology",
    tags: ["AI", "Procurement", "Egypt"],
    author: "Moataz Abdelghani",
    authorImage: "/logo-icon.png",
    published: true,
    featured: true,
    createdAt: "2024-05-20T00:00:00Z",
    updatedAt: "2024-05-20T00:00:00Z",
    publishedAt: "2024-05-20T00:00:00Z",
    views: 1240,
  },
  {
    id: "2",
    slug: "eta-e-invoicing-guide",
    title: "The Complete Guide to ETA E-Invoicing Compliance",
    excerpt: "Everything Egyptian hotels need to know about the mandatory e-invoicing system and how to stay compliant.",
    content: "Full article content here...",
    coverImage: "/hero-cairo-skyline.jpg",
    category: "Compliance",
    tags: ["ETA", "E-Invoicing", "Tax"],
    author: "HotelsVendors Team",
    published: true,
    featured: false,
    createdAt: "2024-05-15T00:00:00Z",
    updatedAt: "2024-05-15T00:00:00Z",
    publishedAt: "2024-05-15T00:00:00Z",
    views: 890,
  },
  {
    id: "3",
    slug: "supplier-financing-oliv",
    title: "Embedded Financing: A Game Changer for Hotel Suppliers",
    excerpt: "How invoice factoring and embedded finance solutions are helping Egyptian suppliers improve cash flow.",
    content: "Full article content here...",
    coverImage: "/hero-luxury-pool.jpg",
    category: "Finance",
    tags: ["FinTech", "Factoring", "Cash Flow"],
    author: "Moataz Abdelghani",
    published: true,
    featured: true,
    createdAt: "2024-05-10T00:00:00Z",
    updatedAt: "2024-05-10T00:00:00Z",
    publishedAt: "2024-05-10T00:00:00Z",
    views: 2100,
  },
  {
    id: "4",
    slug: "red-sea-hospitality-trends",
    title: "Red Sea Hospitality Trends for 2024",
    excerpt: "Analysis of emerging trends in Egypt's Red Sea tourism corridor and what they mean for procurement.",
    content: "Full article content here...",
    coverImage: "/hero-redsea-resort.jpg",
    category: "Industry",
    tags: ["Red Sea", "Tourism", "Trends"],
    author: "HotelsVendors Team",
    published: true,
    featured: false,
    createdAt: "2024-05-05T00:00:00Z",
    updatedAt: "2024-05-05T00:00:00Z",
    publishedAt: "2024-05-05T00:00:00Z",
    views: 1560,
  },
];

export const demoCategories: BlogCategory[] = [
  { id: "1", slug: "technology", name: "Technology", description: "AI, automation, and digital transformation", postCount: 1 },
  { id: "2", slug: "compliance", name: "Compliance", description: "ETA, tax, and regulatory updates", postCount: 1 },
  { id: "3", slug: "finance", name: "Finance", description: "FinTech, factoring, and payment solutions", postCount: 1 },
  { id: "4", slug: "industry", name: "Industry", description: "Hospitality trends and market insights", postCount: 1 },
];

export function getAllPosts(): BlogPost[] {
  return demoPosts.filter(p => p.published).sort((a, b) => 
    new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
  );
}

export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts().filter(p => p.featured);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find(p => p.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter(p => p.category.toLowerCase() === category.toLowerCase());
}

export function getAllCategories(): BlogCategory[] {
  return demoCategories;
}
