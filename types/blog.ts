export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: string;
  authorImage?: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  views: number;
}

export interface BlogCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  postCount: number;
}
