const BASE_URL = "https://date.nager.at/api/v3";

export interface PublicHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  global: boolean;
  type: string;
}

export async function getPublicHolidays(
  year: number,
  countryCode = "EG"
): Promise<PublicHoliday[]> {
  const res = await fetch(`${BASE_URL}/PublicHolidays/${year}/${countryCode}`);
  if (!res.ok) throw new Error(`Nager.Date API error: ${res.status}`);
  return res.json();
}

export async function isHoliday(date: string, countryCode = "EG"): Promise<boolean> {
  const year = new Date(date).getFullYear();
  const holidays = await getPublicHolidays(year, countryCode);
  return holidays.some((h) => h.date === date);
}
