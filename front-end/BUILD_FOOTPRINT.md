# HERMES BUILD FOOTPRINT
# ======================
# Built by: Hermes Agent (OWL)
# Date: May 30 2026
# Model: openrouter/owl-alpha
# 
# CHANGES MADE:
# 1. app/globals.css — Replaced v3 crimson/blue system with v4 lime+purple system
#    - Primary accent: #8cff2e (lime green — CTAs, labels, highlights)
#    - Secondary accent: #a855f7 (purple — feature icons, secondary buttons)
    - Background hierarchy: #050505 → #0d0d0d → #171717
#    - All legacy tokens remapped for backward compatibility
#
# 2. app/(marketing)/page.tsx — Complete rewrite
#    - Old: blue/crimson fintech presentation with modals
#    - New: Clario-inspired marketing page with Framer Motion
#    - fade+slide scroll reveals, staggerContainer animations
#    - 3D perspective tilt on hero card (rotateY: -8deg, rotateX: 4deg)
#    - Lime gradient divider lines between sections
#    - Bento grid layout for categories
#    - All content from kimi.page reference
#
# 3. Appended to globals.css:
#    - .font-mono class for labels
#
# BACKUPS:
# - Old page: app/(marketing)/page.tsx.old
#
# BUILD COMMAND: cd /var/www/hotelsvendors-v2 && npm run build
# DEPLOY: cd /var/www/hotelsvendors-v2/.next/standalone && node server.js &
