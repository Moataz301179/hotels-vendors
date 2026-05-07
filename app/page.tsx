"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight, Menu, X, MessageCircle, XIcon, ChevronRight,
  Sparkles, Building2, Truck, Landmark, Package, MapPin,
  TrendingUp, Clock, ShieldCheck, Zap, Search, BarChart3,
  CheckCircle2,
} from "lucide-react";

/* ════════════════════════════════════════════
   ANIMATED MESH BACKGROUND (Canvas)
   Organic flowing gradient orbs
   ════════════════════════════════════════════ */

function AnimatedMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    const orbs = [
      { x: 0.3, y: 0.3, r: 0.4, hue: 20, speed: 0.0003, phase: 0 },
      { x: 0.7, y: 0.6, r: 0.35, hue: 25, speed: 0.0004, phase: 2 },
      { x: 0.5, y: 0.8, r: 0.3, hue: 15, speed: 0.00025, phase: 4 },
      { x: 0.2, y: 0.7, r: 0.25, hue: 30, speed: 0.00035, phase: 1 },
    ];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    let time = 0;
    const animate = () => {
      time += 1;
      ctx.fillStyle = "#030303";
      ctx.fillRect(0, 0, w, h);

      orbs.forEach((orb) => {
        const ox = w * (orb.x + Math.sin(time * orb.speed + orb.phase) * 0.15);
        const oy = h * (orb.y + Math.cos(time * orb.speed * 0.7 + orb.phase) * 0.1);
        const r = Math.min(w, h) * orb.r;

        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
        grad.addColorStop(0, `hsla(${orb.hue}, 100%, 55%, 0.08)`);
        grad.addColorStop(0.5, `hsla(${orb.hue}, 100%, 50%, 0.03)`);
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

      // Subtle noise texture
      ctx.fillStyle = "rgba(255,255,255,0.008)";
      for (let i = 0; i < 200; i++) {
        const nx = Math.random() * w;
        const ny = Math.random() * h;
        ctx.fillRect(nx, ny, 1, 1);
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

/* ════════════════════════════════════════════
   PARTICLE NETWORK (Canvas overlay for Hero)
   ════════════════════════════════════════════ */

function NetworkVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Create nodes
    const nodeCount = 40;
    const nodes: { x: number; y: number; vx: number; vy: number; r: number; color: string; type: string }[] = [];
    const colors = ["#FF5C00", "#10B981", "#0EA5E9", "#8B5CF6"];
    const types = ["hotel", "supplier", "logistics", "factoring"];

    for (let i = 0; i < nodeCount; i++) {
      const typeIdx = i % 4;
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: typeIdx === 0 ? 3 : 2,
        color: colors[typeIdx],
        type: types[typeIdx],
      });
    }

    let time = 0;
    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      // Update nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 20 || n.x > w - 20) n.vx *= -1;
        if (n.y < 20 || n.y > h - 20) n.vy *= -1;
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.15;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(255, 92, 0, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        const pulse = Math.sin(time * 2 + n.x) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();

        // Glow
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
        const rgb = n.color === "#FF5C00" ? "255,92,0" : n.color === "#10B981" ? "16,185,129" : n.color === "#0EA5E9" ? "14,165,233" : "139,92,246";
        glow.addColorStop(0, `rgba(${rgb},0.3)`);
        glow.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Animated data packets
      for (let i = 0; i < 5; i++) {
        const t = ((time * 0.3 + i * 0.2) % 1);
        const n1 = nodes[Math.floor(i * 7) % nodes.length];
        const n2 = nodes[Math.floor(i * 7 + 5) % nodes.length];
        const px = n1.x + (n2.x - n1.x) * t;
        const py = n1.y + (n2.y - n1.y) * t;
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />;
}

/* ════════════════════════════════════════════
   NAV
   ════════════════════════════════════════════ */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#030303]/90 backdrop-blur-xl border-b border-white/[0.06]" : ""}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo-horse-only.png" alt="" width={32} height={32} className="w-8 h-8 object-contain" />
            <span className="text-[15px] font-bold text-white tracking-tight">Hotels Vendors</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["Catalog", "Platform", "Pricing"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[13px] font-medium text-white/40 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-[13px] font-medium text-white/40 hover:text-white px-4 py-2">Sign In</Link>
            <Link href="/register" className="px-5 py-2.5 text-[12px] font-semibold bg-[#FF5C00] text-white hover:bg-[#cc4700] rounded-lg shadow-lg shadow-[#FF5C00]/20 transition-all">
              Get Started
            </Link>
          </div>

          <button className="md:hidden p-2 text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/[0.06] px-6 py-5 space-y-1">
          {["Catalog", "Platform", "Pricing"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="block py-2.5 text-[14px] text-white/60">{item}</a>
          ))}
          <div className="pt-3 flex gap-2">
            <Link href="/login" className="flex-1 text-center py-2.5 text-[13px] border border-white/10 rounded-lg">Sign In</Link>
            <Link href="/register" className="flex-1 text-center py-2.5 text-[13px] bg-[#FF5C00] rounded-lg font-semibold">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ════════════════════════════════════════════
   HERO — Full viewport, massive visual impact
   ════════════════════════════════════════════ */

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedMeshBackground />
      <NetworkVisualization />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#030303_70%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-20 h-20 mx-auto mb-10"
          >
            <Image src="/logo-horse-only.png" alt="Hotels Vendors" width={80} height={80} className="w-20 h-20 object-contain relative z-10" />
            <div className="absolute inset-0 bg-[#FF5C00]/25 blur-3xl rounded-full scale-150" />
          </motion.div>

          {/* Headline */}
          <h1 className="text-[48px] sm:text-[72px] lg:text-[96px] font-bold text-white leading-[0.95] tracking-[-0.04em]">
            The Network for<br />
            <span className="text-[#FF5C00]">Egyptian</span> Hospitality
          </h1>

          <p className="mt-8 text-[17px] sm:text-[20px] text-white/30 leading-relaxed max-w-xl mx-auto">
            Hotels, suppliers, logistics, and factoring — connected on one 
            compliant platform.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className="group px-8 py-4 text-[14px] font-semibold bg-[#FF5C00] text-white hover:bg-[#cc4700] rounded-xl flex items-center gap-2 shadow-xl shadow-[#FF5C00]/25 transition-all">
              Start Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/catalog" className="px-8 py-4 text-[14px] font-semibold border border-white/12 text-white hover:bg-white/[0.03] rounded-xl transition-all">
              Explore Catalog
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/10 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 bg-white/30 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}

/* ════════════════════════════════════════════
   PRODUCT MOCKUP — 3D perspective dashboard
   ════════════════════════════════════════════ */

function ProductMockup() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-semibold text-[#FF5C00] tracking-[0.2em] uppercase">Platform</span>
          <h2 className="mt-4 text-[36px] sm:text-[56px] font-bold text-white tracking-[-0.03em] leading-none">
            Your command center
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 20 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 8 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative perspective-[1500px]"
        >
          <div className="relative transform-gpu" style={{ transformStyle: "preserve-3d" }}>
            {/* Browser chrome */}
            <div className="rounded-t-xl border border-white/[0.08] border-b-0 bg-[#0c0c0c] px-4 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]/50" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]/50" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]/50" />
              </div>
              <div className="flex-1 mx-4">
                <div className="max-w-sm mx-auto h-7 bg-white/[0.04] rounded-md flex items-center px-3 gap-2">
                  <ShieldCheck className="w-3 h-3 text-white/15" />
                  <span className="text-[10px] text-white/15">app.hotelsvendors.com</span>
                </div>
              </div>
            </div>

            {/* Dashboard body */}
            <div className="rounded-b-xl border border-white/[0.08] border-t-0 bg-[#060606] p-6 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FF5C00]/10 flex items-center justify-center">
                    <Image src="/logo-horse-only.png" alt="" width={20} height={20} className="w-5 h-5 object-contain opacity-70" />
                  </div>
                  <div className="h-4 w-28 bg-white/[0.06] rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="h-9 w-9 rounded-lg bg-white/[0.03]" />
                  <div className="h-9 w-9 rounded-full bg-[#FF5C00]/15" />
                </div>
              </div>

              {/* Metric cards */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  { color: "#FF5C00", w1: 16, w2: 20 },
                  { color: "#f59e0b", w1: 14, w2: 12 },
                  { color: "#10B981", w1: 18, w2: 16 },
                  { color: "#0EA5E9", w1: 12, w2: 18 },
                ].map((m, i) => (
                  <div key={i} className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">
                    <div className="h-2.5 w-2.5 rounded-full mb-3" style={{ backgroundColor: `${m.color}40` }} />
                    <div className="h-3 w-20 bg-white/[0.06] rounded mb-2" />
                    <div className="h-6 w-24 bg-white/[0.1] rounded" />
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 rounded-xl border border-white/[0.04] bg-white/[0.015] p-5">
                  <div className="h-4 w-36 bg-white/[0.06] rounded mb-6" />
                  <div className="flex items-end gap-1 h-28">
                    {[35, 50, 42, 65, 58, 78, 72, 88, 82, 92, 87, 95].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm transition-all" style={{ height: `${h}%`, background: `linear-gradient(to top, rgba(255,92,0,0.25), rgba(255,92,0,0.05))` }} />
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-5">
                  <div className="h-4 w-28 bg-white/[0.06] rounded mb-5" />
                  {[80, 65, 50, 38, 25].map((w, i) => (
                    <div key={i} className="flex items-center gap-2 mb-3">
                      <div className="h-2.5 w-2.5 rounded-full bg-white/[0.06]" />
                      <div className="h-2 flex-1 bg-white/[0.03] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${w}%`, backgroundColor: "rgba(255,92,0,0.25)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reflection */}
            <div className="absolute -bottom-16 left-0 right-0 h-16 opacity-20" style={{ transform: "scaleY(-0.25)", transformOrigin: "top", filter: "blur(12px)" }}>
              <div className="w-full h-full bg-[#060606] rounded-b-xl" />
            </div>

            {/* Bottom glow */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-20 bg-[#FF5C00]/8 blur-3xl rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   FOUR ACTORS — Large visual cards
   ════════════════════════════════════════════ */

function FourActors() {
  const actors = [
    { icon: Building2, title: "Hotels", count: "200+", color: "#10B981", desc: "Procurement portal with AI catalog discovery and seasonal forecasting" },
    { icon: Package, title: "Suppliers", count: "1,200+", color: "#FF5C00", desc: "Inventory sync, RFQ management, and embedded factoring for cash flow" },
    { icon: Truck, title: "Logistics", count: "40+", color: "#0EA5E9", desc: "Shared-route fulfillment with real-time tracking across coastal clusters" },
    { icon: Landmark, title: "Factoring", count: "12", color: "#8B5CF6", desc: "Non-recourse invoice financing. Paid in 48 hours, not 90 days" },
  ];

  return (
    <section id="platform" className="relative py-28 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FF5C00]/[0.02] rounded-full blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <span className="text-[11px] font-semibold text-[#FF5C00] tracking-[0.2em] uppercase">Marketplace</span>
          <h2 className="mt-4 text-[36px] sm:text-[56px] font-bold text-white tracking-[-0.03em] leading-none">
            Four sides.<br />One platform.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actors.map((actor, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0a] hover:border-white/[0.12] transition-all duration-500 p-8"
            >
              {/* Hover gradient */}
              <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ backgroundColor: `${actor.color}10` }} />

              <div className="relative">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${actor.color}12` }}>
                    <actor.icon className="w-7 h-7" style={{ color: actor.color }} />
                  </div>
                  <span className="text-[36px] font-bold" style={{ color: `${actor.color}40` }}>{actor.count}</span>
                </div>
                <h3 className="text-[24px] font-bold text-white mb-2">{actor.title}</h3>
                <p className="text-[14px] text-white/30 leading-relaxed max-w-sm">{actor.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   MAP + STATS SPLIT
   ════════════════════════════════════════════ */

function MapStats() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <span className="text-[11px] font-semibold text-[#FF5C00] tracking-[0.2em] uppercase">Coverage</span>
            <h2 className="mt-4 text-[36px] sm:text-[48px] font-bold text-white tracking-[-0.03em] leading-tight">
              From Cairo to<br />the Red Sea
            </h2>
            <p className="mt-5 text-[16px] text-white/30 leading-relaxed max-w-md">
              Shared logistics clusters across Egypt's key hospitality corridors. 
              48-hour delivery to any coastal property.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { value: "6", label: "Coastal Clusters", icon: MapPin },
                { value: "48h", label: "Avg. Delivery", icon: Clock },
                { value: "40%", label: "Cost Cut", icon: TrendingUp },
                { value: "100%", label: "ETA Ready", icon: ShieldCheck },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.05] bg-white/[0.015]">
                  <stat.icon className="w-5 h-5 text-[#FF5C00]/40" />
                  <div>
                    <p className="text-[22px] font-bold text-white">{stat.value}</p>
                    <p className="text-[11px] text-white/20">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            {/* Stylized Egypt map SVG */}
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                {/* Egypt silhouette */}
                <path
                  d="M32 6 L34 4 L37 6 L40 10 L42 14 L44 18 L47 22 L50 26 L52 30 L54 36 L57 44 L60 52 L62 60 L65 68 L68 76 L70 82 L72 86 L74 90 L76 92 L78 94 L76 96 L73 95 L70 93 L66 90 L62 86 L58 80 L54 74 L50 68 L46 62 L42 56 L38 50 L35 44 L32 38 L30 32 L28 26 L26 20 L28 14 L30 8 Z"
                  fill="rgba(255,92,0,0.03)"
                  stroke="rgba(255,92,0,0.12)"
                  strokeWidth="0.3"
                />
                {/* Nile */}
                <path
                  d="M42 14 Q44 24 42 34 Q40 44 44 54 Q48 64 52 74 Q56 82 60 88"
                  stroke="rgba(14,165,233,0.15)"
                  strokeWidth="0.4"
                  fill="none"
                  strokeDasharray="1 2"
                />
                {/* Cluster dots with pulse animation */}
                {[
                  { x: 62, y: 58, name: "Hurghada" },
                  { x: 68, y: 75, name: "Sharm" },
                  { x: 58, y: 72, name: "Marsa Alam" },
                  { x: 22, y: 18, name: "Alexandria" },
                  { x: 40, y: 35, name: "Cairo" },
                ].map((c, i) => (
                  <g key={i}>
                    <circle cx={c.x} cy={c.y} r="1.2" fill="#FF5C00" opacity="0.8">
                      <animate attributeName="r" values="1.2;2;1.2" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0.3;0.8" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
                    </circle>
                    <circle cx={c.x} cy={c.y} r="3" fill="none" stroke="#FF5C00" strokeWidth="0.2" opacity="0.2">
                      <animate attributeName="r" values="2;5;2" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.3;0;0.3" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
                    </circle>
                  </g>
                ))}
                {/* Connection lines */}
                {[
                  { x1: 40, y1: 35, x2: 62, y2: 58 },
                  { x1: 40, y1: 35, x2: 68, y2: 75 },
                  { x1: 40, y1: 35, x2: 58, y2: 72 },
                  { x1: 40, y1: 35, x2: 22, y2: 18 },
                ].map((line, i) => (
                  <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="rgba(255,92,0,0.08)" strokeWidth="0.3" strokeDasharray="2 3">
                    <animate attributeName="stroke-opacity" values="0.05;0.15;0.05" dur={`${3 + i}s`} repeatCount="indefinite" />
                  </line>
                ))}
              </svg>
              {/* Labels */}
              <div className="absolute inset-0">
                {[
                  { x: 62, y: 52, name: "Hurghada" },
                  { x: 72, y: 72, name: "Sharm" },
                  { x: 52, y: 72, name: "Marsa Alam" },
                  { x: 16, y: 14, name: "Alexandria" },
                  { x: 46, y: 32, name: "Cairo" },
                ].map((c, i) => (
                  <span key={i} className="absolute text-[9px] font-medium text-white/30 whitespace-nowrap" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   PRICING
   ════════════════════════════════════════════ */

function Pricing() {
  const tiers = [
    { name: "Starter", price: "Free", period: "forever", desc: "Small hotels exploring digital procurement", features: ["Browse catalog", "Basic search", "Manual POs", "Email alerts", "3 users"], highlight: false },
    { name: "Professional", price: "4,500", period: "EGP/mo", desc: "Growing hotels ready to automate", features: ["Everything in Starter", "AI price comparison", "Auto PO generation", "Authority Matrix", "ETA e-invoicing", "15 users", "Priority support"], highlight: true },
    { name: "Enterprise", price: "Custom", period: "pricing", desc: "Hotel groups with 5+ properties", features: ["Everything in Pro", "Multi-property dashboard", "Opera/SAP integration", "Dedicated AM", "White-label", "Unlimited users", "SLA"], highlight: false },
  ];

  return (
    <section id="pricing" className="relative py-28 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#FF5C00]/[0.03] rounded-full blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-semibold text-[#FF5C00] tracking-[0.2em] uppercase">Pricing</span>
          <h2 className="mt-4 text-[36px] sm:text-[56px] font-bold text-white tracking-[-0.03em] leading-none">
            Scale as you grow
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`relative overflow-hidden rounded-2xl p-8 ${
                tier.highlight
                  ? "border border-[#FF5C00]/20 bg-[#FF5C00]/[0.02]"
                  : "border border-white/[0.06] bg-[#0a0a0a]"
              }`}
            >
              {tier.highlight && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF5C00]/40 to-transparent" />}
              {tier.highlight && <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#FF5C00] text-white rounded-full mb-6">Most Popular</span>}

              <h3 className="text-[12px] font-semibold text-white/30 uppercase tracking-wider">{tier.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-[32px] font-bold text-white">{tier.price}</span>
                <span className="text-[12px] text-white/25">{tier.period}</span>
              </div>
              <p className="mt-2 text-[13px] text-white/25">{tier.desc}</p>

              <ul className="mt-6 space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-white/35">
                    <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${tier.highlight ? "text-[#FF5C00]" : "text-white/15"}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/register" className={`mt-8 block w-full text-center py-3 text-[13px] font-semibold rounded-xl transition-all ${
                tier.highlight
                  ? "bg-[#FF5C00] text-white hover:bg-[#cc4700] shadow-lg shadow-[#FF5C00]/20"
                  : "border border-white/10 text-white hover:bg-white/[0.03]"
              }`}>
                {tier.highlight ? "Start Trial" : tier.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   CTA
   ════════════════════════════════════════════ */

function FinalCTA() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0a0a0a] p-12 lg:p-20 text-center"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-[#FF5C00]/[0.06] rounded-full blur-[100px]" />

          <div className="relative">
            <div className="relative w-16 h-16 mx-auto mb-8">
              <Image src="/logo-horse-only.png" alt="" width={64} height={64} className="w-16 h-16 object-contain relative z-10" />
              <div className="absolute inset-0 bg-[#FF5C00]/15 blur-2xl rounded-full" />
            </div>

            <h2 className="text-[32px] sm:text-[48px] font-bold text-white tracking-[-0.03em] leading-tight">
              Join the network
            </h2>
            <p className="mt-4 text-[16px] text-white/30 max-w-sm mx-auto">
              Setup takes 10 minutes. No credit card required.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register" className="px-8 py-3.5 text-[14px] font-semibold bg-[#FF5C00] text-white hover:bg-[#cc4700] rounded-xl shadow-xl shadow-[#FF5C00]/20 transition-all">
                Get Started Free
              </Link>
              <Link href="/catalog" className="px-8 py-3.5 text-[14px] font-semibold border border-white/10 text-white hover:bg-white/[0.03] rounded-xl transition-all">
                Browse Catalog
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════════ */

function Footer() {
  return (
    <footer className="relative border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8">
          <div className="col-span-2 md:col-span-4">
            <div className="flex items-center gap-2.5 mb-3">
              <Image src="/logo-horse-only.png" alt="" width={24} height={24} className="w-6 h-6 object-contain" />
              <span className="text-[14px] font-bold text-white">Hotels Vendors</span>
            </div>
            <p className="text-[12px] text-white/20 leading-relaxed max-w-[260px]">
              The Digital Procurement Hub for Egyptian Hospitality.
            </p>
          </div>
          {[
            { title: "Product", links: ["Catalog", "Orders", "ETA", "Pricing"] },
            { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
            { title: "Legal", links: ["Privacy", "Terms", "Security"] },
          ].map((col, i) => (
            <div key={i} className="col-span-1 md:col-span-2">
              <h4 className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}><a href="#" className="text-[12px] text-white/20 hover:text-white/50 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-white/[0.03] flex items-center justify-between">
          <p className="text-[10px] text-white/10">© 2026 Hotels Vendors</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-white/15">Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════
   CHATBOT
   ════════════════════════════════════════════ */

function ChatbotWidget() {
  const [showOffer, setShowOffer] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowOffer(true), 10000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showOffer && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-3 border border-white/[0.08] bg-[#0a0a0a] p-4 max-w-[200px] relative rounded-xl shadow-2xl">
          <button onClick={() => setShowOffer(false)} className="absolute top-2 right-2 text-white/20 hover:text-white/60"><XIcon className="w-3 h-3" /></button>
          <p className="text-[11px] text-white/60 pr-4">Ready to transform procurement?</p>
          <Link href="/register" className="inline-block mt-2 px-3 py-1.5 text-[10px] font-semibold bg-[#FF5C00] text-white rounded-lg">Get Started</Link>
        </motion.div>
      )}
      <Link href="/register" className="w-12 h-12 bg-[#FF5C00] flex items-center justify-center hover:bg-[#cc4700] rounded-xl shadow-xl shadow-[#FF5C00]/20 transition-all">
        <MessageCircle className="w-5 h-5 text-white" />
      </Link>
    </div>
  );
}

/* ════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════ */

export default function LandingPage() {
  return (
    <main className="bg-[#030303] text-white min-h-screen">
      <Navbar />
      <Hero />
      <ProductMockup />
      <FourActors />
      <MapStats />
      <Pricing />
      <FinalCTA />
      <Footer />
      <ChatbotWidget />
    </main>
  );
}
