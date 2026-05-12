"use client";

interface VolumeTier {
  minQty: number;
  price: number;
}

interface PriceDisplayProps {
  unitPrice: number;
  currency?: string;
  unitOfMeasure?: string;
  volumeTiers?: VolumeTier[];
  isB2B?: boolean;
}

export function PriceDisplay({
  unitPrice,
  currency = "EGP",
  unitOfMeasure = "piece",
  volumeTiers,
  isB2B = false,
}: PriceDisplayProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-baseline gap-1.5">
        <span className="text-lg font-bold text-gray-900">{formatPrice(unitPrice)}</span>
        <span className="text-xs text-gray-400">/ {unitOfMeasure}</span>
      </div>

      {isB2B && volumeTiers && volumeTiers.length > 0 && (
        <div className="mt-2 space-y-1 rounded-lg bg-gray-50 p-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Volume Pricing
          </p>
          {volumeTiers.map((tier) => (
            <div key={tier.minQty} className="flex justify-between text-xs">
              <span className="text-gray-600">
                {tier.minQty}+ {unitOfMeasure}
              </span>
              <span className="font-medium text-green-700">
                {formatPrice(tier.price)} each
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function parseVolumeTiers(tiersJson?: string | null): VolumeTier[] {
  if (!tiersJson) return [];
  try {
    const parsed = JSON.parse(tiersJson);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}
