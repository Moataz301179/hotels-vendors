"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* 3D Category Carousel — Bold Typography edition.
   Three stacked rotating rings (like the owner's reference): category banners
   rotating on Y-axis, product cards on the middle ring. Auto-rotates, pauses
   on hover, arrow controls. Uses real category images with graceful fallback
   to pattern tiles when images are missing. */

const RINGS = [
  {
    id: "top",
    kind: "category" as const,
    tiles: [
      { label: "F&B", img: "/categories/fb.jpg", href: "/marketplace?category=fb" },
      { label: "Restaurant Equipment", img: "/categories/ffe.jpg", href: "/marketplace?category=ffe" },
      { label: "Linens & Textiles", img: "/categories/lin.jpg", href: "/marketplace?category=lin" },
    ],
  },
  {
    id: "middle",
    kind: "product" as const,
    tiles: [
      { label: "Amenities Set", sub: "Guest Room Amenities", price: "EGP 350", img: "/categories/gra.jpg", href: "/marketplace?category=gra" },
      { label: "Plush Bathrobes", sub: "Linens & Textiles", price: "EGP 780", img: "/categories/lin.jpg", href: "/marketplace?category=lin" },
      { label: "Premium Slips", sub: "Guest Amenities", price: "EGP 220", img: "/categories/gra.jpg", href: "/marketplace?category=gra" },
    ],
  },
  {
    id: "bottom",
    kind: "category" as const,
    tiles: [
      { label: "Chef Uniforms", img: "/categories/hk.jpg", href: "/marketplace?category=hk" },
      { label: "Linens & Uniforms", img: "/categories/lin.jpg", href: "/marketplace?category=lin" },
      { label: "Housekeeping", img: "/categories/hk.jpg", href: "/marketplace?category=hk" },
    ],
  },
];

function Ring({
  tiles,
  rotation,
  radius,
  height,
  wide,
}: {
  tiles: { label: string; sub?: string; price?: string; img: string; href: string }[];
  rotation: number;
  radius: number;
  height: number;
  wide: number;
}) {
  const step = 360 / tiles.length;
  return (
    <div className="hv-ring" style={{ height }}>
      <div
        className="hv-ring-inner"
        style={{ transform: `translateZ(-${radius}px) rotateY(${rotation}deg)` }}
      >
        {tiles.map((t, i) => (
          <Link
            key={t.label + i}
            href={t.href}
            className="hv-tile"
            style={{
              transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
              width: wide,
              height,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.img} alt={t.label} loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div className="hv-tile-fallback" aria-hidden />
            <div className="hv-tile-shade" />
            <div className="hv-tile-text">
              {t.sub && <span className="hv-tile-sub">{t.sub}</span>}
              <span className="hv-tile-label">{t.label}</span>
              {t.price && <span className="hv-tile-price">{t.price}</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function CategoryCarousel3D() {
  const [rot, setRot] = useState(0);
  const [paused, setPaused] = useState(false);
  const raf = useRef<number | null>(null);
  const last = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const tick = (t: number) => {
      if (last.current !== null) {
        const dt = (t - last.current) / 1000;
        setRot((v) => (v + dt * 12) % 360); // 12 deg/s — slow, premium
      }
      last.current = t;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); last.current = null; };
  }, [paused]);

  const nudge = (dir: number) => setRot((v) => v + dir * 40);

  return (
    <section
      className="border-t border-[#262626] bg-[#0A0A0A] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Marketplace categories"
    >
      <style>{`
        .hv3d { perspective: 1400px; max-width: 1200px; margin: 0 auto; padding: 72px 24px 88px; }
        .hv3d-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 40px; flex-wrap: wrap; }
        .hv3d-stage { display: flex; flex-direction: column; align-items: center; gap: 26px; }
        .hv-ring { perspective: 1100px; width: 100%; display: flex; justify-content: center; }
        .hv-ring-inner { position: relative; transform-style: preserve-3d; width: 340px; height: 100%; }
        .hv-tile { position: absolute; left: 50%; top: 0; margin-left: -170px; display: block;
          border: 1px solid #262626; background: #0F0F0F; overflow: hidden; backface-visibility: hidden; }
        .hv-tile img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; }
        .hv-tile-fallback { position: absolute; inset: 0; z-index: 0;
          background-image: linear-gradient(to right, rgba(255,255,255,.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,.04) 1px, transparent 1px); background-size: 22px 22px; }
        .hv-tile-shade { position: absolute; inset: 0; z-index: 2;
          background: linear-gradient(to top, rgba(10,10,10,.88) 0%, rgba(10,10,10,.15) 55%, transparent 100%); }
        .hv-tile-text { position: absolute; left: 0; right: 0; bottom: 0; z-index: 3; padding: 14px 16px;
          display: flex; flex-direction: column; gap: 3px; }
        .hv-tile-sub { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: .16em;
          text-transform: uppercase; color: #A3A3A3; }
        .hv-tile-label { font-size: 16px; font-weight: 600; letter-spacing: -.01em; color: #FAFAFA; }
        .hv-tile-price { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #FF3D00; margin-top: 2px; }
        .hv3d-ctrls { display: flex; gap: 10px; margin-top: 34px; justify-content: center; }
        .hv3d-arrow { width: 44px; height: 44px; border: 1px solid #FAFAFA; background: transparent;
          color: #FAFAFA; font-size: 18px; cursor: pointer; transition: all .15s cubic-bezier(.25,0,0,1); }
        .hv3d-arrow:hover { background: #FAFAFA; color: #0A0A0A; }
        .hv3d-cta { text-align: center; margin-top: 40px; }
        @media (prefers-reduced-motion: reduce) { .hv-ring-inner { transition: none !important; } }
        @media (max-width: 768px) { .hv3d { padding: 56px 16px 64px; } .hv-ring-inner { width: 260px; } .hv-tile { margin-left: -130px; } }
      `}</style>

      <div className="hv3d">
        <div className="hv3d-head">
          <h2 className="text-[32px] md:text-[44px] font-semibold tracking-[-0.04em] leading-[1.05] text-[#FAFAFA]">
            The marketplace,<br />in rotation.
          </h2>
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#737373]">
            Ten categories · Fixed prices
          </span>
        </div>

        <div className="hv3d-stage">
          <Ring tiles={RINGS[0].tiles} rotation={rot} radius={260} height={150} wide={330} />
          <Ring tiles={RINGS[1].tiles} rotation={-rot * 1.15} radius={300} height={190} wide={360} />
          <Ring tiles={RINGS[2].tiles} rotation={rot * 0.85 + 40} radius={260} height={150} wide={330} />
        </div>

        <div className="hv3d-ctrls">
          <button className="hv3d-arrow" onClick={() => nudge(1)} aria-label="Rotate left">←</button>
          <button className="hv3d-arrow" onClick={() => nudge(-1)} aria-label="Rotate right">→</button>
        </div>

        <div className="hv3d-cta">
          <Link
            href="/marketplace"
            className="relative inline-flex items-center text-[#FF3D00] font-semibold uppercase tracking-[0.1em] text-[13px] group"
          >
            Open the marketplace
            <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#FF3D00] origin-left transition-transform duration-150 group-hover:scale-x-110" />
          </Link>
        </div>
      </div>
    </section>
  );
}
