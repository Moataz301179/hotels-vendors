import { MetadataRoute } from "next";

const ICONS = {
  icon: [
    { src: "/logo-icon.png", sizes: "192x192", type: "image/png" },
    { src: "/logo-icon.png", sizes: "512x512", type: "image/png" },
  ],
  apple: [{ src: "/logo-icon-white.png", sizes: "180x180", type: "image/png" }],
} as const;

const THEME = "#14110E";
const BACKGROUND = "#14110E";

const ROLE_VARIANTS = {
  driver: {
    shortName: "HV Driver",
    name: "Hotels Vendors — Driver",
    startUrl: "/driver",
  },
  hotel: {
    shortName: "HV Hotel",
    name: "Hotels Vendors — Hotel Procurement",
    startUrl: "/hotel",
  },
  supplier: {
    shortName: "HV Supplier",
    name: "Hotels Vendors — Supplier Hub",
    startUrl: "/supplier",
  },
  factoring: {
    shortName: "HV Factoring",
    name: "Hotels Vendors — Factoring",
    startUrl: "/factoring",
  },
  default: {
    shortName: "HotelsVendors",
    name: "Hotels Vendors — B2B Hospitality Procurement",
    startUrl: "/",
  },
} as const;

export type ManifestRole = keyof typeof ROLE_VARIANTS;

export function getManifest(role: ManifestRole = "default"): MetadataRoute.Manifest {
  const variant = ROLE_VARIANTS[role] ?? ROLE_VARIANTS.default;
  return {
    short_name: variant.shortName,
    name: variant.name,
    description:
      "Egypt's B2B procurement platform for hotels. Verified suppliers, streamlined logistics, and integrated ETA e-invoicing.",
    start_url: variant.startUrl,
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    theme_color: THEME,
    background_color: BACKGROUND,
    icons: [...ICONS.icon, ...ICONS.apple],
    categories: ["business", "productivity"],
  };
}
