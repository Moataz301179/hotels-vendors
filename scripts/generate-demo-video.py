#!/usr/bin/env python3
"""Fast demo video generator — optimized for speed"""

import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

os.makedirs("public/videos", exist_ok=True)

WIDTH, HEIGHT = 1280, 720
FPS = 15
DURATION = 2.0
SCENES = [
    ("Hotels Vendors", "Digital Procurement Hub", "AI-Powered  •  ETA-Compliant  •  Egypt First", ""),
    ("The Problem", "15+ Hours Wasted Weekly", "WhatsApp orders  •  Excel tracking  •  Late delivery", "Procurement Pain"),
    ("Our Solution", "One Platform. Zero Friction.", "Hotels  •  Suppliers  •  Logistics  •  Factoring", "Four-Sided Marketplace"),
    ("Verified Suppliers", "68+ KYC-Checked Partners", "HACCP  •  ISO  •  On-site audits  •  Real-time", "Quality Assured"),
    ("AI-Powered", "Save 20-30% on Costs", "Smart deals  •  Auto POs  •  Authority matrix", "Intelligent Buying"),
    ("ETA Compliant", "Digital Signing Built-In", "Zero penalties  •  Auto UUID  •  Real-time status", "Tax Authority Ready"),
    ("Embedded Factoring", "Get Paid in 24-48 Hours", "Non-recourse  •  Zero risk  •  Instant liquidity", "Cash Flow Solved"),
    ("Join Hotels Vendors", "Transform Procurement Today", "Free 14-day trial  •  No credit card required", "hotelsvendors.com"),
]

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

def ease(t):
    return 1 - (1 - min(1, t)) ** 3

def create_frame(scene, f, total_f):
    img = Image.new("RGB", (WIDTH, HEIGHT), (0, 0, 0))
    draw = ImageDraw.Draw(img)
    progress = f / total_f
    t = ease(progress)

    # Subtle red glow top-right
    for r in range(300, 0, -10):
        alpha = int(6 * (r / 300))
        draw.ellipse([WIDTH-400-r, -150-r, WIDTH-400+r, -150+r], fill=(220, 38, 38, alpha))

    title_font = get_font(16)
    sub_font = get_font(36, bold=True)
    desc_font = get_font(18)
    badge_font = get_font(17, bold=True)

    # Title
    y_off = int(40 * (1 - t))
    title, subtitle, desc, badge = scene
    bbox = draw.textbbox((0, 0), title.upper(), font=title_font)
    tx = (WIDTH - (bbox[2] - bbox[0])) // 2
    alpha = int(255 * ease(progress * 2))
    draw.text((tx, 50 + y_off), title.upper(), font=title_font, fill=(220, 38, 38, alpha))

    # Underline
    lw = int((bbox[2] - bbox[0]) * ease(progress * 2))
    lx = (WIDTH - lw) // 2
    draw.rectangle([lx, 75 + y_off, lx + lw, 77 + y_off], fill=(220, 38, 38, alpha))

    # Subtitle
    y_off2 = int(30 * (1 - ease(max(0, progress - 0.1) * 2)))
    bbox = draw.textbbox((0, 0), subtitle, font=sub_font)
    sx = (WIDTH - (bbox[2] - bbox[0])) // 2
    alpha2 = int(255 * ease(max(0, progress - 0.1) * 2))
    draw.text((sx, 200 + y_off2), subtitle, font=sub_font, fill=(255, 255, 255, alpha2))

    # Description
    y_off3 = int(20 * (1 - ease(max(0, progress - 0.2) * 2)))
    bbox = draw.textbbox((0, 0), desc, font=desc_font)
    dx = (WIDTH - (bbox[2] - bbox[0])) // 2
    alpha3 = int(255 * ease(max(0, progress - 0.2) * 2))
    draw.text((dx, 290 + y_off3), desc, font=desc_font, fill=(140, 140, 140, alpha3))

    # Badge
    if badge:
        y_off4 = int(15 * (1 - ease(max(0, progress - 0.3) * 2)))
        bbox = draw.textbbox((0, 0), badge, font=badge_font)
        bw = bbox[2] - bbox[0] + 40
        bh = bbox[3] - bbox[1] + 20
        bx = (WIDTH - bw) // 2
        by = 400 + y_off4
        draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=12, fill=(220, 38, 38, 20), outline=(220, 38, 38, 60), width=2)
        draw.text((bx + 20, by + 10), badge, font=badge_font, fill=(239, 68, 68, int(255 * ease(max(0, progress - 0.3) * 2))))

    # Progress dots
    total = len(SCENES)
    start_x = WIDTH // 2 - (total * 12)
    for i in range(total):
        dx = start_x + i * 24
        dy = HEIGHT - 40
        if i == SCENES.index(scene):
            draw.ellipse([dx - 4, dy - 4, dx + 4, dy + 4], fill=(220, 38, 38, 200))
        else:
            draw.ellipse([dx - 3, dy - 3, dx + 3, dy + 3], fill=(50, 50, 50, 200))

    return img

def main():
    print("Generating frames...")
    total_frames = 0
    for si, scene in enumerate(SCENES):
        scene_frames = int(DURATION * FPS)
        for f in range(scene_frames):
            frame = create_frame(scene, f, scene_frames)
            frame.save(f"public/videos/frame_{total_frames:05d}.png")
            total_frames += 1
        print(f"  Scene {si+1}/{len(SCENES)} done")

    print(f"\nTotal frames: {total_frames}")
    print("Compiling video...")

    cmd = [
        "ffmpeg", "-y",
        "-framerate", str(FPS),
        "-i", "public/videos/frame_%05d.png",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-crf", "28",
        "-preset", "fast",
        "-movflags", "+faststart",
        "-an",
        "public/videos/demo-hero.mp4",
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print("ffmpeg error:", r.stderr[-300:])
        return

    # Poster
    cmd2 = ["ffmpeg", "-y", "-i", "public/videos/demo-hero.mp4", "-ss", "0.5", "-vframes", "1", "-q:v", "2", "public/videos/demo-hero-poster.jpg"]
    subprocess.run(cmd2, capture_output=True)

    # Cleanup frames
    for f in os.listdir("public/videos"):
        if f.startswith("frame_") and f.endswith(".png"):
            os.remove(f"public/videos/{f}")

    size = os.path.getsize("public/videos/demo-hero.mp4") / (1024 * 1024)
    print(f"\n✅ Video: public/videos/demo-hero.mp4 ({size:.1f} MB)")
    print(f"✅ Poster: public/videos/demo-hero-poster.jpg")
    print(f"   Duration: {len(SCENES) * DURATION:.0f}s | {WIDTH}x{HEIGHT} | {FPS}fps")

if __name__ == "__main__":
    os.chdir("/Users/Moataz/hotels-vendors")
    main()
