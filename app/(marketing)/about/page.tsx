"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Share2,
  Globe,
  Building2,
  Target,
  Eye,
  Heart,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingPage } from "@/components/layout/marketing-page";

const ACCENT = "var(--accent-base)";
const ACCENT_BORDER = "var(--border-accent, rgba(230,155,45,0.30))";
const TURQUOISE = "var(--turquoise-400, #2DD4BF)";
const GREEN = "var(--green-400, #4ADE80)";
const SURFACE = "var(--bg-surface-1, #2D1F14)";
const SURFACE_ALT = "var(--bg-surface-2, #3D2B1F)";
const TEXT = "var(--text-primary, #F5EDE3)";
const TEXT_MUTED = "var(--text-muted, #A6937E)";
const TEXT_SECONDARY = "var(--text-secondary, #D4C5B5)";
const BORDER = "var(--border-default, rgba(245,237,227,0.08))";
const SANS = "var(--font-sans)";

function Reveal({ children, className = "", delay = 0, x = 0 }: { children: React.ReactNode; className?: string; delay?: number; x?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: 32, x }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StatCard({
  value,
  label,
  accent,
  delay,
}: {
  value: string;
  label: string;
  accent: string;
  delay: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      style={{
        backgroundColor: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: "16px",
        padding: "28px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "clamp(28px,3.5vw,40px)",
          fontWeight: 600,
          fontFamily: SANS,
          color: accent,
          lineHeight: 1.1,
          marginBottom: 4,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "13px",
          fontFamily: SANS,
          color: TEXT_MUTED,
          fontWeight: 400,
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

function ValueCard({
  icon: Icon,
  title,
  desc,
  borderColor,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  borderColor: string;
  delay: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      style={{
        backgroundColor: SURFACE,
        border: `1px solid ${borderColor}40`,
        borderRadius: "16px",
        padding: "28px 24px",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
          backgroundColor: `${borderColor}15`,
          color: borderColor,
        }}
      >
        <Icon size={20} />
      </div>
      <h3
        style={{
          fontSize: "16px",
          fontWeight: 600,
          fontFamily: SANS,
          color: TEXT,
          marginBottom: 6,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "13px",
          fontFamily: SANS,
          color: TEXT_MUTED,
          lineHeight: 1.6,
        }}
      >
        {desc}
      </p>
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <MarketingPage>
      <MarketingNav />

      {/* ─── Hero ─────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          paddingTop: 140,
          paddingBottom: 80,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            translate: "-50% -50%",
            width: 700,
            height: 400,
            borderRadius: "50%",
            filter: "blur(150px)",
            pointerEvents: "none",
            background: `radial-gradient(circle, ${ACCENT}20 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <Reveal delay={0.1}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 500,
                fontFamily: SANS,
                color: ACCENT,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginBottom: 12,
                display: "block",
              }}
            >
              About
            </span>
          </Reveal>
          <Reveal delay={0.2}>
            <h1
              style={{
                fontSize: "clamp(32px,5vw,56px)",
                fontWeight: 600,
                fontFamily: SANS,
                color: TEXT,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                marginBottom: 16,
              }}
            >
              About{" "}
              <span style={{ color: ACCENT }}>HotelsVendors</span>
            </h1>
          </Reveal>
          <Reveal delay={0.3}>
            <p
              style={{
                fontSize: "16px",
                fontFamily: SANS,
                color: TEXT_MUTED,
                maxWidth: 640,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Egypt&apos;s leading B2B hospitality procurement platform —
              connecting hotels with verified suppliers, automating
              procurement, and unlocking embedded supply-chain finance
              for the Egyptian hospitality industry.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                marginTop: 28,
              }}
            >
              <Link
                href="/register"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 28px",
                  fontSize: "13px",
                  fontWeight: 500,
                  fontFamily: SANS,
                  color: "#fff",
                  backgroundColor: ACCENT,
                  borderRadius: 12,
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                Join the Platform
                <Building2 size={15} />
              </Link>
              <Link
                href="/solutions"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 28px",
                  fontSize: "13px",
                  fontWeight: 500,
                  fontFamily: SANS,
                  color: TEXT_SECONDARY,
                  backgroundColor: "transparent",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 12,
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = SURFACE; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                Explore Solutions
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Mission ────────────────────────────────────────── */}
      <section
        style={{
          padding: "80px 0",
          backgroundColor: SURFACE,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            <Reveal delay={0.1}>
              <div
                style={{
                  backgroundColor: SURFACE_ALT,
                  border: `1px solid ${ACCENT_BORDER}`,
                  borderRadius: 20,
                  padding: "40px 32px",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                    backgroundColor: `${ACCENT}15`,
                    color: ACCENT,
                  }}
                >
                  <Target size={22} />
                </div>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    fontFamily: SANS,
                    color: TEXT,
                    marginBottom: 10,
                  }}
                >
                  Our Mission
                </h2>
                <p
                  style={{
                    fontSize: "13px",
                    fontFamily: SANS,
                    color: TEXT_MUTED,
                    lineHeight: 1.7,
                  }}
                >
                  Digitize hotel procurement end-to-end, connect suppliers
                  to a unified marketplace with real-time inventory, and
                  enable factoring liquidity so hotels extend payment
                  cycles while suppliers get paid in days — not months.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div
                style={{
                  backgroundColor: SURFACE_ALT,
                  border: `1px solid ${TURQUOISE}30`,
                  borderRadius: 20,
                  padding: "40px 32px",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                    backgroundColor: `${TURQUOISE}15`,
                    color: TURQUOISE,
                  }}
                >
                  <Eye size={22} />
                </div>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    fontFamily: SANS,
                    color: TEXT,
                    marginBottom: 10,
                  }}
                >
                  Our Vision
                </h2>
                <p
                  style={{
                    fontSize: "13px",
                    fontFamily: SANS,
                    color: TEXT_MUTED,
                    lineHeight: 1.7,
                  }}
                >
                  Become the operating system for Egyptian hospitality
                  procurement — where every order, invoice, payment, and
                  delivery across Egypt&apos;s coastal resorts runs through
                  a single transparent platform.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div
                style={{
                  backgroundColor: SURFACE_ALT,
                  border: `1px solid ${GREEN}30`,
                  borderRadius: 20,
                  padding: "40px 32px",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                    backgroundColor: `${GREEN}15`,
                    color: GREEN,
                  }}
                >
                  <TrendingUp size={22} />
                </div>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    fontFamily: SANS,
                    color: TEXT,
                    marginBottom: 10,
                  }}
                >
                  Our Impact
                </h2>
                <p
                  style={{
                    fontSize: "13px",
                    fontFamily: SANS,
                    color: TEXT_MUTED,
                    lineHeight: 1.7,
                  }}
                >
                  EGP 12M+ in monthly GMV processed, 500+ hotels served,
                  and 680+ verified suppliers across Sharm El-Sheikh,
                  Hurghada, Cairo, and the North Coast — growing month
                  over month.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Key Numbers ────────────────────────────────────── */}
      <section
        style={{
          padding: "80px 0",
          position: "relative",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            translate: "-50% 0",
            width: 600,
            height: 300,
            borderRadius: "50%",
            filter: "blur(120px)",
            pointerEvents: "none",
            background: `radial-gradient(circle, ${TURQUOISE}10 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <Reveal delay={0.1}>
            <h2
              style={{
                fontSize: "clamp(22px,3vw,32px)",
                fontWeight: 600,
                fontFamily: SANS,
                color: TEXT,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              By the Numbers
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p
              style={{
                fontSize: "13px",
                fontFamily: SANS,
                color: TEXT_MUTED,
                textAlign: "center",
                maxWidth: 500,
                margin: "0 auto 40px",
                lineHeight: 1.6,
              }}
            >
              The platform trusted by Egypt&apos;s leading hotel chains and
              hospitality suppliers
            </p>
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            <StatCard
              value="680+"
              label="Verified Suppliers"
              accent={ACCENT}
              delay={0.2}
            />
            <StatCard
              value="500+"
              label="Hotels Served"
              accent={TURQUOISE}
              delay={0.3}
            />
            <StatCard
              value="EGP 12M+"
              label="Monthly GMV"
              accent={GREEN}
              delay={0.4}
            />
            <StatCard
              value="98%"
              label="On-Time Delivery"
              accent={ACCENT}
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* ─── Team Story ─────────────────────────────────────── */}
      <section
        style={{
          padding: "80px 0",
          backgroundColor: SURFACE,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: 40,
              alignItems: "center",
            }}
          >
            <Reveal delay={0.1} x={-20}>
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    fontFamily: SANS,
                    color: ACCENT,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    marginBottom: 12,
                    display: "block",
                  }}
                >
                  Our Story
                </span>
                <h2
                  style={{
                    fontSize: "clamp(24px,3vw,36px)",
                    fontWeight: 600,
                    fontFamily: SANS,
                    color: TEXT,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    marginBottom: 16,
                  }}
                >
                  Born from a simple<br />
                  observation: procurement<br />
                  in Egyptian hospitality<br />
                  was <span style={{ color: ACCENT }}>fragmented</span>.
                </h2>
                <p
                  style={{
                    fontSize: "13px",
                    fontFamily: SANS,
                    color: TEXT_MUTED,
                    lineHeight: 1.7,
                    marginBottom: 12,
                  }}
                >
                  Founded in 2023, HotelsVendors emerged from years spent inside
                  Egypt&apos;s financial infrastructure — auditing enterprises,
                  mapping supply chains, and watching the disconnect between
                  the country&apos;s rapidly evolving fintech rails and the
                  manual, paper-driven procurement processes of coastal hotels.
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    fontFamily: SANS,
                    color: TEXT_MUTED,
                    lineHeight: 1.7,
                  }}
                >
                  We built HotelsVendors as the orchestration layer: an
                  AI-powered platform that sits on top of Egypt&apos;s ETA
                  e-invoicing framework, licensed factoring institutions,
                  and digital payment infrastructure — connecting hotels,
                  suppliers, funders, and logistics into one seamless
                  procurement loop.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2} x={20}>
              <div
                style={{
                  backgroundColor: SURFACE_ALT,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 20,
                  padding: "40px 32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      backgroundColor: `${ACCENT}15`,
                      color: ACCENT,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      fontWeight: 600,
                      fontFamily: SANS,
                      flexShrink: 0,
                    }}
                  >
                    M
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        fontFamily: SANS,
                        color: TEXT,
                      }}
                    >
                      Moataz
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        fontFamily: SANS,
                        color: TEXT_MUTED,
                      }}
                    >
                      Founder & CEO
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    fontFamily: SANS,
                    color: TEXT_MUTED,
                    lineHeight: 1.7,
                    fontStyle: "italic",
                    borderLeft: `2px solid ${ACCENT}`,
                    paddingLeft: 16,
                    margin: 0,
                  }}
                >
                  &ldquo;Egypt has world-class fintech infrastructure.
                  Hotels and suppliers just needed someone to connect
                  the dots. We built the bridge.&rdquo;
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    paddingTop: 8,
                    borderTop: `1px solid ${BORDER}`,
                  }}
                >
                  {[
                    { label: "EY", role: "Audit" },
                    { label: "Deloitte", role: "Advisory" },
                    { label: "KPMG", role: "Risk" },
                  ].map((exp) => (
                    <div
                      key={exp.label}
                      style={{
                        padding: "4px 12px",
                        borderRadius: 8,
                        fontSize: "11px",
                        fontFamily: SANS,
                        color: TEXT_SECONDARY,
                        backgroundColor: `${ACCENT}10`,
                        border: `1px solid ${ACCENT}20`,
                      }}
                    >
                      {exp.label} · {exp.role}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Values ─────────────────────────────────────────── */}
      <section
        style={{
          padding: "80px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <Reveal delay={0.1}>
            <h2
              style={{
                fontSize: "clamp(22px,3vw,32px)",
                fontWeight: 600,
                fontFamily: SANS,
                color: TEXT,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              What Drives Us
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p
              style={{
                fontSize: "13px",
                fontFamily: SANS,
                color: TEXT_MUTED,
                textAlign: "center",
                maxWidth: 500,
                margin: "0 auto 40px",
                lineHeight: 1.6,
              }}
            >
              Four principles that guide every decision we make
            </p>
          </Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
            }}
          >
            <ValueCard
              icon={Eye}
              title="Transparency"
              desc="Every order, invoice, and payment is traceable end-to-end. No black boxes, no hidden fees — just clear visibility into your procurement lifecycle."
              borderColor={ACCENT}
              delay={0.2}
            />
            <ValueCard
              icon={TrendingUp}
              title="Efficiency"
              desc="AI-powered demand forecasting, automated purchase orders, and shared-route logistics that cut procurement time by 60% and reduce delivery costs."
              borderColor={TURQUOISE}
              delay={0.3}
            />
            <ValueCard
              icon={Heart}
              title="Compliance"
              desc="Built on Egypt's ETA e-invoicing framework with cryptographic audit trails, FRA anti-fraud measures, and full regulatory adherence from day one."
              borderColor={GREEN}
              delay={0.4}
            />
            <ValueCard
              icon={Target}
              title="Innovation"
              desc="We don't just digitize old processes — we reimagine them. Embedded factoring, AI agents, and real-time analytics that no other procurement platform offers."
              borderColor={ACCENT}
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────── */}
      <section
        style={{
          padding: "80px 0",
          backgroundColor: SURFACE,
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <Reveal delay={0.1}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                backgroundColor: `${ACCENT}15`,
                color: ACCENT,
              }}
            >
              <Heart size={24} />
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <h2
              style={{
                fontSize: "clamp(22px,3vw,32px)",
                fontWeight: 600,
                fontFamily: SANS,
                color: TEXT,
                marginBottom: 12,
              }}
            >
              Ready to transform your<br />
              hospitality procurement?
            </h2>
          </Reveal>
          <Reveal delay={0.25}>
            <p
              style={{
                fontSize: "14px",
                fontFamily: SANS,
                color: TEXT_MUTED,
                maxWidth: 480,
                margin: "0 auto 32px",
                lineHeight: 1.6,
              }}
            >
              Whether you&apos;re a hotel chain looking to digitize
              procurement or a supplier seeking verified buyers,
              HotelsVendors is your platform.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/register"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 32px",
                  fontSize: "14px",
                  fontWeight: 500,
                  fontFamily: SANS,
                  color: "#fff",
                  backgroundColor: ACCENT,
                  borderRadius: 12,
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                Join HotelsVendors
                <Building2 size={16} />
              </Link>
              <Link
                href="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 32px",
                  fontSize: "14px",
                  fontWeight: 500,
                  fontFamily: SANS,
                  color: TEXT_SECONDARY,
                  backgroundColor: "transparent",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 12,
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = SURFACE_ALT; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                Contact Us
              </Link>
            </div>
          </Reveal>

          {/* Social / Share */}
          <Reveal delay={0.35}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 16,
                marginTop: 40,
                paddingTop: 28,
                borderTop: `1px solid ${BORDER}`,
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontFamily: SANS,
                  color: TEXT_MUTED,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Follow us
              </span>
              <a
                href="https://twitter.com/hotelsvendors"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: TEXT_MUTED,
                  backgroundColor: SURFACE_ALT,
                  border: `1px solid ${BORDER}`,
                  transition: "all 0.2s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = ACCENT;
                  e.currentTarget.style.borderColor = ACCENT_BORDER;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = TEXT_MUTED;
                  e.currentTarget.style.borderColor = BORDER;
                }}
              >
                <Globe size={15} />
              </a>
              <a
                href="https://facebook.com/hotelsvendors"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: TEXT_MUTED,
                  backgroundColor: SURFACE_ALT,
                  border: `1px solid ${BORDER}`,
                  transition: "all 0.2s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = ACCENT;
                  e.currentTarget.style.borderColor = ACCENT_BORDER;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = TEXT_MUTED;
                  e.currentTarget.style.borderColor = BORDER;
                }}
              >
                <Share2 size={15} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <MarketingFooter />
    </MarketingPage>
  );
}
