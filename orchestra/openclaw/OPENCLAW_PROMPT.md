# OpenClaw UI Design Agent — Assignment Prompt

Paste this ENTIRE prompt into your OpenClaw UI agent conversation. Attach the Dribbble screenshots after pasting.

---

## PROMPT START

You are the **Lead UI Designer** for Hotels Vendors, a B2B Digital Procurement Hub for Egyptian hospitality.

### Your Task
1. Analyze the attached Dribbble screenshot references
2. Create a **complete visual design system** as static HTML/CSS mockups
3. Save all output to `/Users/Moataz/hotels-vendors/orchestra/openclaw/design-output/`
4. Kimi (the frontend developer) will view your mockups in browser and implement them in React + Tailwind

### Design References
- **Reference A (PRIMARY)**: "Leadmachine" Dribbble shot — this defines the MAIN platform theme (landing page, header, footer, buttons, cards, colors, typography)
- **Reference B (CATALOG)**: "B2B Ecommerce platform" Dribbble shot — this defines the marketplace/catalog browsing experience

### What to Build (Static HTML Mockups)

Create these files in `/Users/Moataz/hotels-vendors/orchestra/openclaw/design-output/`:

#### 1. `index.html` — Landing Page Mockup
Must include ALL these sections in one scrollable page:
- **White header/navbar** with black text, red-outlined horse logo (use inline SVG: stroke="#800000", fill="none"), nav links, "Get Started" button. Height: 64px. Shadow on scroll.
- **Hero section**: Big bold headline "The procurement platform built for Egyptian hospitality" with maroon accent word. Subheadline. Two CTA buttons (white filled + dark outlined). Stats row below (10K+ SKUs, 1,200+ Suppliers, 2.4B EGP GMV, 48h Delivery). Right side: abstract CSS visual with floating cards, orbiting rings, connection lines — NO photos.
- **Trust bar**: "Trusted by leading hotels" + hotel names (Marriott, Four Seasons, Hilton, etc.)
- **Categories section**: 6 cards with large icons + gradient tints. NO photos. Categories: Food & Beverage, Housekeeping, Linens & Textiles, Engineering, Room Amenities, IT & Technology.
- **Features section**: 6 cards — Unified Catalog, Shared Logistics, Embedded Factoring, ETA E-Invoicing, Authority Matrix, AI Intelligence.
- **How It Works**: 3 steps — Discover, Order, Fulfill. With step numbers and connector lines.
- **Metrics Banner**: 4 stats — 200+ Hotels, 6 Coastal Clusters, 48h Delivery, 40% Cost Reduction.
- **Pricing**: 3 tiers — Starter (free), Professional (EGP 4,500/mo), Enterprise (custom). Highlight Professional tier.
- **CTA Section**: "Ready to transform your procurement?" with two buttons.
- **Footer**: 4 columns — Brand, Product, Company, Legal.

**Background**: Solid black (`#000000` or very dark). Hero may have subtle radial glow behind it.

#### 2. `catalog.html` — Marketplace / Catalog Mockup
- **Same white header** as landing page
- **Page header**: "Procurement Catalog" + search bar + view toggle (grid/list icons)
- **Category pills**: Horizontal scrollable — F&B, Housekeeping, Linens, Engineering, Amenities, IT, Safety
- **Filter sidebar**: Price range, Rating, Supplier Tier, City, Stock Status
- **Product grid**: 6-8 product cards in a responsive grid. Each card must show:
  - CSS gradient placeholder for image area (NO photos)
  - Product name
  - Supplier name
  - Price in EGP
  - Star rating
  - Stock badge (In Stock / Low Stock)
  - "Add to Cart" button on hover
- **Floating compare bar** at bottom: "2 items selected · Compare"

#### 3. `design-system.html` — Design System Reference Page
A single page showing ALL design tokens so Kimi can copy values:
- **Color palette swatches** with hex codes (primary bg, secondary bg, text colors, accent, borders, success/warning/error)
- **Typography scale**: Show each size with actual text sample and specs (size, weight, line-height, letter-spacing)
- **Spacing scale**: Visual rectangles showing each spacing value
- **Border radius scale**: Sample boxes
- **Button variants**: Primary, Secondary, Ghost — all sizes
- **Card variants**: Default, Hover, Featured, With accent border
- **Input fields**: Default, Focus, With icon
- **Badges**: Default, Success, Warning, Error
- **Icons**: Show the Lucide icons used for each purpose

### Critical Design Rules

1. **NO STOCK PHOTOS / UNSPLASH anywhere.** Use CSS gradients, geometric shapes, icons, and patterns.
2. **Brand color is #800000 (maroon).** This MUST be the primary accent. If the Dribbble uses purple/blue/orange, ADAPT it to maroon.
3. **White header ONLY.** The rest of the page is dark/black.
4. **System fonts only.** Use `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.
5. **All values must be exact:** hex codes, pixel values, font sizes. No "medium" or "light gray" descriptions.
6. **Mobile responsive:** Show how it looks at 375px and 768px.
7. **Use inline CSS in `<style>` tags** — no external CSS files needed.
8. **Use Lucide icons via CDN**: `https://unpkg.com/lucide@latest`

### Technical Requirements for Mockups

```html
<!-- Every HTML file should include: -->
<script src="https://unpkg.com/lucide@latest"></script>
<script>lucide.createIcons();</script>

<!-- Font -->
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
</style>
```

### Output Location
Save ALL files to:
```
/Users/Moataz/hotels-vendors/orchestra/openclaw/design-output/
```

After you finish, tell Kimi the files are ready. He will open them in browser at:
```
file:///Users/Moataz/hotels-vendors/orchestra/openclaw/design-output/index.html
```

### IMPORTANT
- Do NOT use placeholder text like "Lorem ipsum". Use real Hotels Vendors content from the specs above.
- Do NOT use generic colors. Extract the EXACT palette from the Dribbble screenshots and adapt maroon (#800000) into it.
- Make it look PREMIUM. This is a B2B fintech platform, not a consumer app.

## PROMPT END

---

## After OpenClaw Finishes

1. OpenClaw will create the mockup HTML files
2. **You** open `file:///Users/Moataz/hotels-vendors/orchestra/openclaw/design-output/index.html` in your browser to review
3. Tell Kimi: "OpenClaw designs are ready"
4. Kimi will read the HTML/CSS, extract all tokens, and rewrite the React/Tailwind code

## What Kimi Needs From OpenClaw's Output

Kimi will extract from your mockups:
- Exact hex color values
- Exact font sizes and weights  
- Exact padding/margin/gap values
- Border radius values
- Shadow values
- Animation timing
- Layout grid specs
- Hover/active state details

The more precise your CSS, the faster Kimi can implement it perfectly.
