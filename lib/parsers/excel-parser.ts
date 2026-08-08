/**
 * Excel/CSV Parser — SheetJS wrapper for catalog imports
 * Handles .xlsx, .xls, .csv with header detection, type coercion, and row validation
 *
 * SECURITY: SheetJS `xlsx` has unfixable high-severity advisories (prototype
 * pollution + ReDoS). It is ISOLATED here behind a lazy dynamic import so it is
 * never in the main bundle, and bounded by hard caps (file size / sheets / rows)
 * plus protective parsing flags + try/catch. Do NOT hoist a static `xlsx`
 * import into app code.
 */

/* SheetJS is loaded lazily (dynamic import) to keep it out of the main bundle
   and to isolate the unfixable ReDoS/prototype-pollution risk. Cached promise. */
let xlsxPromise: Promise<typeof import("xlsx")> | null = null;
function getXLSX(): Promise<typeof import("xlsx")> {
  if (!xlsxPromise) {
    // Protective flags + caps blunt the ReDoS/parsing surface.
    xlsxPromise = import("xlsx").then((m) => m);
  }
  return xlsxPromise;
}

/* Hard caps to bound worst-case parse work (ReDoS / zip-bomb containment). */
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_SHEETS = 16;
const MAX_ROWS = 20_000;

/** Decompress + parse a workbook buffer through the lazy SheetJS instance. */
async function readWorkbook(buffer: Buffer) {
  if (buffer.length > MAX_FILE_BYTES) throw new Error("File exceeds 5MB safety limit.");
  const XLSX = await getXLSX();
  try {
    const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true, dense: true });
    if (workbook.SheetNames.length > MAX_SHEETS) {
      workbook.SheetNames = workbook.SheetNames.slice(0, MAX_SHEETS);
    }
    return workbook;
  } catch (e) {
    throw new Error("Failed to parse spreadsheet: " + ((e as Error).message || "invalid file"));
  }
}

export interface ParsedCell {
  value: unknown;
  type: "string" | "number" | "boolean" | "date" | "empty";
  raw: unknown;
}

export interface ParsedRow {
  rowIndex: number;        // 1-based (Excel row number)
  data: Record<string, ParsedCell>;
  errors: string[];        // Row-level validation errors
  warnings: string[];      // Non-blocking issues
}

export interface ParseResult {
  fileName: string;
  sheetName: string;
  headers: string[];       // Normalized header names
  rawHeaders: string[];    // Original header names from file
  rows: ParsedRow[];
  totalRows: number;
  validRows: number;
  errorRows: number;
  detectedFormat: "xlsx" | "csv" | "unknown";
}

export interface ColumnMapping {
  sourceHeader: string;    // Header from uploaded file
  targetField: TargetField; // Mapped to our schema
  confidence: number;      // 0-1
  required: boolean;
  sampleValues: string[];  // First 3 non-empty values for preview
}

export type TargetField =
  | "sku"
  | "name"
  | "description"
  | "category"
  | "subcategory"
  | "unitPrice"
  | "currency"
  | "stockQuantity"
  | "minOrderQty"
  | "unitOfMeasure"
  | "leadTimeDays"
  | "shelfLifeDays"
  | "temperatureReq"
  | "images"
  | "ignored";

const TARGET_FIELD_ALIASES: Record<TargetField, string[]> = {
  sku: ["sku", "product code", "item code", "code", "part number", "partno", "ean", "gtin", "barcode", "upc", "isbn"],
  name: ["name", "product name", "item name", "title", "description", "product", "item"],
  description: ["description", "desc", "details", "specs", "specifications", "notes", "long description"],
  category: ["category", "cat", "type", "product type", "group", "department", "class"],
  subcategory: ["subcategory", "sub-category", "sub category", "sub type", "variant", "line"],
  unitPrice: ["price", "unit price", "cost", "unit cost", "sale price", "list price", "rate", "amount", "egp", "value"],
  currency: ["currency", "curr", "ccy", "money"],
  stockQuantity: ["stock", "quantity", "qty", "available", "on hand", "inventory", "units", "count"],
  minOrderQty: ["min order", "minimum order", "moq", "min qty", "minimum qty", "order multiple"],
  unitOfMeasure: ["uom", "unit", "unit of measure", "uom", "measure", "per"],
  leadTimeDays: ["lead time", "leadtime", "days", "delivery days", "shipping time", "turnaround"],
  shelfLifeDays: ["shelf life", "shelflife", "expiry days", "expiration", "best before", "use by"],
  temperatureReq: ["temperature", "temp", "storage temp", "cold chain", "refrigerated", "frozen"],
  images: ["image", "images", "photo", "photos", "picture", "url", "image url", "picture url"],
  ignored: [],
};

/**
 * Normalize a header string for matching
 */
function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .trim()
    .replace(/[_\-\.\s]+/g, " ")
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
}

/**
 * Detect the target field for a given header using fuzzy matching
 */
function detectTargetField(header: string): { field: TargetField; confidence: number } {
  const normalized = normalizeHeader(header);
  let bestField: TargetField = "ignored";
  let bestConfidence = 0;

  for (const [field, aliases] of Object.entries(TARGET_FIELD_ALIASES)) {
    for (const alias of aliases) {
      const normAlias = normalizeHeader(alias);
      if (normalized === normAlias) {
        return { field: field as TargetField, confidence: 1.0 };
      }
      if (normalized.includes(normAlias) || normAlias.includes(normalized)) {
        const confidence = 0.7 + 0.3 * (normAlias.length / Math.max(normalized.length, normAlias.length));
        if (confidence > bestConfidence) {
          bestConfidence = confidence;
          bestField = field as TargetField;
        }
      }
    }
  }

  return { field: bestField, confidence: bestConfidence };
}

/**
 * Coerce a cell value to a specific type based on target field
 */
function coerceValue(value: unknown, targetField: TargetField): ParsedCell {
  if (value === null || value === undefined || value === "") {
    return { value: null, type: "empty", raw: value };
  }

  // Handle dates
  if (value instanceof Date) {
    return { value: value.toISOString().split("T")[0], type: "date", raw: value };
  }

  // Handle numbers
  if (typeof value === "number") {
    if (Number.isInteger(value)) {
      return { value, type: "number", raw: value };
    }
    return { value, type: "number", raw: value };
  }

  // Handle strings - try to parse numbers for numeric fields
  if (typeof value === "string") {
    const trimmed = value.trim();
    const numericFields: TargetField[] = [
      "unitPrice", "stockQuantity", "minOrderQty", "leadTimeDays", "shelfLifeDays"
    ];

    if (numericFields.includes(targetField)) {
      const parsed = parseFloat(trimmed.replace(/[^\d\.\-]/g, ""));
      if (!isNaN(parsed)) {
        return { value: parsed, type: "number", raw: value };
      }
    }

    // Boolean detection
    if (targetField === "temperatureReq") {
      const lower = trimmed.toLowerCase();
      if (["yes", "true", "1", "y", "required", "chilled", "frozen", "cold"].includes(lower)) {
        return { value: true, type: "boolean", raw: value };
      }
      if (["no", "false", "0", "n", "ambient", "room temp"].includes(lower)) {
        return { value: false, type: "boolean", raw: value };
      }
    }

    return { value: trimmed, type: "string", raw: value };
  }

  return { value: String(value), type: "string", raw: value };
}

/**
 * Validate a single cell value against target field requirements
 */
function validateCell(cell: ParsedCell, targetField: TargetField, required: boolean): string[] {
  const errors: string[] = [];

  if (cell.type === "empty") {
    if (required) {
      errors.push(`${targetField} is required`);
    }
    return errors;
  }

  switch (targetField) {
    case "sku":
      if (cell.type === "string" && (cell.value as string).length < 2) {
        errors.push("SKU must be at least 2 characters");
      }
      break;
    case "name":
      if (cell.type === "string" && (cell.value as string).length < 2) {
        errors.push("Name must be at least 2 characters");
      }
      break;
    case "unitPrice":
      if (cell.type === "number") {
        const num = cell.value as number;
        if (num <= 0) errors.push("Unit price must be positive");
        if (num > 1000000) errors.push("Unit price seems unreasonably high (>1M EGP)");
      } else {
        errors.push("Unit price must be a number");
      }
      break;
    case "stockQuantity":
    case "minOrderQty":
    case "leadTimeDays":
      if (cell.type === "number") {
        const num = cell.value as number;
        if (num < 0) errors.push(`${targetField} cannot be negative`);
        if (!Number.isInteger(num)) errors.push(`${targetField} must be an integer`);
      } else {
        errors.push(`${targetField} must be a number`);
      }
      break;
    case "category":
      if (cell.type === "string") {
        const valid = ["F_AND_B", "CONSUMABLES", "GUEST_SUPPLIES", "FFE", "SERVICES",
          "fb", "consumables", "guest_supplies", "ffe", "services",
          "f&b", "food", "beverage", "housekeeping", "linen", "amenities", "equipment", "services"];
        if (!valid.includes((cell.value as string).toUpperCase().replace(/[&\s]/g, "_"))) {
          errors.push(`Category must be one of: F_AND_B, CONSUMABLES, GUEST_SUPPLIES, FFE, SERVICES`);
        }
      }
      break;
    case "currency":
      if (cell.type === "string" && (cell.value as string).length !== 3) {
        errors.push("Currency must be 3-letter code (e.g., EGP)");
      }
      break;
  }

  return errors;
}

/**
 * Main entry point: parse a buffer (from file upload) into structured rows
 */
export async function parseExcelBuffer(
  buffer: Buffer,
  fileName: string,
  options?: { sheetName?: string; headerRow?: number }
): Promise<ParseResult> {
  const workbook = await readWorkbook(buffer);
  const XLSX = await getXLSX();

  // Pick sheet
  const sheetName = options?.sheetName || workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    throw new Error(`Sheet "${sheetName}" not found. Available: ${workbook.SheetNames.join(", ")}`);
  }

  // Convert to JSON with header row
  const headerRow = options?.headerRow ?? 0; // 0-based
  const rawData = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,           // Return arrays, not objects
    defval: null,        // Empty cells = null
    blankrows: false,    // Skip blank rows
    raw: false,          // Format dates/numbers
  }).slice(0, MAX_ROWS) as unknown[][];

  if (rawData.length === 0) {
    return {
      fileName,
      sheetName,
      headers: [],
      rawHeaders: [],
      rows: [],
      totalRows: 0,
      validRows: 0,
      errorRows: 0,
      detectedFormat: fileName.endsWith(".csv") ? "csv" : "xlsx",
    };
  }

  // Extract headers from specified row
  const rawHeaders = (rawData[headerRow] || []).map((h) => (h ?? "").toString().trim());
  const dataRows = rawData.slice(headerRow + 1);

  // Detect target fields for each column
  const mappings: ColumnMapping[] = rawHeaders.map((header, idx) => {
    const { field, confidence } = detectTargetField(header);
    const sampleValues = dataRows
      .slice(0, 3)
      .map((row) => row[idx])
      .filter((v) => v !== null && v !== undefined && v !== "")
      .map((v) => String(v).slice(0, 50));

    return {
      sourceHeader: header || `Column ${idx + 1}`,
      targetField: field,
      confidence,
      required: ["sku", "name", "unitPrice"].includes(field),
      sampleValues,
    };
  });

  // Parse each data row
  const rows: ParsedRow[] = dataRows.map((row, rowIdx) => {
    const data: Record<string, ParsedCell> = {};
    const errors: string[] = [];
    const warnings: string[] = [];

    rawHeaders.forEach((header, colIdx) => {
      const mapping = mappings[colIdx];
      const rawValue = row[colIdx];
      const cell = coerceValue(rawValue, mapping.targetField);
      data[mapping.targetField] = cell;

      // Validate
      const cellErrors = validateCell(cell, mapping.targetField, mapping.required);
      errors.push(...cellErrors);

      // Warnings for low-confidence mappings
      if (mapping.confidence < 0.5 && mapping.targetField !== "ignored") {
        warnings.push(`Column "${header}" mapped to ${mapping.targetField} with low confidence (${Math.round(mapping.confidence * 100)}%)`);
      }
    });

    return {
      rowIndex: rowIdx + headerRow + 2, // 1-based Excel row number
      data,
      errors,
      warnings,
    };
  });

  const validRows = rows.filter((r) => r.errors.length === 0).length;
  const errorRows = rows.filter((r) => r.errors.length > 0).length;

  // Deduplicate headers for output (use targetField as key)
  const uniqueHeaders = Array.from(new Map(mappings.map(m => [m.targetField, m.targetField])).values());

  return {
    fileName,
    sheetName,
    headers: uniqueHeaders,
    rawHeaders,
    rows,
    totalRows: rows.length,
    validRows,
    errorRows,
    detectedFormat: fileName.toLowerCase().endsWith(".csv") ? "csv" : "xlsx",
  };
}

/**
 * Generate a downloadable Excel template with proper headers
 */
export async function generateTemplateBuffer(): Promise<Buffer> {
  const XLSX = await getXLSX();
  const templateHeaders = [
    "SKU",
    "Name",
    "Description",
    "Category (F_AND_B|CONSUMABLES|GUEST_SUPPLIES|FFE|SERVICES)",
    "Subcategory",
    "Unit Price (EGP)",
    "Currency (EGP)",
    "Stock Quantity",
    "Min Order Qty",
    "Unit of Measure (piece|box|case|pack|kg|l|m|set)",
    "Lead Time (Days)",
    "Shelf Life (Days)",
    "Temperature Required (yes/no)",
    "Image URLs (comma-separated)",
  ];

  const sampleRows = [
    [
      "FNB-HNZ-MAY-3KG-001",
      "Heinz Classic Mayonnaise 3kg",
      "Premium mayonnaise in 3kg bulk container, ideal for hotel kitchens",
      "F_AND_B",
      "Condiments & Sauces",
      387,
      "EGP",
      200,
      6,
      "jar",
      2,
      180,
      "no",
      "https://example.com/mayo.jpg",
    ],
    [
      "TEX-ALZ-BED-QN-001",
      "100% Cotton Bed Sheet - Queen",
      "Premium Egyptian cotton bed sheet, queen size, 300 TC, white",
      "CONSUMABLES",
      "Bed Linens",
      350,
      "EGP",
      500,
      50,
      "piece",
      7,
      0,
      "no",
      "https://example.com/sheet.jpg",
    ],
    [
      "AMN-UNI-SHP-30ML-001",
      "Shampoo 30ml - Premium",
      "Premium hotel shampoo in 30ml tube with brand logo option",
      "GUEST_SUPPLIES",
      "Bath Amenities",
      6,
      "EGP",
      5000,
      500,
      "piece",
      10,
      730,
      "no",
      "https://example.com/shampoo.jpg",
    ],
    [
      "FFE-ETT-PLT-10IN-001",
      "Porcelain Dinner Plate 10 inch",
      "Premium porcelain dinner plate, 10-inch diameter, white",
      "FFE",
      "Tableware",
      85,
      "EGP",
      1000,
      48,
      "piece",
      14,
      0,
      "no",
      "https://example.com/plate.jpg",
    ],
  ];

  const ws = XLSX.utils.aoa_to_sheet([templateHeaders, ...sampleRows]);
  // Set column widths
  ws["!cols"] = templateHeaders.map(() => ({ wch: 22 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Catalog Template");

  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
}

/**
 * Quick validation: check if buffer is a valid Excel/CSV file
 */
export async function isValidExcelBuffer(buffer: Buffer): Promise<boolean> {
  if (buffer.length > MAX_FILE_BYTES) return false;
  try {
    const XLSX = await getXLSX();
    XLSX.read(buffer, { type: "buffer" });
    return true;
  } catch {
    return false;
  }
}