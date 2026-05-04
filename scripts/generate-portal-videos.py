#!/usr/bin/env python3
"""
Portal Guide Video Generator
Generates 45-second illustrative videos for each user portal.
Uses Pillow for frames + ffmpeg for encoding.
Text overlays with animated transitions. No voiceover (uses on-screen text storytelling).
"""

import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

os.makedirs("public/videos/portals", exist_ok=True)

WIDTH, HEIGHT = 1280, 720
FPS = 24
DURATION_PER_SCENE = 5.0  # 5 seconds per scene
SCENES_PER_VIDEO = 9      # 9 scenes = 45 seconds

# Portal configurations
PORTALS = {
    "hotel": {
        "title": "Hotel Buyer Portal",
        "subtitle": "From Catalog to Delivery in Minutes",
        "color": "#DC143C",
        "scenes": [
            ("Welcome", "Your Procurement Command Center", "Browse 10,000+ verified SKUs across F&B, housekeeping, and engineering."),
            ("Step 1: Browse", "Explore the Catalog", "Filter by category, price, supplier tier, and delivery zone."),
            ("Step 2: Build PO", "Add Items to Your Cart", "Set quantities, delivery dates, and preferred suppliers."),
            ("Step 3: Submit", "Route for Approval", "Your Authority Matrix automatically routes the PO to the right approver."),
            ("Step 4: Track", "Real-Time Order Tracking", "See status updates from confirmation to in-transit to delivered."),
            ("ETA Compliance", "Auto E-Invoicing", "Every invoice is digitally signed and submitted to the Egyptian Tax Authority."),
            ("AI Intelligence", "Smart Recommendations", "Get reorder alerts, price benchmarks, and supplier scorecards."),
            ("Approval Queue", "Never Miss an Approval", "View pending POs, approve with one click, and audit every decision."),
            ("Get Started", "Hotels Vendors", "Join 200+ Egyptian hotels already procuring smarter. hotelsvendors.com"),
        ],
    },
    "supplier": {
        "title": "Supplier Central",
        "subtitle": "Sell to Egypt's Hotel Chains",
        "color": "#DC143C",
        "scenes": [
            ("Welcome", "Your Supplier Dashboard", "Manage inventory, track orders, and grow your hotel client base."),
            ("Step 1: List", "Upload Your Products", "Add SKUs, pricing, stock levels, and certifications in minutes."),
            ("Step 2: Receive", "Incoming Purchase Orders", "View and confirm POs from 450+ active hotel buyers."),
            ("Step 3: Fulfill", "Manage Deliveries", "Update delivery status and share tracking with buyers in real time."),
            ("Step 4: Get Paid", "Embedded Factoring", "Choose instant payment — get paid in 24-48 hours, not 90 days."),
            ("Performance", "Analytics & Insights", "Track top customers, reorder rates, and revenue trends."),
            ("Certifications", "Build Trust", "Showcase HACCP, ISO, and audit results to win more hotel buyers."),
            ("Shared Logistics", "Reduce Delivery Costs", "Join coastal-cluster shared routes and cut logistics spend by 40%."),
            ("Get Started", "Hotels Vendors", "List your first product today. Zero commission for 90 days. hotelsvendors.com"),
        ],
    },
    "admin": {
        "title": "Platform Control",
        "subtitle": "Oversee the Entire Ecosystem",
        "color": "#DC143C",
        "scenes": [
            ("Welcome", "Admin Command Center", "Monitor tenants, track fees, and ensure compliance across the platform."),
            ("Tenants", "Tenant Health Monitor", "View active tenants, user counts, and last activity at a glance."),
            ("Fees", "Revenue Tracking", "Track platform fees, factoring spreads, and logistics markups in real time."),
            ("Audit Log", "Immutable Records", "Every approval, override, and cross-tenant access attempt is logged."),
            ("Security", "Fortress Protocol", "Block anomalies, enforce RBAC, and elevate critical alerts automatically."),
            ("Swarm", "Agent Operations", "Monitor AI agent health, job queues, and acquisition pipelines."),
            ("Risk", "Risk Heatmap", "Visualize credit exposure, supplier risk tiers, and hotel default probability."),
            ("Compliance", "ETA Bridge Status", "Ensure 100% e-invoice submission success with dead-letter queue monitoring."),
            ("Get Started", "Hotels Vendors", "The infrastructure layer for Egyptian hospitality procurement. hotelsvendors.com"),
        ],
    },
}


def get_font(size, bold=False):
    paths = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/HelveticaNeue.ttc",
        "/Library/Fonts/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for p in paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except:
                continue
    return ImageFont.load_default()


def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


def ease(t):
    return 1 - (1 - min(1, t)) ** 3


def create_frame(scene_data, frame_idx, total_frames, accent_rgb):
    img = Image.new("RGB", (WIDTH, HEIGHT), (0, 0, 0))
    draw = ImageDraw.Draw(img)
    progress = frame_idx / total_frames
    t = ease(progress)

    # Gradient background with accent tint
    for y in range(HEIGHT):
        ratio = y / HEIGHT
        r = int(5 + accent_rgb[0] * 0.03 * (1 - ratio))
        g = int(5 + accent_rgb[1] * 0.03 * (1 - ratio))
        b = int(5 + accent_rgb[2] * 0.03 * (1 - ratio))
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))

    # Accent glow top-right
    for r in range(400, 0, -15):
        alpha = int(8 * (r / 400))
        draw.ellipse([WIDTH - 400 - r, -r, WIDTH - 400 + r, r], fill=(accent_rgb[0], accent_rgb[1], accent_rgb[2], alpha))

    title, headline, body = scene_data
    font_title = get_font(14, bold=True)
    font_headline = get_font(42, bold=True)
    font_body = get_font(20)

    # Title badge
    title_width = draw.textlength(title.upper(), font=font_title) + 32
    badge_x = (WIDTH - title_width) / 2
    badge_y = 180 - int(20 * (1 - t))
    draw.rounded_rectangle([badge_x, badge_y, badge_x + title_width, badge_y + 36], radius=18, fill=(accent_rgb[0], accent_rgb[1], accent_rgb[2], 30), outline=(accent_rgb[0], accent_rgb[1], accent_rgb[2]), width=1)
    draw.text((WIDTH / 2, badge_y + 18), title.upper(), font=font_title, fill=(200, 200, 200), anchor="mm")

    # Headline
    headline_y = 280 - int(30 * (1 - t))
    draw.text((WIDTH / 2, headline_y), headline, font=font_headline, fill=(255, 255, 255), anchor="mm")

    # Body
    body_y = 380 + int(20 * (1 - t))
    # Wrap text roughly
    words = body.split()
    lines = []
    line = []
    for word in words:
        test = " ".join(line + [word])
        if draw.textlength(test, font=font_body) < WIDTH * 0.7:
            line.append(word)
        else:
            lines.append(" ".join(line))
            line = [word]
    if line:
        lines.append(" ".join(line))

    for i, line_text in enumerate(lines):
        draw.text((WIDTH / 2, body_y + i * 34), line_text, font=font_body, fill=(160, 160, 160), anchor="mm")

    # Progress bar
    bar_width = WIDTH * 0.5
    bar_x = (WIDTH - bar_width) / 2
    bar_y = HEIGHT - 60
    draw.rounded_rectangle([bar_x, bar_y, bar_x + bar_width, bar_y + 4], radius=2, fill=(40, 40, 40))
    draw.rounded_rectangle([bar_x, bar_y, bar_x + bar_width * progress, bar_y + 4], radius=2, fill=(accent_rgb[0], accent_rgb[1], accent_rgb[2]))

    return img


def generate_video(portal_id, config):
    accent_rgb = hex_to_rgb(config["color"])
    total_frames = int(SCENES_PER_VIDEO * DURATION_PER_SCENE * FPS)
    frames_per_scene = int(DURATION_PER_SCENE * FPS)

    frame_dir = f"/tmp/hv_video_{portal_id}"
    os.makedirs(frame_dir, exist_ok=True)

    print(f"[{portal_id}] Generating {total_frames} frames...")
    for f in range(total_frames):
        scene_idx = min(f // frames_per_scene, len(config["scenes"]) - 1)
        scene_data = config["scenes"][scene_idx]
        scene_frame = f % frames_per_scene
        img = create_frame(scene_data, scene_frame, frames_per_scene, accent_rgb)
        img.save(f"{frame_dir}/frame_{f:05d}.png")

    output_path = f"public/videos/portals/{portal_id}-guide.mp4"
    cmd = [
        "ffmpeg", "-y",
        "-framerate", str(FPS),
        "-i", f"{frame_dir}/frame_%05d.png",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-crf", "23",
        "-movflags", "+faststart",
        output_path,
    ]
    print(f"[{portal_id}] Encoding video...")
    subprocess.run(cmd, check=True, capture_output=True)

    # Cleanup frames
    for f in os.listdir(frame_dir):
        os.remove(os.path.join(frame_dir, f))
    os.rmdir(frame_dir)

    print(f"[{portal_id}] Done: {output_path}")


if __name__ == "__main__":
    for portal_id, config in PORTALS.items():
        generate_video(portal_id, config)
    print("\nAll portal guide videos generated in public/videos/portals/")
