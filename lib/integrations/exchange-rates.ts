const BASE_URL = "https://api.frankfurter.dev";

export interface ExchangeRateResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export async function getLatestRates(base = "EGP"): Promise<ExchangeRateResponse> {
  const res = await fetch(`${BASE_URL}/latest?base=${base}`);
  if (!res.ok) throw new Error(`Frankfurter API error: ${res.status}`);
  return res.json();
}

export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<number> {
  const res = await fetch(`${BASE_URL}/latest?amount=${amount}&from=${from}&to=${to}`);
  if (!res.ok) throw new Error(`Frankfurter API error: ${res.status}`);
  const data: ExchangeRateResponse = await res.json();
  return data.rates[to] || 0;
}
