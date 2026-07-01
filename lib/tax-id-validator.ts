export function validateEgyptianTaxId(taxId: string): { valid: boolean; error?: string } {
  const cleaned = taxId.replace(/\s/g, "");

  if (!/^\d{9}$/.test(cleaned)) {
    return { valid: false, error: "Egyptian Tax Registration Number must be exactly 9 digits" };
  }

  return { valid: true };
}

export function validateCommercialRegistry(regNum: string): { valid: boolean; error?: string } {
  const cleaned = regNum.replace(/\s/g, "");

  if (!/^\d{9,15}$/.test(cleaned)) {
    return { valid: false, error: "Commercial Registry Number must be 9-15 digits" };
  }

  return { valid: true };
}
