import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Semantic color system using CSS variables
        // These map to the CSS custom properties in globals.css
        background: "var(--bg-canvas)",
        surface: "var(--bg-surface-1)",
        "surface-raised": "var(--bg-surface-2)",
        "surface-hover": "var(--bg-surface-3)",
        foreground: "var(--foreground)",
        "foreground-secondary": "var(--foreground-secondary)",
        "foreground-tertiary": "var(--foreground-tertiary)",
        "foreground-muted": "var(--foreground-muted)",

        // Primary accent (HotelsVendors orange)
        accent: {
          base: "var(--accent-base)",
          light: "var(--accent-light)",
          dark: "var(--accent-dark)",
          muted: "var(--accent-muted)",
          glow: "var(--accent-glow)",
          400: "var(--accent-400)",
          500: "var(--accent-500)",
          600: "var(--accent-600)",
          700: "var(--accent-700)",
        },

        // Secondary accent (INVO/Factoring orange)
        orange: {
          base: "var(--orange-base)",
          light: "var(--orange-light)",
          dark: "var(--orange-dark)",
          muted: "var(--orange-muted)",
          glow: "var(--orange-glow)",
        },

        // Tertiary accent (AI/Compliance purple)
        purple: {
          base: "var(--purple-base)",
          light: "var(--purple-light)",
          dark: "var(--purple-dark)",
          muted: "var(--purple-muted)",
          glow: "var(--purple-glow)",
        },

        // Info (Shipping/Logistics blue)
        info: {
          base: "var(--info)",
          rgb: "var(--info-rgb)",
          bg: "var(--info-bg)",
        },

        // Semantic states
        success: {
          base: "var(--success)",
          rgb: "var(--success-rgb)",
          bg: "var(--success-bg)",
        },
        warning: {
          base: "var(--warning)",
          rgb: "var(--warning-rgb)",
          bg: "var(--warning-bg)",
        },
        error: {
          base: "var(--error)",
          rgb: "var(--error-rgb)",
          bg: "var(--error-bg)",
        },

        // Borders
        border: {
          invisible: "var(--border-invisible)",
          subtle: "var(--border-subtle)",
          visible: "var(--border-visible)",
          accent: "var(--border-accent)",
          DEFAULT: "var(--border-default)",
          strong: "var(--border-strong)",
        },

        // Glassmorphism
        glass: {
          bg: "var(--glass-bg)",
          border: "var(--glass-border)",
        },

        // Role-based semantic colors
        role: {
          hotel: "var(--role-hotel)",
          factoring: "var(--role-factoring)",
          shipping: "var(--role-shipping)",
          admin: "var(--role-admin)",
        },

        // Hero overlays
        hero: {
          "overlay-rgb": "var(--hero-overlay-rgb)",
          "text-rgb": "var(--hero-text-rgb)",
        },
      },

      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        arabic: ["var(--font-arabic)", "var(--font-sans)"],
      },

      fontSize: {
        xs: "var(--font-size-xs)",
        sm: "var(--font-size-sm)",
        base: "var(--font-size-base)",
        md: "var(--font-size-md)",
        lg: "var(--font-size-lg)",
        xl: "var(--font-size-xl)",
        "2xl": "var(--font-size-2xl)",
        "3xl": "var(--font-size-3xl)",
        "4xl": "var(--font-size-4xl)",
      },

      spacing: {
        // Density-aware spacing scale
        "0": "calc(var(--density-scale) * 0rem)",
        "1": "calc(var(--density-scale) * 0.25rem)",
        "2": "calc(var(--density-scale) * 0.5rem)",
        "3": "calc(var(--density-scale) * 0.75rem)",
        "4": "calc(var(--density-scale) * 1rem)",
        "5": "calc(var(--density-scale) * 1.25rem)",
        "6": "calc(var(--density-scale) * 1.5rem)",
        "8": "calc(var(--density-scale) * 2rem)",
        "10": "calc(var(--density-scale) * 2.5rem)",
        "12": "calc(var(--density-scale) * 3rem)",
        "16": "calc(var(--density-scale) * 4rem)",
        "20": "calc(var(--density-scale) * 5rem)",
        "24": "calc(var(--density-scale) * 6rem)",
      },

      borderRadius: {
        DEFAULT: "calc(var(--density-scale) * 0.5rem)",
        sm: "calc(var(--density-scale) * 0.25rem)",
        md: "calc(var(--density-scale) * 0.375rem)",
        lg: "calc(var(--density-scale) * 0.5rem)",
        xl: "calc(var(--density-scale) * 0.75rem)",
        "2xl": "calc(var(--density-scale) * 1rem)",
        full: "9999px",
      },

      boxShadow: {
        elevated: "var(--shadow-elevated)",
        "glow-green": "var(--shadow-glow-green)",
        "glow-orange": "var(--shadow-glow-orange)",
        "glow-purple": "var(--shadow-glow-purple)",
        "inner-light": "var(--shadow-inner-light)",
      },

      transitionTimingFunction: {
        "ease-out-expo": "var(--ease-out-expo)",
      },

      screens: {
        xs: "420px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },

      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "slide-in-right": "slide-in-right 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "scale-in": "scale-in 0.4s ease-out forwards",
        bounce: "bounce 2s infinite",
        pulse: "pulse 2s infinite",
        shimmer: "shimmer 1.5s infinite",
        marquee: "marquee 30s linear infinite",
      },

      keyframes: {
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.98)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "0%": { "background-position": "-200% 0" },
          "100%": { "background-position": "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;