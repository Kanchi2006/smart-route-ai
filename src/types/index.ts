export interface City {
  name: string;
  state: string;
  lat: number;
  lng: number;
}

export interface Shipment {
  id: string;
  source: string;
  destination: string;
  source_lat: number;
  source_lng: number;
  dest_lat: number;
  dest_lng: number;
  distance_km: number;
  weather: string;
  weather_temp: number | null;
  traffic: string;
  risk: "Low" | "Medium" | "High";
  status: string;
  reason: string;
  created_at: string;
}

export interface WeatherInfo {
  condition: string;
  tempC: number | null;
  humidity: number | null;
  windKph: number | null;
}

export interface RiskResult {
  risk: "Low" | "Medium" | "High";
  status: "On Time" | "Delayed";
}
