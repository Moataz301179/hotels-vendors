/**
 * WhatsApp Order-History Import — consent-based chat-export parser.
 *
 * Flow: user exports a WhatsApp chat ("Export chat" → .txt/.zip), shares it into
 * the app. This parser extracts order-ish messages (items, qty, unit, price, date)
 * using regex structure + optional LLM refinement for messy lines. Low-confidence
 * rows are flagged REVIEW — never silently invented (NO-FAKE contract).
 *
 * WhatsApp export format (official):
 *   [DD/MM/YY, HH:MM:SS] Sender: message
 *   or (iOS) DD/MM/YY, HH:MM — Sender: message
 * Multi-line messages continue without a date prefix.
 */

export interface ParsedOrder {
  date: string; // ISO date from the message timestamp
  sender: string;
  rawText: string;
  items: ParsedItem[];
  totalAmount: number | null;
  confidence: number; // 0..1
}

export interface ParsedItem {
  name: string;
  quantity: number | null;
  unit: string | null;
  unitPrice: number | null;
  lineTotal: number | null;
  confidence: number;
}

export interface ParseResult {
  orders: ParsedOrder[];
  messagesScanned: number;
  ordersFound: number;
  reviewNeeded: number;
  dateRange: { from: string | null; to: string | null };
}

const DATE_PATTERNS = [
  /^\[(\d{1,2})\/(\d{1,2})\/(\d{2,4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\]\s*([^:]+):\s?/, // [26/08/25, 14:18:02] Sender:
  /^(\d{1,2})\/(\d{1,2})\/(\d{2,4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\]\s*([^:]+):\s?/, // 26/08/25, 14:18:02] Sender: (bracket from prev line)
  /^(\d{1,2})\/(\d{1,2})\/(\d{2,4}),?\s+(\d{1,2}):(\d{2})\s*[-–]\s*([^:]+):\s?/, // 26/08/2025 14:18 - Sender:
];

const UNIT_WORDS = "kg|kilo|kgs|g|gm|gram|l|ltr|liter|litre|ml|pcs|pc|piece|pieces|box|carton|ctn|pack|pkt|case|btl|bottle|bag|sack|tray|dozen|dz";

/** Lines that look like order lines: "Rice 25kg x 4" / "4 x e Oil 5L @ 2000" */
function parseOrderLine(line: string): ParsedItem | null {
  const cleaned = line.replace(/^[-*•·]\s*/, "").trim();
  if (cleaned.length < 3 || cleaned.length > 120) return null;
  // Skip obvious non-order chatter
  if (/^(ok|thanks|thank you|done|yes|no|hi|hello|salam|السلام|شكرا|تم|حاضر)\b/i.test(cleaned)) return null;
  if (/^total\b/i.test(cleaned)) return null; // totals handled by parseTotal
  if (/^(sub\s*total|grand\s*total|vat|delivery|discount)\b/i.test(cleaned)) return null;

  let m;

  const NAME = "[\\w .,'\\-()\\u0600-\\u06FF&/]+?";
  const mNameXQty = cleaned.match(new RegExp(`^(${NAME})\\s+(?:x|\u00d7)\\s*(\\d+(?:\\.5)?)(?:\\s+@\\s*(\\d[\\d,]*)(?:\\.\\d+)?)?$`, "i"));
  const mQtyXName = cleaned.match(new RegExp(`^(\\d+(?:\\.5)?)\\s*(?:x|\u00d7)\\s*(${NAME})(?:\\s+@\\s*(\\d[\\d,]*)(?:\\.\\d+)?)?$`, "i"));
  if (mNameXQty || mQtyXName) {
    const flipped = !mNameXQty;
    m = (flipped ? mQtyXName : mNameXQty);
    const name = (flipped ? m![2] : m![1]).trim();
    const qty = Number(flipped ? m![1] : m![2]);
    const price = m![3] ? Number(m![3].replace(/,/g, "")) : null;
    // strip unit only when it directly follows a digit ("25kg" -> "25"), keep "5L" product specs
    const unitM = name.match(new RegExp(`([0-9]+(?:\.[0-9]+)?)(kg|kilo|kgs|gm|gram|ltr|liter|litre|ml|pcs|pc|piece|pieces|carton|ctn|pack|pkt|case|btl|bottle|bag|sack|tray|dozen|dz)(?![a-zA-Z])`, "i"));
    const stripped = unitM ? name.replace(unitM[0], "").replace(/\s{2,}/g, " ").trim() : name;
    return {
      name: stripped.length >= 3 ? stripped : name,
      quantity: qty,
      unit: unitM ? (unitM[1] + unitM[2]).toLowerCase() : null,
      unitPrice: price,
      lineTotal: price !== null ? price * qty : null,
      confidence: price !== null ? 0.85 : 0.6,
    };
  }

  // "Rice 25kg — 4 bags — 5000" style with dashes/colons
  m = cleaned.match(new RegExp(`^([\\w .,'\\-()\\u0600-\\u06FF&/]+?)\\s*[—:;\\-]\\s*(\\d+)\\s*(${UNIT_WORDS})?\\s*[—:;\\-]?\\s*(\\d[\\d,]*)?$`, "i"));
  if (m && (m[4] || m[2])) {
    return {
      name: m[1].trim(),
      quantity: Number(m[2]),
      unit: m[3]?.toLowerCase() ?? null,
      unitPrice: m[4] ? Number(m[4].replace(/,/g, "")) / Number(m[2]) : null,
      lineTotal: m[4] ? Number(m[4].replace(/,/g, "")) : null,
      confidence: m[4] ? 0.75 : 0.5,
    };
  }

  return null;
}

function parseTotal(text: string): number | null {
  const m = text.match(/total[:\s]*(?:egp)?\s*([\d,]+(?:\.\d+)?)/i);
  return m ? Number(m[1].replace(/,/g, "")) : null;
}

export function parseWhatsAppExport(raw: string): ParseResult {
  const lines = raw.split(/\r?\n/);
  const orders: ParsedOrder[] = [];
  let messagesScanned = 0;
  let current: { date: string; sender: string; text: string[] } | null = null;

  const flush = () => {
    if (!current) return;
    const body = current.text.join("\n").trim();
    if (!body) { current = null; return; }
    messagesScanned++;
    const linesArr = body.split("\n");
    const items: ParsedItem[] = [];
    for (const l of linesArr) {
      const item = parseOrderLine(l);
      if (item) items.push(item);
    }
    const total = parseTotal(body);
    // An order = has items, or an explicit total
    if (items.length > 0 || total !== null) {
      const avgConf = items.length
        ? items.reduce((s, i) => s + i.confidence, 0) / items.length
        : 0.5;
      orders.push({
        date: current.date,
        sender: current.sender,
        rawText: body.slice(0, 2000),
        items,
        totalAmount: total,
        confidence: Number(avgConf.toFixed(2)),
      });
    }
    current = null;
  };

  for (const line of lines) {
    let matched = false;
    for (const pat of DATE_PATTERNS) {
      const m = line.match(pat);
      if (m) {
        flush();
        const [, d, mo, y, hh, mm] = m;
        const sender = m[7] ?? m[6];
        let year = Number(y);
        if (year < 100) year += 2000;
        const iso = new Date(Date.UTC(year, Number(mo) - 1, Number(d), Number(hh), Number(mm))).toISOString();
        current = { date: iso, sender: (sender ?? "unknown").trim(), text: [line.replace(pat, "")] };
        matched = true;
        break;
      }
    }
    if (!matched && current) {
      current.text.push(line);
    }
  }
  flush();

  const dates = orders.map((o) => o.date).sort();
  return {
    orders,
    messagesScanned,
    ordersFound: orders.length,
    reviewNeeded: orders.filter((o) => o.confidence < 0.7 || o.items.some((i) => i.confidence < 0.7)).length,
    dateRange: { from: dates[0] ?? null, to: dates[dates.length - 1] ?? null },
  };
}
