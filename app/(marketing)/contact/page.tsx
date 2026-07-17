import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, MessageSquare, Building2, HelpCircle, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us — HotelsVendors",
  description: "Get in touch with HotelsVendors. Support, sales, and partnership inquiries.",
  openGraph: {
    title: "Contact HotelsVendors",
    description: "Get in touch with HotelsVendors. Support, sales, and partnership inquiries.",
    type: "website",
  },
};

const CONTACT_METHODS = [
  {
    icon: Mail,
    title: "Email Us",
    desc: "For general inquiries and support",
    value: "info@hotelsvendors.com",
    color: "#39ff7e",
  },
  {
    icon: Phone,
    title: "Call Us",
    desc: "Sunday–Thursday, 9AM–6PM Cairo time",
    value: "+20 XXX XXX XXXX",
    color: "#ff7e1a",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    desc: "Cairo, Egypt",
    value: "6th of October City, Giza",
    color: "#c455ff",
  },
  {
    icon: Clock,
    title: "Business Hours",
    desc: "We respond within 24 hours",
    value: "Sun–Thu: 9AM–6PM",
    color: "#64b5f6",
  },
];

const INQUIRY_TYPES = [
  { value: "general", label: "General Inquiry", icon: HelpCircle },
  { value: "support", label: "Technical Support", icon: MessageSquare },
  { value: "marketing", label: "Sales & Partnerships", icon: Building2 },
];

export default function ContactPage() {
  return (
    <main style={{ backgroundColor: "#0c0c12", color: "#ffffff", minHeight: "100vh" }}>
      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(57,255,126,0.06) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-6" style={{ borderColor: "#39ff7e22", backgroundColor: "#39ff7e08" }}>
            <MessageSquare size={12} style={{ color: "#39ff7e" }} />
            <span className="text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: "#39ff7e" }}>
              Get In Touch
            </span>
          </div>
          <h1 className="text-[clamp(30px,5vw,52px)] font-semibold leading-[1.05] tracking-tight mb-5">
            Let&apos;s Talk<br />
            <span style={{ color: "#39ff7e" }}>Hospitality Procurement</span>
          </h1>
          <p className="text-[15px] text-white/40 max-w-2xl mx-auto leading-relaxed">
            Whether you&apos;re a hotel looking to streamline procurement, a supplier seeking faster payments,
            or a partner exploring integration — we&apos;re here to help.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 border-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONTACT_METHODS.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.title} className="rounded-xl border border-white/[0.06] bg-[#12121a] p-5 hover:border-white/[0.10] transition-all">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${m.color}12`, border: `1px solid ${m.color}22` }}>
                    <Icon size={18} style={{ color: m.color }} />
                  </div>
                  <h3 className="text-[14px] font-semibold text-white mb-1">{m.title}</h3>
                  <p className="text-[12px] text-white/40 mb-2">{m.desc}</p>
                  <p className="text-[13px] font-medium" style={{ color: m.color }}>{m.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: "#39ff7e" }}>Send a Message</span>
            <h2 className="text-2xl md:text-3xl font-semibold text-white">How Can We Help?</h2>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-[#12121a] p-6 sm:p-8">
            <form id="contact-form" className="space-y-5">
              {/* Inquiry Type */}
              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-white/50">Inquiry Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {INQUIRY_TYPES.map((t) => {
                    const Icon = t.icon;
                    return (
                      <label key={t.value} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white/40 hover:text-white/60 hover:border-white/[0.10] transition-all cursor-pointer has-[:checked]:bg-[#39ff7e]/10 has-[:checked]:border-[#39ff7e]/30 has-[:checked]:text-[#39ff7e]">
                        <input type="radio" name="inquiryType" value={t.value} defaultChecked={t.value === "general"} className="sr-only" />
                        <Icon size={14} />
                        <span className="text-[12px] font-medium">{t.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[13px] font-medium text-white/50">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-[#39ff7e]/30 focus:outline-none focus:ring-1 focus:ring-[#39ff7e]/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[13px] font-medium text-white/50">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-[#39ff7e]/30 focus:outline-none focus:ring-1 focus:ring-[#39ff7e]/10 transition-all"
                  />
                </div>
              </div>

              {/* Company & Phone */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[13px] font-medium text-white/50">Company</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Your company name"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-[#39ff7e]/30 focus:outline-none focus:ring-1 focus:ring-[#39ff7e]/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[13px] font-medium text-white/50">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+20 XXX XXX XXXX"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-[#39ff7e]/30 focus:outline-none focus:ring-1 focus:ring-[#39ff7e]/10 transition-all"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-white/50">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder:text-white/15 focus:border-[#39ff7e]/30 focus:outline-none focus:ring-1 focus:ring-[#39ff7e]/10 transition-all resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#39ff7e] text-[#07090f] text-[13px] font-semibold hover:bg-[#39ff7e]/90 transition-all hover:shadow-[0_0_20px_rgba(57,255,126,0.15)]"
              >
                <Send size={14} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
