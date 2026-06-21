import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hotels-vendors.com";

  const routes = [
    "",
    "/about",
    "/solutions",
    "/pricing",
    "/marketplace",
    "/become-supplier",
    "/sandbox",
    "/compliance",
    "/social-media",
    "/login",
    "/register",
    "/blog",
  ];

  const blogSlugs = getAllSlugs();
  const blogRoutes = blogSlugs.map((slug) => `/blog/${slug}`);

  return [...routes, ...blogRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/marketplace" ? "daily" : route.startsWith("/blog") ? "weekly" : "weekly",
    priority: route === "" ? 1.0 : route === "/marketplace" ? 0.9 : route.startsWith("/blog") ? 0.6 : 0.7,
  }));
}
