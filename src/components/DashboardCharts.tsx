import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const RISK_COLORS = {
  High: "oklch(0.65 0.24 25)",
  Medium: "oklch(0.78 0.17 75)",
  Low: "oklch(0.72 0.18 145)",
} as const;

interface Shipment {
  risk: string;
  created_at: string;
}

export function RiskDistribution({ shipments }: { shipments: Shipment[] }) {
  const counts = { High: 0, Medium: 0, Low: 0 };
  shipments.forEach((s) => {
    if (s.risk in counts) counts[s.risk as keyof typeof counts]++;
  });
  const total = shipments.length || 1;
  const data = [
    { name: "High Risk", value: counts.High, color: RISK_COLORS.High },
    { name: "Medium Risk", value: counts.Medium, color: RISK_COLORS.Medium },
    { name: "Low Risk", value: counts.Low, color: RISK_COLORS.Low },
  ];

  const empty = shipments.length === 0;
  const display = empty
    ? [
        { name: "High Risk", value: 45, color: RISK_COLORS.High },
        { name: "Medium Risk", value: 30, color: RISK_COLORS.Medium },
        { name: "Low Risk", value: 25, color: RISK_COLORS.Low },
      ]
    : data;

  return (
    <div className="flex items-center gap-6">
      <div className="w-[180px] h-[180px] shrink-0">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={display}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={80}
              stroke="none"
              paddingAngle={2}
            >
              {display.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="space-y-3 flex-1">
        {display.map((d) => {
          const pct = empty
            ? d.value
            : Math.round((d.value / total) * 100);
          return (
            <li key={d.name} className="flex items-center gap-3">
              <span
                className="size-3 rounded-full shrink-0"
                style={{ backgroundColor: d.color }}
              />
              <span className="flex-1 text-sm text-foreground/85">{d.name}</span>
              <span className="text-sm font-semibold tabular-nums">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ShipmentsOverview({ shipments }: { shipments: Shipment[] }) {
  // Group by day-of-week (Mon-Sun)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const counts = days.map((d) => ({ day: d, shipments: 0 }));
  shipments.forEach((s) => {
    const d = new Date(s.created_at).getDay(); // 0=Sun
    const idx = d === 0 ? 6 : d - 1;
    counts[idx].shipments++;
  });

  const empty = shipments.length === 0;
  const display = empty
    ? [
        { day: "Mon", shipments: 18 },
        { day: "Tue", shipments: 24 },
        { day: "Wed", shipments: 42 },
        { day: "Thu", shipments: 36 },
        { day: "Fri", shipments: 52 },
        { day: "Sat", shipments: 38 },
        { day: "Sun", shipments: 21 },
      ]
    : counts;

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer>
        <BarChart data={display} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.78 0.18 285)" />
              <stop offset="100%" stopColor="oklch(0.55 0.20 280)" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" vertical={false} />
          <XAxis dataKey="day" stroke="oklch(0.7 0.04 280)" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis stroke="oklch(0.7 0.04 280)" tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip
            cursor={{ fill: "oklch(1 0 0 / 5%)" }}
            contentStyle={{
              background: "oklch(0.22 0.06 280 / 95%)",
              border: "1px solid oklch(1 0 0 / 12%)",
              borderRadius: 12,
              color: "oklch(0.97 0.01 280)",
            }}
          />
          <Bar dataKey="shipments" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
