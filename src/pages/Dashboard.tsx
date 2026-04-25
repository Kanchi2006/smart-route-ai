import { useEffect, useState, useCallback } from "react";
import { Bell, Zap } from "lucide-react";
import { toast } from "sonner";
import { trackShipment, listShipments } from "@/services/shipments";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RiskPieChart } from "@/components/dashboard/RiskPieChart";
import { ShipmentsBarChart } from "@/components/dashboard/ShipmentsBarChart";
import { RouteMap } from "@/components/dashboard/RouteMap";
import { ShipmentCard } from "@/components/dashboard/ShipmentCard";
import { TrackingPanel } from "@/components/tracking/TrackingPanel";
import type { Shipment } from "@/types";

export default function Dashboard() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [latest, setLatest] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    listShipments()
      .then((data) => {
        setShipments(data);
        if (data.length > 0) setLatest(data[0]);
      })
      .finally(() => setInitialLoading(false));
  }, []);

  const handleTrack = useCallback(async (source: string, destination: string) => {
    setLoading(true);
    setError(null);
    try {
      const s = await trackShipment(source, destination);
      setLatest(s);
      setShipments((prev) => [s, ...prev]);
      toast.success("Shipment tracked successfully!", {
        description: `${s.source.split(",")[0]} → ${s.destination.split(",")[0]} · ${s.risk} Risk`,
      });
    } catch (e: any) {
      const msg = e?.message ?? "Failed to track shipment.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col xl:flex-row gap-6 p-4 lg:p-6 min-w-0">
      {/* Main */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Header */}
        <header className="flex items-start justify-between gap-4 flex-wrap pt-2 lg:pt-0">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold flex items-center gap-3">
              <Zap className="size-7 text-neon-cyan" />
              <span className="gradient-text">SmartChain Dashboard</span>
            </h1>
            <p className="text-text-secondary text-sm mt-1 ml-10">
              AI-Powered Predictive Logistics Intelligence
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-xl glass-card hover:bg-white/[0.06] transition">
              <Bell className="size-5 text-text-secondary" />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-risk-high pulse-dot" />
            </button>
            <div className="size-10 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#06b6d4] flex items-center justify-center font-semibold text-white text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              SC
            </div>
          </div>
        </header>

        {/* Stats */}
        {initialLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-5">
                <div className="skeleton h-4 w-24 mb-3" />
                <div className="skeleton h-8 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <StatsCards shipments={shipments} />
        )}

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <RiskPieChart shipments={shipments} />
          <ShipmentsBarChart shipments={shipments} />
        </div>

        {/* Map */}
        <RouteMap shipment={latest} />

        {/* Latest Shipment */}
        <ShipmentCard shipment={latest} />
      </div>

      {/* Tracking Panel */}
      <TrackingPanel loading={loading} error={error} onTrack={handleTrack} />
    </div>
  );
}
