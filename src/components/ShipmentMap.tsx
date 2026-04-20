import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

// Fix default icon path issue with bundlers
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const greenIcon = L.divIcon({
  className: "",
  html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:oklch(0.72 0.18 145);border:3px solid white;box-shadow:0 0 16px oklch(0.72 0.18 145);"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
});

const redIcon = L.divIcon({
  className: "",
  html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:oklch(0.65 0.24 25);border:3px solid white;box-shadow:0 0 16px oklch(0.65 0.24 25);"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
});

interface ShipmentPoint {
  source_lat: number;
  source_lng: number;
  dest_lat: number;
  dest_lng: number;
  source: string;
  destination: string;
  risk: string;
}

interface Props {
  shipment: ShipmentPoint | null;
}

const RISK_COLORS: Record<string, string> = {
  Low: "oklch(0.72 0.18 145)",
  Medium: "oklch(0.78 0.17 75)",
  High: "oklch(0.65 0.24 25)",
};

function FitBounds({ shipment }: { shipment: ShipmentPoint | null }) {
  const map = useMap();
  useEffect(() => {
    if (!shipment) return;
    const bounds = L.latLngBounds(
      [shipment.source_lat, shipment.source_lng],
      [shipment.dest_lat, shipment.dest_lng],
    );
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [shipment, map]);
  return null;
}

export default function ShipmentMap({ shipment }: Props) {
  const straight = useMemo<[number, number][]>(() => {
    if (!shipment) return [];
    return [
      [shipment.source_lat, shipment.source_lng],
      [shipment.dest_lat, shipment.dest_lng],
    ];
  }, [shipment]);

  const [route, setRoute] = useState<[number, number][]>([]);

  useEffect(() => {
    if (!shipment) {
      setRoute([]);
      return;
    }
    let cancelled = false;
    const url = `https://router.project-osrm.org/route/v1/driving/${shipment.source_lng},${shipment.source_lat};${shipment.dest_lng},${shipment.dest_lat}?overview=full&geometries=geojson`;
    fetch(url, { signal: AbortSignal.timeout(8000) })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelled || !json?.routes?.[0]?.geometry?.coordinates) return;
        const coords = json.routes[0].geometry.coordinates as [number, number][];
        setRoute(coords.map(([lng, lat]) => [lat, lng] as [number, number]));
      })
      .catch((e) => console.warn("OSRM route fetch failed, using straight line", e));
    return () => {
      cancelled = true;
    };
  }, [shipment]);

  const positions = route.length > 0 ? route : straight;
  const color = shipment ? RISK_COLORS[shipment.risk] ?? RISK_COLORS.Low : RISK_COLORS.Low;

  return (
    <MapContainer
      center={[22.5, 80]}
      zoom={5}
      scrollWheelZoom={false}
      className="w-full h-[420px] rounded-xl overflow-hidden"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {shipment && (
        <>
          <Marker position={[shipment.source_lat, shipment.source_lng]} icon={greenIcon} />
          <Marker position={[shipment.dest_lat, shipment.dest_lng]} icon={redIcon} />
          <Polyline positions={positions} pathOptions={{ color, weight: 5, opacity: 0.9 }} />
          <FitBounds shipment={shipment} />
        </>
      )}
    </MapContainer>
  );
}
