import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { findCity, distanceKm, type City } from "@/lib/india-cities";

interface TrackInput {
  source: string;
  destination: string;
}

interface WeatherInfo {
  condition: string; // Clear / Clouds / Rain / Thunderstorm / Snow
  tempC: number | null;
}

// Open-Meteo: free, no key. Uses WMO weather codes.
async function fetchWeather(lat: number, lng: number): Promise<WeatherInfo> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code&timezone=auto`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return { condition: "Clear", tempC: null };
    const json: any = await res.json();
    const code: number = json?.current?.weather_code ?? 0;
    const tempC: number = json?.current?.temperature_2m ?? null;
    return { condition: wmoToCondition(code), tempC };
  } catch (e) {
    console.error("weather fetch failed", e);
    return { condition: "Clear", tempC: null };
  }
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

function simulateTraffic(distanceKmVal: number): "Low" | "Medium" | "High" {
  // Deterministic-ish but varied per call
  const hour = new Date().getHours();
  const rushHour = (hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 20);
  const r = Math.random();
  if (rushHour && distanceKmVal > 500) return r > 0.3 ? "High" : "Medium";
  if (distanceKmVal > 1500) return r > 0.5 ? "High" : "Medium";
  if (r > 0.7) return "High";
  if (r > 0.35) return "Medium";
  return "Low";
}

interface DecisionResult {
  risk: "Low" | "Medium" | "High";
  status: string;
}

function decide(weather: string, traffic: string): DecisionResult {
  const w = weather.toLowerCase();
  if (w.includes("thunder") || w.includes("rain") || w.includes("snow")) {
    return { risk: "High", status: "Delayed" };
  }
  if (w.includes("cloud") || w.includes("fog")) {
    if (traffic === "High") return { risk: "High", status: "Delayed" };
    return { risk: "Medium", status: "On Time" };
  }
  // Clear
  if (traffic === "High") return { risk: "High", status: "Delayed" };
  if (traffic === "Medium") return { risk: "Medium", status: "On Time" };
  return { risk: "Low", status: "On Time" };
}

async function generateReason(params: {
  source: string;
  destination: string;
  weather: string;
  tempC: number | null;
  traffic: string;
  risk: string;
  status: string;
  distanceKm: number;
}): Promise<string> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    return fallbackReason(params);
  }
  try {
    const prompt = `You are a logistics intelligence AI. In ONE concise sentence (max 25 words), explain why a shipment from ${params.source} to ${params.destination} (${params.distanceKm} km) has status "${params.status}" and risk "${params.risk}". Conditions: weather=${params.weather}${params.tempC !== null ? ` (${params.tempC}°C)` : ""}, traffic=${params.traffic}. Be specific, human-readable, no preamble.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: "You are a precise logistics analyst. Reply with ONE sentence only." },
          { role: "user", content: prompt },
        ],
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.error("Gemini error", res.status, await res.text());
      return fallbackReason(params);
    }
    const data: any = await res.json();
    const text: string = data?.choices?.[0]?.message?.content?.trim();
    return text || fallbackReason(params);
  } catch (e) {
    console.error("Gemini exception", e);
    return fallbackReason(params);
  }
}

function fallbackReason(p: { weather: string; traffic: string; status: string }): string {
  const factors: string[] = [];
  if (/(rain|thunder|snow)/i.test(p.weather)) factors.push(`${p.weather.toLowerCase()} conditions`);
  if (p.traffic === "High") factors.push("heavy traffic congestion");
  else if (p.traffic === "Medium") factors.push("moderate traffic");
  if (factors.length === 0) return "Clear weather and light traffic — delivery is on schedule.";
  return `Delivery is ${p.status.toLowerCase()} due to ${factors.join(" and ")} along the route.`;
}

export const trackShipment = createServerFn({ method: "POST" })
  .inputValidator((input: TrackInput) => {
    if (!input?.source || !input?.destination) {
      throw new Error("source and destination are required");
    }
    if (input.source.length > 120 || input.destination.length > 120) {
      throw new Error("input too long");
    }
    return { source: input.source.trim(), destination: input.destination.trim() };
  })
  .handler(async ({ data }) => {
    const src: City | undefined = findCity(data.source);
    const dst: City | undefined = findCity(data.destination);
    if (!src || !dst) {
      throw new Error("Unknown source or destination city. Pick from suggestions.");
    }
    if (src.name === dst.name) {
      throw new Error("Source and destination must be different.");
    }

    const dist = distanceKm(src, dst);
    const weather = await fetchWeather(dst.lat, dst.lng);
    const traffic = simulateTraffic(dist);
    const decision = decide(weather.condition, traffic);

    const reason = await generateReason({
      source: `${src.name}, ${src.state}`,
      destination: `${dst.name}, ${dst.state}`,
      weather: weather.condition,
      tempC: weather.tempC,
      traffic,
      risk: decision.risk,
      status: decision.status,
      distanceKm: dist,
    });

    const { data: inserted, error } = await supabaseAdmin
      .from("shipments")
      .insert({
        source: `${src.name}, ${src.state}`,
        destination: `${dst.name}, ${dst.state}`,
        source_lat: src.lat,
        source_lng: src.lng,
        dest_lat: dst.lat,
        dest_lng: dst.lng,
        distance_km: dist,
        weather: weather.condition,
        weather_temp: weather.tempC,
        traffic,
        risk: decision.risk,
        status: decision.status,
        reason,
      })
      .select()
      .single();

    if (error) {
      console.error("DB insert failed", error);
      throw new Error("Failed to store shipment.");
    }

    return { shipment: inserted };
  });

export const listShipments = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("shipments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    console.error("list shipments failed", error);
    return { shipments: [] as any[] };
  }
  return { shipments: data ?? [] };
});
