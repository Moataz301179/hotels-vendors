# SEO B2B Skill
## Hotels Vendors — B2B Procurement Search Optimization

### Purpose
Reusable SEO patterns for all agents building public pages, content, or metadata.

### Non-Negotiable Rules
1. **Every public page MUST have:** metadata, Open Graph tags, structured data (JSON-LD), and canonical URL.
2. **Target long-tail B2B keywords:** "hotel procurement Egypt", "hospitality suppliers Egypt", "B2B hotel sourcing", "restaurant supplies Cairo", "hotel amenities wholesale".
3. **Semantic HTML with proper heading hierarchy.** Single H1 per page, logical H2/H3 flow, accessible landmark regions.
4. **Image optimization.** All images MUST be WebP/AVIF, lazy-loaded, with descriptive alt text.
5. **Core Web Vitals budgets:** LCP < 2.5s, INP < 200ms, CLS < 0.1.
6. **Dynamic sitemap and robots.txt.** Generated from catalog structure and content pages.
7. **Marketing pages live in `app/(marketing)/`.** NO landing-page UI inside dashboards.
8. **B2B buyer intent.** Content targets procurement managers, hotel GMs, and F&B directors — not consumers.

### Tech Stack
- Next.js metadata API
- `next-sitemap` for sitemap generation
- Schema.org structured data (Organization, Product, FAQPage, BreadcrumbList)
- `next/image` for optimization

### Structured Data Patterns
```typescript
// Organization JSON-LD
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Hotels Vendors",
  "url": "https://hotelsvendors.com",
  "logo": "https://hotelsvendors.com/logo.jpg",
  "sameAs": ["https://linkedin.com/company/hotels-vendors"],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+20-XXX-XXXX-XXX",
    "contactType": "sales",
    "areaServed": "EG"
  }
}

// Product JSON-LD for catalog pages
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Organic Olive Oil 5L",
  "image": "https://...",
  "description": "Premium organic olive oil for hotels",
  "brand": { "@type": "Brand", "name": "Supplier Name" },
  "offers": {
    "@type": "Offer",
    "price": "250.00",
    "priceCurrency": "EGP",
    "availability": "https://schema.org/InStock"
  }
}
```

### Files You Must Read Before Writing
- `app/page.tsx` (current landing page)
- `app/(marketing)/` (create if missing)
- `app/sitemap.ts` (create if missing)
- `app/robots.ts` (create if missing)
