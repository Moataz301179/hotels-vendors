const BASE_URL = "https://api.open-meteo.com/v1";

export interface WeatherForecast {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weather_code: number[];
  };
}

export async function getForecast(
  lat: number,
  lon: number,
  days = 7
): Promise<WeatherForecast> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code",
    timezone: "Africa/Cairo",
    forecast_days: days.toString(),
  });
  const res = await fetch(`${BASE_URL}/forecast?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
  return res.json();
}

export function weatherEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 57) return "🌧️";
  if (code <= 77) return "🌨️";
  return "🌩️";
}
