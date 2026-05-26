"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ShoppingCart, Users, HelpCircle, MessageCircle } from "lucide-react";

interface AIWelcomeGreetingProps {
  userName?: string;
  userRole?: string;
}

export function AIWelcomeGreeting({ userName = "there", userRole = "hotel" }: AIWelcomeGreetingProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted) setIsOpen(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [hasInteracted]);

  const roleGreetings: Record<string, { title: string; message: string; actions: { label: string; icon: string; href: string }[] }> = {
    hotel: {
      title: "Welcome aboard!",
      message: `Hi ${userName}, I'm your AI procurement assistant. Ready to streamline your hotel's purchasing? I can help you set up your first purchase order, explore verified suppliers, or optimize your spend patterns.`,
      actions: [
        { label: "Create PO", icon: "cart", href: "/hotel/orders" },
        { label: "Browse Suppliers", icon: "users", href: "/hotel/suppliers" },
        { label: "Get Help", icon: "help", href: "/help" },
      ],
    },
    supplier: {
      title: "Welcome to the network!",
      message: `Hi ${userName}, I'm your AI supply assistant. Let's get your products in front of Egypt's top hotels. I can help you list inventory, manage orders, or track your performance.`,
      actions: [
        { label: "Add Products", icon: "cart", href: "/supplier/products" },
        { label: "View Orders", icon: "users", href: "/supplier/orders" },
        { label: "Get Help", icon: "help", href: "/help" },
      ],
    },
    admin: {
      title: "Command center ready",
      message: `Welcome back, ${userName}. The platform is running smoothly. Need to review analytics, manage users, or check system health?`,
      actions: [
        { label: "Dashboard", icon: "cart", href: "/admin" },
        { label: "Users", icon: "users", href: "/admin/users" },
        { label: "Get Help", icon: "help", href: "/help" },
      ],
    },
    finance: {
      title: "Finance portal active",
      message: `Hi ${userName}, I'm your AI finance assistant. I can help you review invoices, process factoring requests, or analyze cashflow patterns.`,
      actions: [
        { label: "Invoices", icon: "cart", href: "/finance/invoices" },
        { label: "Factoring", icon: "users", href: "/finance/factoring" },
        { label: "Get Help", icon: "help", href: "/help" },
      ],
    },
    procurement: {
      title: "Procurement hub ready",
      message: `Welcome, ${userName}. I'm your AI procurement strategist. Let's optimize your sourcing, manage approvals, or review contracts.`,
      actions: [
        { label: "Requests", icon: "cart", href: "/procurement/requests" },
        { label: "Approvals", icon: "users", href: "/procurement/approvals" },
        { label: "Get Help", icon: "help", href: "/help" },
      ],
    },
  };

  const greeting = roleGreetings[userRole] || roleGreetings.hotel;

  const iconMap: Record<string, React.ReactNode> = {
    cart: <ShoppingCart className="w-3.5 h-3.5" />,
    users: <Users className="w-3.5 h-3.5" />,
    help: <HelpCircle className="w-3.5 h-3.5" />,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)]"
        >
          <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
              <div className="w-9 h-9 rounded-full bg-[#a3e635]/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#a3e635]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white">{greeting.title}</h4>
                <p className="text-[10px] text-white/40">AI Procurement Assistant</p>
              </div>
              <button
                onClick={() => { setIsOpen(false); setHasInteracted(true); }}
                className="w-7 h-7 rounded-full bg-white/[0.04] flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.08] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Message */}
            <div className="px-5 py-4">
              <p className="text-sm text-white/70 leading-relaxed">{greeting.message}</p>
            </div>

            {/* Actions */}
            <div className="px-5 pb-5 flex gap-2">
              {greeting.actions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  onClick={() => setHasInteracted(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/60 hover:text-white hover:bg-[#a3e635]/10 hover:border-[#a3e635]/30 transition-all"
                >
                  {iconMap[action.icon]}
                  <span>{action.label}</span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Floating trigger button when greeting is closed */
export function AIWelcomeTrigger({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#a3e635] hover:bg-[#bef264] flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-colors"
      onClick={onClick}
    >
      <MessageCircle className="w-5 h-5 text-white" />
    </motion.button>
  );
}
