import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import type { Shipment } from "@/types";

interface Props {
  shipments: Shipment[];
}

export function ShipmentsBarChart({ shipments }: Props) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const counts = days.map((d) => ({ day: d, shipments: 0 }));
  shipments.forEach((s) => {
    const d = new Date(s.created_at).getDay();
    const idx = d === 0 ? 6 : d - 1;
    counts[idx].shipments++;
  });

  const empty = shipments.length === 0;
  const display = empty
    ? [
        { day: "Mon", shipments: 14 },
        { day: "Tue", shipments: 22 },
        { day: "Wed", shipments: 38 },
        { day: "Thu", shipments: 30 },
        { day: "Fri", shipments: 48 },
        { day: "Sat", shipments: 34 },
        { day: "Sun", shipments: 18 },
      ]
    : counts;

  return (
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.15s" }}>
      <h3 className="font-display text-base font-semibold mb-1">Shipments Overview</h3>
      <p className="text-xs text-text-muted mb-4">Shipments by day of week</p>
      <div className="h-[180px] w-full">
        <ResponsiveContainer>
          <BarChart data={display} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              contentStyle={{
                background: "rgba(18,16,27,0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                color: "#f1f5f9",
                fontSize: 13,
              }}
            />
            <Bar dataKey="shipments" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {empty && (
        <p className="text-xs text-text-muted mt-2 text-center">
          Sample data — track shipments to populate
        </p>
      )}
    </div>
  );
}
