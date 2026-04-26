import { useEffect, useMemo, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import type { Shipment } from "@/types";

// Fix default icon paths for bundlers
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

/* ── Custom Markers ──────────────────────────────────────────── */
const sourceIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
    background:linear-gradient(135deg,#10b981,#059669);border:3px solid white;
    box-shadow:0 0 20px #10b981aa,0 4px 12px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const destIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
    background:linear-gradient(135deg,#ef4444,#dc2626);border:3px solid white;
    box-shadow:0 0 20px #ef4444aa,0 4px 12px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const truckIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:42px;height:42px;display:flex;align-items:center;justify-content:center;
    background:linear-gradient(135deg,#8b5cf6,#06b6d4);border-radius:50%;
    border:3px solid white;box-shadow:0 0 28px rgba(139,92,246,0.5),0 4px 16px rgba(0,0,0,0.4);
    font-size:20px;
  ">🚚</div>`,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

/* ── Risk → polyline color ───────────────────────────────────── */
const RISK_COLORS: Record<string, string> = {
  Low: "#10b981",
  Medium: "#f59e0b",
  High: "#ef4444",
};

/* ── Auto-fit bounds ─────────────────────────────────────────── */
function FitBounds({ shipment }: { shipment: Shipment }) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds(
      [shipment.source_lat, shipment.source_lng],
      [shipment.dest_lat, shipment.dest_lng],
    );
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [shipment, map]);
  return null;
}

/* ── Main Component ──────────────────────────────────────────── */
interface Props {
  shipment: Shipment | null;
}

export function RouteMap({ shipment }: Props) {
  const [route, setRoute] = useState<[number, number][]>([]);
  const [progress, setProgress] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  /* Straight-line fallback */
  const straight = useMemo<[number, number][]>(() => {
    if (!shipment) return [];
    return [
      [shipment.source_lat, shipment.source_lng],
      [shipment.dest_lat, shipment.dest_lng],
    ];
  }, [shipment]);

  /* Fetch OSRM road route */
  useEffect(() => {
    if (!shipment) { setRoute([]); return; }
    let cancelled = false;
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${shipment.source_lng},${shipment.source_lat};${shipment.dest_lng},${shipment.dest_lat}` +
      `?overview=full&geometries=geojson`;
    fetch(url, { signal: AbortSignal.timeout(8000) })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelled || !json?.routes?.[0]?.geometry?.coordinates) return;
        const coords = json.routes[0].geometry.coordinates as [number, number][];
        setRoute(coords.map(([lng, lat]) => [lat, lng]));
      })
      .catch(() => { /* fallback to straight line */ });
    return () => { cancelled = true; };
  }, [shipment]);

  /* Animated truck */
  const positions = route.length > 0 ? route : straight;
  useEffect(() => {
    if (!shipment || positions.length < 2) return;
    setProgress(0);
    let raf: number;
    let start: number | null = null;
    const duration = 14000;
    const tick = (t: number) => {
      if (start === null) start = t;
      setProgress(((t - start) % duration) / duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shipment, positions.length]);

  const truckPos = useMemo<[number, number] | null>(() => {
    if (positions.length < 2) return null;
    const dists: number[] = [0];
    for (let i = 1; i < positions.length; i++) {
      const [lat1, lng1] = positions[i - 1];
      const [lat2, lng2] = positions[i];
      dists.push(dists[i - 1] + Math.hypot(lat2 - lat1, lng2 - lng1));
    }
    const total = dists[dists.length - 1];
    if (total === 0) return positions[0];
    const target = progress * total;
    let i = 1;
    while (i < dists.length && dists[i] < target) i++;
    if (i >= positions.length) return positions[positions.length - 1];
    const frac = (target - dists[i - 1]) / (dists[i] - dists[i - 1] || 1);
    const [lat1, lng1] = positions[i - 1];
    const [lat2, lng2] = positions[i];
    return [lat1 + (lat2 - lat1) * frac, lng1 + (lng2 - lng1) * frac];
  }, [positions, progress]);

  const color = shipment ? (RISK_COLORS[shipment.risk] ?? RISK_COLORS.Low) : RISK_COLORS.Low;

  /* Scrub leftover _leaflet_id from prior mounts */
  useEffect(() => {
    if (!wrapperRef.current) return;
    wrapperRef.current.querySelectorAll<HTMLElement>(".leaflet-container").forEach((el) => {
      if ((el as any)._leaflet_id) delete (el as any)._leaflet_id;
    });
  }, []);

  return (
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="font-display text-base font-semibold">Live Route Map</h3>
        <div className="flex items-center gap-4 text-xs text-text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-risk-high shadow-[0_0_6px_#ef444480]" />
            High
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-risk-medium shadow-[0_0_6px_#f59e0b80]" />
            Medium
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-risk-low shadow-[0_0_6px_#10b98180]" />
            Low
          </span>
        </div>
      </div>
      <div ref={wrapperRef}>
        <MapContainer
          center={[22.5, 80]}
          zoom={5}
          scrollWheelZoom={false}
          className="w-full h-[380px] lg:h-[420px] rounded-xl overflow-hidden"
        >
          {/* CartoDB Positron — free, no API key, clean light Google Maps-like look */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org">OSM</a> &copy; <a href="https://carto.com">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={20}
          />
          {shipment && (
            <>
              <Marker position={[shipment.source_lat, shipment.source_lng]} icon={sourceIcon} />
              <Marker position={[shipment.dest_lat, shipment.dest_lng]} icon={destIcon} />
              <Polyline positions={positions} pathOptions={{ color, weight: 4, opacity: 0.85 }} />
              {truckPos && <Marker position={truckPos} icon={truckIcon} />}
              <FitBounds shipment={shipment} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
