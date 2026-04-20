import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import { listShipments } from "@/utils/track.functions";
import type { Shipment } from "@/components/LatestShipmentCard";

export const Route = createFileRoute("/history")({
  loader: () => listShipments(),
  component: HistoryPage,
});

function HistoryPage() {
  const { shipments } = Route.useLoaderData() as { shipments: Shipment[] };
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Shipment History</h1>
          <Link to="/" className="cta-gradient px-4 py-2 rounded-xl font-semibold text-accent-foreground text-sm">
            Back to Dashboard
          </Link>
        </div>

        <div className="glass-card overflow-hidden">
          {shipments.length === 0 ? (
            <p className="p-10 text-center text-muted-foreground">
              No shipments yet. Track one from the dashboard.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-primary/10 text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Route</th>
                    <th className="px-4 py-3 font-semibold">Distance</th>
                    <th className="px-4 py-3 font-semibold">Weather</th>
                    <th className="px-4 py-3 font-semibold">Traffic</th>
                    <th className="px-4 py-3 font-semibold">Risk</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">When</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((s) => (
                    <tr key={s.id} className="border-t border-glass-border hover:bg-primary/5">
                      <td className="px-4 py-3">
                        {s.source.split(",")[0]} → {s.destination.split(",")[0]}
                      </td>
                      <td className="px-4 py-3">{s.distance_km} km</td>
                      <td className="px-4 py-3">{s.weather}</td>
                      <td className="px-4 py-3">{s.traffic}</td>
                      <td className={`px-4 py-3 font-semibold text-risk-${s.risk.toLowerCase()}`}>
                        {s.risk}
                      </td>
                      <td className="px-4 py-3">{s.status}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(s.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
