import type { WeatherInfo } from "@/types";

/**
 * Fetch current weather using Open-Meteo (free, no key required).
 * Uses WMO weather codes → human-readable conditions.
 */
export async function fetchWeather(lat: number, lng: number): Promise<WeatherInfo> {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
      `&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=auto`;

    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return fallback();

    const json = await res.json();
    const c = json?.current;

    return {
      condition: wmoToCondition(c?.weather_code ?? 0),
      tempC: c?.temperature_2m ?? null,
      humidity: c?.relative_humidity_2m ?? null,
      windKph: c?.wind_speed_10m ?? null,
    };
  } catch (err) {
    console.error("Weather fetch failed:", err);
    return fallback();
  }
}

function fallback(): WeatherInfo {
  return { condition: "Clear", tempC: null, humidity: null, windKph: null };
}

function wmoToCondition(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 3) return "Clouds";
  if (code >= 45 && code <= 48) return "Fog";
  if (code >= 51 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Rain";
  if (code >= 95) return "Thunderstorm";
  return "Clear";
}
