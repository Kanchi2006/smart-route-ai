import { useEffect, useState } from "react";
import {
  BarChart3, TrendingUp, MapPin, Zap,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, AreaChart, Area,
} from "recharts";
import { listShipments } from "@/services/shipments";
import type { Shipment } from "@/types";

const tooltipStyle = {
  background: "rgba(18,16,27,0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "#f1f5f9",
  fontSize: 13,
};

export default function Analytics() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listShipments(100).then(setShipments).finally(() => setLoading(false));
  }, []);

  /* Route frequency */
  const routeMap = new Map<string, number>();
  shipments.forEach((s) => {
    const key = `${s.source.split(",")[0]} → ${s.destination.split(",")[0]}`;
    routeMap.set(key, (routeMap.get(key) ?? 0) + 1);
  });
  const topRoutes = [...routeMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([route, count]) => ({ route, count }));

  /* Risk trend (last 14 days) */
  const riskTrend: { day: string; high: number; medium: number; low: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    const dayStr = d.toISOString().slice(0, 10);
    const daySh = shipments.filter((s) => s.created_at.slice(0, 10) === dayStr);
    riskTrend.push({
      day: label,
      high: daySh.filter((s) => s.risk === "High").length,
      medium: daySh.filter((s) => s.risk === "Medium").length,
      low: daySh.filter((s) => s.risk === "Low").length,
    });
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center gap-3 pt-2 lg:pt-0">
        <BarChart3 className="size-7 text-neon-cyan" />
        <div>
          <h1 className="font-display text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-text-muted">Deeper insights into your logistics data</p>
        </div>
      </div>

      {loading ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card p-6">
              <div className="skeleton h-6 w-40 mb-4" />
              <div className="skeleton h-[220px] w-full" />
            </div>
          ))}
        </div>
      ) : shipments.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Zap className="size-10 text-neon-purple mx-auto mb-3 opacity-50" />
          <p className="text-text-muted">No data yet. Track some shipments first!</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Routes */}
          <div className="glass-card p-6 animate-fade-in">
            <h3 className="font-display text-base font-semibold mb-1 flex items-center gap-2">
              <MapPin className="size-4 text-neon-purple" /> Top Routes
            </h3>
            <p className="text-xs text-text-muted mb-4">Most frequently tracked routes</p>
            <div className="h-[220px]">
              <ResponsiveContainer>
                <BarChart data={topRoutes} layout="vertical" margin={{ left: 10, right: 16 }}>
                  <defs>
                    <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis dataKey="route" type="category" stroke="#64748b" tickLine={false} axisLine={false} fontSize={11} width={120} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill="url(#routeGrad)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Trend */}
          <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h3 className="font-display text-base font-semibold mb-1 flex items-center gap-2">
              <TrendingUp className="size-4 text-neon-cyan" /> Risk Trend (14 days)
            </h3>
            <p className="text-xs text-text-muted mb-4">Daily risk breakdown</p>
            <div className="h-[220px]">
              <ResponsiveContainer>
                <AreaChart data={riskTrend} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaHigh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="areaMed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="areaLow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="high" stroke="#ef4444" fill="url(#areaHigh)" strokeWidth={2} />
                  <Area type="monotone" dataKey="medium" stroke="#f59e0b" fill="url(#areaMed)" strokeWidth={2} />
                  <Area type="monotone" dataKey="low" stroke="#10b981" fill="url(#areaLow)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
