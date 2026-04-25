import { supabase } from "@/services/supabase";
import { fetchWeather } from "@/services/weather";
import { generateReason } from "@/services/gemini";
import { simulateTraffic, calculateRisk } from "@/lib/risk-engine";
import { findCity, distanceKm } from "@/lib/india-cities";
import type { Shipment } from "@/types";

/**
 * Full shipment tracking pipeline:
 * 1. Resolve cities  2. Fetch weather  3. Simulate traffic
 * 4. Calculate risk   5. Generate AI reason  6. Store in Supabase
 */
export async function trackShipment(
  sourceName: string,
  destName: string,
): Promise<Shipment> {
  const src = findCity(sourceName);
  const dst = findCity(destName);
  if (!src) throw new Error(`Unknown source city: "${sourceName}"`);
  if (!dst) throw new Error(`Unknown destination city: "${destName}"`);
  if (src.name === dst.name) throw new Error("Source and destination must differ.");

  const dist = distanceKm(src, dst);
  const weather = await fetchWeather(dst.lat, dst.lng);
  const traffic = simulateTraffic(dist);
  const { risk, status } = calculateRisk(weather, traffic);

  const reason = await generateReason({
    source: `${src.name}, ${src.state}`,
    destination: `${dst.name}, ${dst.state}`,
    weather: weather.condition,
    tempC: weather.tempC,
    traffic,
    risk,
    status,
    distanceKm: dist,
  });

  const row = {
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
    risk,
    status,
    reason,
  };

  const { data, error } = await supabase
    .from("shipments")
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error("DB insert failed:", error);
    throw new Error("Failed to store shipment.");
  }

  return data as Shipment;
}

/** Fetch the most recent shipments. */
export async function listShipments(limit = 50): Promise<Shipment[]> {
  const { data, error } = await supabase
    .from("shipments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("List shipments failed:", error);
    return [];
  }
  return (data ?? []) as Shipment[];
}
