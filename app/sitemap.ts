import type { MetadataRoute } from "next";

const BLOG_SLUGS = [
  "ai-procurement-forecasting-hotels",
  "eta-compliance-guide-for-hotels",
  "reverse-factoring-egypt-hospitality",
  "shared-route-logistics-red-sea-resorts",
  "supplier-onboarding-egypt-guide",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hotelsvendors.com";

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

  const blogRoutes = BLOG_SLUGS.map((slug) => `/blog/${slug}`);

  return [...routes, ...blogRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/marketplace" ? "daily" : route.startsWith("/blog") ? "weekly" : "weekly",
    priority: route === "" ? 1.0 : route === "/marketplace" ? 0.9 : route.startsWith("/blog") ? 0.6 : 0.7,
  }));
}
