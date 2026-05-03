/**
 * Supplier Source Registry
 * Defines scrapable directories, portals, and listings for Egyptian suppliers.
 * Each source includes: URL, selectors, category mapping, and pagination rules.
 *
 * Sources are prioritized by data quality and accessibility.
 */

export interface SourceFieldMapping {
  selector: string;
  attribute?: string; // if null, extracts textContent
  transform?: "trim" | "phone_normalize" | "email_normalize" | "lower" | "upper";
}

export interface SupplierSource {
  id: string;
  name: string;
  url: string;
  region: string; // e.g. "6th_of_october", "10th_of_ramadan", "alexandria", "national"
  category: string; // "F&B", "Linens", "Chemicals", "Engineering", "Amenities", "Uniforms", "Mixed"
  priority: number; // 1-10, higher = scrape first
  itemSelector: string; // CSS selector for each listing item
  fields: Record<string, SourceFieldMapping>; // field name -> extraction rule
  pagination?: {
    type: "page_number" | "next_button" | "infinite_scroll";
    nextSelector?: string;
    maxPages: number;
    paramName?: string; // for URL-based pagination
  };
  antiDetection?: boolean; // needs human-like behavior
  notes?: string;
}

// ── Source Registry ──

export const SUPPLIER_SOURCES: SupplierSource[] = [
  {
    id: "yellowpages-eg-hospitality",
    name: "Yellow Pages Egypt — Hospitality Suppliers",
    url: "https://yellowpages.com.eg/en/search/hotel-supplies",
    region: "national",
    category: "Mixed",
    priority: 9,
    itemSelector: ".result-item",
    fields: {
      name: { selector: ".business-name", transform: "trim" },
      phone: { selector: ".phone-number", transform: "phone_normalize" },
      address: { selector: ".address", transform: "trim" },
      city: { selector: ".city", transform: "trim" },
      category: { selector: ".category-tag", transform: "trim" },
      website: { selector: ".website-link", attribute: "href" },
    },
    pagination: {
      type: "next_button",
      nextSelector: ".pagination .next",
      maxPages: 10,
    },
    antiDetection: true,
    notes: "Primary source for mixed hospitality suppliers across Egypt",
  },
  {
    id: "industrialzones-6oct",
    name: "6th of October Industrial Directory",
    url: "https://industrialzones.gov.eg/en/directory?zone=6th-october",
    region: "6th_of_october",
    category: "Mixed",
    priority: 10,
    itemSelector: ".company-card",
    fields: {
      name: { selector: ".company-name", transform: "trim" },
      legalName: { selector: ".company-name", transform: "trim" },
      phone: { selector: ".contact-phone", transform: "phone_normalize" },
      email: { selector: ".contact-email", transform: "email_normalize" },
      address: { selector: ".address", transform: "trim" },
      city: { selector: ".address", transform: "trim" },
      category: { selector: ".industry-type", transform: "trim" },
      website: { selector: ".website", attribute: "href" },
    },
    pagination: {
      type: "page_number",
      paramName: "page",
      maxPages: 20,
    },
    antiDetection: true,
    notes: "Government directory — highest trust signals, 1,853+ factories",
  },
  {
    id: "industrialzones-10ramadan",
    name: "10th of Ramadan Industrial Directory",
    url: "https://industrialzones.gov.eg/en/directory?zone=10th-ramadan",
    region: "10th_of_ramadan",
    category: "Mixed",
    priority: 10,
    itemSelector: ".company-card",
    fields: {
      name: { selector: ".company-name", transform: "trim" },
      legalName: { selector: ".company-name", transform: "trim" },
      phone: { selector: ".contact-phone", transform: "phone_normalize" },
      email: { selector: ".contact-email", transform: "email_normalize" },
      address: { selector: ".address", transform: "trim" },
      city: { selector: ".address", transform: "trim" },
      category: { selector: ".industry-type", transform: "trim" },
      website: { selector: ".website", attribute: "href" },
    },
    pagination: {
      type: "page_number",
      paramName: "page",
      maxPages: 30,
    },
    antiDetection: true,
    notes: "Government directory — 3,000+ factories, expansion target",
  },
  {
    id: "kompass-eg-hospitality",
    name: "Kompass Egypt — Hospitality",
    url: "https://eg.kompass.com/en/search/hotel-supplies/",
    region: "national",
    category: "Mixed",
    priority: 7,
    itemSelector: ".company-result",
    fields: {
      name: { selector: ".company-name a", transform: "trim" },
      phone: { selector: ".phone", transform: "phone_normalize" },
      address: { selector: ".address", transform: "trim" },
      city: { selector: ".locality", transform: "trim" },
      category: { selector: ".activity", transform: "trim" },
      website: { selector: ".company-name a", attribute: "href" },
    },
    pagination: {
      type: "next_button",
      nextSelector: ".pagination-next",
      maxPages: 10,
    },
    antiDetection: true,
    notes: "International B2B directory with Egyptian listings",
  },
  {
    id: "cairo-chamber-hospitality",
    name: "Cairo Chamber of Commerce — Hospitality Sector",
    url: "https://www.cairochamber.org.eg/en/members?sector=hospitality",
    region: "cairo",
    category: "Mixed",
    priority: 8,
    itemSelector: ".member-row",
    fields: {
      name: { selector: ".member-name", transform: "trim" },
      legalName: { selector: ".member-name", transform: "trim" },
      phone: { selector: ".member-phone", transform: "phone_normalize" },
      email: { selector: ".member-email", transform: "email_normalize" },
      address: { selector: ".member-address", transform: "trim" },
      city: { selector: ".member-address", transform: "trim" },
      commercialReg: { selector: ".cr-number", transform: "trim" },
    },
    pagination: {
      type: "page_number",
      paramName: "page",
      maxPages: 15,
    },
    antiDetection: true,
    notes: "Chamber members have high trust — verified commercial registration",
  },
  {
    id: "expolink-food-beverage",
    name: "Egyptian Exporters Association — F&B",
    url: "https://expolink.org.eg/en/exporters?sector=food-beverage",
    region: "national",
    category: "F&B",
    priority: 9,
    itemSelector: ".exporter-card",
    fields: {
      name: { selector: ".exporter-name", transform: "trim" },
      legalName: { selector: ".exporter-name", transform: "trim" },
      phone: { selector: ".exporter-phone", transform: "phone_normalize" },
      email: { selector: ".exporter-email", transform: "email_normalize" },
      address: { selector: ".exporter-address", transform: "trim" },
      city: { selector: ".exporter-city", transform: "trim" },
      website: { selector: ".exporter-website", attribute: "href" },
    },
    pagination: {
      type: "page_number",
      paramName: "page",
      maxPages: 15,
    },
    antiDetection: true,
    notes: "Exporters have export quality standards — premium tier potential",
  },
  {
    id: "expolink-textiles",
    name: "Egyptian Exporters Association — Textiles/Linens",
    url: "https://expolink.org.eg/en/exporters?sector=textiles",
    region: "national",
    category: "Linens",
    priority: 9,
    itemSelector: ".exporter-card",
    fields: {
      name: { selector: ".exporter-name", transform: "trim" },
      legalName: { selector: ".exporter-name", transform: "trim" },
      phone: { selector: ".exporter-phone", transform: "phone_normalize" },
      email: { selector: ".exporter-email", transform: "email_normalize" },
      address: { selector: ".exporter-address", transform: "trim" },
      city: { selector: ".exporter-city", transform: "trim" },
      website: { selector: ".exporter-website", attribute: "href" },
    },
    pagination: {
      type: "page_number",
      paramName: "page",
      maxPages: 10,
    },
    antiDetection: true,
    notes: "Textile exporters — strong for linens, uniforms, amenities",
  },
  {
    id: "expolink-chemicals",
    name: "Egyptian Exporters Association — Chemicals",
    url: "https://expolink.org.eg/en/exporters?sector=chemicals",
    region: "national",
    category: "Chemicals",
    priority: 8,
    itemSelector: ".exporter-card",
    fields: {
      name: { selector: ".exporter-name", transform: "trim" },
      legalName: { selector: ".exporter-name", transform: "trim" },
      phone: { selector: ".exporter-phone", transform: "phone_normalize" },
      email: { selector: ".exporter-email", transform: "email_normalize" },
      address: { selector: ".exporter-address", transform: "trim" },
      city: { selector: ".exporter-city", transform: "trim" },
      website: { selector: ".exporter-website", attribute: "href" },
    },
    pagination: {
      type: "page_number",
      paramName: "page",
      maxPages: 10,
    },
    antiDetection: true,
    notes: "Chemical exporters — housekeeping supplies, cleaning agents",
  },
];

// ── Helpers ──

export function getSourcesByRegion(region: string): SupplierSource[] {
  return SUPPLIER_SOURCES.filter((s) => s.region === region).sort(
    (a, b) => b.priority - a.priority
  );
}

export function getSourcesByCategory(category: string): SupplierSource[] {
  return SUPPLIER_SOURCES.filter((s) => s.category === category).sort(
    (a, b) => b.priority - a.priority
  );
}

export function getTopSources(limit: number = 5): SupplierSource[] {
  return [...SUPPLIER_SOURCES].sort((a, b) => b.priority - a.priority).slice(0, limit);
}

/**
 * Map raw scraped fields to Lead model fields
 */
export function mapFieldsToLead(
  raw: Record<string, string | null>,
  source: SupplierSource
): Record<string, string | null> {
  const mapped: Record<string, string | null> = {};

  for (const [fieldName, mapping] of Object.entries(source.fields)) {
    let value = raw[fieldName];
    if (!value) continue;

    switch (mapping.transform) {
      case "trim":
        value = value.trim();
        break;
      case "phone_normalize":
        value = normalizePhone(value);
        break;
      case "email_normalize":
        value = value.toLowerCase().trim();
        break;
      case "lower":
        value = value.toLowerCase().trim();
        break;
      case "upper":
        value = value.toUpperCase().trim();
        break;
    }

    mapped[fieldName] = value;
  }

  // Derive city from address if missing
  if (!mapped.city && mapped.address) {
    mapped.city = extractCity(mapped.address);
  }

  // Derive governorate from city
  if (mapped.city) {
    mapped.governorate = mapCityToGovernorate(mapped.city);
  }

  return mapped;
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("20") && digits.length >= 10) {
    return `+${digits}`;
  }
  if (digits.startsWith("0") && digits.length >= 10) {
    return `+20${digits.slice(1)}`;
  }
  if (digits.length >= 7) {
    return `+20${digits}`;
  }
  return phone;
}

function extractCity(address: string): string | null {
  const cities = [
    "Cairo", "Alexandria", "Giza", "Shubra El Kheima", "Port Said",
    "Suez", "Luxor", "al-Mansura", "El-Mahalla El-Kubra", "Tanta",
    "Asyut", "Ismailia", "Fayyum", "Zagazig", "Aswan", "Damietta",
    "Damanhur", "al-Minya", "Beni Suef", "Qena", "Sohag", "Hurghada",
    "6th of October", "10th of Ramadan", "New Cairo", "Sheikh Zayed",
    "Obour", "Sadat City", "Badr", "New Borg El Arab", "New Damietta",
  ];
  const lower = address.toLowerCase();
  for (const city of cities) {
    if (lower.includes(city.toLowerCase())) {
      return city;
    }
  }
  return null;
}

function mapCityToGovernorate(city: string): string | null {
  const map: Record<string, string> = {
    cairo: "Cairo Governorate",
    alexandria: "Alexandria Governorate",
    giza: "Giza Governorate",
    "port said": "Port Said Governorate",
    suez: "Suez Governorate",
    luxor: "Luxor Governorate",
    asyut: "Asyut Governorate",
    ismailia: "Ismailia Governorate",
    aswan: "Aswan Governorate",
    damietta: "Damietta Governorate",
    "beni suef": "Beni Suef Governorate",
    qena: "Qena Governorate",
    sohag: "Sohag Governorate",
    hurghada: "Red Sea Governorate",
    "6th of october": "Giza Governorate",
    "10th of ramadan": "Sharqia Governorate",
    "new cairo": "Cairo Governorate",
    "sheikh zayed": "Giza Governorate",
  };
  return map[city.toLowerCase()] || null;
}
