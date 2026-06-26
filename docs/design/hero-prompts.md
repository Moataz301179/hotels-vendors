# Hero & Illustration Prompts

Prompts for generating hero images, section illustrations, and background textures using Midjourney v6, v0, or equivalent image-generation models.

All prompts are tuned for the Hotels Vendors brand palette:
- **Primary:** `#FF6B00` ( HV orange)
- **Background:** `#14110E` (noir) / `#0A1612` (driver emerald)
- **Accent:** `#D4A843` (gold) / `#A3E635` (lime)
- **Typography:** Jakarta Sans (headings), Playfair Display (display)

---

## 1. Coastal Supply Chain Hero

**Use:** Homepage hero — panoramic Egyptian Red Sea resort at golden hour with supply chain overlay.

> `A cinematic aerial photograph of a luxury Red Sea resort coastline in Egypt at golden hour, infinity pool merging into turquoise water, aerial view of delivery trucks on a coastal road, warm orange and gold tones, subtle holographic supply chain network overlay connecting hotel to suppliers, photorealistic, 16:9, ultra-wide, --ar 16:9 --v 6.0 --style raw`

**Negative prompt:** `text, watermark, people, cars with logos, cartoon, illustration`

---

## 2. Hotel Procurement Abstract

**Use:** "How It Works" section — abstract 3D geometric representing three-way matching.

> `Abstract 3D render of three interlocking translucent cubes glowing orange and gold, floating over a dark noir background (#14110E), each cube contains a minimalist icon (document, checkmark, truck), soft volumetric lighting, clean corporate aesthetic, octane render style, 8K, --ar 16:9 --v 6.0 --no text watermark`

---

## 3. ETA E-Invoicing Compliance

**Use:** ETA compliance page hero — digital document with cryptographic seal.

> `Close-up of a glowing digital invoice document on a dark interface, holographic Egyptian Tax Authority seal floating above, UUID hash string rendered as light particles, cryptographic verification visualized as connected nodes, emerald and orange accent lighting, UI/UX 3D render style, --ar 16:9 --v 6.0`

---

## 4. Reverse Factoring Flow

**Use:** Factoring service page — money flow visualization.

> `Abstract visualization of capital flow: a hotel icon on the left, a supplier IBAN account on the right, animated dashed arrows connecting them through a central "factoring pool" represented by a glowing orange sphere, dark background, financial data visualization style, clean minimal, --ar 16:9 --v 6.0 --no text`

---

## 5. Shark-Breaker Coastal Logistics

**Use:** Logistics / Shark-Breaker hub page — consolidated coastal delivery.

> `Aerial photograph of a coastal logistics hub in Hurghada, Egypt at dawn, small delivery boats converging on a central warehouse, Red Sea in background, warm orange and emerald color grade, cinematic drone shot, photorealistic, --ar 16:9 --v 6.0 --style raw`

---

## 6. Supplier Marketplace Grid

**Use:** Catalog page hero — B2B marketplace product grid.

> `Isometric 3D illustration of a B2B marketplace, floating product cards arranged in a grid (food crates, linen bundles, pool chemicals, furniture), each card casting soft shadows, dark noir background with orange accent lighting, clean corporate illustration style, --ar 16:9 --v 6.0`

---

## 7. Driver PWA Mobile Hero

**Use:** Driver PWA install screen / driver dashboard hero.

> `Photograph of a delivery driver holding a smartphone showing a logistics dashboard, warehouse background with stacked goods, warm natural lighting, orange hi-viz vest matching HV brand color, authentic documentary style, --ar 9:16 --v 6.0 --style raw`

---

## 8. Smart Settlement / AI Worker

**Use:** Smart Fix A / settlement automation page — AI worker concept.

> `Abstract representation of an AI settlement worker: a translucent robotic hand processing glowing invoice documents, data streams flowing from left to right, dark interface background with orange and lime accent particles, tech-forward but approachable, 3D render, --ar 16:9 --v 6.0`

---

## 9. Seasonal Campaign — Low Season

**Use:** May-September low season promotional banner.

> `A serene empty Egyptian resort pool area at midday, sun loungers with "HV" branded towels, heat haze effect, warm golden tones, copy space in upper third, cinematic lifestyle photography, --ar 21:9 --v 6.0 --style raw --no people text`

---

## 10. Onboarding / Registration Hero

**Use:** Registration landing — welcome to the platform.

> `Wide shot of a grand hotel lobby in Cairo, warm ambient lighting, a welcome desk with a subtle orange glow, abstract geometric patterns on the floor echoing HV brand shapes, luxurious but modern, architectural photography, --ar 16:9 --v 6.0 --style raw`

---

## Usage Notes

- **Midjourney v6.0** — use `--style raw` for photorealistic results, omit for more artistic interpretations
- **v0 (Vercel)** — append `?width=1200&height=630` to resize; prompts under 200 chars work best
- **Video generation (Runway, Pika)** — take a still from the prompt above, animate with subtle camera drift (2-3% zoom, slow pan)
- **Brand compliance** — all outputs should be color-graded to match `#FF6B00` primary and `#14110E` background
- **Localization** — Arabic versions should flip `--ar 16:9` composition right-to-left where applicable

---

## Prompt Anatomy

Each prompt follows this structure:
1. **Subject** — what's in the frame
2. **Setting** — where and when
3. **Style** — photographic / 3D / illustration
4. **Color** — brand-aligned palette
5. **Composition** — aspect ratio + focal point
6. **Negative** — what to exclude (text, logos, watermarks)
