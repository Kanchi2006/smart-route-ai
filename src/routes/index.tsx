import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, Rocket } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { ShipmentMapLazy as ShipmentMap } from "@/components/ShipmentMapLazy";
import { RiskDistribution, ShipmentsOverview } from "@/components/DashboardCharts";
import { LatestShipmentCard, type Shipment } from "@/components/LatestShipmentCard";
import { TrackingPanel } from "@/components/TrackingPanel";
import { trackShipment, listShipments } from "@/utils/track.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartChain AI — Predictive Logistics Intelligence" },
      {
        name: "description",
        content:
          "AI-powered logistics dashboard that predicts shipment risk and explains why — using Google Gemini + live weather and traffic data.",
      },
      { property: "og:title", content: "SmartChain AI Dashboard" },
      {
        property: "og:description",
        content: "Predictive AI-driven logistics intelligence for smarter deliveries.",
      },
    ],
  }),
  loader: async () => listShipments(),
  component: Dashboard,
});

function Dashboard() {
  const initial = Route.useLoaderData();
  const [shipments, setShipments] = useState<Shipment[]>(
    (initial?.shipments ?? []) as Shipment[],
  );
  const [latest, setLatest] = useState<Shipment | null>(
    (initial?.shipments?.[0] as Shipment) ?? null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial?.shipments?.[0]) setLatest(initial.shipments[0] as Shipment);
  }, [initial]);

  const handleTrack = async (source: string, destination: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await trackShipment({ data: { source, destination } });
      const s = res.shipment as Shipment;
      setLatest(s);
      setShipments((prev) => [s, ...prev]);
    } catch (e: any) {
      setError(e?.message ?? "Failed to track shipment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />

      <div className="flex-1 flex flex-col xl:flex-row gap-6 p-4 lg:p-6 min-w-0">
        <main className="flex-1 min-w-0 space-y-6">
          {/* Header */}
          <header className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold flex items-center gap-3">
                <Rocket className="size-8 text-accent" />
                <span className="bg-clip-text text-transparent bg-[image:var(--gradient-primary)]">
                  SmartChain Dashboard
                </span>
              </h1>
              <p className="text-muted-foreground mt-1">
                AI-Powered Logistics Intelligence for Smarter Deliveries
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2.5 rounded-xl glass-card hover:bg-primary/10 transition">
                <Bell className="size-5" />
                <span className="absolute top-2 right-2 size-2 rounded-full bg-risk-high" />
              </button>
              <div className="size-11 rounded-full bg-[image:var(--gradient-primary)] flex items-center justify-center font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
                SC
              </div>
            </div>
          </header>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <section className="glass-card p-6">
              <h3 className="font-display text-lg font-semibold mb-4">Risk Distribution</h3>
              <RiskDistribution shipments={shipments} />
            </section>
            <section className="glass-card p-6">
              <h3 className="font-display text-lg font-semibold mb-2">Shipments Overview</h3>
              <p className="text-xs text-muted-foreground mb-2">Shipments by day</p>
              <ShipmentsOverview shipments={shipments} />
            </section>
          </div>

          {/* Map */}
          <section className="glass-card p-6">
            <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
              <h3 className="font-display text-lg font-semibold">Live Shipment Route</h3>
              <div className="glass-card !shadow-none px-4 py-2.5 text-sm">
                <div className="font-semibold mb-1.5">Risk Level</div>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-risk-high" /> High Risk
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-risk-medium" /> Medium Risk
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-risk-low" /> Low Risk
                  </li>
                </ul>
              </div>
            </div>
            <ShipmentMap shipment={latest} />
          </section>

          {/* Latest shipment */}
          <LatestShipmentCard shipment={latest} />
        </main>

        <TrackingPanel loading={loading} error={error} onTrack={handleTrack} />
      </div>
    </div>
  );
}
