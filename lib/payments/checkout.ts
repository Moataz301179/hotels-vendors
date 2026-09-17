/**
 * Checkout utilities for HotelsVendors.
 * Generates checkout URLs and manages cart/checkout state.
 */

/**
 * Generate a checkout URL for a given cart.
 * In production, this would integrate with the payment provider.
 */
export function generateCheckoutUrl(
  cartId: string,
  returnUrl?: string,
  cancelUrl?: string
): string {
  const base = process.env.NEXT_PUBLIC_API_URL || "/api";
  const params = new URLSearchParams({
    cartId,
    returnUrl: returnUrl || "",
    cancelUrl: cancelUrl || "",
  });
  return `${base}/payments/checkout?${params.toString()}`;
}

/**
 * Calculate cart totals.
 */
export function calculateCartTotal(items: Array<{ price: number; quantity: number }>): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
