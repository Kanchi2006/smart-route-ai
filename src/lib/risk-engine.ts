import type { WeatherInfo, RiskResult } from "@/types";

/**
 * Simulate traffic intensity based on distance, time-of-day, and randomness.
 */
export function simulateTraffic(distanceKm: number): "Low" | "Medium" | "High" {
  const hour = new Date().getHours();
  const rushHour = (hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 20);
  const r = Math.random();

  if (rushHour && distanceKm > 500) return r > 0.3 ? "High" : "Medium";
  if (distanceKm > 1500) return r > 0.5 ? "High" : "Medium";
  if (r > 0.7) return "High";
  if (r > 0.35) return "Medium";
  return "Low";
}

/**
 * Deterministic risk decision based on weather condition and traffic level.
 */
export function calculateRisk(weather: WeatherInfo, traffic: string): RiskResult {
  const w = weather.condition.toLowerCase();

  if (w.includes("thunder") || w.includes("snow")) {
    return { risk: "High", status: "Delayed" };
  }
  if (w.includes("rain")) {
    return traffic === "Low"
      ? { risk: "Medium", status: "On Time" }
      : { risk: "High", status: "Delayed" };
  }
  if (w.includes("fog")) {
    return traffic === "High"
      ? { risk: "High", status: "Delayed" }
      : { risk: "Medium", status: "On Time" };
  }
  if (w.includes("cloud")) {
    if (traffic === "High") return { risk: "Medium", status: "Delayed" };
    return { risk: "Low", status: "On Time" };
  }
  // Clear
  if (traffic === "High") return { risk: "High", status: "Delayed" };
  if (traffic === "Medium") return { risk: "Medium", status: "On Time" };
  return { risk: "Low", status: "On Time" };
}
