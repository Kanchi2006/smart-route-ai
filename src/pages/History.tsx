import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { History as HistoryIcon, ArrowLeft, Search, X } from "lucide-react";
import { listShipments } from "@/services/shipments";
import type { Shipment } from "@/types";

const RISK_BADGE: Record<string, string> = {
  High: "badge-high", Medium: "badge-medium", Low: "badge-low",
};

export default function History() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    listShipments(100).then(setShipments).finally(() => setLoading(false));
  }, []);

  const filtered = shipments.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.source.toLowerCase().includes(q) ||
      s.destination.toLowerCase().includes(q) ||
      s.risk.toLowerCase().includes(q) ||
      s.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-2 lg:pt-0">
        <div className="flex items-center gap-3">
          <HistoryIcon className="size-7 text-neon-purple" />
          <div>
            <h1 className="font-display text-2xl font-bold">Shipment History</h1>
            <p className="text-sm text-text-muted">{shipments.length} total shipments</p>
          </div>
        </div>
        <Link to="/" className="btn-primary text-sm flex items-center gap-2 py-2.5 px-4">
          <ArrowLeft className="size-4" /> Dashboard
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search shipments…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10 pr-10"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden animate-fade-in">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="p-10 text-center text-text-muted">
            {search ? "No matching shipments found." : "No shipments yet. Track one from the dashboard."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-left">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Route</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Distance</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Weather</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Traffic</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Risk</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Status</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.03] transition"
                  >
                    <td className="px-5 py-3.5 font-medium whitespace-nowrap">
                      {s.source.split(",")[0]}
                      <span className="text-neon-purple mx-1.5">→</span>
                      {s.destination.split(",")[0]}
                    </td>
                    <td className="px-5 py-3.5 text-text-secondary">{s.distance_km.toLocaleString()} km</td>
                    <td className="px-5 py-3.5 text-text-secondary">{s.weather}</td>
                    <td className="px-5 py-3.5 text-text-secondary">{s.traffic}</td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${RISK_BADGE[s.risk] ?? "badge-low"}`}>
                        {s.risk}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={s.status === "Delayed" ? "text-risk-medium font-medium" : "text-risk-low font-medium"}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-text-muted whitespace-nowrap">
                      {new Date(s.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
