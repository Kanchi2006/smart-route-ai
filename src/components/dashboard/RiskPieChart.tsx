import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from "recharts";
import type { Shipment } from "@/types";

const COLORS = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#10b981",
} as const;

interface Props {
  shipments: Shipment[];
}

export function RiskPieChart({ shipments }: Props) {
  const counts = { High: 0, Medium: 0, Low: 0 };
  shipments.forEach((s) => {
    if (s.risk in counts) counts[s.risk as keyof typeof counts]++;
  });
  const total = shipments.length || 1;

  const empty = shipments.length === 0;
  const data = empty
    ? [
        { name: "High Risk", value: 40, color: COLORS.High },
        { name: "Medium Risk", value: 35, color: COLORS.Medium },
        { name: "Low Risk", value: 25, color: COLORS.Low },
      ]
    : [
        { name: "High Risk", value: counts.High, color: COLORS.High },
        { name: "Medium Risk", value: counts.Medium, color: COLORS.Medium },
        { name: "Low Risk", value: counts.Low, color: COLORS.Low },
      ];

  return (
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <h3 className="font-display text-base font-semibold mb-5">Risk Distribution</h3>
      <div className="flex items-center gap-6">
        <div className="w-[160px] h-[160px] shrink-0">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={72}
                stroke="none"
                paddingAngle={3}
              >
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(18,16,27,0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  color: "#f1f5f9",
                  fontSize: 13,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="space-y-3 flex-1">
          {data.map((d) => {
            const pct = empty ? d.value : Math.round((d.value / total) * 100);
            return (
              <li key={d.name} className="flex items-center gap-3">
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: d.color, boxShadow: `0 0 8px ${d.color}60` }}
                />
                <span className="flex-1 text-sm text-text-secondary">{d.name}</span>
                <span className="text-sm font-semibold tabular-nums">{pct}%</span>
              </li>
            );
          })}
        </ul>
      </div>
      {empty && (
        <p className="text-xs text-text-muted mt-3 text-center">
          Sample data — track a shipment to see real stats
        </p>
      )}
    </div>
  );
}
