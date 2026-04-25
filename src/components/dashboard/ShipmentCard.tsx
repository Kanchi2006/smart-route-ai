import {
  CloudRain, Cloud, Sun, CloudSnow, CloudLightning, CloudFog,
  Car, ShieldAlert, Clock, Info, Route,
} from "lucide-react";
import type { Shipment } from "@/types";

const WEATHER_ICONS: Record<string, typeof Cloud> = {
  Clear: Sun, Clouds: Cloud, Rain: CloudRain,
  Snow: CloudSnow, Thunderstorm: CloudLightning, Fog: CloudFog,
};

const RISK_BADGE: Record<string, string> = {
  High: "badge-high", Medium: "badge-medium", Low: "badge-low",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface Props {
  shipment: Shipment | null;
}

export function ShipmentCard({ shipment }: Props) {
  if (!shipment) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="font-display text-base font-semibold mb-2">Latest Shipment</h3>
        <p className="text-sm text-text-muted">
          Track a shipment to see live AI-powered insights here.
        </p>
      </div>
    );
  }

  const WIcon = WEATHER_ICONS[shipment.weather] ?? Cloud;
  const riskBadge = RISK_BADGE[shipment.risk] ?? "badge-low";

  return (
    <div className="glass-card-elevated p-6 space-y-5 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold">Latest Shipment</h3>
        <span className="text-xs text-text-muted">{timeAgo(shipment.created_at)}</span>
      </div>

      {/* Route header */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <Route className="size-5 text-neon-cyan shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">
            {shipment.source.split(",")[0]}
            <span className="text-neon-purple mx-2">→</span>
            {shipment.destination.split(",")[0]}
          </div>
          <div className="text-xs text-text-muted mt-0.5">
            {shipment.distance_km.toLocaleString()} km
          </div>
        </div>
        <span className={`badge ${riskBadge}`}>
          <span className="size-1.5 rounded-full bg-current" />
          {shipment.risk} Risk
        </span>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Detail
          label="Weather"
          icon={<WIcon className="size-5 text-neon-cyan" />}
          value={shipment.weather}
          sub={shipment.weather_temp !== null ? `${Math.round(shipment.weather_temp)}°C` : undefined}
        />
        <Detail
          label="Traffic"
          icon={<Car className="size-5 text-neon-purple" />}
          value={shipment.traffic}
          sub={
            shipment.traffic === "High" ? "Congested" :
            shipment.traffic === "Medium" ? "Moderate" : "Light"
          }
        />
        <Detail
          label="Risk Level"
          icon={<ShieldAlert className={`size-5 ${
            shipment.risk === "High" ? "text-risk-high" :
            shipment.risk === "Medium" ? "text-risk-medium" : "text-risk-low"
          }`} />}
          value={shipment.risk}
        />
        <Detail
          label="Status"
          icon={<Clock className={`size-5 ${
            shipment.status === "Delayed" ? "text-risk-medium" : "text-risk-low"
          }`} />}
          value={shipment.status}
        />
      </div>

      {/* AI Reason */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-[#8b5cf6]/[0.08] to-[#22d3ee]/[0.06] border border-[#8b5cf6]/20">
        <Info className="size-5 text-neon-cyan shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-widest text-text-muted mb-1.5 font-medium">
            AI Insight · Gemini
          </div>
          <p className="text-sm text-text-primary leading-relaxed">{shipment.reason}</p>
        </div>
      </div>
    </div>
  );
}

function Detail({
  label, icon, value, sub,
}: {
  label: string; icon: React.ReactNode; value: string; sub?: string;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-widest text-text-muted mb-1.5 font-medium">
        {label}
      </div>
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <div className="font-semibold text-sm">{value}</div>
          {sub && <div className="text-xs text-text-muted">{sub}</div>}
        </div>
      </div>
    </div>
  );
}
