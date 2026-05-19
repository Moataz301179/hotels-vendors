"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  Building2,
  Package2,
  BadgeCheck,
  Shield,
  CreditCard,
  Sparkles,
  TrendingUp,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Hotel, EgyptianMarketData } from "./premium-types";

interface HeroMarketplaceProps {
  marketData: EgyptianMarketData;
  onSearch?: (query: string) => void;
}

// Trust badge icons
const TRUST_BADGES = [
  { name: "Visa", icon: "💳", color: "#1A1F71" },
  { name: "Mastercard", icon: "💳", color: "#EB001B" },
  { name: "Vodafone Cash", icon: "📱", color: "#E60000" },
  { name: "Etisalat Cash", icon: "💰", color: "#006C8A" },
];

export function HeroMarketplace({ marketData, onSearch }: HeroMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  // Limit hotel logos to display
  const displayHotels = marketData?.hotels?.slice(0, 8) || [];

  // Stats
  const stats = [
    { value: marketData?._meta?.total_suppliers || 14, label: "Verified Suppliers", icon: Building2 },
    { value: marketData?._meta?.total_products || 72, label: "Wholesale Products", icon: Package2 },
    { value: "100%", label: "EGP Pricing", icon: TrendingUp },
  ];

  return (
    <div className="relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full
          bg-indigo-600/20 blur-[120px] animate-pulse" />
        <div className="absolute top-40 -left-20 w-[400px] h-[400px] rounded-full
          bg-violet-600/10 blur-[100px] animate-pulse delay-1000" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),
          linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]
          bg-[size:60px_60px] opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Paymob Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-6"
        >
          <Badge className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 
            border border-emerald-500/30 text-emerald-400 px-4 py-1.5 text-sm">
            <Shield className="w-3.5 h-3.5 mr-2" />
            Implemented Paymob Egypt
          </Badge>
        </motion.div>

        {/* Main Hero Content */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Premium Hospitality
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 
              bg-clip-text text-transparent">
              Supplier Marketplace
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-8"
          >
            Sourced from verified Egyptian suppliers. Real wholesale prices in EGP for hotels,
            resorts, and restaurants across Egypt.
          </motion.p>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className={`
              relative flex items-center bg-zinc-900/80 backdrop-blur-xl
              border rounded-2xl transition-all duration-300
              ${isFocused 
                ? "border-indigo-500/50 shadow-xl shadow-indigo-500/20" 
                : "border-zinc-800 hover:border-zinc-700"
              }
            `}>
              <Search className="absolute left-5 text-zinc-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products, suppliers, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full pl-14 pr-5 py-5 bg-transparent border-0 text-white 
                  placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0
                  text-lg"
              />
              <button
                type="submit"
                className="absolute right-3 bg-indigo-600 hover:bg-indigo-500 
                  text-white px-6 py-2 rounded-xl font-medium transition-all
                  flex items-center gap-2"
              >
                Search
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.form>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto mb-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <stat.icon className="w-5 h-5 text-indigo-400" />
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                    {stat.label === "Verified Suppliers" && "+"}
                    {stat.label === "Wholesale Products" && "+"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-12"
          >
            <span className="text-zinc-500 text-sm">Trusted by</span>
            {TRUST_BADGES.map((badge, i) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                  bg-zinc-900/50 border border-zinc-800 text-zinc-400 text-sm"
              >
                <CreditCard className="w-4 h-4" style={{ color: badge.color }} />
                <span className="hidden sm:inline">{badge.name}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Hotel Logos Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="border-t border-zinc-800/50 pt-8"
          >
            <p className="text-zinc-500 text-sm mb-6 flex items-center justify-center gap-2">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              Trusted by leading Egyptian hotels & resorts
            </p>
            
            {/* Hotel Logos Grid */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
              {displayHotels.map((hotel: Hotel, index) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  className="group relative"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 p-3 bg-zinc-900/50 
                    border border-zinc-800 rounded-xl flex items-center justify-center
                    group-hover:border-zinc-700 group-hover:bg-zinc-900 transition-all">
                    <Image
                      src={hotel.logo_url}
                      alt={hotel.name}
                      width={60}
                      height={40}
                      className="object-contain max-w-full max-h-full grayscale 
                        opacity-60 group-hover:grayscale-0 group-hover:opacity-100 
                        transition-all duration-300"
                      unoptimized
                    />
                  </div>
                  {/* Tooltip */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 
                    opacity-0 group-hover:opacity-100 transition-opacity
                    pointer-events-none whitespace-nowrap">
                    <div className="bg-zinc-800 text-white text-xs px-2 py-1 
                      rounded-md -mb-1">
                      {hotel.chain}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Location Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 flex items-center justify-center gap-2 text-zinc-600 text-sm"
          >
            <MapPin className="w-4 h-4" />
            <span>Serving Cairo, Giza, Alexandria, Hurghada, Sharm El-Sheikh & more</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
