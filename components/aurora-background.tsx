"use client";

import { useEffect, useRef } from "react";

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const blobs = [
      { x: w * 0.2, y: h * 0.3, r: 400, dx: 0.3, dy: 0.2, color: "rgba(185, 28, 28, 0.15)" },
      { x: w * 0.7, y: h * 0.5, r: 500, dx: -0.2, dy: 0.3, color: "rgba(220, 38, 38, 0.12)" },
      { x: w * 0.5, y: h * 0.7, r: 350, dx: 0.15, dy: -0.25, color: "rgba(201, 162, 39, 0.08)" },
      { x: w * 0.8, y: h * 0.2, r: 300, dx: -0.3, dy: 0.15, color: "rgba(185, 28, 28, 0.1)" },
    ];

    let frame = 0;
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, w, h);

      // Base dark gradient
      const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w);
      bg.addColorStop(0, "rgba(8, 9, 12, 0.3)");
      bg.addColorStop(1, "rgba(8, 9, 12, 0.95)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Draw floating blobs
      for (const b of blobs) {
        b.x += b.dx;
        b.y += b.dy;
        if (b.x < -b.r) b.x = w + b.r;
        if (b.x > w + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = h + b.r;
        if (b.y > h + b.r) b.y = -b.r;

        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grad.addColorStop(0, b.color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Subtle noise grain
      if (frame % 3 === 0) {
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 16) {
          const noise = (Math.random() - 0.5) * 4;
          data[i] = Math.min(255, Math.max(0, data[i] + noise));
          data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
          data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
        }
        ctx.putImageData(imageData, 0, 0);
      }

      requestAnimationFrame(animate);
    };

    const raf = requestAnimationFrame(animate);

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
