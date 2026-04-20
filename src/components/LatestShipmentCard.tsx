import {
  CloudRain,
  Cloud,
  Sun,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Car,
  ShieldAlert,
  Clock,
  Info,
} from "lucide-react";

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
  risk: string;
  status: string;
  reason: string;
  created_at: string;
}

const WEATHER_ICONS: Record<string, typeof Cloud> = {
  Clear: Sun,
  Clouds: Cloud,
  Rain: CloudRain,
  Snow: CloudSnow,
  Thunderstorm: CloudLightning,
  Fog: CloudFog,
};

const RISK_STYLES: Record<string, string> = {
  High: "text-risk-high",
  Medium: "text-risk-medium",
  Low: "text-risk-low",
};

const TRAFFIC_STYLES: Record<string, string> = {
  High: "text-risk-high",
  Medium: "text-risk-medium",
  Low: "text-risk-low",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  return `${Math.floor(h / 24)} d ago`;
}

export function LatestShipmentCard({ shipment }: { shipment: Shipment | null }) {
  if (!shipment) {
    return (
      <div className="glass-card p-6">
        <h3 className="font-display text-lg font-semibold mb-2">Latest Shipment Details</h3>
        <p className="text-sm text-muted-foreground">
          Track a shipment from the panel on the right to see live AI insights here.
        </p>
      </div>
    );
  }

  const WIcon = WEATHER_ICONS[shipment.weather] ?? Cloud;

  return (
    <div className="glass-card p-6 space-y-5">
      <h3 className="font-display text-lg font-semibold">Latest Shipment Details</h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Route</div>
          <div className="font-semibold">
            {shipment.source.split(",")[0]} <span className="text-primary">→</span>{" "}
            {shipment.destination.split(",")[0]}
          </div>
          <div className="mt-2 inline-block px-2 py-0.5 rounded-md bg-primary/15 text-primary text-xs font-medium">
            Distance: {shipment.distance_km.toLocaleString()} km
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Weather</div>
          <div className="flex items-center gap-2">
            <WIcon className="size-7 text-primary" />
            <div>
              <div className="font-semibold">{shipment.weather}</div>
              {shipment.weather_temp !== null && (
                <div className="text-xs text-muted-foreground">
                  {Math.round(shipment.weather_temp)}°C
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Traffic</div>
          <div className="flex items-center gap-2">
            <Car className={`size-6 ${TRAFFIC_STYLES[shipment.traffic]}`} />
            <div>
              <div className={`font-semibold ${TRAFFIC_STYLES[shipment.traffic]}`}>
                {shipment.traffic}
              </div>
              <div className="text-xs text-muted-foreground">
                {shipment.traffic === "High" ? "Congested" : shipment.traffic === "Medium" ? "Moderate" : "Light"}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Risk Level</div>
          <div className="flex items-center gap-2">
            <ShieldAlert className={`size-6 ${RISK_STYLES[shipment.risk]}`} />
            <span className={`font-semibold ${RISK_STYLES[shipment.risk]}`}>{shipment.risk}</span>
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Status</div>
          <div className="flex items-center gap-2">
            <Clock
              className={
                shipment.status === "Delayed" ? "size-6 text-risk-medium" : "size-6 text-risk-low"
              }
            />
            <span
              className={
                shipment.status === "Delayed"
                  ? "font-semibold text-risk-medium"
                  : "font-semibold text-risk-low"
              }
            >
              {shipment.status}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-glass-border pt-4 flex items-start gap-3">
        <Info className="size-5 text-accent shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
            AI Reason · powered by Gemini
          </div>
          <p className="text-accent font-medium">{shipment.reason}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Updated</div>
          <div className="text-sm font-medium">{timeAgo(shipment.created_at)}</div>
        </div>
      </div>
    </div>
  );
}
