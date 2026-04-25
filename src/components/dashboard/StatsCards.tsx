import { Package, TrendingUp, AlertTriangle, MapPin } from "lucide-react";
import type { Shipment } from "@/types";

interface Props {
  shipments: Shipment[];
}

export function StatsCards({ shipments }: Props) {
  const total = shipments.length;
  const onTime = shipments.filter((s) => s.status === "On Time").length;
  const highRisk = shipments.filter((s) => s.risk === "High").length;
  const avgDist =
    total > 0 ? Math.round(shipments.reduce((a, s) => a + s.distance_km, 0) / total) : 0;

  const cards = [
    {
      label: "Total Shipments",
      value: total,
      icon: Package,
      color: "from-[#8b5cf6] to-[#6366f1]",
      glow: "rgba(139,92,246,0.25)",
    },
    {
      label: "On Time Rate",
      value: total > 0 ? `${Math.round((onTime / total) * 100)}%` : "—",
      icon: TrendingUp,
      color: "from-[#10b981] to-[#059669]",
      glow: "rgba(16,185,129,0.25)",
    },
    {
      label: "High Risk",
      value: highRisk,
      icon: AlertTriangle,
      color: "from-[#ef4444] to-[#dc2626]",
      glow: "rgba(239,68,68,0.25)",
    },
    {
      label: "Avg Distance",
      value: avgDist > 0 ? `${avgDist.toLocaleString()} km` : "—",
      icon: MapPin,
      color: "from-[#22d3ee] to-[#0891b2]",
      glow: "rgba(34,211,238,0.25)",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="glass-card p-5 animate-fade-in group"
        >
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
              {c.label}
            </p>
            <div
              className={`size-9 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center transition-shadow`}
              style={{ boxShadow: `0 0 20px ${c.glow}` }}
            >
              <c.icon className="size-4 text-white" />
            </div>
          </div>
          <p className="text-2xl lg:text-3xl font-display font-bold tracking-tight">
            {c.value}
          </p>
        </div>
      ))}
    </div>
  );
}
